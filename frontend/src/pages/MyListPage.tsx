import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Film, Play, Trash2, User } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { TitleDetailsModal } from '../components/modal/TitleDetailsModal';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getPlayableMediaForMovie } from '../data/openDemoVideos';
import { Movie } from '../types';

export const MyListPage: React.FC = () => {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const { openPlayer } = usePlayer();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-neon-surface flex items-center justify-center text-neon-accent mx-auto border border-neon-border shadow-lg">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold font-display text-neon-text">
            Your Personal Watchlist
          </h1>
          <p className="text-neon-muted text-sm leading-relaxed">
            Sign in to your NEONFLIX account to curate your personal collection of must-watch films and series across devices.
          </p>
        </div>
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-cyan transition-all"
          >
            <User className="w-4 h-4" />
            <span>Sign In to View Watchlist</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-accent/10 border border-neon-accent/30 text-neon-accent text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Titles</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display text-neon-text">
          My Watchlist
        </h1>
        <p className="text-neon-muted text-sm md:text-base max-w-2xl">
          All your saved cinematic features, serialized shows, and documentaries ready for streaming.
        </p>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-neon-card animate-pulse border border-neon-border/40" />
          ))}
        </div>
      ) : watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {watchlist.map((item) => {
            const movie = item.movie;
            if (!movie) return null;

            return (
              <div
                key={item.movieId}
                className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-neon-card border border-neon-border/60 hover:border-neon-accent transition-all duration-300 shadow-md cursor-pointer select-none"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neon-dark via-neon-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Actions: Remove Button */}
                <div className="absolute top-2.5 right-2.5 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(item.movieId);
                    }}
                    title="Remove from My List"
                    className="w-8 h-8 rounded-full bg-black/70 hover:bg-rose-950/80 text-neon-muted hover:text-rose-400 border border-white/20 flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Center Play Button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const media = getPlayableMediaForMovie(movie);
                      openPlayer(media);
                    }}
                    title="Stream Now"
                    className="w-12 h-12 rounded-full bg-neon-accent hover:brightness-110 text-neon-dark flex items-center justify-center shadow-neon-cyan transform scale-110 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-neon-dark ml-0.5" />
                  </button>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <h4 className="text-sm font-bold font-display text-neon-text truncate group-hover:text-neon-accent transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-neon-muted mt-0.5">
                    <span>{movie.releaseYear}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Film}
          title="Your watchlist is empty"
          description="Explore our movie catalogue or try the Mood Finder to add films to your personal queue."
          actionText="Browse Movies"
          onAction={() => (window.location.href = '/movies')}
        />
      )}

      {/* Title Details Modal */}
      <TitleDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};
