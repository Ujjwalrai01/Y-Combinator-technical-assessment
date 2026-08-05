// BaseNode.jsx — universal node renderer driven by a config object.
// Adding a new node type = one config file only. Zero JSX duplication.

import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeState } from '../../hooks/useNodeState';
import { FIELD_TYPES }  from '../../constants';

// ── Helpers ────────────────────────────────────────────────────────────────

// Spread handles evenly along the side
const getOffset = (i, total) =>
  total === 1 ? '50%' : `${(100 / (total + 1)) * (i + 1)}%`;

// Convert hex to rgba for tinted backgrounds
const hexAlpha = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

// ── Field renderer ─────────────────────────────────────────────────────────

const inputCls =
  'w-full px-2 py-[5px] text-xs rounded-md ' +
  'bg-slate-50 dark:bg-slate-700/50 ' +
  'border border-slate-200 dark:border-slate-600 ' +
  'text-slate-800 dark:text-slate-100 ' +
  'placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
  'outline-none transition-all duration-150 ' +
  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

const NodeField = memo(({ field, value, onChange }) => {
  const { key, label, type, placeholder, options, min, max, step } = field;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={`field-${key}`}
        className="text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500"
      >
        {label}
      </label>

      {type === FIELD_TYPES.SELECT ? (
        <select
          id={`field-${key}`}
          className={inputCls}
          value={value}
          onChange={(e) => onChange(key, e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === FIELD_TYPES.TEXTAREA ? (
        <textarea
          id={`field-${key}`}
          className={`${inputCls} font-mono resize-none min-h-[52px] leading-relaxed`}
          value={value}
          placeholder={placeholder}
          rows={3}
          onChange={(e) => onChange(key, e.target.value)}
        />
      ) : (
        <input
          id={`field-${key}`}
          className={inputCls}
          type={type === FIELD_TYPES.NUMBER ? 'number' : 'text'}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(key, e.target.value)}
        />
      )}
    </div>
  );
});
NodeField.displayName = 'NodeField';

// ── Header ─────────────────────────────────────────────────────────────────

const NodeHeader = memo(({ title, color, icon: Icon }) => (
  <div
    className="relative flex items-center gap-2 px-3 py-[10px] border-b border-black/[0.06] dark:border-white/[0.06]"
    style={{ background: `linear-gradient(135deg, ${hexAlpha(color, 0.10)}, ${hexAlpha(color, 0.04)})` }}
  >
    {/* Accent bar */}
    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm" style={{ background: color }} />
    {Icon && (
      <span className="flex items-center ml-0.5 flex-shrink-0" style={{ color }}>
        <Icon size={14} strokeWidth={2.5} />
      </span>
    )}
    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-wide leading-none">
      {title}
    </span>
  </div>
));
NodeHeader.displayName = 'NodeHeader';

// ── BaseNode ───────────────────────────────────────────────────────────────

function BaseNode({ id, data, config }) {
  const initial = Object.fromEntries(
    config.fields.map((f) => [
      f.key,
      data?.[f.key] ?? (typeof f.defaultValue === 'function' ? f.defaultValue(id) : (f.defaultValue ?? '')),
    ])
  );

  const { fields, setField } = useNodeState(id, initial);
  const onChange = useCallback((key, val) => setField(key, val), [setField]);

  return (
    <div className="node-card relative bg-white dark:bg-slate-800 border border-black/[0.07] dark:border-white/[0.06] rounded-[14px] shadow-node hover:shadow-node-hover hover:-translate-y-px transition-all duration-150 min-w-[220px] max-w-[300px] overflow-hidden select-none">

      <NodeHeader title={config.title} color={config.color} icon={config.icon} />

      {config.fields.length > 0 && (
        <div className="flex flex-col gap-2 p-3">
          {config.fields.map((f) => (
            <NodeField key={f.key} field={f} value={fields[f.key]} onChange={onChange} />
          ))}
        </div>
      )}

      {/* Input handles */}
      {config.inputs.map((h, i) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          style={{ top: getOffset(i, config.inputs.length), background: '#fff', borderColor: config.color }}
          title={h.label}
        />
      ))}

      {/* Output handles */}
      {config.outputs.map((h, i) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          style={{ top: getOffset(i, config.outputs.length), background: '#fff', borderColor: config.color }}
          title={h.label}
        />
      ))}
    </div>
  );
}

export default memo(BaseNode);
