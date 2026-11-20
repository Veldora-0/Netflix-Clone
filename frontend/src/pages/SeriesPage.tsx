import React, { useState } from 'react';
import { Layers, Play, Star, Tv } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { DEMO_SERIES } from '../data/seriesData';
import { PlayableMedia, Series, SeriesEpisode } from '../types';

export const SeriesPage: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState<Series>(DEMO_SERIES[0]);
  const [expandedSeason, setExpandedSeason] = useState<number>(1);
  const { openPlayer } = usePlayer();

  const handlePlayEpisode = (series: Series, episode: SeriesEpisode) => {
    const playableMedia: PlayableMedia = {
      id: `${series.id}-${episode.id}`,
      title: `${series.title}`,
      episodeTitle: `S${expandedSeason}:E${episode.episodeNumber} — ${episode.title}`,
      synopsis: episode.synopsis,
      backdropUrl: episode.thumbnailUrl || series.backdropUrl,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      durationSeconds: 734,
      attribution: 'Open Demo Stream — Tears of Steel (CC) Blender Foundation',
      isSeries: true,
    };
    openPlayer(playableMedia);
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-semibold">
          <Tv className="w-3.5 h-3.5" />
          <span>Episodic Television & Mini-Series</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display text-neon-text">
          Original Series & Shows
        </h1>
        <p className="text-neon-muted text-sm md:text-base max-w-2xl">
          Immerse in multi-season sagas, serialized mysteries, and award-winning limited dramas.
        </p>
      </div>

      {/* Series Spotlight Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-neon-border/80 bg-neon-card shadow-2xl">
        <div className="relative h-72 md:h-96 w-full">
          <img
            src={selectedSeries.backdropUrl}
            alt={selectedSeries.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neon-card via-neon-card/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neon-card via-neon-card/70 to-transparent w-full md:w-2/3" />

          {/* Details on Spotlight */}
          <div className="absolute bottom-6 left-6 right-6 max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-neon-purple/20 text-neon-purple border border-neon-purple/40 font-bold uppercase text-[10px]">
                NEON ORIGINAL SERIES
              </span>
              <span className="flex items-center gap-1 font-semibold text-neon-text px-2 py-0.5 rounded bg-neon-surface/80 border border-neon-border">
                <Star className="w-3.5 h-3.5 text-neon-amber fill-neon-amber" />
                {selectedSeries.rating.toFixed(1)}
              </span>
              <span className="text-neon-muted">{selectedSeries.releaseYear}</span>
              <span className="text-neon-border">•</span>
              <span className="text-neon-muted font-medium">
                {selectedSeries.totalSeasons} {selectedSeries.totalSeasons === 1 ? 'Season' : 'Seasons'}
              </span>
              <span className="text-neon-border">•</span>
              <span className="text-neon-text font-medium">{selectedSeries.genre}</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold font-display text-neon-text drop-shadow">
              {selectedSeries.title}
            </h2>

            <p className="text-neon-muted text-sm line-clamp-2 md:line-clamp-3">
              {selectedSeries.synopsis}
            </p>

            <button
              onClick={() => handlePlayEpisode(selectedSeries, selectedSeries.seasons[0].episodes[0])}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-purple hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-purple transition-all"
            >
              <Play className="w-4 h-4 fill-neon-dark" />
              <span>Watch S1:E1 Now</span>
            </button>
          </div>
        </div>

        {/* Episode Selector & Seasons */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neon-border/60 pb-4">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-neon-text">
              <Layers className="w-5 h-5 text-neon-purple" />
              <span>Episodes & Chapters</span>
            </div>

            {/* Season Tabs */}
            <div className="flex items-center gap-2">
              {selectedSeries.seasons.map((s) => (
                <button
                  key={s.seasonNumber}
                  onClick={() => setExpandedSeason(s.seasonNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    expandedSeason === s.seasonNumber
                      ? 'bg-neon-purple text-neon-dark font-bold'
                      : 'bg-neon-surface hover:bg-neon-surface-hover text-neon-muted hover:text-neon-text border border-neon-border'
                  }`}
                >
                  Season {s.seasonNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Episode List */}
          <div className="space-y-3">
            {selectedSeries.seasons
              .find((s) => s.seasonNumber === expandedSeason)
              ?.episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => handlePlayEpisode(selectedSeries, ep)}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3.5 rounded-xl bg-neon-surface/60 hover:bg-neon-surface border border-neon-border/60 hover:border-neon-purple/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                      <img
                        src={ep.thumbnailUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 fill-neon-purple text-neon-purple" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neon-purple">
                          Episode {ep.episodeNumber}
                        </span>
                        <span className="text-xs text-neon-muted">• {ep.duration}</span>
                      </div>
                      <h4 className="font-bold text-neon-text text-sm md:text-base group-hover:text-neon-purple transition-colors">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-neon-muted line-clamp-1 mt-0.5 max-w-xl">
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>

                  <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neon-card text-neon-purple border border-neon-purple/30 group-hover:bg-neon-purple group-hover:text-neon-dark text-xs font-semibold transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Stream</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Series Grid Catalogue */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-display text-neon-text">All Series</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {DEMO_SERIES.map((series) => {
            const isCurrent = series.id === selectedSeries.id;
            return (
              <div
                key={series.id}
                onClick={() => {
                  setSelectedSeries(series);
                  setExpandedSeason(1);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`group rounded-xl overflow-hidden bg-neon-card border transition-all cursor-pointer transform hover:-translate-y-1 ${
                  isCurrent
                    ? 'border-neon-purple shadow-neon-purple'
                    : 'border-neon-border/60 hover:border-neon-purple/60'
                }`}
              >
                <div className="aspect-video w-full overflow-hidden bg-neon-dark relative">
                  <img
                    src={series.backdropUrl}
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-neon-amber flex items-center gap-1 border border-neon-border/40">
                    <Star className="w-3 h-3 fill-neon-amber" />
                    {series.rating.toFixed(1)}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h4 className="font-bold font-display text-neon-text text-sm group-hover:text-neon-purple transition-colors truncate">
                    {series.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-neon-muted">
                    <span>{series.genre}</span>
                    <span>{series.totalSeasons} Seasons</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
