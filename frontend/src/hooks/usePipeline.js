// hooks/usePipeline.js — submit pipeline, guard against duplicate requests

import { useState, useCallback, useRef } from 'react';
import { useStore } from '../store';
import { API_BASE_URL } from '../constants';

export function usePipeline() {
  // Read directly from the store inside submit() instead of subscribing to
  // nodes/edges as reactive values — this eliminates the stale-closure /
  // double-render problem that caused two simultaneous fetch calls.
  const getState = useStore.getState;

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [open,    setOpen]    = useState(false);

  // Ref guard — prevents a second click or double-render from firing twice
  const inFlight = useRef(false);

  const submit = useCallback(async () => {
    if (inFlight.current) return;          // already running — ignore

    // Snapshot nodes/edges at call time from the store directly
    const { nodes, edges } = getState();

    if (nodes.length === 0) {
      setError({ type: 'empty', message: 'Add at least one node before submitting.' });
      setOpen(true);
      return;
    }

    inFlight.current = true;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
        signal:  controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

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
      if (err.name === 'AbortError') {
        setError({ type: 'network', message: 'Request timed out — backend took too long to respond.' });
      } else {
        setError({ type: 'network', message: err.message || 'Could not reach the backend.' });
      }
    } finally {
      setLoading(false);
      setOpen(true);
      inFlight.current = false;
    }
  }, [getState]);                          // stable — getState never changes

  const closeModal = useCallback(() => setOpen(false), []);

  return { submit, result, error, loading, open, closeModal };
}
