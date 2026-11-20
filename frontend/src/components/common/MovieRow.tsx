import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  loading?: boolean;
  landscape?: boolean;
  onSelectDetails?: (movie: Movie) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  movies,
  loading = false,
  landscape = false,
  onSelectDetails,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -600 : 600;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="py-4 space-y-3">
      {/* Row Header */}
      <div className="flex items-end justify-between px-4 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-neon-accent rounded-full inline-block" />
            <h3 className="text-lg md:text-xl font-bold font-display text-neon-text tracking-wide">
              {title}
            </h3>
          </div>
          {subtitle && <p className="text-xs text-neon-muted ml-3.5 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Arrows */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-lg bg-neon-surface hover:bg-neon-surface-hover text-neon-text flex items-center justify-center border border-neon-border/60 transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-lg bg-neon-surface hover:bg-neon-surface-hover text-neon-text flex items-center justify-center border border-neon-border/60 transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 md:px-8 py-2 scroll-smooth"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={landscape ? 'w-72 shrink-0' : 'w-44 md:w-52 shrink-0'}>
              <SkeletonCard landscape={landscape} />
            </div>
          ))
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className={landscape ? 'w-72 shrink-0' : 'w-44 md:w-52 shrink-0'}>
              <MovieCard
                movie={movie}
                landscape={landscape}
                onSelectDetails={onSelectDetails}
              />
            </div>
          ))
        ) : (
          <div className="text-xs text-neon-muted py-8 px-4 italic">No titles available in this category.</div>
        )}
      </div>
    </div>
  );
};
