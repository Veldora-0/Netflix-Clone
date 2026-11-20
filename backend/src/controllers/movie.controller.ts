import { Request, Response } from 'express';
import { movieService } from '../services/movie.service';

export function getAllMovies(req: Request, res: Response): void {
  const { genre, featured, trending } = req.query;

  const filters = {
    genre: typeof genre === 'string' ? genre : undefined,
    featured: featured !== undefined ? featured === 'true' : undefined,
    trending: trending !== undefined ? trending === 'true' : undefined,
  };

  const movies = movieService.getAllMovies(filters);

  res.status(200).json({
    success: true,
    data: {
      count: movies.length,
      movies,
    },
  });
}

export function getMovieById(req: Request, res: Response): void {
  const id = String(req.params.id);
  const movie = movieService.getMovieById(id);

  if (!movie) {
    res.status(404).json({
      success: false,
      error: {
        message: `Movie with ID '${id}' was not found`,
      },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      movie,
    },
  });
}

export function searchMovies(req: Request, res: Response): void {
  const query = typeof req.query.q === 'string' ? req.query.q : '';
  const movies = movieService.searchMovies(query);

  res.status(200).json({
    success: true,
    data: {
      query,
      count: movies.length,
      movies,
    },
  });
}
