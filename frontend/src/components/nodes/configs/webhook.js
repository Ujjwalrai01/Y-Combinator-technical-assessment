import { FIELD_TYPES } from '../../../constants';

export const webhookConfig = {
  type: 'webhook', title: 'Webhook', category: 'IO', color: '#8b5cf6',
  inputs:  [],
  outputs: [{ id: 'payload', label: 'Payload' }, { id: 'headers', label: 'Headers' }],
  fields: [
    { key: 'path',    label: 'Path',        type: FIELD_TYPES.TEXT,   placeholder: '/webhook/my-trigger', defaultValue: '' },
    { key: 'method',  label: 'Method',      type: FIELD_TYPES.SELECT, defaultValue: 'POST', options: [{ value: 'POST', label: 'POST' }, { value: 'GET', label: 'GET' }, { value: 'ANY', label: 'Any' }] },
    { key: 'retries', label: 'Max Retries', type: FIELD_TYPES.NUMBER, defaultValue: '3', min: 0, max: 10, step: 1 },
  ],
};
