// hooks/useVariableParser.js — extracts valid {{variable}} tokens, memoized
import { useMemo } from 'react';
import { VARIABLE_REGEX } from '../constants';

export function useVariableParser(text) {
  return useMemo(() => {
    if (!text) return [];
    const found = new Set();
    const re = new RegExp(VARIABLE_REGEX.source, 'g');
    let m;
    while ((m = re.exec(text)) !== null) found.add(m[1]);
    return Array.from(found);
  }, [text]);
}
