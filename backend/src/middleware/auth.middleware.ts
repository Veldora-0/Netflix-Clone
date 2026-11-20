import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { db } from '../data/store';
import { JwtUserPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Authentication token required',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtUserPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid authentication token payload',
        },
      });
      return;
    }

    // Verify user still exists in storage
    const user = db.findUserById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'User account no longer exists. Please log in again.',
        },
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired authentication token',
      },
    });
  }
}
