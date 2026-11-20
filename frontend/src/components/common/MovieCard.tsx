import React, { useState } from 'react';
import { Check, Info, Play, Plus, Star } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { getPlayableMediaForMovie } from '../../data/openDemoVideos';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  landscape?: boolean;
  progress?: number;
  onSelectDetails?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  landscape = false,
  progress,
  onSelectDetails,
}) => {
  const [imageError, setImageError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();

  const isSaved = isInWatchlist(movie.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const media = getPlayableMediaForMovie(movie);
    openPlayer(media);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectDetails) {
      onSelectDetails(movie);
    }
  };

  const imageUrl = landscape ? movie.backdropUrl || movie.posterUrl : movie.posterUrl;

  return (
    <div
      onClick={handleDetails}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-card border border-neon-border/40 hover:border-neon-accent/50 bg-neon-card select-none ${
        landscape ? 'aspect-video w-72 shrink-0' : 'aspect-[2/3] w-full'
      }`}
    >
      {/* Background Image / Fallback */}
      {!imageError ? (
        <img
          src={imageUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neon-card via-neon-surface to-neon-dark text-center">
          <span className="text-neon-accent font-display font-bold text-lg">{movie.title}</span>
          <span className="text-xs text-neon-muted mt-1">{movie.genre}</span>
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon-dark via-neon-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs z-10">
        <span className="px-2 py-0.5 rounded-md bg-neon-dark/80 backdrop-blur-md text-neon-text border border-neon-border/60 font-medium flex items-center gap-1 shadow">
          <Star className="w-3 h-3 text-neon-amber fill-neon-amber" />
          {movie.rating.toFixed(1)}
        </span>
        {movie.featured && (
          <span className="px-2 py-0.5 rounded-md bg-neon-accent/20 backdrop-blur-md text-neon-accent border border-neon-accent/40 font-semibold tracking-wider uppercase text-[10px]">
            Original
          </span>
        )}
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          onClick={handlePlay}
          title="Play Now"
          className="w-12 h-12 rounded-full bg-neon-accent hover:brightness-110 text-neon-dark flex items-center justify-center shadow-neon-cyan transform hover:scale-110 transition-all"
        >
          <Play className="w-5 h-5 fill-neon-dark ml-0.5" />
        </button>
        <button
          onClick={handleWatchlist}
          title={isSaved ? 'Remove from My List' : 'Add to My List'}
          className={`w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-neon-accent/20 border-neon-accent text-neon-accent'
              : 'bg-neon-surface/80 border-neon-border text-neon-text hover:border-neon-accent'
          }`}
        >
          {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
        <button
          onClick={handleDetails}
          title="More Details"
          className="w-10 h-10 rounded-full bg-neon-surface/80 hover:bg-neon-surface text-neon-text border border-neon-border hover:border-neon-purple flex items-center justify-center backdrop-blur-md transition-all"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Title & Details */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h4 className="text-sm font-bold font-display text-neon-text line-clamp-1 group-hover:text-neon-accent transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-neon-muted mt-0.5">
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span>{movie.duration}</span>
          <span>•</span>
          <span className="text-neon-text/80">{movie.genre}</span>
        </div>

        {/* Watch Progress Bar (if provided) */}
        {progress !== undefined && progress > 0 && (
          <div className="mt-2 w-full bg-neon-surface h-1.5 rounded-full overflow-hidden border border-neon-border/40">
            <div
              className="bg-neon-accent h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
