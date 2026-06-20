'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { StarRating } from './StarRating';
import { moods } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { useToast } from './Toast';

interface Props {
  movieId: number;
  movieTitle: string;
  open: boolean;
  onClose: () => void;
  existingEntryId?: string;
}

export function JournalModal({ movieId, movieTitle, open, onClose, existingEntryId }: Props) {
  const { state, addJournal, updateJournal, getJournalForMovie } = useStore();
  const { toast } = useToast();
  const existing = existingEntryId ? state.journalEntries.find(e => e.id === existingEntryId) : getJournalForMovie(movieId);

  const [rating, setRating] = useState(existing?.personalRating || 0);
  const [review, setReview] = useState(existing?.review || '');
  const [mood, setMood] = useState(existing?.mood || '');
  const [scene, setScene] = useState(existing?.favoriteScene || '');
  const [character, setCharacter] = useState(existing?.favoriteCharacter || '');
  const [quote, setQuote] = useState(existing?.favoriteQuote || '');
  const [watchDate, setWatchDate] = useState(existing?.watchDate || new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (existing) {
      updateJournal(existing.id, { personalRating: rating, review, mood, favoriteScene: scene, favoriteCharacter: character, favoriteQuote: quote, watchDate });
      toast('Memory updated');
    } else {
      addJournal({ userId: 'u_1', movieId, personalRating: rating, review, mood, favoriteScene: scene, favoriteCharacter: character, favoriteQuote: quote, watchDate, rewatchCount: 0, containsSpoilers: false });
      toast('Added to your journey');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0A0A0A] border border-[#161616] rounded-t-3xl md:rounded-3xl p-6 z-10 no-scrollbar"
            initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Memory</h2>
              <motion.button whileTap={{ scale: 0.85 }} onClick={onClose} className="w-9 h-9 rounded-full bg-[#161616] flex items-center justify-center">
                <X size={18} />
              </motion.button>
            </div>

            <p className="text-[#8A8A8A] text-sm mb-6">{movieTitle}</p>

            <div className="flex flex-col gap-6">
              {/* Rating */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-3">Your Rating</label>
                <StarRating value={rating} onChange={setRating} size={28} />
              </div>

              {/* Watch Date */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-2">Watch Date</label>
                <input type="date" value={watchDate} onChange={e => setWatchDate(e.target.value)}
                  className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8A8A8A] transition-colors" />
              </div>

              {/* Review */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-2">Your Review</label>
                <textarea value={review} onChange={e => setReview(e.target.value)} rows={3} placeholder="How did this make you feel?"
                  className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-[#8A8A8A] transition-colors" />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-3">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(m => (
                    <motion.button key={m} type="button" whileTap={{ scale: 0.92 }}
                      onClick={() => setMood(mood === m ? '' : m)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${mood === m ? 'bg-white text-black font-medium' : 'bg-[#161616] text-[#8A8A8A] hover:text-white'}`}
                    >{m}</motion.button>
                  ))}
                </div>
              </div>

              {/* Favorite Scene */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-2">Favorite Scene</label>
                <input type="text" value={scene} onChange={e => setScene(e.target.value)} placeholder="e.g. Docking Scene"
                  className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8A8A8A] transition-colors" />
              </div>

              {/* Favorite Character */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-2">Favorite Character</label>
                <input type="text" value={character} onChange={e => setCharacter(e.target.value)} placeholder="e.g. Cooper"
                  className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8A8A8A] transition-colors" />
              </div>

              {/* Favorite Quote */}
              <div>
                <label className="block text-xs text-[#8A8A8A] uppercase tracking-wider mb-2">Favorite Quote</label>
                <input type="text" value={quote} onChange={e => setQuote(e.target.value)} placeholder="A line that stuck with you..."
                  className="w-full bg-black border border-[#161616] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8A8A8A] transition-colors" />
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="w-full bg-white text-black py-4 rounded-full font-semibold text-lg mt-2 hover:bg-white/90 transition-colors"
              >
                {existing ? 'Update Memory' : 'Save to Journey'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
