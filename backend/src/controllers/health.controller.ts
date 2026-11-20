import { Request, Response } from 'express';
import { env } from '../config/env';
import { sampleMovies } from '../data/movies';

export function getHealth(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'NEONFLIX API',
      version: '1.0.0-mvp',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      dataSource: 'in-memory-json',
      catalogueSize: sampleMovies.length,
    },
  });
}
