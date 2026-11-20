import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { recommendationService } from '../services/recommendation.service';
import { SupportedMood } from '../types';

export const moodSchema = z.object({
  mood: z.enum(['happy', 'sad', 'romantic', 'thriller', 'relaxed'], {
    errorMap: () => ({
      message: "Supported moods are only: 'happy', 'sad', 'romantic', 'thriller', or 'relaxed'",
    }),
  }),
});

export function getMoodRecommendations(req: Request, res: Response, next: NextFunction): void {
  try {
    const { mood } = req.body as { mood: SupportedMood };
    const result = recommendationService.getRecommendationsByMood(mood);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
