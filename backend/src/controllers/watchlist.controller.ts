import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { watchlistService } from '../services/watchlist.service';

export const addWatchlistSchema = z.object({
  movieId: z.string().min(1, 'movieId is required'),
});

export function getWatchlist(req: Request, res: Response, next: NextFunction): void {
  try {
    const userId = req.user!.userId;
    const watchlist = watchlistService.getWatchlist(userId);

    res.status(200).json({
      success: true,
      data: {
        count: watchlist.length,
        watchlist,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function addToWatchlist(req: Request, res: Response, next: NextFunction): void {
  try {
    const userId = req.user!.userId;
    const { movieId } = req.body;
    const item = watchlistService.addToWatchlist(userId, movieId);

    res.status(201).json({
      success: true,
      data: {
        message: 'Movie added to watchlist successfully',
        item,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function removeFromWatchlist(req: Request, res: Response, next: NextFunction): void {
  try {
    const userId = req.user!.userId;
    const id = String(req.params.id);
    watchlistService.removeFromWatchlist(userId, id);

    res.status(200).json({
      success: true,
      data: {
        message: `Movie '${id}' removed from watchlist successfully`,
        movieId: id,
      },
    });
  } catch (error) {
    next(error);
  }
}
