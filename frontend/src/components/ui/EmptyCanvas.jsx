// EmptyCanvas.jsx — shown when no nodes are on the canvas

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Workflow } from 'lucide-react';

export const EmptyCanvas = memo(() => (
  <motion.div
    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-node flex items-center justify-center text-slate-400 dark:text-slate-500">
        <Workflow size={30} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Start building your pipeline
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Drag a node from the sidebar onto the canvas
        </p>
      </div>
    </div>
  </motion.div>
));
EmptyCanvas.displayName = 'EmptyCanvas';
