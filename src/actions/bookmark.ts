"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// SPEAKING BOOKMARKS
// ============================================

export async function toggleSpeakingBookmark(userId: string, scenarioId: string) {
  const existing = await prisma.speakingBookmark.findUnique({
    where: {
      userId_scenarioId: { userId, scenarioId },
    },
  });

  if (existing) {
    await prisma.speakingBookmark.delete({
      where: { id: existing.id },
    });
    revalidatePath("/speaking");
    return { bookmarked: false };
  } else {
    await prisma.speakingBookmark.create({
      data: { userId, scenarioId },
    });
    revalidatePath("/speaking");
    return { bookmarked: true };
  }
}

export async function getSpeakingBookmarks(
  userId: string,
  page: number = 1,
  limit: number = 8
) {
  const skip = (page - 1) * limit;
  
  const [bookmarks, total] = await Promise.all([
    prisma.speakingBookmark.findMany({
      where: { userId },
      include: {
        scenario: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.speakingBookmark.count({ where: { userId } }),
  ]);

  return {
    bookmarks: bookmarks.map((b) => b.scenario),
    bookmarkIds: bookmarks.map((b) => b.scenarioId),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getSpeakingBookmarkIds(userId: string) {
  const bookmarks = await prisma.speakingBookmark.findMany({
    where: { userId },
    select: { scenarioId: true },
  });
  return bookmarks.map((b) => b.scenarioId);
}

// ============================================
// VOCABULARY BOOKMARKS
// ============================================

export async function toggleVocabBookmark(userId: string, topicId: string) {
  const existing = await prisma.vocabBookmark.findUnique({
    where: {
      userId_topicId: { userId, topicId },
    },
  });

  if (existing) {
    await prisma.vocabBookmark.delete({
      where: { id: existing.id },
    });
    revalidatePath("/vocab");
    return { bookmarked: false };
  } else {
    await prisma.vocabBookmark.create({
      data: { userId, topicId },
    });
    revalidatePath("/vocab");
    return { bookmarked: true };
  }
}

export async function getVocabBookmarks(
  userId: string,
  page: number = 1,
  limit: number = 8
) {
  const skip = (page - 1) * limit;
  
  const [bookmarks, total] = await Promise.all([
    prisma.vocabBookmark.findMany({
      where: { userId },
      include: {
        topic: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.vocabBookmark.count({ where: { userId } }),
  ]);

  return {
    bookmarks: bookmarks.map((b) => b.topic),
    bookmarkIds: bookmarks.map((b) => b.topicId),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getVocabBookmarkIds(userId: string) {
  const bookmarks = await prisma.vocabBookmark.findMany({
    where: { userId },
    select: { topicId: true },
  });
  return bookmarks.map((b) => b.topicId);
}

// ============================================
// GRAMMAR BOOKMARKS
// ============================================

export async function toggleGrammarBookmark(userId: string, topicId: string) {
  const existing = await prisma.grammarBookmark.findUnique({
    where: {
      userId_topicId: { userId, topicId },
    },
  });

  if (existing) {
    await prisma.grammarBookmark.delete({
      where: { id: existing.id },
    });
    revalidatePath("/grammar");
    return { bookmarked: false };
  } else {
    await prisma.grammarBookmark.create({
      data: { userId, topicId },
    });
    revalidatePath("/grammar");
    return { bookmarked: true };
  }
}

export async function getGrammarBookmarks(
  userId: string,
  page: number = 1,
  limit: number = 8
) {
  const skip = (page - 1) * limit;
  
  const [bookmarks, total] = await Promise.all([
    prisma.grammarBookmark.findMany({
      where: { userId },
      include: {
        topic: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.grammarBookmark.count({ where: { userId } }),
  ]);

  return {
    bookmarks: bookmarks.map((b) => b.topic),
    bookmarkIds: bookmarks.map((b) => b.topicId),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getGrammarBookmarkIds(userId: string) {
  const bookmarks = await prisma.grammarBookmark.findMany({
    where: { userId },
    select: { topicId: true },
  });
  return bookmarks.map((b) => b.topicId);
}
