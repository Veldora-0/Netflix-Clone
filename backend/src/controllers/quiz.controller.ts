import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { quizService } from '../services/quiz.service';
import { QuizSubmissionAnswer } from '../types';

export const quizSubmissionSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, 'questionId is required'),
        optionId: z.string().min(1, 'optionId is required'),
      }),
      { required_error: 'answers array is required' }
    )
    .min(1, 'At least one answer must be submitted'),
});

export function getQuizQuestions(req: Request, res: Response): void {
  const questions = quizService.getQuestions();

  res.status(200).json({
    success: true,
    data: {
      count: questions.length,
      questions,
    },
  });
}

export function submitQuiz(req: Request, res: Response, next: NextFunction): void {
  try {
    const { answers } = req.body as { answers: QuizSubmissionAnswer[] };
    const result = quizService.submitQuiz(answers);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
