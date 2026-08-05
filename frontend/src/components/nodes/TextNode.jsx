// TextNode.jsx — auto-resizing textarea + {{variable}} → live input handles

import React, { memo, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeState }      from '../../hooks/useNodeState';
import { useVariableParser } from '../../hooks/useVariableParser';
import { useAutoResize }     from '../../hooks/useAutoResize';

const COLOR = '#3b82f6';

const hexAlpha = (hex, a) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

function TextNode({ id, data }) {
  const { fields, setField } = useNodeState(id, { text: data?.text ?? '{{input}}' });
  const variables        = useVariableParser(fields.text);
  const { ref, onInput } = useAutoResize();

  // Resize on mount for pre-loaded content
  useEffect(() => { if (ref.current) onInput(); }, []); // eslint-disable-line

  return (
    <div className="node-card relative bg-white dark:bg-slate-800 border border-black/[0.07] dark:border-white/[0.06] rounded-[14px] shadow-node hover:shadow-node-hover hover:-translate-y-px transition-all duration-150 min-w-[240px] max-w-[360px] overflow-hidden select-none">

      {/* Header */}
      <div
        className="relative flex items-center gap-2 px-3 py-[10px] border-b border-black/[0.06] dark:border-white/[0.06]"
        style={{ background: `linear-gradient(135deg, ${hexAlpha(COLOR, 0.10)}, ${hexAlpha(COLOR, 0.04)})` }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm" style={{ background: COLOR }} />
        <span className="ml-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-wide flex-1">
          Text
        </span>
        {variables.length > 0 && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: COLOR, background: hexAlpha(COLOR, 0.12) }}
          >
            {variables.length} var{variables.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3">
        <label
          htmlFor={`${id}-text`}
          className="text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500"
        >
          Content
        </label>

        <textarea
          id={`${id}-text`}
          ref={ref}
          className="w-full px-2 py-1.5 text-xs font-mono rounded-md resize-none
                     bg-slate-50 dark:bg-slate-700/50
                     border border-slate-200 dark:border-slate-600
                     text-slate-800 dark:text-slate-100
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     outline-none transition-all duration-150 leading-relaxed
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     overflow-y-auto"
          style={{ minHeight: '60px', maxHeight: '320px' }}
          value={fields.text}
          placeholder="Type text or {{variable}} for dynamic inputs…"
          onChange={(e) => setField('text', e.target.value)}
          onInput={onInput}
          spellCheck={false}
        />

        {/* Variable chips */}
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {variables.map((v) => (
              <span
                key={v}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                style={{ color: COLOR, background: hexAlpha(COLOR, 0.08), borderColor: hexAlpha(COLOR, 0.25) }}
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic input handles — one per variable */}
      {variables.map((v, i) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{
            top:         variables.length === 1 ? '50%' : `${(100 / (variables.length + 1)) * (i + 1)}%`,
            background:  '#fff',
            borderColor: COLOR,
          }}
          title={v}
        />
      ))}

      {/* Static output */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ background: '#fff', borderColor: COLOR }}
        title="Output"
      />
    </div>
  );
}

export default memo(TextNode);
