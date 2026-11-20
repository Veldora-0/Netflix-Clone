import { PlayableMedia } from '../types';

export const OPEN_DEMO_STREAMS: Record<string, { videoUrl: string; duration: number; attribution: string }> = {
  'movie-1': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
    attribution: 'Tears of Steel — (CC) Blender Foundation | mango.blender.org',
  },
  'movie-2': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
    attribution: 'Big Buck Bunny — (CC) Blender Foundation | peach.blender.org',
  },
  'movie-4': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 888,
    attribution: 'Sintel — (CC) Blender Foundation | durian.blender.org',
  },
  'movie-5': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
    attribution: 'Elephants Dream — (CC) Blender Foundation | orange.blender.org',
  },
  'movie-6': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
    attribution: 'Cinematic Action Teaser — Open Sample Video Showcase',
  },
  'movie-11': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
    attribution: 'Tears of Steel — (CC) Blender Foundation | mango.blender.org',
  },
  'movie-20': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
    attribution: 'Nature Spectacle — Open Sample Media Collection',
  },
};

export const DEFAULT_DEMO_STREAM = {
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  duration: 734,
  attribution: 'Open Cinema Showcase — (CC) Blender Foundation Demo Reel',
};

export function getPlayableMediaForMovie(movie: {
  id: string;
  title: string;
  description: string;
  backdropUrl: string;
}): PlayableMedia {
  const stream = OPEN_DEMO_STREAMS[movie.id] || DEFAULT_DEMO_STREAM;
  return {
    id: movie.id,
    title: movie.title,
    synopsis: movie.description,
    backdropUrl: movie.backdropUrl,
    videoUrl: stream.videoUrl,
    durationSeconds: stream.duration,
    attribution: stream.attribution,
    isSeries: false,
  };
}
