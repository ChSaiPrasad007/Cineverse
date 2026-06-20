'use client';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { MovieCard } from '@/components/ui/MovieCard';
import { StarRating } from '@/components/ui/StarRating';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchTrending, fetchMovieDetails } from '@/app/actions/tmdb';
import { TMDBMovie, img, getTitle } from '@/lib/tmdb';
import { useSession } from 'next-auth/react';
import { getGlobalActivityAction } from '@/app/actions/db';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { data: session } = useSession();
  const { state } = useStore();
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null);
  const [recommended, setRecommended] = useState<TMDBMovie[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lastWatchedId = state.watchedIds[state.watchedIds.length - 1];

  useEffect(() => {
    async function loadData() {
      try {
        const trending = await fetchTrending();
        setRecommended(trending.slice(1, 8)); // 7 recommendations

        if (lastWatchedId) {
          const details = await fetchMovieDetails(lastWatchedId);
          setHeroMovie(details);
        } else {
          setHeroMovie(trending[0]);
        }

        const globalActivities = await getGlobalActivityAction();
        setActivities(globalActivities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [lastWatchedId]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const userName = session?.user?.name || state.user.fullName;

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-light">Good Evening, <span className="font-semibold">{userName}</span></h1>
          <p className="text-[#8A8A8A] mt-1 text-sm md:text-base">Ready for another cinematic journey?</p>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#161616] flex items-center justify-center relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Hero Card */}
          {loading ? (
             <div className="h-[300px] md:h-[450px] rounded-[32px] bg-[#0A0A0A] border border-[#161616] animate-pulse" />
          ) : heroMovie && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <Link href={`/movie/${heroMovie.id}`}>
                <div className="relative h-[300px] md:h-[450px] rounded-[32px] overflow-hidden group cursor-pointer">
                  <Image src={img.backdrop(heroMovie.backdrop_path)} alt={getTitle(heroMovie)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <p className="text-[#8A8A8A] text-sm md:text-base font-medium tracking-widest uppercase mb-3 drop-shadow-md">
                      {lastWatchedId ? 'Last Watched' : 'Featured Movie'}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-[0.1em] uppercase mb-4 drop-shadow-lg">{getTitle(heroMovie)}</h2>
                    <div className="flex items-center gap-4">
                      <StarRating value={(heroMovie.vote_average / 2) || 0} readonly size={20} />
                      <span className="text-[#8A8A8A] text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">{heroMovie.genres?.map((g:any)=>g.name).join(', ') || 'Trending'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Recommendations */}
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl md:text-2xl font-semibold">Recommended For You</h3>
              <button className="text-sm text-[#8A8A8A] hover:text-white transition-colors">See All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {loading ? (
                Array.from({length: 6}).map((_, i) => <div key={i} className="min-w-[140px] md:min-w-[180px] aspect-[2/3] rounded-xl bg-[#0A0A0A] border border-[#161616] animate-pulse shrink-0" />)
              ) : (
                recommended.map((movie, i) => (
                  <div key={movie.id} className="min-w-[140px] md:min-w-[180px] shrink-0">
                    <MovieCard item={movie} index={i} showTitle />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <h3 className="text-xl font-semibold mb-6">Friends Activity</h3>
          <div className="bg-[#0A0A0A] rounded-[32px] border border-[#161616] p-6 space-y-6">
            {activities.length === 0 && <p className="text-[#8A8A8A] text-sm">No recent activity found. Be the first to watch a movie!</p>}
            {activities.map((activity) => (
              <motion.div key={activity.id} variants={item} className="flex gap-4 group">
                <Image src={activity.user?.image || 'https://i.pravatar.cc/150'} alt={activity.user?.name || 'User'} width={48} height={48} className="rounded-full shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-white">{activity.user?.name || 'Anonymous'}</span>{' '}
                    <span className="text-[#8A8A8A]">{activity.action}</span>{' '}
                    <span className="text-white">a movie</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {activity.rating && <StarRating value={activity.rating} readonly size={12} />}
                    <span className="text-xs text-[#555]">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-full bg-[#0A0A0A] border border-[#161616] text-[#8A8A8A] hover:text-white transition-colors font-medium">
            View All Activity
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
