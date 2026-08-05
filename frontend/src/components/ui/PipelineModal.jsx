// PipelineModal.jsx — animated result modal (Framer Motion + Tailwind)

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, GitBranch, Layers, Workflow, X } from 'lucide-react';

const backdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};
const panel = {
  hidden:  { opacity: 0, scale: 0.93, y: 18 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { type: 'spring', damping: 22, stiffness: 300 } },
  exit:    { opacity: 0, scale: 0.96, y: 8,  transition: { duration: 0.15 } },
};

const StatCard = memo(({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl">
    <span style={{ color }} className="flex-shrink-0">
      <Icon size={18} strokeWidth={2} />
    </span>
    <div>
      <div className="text-base font-bold text-slate-800 dark:text-slate-100 leading-none">{value}</div>
      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">{label}</div>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

export const PipelineModal = memo(({ open, onClose, result, error }) => {
  const hasError = !!error;
  const isDag    = result?.is_dag;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[440px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-modal overflow-hidden"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div
              className={`flex items-center gap-3 px-5 pt-5 pb-4
                ${hasError || !isDag
                  ? 'bg-gradient-to-br from-red-500/8 to-red-500/3'
                  : 'bg-gradient-to-br from-emerald-500/8 to-emerald-500/3'
                }`}
            >
              <span className={hasError || !isDag ? 'text-red-500' : 'text-emerald-500'}>
                {hasError || !isDag
                  ? <XCircle size={28} strokeWidth={1.5} />
                  : <CheckCircle2 size={28} strokeWidth={1.5} />
                }
              </span>
              <div>
                <h2 id="modal-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Pipeline Analysis
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {hasError
                    ? error.type === 'empty' ? 'Nothing to submit' : 'Connection failed'
                    : isDag
                      ? 'Valid pipeline — ready to execute'
                      : 'Cycle detected — pipeline is invalid'}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 pb-4">
              {hasError ? (
                <div className="p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{error.message}</p>
                  {error.type === 'network' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                      Make sure the backend is running on{' '}
                      <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-[11px]">
                        localhost:8000
                      </code>
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    <StatCard icon={Layers}   label="Nodes"      value={result.num_nodes}                 color="#6366f1" />
                    <StatCard icon={GitBranch} label="Edges"     value={result.num_edges}                 color="#06b6d4" />
                    <StatCard icon={Workflow}  label="Graph"     value={isDag ? 'DAG' : 'Cyclic'}         color={isDag ? '#10b981' : '#ef4444'} />
                  </div>

                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium
                      ${isDag
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400'
                      }`}
                  >
                    {isDag
                      ? <><CheckCircle2 size={15} /><span>Directed Acyclic Graph — no cycles detected</span></>
                      : <><XCircle size={15} />    <span>Cyclic graph — remove loops to validate</span></>
                    }
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-colors duration-150"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
PipelineModal.displayName = 'PipelineModal';
