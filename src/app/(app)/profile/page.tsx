'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Share, ShieldCheck, X } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { updateProfileAction } from '@/app/actions/db';
import { MovieCard } from '@/components/ui/MovieCard';
import { fetchMovieDetails } from '@/app/actions/tmdb';

export default function Profile() {
  const { state, getRankLetter, dispatch } = useStore();
  const user = state.user;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.fullName);
  const [editBio, setEditBio] = useState(user.bio);
  
  const [watchedMoviesData, setWatchedMoviesData] = useState<any[]>([]);

  useEffect(() => {
    async function loadWall() {
      const data = await Promise.all(
        state.watchedIds.map(id => fetchMovieDetails(id).catch(() => null))
      );
      setWatchedMoviesData(data.filter(Boolean));
    }
    loadWall();
  }, [state.watchedIds]);

  const handleSaveProfile = async () => {
    try {
      await updateProfileAction(editName, editBio);
      dispatch({ 
        type: 'HYDRATE', 
        payload: { 
          user: { ...user, fullName: editName, bio: editBio } 
        } 
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const statItem = { hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } } };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen pb-32">
      <div className="flex justify-between items-start mb-12">
        <div className="flex gap-6 items-center">
          <div className="relative">
            <Image src={user.avatarUrl} alt={user.fullName} width={96} height={96} className="rounded-full border-2 border-[#161616]" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-sm rank-glow">
              {getRankLetter()}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold mb-1">{user.fullName}</h1>
            <p className="text-[#8A8A8A]">@{user.username}</p>
            <p className="text-sm mt-2 max-w-sm">{user.bio}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center hover:bg-[#161616] transition-colors"><Share size={18} /></button>
          <button onClick={() => setIsEditing(true)} className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center hover:bg-[#161616] transition-colors"><Settings size={18} /></button>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6 md:p-10 w-full max-w-md relative">
              <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-[#8A8A8A] hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8A8A8A] mb-2">Display Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#333]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8A8A8A] mb-2">Bio</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#333] h-24 resize-none" />
                </div>
                <button onClick={handleSaveProfile} className="w-full bg-white text-black font-semibold rounded-full py-3 mt-4 hover:bg-gray-200 transition-colors">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <motion.div variants={statItem} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-light mb-2">{user.moviesWatchedCount}</span>
          <span className="text-xs text-[#8A8A8A] uppercase tracking-widest text-center">Movies<br/>Watched</span>
        </motion.div>
        <motion.div variants={statItem} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-light mb-2">{user.seriesWatchedCount}</span>
          <span className="text-xs text-[#8A8A8A] uppercase tracking-widest text-center">Series<br/>Finished</span>
        </motion.div>
        <motion.div variants={statItem} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-light mb-2">{user.hoursWatched}</span>
          <span className="text-xs text-[#8A8A8A] uppercase tracking-widest text-center">Hours<br/>Watched</span>
        </motion.div>
        <motion.div variants={statItem} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-light mb-2">{user.countriesExplored}</span>
          <span className="text-xs text-[#8A8A8A] uppercase tracking-widest text-center">Countries<br/>Explored</span>
        </motion.div>
      </motion.div>

      {/* Movie Wall */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Your Movie Wall</h2>
        {watchedMoviesData.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
            {watchedMoviesData.map((movie, i) => (
              <MovieCard key={movie.id} item={movie} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-12 text-center text-[#8A8A8A]">
            <p>Start watching to build your wall.</p>
          </div>
        )}
      </div>

      {/* Passport Privacy */}
      <div className="flex items-center gap-4 bg-black border border-[#161616] rounded-2xl p-4 text-sm text-[#8A8A8A] mb-8">
        <ShieldCheck className="text-white shrink-0" />
        <p>Your cinematic passport is private by default. Only friends can view your full watch history and journal entries.</p>
      </div>

      {/* Creator Info */}
      <div className="text-center text-xs text-[#8A8A8A] pt-8 border-t border-[#161616]">
        <p>Created by</p>
        <p className="font-medium text-white mt-1 text-sm">Sai Prasad Cheriyala</p>
        <p className="mt-1">chsaiprasad66@gmail.com</p>
      </div>
    </div>
  );
}
