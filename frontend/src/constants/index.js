// constants/index.js

export const GRID_SIZE = 20;

// Only valid JS identifiers: starts with letter/_ /$, followed by word chars
export const VARIABLE_REGEX = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;

export const FIELD_TYPES = {
  TEXT:     'text',
  TEXTAREA: 'textarea',
  SELECT:   'select',
  NUMBER:   'number',
};

// Hard hex values — used in node configs (no CSS vars needed with Tailwind)
export const NODE_COLORS = {
  customInput:  '#6366f1',
  customOutput: '#10b981',
  llm:          '#f59e0b',
  text:         '#3b82f6',
  apiRequest:   '#ec4899',
  webhook:      '#8b5cf6',
  delay:        '#f97316',
  loop:         '#14b8a6',
  math:         '#84cc16',
  filter:       '#ef4444',
};

export const CATEGORY_COLORS = {
  IO:        '#6366f1',
  AI:        '#f59e0b',
  Data:      '#ec4899',
  Logic:     '#ef4444',
  Transform: '#84cc16',
  Utility:   '#f97316',
};

export const API_BASE_URL = 'http://localhost:8000';
