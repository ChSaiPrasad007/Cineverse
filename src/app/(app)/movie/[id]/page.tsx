'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Check, Heart, Bookmark, Edit3, Mic, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { StarRating } from '@/components/ui/StarRating';
import { JournalModal } from '@/components/ui/JournalModal';
import { fetchMovieDetails } from '@/app/actions/tmdb';
import { TMDBMovie, img, getTitle, getYear } from '@/lib/tmdb';

export default function MovieDetail() {
  const params = useParams();
  const router = useRouter();
  const { state, toggleWatched, toggleFavorite, toggleWatchlist, getJournalForMovie } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const movieId = Number(params.id);
  const memory = getJournalForMovie(movieId);

  useEffect(() => {
    fetchMovieDetails(movieId)
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <div className="p-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#161616] border-t-white rounded-full animate-spin" /></div>;
  if (!movie) return <div className="p-10 text-center">Movie not found</div>;

  const isWatched = state.watchedIds.includes(movieId);
  const isFavorite = state.favoriteIds.includes(movieId);
  const isWatchlisted = state.watchlistIds.includes(movieId);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[65vh]">
        <Image src={img.backdrop(movie.backdrop_path)} alt={getTitle(movie)} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-10">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
            <ArrowLeft size={24} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
            <MoreHorizontal size={24} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 -mt-32 md:-mt-48 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[#D4AF37] tracking-[0.3em] text-sm md:text-base font-semibold mb-4 uppercase">{movie.tagline || 'CINEVERSE'}</p>
          <h1 className="text-5xl md:text-8xl font-light uppercase tracking-widest leading-none mb-6 text-white drop-shadow-2xl">{getTitle(movie)}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-[#8A8A8A] font-medium tracking-wide mb-8">
            <span className="px-3 py-1 border border-[#161616] rounded-full backdrop-blur-sm bg-black/50">{getYear(movie)}</span>
            {movie.runtime > 0 && <span className="px-3 py-1 border border-[#161616] rounded-full backdrop-blur-sm bg-black/50">{Math.floor(movie.runtime/60)}h {movie.runtime%60}m</span>}
            <span>{movie.genres?.map((g:any)=>g.name).join(' • ')}</span>
          </div>

          <p className="text-lg md:text-xl text-[#ccc] font-light max-w-3xl leading-relaxed mb-12">{movie.overview}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-20">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleWatched(movieId)} className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-colors border ${isWatched ? 'bg-white text-black border-white' : 'bg-[#0A0A0A] text-white border-[#161616] hover:border-[#8A8A8A]'}`}>
              {isWatched ? <Check size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
              {isWatched ? 'Watched' : 'Mark Watched'}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleFavorite(movieId)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors border ${isFavorite ? 'bg-white text-red-500 border-white' : 'bg-[#0A0A0A] text-white border-[#161616] hover:border-[#8A8A8A]'}`}>
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleWatchlist(movieId)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors border ${isWatchlisted ? 'bg-white text-black border-white' : 'bg-[#0A0A0A] text-white border-[#161616] hover:border-[#8A8A8A]'}`}>
              <Bookmark size={20} className={isWatchlisted ? 'fill-current' : ''} />
            </motion.button>
          </div>
        </motion.div>

        {/* Memory Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Your Memory</h2>
            {memory && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setModalOpen(true)} className="text-[#8A8A8A] hover:text-white flex items-center gap-2">
                <Edit3 size={18} /> Edit
              </motion.button>
            )}
          </div>

          {memory ? (
            <div className="bg-[#0A0A0A] border border-[#161616] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <BookOpen size={200} />
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Rating</p>
                    <StarRating value={memory.personalRating} readonly size={24} />
                  </div>
                  {memory.review && (
                    <div>
                      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">Review</p>
                      <p className="text-lg text-white font-serif leading-relaxed italic">"{memory.review}"</p>
                    </div>
                  )}
                  {memory.mood && (
                    <div>
                      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Mood</p>
                      <span className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium">{memory.mood}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-8 border-t md:border-t-0 md:border-l border-[#161616] pt-8 md:pt-0 md:pl-12">
                  <div className="bg-black rounded-2xl p-6 border border-[#161616]">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest">Voice Note</p>
                      <Mic size={16} className="text-[#D4AF37]" />
                    </div>
                    <div className="flex items-center gap-1 h-8 mb-4">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="w-1.5 bg-[#D4AF37] rounded-full" style={{ height: `${Math.max(20, Math.random() * 100)}%`, opacity: Math.random() * 0.5 + 0.5 }} />
                      ))}
                    </div>
                    <button className="text-sm font-medium hover:text-[#D4AF37] transition-colors">▶ Play Memory</button>
                  </div>
                  {memory.favoriteScene && (
                    <div>
                      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Favorite Scene</p>
                      <p className="text-white font-medium">{memory.favoriteScene}</p>
                    </div>
                  )}
                  {memory.favoriteQuote && (
                    <div>
                      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Quote</p>
                      <p className="text-[#8A8A8A] italic">"{memory.favoriteQuote}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setModalOpen(true)} className="bg-[#0A0A0A] border border-[#161616] rounded-[32px] p-12 text-center cursor-pointer hover:border-[#8A8A8A] transition-colors">
              <BookOpen size={48} className="mx-auto text-[#8A8A8A] mb-6" />
              <h3 className="text-xl font-medium mb-2">Unlock Memory</h3>
              <p className="text-[#8A8A8A] max-w-md mx-auto">How did this movie make you feel? Record a voice note, write a review, and save your favorite scene.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <JournalModal movieId={movieId} movieTitle={getTitle(movie)} open={modalOpen} onClose={() => setModalOpen(false)} existingEntryId={memory?.id} />
    </div>
  );
}
