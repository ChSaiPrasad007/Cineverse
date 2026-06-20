'use server';

import { prisma } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function toggleWatchedAction(movieId: number) {
  const userId = await getUserId();
  const existing = await prisma.watchedMovie.findUnique({
    where: { userId_movieId: { userId, movieId } }
  });
  
  if (existing) {
    await prisma.watchedMovie.delete({ where: { id: existing.id } });
    return false;
  } else {
    await prisma.watchedMovie.create({ data: { userId, movieId } });
    await prisma.activity.create({ data: { userId, movieId, action: 'watched' } });
    return true;
  }
}

export async function toggleFavoriteAction(movieId: number) {
  const userId = await getUserId();
  const existing = await prisma.favoriteMovie.findUnique({
    where: { userId_movieId: { userId, movieId } }
  });
  
  if (existing) {
    await prisma.favoriteMovie.delete({ where: { id: existing.id } });
    return false;
  } else {
    await prisma.favoriteMovie.create({ data: { userId, movieId } });
    await prisma.activity.create({ data: { userId, movieId, action: 'favorited' } });
    return true;
  }
}

export async function toggleWatchlistAction(movieId: number) {
  const userId = await getUserId();
  const existing = await prisma.watchlistMovie.findUnique({
    where: { userId_movieId: { userId, movieId } }
  });
  
  if (existing) {
    await prisma.watchlistMovie.delete({ where: { id: existing.id } });
    return false;
  } else {
    await prisma.watchlistMovie.create({ data: { userId, movieId } });
    await prisma.activity.create({ data: { userId, movieId, action: 'added to watchlist' } });
    return true;
  }
}

export async function saveJournalAction(movieId: number, personalRating: number, review?: string, favoriteScene?: string, favoriteCharacter?: string, favoriteQuote?: string, mood?: string) {
  const userId = await getUserId();
  
  const entry = await prisma.journalEntry.create({
    data: {
      userId, movieId, personalRating, review, favoriteScene, favoriteCharacter, favoriteQuote, mood
    }
  });

  // Automatically mark as watched if they add a journal
  const existingWatched = await prisma.watchedMovie.findUnique({ where: { userId_movieId: { userId, movieId } } });
  if (!existingWatched) {
    await prisma.watchedMovie.create({ data: { userId, movieId } });
  }

  await prisma.activity.create({ data: { userId, movieId, action: 'reviewed', rating: personalRating } });
  
  return entry;
}

export async function getGlobalActivityAction() {
  return prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: { name: true, image: true, id: true }
      }
    }
  });
}

export async function searchUsersAction(query: string) {
  if (!query) return [];
  return prisma.user.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' }
    },
    take: 10,
    select: { id: true, name: true, image: true, bio: true }
  });
}

export async function followUserAction(followingId: string) {
  const followerId = await getUserId();
  if (followerId === followingId) return;

  await prisma.follows.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    create: { followerId, followingId },
    update: {}
  });
}

export async function unfollowUserAction(followingId: string) {
  const followerId = await getUserId();
  await prisma.follows.delete({
    where: { followerId_followingId: { followerId, followingId } }
  }).catch(() => {});
}

export async function getFollowingAction() {
  const followerId = await getUserId();
  const follows = await prisma.follows.findMany({
    where: { followerId },
    include: {
      following: {
        select: { id: true, name: true, image: true }
      }
    }
  });
  return follows.map(f => f.following);
}

export async function getFriendsActivityAction() {
  const followerId = await getUserId();
  const follows = await prisma.follows.findMany({
    where: { followerId },
    select: { followingId: true }
  });
  
  const followingIds = follows.map(f => f.followingId);
  if (followingIds.length === 0) return [];

  return prisma.activity.findMany({
    where: { userId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: { name: true, image: true, id: true }
      }
    }
  });
}

export async function updateProfileAction(name: string, bio: string) {
  const userId = await getUserId();
  return prisma.user.update({
    where: { id: userId },
    data: { name, bio }
  });
}
