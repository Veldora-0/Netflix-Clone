import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import { Movie, WatchlistItem } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WatchlistContextValue {
  watchlist: WatchlistItem[];
  loading: boolean;
  isInWatchlist: (movieId: string) => boolean;
  toggleWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (movieId: string) => Promise<void>;
  refreshWatchlist: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const refreshWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getWatchlist();
      setWatchlist(res.watchlist || []);
    } catch {
      // If session expired or failed, clear watchlist
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const isInWatchlist = (movieId: string): boolean => {
    return watchlist.some((item) => item.movieId === movieId);
  };

  const toggleWatchlist = async (movie: Movie): Promise<void> => {
    if (!isAuthenticated) {
      showToast('Please log in to save titles to your Watchlist', 'info');
      return;
    }

    const exists = isInWatchlist(movie.id);

    if (exists) {
      try {
        await api.removeFromWatchlist(movie.id);
        setWatchlist((prev) => prev.filter((item) => item.movieId !== movie.id));
        showToast(`Removed "${movie.title}" from My List`, 'info');
      } catch (err: unknown) {
        const msg = err instanceof ApiError ? err.message : 'Could not remove from watchlist';
        showToast(msg, 'error');
      }
    } else {
      try {
        const res = await api.addToWatchlist(movie.id);
        setWatchlist((prev) => [res.item, ...prev]);
        showToast(`Added "${movie.title}" to My List!`, 'success');
      } catch (err: unknown) {
        const msg = err instanceof ApiError ? err.message : 'Could not add to watchlist';
        showToast(msg, 'error');
      }
    }
  };

  const removeFromWatchlist = async (movieId: string): Promise<void> => {
    if (!isAuthenticated) return;
    try {
      await api.removeFromWatchlist(movieId);
      setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId));
      showToast('Removed title from My List', 'info');
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Could not remove from watchlist';
      showToast(msg, 'error');
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        isInWatchlist,
        toggleWatchlist,
        removeFromWatchlist,
        refreshWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
