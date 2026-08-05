// App.jsx — root layout. ToastProvider wraps everything; theme applied at top level.

import React from 'react';
import { Toolbar }        from './components/ui/Toolbar';
import { Canvas }         from './components/ui/Canvas';
import { SubmitButton }   from './components/ui/SubmitButton';
import { PipelineModal }  from './components/ui/PipelineModal';
import { ToastProvider }  from './components/ui/Toast';
import { usePipeline }    from './hooks/usePipeline';
import { useStore }       from './store';
import { useTheme }       from './hooks/useTheme';
import './index.css';

// Separate component so hooks are called inside the provider tree
function PipelineEditor() {
  // useTheme must run inside the component tree so the effect fires on mount
  useTheme();

  const { submit, result, error, loading, open, closeModal } = usePipeline();
  const nodeCount = useStore((s) => s.nodes.length);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#0d1117]">
      <Toolbar />
      <Canvas />
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
