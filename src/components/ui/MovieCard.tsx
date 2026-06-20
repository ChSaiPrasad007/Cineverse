'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { img, TMDBMovie, getTitle, getYear, getMediaType } from '@/lib/tmdb';

interface Props {
  item: TMDBMovie;
  index?: number;
  showTitle?: boolean;
  showYear?: boolean;
}

export function MovieCard({ item, index = 0, showTitle = false, showYear = false }: Props) {
  const type = getMediaType(item);
  const href = type === 'tv' ? `/series/${item.id}` : `/movie/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={href} className="group flex flex-col gap-2">
        <motion.div
          className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#0A0A0A]"
          whileHover={{ scale: 1.03, y: -4, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.15)" }}
          whileTap={{ scale: 0.97, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)" }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Image
            src={img.poster(item.poster_path)}
            alt={getTitle(item)}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-all duration-500 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              ★ {item.vote_average.toFixed(1)}
            </div>
          )}
        </motion.div>
        {(showTitle || showYear) && (
          <div className="px-1">
            {showTitle && <p className="text-sm font-medium text-white truncate">{getTitle(item)}</p>}
            {showYear && <p className="text-xs text-[#8A8A8A]">{getYear(item)}</p>}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

// Fallback card using local mock data shape
interface MockCardProps {
  movie: { id: number; title: string; posterUrl: string; releaseYear: number };
  index?: number;
}

export function MockMovieCard({ movie, index = 0 }: MockCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/movie/${movie.id}`} className="group flex flex-col gap-2">
        <motion.div
          className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#0A0A0A]"
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Image src={movie.posterUrl} alt={movie.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-all duration-500 group-hover:brightness-110" />
        </motion.div>
        <div className="px-1">
          <p className="text-sm font-medium text-white truncate">{movie.title}</p>
          <p className="text-xs text-[#8A8A8A]">{movie.releaseYear}</p>
        </div>
      </Link>
    </motion.div>
  );
}
