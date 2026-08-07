// Toolbar.jsx — responsive sidebar with node search, collapsible on mobile

import React, { memo, useState, useMemo } from 'react';
import {
  LogIn, LogOut, BrainCircuit, FileText,
  Globe, Webhook, Timer, RefreshCw,
  Calculator, Filter, Moon, Sun,
  Undo2, Redo2, Trash2, Download, Upload,
  Search, X, Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLBAR_NODES }    from '../nodes/configs';
import { CATEGORY_COLORS }  from '../../constants';
import { useStore }         from '../../store';
import { useTheme }         from '../../hooks/useTheme';
import { useToast }         from './Toast';
import { useResponsive }    from '../../hooks/useResponsive';

export const NODE_ICONS = {
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

// ── Draggable / tappable node item ────────────────────────────────────────

const DraggableItem = memo(({ type, label, color, onTap }) => {
  const Icon = NODE_ICONS[type];

  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onTap}
      title={`Drag or tap to add ${label}`}
      className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-grab active:cursor-grabbing
                 border border-transparent
                 hover:border-slate-200 dark:hover:border-slate-600
                 hover:bg-slate-50 dark:hover:bg-slate-700/50
                 active:scale-95
                 transition-all duration-150 select-none"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: color + '22', color }}
      >
        {Icon && <Icon size={14} strokeWidth={2} />}
      </div>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-none">
        {label}
      </span>
    </div>
  );
});
DraggableItem.displayName = 'DraggableItem';

// ── Action button ─────────────────────────────────────────────────────────

function ActionBtn({ icon: Icon, label, onClick, disabled, danger, fullWidth }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium',
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

// ── Sidebar content (shared between desktop + mobile) ─────────────────────

function SidebarContent({ onClose }) {
  const [query, setQuery]      = useState('');
  const { isDark, toggle }     = useTheme();
  const undo           = useStore((s) => s.undo);
  const redo           = useStore((s) => s.redo);
  const clearCanvas    = useStore((s) => s.clearCanvas);
  const exportPipeline = useStore((s) => s.exportPipeline);
  const importPipeline = useStore((s) => s.importPipeline);
  const addNode        = useStore((s) => s.addNode);
  const getNodeID      = useStore((s) => s.getNodeID);
  const past           = useStore((s) => s.past);
  const future         = useStore((s) => s.future);
  const nodeCount      = useStore((s) => s.nodes.length);
  const toast          = useToast();

  // Filter nodes by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return TOOLBAR_NODES;
    const q = query.toLowerCase();
    return TOOLBAR_NODES.filter(
      (n) => n.label.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    );
  }, [query]);

  const groups = useMemo(() => groupBy(filtered, 'category'), [filtered]);

  // Tap-to-add for mobile — places node at canvas centre
  const handleTap = (type) => {
    const id = getNodeID(type);
    addNode({ id, type, position: { x: 200 + Math.random() * 200, y: 150 + Math.random() * 150 }, data: { id, nodeType: type } });
    toast(`${type} node added`, 'success', 2000);
    if (onClose) onClose();
  };

  const handleImport = () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json';
    inp.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const ok = importPipeline(ev.target.result);
        toast(ok ? 'Pipeline imported.' : 'Import failed — invalid JSON.', ok ? 'success' : 'error');
      };
      reader.readAsText(file);
    };
    inp.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-200 dark:border-slate-700/80 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
          <BrainCircuit size={16} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">VectorShift</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Pipeline Builder</p>
        </div>
        {/* Node count badge */}
        {nodeCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full">
            <Layers size={9} />
            {nodeCount}
          </span>
        )}
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="ml-1 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2 flex-shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 border border-transparent focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-slate-700 transition-all">
          <Search size={12} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes…"
            className="flex-1 text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-0">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No nodes match "{query}"</p>
        ) : (
          Object.entries(groups).map(([cat, nodes]) => {
            const catColor = CATEGORY_COLORS[cat] || '#6366f1';
            return (
              <div key={cat} className="mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.07em] px-1 py-1.5" style={{ color: catColor }}>
                  {cat}
                </p>
                {nodes.map((n) => (
                  <DraggableItem
                    key={n.type}
                    type={n.type}
                    label={n.label}
                    color={catColor}
                    onTap={() => handleTap(n.type)}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-200 dark:border-slate-700/80 flex-shrink-0" />

      {/* Tip */}
      <div className="px-4 py-2 flex-shrink-0">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
          💡 <strong className="font-semibold">Desktop:</strong> drag onto canvas &nbsp;|&nbsp;
          <strong className="font-semibold">Mobile:</strong> tap to add
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-2 flex-shrink-0">
        <ActionBtn icon={Undo2}    label="Undo"   onClick={undo}           disabled={past.length === 0} />
        <ActionBtn icon={Redo2}    label="Redo"   onClick={redo}           disabled={future.length === 0} />
        <ActionBtn icon={Download} label="Export" onClick={exportPipeline} />
        <ActionBtn icon={Upload}   label="Import" onClick={handleImport} />
        <div className="col-span-2">
          <ActionBtn
            icon={Trash2}
            label="Clear canvas"
            onClick={() => { clearCanvas(); toast('Canvas cleared.', 'info'); }}
            danger fullWidth
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
    </div>
  );
}

// ── Toolbar — desktop sidebar + mobile bottom sheet ───────────────────────

export const Toolbar = memo(() => {
  const { isMobile, isTablet } = useResponsive();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nodeCount = useStore((s) => s.nodes.length);

  // Desktop — fixed left sidebar
  if (!isMobile && !isTablet) {
    return (
      <aside className="flex flex-col w-[220px] min-w-[220px] h-full bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-700/80 backdrop-blur-xl overflow-hidden">
        <SidebarContent />
      </aside>
    );
  }

  // Tablet — narrower sidebar, icons only for items
  if (isTablet && !isMobile) {
    return (
      <aside className="flex flex-col w-[200px] min-w-[200px] h-full bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-700/80 backdrop-blur-xl overflow-hidden">
        <SidebarContent />
      </aside>
    );
  }

  // Mobile — floating button + bottom sheet drawer
  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.5)] flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Open node panel"
      >
        <BrainCircuit size={20} strokeWidth={2} />
        {nodeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {nodeCount > 9 ? '9+' : nodeCount}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.2)] flex flex-col"
              style={{ maxHeight: '85vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
Toolbar.displayName = 'Toolbar';
