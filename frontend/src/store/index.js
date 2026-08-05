// store/index.js — Zustand v4 store with undo/redo, import/export

import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

const HISTORY_LIMIT = 50;

const snap = (nodes, edges) => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
});

export const useStore = create((set, get) => ({
  nodes:   [],
  edges:   [],
  nodeIDs: {},
  past:    [],
  future:  [],

  // Push current state onto the undo stack
  pushHistory: () => {
    const { nodes, edges, past } = get();
    set({ past: [...past, snap(nodes, edges)].slice(-HISTORY_LIMIT), future: [] });
  },

  getNodeID: (type) => {
    const ids = { ...get().nodeIDs };
    ids[type] = (ids[type] ?? 0) + 1;
    set({ nodeIDs: ids });
    return `${type}-${ids[type]}`;
  },

  addNode: (node) => {
    get().pushHistory();
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) => {
    get().pushHistory();
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          style: { strokeWidth: 2 },
        },
        state.edges
      ),
    }));
  },

  updateNodeField: (nodeId, fieldName, fieldValue) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, [fieldName]: fieldValue } } : n
      ),
    })),

  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [] });
  },

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (!past.length) return;
    const prev = past[past.length - 1];
    set({
      nodes:  prev.nodes,
      edges:  prev.edges,
      past:   past.slice(0, -1),
      future: [snap(nodes, edges), ...future].slice(0, HISTORY_LIMIT),
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      nodes:  next.nodes,
      edges:  next.edges,
      future: future.slice(1),
      past:   [...past, snap(nodes, edges)].slice(-HISTORY_LIMIT),
    });
  },

  exportPipeline: () => {
    const { nodes, edges } = get();
    const blob = new Blob(
      [JSON.stringify({ nodes, edges }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = 'pipeline.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  importPipeline: (jsonStr) => {
    try {
      const { nodes, edges } = JSON.parse(jsonStr);
      get().pushHistory();
      set({ nodes: nodes ?? [], edges: edges ?? [] });
      return true;
    } catch {
      return false;
    }
  },
}));
