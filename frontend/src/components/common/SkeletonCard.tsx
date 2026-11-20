import React from 'react';

export const SkeletonCard: React.FC<{ landscape?: boolean }> = ({ landscape = false }) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-neon-card/60 animate-pulse border border-neon-border/40 ${
        landscape ? 'aspect-video w-72 shrink-0' : 'aspect-[2/3] w-full'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-neon-dark via-transparent to-transparent opacity-60" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-4 bg-neon-surface rounded w-3/4" />
        <div className="h-3 bg-neon-surface rounded w-1/2" />
      </div>
    </div>
  );
};
