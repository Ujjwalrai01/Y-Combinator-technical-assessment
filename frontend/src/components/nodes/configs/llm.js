import { FIELD_TYPES } from '../../../constants';

export const llmConfig = {
  type: 'llm', title: 'LLM', category: 'AI', color: '#f59e0b',
  inputs:  [{ id: 'system', label: 'System' }, { id: 'prompt', label: 'Prompt' }],
  outputs: [{ id: 'response', label: 'Response' }],
  fields: [
    { key: 'model', label: 'Model', type: FIELD_TYPES.SELECT, defaultValue: 'gpt-4o', options: [{ value: 'gpt-4o', label: 'GPT-4o' }, { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }, { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }, { value: 'claude-3-opus', label: 'Claude 3 Opus' }, { value: 'llama-3', label: 'Llama 3' }] },
    { key: 'temperature', label: 'Temperature', type: FIELD_TYPES.NUMBER, defaultValue: '0.7', min: 0, max: 2, step: 0.1 },
  ],
};
