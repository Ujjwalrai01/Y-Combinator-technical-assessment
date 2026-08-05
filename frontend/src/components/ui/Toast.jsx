// Toast.jsx — toast notification system via React context

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Ctx = createContext(null);

const META = {
  success: { Icon: CheckCircle2, color: '#10b981' },
  error:   { Icon: AlertCircle,  color: '#ef4444' },
  info:    { Icon: Info,         color: '#6366f1' },
};

let uid = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++uid;
    setToasts((p) => [...p, { id, message, type }]);
    if (duration > 0)
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  return (
    <Ctx.Provider value={addToast}>
      {children}

      {/* Toast stack */}
      <div
        className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const { Icon, color } = META[type] || META.info;
            return (
              <motion.div
                key={id}
                className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5
                           bg-white dark:bg-slate-800
                           border border-slate-200 dark:border-slate-700
                           rounded-xl shadow-lg min-w-[260px] max-w-[380px]"
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0,  scale: 1  }}
                exit={{    opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.15 } }}
                layout
              >
                <Icon size={15} color={color} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 flex-1 leading-snug">
                  {message}
                </span>
                <button
                  onClick={() => remove(id)}
                  className="flex items-center p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
