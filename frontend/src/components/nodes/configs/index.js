// configs/index.js — node registry. To add a new node: create a config, import here, done.

import { inputConfig }   from './input';
import { outputConfig }  from './output';
import { llmConfig }     from './llm';
import { apiConfig }     from './api';
import { webhookConfig } from './webhook';
import { delayConfig }   from './delay';
import { loopConfig }    from './loop';
import { mathConfig }    from './math';
import { filterConfig }  from './filter';

export const NODE_CONFIGS = {
  customInput:  inputConfig,
  customOutput: outputConfig,
  llm:          llmConfig,
  apiRequest:   apiConfig,
  webhook:      webhookConfig,
  delay:        delayConfig,
  loop:         loopConfig,
  math:         mathConfig,
  filter:       filterConfig,
};

// Ordered toolbar list
export const TOOLBAR_NODES = [
  { type: 'customInput',  label: 'Input',       category: 'IO' },
  { type: 'customOutput', label: 'Output',      category: 'IO' },
  { type: 'llm',          label: 'LLM',         category: 'AI' },
  { type: 'text',         label: 'Text',        category: 'Data' },
  { type: 'apiRequest',   label: 'API Request', category: 'Data' },
  { type: 'webhook',      label: 'Webhook',     category: 'IO' },
  { type: 'delay',        label: 'Delay',       category: 'Utility' },
  { type: 'loop',         label: 'Loop',        category: 'Logic' },
  { type: 'math',         label: 'Math',        category: 'Transform' },
  { type: 'filter',       label: 'Filter',      category: 'Logic' },
];
