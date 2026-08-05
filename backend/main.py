"""
VectorShift Pipeline Parser — FastAPI backend

Receives a pipeline (nodes + edges) from the frontend, computes:
  - num_nodes: count of unique nodes
  - num_edges: count of unique edges
  - is_dag: whether the graph is a Directed Acyclic Graph

DAG detection uses Kahn's Algorithm (BFS topological sort):
  - Build adjacency list and in-degree map
  - Process nodes with in-degree 0 using a deque
  - If all nodes are processed → no cycle → DAG
  - Time complexity: O(V + E)  Space: O(V + E)
"""

from collections import deque
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="VectorShift Pipeline API", version="1.0.0")

# Allow all origins so the React dev server can reach this API
# regardless of which port CRA assigns (3000, 3001, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response models ────────────────────────────────────────────────

class Node(BaseModel):
    id: str


class Edge(BaseModel):
    source: str
    target: str


class PipelineRequest(BaseModel):
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


# ── Graph algorithm ───────────────────────────────────────────────────────────

def is_dag_kahns(node_ids: list[str], edges: list[dict]) -> bool:
    """
    Kahn's Algorithm for DAG detection.

    Builds an adjacency list from edges, then performs a BFS-based
    topological sort. If the number of processed nodes equals the total
    node count, the graph is acyclic (DAG). A cycle causes some nodes
    to never reach in-degree 0, so the count falls short.
    """
    if not node_ids:
        return True

    # Use a set for O(1) membership check in case of duplicate ids
    node_set = set(node_ids)

    adjacency: dict[str, list[str]] = {n: [] for n in node_set}
    in_degree: dict[str, int]       = {n: 0  for n in node_set}

    for edge in edges:
        src, tgt = edge.get("source", ""), edge.get("target", "")
        # Skip self-loops and edges referencing unknown nodes
        if src == tgt or src not in node_set or tgt not in node_set:
            continue
        adjacency[src].append(tgt)
        in_degree[tgt] += 1

    queue     = deque(n for n in node_set if in_degree[n] == 0)
    processed = 0

    while queue:
        node = queue.popleft()
        processed += 1
        for neighbour in adjacency[node]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)

    return processed == len(node_set)


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "ok", "service": "VectorShift Pipeline API"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(payload: PipelineRequest) -> PipelineResponse:
    """
    Analyse a pipeline graph and return:
      - num_nodes: total node count
      - num_edges: total edge count
      - is_dag:    whether the graph contains no directed cycles
    """
    node_ids = [n["id"] for n in payload.nodes if "id" in n]
    edges    = payload.edges

    return PipelineResponse(
        num_nodes=len(node_ids),
        num_edges=len(edges),
        is_dag=is_dag_kahns(node_ids, edges),
    )
