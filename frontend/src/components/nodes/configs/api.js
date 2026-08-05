import { FIELD_TYPES } from '../../../constants';

export const apiConfig = {
  type: 'apiRequest', title: 'API Request', category: 'Data', color: '#ec4899',
  inputs:  [{ id: 'body', label: 'Body' }],
  outputs: [{ id: 'response', label: 'Response' }, { id: 'status', label: 'Status' }],
  fields: [
    { key: 'method', label: 'Method', type: FIELD_TYPES.SELECT, defaultValue: 'GET', options: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }, { value: 'PUT', label: 'PUT' }, { value: 'PATCH', label: 'PATCH' }, { value: 'DELETE', label: 'DELETE' }] },
    { key: 'url', label: 'URL', type: FIELD_TYPES.TEXT, placeholder: 'https://api.example.com/endpoint', defaultValue: '' },
    { key: 'headers', label: 'Headers (JSON)', type: FIELD_TYPES.TEXTAREA, placeholder: '{"Authorization": "Bearer ..."}', defaultValue: '' },
  ],
};
