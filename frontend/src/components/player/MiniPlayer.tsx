import React from 'react';
import { Maximize2, Pause, Play, X } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const MiniPlayer: React.FC = () => {
  const {
    activeMedia,
    isMiniPlayerOpen,
    isPlaying,
    currentTime,
    duration,
    expandToFullPlayer,
    closePlayer,
    togglePlay,
    videoRef,
  } = usePlayer();

  if (!isMiniPlayerOpen || !activeMedia) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={expandToFullPlayer}
      className="fixed bottom-6 right-6 z-40 w-80 md:w-96 rounded-2xl overflow-hidden shadow-2xl border border-neon-accent/50 bg-neon-dark/95 backdrop-blur-xl group cursor-pointer animate-slide-up transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Video Preview Container */}
      <div className="relative aspect-video w-full bg-black overflow-hidden">
        {/* We reuse the video element by attaching it or showing thumbnail */}
        <video
          ref={videoRef}
          src={activeMedia.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Header Controls */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          <span className="px-2 py-0.5 rounded bg-neon-dark/80 backdrop-blur-md text-neon-accent text-[10px] font-bold tracking-wider uppercase border border-neon-accent/30">
            Playing
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                expandToFullPlayer();
              }}
              title="Expand to Full Player"
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePlayer();
              }}
              title="Close Playback"
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Play Button on hover */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-10 h-10 rounded-full bg-neon-accent text-neon-dark flex items-center justify-center shadow-neon-cyan transform hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-neon-dark" />
            ) : (
              <Play className="w-5 h-5 fill-neon-dark ml-0.5" />
            )}
          </button>
        </div>

        {/* Bottom Details & Progress */}
        <div className="absolute bottom-2 left-3 right-3 z-10">
          <p className="text-white font-display font-bold text-sm truncate">{activeMedia.title}</p>
          <div className="mt-1 w-full bg-white/20 h-1 rounded-full overflow-hidden">
            <div
              className="bg-neon-accent h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
