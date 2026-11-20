import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Maximize,
  MinusSquare,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const VideoPlayerModal: React.FC = () => {
  const {
    activeMedia,
    isFullModalOpen,
    isPlaying,
    currentTime,
    duration,
    closePlayer,
    minimizeToMiniPlayer,
    togglePlay,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    seek,
    videoRef,
  } = usePlayer();

  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Auto-hide controls when mouse is inactive for 3s
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Keyboard controls
  useEffect(() => {
    if (!isFullModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        minimizeToMiniPlayer();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        seek(Math.max(0, currentTime - 10));
      } else if (e.key === 'ArrowRight') {
        seek(Math.min(duration, currentTime + 10));
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullModalOpen, currentTime, duration, togglePlay, seek, minimizeToMiniPlayer]);

  if (!isFullModalOpen || !activeMedia) return null;

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (currentTime > 0) {
        videoRef.current.currentTime = currentTime;
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handlePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // PiP not supported or blocked
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={activeMedia.videoUrl}
        className="absolute inset-0 w-full h-full object-contain cursor-pointer"
        autoPlay
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Header Bar */}
      <div
        className={`relative z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={minimizeToMiniPlayer}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            title="Back / Minimize to Mini-Player (Esc)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-white font-display font-bold text-lg md:text-xl drop-shadow">
              {activeMedia.title}
            </h2>
            {activeMedia.episodeTitle && (
              <p className="text-xs text-neon-accent font-medium">{activeMedia.episodeTitle}</p>
            )}
            <p className="text-[11px] text-zinc-400 max-w-lg truncate">{activeMedia.attribution}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={minimizeToMiniPlayer}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            title="Dock to Floating Mini-Player"
          >
            <MinusSquare className="w-5 h-5" />
          </button>
          <button
            onClick={closePlayer}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            title="Close Playback"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Big Play Button Flash when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-20 h-20 rounded-full bg-neon-accent/90 text-neon-dark flex items-center justify-center shadow-neon-cyan transform scale-110 transition-transform">
            <Play className="w-10 h-10 fill-neon-dark ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div
        className={`relative z-20 px-4 md:px-8 pb-6 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 space-y-3 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrub Bar */}
        <div className="relative group cursor-pointer py-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-accent hover:h-2.5 transition-all"
          />
          <div
            className="absolute top-2 left-0 h-1.5 bg-neon-accent rounded-lg pointer-events-none group-hover:h-2.5 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-sm">
          {/* Left Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-neon-accent text-neon-dark flex items-center justify-center hover:brightness-110 shadow-neon-cyan transition-transform transform active:scale-95"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-neon-dark" />
              ) : (
                <Play className="w-5 h-5 fill-neon-dark ml-0.5" />
              )}
            </button>

            <button
              onClick={() => seek(Math.max(0, currentTime - 10))}
              className="text-zinc-300 hover:text-white p-1"
              title="Replay 10 seconds (←)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => seek(Math.min(duration, currentTime + 10))}
              className="text-zinc-300 hover:text-white p-1"
              title="Forward 10 seconds (→)"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-zinc-300 hover:text-white p-1"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-neon-accent"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-xs text-zinc-300 font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 relative">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu((prev) => !prev)}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 bottom-full mb-2 bg-neon-surface/95 border border-neon-border/80 rounded-xl p-1.5 shadow-2xl backdrop-blur-md flex flex-col gap-1 min-w-[80px]">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedSelect(s)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        playbackSpeed === s
                          ? 'bg-neon-accent/20 text-neon-accent font-bold'
                          : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{s}x</span>
                      {playbackSpeed === s && <Check className="w-3.5 h-3.5 ml-2" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture-in-Picture */}
            <button
              onClick={handlePiP}
              className="text-zinc-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="text-zinc-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Toggle Fullscreen (F)"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
