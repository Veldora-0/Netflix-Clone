import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { PlayableMedia } from '../types';
import { useAuth } from './AuthContext';

interface PlayerContextValue {
  activeMedia: PlayableMedia | null;
  isPlaying: boolean;
  isFullModalOpen: boolean;
  isMiniPlayerOpen: boolean;
  currentTime: number;
  duration: number;
  openPlayer: (media: PlayableMedia, initialTimeSeconds?: number) => void;
  closePlayer: () => void;
  minimizeToMiniPlayer: () => void;
  expandToFullPlayer: () => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  seek: (time: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMedia, setActiveMedia] = useState<PlayableMedia | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState<boolean>(false);
  const [isMiniPlayerOpen, setIsMiniPlayerOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const { isAuthenticated } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSyncRef = useRef<number>(0);

  const openPlayer = useCallback((media: PlayableMedia, initialTimeSeconds = 0) => {
    setActiveMedia(media);
    setCurrentTime(initialTimeSeconds);
    setIsFullModalOpen(true);
    setIsMiniPlayerOpen(false);
    setIsPlaying(true);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setIsFullModalOpen(false);
    setIsMiniPlayerOpen(false);
    setActiveMedia(null);
    setCurrentTime(0);
  }, []);

  const minimizeToMiniPlayer = useCallback(() => {
    setIsFullModalOpen(false);
    setIsMiniPlayerOpen(true);
  }, []);

  const expandToFullPlayer = useCallback(() => {
    setIsMiniPlayerOpen(false);
    setIsFullModalOpen(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Sync watch history to backend periodically (every 10s) when authenticated
  useEffect(() => {
    if (!isAuthenticated || !activeMedia || !duration || duration <= 0) return;

    const progressPercentage = Math.min(100, Math.max(0, Math.round((currentTime / duration) * 100)));

    const now = Date.now();
    if (now - lastSyncRef.current > 10000 && progressPercentage > 0) {
      lastSyncRef.current = now;
      api.upsertHistory(activeMedia.id, progressPercentage).catch(() => {
        // Silently tolerate background sync misses
      });
    }
  }, [currentTime, duration, activeMedia, isAuthenticated]);

  return (
    <PlayerContext.Provider
      value={{
        activeMedia,
        isPlaying,
        isFullModalOpen,
        isMiniPlayerOpen,
        currentTime,
        duration,
        openPlayer,
        closePlayer,
        minimizeToMiniPlayer,
        expandToFullPlayer,
        togglePlay,
        setIsPlaying,
        setCurrentTime,
        setDuration,
        seek,
        videoRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
