const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

function key() {
  return process.env.NEXT_PUBLIC_TMDB_KEY || process.env.TMDB_KEY || '';
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', key());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

// --- Image helpers ---
export const img = {
  poster: (path: string | null, size = 'w500') => path ? `${IMG}/${size}${path}` : '/placeholder.svg',
  backdrop: (path: string | null, size = 'original') => path ? `${IMG}/${size}${path}` : '/placeholder.svg',
  profile: (path: string | null, size = 'w185') => path ? `${IMG}/${size}${path}` : '',
};

// --- Types ---
export interface TMDBMovie {
  id: number; title?: string; name?: string; overview: string;
  poster_path: string | null; backdrop_path: string | null;
  release_date?: string; first_air_date?: string;
  vote_average: number; vote_count: number;
  genre_ids?: number[]; genres?: { id: number; name: string }[];
  runtime?: number; number_of_seasons?: number;
  media_type?: string; original_language?: string;
  origin_country?: string[];
  popularity: number;
}

export interface TMDBCredits {
  cast: { id: number; name: string; character: string; profile_path: string | null; order: number }[];
  crew: { id: number; name: string; job: string; profile_path: string | null }[];
}

export interface TMDBVideo {
  key: string; name: string; site: string; type: string;
}

export interface TMDBPage<T> {
  page: number; total_pages: number; total_results: number; results: T[];
}

export interface Genre { id: number; name: string; }

// --- API Functions ---

export async function getTrending(type: 'movie' | 'tv' | 'all' = 'all', time: 'day' | 'week' = 'week') {
  return get<TMDBPage<TMDBMovie>>(`/trending/${type}/${time}`);
}

export async function getPopular(type: 'movie' | 'tv' = 'movie', page = 1) {
  return get<TMDBPage<TMDBMovie>>(`/${type}/popular`, { page: String(page) });
}

export async function getTopRated(type: 'movie' | 'tv' = 'movie', page = 1) {
  return get<TMDBPage<TMDBMovie>>(`/${type}/top_rated`, { page: String(page) });
}

export async function getNowPlaying(page = 1) {
  return get<TMDBPage<TMDBMovie>>('/movie/now_playing', { page: String(page) });
}

export async function searchMulti(query: string, page = 1) {
  return get<TMDBPage<TMDBMovie>>('/search/multi', { query, page: String(page) });
}

export async function searchMovies(query: string, page = 1) {
  return get<TMDBPage<TMDBMovie>>('/search/movie', { query, page: String(page) });
}

export async function searchTV(query: string, page = 1) {
  return get<TMDBPage<TMDBMovie>>('/search/tv', { query, page: String(page) });
}

export async function getMovieDetails(id: number) {
  return get<TMDBMovie & { runtime: number; genres: Genre[]; production_countries: { iso_3166_1: string; name: string }[]; spoken_languages: { english_name: string }[]; tagline: string; status: string; budget: number; revenue: number }>(`/movie/${id}`, { append_to_response: 'credits,videos,similar,recommendations' });
}

export async function getTVDetails(id: number) {
  return get<TMDBMovie & { number_of_seasons: number; number_of_episodes: number; genres: Genre[]; episode_run_time: number[]; created_by: { name: string }[]; seasons: { season_number: number; episode_count: number; name: string; poster_path: string | null }[] }>(`/tv/${id}`, { append_to_response: 'credits,videos,similar,recommendations' });
}

export async function getCredits(type: 'movie' | 'tv', id: number) {
  return get<TMDBCredits>(`/${type}/${id}/credits`);
}

export async function getVideos(type: 'movie' | 'tv', id: number) {
  return get<{ results: TMDBVideo[] }>(`/${type}/${id}/videos`);
}

export async function discover(type: 'movie' | 'tv' = 'movie', params: Record<string, string> = {}) {
  return get<TMDBPage<TMDBMovie>>(`/discover/${type}`, params);
}

export async function getGenres(type: 'movie' | 'tv' = 'movie') {
  return get<{ genres: Genre[] }>(`/genre/${type}/list`);
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  return discover('movie', { with_genres: String(genreId), page: String(page), sort_by: 'popularity.desc' });
}

export async function getMoviesByYear(year: number, page = 1) {
  return discover('movie', { primary_release_year: String(year), page: String(page), sort_by: 'popularity.desc' });
}

export async function getMoviesByDecade(startYear: number, page = 1) {
  return discover('movie', {
    'primary_release_date.gte': `${startYear}-01-01`,
    'primary_release_date.lte': `${startYear + 9}-12-31`,
    page: String(page), sort_by: 'popularity.desc'
  });
}

// Helper to get displayable title
export function getTitle(item: TMDBMovie): string {
  return item.title || item.name || 'Untitled';
}

export function getYear(item: TMDBMovie): string {
  const date = item.release_date || item.first_air_date || '';
  return date.substring(0, 4);
}

export function getMediaType(item: TMDBMovie): 'movie' | 'tv' {
  if (item.media_type === 'tv') return 'tv';
  if (item.first_air_date && !item.release_date) return 'tv';
  return 'movie';
}

export function hasKey(): boolean {
  return !!key();
}
