import React, { useState } from 'react';
import {
  Compass,
  Film,
  Flame,
  Heart,
  Moon,
  Play,
  RotateCcw,
  Smile,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { api, ApiError } from '../api/client';
import { ErrorState } from '../components/common/ErrorState';
import { TitleDetailsModal } from '../components/modal/TitleDetailsModal';
import { usePlayer } from '../context/PlayerContext';
import { getPlayableMediaForMovie } from '../data/openDemoVideos';
import { MoodRecommendation, Movie, SupportedMood } from '../types';

interface MoodOption {
  id: SupportedMood;
  label: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  glowClass: string;
  bgGradient: string;
}

const MOODS: MoodOption[] = [
  {
    id: 'happy',
    label: 'Happy & Upbeat',
    tagline: 'Laughter, Joy & Feel-Good Fun',
    description: 'Witty comedies, animated adventures, and delightful stories to lift your spirits.',
    icon: Smile,
    accentColor: 'text-amber-400',
    borderColor: 'hover:border-amber-400/80',
    glowClass: 'shadow-neon-cyan',
    bgGradient: 'from-amber-500/10 via-neon-surface to-neon-dark',
  },
  {
    id: 'thriller',
    label: 'Thriller & Suspense',
    tagline: 'Heart-Pounding Adrenaline',
    description: 'Cyberpunk neo-noir, cyber espionage, high-stakes heists, and unpredictable twists.',
    icon: Flame,
    accentColor: 'text-neon-accent',
    borderColor: 'hover:border-neon-accent/80',
    glowClass: 'shadow-neon-cyan',
    bgGradient: 'from-teal-500/10 via-neon-surface to-neon-dark',
  },
  {
    id: 'romantic',
    label: 'Romantic & Passionate',
    tagline: 'Connection, Chemistry & Devotion',
    description: 'Enchanting love stories under Parisian lights and cherry blossom seasons.',
    icon: Heart,
    accentColor: 'text-rose-400',
    borderColor: 'hover:border-rose-400/80',
    glowClass: 'shadow-neon-purple',
    bgGradient: 'from-rose-500/10 via-neon-surface to-neon-dark',
  },
  {
    id: 'relaxed',
    label: 'Relaxed & Serene',
    tagline: 'Meditation, Ambient Nature & Peace',
    description: 'Breathtaking alpine vistas, ocean soundscapes, and calming northern lights.',
    icon: Moon,
    accentColor: 'text-sky-400',
    borderColor: 'hover:border-sky-400/80',
    glowClass: 'shadow-neon-cyan',
    bgGradient: 'from-sky-500/10 via-neon-surface to-neon-dark',
  },
  {
    id: 'sad',
    label: 'Poignant & Emotional',
    tagline: 'Reflective, Moving & Deep',
    description: 'Deeply touching character journeys, family resilience, and emotional healing.',
    icon: Compass,
    accentColor: 'text-neon-purple',
    borderColor: 'hover:border-neon-purple/80',
    glowClass: 'shadow-neon-purple',
    bgGradient: 'from-purple-500/10 via-neon-surface to-neon-dark',
  },
];

export const MoodFinderPage: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<SupportedMood | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMovieModal, setActiveMovieModal] = useState<Movie | null>(null);
  const { openPlayer } = usePlayer();

  const handleSelectMood = async (mood: SupportedMood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMoodRecommendations(mood);
      setRecommendations(res.recommendations || []);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : 'Could not fetch mood recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setRecommendations([]);
    setError(null);
  };

  const handleOpenPlay = async (rec: MoodRecommendation) => {
    try {
      const movieRes = await api.getMovieById(rec.id);
      const media = getPlayableMediaForMovie(movieRes.movie);
      openPlayer(media);
    } catch {
      // Fallback
    }
  };

  const handleOpenDetails = async (rec: MoodRecommendation) => {
    try {
      const movieRes = await api.getMovieById(rec.id);
      setActiveMovieModal(movieRes.movie);
    } catch {
      // Fallback
    }
  };

  const activeMoodConfig = MOODS.find((m) => m.id === selectedMood);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-accent/10 border border-neon-accent/30 text-neon-accent text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flagship Discovery Feature</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display text-neon-text tracking-tight">
          What are you in the mood for tonight?
        </h1>
        <p className="text-neon-muted text-sm md:text-base leading-relaxed">
          Select your vibe below and let our deterministic recommendation engine pair you with the ideal cinematic masterpiece.
        </p>
      </div>

      {/* Mood Selector Grid */}
      {!selectedMood ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => handleSelectMood(mood.id)}
                className={`group text-left p-6 rounded-2xl border border-neon-border/60 ${mood.borderColor} bg-gradient-to-b ${mood.bgGradient} transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-neon-surface flex items-center justify-center ${mood.accentColor} border border-neon-border/60 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-neon-text group-hover:text-neon-accent transition-colors">
                      {mood.label}
                    </h3>
                    <p className="text-xs font-semibold text-neon-muted mt-0.5">{mood.tagline}</p>
                  </div>
                </div>
                <p className="text-xs text-neon-muted/80 mt-4 leading-relaxed">{mood.description}</p>
              </button>
            );
          })}
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-fade-in">
          {/* Active Mood Pill & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neon-card border border-neon-border">
            <div className="flex items-center gap-3">
              {activeMoodConfig && (
                <div className={`p-2 rounded-xl bg-neon-surface ${activeMoodConfig.accentColor}`}>
                  <activeMoodConfig.icon className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-xs text-neon-muted">Current Recommendation Vibe:</span>
                <h4 className="text-base font-bold font-display text-neon-text capitalize">
                  {activeMoodConfig?.label}
                </h4>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-surface hover:bg-neon-surface-hover text-neon-text border border-neon-border text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-neon-accent" />
              <span>Choose Another Mood</span>
            </button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 rounded-2xl bg-neon-card/60 border border-neon-border/40 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && <ErrorState message={error} onRetry={() => handleSelectMood(selectedMood)} />}

          {/* Recommendations Cards List */}
          {!loading && !error && recommendations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-neon-muted">
                <Zap className="w-4 h-4 text-neon-accent" />
                <span>Found {recommendations.length} recommended titles tailored to your mood</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-neon-card/80 hover:bg-neon-card border border-neon-border/60 hover:border-neon-accent/60 transition-all duration-300 shadow-lg"
                  >
                    {/* Poster */}
                    <div
                      onClick={() => handleOpenDetails(rec)}
                      className="relative w-full sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shrink-0 cursor-pointer bg-neon-surface shadow-md"
                    >
                      <img
                        src={rec.posterUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-neon-amber flex items-center gap-1 border border-neon-border">
                        <Star className="w-3 h-3 fill-neon-amber" />
                        {rec.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Metadata & Curated Reason */}
                    <div className="flex flex-col justify-between flex-1 space-y-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {rec.genres.map((g) => (
                            <span
                              key={g}
                              className="px-2 py-0.5 rounded-md bg-neon-surface text-[10px] font-medium text-neon-muted border border-neon-border/60"
                            >
                              {g}
                            </span>
                          ))}
                        </div>

                        <h3
                          onClick={() => handleOpenDetails(rec)}
                          className="font-display font-bold text-lg md:text-xl text-neon-text group-hover:text-neon-accent transition-colors cursor-pointer"
                        >
                          {rec.title}
                        </h3>

                        {/* Exact Curated Reason from Backend */}
                        <div className="p-3 rounded-xl bg-neon-surface/60 border border-neon-accent/20">
                          <p className="text-xs text-neon-accent font-medium leading-relaxed italic">
                            "{rec.reason}"
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleOpenPlay(rec)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-xs shadow-neon-cyan transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-neon-dark" />
                          <span>Stream</span>
                        </button>
                        <button
                          onClick={() => handleOpenDetails(rec)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-surface hover:bg-neon-surface-hover text-neon-text border border-neon-border text-xs font-semibold transition-all"
                        >
                          <Film className="w-3.5 h-3.5 text-neon-muted" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Title Details Modal */}
      <TitleDetailsModal
        movie={activeMovieModal}
        onClose={() => setActiveMovieModal(null)}
      />
    </div>
  );
};
