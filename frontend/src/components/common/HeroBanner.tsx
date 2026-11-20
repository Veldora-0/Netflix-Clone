import React, { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Info, Play, Plus, Star } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { getPlayableMediaForMovie } from '../../data/openDemoVideos';
import { Movie } from '../../types';

interface HeroBannerProps {
  featuredMovies: Movie[];
  onSelectDetails?: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredMovies, onSelectDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  // Auto-advance hero carousel every 8 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!currentMovie) return null;

  const isSaved = isInWatchlist(currentMovie.id);

  const handlePlay = () => {
    const media = getPlayableMediaForMovie(currentMovie);
    openPlayer(media);
  };

  const handleDetails = () => {
    if (onSelectDetails) {
      onSelectDetails(currentMovie);
    }
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[720px] overflow-hidden select-none">
      {/* Background Backdrop Artwork with Crossfade */}
      <div className="absolute inset-0">
        <img
          key={currentMovie.id}
          src={currentMovie.backdropUrl || currentMovie.posterUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-100 animate-fade-in"
        />
        {/* Layered Gradient Overlays for High Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark via-neon-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-dark via-neon-dark/60 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-neon-dark/50" />
      </div>

      {/* Content Positioning */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-12 pb-14 max-w-4xl space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-neon-accent/20 backdrop-blur-md text-neon-accent border border-neon-accent/40 font-bold uppercase tracking-widest text-[11px] shadow-sm">
            NEONFLIX ORIGINAL
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neon-card/80 backdrop-blur-md text-neon-text border border-neon-border/60 font-semibold text-xs shadow-sm">
            <Star className="w-3.5 h-3.5 text-neon-amber fill-neon-amber" />
            {currentMovie.rating.toFixed(1)}
          </span>
          <span className="px-2 py-0.5 text-neon-muted font-medium">{currentMovie.releaseYear}</span>
          <span className="text-neon-border">•</span>
          <span className="px-2 py-0.5 text-neon-muted font-medium">{currentMovie.duration}</span>
          <span className="text-neon-border">•</span>
          <span className="px-2 py-0.5 rounded bg-neon-surface/60 text-neon-text/90 text-xs border border-neon-border/40 font-medium">
            {currentMovie.genre}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-neon-text drop-shadow-md">
          {currentMovie.title}
        </h1>

        {/* Synopsis */}
        <p className="text-sm md:text-base text-neon-muted max-w-2xl line-clamp-3 leading-relaxed drop-shadow-sm font-normal">
          {currentMovie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm md:text-base shadow-neon-cyan transition-all transform hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 fill-neon-dark" />
            <span>Play Now</span>
          </button>

          <button
            onClick={handleDetails}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-surface/80 hover:bg-neon-surface text-neon-text border border-neon-border/80 hover:border-neon-purple text-sm md:text-base font-semibold backdrop-blur-md transition-all"
          >
            <Info className="w-5 h-5 text-neon-purple" />
            <span>More Info</span>
          </button>

          <button
            onClick={() => toggleWatchlist(currentMovie)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-md text-sm md:text-base font-semibold transition-all ${
              isSaved
                ? 'bg-neon-accent/20 border-neon-accent text-neon-accent'
                : 'bg-neon-surface/80 hover:bg-neon-surface border-neon-border/80 text-neon-text hover:border-neon-accent'
            }`}
          >
            {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{isSaved ? 'In My List' : 'Add to List'}</span>
          </button>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Dots */}
      {featuredMovies.length > 1 && (
        <>
          <div className="absolute right-6 bottom-14 z-20 hidden md:flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1))
              }
              className="w-9 h-9 rounded-full bg-neon-surface/80 hover:bg-neon-surface text-neon-text flex items-center justify-center border border-neon-border backdrop-blur-md transition-all"
              title="Previous Featured"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)}
              className="w-9 h-9 rounded-full bg-neon-surface/80 hover:bg-neon-surface text-neon-text flex items-center justify-center border border-neon-border backdrop-blur-md transition-all"
              title="Next Featured"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute left-4 md:left-12 bottom-5 z-20 flex items-center gap-2">
            {featuredMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-neon-accent' : 'w-2 bg-neon-surface hover:bg-neon-muted'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
