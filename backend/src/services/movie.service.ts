import { sampleMovies } from '../data/movies';
import { Movie } from '../types';

export class MovieService {
  public getAllMovies(filters?: { genre?: string; featured?: boolean; trending?: boolean }): Movie[] {
    let movies = [...sampleMovies];

    if (filters?.genre) {
      const targetGenre = filters.genre.toLowerCase();
      movies = movies.filter(
        (m) =>
          m.genre.toLowerCase() === targetGenre ||
          m.genres.some((g) => g.toLowerCase() === targetGenre)
      );
    }

    if (filters?.featured !== undefined) {
      movies = movies.filter((m) => m.featured === filters.featured);
    }

    if (filters?.trending !== undefined) {
      movies = movies.filter((m) => m.trending === filters.trending);
    }

    return movies;
  }

  public getMovieById(id: string): Movie | null {
    const movie = sampleMovies.find((m) => m.id === id);
    return movie || null;
  }

  public searchMovies(query: string): Movie[] {
    if (!query || !query.trim()) {
      return [];
    }

    const normalized = query.trim().toLowerCase();
    return sampleMovies.filter((m) => m.title.toLowerCase().includes(normalized));
  }
}

export const movieService = new MovieService();
