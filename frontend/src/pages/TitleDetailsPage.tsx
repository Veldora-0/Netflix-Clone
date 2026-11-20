import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Play, Plus, Star } from 'lucide-react';
import { api, ApiError } from '../api/client';
import { ErrorState } from '../components/common/ErrorState';
import { usePlayer } from '../context/PlayerContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getPlayableMediaForMovie } from '../data/openDemoVideos';
import { Movie } from '../types';

export const TitleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();

  const fetchTitle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMovieById(id);
      setMovie(res.movie);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : 'Failed to load title details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitle();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-neon-accent border-t-transparent animate-spin" />
        <span className="text-neon-muted text-sm">Loading cinematic details...</span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-xl mx-auto">
        <ErrorState message={error || 'Title not found'} onRetry={fetchTitle} />
      </div>
    );
  }

  const isSaved = isInWatchlist(movie.id);

  const handlePlay = () => {
    const media = getPlayableMediaForMovie(movie);
    openPlayer(media);
  };

  return (
    <div className="pt-20 pb-20">
      {/* Full Hero Section with Backdrop */}
      <div className="relative h-[60vh] min-h-[420px] max-h-[600px] w-full overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark via-neon-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-dark via-neon-dark/80 to-transparent w-full md:w-2/3" />

        {/* Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neon-dark/80 hover:bg-neon-dark text-neon-text border border-neon-border/60 backdrop-blur-md text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Title & Metadata */}
        <div className="absolute bottom-10 left-6 md:left-16 right-6 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {movie.featured && (
              <span className="px-2.5 py-0.5 rounded-md bg-neon-accent/20 text-neon-accent border border-neon-accent/30 font-bold uppercase text-[10px]">
                Original Feature
              </span>
            )}
            <span className="flex items-center gap-1 font-semibold text-neon-text px-2.5 py-0.5 rounded bg-neon-card/80 border border-neon-border">
              <Star className="w-3.5 h-3.5 text-neon-amber fill-neon-amber" />
              {movie.rating.toFixed(1)}
            </span>
            <span className="text-neon-muted">{movie.releaseYear}</span>
            <span className="text-neon-border">•</span>
            <span className="text-neon-muted">{movie.duration}</span>
            <span className="text-neon-border">•</span>
            <span className="text-neon-text font-medium">{movie.genre}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display text-neon-text drop-shadow">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm md:text-base shadow-neon-cyan transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-neon-dark" />
              <span>Stream Now</span>
            </button>

            <button
              onClick={() => toggleWatchlist(movie)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border backdrop-blur-md text-sm md:text-base font-semibold transition-all ${
                isSaved
                  ? 'bg-neon-accent/20 border-neon-accent text-neon-accent'
                  : 'bg-neon-surface hover:bg-neon-surface-hover border-neon-border text-neon-text'
              }`}
            >
              {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 mt-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 hidden md:block">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-neon-border shadow-2xl bg-neon-card">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-neon-accent uppercase tracking-wider mb-2">
                Plot Summary
              </h3>
              <p className="text-neon-muted text-base md:text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-neon-muted uppercase tracking-wider mb-2">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3.5 py-1.5 rounded-xl bg-neon-surface border border-neon-border text-xs font-semibold text-neon-text"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-neon-muted uppercase tracking-wider mb-2">
                Mood Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.moodTags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-medium capitalize"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
