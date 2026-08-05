// SubmitButton.jsx — floating CTA button with loading spinner

import React, { memo } from 'react';
import { Play, Loader2 } from 'lucide-react';

export const SubmitButton = memo(({ onClick, loading, nodeCount }) => (
  <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50">
    <button
      onClick={onClick}
      disabled={loading}
      aria-label="Run pipeline"
      title="Analyse pipeline — checks nodes, edges, and DAG validity"
      className={`
        flex items-center gap-2 px-5 py-2.5
        bg-gradient-to-r from-indigo-600 to-indigo-500
        hover:from-indigo-500 hover:to-indigo-400
        text-white text-sm font-semibold rounded-full
        shadow-[0_4px_14px_rgba(99,102,241,0.45)]
        hover:shadow-[0_8px_20px_rgba(99,102,241,0.55)]
        hover:-translate-y-0.5
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        transition-all duration-150 whitespace-nowrap
      `}
    >
      {loading
        ? <Loader2 size={15} className="animate-spinner flex-shrink-0" />
        : <Play    size={15} strokeWidth={2.5} className="flex-shrink-0" />
      }
      <span>{loading ? 'Analysing…' : 'Run Pipeline'}</span>
      {!loading && nodeCount > 0 && (
        <span className="bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-4">
          {nodeCount}
        </span>
      )}
    </button>
  </div>
));
SubmitButton.displayName = 'SubmitButton';
