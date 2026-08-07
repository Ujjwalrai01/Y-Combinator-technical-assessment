// EmptyCanvas.jsx — animated empty state with step-by-step guide

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Plug, Play, Workflow } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

const steps = [
  { icon: MousePointerClick, label: 'Drag a node', desc: 'from the sidebar onto the canvas', color: '#6366f1' },
  { icon: Plug,              label: 'Connect nodes', desc: 'drag from an output handle to an input', color: '#10b981' },
  { icon: Play,              label: 'Run Pipeline', desc: 'click the button to analyse the graph', color: '#f59e0b' },
];

export const EmptyCanvas = memo(() => {
  const { isMobile } = useResponsive();

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Icon */}
      <motion.div
        className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-node flex items-center justify-center text-slate-400 dark:text-slate-500 mb-5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 15 }}
      >
        <Workflow size={30} strokeWidth={1.5} />
      </motion.div>

      <motion.p
        className="text-base font-semibold text-slate-600 dark:text-slate-300 mb-1 text-center"
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Start building your pipeline
      </motion.p>

      <motion.p
        className="text-xs text-slate-400 dark:text-slate-500 mb-8 text-center max-w-[260px]"
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isMobile ? 'Tap the ✦ button to add nodes' : 'Drag nodes from the left sidebar onto this canvas'}
      </motion.p>

      {/* Step guide */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.28 }}
      >
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex sm:flex-col items-center gap-2 sm:gap-1.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 sm:px-3 sm:py-3 sm:w-[120px] text-center">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + '18', color: s.color }}
              >
                <s.icon size={14} strokeWidth={2} />
              </div>
              <div className="text-left sm:text-center">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{s.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">{s.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <span className="text-slate-300 dark:text-slate-600 text-sm hidden sm:block">→</span>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
});
EmptyCanvas.displayName = 'EmptyCanvas';
