import { FIELD_TYPES } from '../../../constants';

export const outputConfig = {
  type: 'customOutput', title: 'Output', category: 'IO', color: '#10b981',
  inputs: [{ id: 'value', label: 'Value' }], outputs: [],
  fields: [
    { key: 'outputName', label: 'Name', type: FIELD_TYPES.TEXT, placeholder: 'output_name', defaultValue: (id) => id.replace('customOutput-', 'output_') },
    { key: 'outputType', label: 'Type', type: FIELD_TYPES.SELECT, defaultValue: 'Text', options: [{ value: 'Text', label: 'Text' }, { value: 'Image', label: 'Image' }, { value: 'File', label: 'File' }, { value: 'JSON', label: 'JSON' }] },
  ],
};
