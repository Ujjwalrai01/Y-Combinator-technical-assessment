// hooks/useAutoResize.js — auto-growing textarea
import { useCallback, useRef } from 'react';

const MIN_H = 60;
const MAX_H = 320;

export function useAutoResize() {
  const ref = useRef(null);

  const onInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = `${MIN_H}px`;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_H), MAX_H)}px`;
  }, []);

  return { ref, onInput };
}
