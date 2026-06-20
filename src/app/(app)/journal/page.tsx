'use client';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { allMovies } from '@/lib/mockData';
import { StarRating } from '@/components/ui/StarRating';

export default function Journal() {
  const { state } = useStore();
  const entries = state.journalEntries.sort((a, b) => new Date(b.watchDate).getTime() - new Date(a.watchDate).getTime());

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen pb-32 md:pb-10">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-3xl md:text-5xl font-light mb-2">Journal</h1>
          <p className="text-[#8A8A8A]">Your cinematic life archive</p>
        </div>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#161616] flex items-center justify-center hover:bg-[#161616] transition-colors"><Search size={20} /></button>
          <button className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#161616] flex items-center justify-center hover:bg-[#161616] transition-colors"><Calendar size={20} /></button>
        </div>
      </div>

      {entries.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <div className="absolute left-[39px] md:left-[59px] top-4 bottom-4 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
          
          <div className="space-y-12">
            {entries.map(entry => {
              const movie = allMovies.find(m => m.id === entry.movieId);
              if (!movie) return null;
              
              const date = new Date(entry.watchDate);
              const day = date.getDate();
              const month = date.toLocaleString('default', { month: 'short' });

              return (
                <motion.div key={entry.id} variants={item} className="flex gap-6 md:gap-10 relative">
                  {/* Timeline Date */}
                  <div className="w-20 md:w-32 shrink-0 flex flex-col items-center pt-2">
                    <div className="w-4 h-4 rounded-full bg-white border-[4px] border-black absolute left-[32px] md:left-[52px] shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
                    <span className="text-3xl md:text-4xl font-bold font-serif">{day}</span>
                    <span className="text-xs md:text-sm text-[#8A8A8A] uppercase tracking-widest">{month}</span>
                  </div>

                  {/* Entry Card */}
                  <div className="flex-1">
                    <Link href={`/movie/${movie.id}`}>
                      <motion.div whileHover={{ scale: 1.01 }} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 group transition-colors hover:border-[#333]">
                        <div className="w-24 md:w-32 shrink-0 aspect-[2/3] relative rounded-xl overflow-hidden shadow-xl">
                          <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-semibold mb-2">{movie.title}</h3>
                          <div className="mb-4"><StarRating value={entry.personalRating} readonly size={16} /></div>
                          {entry.review && <p className="text-[#ccc] text-sm md:text-base leading-relaxed italic line-clamp-3">"{entry.review}"</p>}
                          {entry.mood && <div className="mt-4 inline-block bg-[#161616] text-[#8A8A8A] text-xs px-3 py-1 rounded-full">{entry.mood}</div>}
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-32">
          <BookOpen size={64} className="mx-auto text-[#161616] mb-6" />
          <h2 className="text-2xl font-light mb-2">Your journal is empty</h2>
          <p className="text-[#8A8A8A] mb-8">Start watching to build your cinematic story.</p>
          <Link href="/discover">
            <motion.button whileTap={{ scale: 0.95 }} className="bg-white text-black px-8 py-3 rounded-full font-semibold">Discover Movies</motion.button>
          </Link>
        </div>
      )}

      {/* FAB */}
      <motion.button 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.9 }} 
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl z-40"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
}
