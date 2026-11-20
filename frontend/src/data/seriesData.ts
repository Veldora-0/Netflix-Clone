import { Series } from '../types';

export const DEMO_SERIES: Series[] = [
  {
    id: 'series-1',
    title: 'Neon Underground',
    synopsis: 'A syndicate of underground bio-hackers in New Berlin battle automated surveillance cartels while developing an encrypted global neural network.',
    genre: 'Cyberpunk Thriller',
    genres: ['Cyberpunk', 'Sci-Fi', 'Thriller'],
    releaseYear: 2024,
    rating: 9.1,
    totalSeasons: 2,
    posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Signal Genesis',
        episodes: [
          {
            id: 's1-e1',
            episodeNumber: 1,
            title: 'Ghost Packet',
            duration: '48m',
            synopsis: 'Cipher technician Kael discovers unauthorized encrypted handshakes executing across the orbital relay grid.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
          },
          {
            id: 's1-e2',
            episodeNumber: 2,
            title: 'Sub-Level Protocol',
            duration: '52m',
            synopsis: 'In the forgotten flooded metro stations, the resistance tests their first neural mesh network.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        seasonNumber: 2,
        title: 'Season 2: Zero Day',
        episodes: [
          {
            id: 's2-e1',
            episodeNumber: 1,
            title: 'Blackout Frequency',
            duration: '54m',
            synopsis: 'The mega-corporation unleashes hunter-killer algorithmic drones through Sector 9.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'series-2',
    title: 'The Obsidian Crown',
    synopsis: 'Intrigue, betrayal, and dark political maneuvering engulf an opulent Renaissance-inspired empire following the mysterious poisoning of the Emperor.',
    genre: 'Historical Fantasy',
    genres: ['Historical', 'Drama', 'Fantasy'],
    releaseYear: 2023,
    rating: 8.9,
    totalSeasons: 1,
    posterUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Bloodlines',
        episodes: [
          {
            id: 'obs-s1-e1',
            episodeNumber: 1,
            title: 'A Feast of Serpents',
            duration: '58m',
            synopsis: 'The imperial court convenes for the winter banquet as unspoken rivalries turn fatal.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'series-3',
    title: 'Voyagers of the Void',
    synopsis: 'A generation ship traveling 400 years toward Kepler-186f faces a moral reckoning when crew members discover their destination has already been settled.',
    genre: 'Hard Sci-Fi',
    genres: ['Sci-Fi', 'Mystery', 'Adventure'],
    releaseYear: 2024,
    rating: 8.8,
    totalSeasons: 1,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Deep Transit',
        episodes: [
          {
            id: 'vov-s1-e1',
            episodeNumber: 1,
            title: 'The Great Awakening',
            duration: '51m',
            synopsis: 'First Officer Elena wakes from cryo-sleep 80 years ahead of schedule to find the AI navigational logs scrubbed.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'series-4',
    title: 'Echoes in the Pine',
    synopsis: 'A forensic audio engineer moves into a remote Pacific Northwest cabin to recover lost tapes, only to record eerie whispers buried beneath static.',
    genre: 'Psychological Horror',
    genres: ['Mystery', 'Thriller', 'Supernatural'],
    releaseYear: 2023,
    rating: 8.5,
    totalSeasons: 1,
    posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Resonance',
        episodes: [
          {
            id: 'eip-s1-e1',
            episodeNumber: 1,
            title: 'Frequencies',
            duration: '45m',
            synopsis: 'An unmarked reel-to-reel tape contains acoustic signatures that shouldn’t exist.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
          },
        ],
      },
    ],
  },
];
