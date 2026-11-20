import React, { useEffect, useState } from 'react';
import { Play, Radio } from 'lucide-react';
import { api } from '../api/client';
import { MovieCard } from '../components/common/MovieCard';
import { TitleDetailsModal } from '../components/modal/TitleDetailsModal';
import { usePlayer } from '../context/PlayerContext';
import { DEMO_CHANNELS } from '../data/channelsData';
import { getPlayableMediaForMovie } from '../data/openDemoVideos';
import { Channel, Movie } from '../types';

export const ChannelsPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(DEMO_CHANNELS[0]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { openPlayer } = usePlayer();

  useEffect(() => {
    api.getMovies().then((res) => {
      setAllMovies(res.movies || []);
    }).catch(() => {});
  }, []);

  const channelMovies = allMovies.filter((m) =>
    selectedChannel.featuredTitles.includes(m.id)
  );

  const handleTuneIn = () => {
    if (channelMovies.length > 0) {
      const media = getPlayableMediaForMovie(channelMovies[0]);
      openPlayer(media);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-accent/10 border border-neon-accent/30 text-neon-accent text-xs font-semibold">
          <Radio className="w-3.5 h-3.5" />
          <span>Curated Hubs & Broadcasts</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display text-neon-text">
          NEON Channels
        </h1>
        <p className="text-neon-muted text-sm md:text-base max-w-2xl">
          Continuous themed broadcasts and curated genre universes with instant channel switching.
        </p>
      </div>

      {/* Channel Switcher Pills */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
        {DEMO_CHANNELS.map((ch) => {
          const isSelected = ch.id === selectedChannel.id;
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-neon-surface text-neon-accent border-neon-accent shadow-neon-cyan'
                  : 'bg-neon-card hover:bg-neon-surface text-neon-muted hover:text-neon-text border-neon-border/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-neon-accent animate-pulse' : 'bg-neon-border'}`} />
              <span>{ch.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Channel Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-neon-border bg-neon-card shadow-2xl">
        <div className="relative h-72 md:h-80 w-full overflow-hidden">
          <img
            src={selectedChannel.bannerUrl}
            alt={selectedChannel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neon-card via-neon-card/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neon-card via-neon-card/80 to-transparent w-full md:w-3/4" />

          {/* Banner Text */}
          <div className="absolute bottom-6 left-6 right-6 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                Live Broadcast
              </span>
              <span className="text-xs text-neon-muted font-medium">{selectedChannel.category} Hub</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold font-display text-neon-text">
              {selectedChannel.name}
            </h2>

            <p className="text-sm font-medium text-neon-accent">{selectedChannel.tagline}</p>
            <p className="text-xs md:text-sm text-neon-muted leading-relaxed line-clamp-2">
              {selectedChannel.description}
            </p>

            <div className="pt-1">
              <button
                onClick={handleTuneIn}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-cyan transition-all transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-neon-dark" />
                <span>Tune In Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Programming Grid */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-neon-text">
              Currently Airing on {selectedChannel.name}
            </h3>
            <span className="text-xs text-neon-muted">
              {channelMovies.length} Active Programmes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {channelMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectDetails={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Title Details Modal */}
      <TitleDetailsModal
        movie={selectedMovie}
        allMovies={allMovies}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={(m) => setSelectedMovie(m)}
      />
    </div>
  );
};
