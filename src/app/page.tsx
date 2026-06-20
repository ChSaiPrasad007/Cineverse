'use client';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center max-w-3xl text-center px-6">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white flex items-center justify-center mb-8"
        >
          <Play className="w-10 h-10 md:w-14 md:h-14 text-white ml-2" fill="currentColor" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-[0.2em] uppercase mb-4"
        >
          CineVerse
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-[#8A8A8A] font-light mb-16 tracking-wide"
        >
          Your Life Through Cinema
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-6 w-full md:w-auto"
        >
          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="block w-full">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-12 py-4 rounded-full font-semibold text-lg flex justify-center w-full cursor-pointer"
            >
              Login with Google
            </motion.div>
          </button>
          <Link href="/dashboard" className="block w-full">
            <motion.div 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="border border-[#161616] text-white px-12 py-4 rounded-full font-semibold text-lg flex justify-center w-full transition-colors cursor-pointer"
            >
              Skip as Guest
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 flex gap-4 text-sm text-[#8A8A8A] flex-wrap justify-center"
        >
          <span>Track Everything</span>
          <span>•</span>
          <span>Review & Remember</span>
          <span>•</span>
          <span>Voice Your Thoughts</span>
        </motion.div>
      </div>
    </main>
  );
}
