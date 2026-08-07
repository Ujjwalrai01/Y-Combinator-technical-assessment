// Canvas.jsx — ReactFlow canvas, fully responsive, fit-view button, keyboard shortcuts

import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import ReactFlow, {
  Controls, Background, MiniMap,
  BackgroundVariant, ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import { Maximize2 } from 'lucide-react';
import { useStore }      from '../../store';
import { nodeTypes }     from '../nodes';
import { GRID_SIZE, NODE_COLORS } from '../../constants';
import { EmptyCanvas }   from './EmptyCanvas';
import { useResponsive } from '../../hooks/useResponsive';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

const selector = (s) => ({
  nodes: s.nodes, edges: s.edges,
  getNodeID: s.getNodeID, addNode: s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
  undo: s.undo, redo: s.redo,
});

// Inner — has access to useReactFlow() because it's mounted inside ReactFlowProvider
function InnerCanvas({ wrapperRef }) {
  const {
    nodes, edges,
    getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    undo, redo,
  } = useStore(selector);

  const { fitView } = useReactFlow();
  const [rfi, setRfi] = useState(null);
  const { isMobile }  = useResponsive();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if (e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/reactflow');
    if (!raw || !rfi) return;
    const { nodeType } = JSON.parse(raw);
    if (!nodeType) return;

    const bounds   = wrapperRef.current.getBoundingClientRect();
    const position = rfi.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    const id       = getNodeID(nodeType);
    addNode({ id, type: nodeType, position, data: { id, nodeType } });
  }, [rfi, getNodeID, addNode, wrapperRef]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <>
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
        minZoom={0.1}
        maxZoom={2.5}
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={GRID_SIZE}
          size={1}
          color="#94a3b8"
          style={{ opacity: 0.3 }}
        />
        {!isMobile && (
          <>
            <Controls style={{ bottom: 80, left: 16 }} />
            <MiniMap
              style={{ bottom: 16, right: 16 }}
              nodeColor={(n) => NODE_COLORS[n.type] || '#6366f1'}
              maskColor="rgba(248,250,252,0.7)"
            />
          </>
        )}
        {isMobile && <Controls showInteractive={false} style={{ bottom: 80, left: 8 }} />}
      </ReactFlow>

      {/* Fit-view button */}
      <button
        onClick={() => fitView({ padding: 0.2, duration: 400 })}
        title="Fit view (show all nodes)"
        className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
                   bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700
                   rounded-lg text-slate-500 dark:text-slate-400
                   hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400
                   backdrop-blur-sm shadow-sm transition-all duration-150"
      >
        <Maximize2 size={14} strokeWidth={2} />
      </button>
    </>
  );
}

export const Canvas = memo(() => {
  const wrapperRef = useRef(null);
  const nodes      = useStore((s) => s.nodes);

  return (
    <div ref={wrapperRef} className="relative flex-1 h-full min-w-0">
      {nodes.length === 0 && <EmptyCanvas />}
      <ReactFlowProvider>
        <InnerCanvas wrapperRef={wrapperRef} />
      </ReactFlowProvider>
    </div>
  );
});
Canvas.displayName = 'Canvas';
