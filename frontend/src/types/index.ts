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
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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

export interface MoodResponse {
  mood: SupportedMood;
  count: number;
  recommendations: MoodRecommendation[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
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

export interface SeriesEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnailUrl: string;
}

export interface SeriesSeason {
  seasonNumber: number;
  title: string;
  episodes: SeriesEpisode[];
}

export interface Series {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  genres: string[];
  releaseYear: number;
  rating: number;
  totalSeasons: number;
  posterUrl: string;
  backdropUrl: string;
  seasons: SeriesSeason[];
}

export interface Channel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bannerUrl: string;
  badgeColor: string;
  category: string;
  featuredTitles: string[]; // movie or series IDs
}

export interface PlayableMedia {
  id: string;
  title: string;
  synopsis: string;
  backdropUrl: string;
  videoUrl: string;
  durationSeconds: number;
  attribution: string;
  isSeries?: boolean;
  episodeTitle?: string;
}
