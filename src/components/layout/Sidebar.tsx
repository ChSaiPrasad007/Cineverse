'use client';
import { motion } from 'framer-motion';
import { Play, House, Search, BookOpen, Users, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: House },
    { name: 'Discover', href: '/discover', icon: Search },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-black border-r border-[#161616] p-6 shrink-0">
      <div className="flex items-center gap-3 mb-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
        >
          <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
        </motion.div>
        <span className="text-xl font-bold tracking-[0.2em] text-white">CINEVERSE</span>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.name} href={link.href} className="block">
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(10, 10, 10, 0.8)' }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 ${
                  isActive ? 'bg-[#0A0A0A] text-white font-medium' : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : ''} />
                <span>{link.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-[#161616] text-center text-xs text-[#8A8A8A]">
        <p>Created by</p>
        <p className="font-medium text-white mt-1">Sai Prasad Cheriyala</p>
        <p className="mt-1">chsaiprasad66@gmail.com</p>
      </div>

    </aside>
  );
}
