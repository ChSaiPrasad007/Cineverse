export type CineRank = 'Cine Rookie' | 'Cine Explorer' | 'Cine Enthusiast' | 'Cine Master' | 'Cine Legend' | 'CineVerse Elite';

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  cineRank: CineRank;
  hoursWatched: number;
  moviesWatchedCount: number;
  seriesWatchedCount: number;
  countriesExplored: number;
}

export interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  runtime: number;
  genres: string[];
  director: string;
  cast: string[];
  country: string;
  language: string;
  overview: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  movieId: number;
  watchDate: string;
  personalRating: number;
  review: string;
  voiceNoteUrl?: string;
  favoriteScene?: string;
  favoriteCharacter?: string;
  favoriteQuote?: string;
  mood?: string;
  rewatchCount: number;
  containsSpoilers: boolean;
}

export interface FriendActivity {
  id: string;
  user: { name: string; avatarUrl: string };
  action: string;
  movieId: number;
  rating: number;
  timeAgo: string;
}
