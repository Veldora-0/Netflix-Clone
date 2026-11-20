import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import apiRouter from './routes';

export function createApp(): Application {
  const app: Application = express();

  // 1. Security Headers with Helmet
  app.use(helmet());

  // 2. Cross-Origin Resource Sharing (CORS) Configuration
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body Parsing Middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. Rate Limiting (Protection against basic spam/DDoS)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test',
    message: {
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again after 15 minutes',
      },
    },
  });
  app.use('/api', limiter);

  // 5. Welcome root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        name: 'NEONFLIX REST API',
        version: '1.0.0-mvp',
        status: 'online',
        healthCheck: '/api/v1/health',
        documentation: '/api/v1',
      },
    });
  });

  // 6. Mount API v1 router
  app.use('/api/v1', apiRouter);

  // 7. 404 Route Handler
  app.use(notFoundHandler);

  // 8. Centralized Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
