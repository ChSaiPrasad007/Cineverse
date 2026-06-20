'use client';
import { motion } from 'framer-motion';
import { House, Search, BookOpen, Users, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: House },
    { name: 'Discover', href: '/discover', icon: Search },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full h-20 bg-black/80 backdrop-blur-xl border-t border-[#161616] flex items-center justify-around px-6 z-50 pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link key={link.name} href={link.href} className="relative p-2 flex flex-col items-center justify-center">
            <motion.div whileTap={{ scale: 0.85 }}>
              <Icon 
                size={24} 
                className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#8A8A8A] hover:text-white'}`} 
              />
            </motion.div>
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
