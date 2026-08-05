// hooks/usePipeline.js — submit pipeline, manage loading/result/error state
import { useState, useCallback } from 'react';
import { useStore } from '../store';
import { API_BASE_URL } from '../constants';

export function usePipeline() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [open,    setOpen]    = useState(false);

  const submit = useCallback(async () => {
    if (nodes.length === 0) {
      setError({ type: 'empty', message: 'Add at least one node before submitting.' });
      setOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();

      if (
        typeof data.num_nodes !== 'number' ||
        typeof data.num_edges !== 'number' ||
        typeof data.is_dag   !== 'boolean'
      ) {
        throw new Error('Unexpected response shape from server.');
      }

      setResult(data);
    } catch (err) {
      setError({ type: 'network', message: err.message || 'Could not reach backend.' });
    } finally {
      setLoading(false);
      setOpen(true);
    }
  }, [nodes, edges]);

  const closeModal = useCallback(() => setOpen(false), []);

  return { submit, result, error, loading, open, closeModal };
}
