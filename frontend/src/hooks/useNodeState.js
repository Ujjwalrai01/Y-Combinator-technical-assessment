// hooks/useNodeState.jsx — syncs node local state → Zustand store
import { useState, useCallback } from 'react';
import { useStore } from '../store';

export function useNodeState(nodeId, initial) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [fields, setFields] = useState(initial);

  const setField = useCallback(
    (name, value) => {
      setFields((prev) => ({ ...prev, [name]: value }));
      updateNodeField(nodeId, name, value);
    },
    [nodeId, updateNodeField]
  );

  return { fields, setField };
}
