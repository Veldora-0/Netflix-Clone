import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-rose-950/20 border border-rose-800/40 my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-900/30 flex items-center justify-center text-rose-400 mb-3 border border-rose-700/50">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold font-display text-rose-200 mb-1">{title}</h3>
      <p className="text-neon-muted text-sm max-w-md mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-surface hover:bg-neon-surface-hover text-neon-text border border-neon-border text-sm font-medium transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
