import {
  AuthResponse,
  HistoryItem,
  MoodResponse,
  Movie,
  QuizQuestion,
  QuizSubmissionAnswer,
  QuizSubmissionResult,
  SupportedMood,
  WatchlistItem,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = localStorage.getItem('neonflix_token');

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data?.error?.details);
  }

  return data.data as T;
}

export const api = {
  // Health
  getHealth: () => request<{ status: string; uptimeSeconds: number; catalogueSize: number }>('/health'),

  // Movies
  getMovies: (filters?: { genre?: string; featured?: boolean; trending?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters?.trending !== undefined) params.append('trending', String(filters.trending));
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ count: number; movies: Movie[] }>(`/movies${query}`);
  },

  getMovieById: (id: string) => request<{ movie: Movie }>(`/movies/${id}`),

  searchMovies: (query: string) =>
    request<{ query: string; count: number; movies: Movie[] }>(`/movies/search?q=${encodeURIComponent(query)}`),

  // Authentication
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  // Watchlist (Protected)
  getWatchlist: () => request<{ count: number; watchlist: WatchlistItem[] }>('/watchlist'),

  addToWatchlist: (movieId: string) =>
    request<{ message: string; item: WatchlistItem }>('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    }),

  removeFromWatchlist: (movieId: string) =>
    request<{ message: string; movieId: string }>(`/watchlist/${movieId}`, {
      method: 'DELETE',
    }),

  // History / Continue Watching (Protected)
  getHistory: () => request<{ count: number; history: HistoryItem[] }>('/history'),

  upsertHistory: (movieId: string, progress: number) =>
    request<{ message: string; item: HistoryItem }>('/history', {
      method: 'POST',
      body: JSON.stringify({ movieId, progress }),
    }),

  // Mood Finder (Flagship Feature 1)
  getMoodRecommendations: (mood: SupportedMood) =>
    request<MoodResponse>('/recommendations/mood', {
      method: 'POST',
      body: JSON.stringify({ mood }),
    }),

  // Movie Quiz (Flagship Feature 2)
  getQuizQuestions: () => request<{ count: number; questions: QuizQuestion[] }>('/quiz/questions'),

  submitQuiz: (answers: QuizSubmissionAnswer[]) =>
    request<QuizSubmissionResult>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
};
