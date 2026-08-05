import { FIELD_TYPES } from '../../../constants';

export const inputConfig = {
  type: 'customInput', title: 'Input', category: 'IO', color: '#6366f1',
  inputs: [], outputs: [{ id: 'value', label: 'Value' }],
  fields: [
    { key: 'inputName', label: 'Name', type: FIELD_TYPES.TEXT, placeholder: 'variable_name', defaultValue: (id) => id.replace('customInput-', 'input_') },
    { key: 'inputType', label: 'Type', type: FIELD_TYPES.SELECT, defaultValue: 'Text', options: [{ value: 'Text', label: 'Text' }, { value: 'File', label: 'File' }, { value: 'Number', label: 'Number' }, { value: 'JSON', label: 'JSON' }] },
  ],
};
