"""
VectorShift Pipeline Parser — FastAPI backend

POST /pipelines/parse
  Accepts { nodes, edges }, returns { num_nodes, num_edges, is_dag }
  DAG detection: Kahn's Algorithm — O(V + E) time and space
"""

from collections import deque
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="VectorShift Pipeline API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineRequest(BaseModel):
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag:    bool


def is_dag(node_ids: list[str], edges: list[dict]) -> bool:
    """Kahn's Algorithm: returns True if the graph has no directed cycles."""
    if not node_ids:
        return True

    node_set = set(node_ids)
    adjacency: dict[str, list[str]] = {n: [] for n in node_set}
    in_degree: dict[str, int]       = {n: 0  for n in node_set}

    for edge in edges:
        src, tgt = edge.get("source", ""), edge.get("target", "")
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


@app.get("/")
def health_check():
    return {"status": "ok", "service": "VectorShift Pipeline API"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(payload: PipelineRequest) -> PipelineResponse:
    node_ids = [n["id"] for n in payload.nodes if "id" in n]
    return PipelineResponse(
        num_nodes=len(node_ids),
        num_edges=len(payload.edges),
        is_dag=is_dag(node_ids, payload.edges),
    )
