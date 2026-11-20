import React, { useEffect, useState } from 'react';
import { Film, Search, Sparkles, X } from 'lucide-react';
import { api } from '../api/client';
import { EmptyState } from '../components/common/EmptyState';
import { MovieCard } from '../components/common/MovieCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { TitleDetailsModal } from '../components/modal/TitleDetailsModal';
import { Movie } from '../types';

const POPULAR_SUGGESTIONS = [
  'Cyberpunk',
  'Alpine',
  'Comedy',
  'Jazz',
  'Normandy',
  'Kyoto',
  'Heist',
  'Space',
];

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Debounce input by 300ms to prevent spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    api
      .searchMovies(debouncedQuery)
      .then((res) => {
        if (isMounted) {
          setResults(res.movies || []);
        }
      })
      .catch((err) => {
        console.error('Search error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold font-display text-neon-text">
          Search Catalogue
        </h1>
        <p className="text-neon-muted text-sm">
          Discover movies by title, keywords, actors, or themes.
        </p>
      </div>

      {/* Large Search Input */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-accent" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies by title (e.g. Neon Odyssey, Alpine, Montmartre)..."
            autoFocus
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-neon-card border border-neon-border text-neon-text placeholder:text-neon-muted/60 text-base md:text-lg focus:outline-none focus:border-neon-accent focus:shadow-neon-cyan transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neon-muted hover:text-neon-text p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          <span className="text-neon-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-neon-accent" /> Popular:
          </span>
          {POPULAR_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-neon-surface hover:bg-neon-surface-hover text-neon-muted hover:text-neon-text border border-neon-border/60 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      <div className="pt-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : debouncedQuery.trim() && results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-xs text-neon-muted">
              Found {results.length} {results.length === 1 ? 'match' : 'matches'} for "{debouncedQuery}"
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {results.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelectDetails={(m) => setSelectedMovie(m)}
                />
              ))}
            </div>
          </div>
        ) : debouncedQuery.trim() && results.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No matches found"
            description={`We couldn't find any movie matching "${debouncedQuery}". Check your spelling or try another title.`}
            actionText="Clear Search"
            onAction={() => setQuery('')}
          />
        ) : (
          /* Blank state when user hasn't typed anything yet */
          <div className="text-center py-16 text-neon-muted text-sm space-y-2">
            <Search className="w-10 h-10 text-neon-muted/40 mx-auto" />
            <p>Start typing above to search the NEONFLIX library in real time.</p>
          </div>
        )}
      </div>

      {/* Title Details Modal */}
      <TitleDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};
