'use client';
import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { User, JournalEntry, CineRank } from './types';
import { allMovies } from './mockData';

// --- State Shape ---
export interface AppState {
  user: User;
  journalEntries: JournalEntry[];
  watchedIds: number[];
  favoriteIds: number[];
  watchlistIds: number[];
  isHydrated: boolean;
}

const defaultUser: User = {
  id: 'u_1', username: 'saiprasad', fullName: 'Sai Prasad',
  avatarUrl: 'https://i.pravatar.cc/150?u=sai', bio: 'Cinema is my escape.',
  cineRank: 'Cine Rookie', hoursWatched: 0, moviesWatchedCount: 0,
  seriesWatchedCount: 0, countriesExplored: 0,
};

const initialState: AppState = {
  user: defaultUser, journalEntries: [], watchedIds: [], favoriteIds: [], watchlistIds: [], isHydrated: false,
};

// --- Actions ---
type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'TOGGLE_WATCHED'; payload: number }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'TOGGLE_WATCHLIST'; payload: number }
  | { type: 'ADD_JOURNAL'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL'; payload: { id: string; updates: Partial<JournalEntry> } }
  | { type: 'DELETE_JOURNAL'; payload: string }
  | { type: 'ADD_AI_MESSAGE'; payload: { role: 'user' | 'ai'; text: string } };

// --- CineRank Logic ---
function computeCineRank(hours: number): CineRank {
  if (hours > 500) return 'CineVerse Elite';
  if (hours > 300) return 'Cine Legend';
  if (hours > 150) return 'Cine Master';
  if (hours > 75) return 'Cine Enthusiast';
  if (hours > 25) return 'Cine Explorer';
  return 'Cine Rookie';
}

function computeRankLetter(rank: CineRank): string {
  const map: Record<CineRank, string> = {
    'Cine Rookie': 'C', 'Cine Explorer': 'B', 'Cine Enthusiast': 'A',
    'Cine Master': 'S', 'Cine Legend': 'S+', 'CineVerse Elite': 'S++',
  };
  return map[rank];
}

function recomputeUser(state: AppState): User {
  const watched = state.watchedIds;
  const totalMinutes = watched.reduce((sum, id) => {
    const m = allMovies.find(mov => mov.id === id);
    return sum + (m?.runtime || 0);
  }, 0);
  const hours = Math.round((totalMinutes / 60) * 100) / 100;
  const countries = new Set(watched.map(id => allMovies.find(m => m.id === id)?.country).filter(Boolean));
  return {
    ...state.user,
    hoursWatched: hours,
    moviesWatchedCount: watched.length,
    countriesExplored: countries.size,
    cineRank: computeCineRank(hours),
  };
}

// --- Reducer ---
function reducer(state: AppState, action: Action): AppState {
  let newState: AppState;
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true };
    case 'TOGGLE_WATCHED': {
      const id = action.payload;
      const has = state.watchedIds.includes(id);
      const watchedIds = has ? state.watchedIds.filter(x => x !== id) : [...state.watchedIds, id];
      newState = { ...state, watchedIds };
      newState.user = recomputeUser(newState);
      return newState;
    }
    case 'TOGGLE_FAVORITE': {
      const id = action.payload;
      const has = state.favoriteIds.includes(id);
      return { ...state, favoriteIds: has ? state.favoriteIds.filter(x => x !== id) : [...state.favoriteIds, id] };
    }
    case 'TOGGLE_WATCHLIST': {
      const id = action.payload;
      const has = state.watchlistIds.includes(id);
      return { ...state, watchlistIds: has ? state.watchlistIds.filter(x => x !== id) : [...state.watchlistIds, id] };
    }
    case 'ADD_JOURNAL':
      newState = { ...state, journalEntries: [action.payload, ...state.journalEntries] };
      if (!newState.watchedIds.includes(action.payload.movieId)) {
        newState.watchedIds = [...newState.watchedIds, action.payload.movieId];
      }
      newState.user = recomputeUser(newState);
      return newState;
    case 'UPDATE_JOURNAL':
      return { ...state, journalEntries: state.journalEntries.map(e => e.id === action.payload.id ? { ...e, ...action.payload.updates } : e) };
    case 'DELETE_JOURNAL':
      return { ...state, journalEntries: state.journalEntries.filter(e => e.id !== action.payload) };
    default:
      return state;
  }
}

// --- Context ---
interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  toggleWatched: (id: number) => void;
  toggleFavorite: (id: number) => void;
  toggleWatchlist: (id: number) => void;
  addJournal: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournal: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  isWatched: (id: number) => boolean;
  isFavorite: (id: number) => boolean;
  isWatchlisted: (id: number) => boolean;
  getJournalForMovie: (movieId: number) => JournalEntry | undefined;
  getRankLetter: () => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function CineVerseProvider({ children, initialData }: { children: ReactNode, initialData?: any }) {
  const dbUser = initialData?.user || {};
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    user: {
      ...defaultUser,
      id: dbUser.id || defaultUser.id,
      fullName: dbUser.name || defaultUser.fullName,
      username: dbUser.name?.replace(/\s+/g, '').toLowerCase() || defaultUser.username,
      avatarUrl: dbUser.image || defaultUser.avatarUrl,
      bio: dbUser.bio || defaultUser.bio,
      cineRank: dbUser.cineRank || defaultUser.cineRank,
    },
    watchedIds: initialData?.watchedIds || [],
    favoriteIds: initialData?.favoriteIds || [],
    watchlistIds: initialData?.watchlistIds || [],
    journalEntries: initialData?.journalEntries || [],
    isHydrated: true,
  });

  // Removed localStorage hydration to use real DB data

  const toggleWatched = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_WATCHED', payload: id });
    import('@/app/actions/db').then(m => m.toggleWatchedAction(id).catch(console.error));
  }, []);
  const toggleFavorite = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
    import('@/app/actions/db').then(m => m.toggleFavoriteAction(id).catch(console.error));
  }, []);
  const toggleWatchlist = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_WATCHLIST', payload: id });
    import('@/app/actions/db').then(m => m.toggleWatchlistAction(id).catch(console.error));
  }, []);
  const addJournal = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    dispatch({ type: 'ADD_JOURNAL', payload: { ...entry, id: `temp_${Date.now()}` } as JournalEntry });
    import('@/app/actions/db').then(m => m.saveJournalAction(entry.movieId, entry.personalRating, entry.review, entry.favoriteScene, entry.favoriteCharacter, entry.favoriteQuote, entry.mood).catch(console.error));
  }, []);
  const updateJournal = useCallback((id: string, updates: Partial<JournalEntry>) => dispatch({ type: 'UPDATE_JOURNAL', payload: { id, updates } }), []);
  const deleteJournal = useCallback((id: string) => dispatch({ type: 'DELETE_JOURNAL', payload: id }), []);
  const isWatched = useCallback((id: number) => state.watchedIds.includes(id), [state.watchedIds]);
  const isFavorite = useCallback((id: number) => state.favoriteIds.includes(id), [state.favoriteIds]);
  const isWatchlisted = useCallback((id: number) => state.watchlistIds.includes(id), [state.watchlistIds]);
  const getJournalForMovie = useCallback((movieId: number) => state.journalEntries.find((e: JournalEntry) => e.movieId === movieId), [state.journalEntries]);
  const getRankLetter = useCallback(() => computeRankLetter(state.user.cineRank), [state.user.cineRank]);

  return (
    <StoreContext.Provider value={{ state, dispatch, toggleWatched, toggleFavorite, toggleWatchlist, addJournal, updateJournal, deleteJournal, isWatched, isFavorite, isWatchlisted, getJournalForMovie, getRankLetter }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within CineVerseProvider');
  return ctx;
}
