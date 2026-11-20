import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { historyService } from '../services/history.service';

export const upsertHistorySchema = z.object({
  movieId: z.string().min(1, 'movieId is required'),
  progress: z
    .number({ invalid_type_error: 'progress must be a number' })
    .min(0, 'progress must be between 0 and 100')
    .max(100, 'progress must be between 0 and 100'),
});

export function getHistory(req: Request, res: Response, next: NextFunction): void {
  try {
    const userId = req.user!.userId;
    const history = historyService.getHistory(userId);

    res.status(200).json({
      success: true,
      data: {
        count: history.length,
        history,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function upsertHistory(req: Request, res: Response, next: NextFunction): void {
  try {
    const userId = req.user!.userId;
    const { movieId, progress } = req.body;
    const item = historyService.upsertHistory(userId, movieId, progress);

    res.status(200).json({
      success: true,
      data: {
        message: 'Watch history updated successfully',
        item,
      },
    });
  } catch (error) {
    next(error);
  }
}
