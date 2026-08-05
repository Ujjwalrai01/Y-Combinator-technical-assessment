// Toolbar.jsx — sidebar: node palette, undo/redo, theme toggle

import React, { memo } from 'react';
import {
  LogIn, LogOut, BrainCircuit, FileText,
  Globe, Webhook, Timer, RefreshCw,
  Calculator, Filter, Moon, Sun,
  Undo2, Redo2, Trash2, Download, Upload,
} from 'lucide-react';
import { TOOLBAR_NODES }   from '../nodes/configs';
import { CATEGORY_COLORS } from '../../constants';
import { useStore }        from '../../store';
import { useTheme }        from '../../hooks/useTheme';
import { useToast }        from './Toast';

// Map node type → Lucide icon
const NODE_ICONS = {
  customInput:  LogIn,
  customOutput: LogOut,
  llm:          BrainCircuit,
  text:         FileText,
  apiRequest:   Globe,
  webhook:      Webhook,
  delay:        Timer,
  loop:         RefreshCw,
  math:         Calculator,
  filter:       Filter,
};

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

// ── Draggable node item ───────────────────────────────────────────────────

const DraggableItem = memo(({ type, label, color }) => {
  const Icon = NODE_ICONS[type];

  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      title={`Drag to add ${label} node`}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-grab active:cursor-grabbing
                 border border-transparent
                 hover:border-slate-200 dark:hover:border-slate-600
                 hover:bg-slate-50 dark:hover:bg-slate-700/50
                 transition-all duration-150 select-none"
    >
      <div
        className="w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: color + '22', color }}
      >
        {Icon && <Icon size={13} strokeWidth={2} />}
      </div>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-none">
        {label}
      </span>
    </div>
  );
});
DraggableItem.displayName = 'DraggableItem';

// ── Small action button ───────────────────────────────────────────────────

function ActionBtn({ icon: Icon, label, onClick, disabled, danger, fullWidth }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex items-center justify-center gap-1.5 px-2 py-[7px] text-[11px] font-medium',
        'rounded-lg border transition-all duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        fullWidth ? 'w-full' : '',
        danger
          ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
      ].join(' ')}
    >
      <Icon size={13} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────

export const Toolbar = memo(() => {
  const { isDark, toggle } = useTheme();
  const undo           = useStore((s) => s.undo);
  const redo           = useStore((s) => s.redo);
  const clearCanvas    = useStore((s) => s.clearCanvas);
  const exportPipeline = useStore((s) => s.exportPipeline);
  const importPipeline = useStore((s) => s.importPipeline);
  const past           = useStore((s) => s.past);
  const future         = useStore((s) => s.future);
  const toast          = useToast();

  const groups = groupBy(TOOLBAR_NODES, 'category');

  const handleImport = () => {
    const inp = document.createElement('input');
    inp.type   = 'file';
    inp.accept = 'application/json';
    inp.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const ok = importPipeline(ev.target.result);
        toast(
          ok ? 'Pipeline imported successfully.' : 'Import failed — invalid JSON.',
          ok ? 'success' : 'error'
        );
      };
      reader.readAsText(file);
    };
    inp.click();
  };

  return (
    <aside className="flex flex-col w-[220px] min-w-[220px] h-full bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-700/80 backdrop-blur-xl overflow-hidden">

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-200 dark:border-slate-700/80 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
          <BrainCircuit size={16} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">VectorShift</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Pipeline Builder</p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
          Nodes
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Drag onto canvas</p>
      </div>

      {/* Node palette */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 min-h-0">
        {Object.entries(groups).map(([cat, nodes]) => {
          const catColor = CATEGORY_COLORS[cat] || '#6366f1';
          return (
            <div key={cat} className="mb-2.5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.07em] px-1 py-1.5"
                style={{ color: catColor }}
              >
                {cat}
              </p>
              {nodes.map((n) => (
                <DraggableItem
                  key={n.type}
                  type={n.type}
                  label={n.label}
                  color={catColor}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-200 dark:border-slate-700/80 flex-shrink-0" />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5 p-3 flex-shrink-0">
        <ActionBtn icon={Undo2}    label="Undo"   onClick={undo}           disabled={past.length === 0} />
        <ActionBtn icon={Redo2}    label="Redo"   onClick={redo}           disabled={future.length === 0} />
        <ActionBtn icon={Download} label="Export" onClick={exportPipeline} />
        <ActionBtn icon={Upload}   label="Import" onClick={handleImport} />
        <div className="col-span-2">
          <ActionBtn
            icon={Trash2}
            label="Clear canvas"
            onClick={() => { clearCanvas(); toast('Canvas cleared.', 'info'); }}
            danger
            fullWidth
          />
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center gap-2 w-full py-2.5 flex-shrink-0
                   border-t border-slate-200 dark:border-slate-700/80
                   text-xs text-slate-400 dark:text-slate-500
                   hover:bg-slate-50 dark:hover:bg-slate-800
                   hover:text-slate-600 dark:hover:text-slate-300
                   transition-colors duration-150"
      >
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
        <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </aside>
  );
});
Toolbar.displayName = 'Toolbar';
