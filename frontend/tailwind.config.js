/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class', // toggled by useTheme — adds/removes 'dark' class on <html>
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        accent: '#06b6d4',
        node: {
          input:   '#6366f1',
          output:  '#10b981',
          llm:     '#f59e0b',
          text:    '#3b82f6',
          api:     '#ec4899',
          webhook: '#8b5cf6',
          delay:   '#f97316',
          loop:    '#14b8a6',
          math:    '#84cc16',
          filter:  '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        node:         '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'node-hover': '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'node-sel':   '0 0 0 2px #6366f1, 0 10px 25px -5px rgba(99,102,241,0.25)',
        modal:        '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
      keyframes: {
        dashFlow: {
          from: { strokeDashoffset: '10' },
          to:   { strokeDashoffset: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease forwards',
        'slide-up': 'slide-up 0.2s ease forwards',
        spinner:    'spin 0.8s linear infinite',
        'toast-in': 'toast-in 0.25s ease forwards',
      },
    },
  },
  plugins: [],
};
