import { sampleMovies } from '../data/movies';
import { MoodRecommendation, SupportedMood } from '../types';

interface MoodCriteria {
  primaryMoodTag: SupportedMood;
  genres: string[];
  reasons: Record<string, string>;
  defaultReason: string;
}

const MOOD_MAPPINGS: Record<SupportedMood, MoodCriteria> = {
  happy: {
    primaryMoodTag: 'happy',
    genres: ['Comedy', 'Animation', 'Family', 'Musical'],
    reasons: {
      'movie-2': 'A hilarious, witty comedy with charming robotic antics to brighten your day.',
      'movie-7': 'A feel-good, warm summer story capturing the timeless joy of friendship.',
      'movie-12': 'An uplifting, playful animated adventure guaranteed to make you smile.',
      'movie-17': 'A delightful culinary comedy celebrating passion, laughter, and tasty triumphs.',
      'movie-9': 'An upbeat musical romance infused with optimism and cheerful melodies.',
    },
    defaultReason: 'A joyful and light-hearted film selected to uplift your mood and bring laughter.',
  },
  sad: {
    primaryMoodTag: 'sad',
    genres: ['Drama', 'History', 'Music'],
    reasons: {
      'movie-3': 'A profoundly moving meditation on grief, memory, and healing through music.',
      'movie-8': 'An emotional drama exploring human vulnerability and courage against overwhelming odds.',
      'movie-13': 'A powerful historical drama honoring family bonds and quiet human resilience.',
      'movie-18': 'A poignant exploration of love, sacrifice, and separation across wartime years.',
    },
    defaultReason: 'A deeply emotional drama crafted for poignant storytelling and heartfelt reflection.',
  },
  romantic: {
    primaryMoodTag: 'romantic',
    genres: ['Romance', 'Musical', 'Drama'],
    reasons: {
      'movie-4': 'A luminous Parisian summer romance overflowing with warmth, charm, and jazz.',
      'movie-9': 'An enchanting modern love story blending acoustic melodies with city lights.',
      'movie-14': 'A picturesque romance set amid Tuscan vineyards exploring second chances in life and love.',
      'movie-19': 'A tender, unforgettable love story blossoming under Kyoto’s cherry blossoms.',
    },
    defaultReason: 'A passionate, romantic journey celebrating love, chemistry, and genuine connection.',
  },
  thriller: {
    primaryMoodTag: 'thriller',
    genres: ['Thriller', 'Action', 'Sci-Fi', 'Mystery', 'Crime', 'Noir'],
    reasons: {
      'movie-1': 'A high-octane cyberpunk neo-noir packed with relentless twists and sensory brilliance.',
      'movie-6': 'An exhilarating space chase full of kinetic action and unpredictable dangers.',
      'movie-11': 'A razor-sharp cyber-thriller detailing high-stakes cryptographic espionage.',
      'movie-16': 'A gritty, atmospheric cat-and-mouse detective thriller that keeps you guessing.',
      'movie-8': 'A nail-biting ocean survival tale where every second counts against the storm.',
    },
    defaultReason: 'A high-stakes, suspenseful thriller designed to keep your heart racing until the credits.',
  },
  relaxed: {
    primaryMoodTag: 'relaxed',
    genres: ['Documentary', 'Nature', 'Meditation'],
    reasons: {
      'movie-5': 'A breathtaking alpine visual experience paired with serene natural soundscapes.',
      'movie-10': 'Mesmerizing ocean cinematography that flows with calming underwater rhythms.',
      'movie-15': 'An atmospheric, meditative exploration of mountain temples and serene vistas.',
      'movie-20': 'A deeply peaceful visual spectacle of the northern lights to soothe your evening.',
    },
    defaultReason: 'A calming and visually captivating film perfect for unwinding after a long day.',
  },
};

export class RecommendationService {
  public getRecommendationsByMood(mood: SupportedMood): {
    mood: SupportedMood;
    count: number;
    recommendations: MoodRecommendation[];
  } {
    const config = MOOD_MAPPINGS[mood];
    if (!config) {
      return { mood, count: 0, recommendations: [] };
    }

    const matchedMovies = sampleMovies.filter(
      (m) =>
        m.moodTags.includes(config.primaryMoodTag) ||
        config.genres.some((g) => m.genres.map((mg) => mg.toLowerCase()).includes(g.toLowerCase()))
    );

    const recommendations: MoodRecommendation[] = matchedMovies.map((movie) => {
      const specificReason = config.reasons[movie.id];
      const reason = specificReason || `${config.defaultReason} Genre: ${movie.genre}.`;

      return {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        rating: movie.rating,
        genres: movie.genres,
        reason,
      };
    });

    return {
      mood,
      count: recommendations.length,
      recommendations,
    };
  }
}

export const recommendationService = new RecommendationService();
