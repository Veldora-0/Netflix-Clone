import { sampleMovies } from '../data/movies';
import { db } from '../data/store';
import { AppError } from '../middleware/error.middleware';
import { HistoryItem } from '../types';

export class HistoryService {
  public getHistory(userId: string): HistoryItem[] {
    const items = db.getHistory(userId);
    // Hydrate each history item with movie details
    return items.map((item) => ({
      movieId: item.movieId,
      progress: item.progress,
      watchedAt: item.watchedAt,
      movie: sampleMovies.find((m) => m.id === item.movieId),
    }));
  }

  public upsertHistory(userId: string, movieId: string, progress: number): HistoryItem {
    const movie = sampleMovies.find((m) => m.id === movieId);
    if (!movie) {
      const error: AppError = new Error(`Movie with ID '${movieId}' was not found`);
      error.statusCode = 404;
      throw error;
    }

    if (progress < 0 || progress > 100) {
      const error: AppError = new Error('Playback progress must be an integer between 0 and 100');
      error.statusCode = 400;
      throw error;
    }

    const updated = db.upsertHistory(userId, movieId, Math.round(progress));
    return {
      ...updated,
      movie,
    };
  }
}

export const historyService = new HistoryService();
