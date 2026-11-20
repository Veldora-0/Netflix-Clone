import React, { useEffect, useState } from 'react';
import { Check, Play, Plus, Star, X } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { getPlayableMediaForMovie } from '../../data/openDemoVideos';
import { Movie } from '../../types';

interface TitleDetailsModalProps {
  movie: Movie | null;
  allMovies?: Movie[];
  onClose: () => void;
  onSelectMovie?: (movie: Movie) => void;
}

export const TitleDetailsModal: React.FC<TitleDetailsModalProps> = ({
  movie,
  allMovies = [],
  onClose,
  onSelectMovie,
}) => {
  const [posterError, setPosterError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const isSaved = isInWatchlist(movie.id);

  const handlePlay = () => {
    const media = getPlayableMediaForMovie(movie);
    onClose();
    openPlayer(media);
  };

  const relatedTitles = allMovies
    .filter((m) => m.id !== movie.id && (m.genre === movie.genre || m.genres.some((g) => movie.genres.includes(g))))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neon-card border border-neon-border/80 rounded-2xl overflow-hidden shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-neon-dark/80 hover:bg-neon-dark text-neon-text border border-neon-border/60 flex items-center justify-center backdrop-blur-md transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-neon-dark">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neon-card via-neon-card/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neon-card via-transparent to-transparent w-1/2" />

          {/* Quick Actions on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {movie.featured && (
                  <span className="px-2 py-0.5 rounded bg-neon-accent/20 text-neon-accent border border-neon-accent/30 text-[10px] font-bold tracking-wider uppercase">
                    Original
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs font-semibold text-neon-text px-2 py-0.5 rounded bg-neon-surface/80 border border-neon-border/60">
                  <Star className="w-3.5 h-3.5 text-neon-amber fill-neon-amber" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neon-muted">{movie.releaseYear}</span>
                <span className="text-xs text-neon-border">•</span>
                <span className="text-xs text-neon-muted">{movie.duration}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold font-display text-neon-text drop-shadow">
                {movie.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-cyan transition-all transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-neon-dark" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border backdrop-blur-md text-sm font-semibold transition-all ${
                  isSaved
                    ? 'bg-neon-accent/20 border-neon-accent text-neon-accent'
                    : 'bg-neon-surface hover:bg-neon-surface-hover border-neon-border text-neon-text'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isSaved ? 'In My List' : 'Add to List'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Info */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Poster Thumbnail */}
            <div className="hidden md:block col-span-1">
              <div className="aspect-[2/3] rounded-xl overflow-hidden border border-neon-border/60 bg-neon-surface shadow-md">
                {!posterError ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    onError={() => setPosterError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neon-muted text-xs p-2 text-center">
                    {movie.title}
                  </div>
                )}
              </div>
            </div>

            {/* Right Synopsis & Metadata */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-neon-accent uppercase tracking-wider mb-1">
                  Synopsis
                </h4>
                <p className="text-neon-muted text-sm md:text-base leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Genres Chips */}
              <div>
                <h4 className="text-xs font-semibold text-neon-muted uppercase tracking-wider mb-2">
                  Genres & Moods
                </h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-lg bg-neon-surface text-neon-text text-xs border border-neon-border font-medium"
                    >
                      {g}
                    </span>
                  ))}
                  {movie.moodTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-neon-purple/10 text-neon-purple text-xs border border-neon-purple/30 font-medium capitalize"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Titles */}
          {relatedTitles.length > 0 && (
            <div className="pt-4 border-t border-neon-border/60">
              <h4 className="text-sm font-bold font-display text-neon-text mb-3">
                More Like This
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedTitles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectMovie && onSelectMovie(rel)}
                    className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-neon-border/60 cursor-pointer bg-neon-surface"
                  >
                    <img
                      src={rel.posterUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-dark via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold text-neon-text truncate group-hover:text-neon-accent transition-colors">
                        {rel.title}
                      </p>
                      <span className="text-[10px] text-neon-muted">{rel.releaseYear}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
