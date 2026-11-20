import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(`[Server Error] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode >= 500 && env.NODE_ENV === 'production' ? 'An unexpected server error occurred' : message,
      ...(env.NODE_ENV !== 'production' && { stack: err.stack, details: err.details }),
    },
  });
}
