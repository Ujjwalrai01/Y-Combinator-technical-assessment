import { FIELD_TYPES } from '../../../constants';

export const loopConfig = {
  type: 'loop', title: 'Loop', category: 'Logic', color: '#14b8a6',
  inputs:  [{ id: 'items', label: 'Items' }],
  outputs: [{ id: 'item',  label: 'Item' }, { id: 'done', label: 'Done' }],
  fields: [
    { key: 'mode',       label: 'Mode',       type: FIELD_TYPES.SELECT, defaultValue: 'forEach', options: [{ value: 'forEach', label: 'For Each' }, { value: 'times', label: 'Repeat N times' }, { value: 'while', label: 'While condition' }] },
    { key: 'iterations', label: 'Iterations', type: FIELD_TYPES.NUMBER, defaultValue: '10', min: 1, step: 1 },
  ],
};
