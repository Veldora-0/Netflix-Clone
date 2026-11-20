import { sampleMovies } from '../data/movies';
import { db } from '../data/store';
import { AppError } from '../middleware/error.middleware';
import { WatchlistItem } from '../types';

export class WatchlistService {
  public getWatchlist(userId: string): WatchlistItem[] {
    const items = db.getWatchlist(userId);
    // Hydrate each watchlist item with complete movie details
    return items.map((item) => ({
      movieId: item.movieId,
      addedAt: item.addedAt,
      movie: sampleMovies.find((m) => m.id === item.movieId),
    }));
  }

  public addToWatchlist(userId: string, movieId: string): WatchlistItem {
    const movie = sampleMovies.find((m) => m.id === movieId);
    if (!movie) {
      const error: AppError = new Error(`Movie with ID '${movieId}' was not found`);
      error.statusCode = 404;
      throw error;
    }

    try {
      const added = db.addToWatchlist(userId, movieId);
      return {
        ...added,
        movie,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'DUPLICATE_ENTRY') {
        const error: AppError = new Error('Movie is already in your watchlist');
        error.statusCode = 409;
        throw error;
      }
      throw err;
    }
  }

  public removeFromWatchlist(userId: string, movieId: string): void {
    const removed = db.removeFromWatchlist(userId, movieId);
    if (!removed) {
      const error: AppError = new Error(`Movie with ID '${movieId}' is not in your watchlist`);
      error.statusCode = 404;
      throw error;
    }
  }
}

export const watchlistService = new WatchlistService();
