// Canvas.jsx — React Flow canvas: handles drop, keyboard shortcuts, empty state

import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant } from 'reactflow';
import { useStore }    from '../../store';
import { nodeTypes }   from '../nodes';
import { GRID_SIZE, NODE_COLORS } from '../../constants';
import { EmptyCanvas } from './EmptyCanvas';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

const selector = (s) => ({
  nodes: s.nodes, edges: s.edges,
  getNodeID: s.getNodeID, addNode: s.addNode,
  onNodesChange: s.onNodesChange, onEdgesChange: s.onEdgesChange, onConnect: s.onConnect,
  undo: s.undo, redo: s.redo,
});

export const Canvas = memo(() => {
  const wrapperRef  = useRef(null);
  const [rfi, setRfi] = useState(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect, undo, redo } = useStore(selector);

  // Ctrl+Z / Ctrl+Shift+Z
  useEffect(() => {
    const handler = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== 'z') return;
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/reactflow');
    if (!raw) return;
    const { nodeType } = JSON.parse(raw);
    if (!nodeType) return;

    const bounds   = wrapperRef.current.getBoundingClientRect();
    // ReactFlow v11 uses project(), v12+ uses screenToFlowPosition()
    const position = rfi.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    const id       = getNodeID(nodeType);
    addNode({ id, type: nodeType, position, data: { id, nodeType } });
  }, [rfi, getNodeID, addNode]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex-1 h-full">
      {nodes.length === 0 && <EmptyCanvas />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfi}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        snapToGrid
        connectionLineType="smoothstep"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={2.5}
        deleteKeyCode="Delete"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={GRID_SIZE}
          size={1}
          color="#94a3b8"
          style={{ opacity: 0.3 }}
        />
        <Controls style={{ bottom: 80, left: 16 }} />
        <MiniMap
          style={{ bottom: 16, right: 16 }}
          nodeColor={(n) => NODE_COLORS[n.type] || '#6366f1'}
          maskColor="rgba(248,250,252,0.7)"
        />
      </ReactFlow>
    </div>
  );
});
Canvas.displayName = 'Canvas';
