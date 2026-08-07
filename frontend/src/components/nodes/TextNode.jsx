import React, { memo, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeState }      from '../../hooks/useNodeState';
import { useVariableParser } from '../../hooks/useVariableParser';
import { useAutoResize }     from '../../hooks/useAutoResize';
import { hexToRgba }         from '../../utils/color';

const COLOR = '#3b82f6';

function TextNode({ id, data }) {
  const { fields, setField } = useNodeState(id, { text: data?.text ?? '{{input}}' });
  const variables        = useVariableParser(fields.text);
  const { ref, onInput } = useAutoResize();

  useEffect(() => { if (ref.current) onInput(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="node-card relative bg-white dark:bg-slate-800 border border-black/[0.07] dark:border-white/[0.06] rounded-[14px] shadow-node hover:shadow-node-hover hover:-translate-y-px transition-all duration-150 min-w-[240px] max-w-[360px] overflow-hidden select-none">
      <div className="relative flex items-center gap-2 px-3 py-[10px] border-b border-black/[0.06] dark:border-white/[0.06]"
        style={{ background: `linear-gradient(135deg, ${hexToRgba(COLOR, 0.10)}, ${hexToRgba(COLOR, 0.04)})` }}>
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm" style={{ background: COLOR }} />
        <span className="ml-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-wide flex-1">Text</span>
        {variables.length > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: COLOR, background: hexToRgba(COLOR, 0.12) }}>
            {variables.length} var{variables.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <label htmlFor={`${id}-text`} className="text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Content</label>
        <textarea id={`${id}-text`} ref={ref}
          className="w-full px-2 py-1.5 text-xs font-mono rounded-md resize-none bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all duration-150 leading-relaxed overflow-y-auto focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          style={{ minHeight: 60, maxHeight: 320 }}
          value={fields.text}
          placeholder="Type text or use {{variable}} for dynamic inputs…"
          onChange={(e) => setField('text', e.target.value)}
          onInput={onInput}
          spellCheck={false}
        />
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {variables.map((v) => (
              <span key={v} className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                style={{ color: COLOR, background: hexToRgba(COLOR, 0.08), borderColor: hexToRgba(COLOR, 0.25) }}>
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {variables.map((v, i) => (
        <Handle key={v} type="target" position={Position.Left} id={`${id}-${v}`}
          style={{ top: variables.length === 1 ? '50%' : `${(100 / (variables.length + 1)) * (i + 1)}%`, background: '#fff', borderColor: COLOR }}
          title={v} />
      ))}
      <Handle type="source" position={Position.Right} id={`${id}-output`}
        style={{ background: '#fff', borderColor: COLOR }} title="Output" />
    </div>
  );
}

export default memo(TextNode);
