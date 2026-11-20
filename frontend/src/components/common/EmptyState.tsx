import React from 'react';
import { Film, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Film,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-neon-card/30 border border-neon-border/40 my-6">
      <div className="w-16 h-16 rounded-2xl bg-neon-surface flex items-center justify-center text-neon-accent mb-4 border border-neon-border/60 shadow-lg">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-neon-text mb-2">{title}</h3>
      <p className="text-neon-muted text-sm max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-neon-accent text-neon-dark font-semibold text-sm hover:brightness-110 shadow-neon-cyan transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
