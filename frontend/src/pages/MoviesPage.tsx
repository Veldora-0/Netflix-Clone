import React, { useEffect, useState } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../api/client';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { MovieCard } from '../components/common/MovieCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { TitleDetailsModal } from '../components/modal/TitleDetailsModal';
import { Movie } from '../types';

const GENRES = [
  'All',
  'Sci-Fi',
  'Action',
  'Comedy',
  'Drama',
  'Romance',
  'Thriller',
  'Animation',
  'Documentary',
];

type SortOption = 'rating' | 'year' | 'title';

export const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMovies(
        selectedGenre !== 'All' ? { genre: selectedGenre } : undefined
      );
      setMovies(res.movies || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies catalogue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre]);

  // Client-side filtering & sorting for smooth UX
  const filteredMovies = movies
    .filter((m) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-accent/10 border border-neon-accent/30 text-neon-accent text-xs font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>Curated Cinematic Catalogue</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display text-neon-text">
          Feature Films & Cinema
        </h1>
        <p className="text-neon-muted text-sm md:text-base max-w-2xl">
          Browse through our complete collection of 4K cinematic original features, indie gems, and high-octane blockbusters.
        </p>
      </div>

      {/* Control Bar: Search, Genres, and Sorting */}
      <div className="space-y-4 bg-neon-card/60 p-4 md:p-6 rounded-2xl border border-neon-border/60 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, keywords or synopsis..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neon-surface border border-neon-border/80 text-neon-text placeholder:text-neon-muted/60 text-sm focus:outline-none focus:border-neon-accent transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neon-muted hover:text-neon-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-neon-muted shrink-0" />
            <span className="text-xs text-neon-muted font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-neon-surface border border-neon-border rounded-xl px-3 py-2 text-xs font-semibold text-neon-text focus:outline-none focus:border-neon-accent cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="year">Newest Release</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {GENRES.map((g) => {
            const isSelected = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-neon-accent text-neon-dark shadow-neon-cyan font-bold'
                    : 'bg-neon-surface hover:bg-neon-surface-hover text-neon-muted hover:text-neon-text border border-neon-border'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMovies} />
      ) : filteredMovies.length > 0 ? (
        <div>
          <div className="text-xs text-neon-muted mb-4 font-medium">
            Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectDetails={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No movies found"
          description={
            searchQuery
              ? `No movies match "${searchQuery}". Try different search terms or clear filters.`
              : 'No titles found in this genre category.'
          }
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedGenre('All');
          }}
        />
      )}

      {/* Title Details Modal */}
      <TitleDetailsModal
        movie={selectedMovie}
        allMovies={movies}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={(m) => setSelectedMovie(m)}
      />
    </div>
  );
};
