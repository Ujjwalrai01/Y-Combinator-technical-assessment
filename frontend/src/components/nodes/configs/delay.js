import { FIELD_TYPES } from '../../../constants';

export const delayConfig = {
  type: 'delay', title: 'Delay', category: 'Utility', color: '#f97316',
  inputs:  [{ id: 'trigger', label: 'Trigger' }],
  outputs: [{ id: 'done',    label: 'Done' }],
  fields: [
    { key: 'duration', label: 'Duration', type: FIELD_TYPES.NUMBER, defaultValue: '1', min: 0, step: 0.1 },
    { key: 'unit',     label: 'Unit',     type: FIELD_TYPES.SELECT, defaultValue: 'seconds', options: [{ value: 'milliseconds', label: 'Milliseconds' }, { value: 'seconds', label: 'Seconds' }, { value: 'minutes', label: 'Minutes' }, { value: 'hours', label: 'Hours' }] },
  ],
};
