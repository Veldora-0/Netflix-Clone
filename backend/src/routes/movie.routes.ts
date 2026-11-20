import { Router } from 'express';
import { getAllMovies, getMovieById, searchMovies } from '../controllers/movie.controller';

const router = Router();

// List movies with optional query parameters (?genre=, ?featured=true, ?trending=true)
router.get('/', getAllMovies);

// IMPORTANT: Search route registered BEFORE dynamic '/:id' to avoid route collision
router.get('/search', searchMovies);

// Get single movie by ID
router.get('/:id', getMovieById);

export default router;
