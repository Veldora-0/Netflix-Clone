import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, Play, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { HeroBanner } from '../components/common/HeroBanner';
import { MovieRow } from '../components/common/MovieRow';
import { TitleDetailsModal } from '../components/modal/TitleDetailsModal';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { getPlayableMediaForMovie } from '../data/openDemoVideos';
import { HistoryItem, Movie } from '../types';

export const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { isAuthenticated } = useAuth();
  const { openPlayer } = usePlayer();

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const moviesRes = await api.getMovies();
        if (!mounted) return;
        setMovies(moviesRes.movies || []);

        // Load viewing history if authenticated
        if (isAuthenticated) {
          try {
            const historyRes = await api.getHistory();
            if (mounted) {
              setHistory(historyRes.history || []);
            }
          } catch {
            // Silently tolerate if history cannot be fetched
          }
        }
      } catch (err) {
        console.error('Failed to load homepage catalogue:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const featuredList = movies.filter((m) => m.featured).slice(0, 4);
  const trendingList = movies.filter((m) => m.trending);
  const sciFiList = movies.filter((m) => m.genre === 'Sci-Fi' || m.genres.includes('Sci-Fi'));
  const comedyList = movies.filter((m) => m.genre === 'Comedy' || m.genres.includes('Comedy'));
  const romanceList = movies.filter((m) => m.genre === 'Romance' || m.genres.includes('Romance'));
  const thrillerList = movies.filter((m) => m.genre === 'Thriller' || m.genres.includes('Thriller'));
  const relaxedList = movies.filter((m) => m.genre === 'Documentary' || m.genres.includes('Nature'));

  const handleResumeHistory = (item: HistoryItem) => {
    if (!item.movie) return;
    const media = getPlayableMediaForMovie(item.movie);
    const initialSeconds = Math.round((item.progress / 100) * media.durationSeconds);
    openPlayer(media, initialSeconds);
  };

  return (
    <div className="pb-16 space-y-4">
      {/* 1. Cinematic Hero Section */}
      <HeroBanner
        featuredMovies={featuredList.length > 0 ? featuredList : movies.slice(0, 3)}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

      {/* 2. Continue Watching (Powered by real watch history API) */}
      {history.length > 0 && (
        <div className="py-4 space-y-3 px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-neon-accent rounded-full inline-block" />
            <h3 className="text-lg md:text-xl font-bold font-display text-neon-text tracking-wide">
              Continue Watching
            </h3>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {history.map((item) => {
              if (!item.movie) return null;
              return (
                <div key={item.movieId} className="w-72 shrink-0 space-y-1.5 group">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-neon-surface border border-neon-border/60 group-hover:border-neon-accent/60 transition-all cursor-pointer">
                    <img
                      src={item.movie.backdropUrl || item.movie.posterUrl}
                      alt={item.movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    {/* Resume Play Button Overlay */}
                    <button
                      onClick={() => handleResumeHistory(item)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-neon-accent/90 text-neon-dark flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 shadow-neon-cyan transition-all"
                    >
                      <Play className="w-5 h-5 fill-neon-dark ml-0.5" />
                    </button>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
                      <div
                        className="bg-neon-accent h-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neon-text truncate max-w-[180px]">
                      {item.movie.title}
                    </span>
                    <span className="text-[11px] text-neon-muted">{item.progress}% watched</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Trending Now (Landscape Cards) */}
      <MovieRow
        title="Trending Now"
        subtitle="Most watched titles across NEONFLIX this week"
        movies={trendingList}
        loading={loading}
        landscape={true}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

      {/* 4. Flagship Spotlight Feature Banners */}
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Finder Banner */}
          <Link
            to="/mood"
            className="group relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-neon-surface via-neon-card to-neon-dark border border-neon-accent/30 hover:border-neon-accent transition-all duration-300 shadow-lg hover:shadow-neon-cyan transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-neon-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center gap-2 text-neon-accent text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Flagship Recommendation Engine</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-neon-text group-hover:text-neon-accent transition-colors">
                  Smart Mood-Based Movie Finder
                </h3>
                <p className="text-neon-muted text-sm mt-1.5 max-w-sm">
                  Tell us how you feel tonight — happy, sad, romantic, thriller, or relaxed — and receive curated film recommendations.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-neon-accent pt-2">
                <span>Find by Mood</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Movie Quiz Challenge Banner */}
          <Link
            to="/quiz"
            className="group relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-neon-surface via-neon-card to-neon-dark border border-neon-purple/30 hover:border-neon-purple transition-all duration-300 shadow-lg hover:shadow-neon-purple transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center gap-2 text-neon-purple text-xs font-bold tracking-wider uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Cinema Trivia Challenge</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-neon-text group-hover:text-neon-purple transition-colors">
                  The NEONFLIX Movie Quiz
                </h3>
                <p className="text-neon-muted text-sm mt-1.5 max-w-sm">
                  10 rounds of server-scored cinema trivia. Compete against the backend answer engine and test your film literacy.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-neon-purple pt-2">
                <span>Start Challenge</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. Curated Categorical Rows */}
      <MovieRow
        title="Sci-Fi & Cyberpunk Worlds"
        subtitle="Mind-bending anomalies and neon-lit futures"
        movies={sciFiList}
        loading={loading}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

      <MovieRow
        title="Edge-of-Your-Seat Thrillers"
        subtitle="Relentless suspense, heists, and mysteries"
        movies={thrillerList}
        loading={loading}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

      <MovieRow
        title="Feel-Good Laughter & Joy"
        subtitle="Charming comedies and uplifting family adventures"
        movies={comedyList}
        loading={loading}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

      <MovieRow
        title="Romantic Nights"
        subtitle="Passionate encounters under city lights"
        movies={romanceList}
        loading={loading}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

      <MovieRow
        title="Mindful & Relaxing Escapes"
        subtitle="Stunning 4K natural soundscapes and meditative vistas"
        movies={relaxedList}
        loading={loading}
        onSelectDetails={(m) => setSelectedMovie(m)}
      />

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
