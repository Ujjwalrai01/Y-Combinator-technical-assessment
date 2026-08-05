// hooks/useTheme.js — dark/light toggle via class on <html>, persisted to localStorage
import { useState, useEffect, useCallback } from 'react';

const KEY   = 'vs-theme';
const DARK  = 'dark';
const LIGHT = 'light';

function getInitial() {
  const stored = localStorage.getItem(KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    // Tailwind dark mode uses the 'dark' class on <html>
    document.documentElement.classList.toggle('dark', theme === DARK);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === DARK ? LIGHT : DARK)), []);

  return { theme, toggle, isDark: theme === DARK };
}
