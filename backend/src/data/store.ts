import { HistoryItem, User, WatchlistItem } from '../types';

export class InMemoryStore {
  private users: Map<string, User> = new Map();
  private userWatchlists: Map<string, WatchlistItem[]> = new Map();
  private userHistory: Map<string, HistoryItem[]> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    // Pre-seed demo user: demo@neonflix.com / DemoPassword123!
    const demoUser: User = {
      id: 'user-demo-1',
      name: 'NEONFLIX Demo User',
      email: 'demo@neonflix.com',
      passwordHash: '$2a$10$c0bLWzsLXM4Oy2Fb05xTl.KacppfrE8bQ6.maFRgio/YCJTai20.O',
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    this.users.set(demoUser.id, demoUser);

    // Pre-seed demo user watchlist
    this.userWatchlists.set(demoUser.id, [
      { movieId: 'movie-1', addedAt: '2026-01-02T12:00:00.000Z' },
      { movieId: 'movie-4', addedAt: '2026-01-03T15:30:00.000Z' },
    ]);

    // Pre-seed demo user history
    this.userHistory.set(demoUser.id, [
      { movieId: 'movie-1', progress: 45, watchedAt: '2026-01-05T20:10:00.000Z' },
      { movieId: 'movie-6', progress: 85, watchedAt: '2026-01-04T18:00:00.000Z' },
    ]);
  }

  // --- Users ---
  public findUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  public findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public createUser(name: string, email: string, passwordHash: string): User {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  // --- Watchlist ---
  public getWatchlist(userId: string): WatchlistItem[] {
    return this.userWatchlists.get(userId) || [];
  }

  public addToWatchlist(userId: string, movieId: string): WatchlistItem {
    const current = this.getWatchlist(userId);
    const existing = current.find((item) => item.movieId === movieId);
    if (existing) {
      throw new Error('DUPLICATE_ENTRY');
    }
    const newItem: WatchlistItem = {
      movieId,
      addedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...current];
    this.userWatchlists.set(userId, updated);
    return newItem;
  }

  public removeFromWatchlist(userId: string, movieId: string): boolean {
    const current = this.getWatchlist(userId);
    const index = current.findIndex((item) => item.movieId === movieId);
    if (index === -1) {
      return false;
    }
    current.splice(index, 1);
    this.userWatchlists.set(userId, current);
    return true;
  }

  // --- History ---
  public getHistory(userId: string): HistoryItem[] {
    const items = this.userHistory.get(userId) || [];
    // Sort recently watched first
    return [...items].sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
  }

  public upsertHistory(userId: string, movieId: string, progress: number): HistoryItem {
    const current = this.userHistory.get(userId) || [];
    const existingIndex = current.findIndex((item) => item.movieId === movieId);
    const updatedItem: HistoryItem = {
      movieId,
      progress,
      watchedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      current[existingIndex] = updatedItem;
    } else {
      current.unshift(updatedItem);
    }

    this.userHistory.set(userId, current);
    return updatedItem;
  }

  // Utility for testing to reset state if needed
  public reset(): void {
    this.users.clear();
    this.userWatchlists.clear();
    this.userHistory.clear();
    this.seedInitialData();
  }
}

export const db = new InMemoryStore();
