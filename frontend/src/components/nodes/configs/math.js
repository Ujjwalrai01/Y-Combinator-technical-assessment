import { FIELD_TYPES } from '../../../constants';

export const mathConfig = {
  type: 'math', title: 'Math', category: 'Transform', color: '#84cc16',
  inputs:  [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
  outputs: [{ id: 'result', label: 'Result' }],
  fields: [
    { key: 'operation', label: 'Operation', type: FIELD_TYPES.SELECT, defaultValue: 'add', options: [{ value: 'add', label: 'Add (A + B)' }, { value: 'subtract', label: 'Subtract (A − B)' }, { value: 'multiply', label: 'Multiply (A × B)' }, { value: 'divide', label: 'Divide (A ÷ B)' }, { value: 'modulo', label: 'Modulo (A % B)' }, { value: 'power', label: 'Power (A ^ B)' }] },
  ],
};
