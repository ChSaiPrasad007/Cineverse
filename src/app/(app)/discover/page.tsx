'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MovieCard } from '@/components/ui/MovieCard';
import { fetchTrending, fetchSearch, fetchByGenre, fetchAllGenres } from '@/app/actions/tmdb';
import { TMDBMovie, Genre } from '@/lib/tmdb';

export default function Discover() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<number | 'All'>('All');
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Load genres once
  useEffect(() => {
    fetchAllGenres().then(setGenres).catch(console.error);
  }, []);

  // Fetch movies when query or genre changes
  useEffect(() => {
    let active = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        let results: TMDBMovie[] = [];
        if (query.trim()) {
          results = await fetchSearch(query);
          // If a genre is selected while searching, filter the search results
          if (activeGenre !== 'All') {
            results = results.filter(m => m.genre_ids?.includes(activeGenre));
          }
        } else if (activeGenre !== 'All') {
          results = await fetchByGenre(activeGenre);
        } else {
          results = await fetchTrending();
        }
        if (active) {
          // TMDB often returns duplicate IDs in trending, filter them
          const unique = results.filter((v,i,a) => a.findIndex(t => t.id === v.id) === i);
          setMovies(unique);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 300); // 300ms debounce
    return () => { active = false; clearTimeout(debounce); };
  }, [query, activeGenre]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-light mb-8">Discover</motion.h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-10">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={20} />
        <input 
          type="text" 
          placeholder="Search millions of movies..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-[#161616] rounded-full py-5 pl-14 pr-16 text-white text-lg focus:outline-none focus:border-[#8A8A8A] transition-colors"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#161616] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors">
          <SlidersHorizontal size={18} />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 mb-8">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveGenre('All'); setQuery(''); }}
          className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeGenre === 'All' ? 'bg-white text-black' : 'bg-[#0A0A0A] border border-[#161616] text-[#8A8A8A] hover:text-white'}`}
        >
          Trending
        </motion.button>
        {genres.map(genre => (
          <motion.button 
            key={genre.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveGenre(genre.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeGenre === genre.id ? 'bg-white text-black' : 'bg-[#0A0A0A] border border-[#161616] text-[#8A8A8A] hover:text-white'}`}
          >
            {genre.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#161616] border-t-white rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div 
            key={activeGenre + query + "results"}
            variants={container} 
            initial="hidden" 
            animate="show" 
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {movies.length > 0 ? (
              movies.map((movie, i) => (
                <MovieCard key={movie.id} item={movie} index={i} showTitle showYear />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-[#8A8A8A]">
                <Film size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-xl">No movies found</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
