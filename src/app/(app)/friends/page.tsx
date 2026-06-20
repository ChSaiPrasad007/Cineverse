'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Heart, X, UserPlus, Check } from 'lucide-react';
import Image from 'next/image';
import { StarRating } from '@/components/ui/StarRating';
import { useState, useEffect } from 'react';
import { searchUsersAction, followUserAction, unfollowUserAction, getFollowingAction, getFriendsActivityAction } from '@/app/actions/db';
import { fetchMovieDetails } from '@/app/actions/tmdb';
import { TMDBMovie } from '@/lib/tmdb';
import { formatDistanceToNow } from 'date-fns';

export default function Friends() {
  const [following, setFollowing] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [moviesCache, setMoviesCache] = useState<Record<number, TMDBMovie>>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  useEffect(() => {
    async function load() {
      const f = await getFollowingAction();
      setFollowing(f);
      const a = await getFriendsActivityAction();
      setActivities(a);
      
      const movieIds = [...new Set(a.map((x: any) => x.movieId))];
      const mData = await Promise.all(movieIds.map(id => fetchMovieDetails(id).catch(() => null)));
      const mDict: any = {};
      mData.forEach(m => { if (m) mDict[m.id] = m; });
      setMoviesCache(mDict);
    }
    load();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      const res = await searchUsersAction(searchQuery);
      setSearchResults(res);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleFollow = async (userId: string) => {
    const isFollowing = following.some(f => f.id === userId);
    if (isFollowing) {
      await unfollowUserAction(userId);
      setFollowing(prev => prev.filter(f => f.id !== userId));
    } else {
      await followUserAction(userId);
      const newFollow = searchResults.find(r => r.id === userId);
      if (newFollow) setFollowing(prev => [...prev, newFollow]);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[800px] mx-auto min-h-screen pb-32 relative">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-5xl font-light">Friends</h1>
        <button onClick={() => setIsSearchOpen(true)} className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#161616] flex items-center justify-center hover:bg-[#161616] transition-colors"><Search size={20} /></button>
      </div>

      {/* Story Bubbles (Following list) */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-12 -mx-6 px-6 md:mx-0 md:px-0">
        <div onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
          <div className="w-16 h-16 rounded-full border border-dashed border-[#8A8A8A] flex items-center justify-center hover:bg-white/5">
            <span className="text-2xl">+</span>
          </div>
          <span className="text-xs text-[#8A8A8A]">Find</span>
        </div>
        {following.map((friend) => (
          <motion.div key={friend.id} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] to-transparent">
                <Image src={friend.image || 'https://i.pravatar.cc/150'} alt={friend.name || ''} width={64} height={64} className="rounded-full border-2 border-black" />
              </div>
            </div>
            <span className="text-xs">{friend.name?.split(' ')[0] || 'User'}</span>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {activities.length === 0 && <p className="text-[#8A8A8A] text-center mt-12">No recent activity from your friends. Follow more people to build your network!</p>}
        {activities.map((activity) => {
          const movie = moviesCache[activity.movieId];
          return (
            <motion.div key={activity.id} variants={item} className="bg-[#0A0A0A] border border-[#161616] rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Image src={activity.user?.image || 'https://i.pravatar.cc/150'} alt={activity.user?.name || ''} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-white">{activity.user?.name || 'Anonymous'}</span>{' '}
                    <span className="text-[#8A8A8A]">{activity.action}</span>
                  </p>
                  <p className="text-xs text-[#555]">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</p>
                </div>
              </div>

              {movie && (
                <div className="flex gap-4 bg-black rounded-2xl p-4 border border-[#161616] mb-4">
                  <Image src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder.svg'} alt={movie.title || ''} width={60} height={90} className="rounded-lg object-cover" />
                  <div>
                    <h3 className="font-medium text-lg mb-1">{movie.title}</h3>
                    {activity.rating && <div className="mb-2"><StarRating value={activity.rating} readonly size={14} /></div>}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-6 flex flex-col items-center">
            <div className="w-full max-w-[600px] mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Find Friends</h2>
                <button onClick={() => setIsSearchOpen(false)} className="w-10 h-10 rounded-full bg-[#161616] flex items-center justify-center hover:bg-[#222] text-white"><X size={20} /></button>
              </div>
              
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={20} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#161616] rounded-full pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#333] text-lg" 
                />
              </div>

              <div className="space-y-4">
                {searchResults.map(user => {
                  const isFollowing = following.some(f => f.id === user.id);
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#161616] rounded-2xl">
                      <div className="flex items-center gap-4">
                        <Image src={user.image || 'https://i.pravatar.cc/150'} alt={user.name || ''} width={48} height={48} className="rounded-full" />
                        <div>
                          <h4 className="font-semibold">{user.name || 'Anonymous'}</h4>
                          <p className="text-xs text-[#8A8A8A] truncate max-w-[200px]">{user.bio}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleFollow(user.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFollowing ? 'bg-white text-black' : 'bg-[#161616] text-white hover:bg-[#222]'}`}
                      >
                        {isFollowing ? <Check size={18} /> : <UserPlus size={18} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
