'use server'

import { searchMulti, getTrending, getMoviesByGenre, getGenres, getMovieDetails } from '@/lib/tmdb';

export async function fetchTrending() {
  const data = await getTrending('all', 'week');
  return data.results;
}

export async function fetchSearch(query: string) {
  const data = await searchMulti(query);
  return data.results;
}

export async function fetchByGenre(genreId: number) {
  const data = await getMoviesByGenre(genreId);
  return data.results;
}

export async function fetchAllGenres() {
  const data = await getGenres('movie');
  return data.genres;
}

export async function fetchMovieDetails(id: number) {
  return await getMovieDetails(id);
}
