import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Providers } from '@/components/Providers';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  let initialData = { watchedIds: [] as number[], favoriteIds: [] as number[], watchlistIds: [] as number[], journalEntries: [] as any[], user: null as any };

  if (session?.user?.id) {
    const userId = session.user.id;
    const [watched, favorites, watchlist, journals, dbUser] = await Promise.all([
      prisma.watchedMovie.findMany({ where: { userId }, select: { movieId: true } }),
      prisma.favoriteMovie.findMany({ where: { userId }, select: { movieId: true } }),
      prisma.watchlistMovie.findMany({ where: { userId }, select: { movieId: true } }),
      prisma.journalEntry.findMany({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, image: true, bio: true, cineRank: true, id: true } })
    ]);

    initialData = {
      watchedIds: watched.map(w => w.movieId),
      favoriteIds: favorites.map(f => f.movieId),
      watchlistIds: watchlist.map(w => w.movieId),
      journalEntries: journals,
      user: dbUser
    };
  }

  return (
    <Providers initialData={initialData}>
      <div className="flex h-screen w-full overflow-hidden bg-black text-white page-enter relative">
        {/* Cinematic Background */}
        <div className="bg-camera-pan pointer-events-none" aria-hidden="true" />
        <div className="camera-flare pointer-events-none" style={{ top: '10%', left: '10%' }} aria-hidden="true" />
        <div className="camera-flare pointer-events-none" style={{ bottom: '-10%', right: '-10%' }} aria-hidden="true" />
        <div className="bg-film-grain pointer-events-none overflow-hidden" aria-hidden="true" />
        
        {/* Main App Layout */}
        <div className="flex h-full w-full relative z-10">
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-20 md:pb-0 no-scrollbar">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </Providers>
  );
}
