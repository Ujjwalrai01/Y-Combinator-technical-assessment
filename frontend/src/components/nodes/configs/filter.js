import { FIELD_TYPES } from '../../../constants';

export const filterConfig = {
  type: 'filter', title: 'Filter', category: 'Logic', color: '#ef4444',
  inputs:  [{ id: 'input', label: 'Input' }],
  outputs: [{ id: 'true',  label: 'True'  }, { id: 'false', label: 'False' }],
  fields: [
    { key: 'field',    label: 'Field',    type: FIELD_TYPES.TEXT,   placeholder: 'data.status', defaultValue: '' },
    { key: 'operator', label: 'Operator', type: FIELD_TYPES.SELECT, defaultValue: 'equals', options: [{ value: 'equals', label: 'equals' }, { value: 'not_equals', label: 'not equals' }, { value: 'contains', label: 'contains' }, { value: 'gt', label: '>' }, { value: 'lt', label: '<' }, { value: 'exists', label: 'exists' }] },
    { key: 'value',    label: 'Value',    type: FIELD_TYPES.TEXT,   placeholder: 'expected value', defaultValue: '' },
  ],
};
