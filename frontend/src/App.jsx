// App.jsx — responsive root layout

import React from 'react';
import { Toolbar }        from './components/ui/Toolbar';
import { Canvas }         from './components/ui/Canvas';
import { SubmitButton }   from './components/ui/SubmitButton';
import { PipelineModal }  from './components/ui/PipelineModal';
import { ToastProvider }  from './components/ui/Toast';
import { usePipeline }    from './hooks/usePipeline';
import { useStore }       from './store';
import { useTheme }       from './hooks/useTheme';
import { useResponsive }  from './hooks/useResponsive';
import './index.css';

function PipelineEditor() {
  useTheme(); // applies dark class to <html>
  const { submit, result, error, loading, open, closeModal } = usePipeline();
  const nodeCount    = useStore((s) => s.nodes.length);
  const { isMobile } = useResponsive();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#0d1117]">
      {/* Sidebar — desktop/tablet: left rail | mobile: FAB + bottom sheet (inside Toolbar) */}
      <Toolbar />

      {/* Main canvas area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile top bar — brand + node count */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700/80 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
                <span className="text-[10px] font-bold">VS</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">VectorShift</span>
            </div>
            {nodeCount > 0 && (
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                {nodeCount} node{nodeCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
        <Canvas />
      </div>

      <SubmitButton onClick={submit} loading={loading} nodeCount={nodeCount} />
      <PipelineModal open={open} onClose={closeModal} result={result} error={error} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PipelineEditor />
    </ToastProvider>
  );
}
