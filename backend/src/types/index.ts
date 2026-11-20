export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  genres: string[];
  releaseYear: number;
  rating: number;
  duration: string;
  posterUrl: string;
  backdropUrl: string;
  moodTags: string[];
  featured: boolean;
  trending: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserSafe {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface WatchlistItem {
  movieId: string;
  addedAt: string;
  movie?: Movie;
}

export interface HistoryItem {
  movieId: string;
  progress: number;
  watchedAt: string;
  movie?: Movie;
}

export type SupportedMood = 'happy' | 'sad' | 'romantic' | 'thriller' | 'relaxed';

export interface MoodRecommendation {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  genres: string[];
  reason: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestionPublic {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizQuestionInternal {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizSubmissionAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResultDetail {
  questionId: string;
  question: string;
  submittedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmissionResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  results: QuizResultDetail[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface JwtUserPayload {
  userId: string;
  email: string;
}
