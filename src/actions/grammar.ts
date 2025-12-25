"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache configuration
const GRAMMAR_CACHE_TAG = "grammar-data";
const CACHE_TTL = 86400; // 24 hours in seconds

// Helper to capitalize first letter of each word
function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================================================
// Cached Grammar Topic Groups Query
// ============================================================================
export const getGrammarTopicGroups = unstable_cache(
  async () => {
    const groups = await prisma.topicGroup.findMany({
      where: { hubType: "grammar" },
      orderBy: { order: "asc" },
    });

    // Transform to UI format (capitalize names)
    return groups.map((g) => ({
      id: g.id,
      name: toTitleCase(g.name),
      subcategories: g.subcategories.map((s) => toTitleCase(s)),
    }));
  },
  ["grammar-topic-groups"],
  { revalidate: CACHE_TTL, tags: [GRAMMAR_CACHE_TAG] }
);

// ============================================================================
// Cached Grammar Topics Base Query (without user progress)
// ============================================================================
async function fetchGrammarTopicsBase(
  category?: string,
  subcategory?: string,
  levels?: string[],
  page: number = 1,
  limit: number = 100
) {
  const skip = (page - 1) * limit;

  // Build where clause with optional filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    topicGroup: {
      hubType: "grammar",
    },
  };

  if (category) {
    where.category = category;
  }
  if (subcategory && subcategory !== "All") {
    where.subcategory = subcategory;
  }
  if (levels && levels.length > 0) {
    where.level = { in: levels };
  }

  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      orderBy: [{ category: "asc" }, { subcategory: "asc" }, { order: "asc" }],
      skip,
      take: limit,
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    }),
    prisma.topic.count({ where }),
  ]);

  return { topics, total, page, limit };
}

// Create cached version with dynamic cache key based on filters
function getCachedGrammarTopics(
  category?: string,
  subcategory?: string,
  levels?: string[],
  page: number = 1,
  limit: number = 100
) {
  // Build cache key from parameters
  const cacheKey = `grammar-topics-${category || "all"}-${
    subcategory || "all"
  }-${(levels || []).sort().join(",") || "all"}-p${page}-l${limit}`;

  return unstable_cache(
    () => fetchGrammarTopicsBase(category, subcategory, levels, page, limit),
    [cacheKey],
    { revalidate: CACHE_TTL, tags: [GRAMMAR_CACHE_TAG] }
  )();
}

// ============================================================================
// Get Grammar Topics with User Progress
// ============================================================================
export async function getGrammarTopicsWithProgress(
  userId?: string,
  options?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    levels?: string[];
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 100;

  // Step 1: Get cached topics (no user data)
  const { topics, total } = await getCachedGrammarTopics(
    options?.category,
    options?.subcategory,
    options?.levels,
    page,
    limit
  );

  // Step 2: Get user progress separately (if logged in)
  const topicIds = topics.map((t) => t.id);
  const userProgress = userId
    ? await getUserTopicsProgress(userId, topicIds)
    : [];

  // Build lookup map for user progress
  const progressMap = new Map<string, number>();
  for (const progress of userProgress) {
    progressMap.set(progress.topicId, progress.progress);
  }

  // Step 3: Transform and merge
  const items = topics.map((t) => {
    const userProgressValue = progressMap.get(t.id) || 0;

    return {
      id: t.id,
      title: t.title,
      description: t.description,
      level: t.level,
      category: t.category || "Tenses",
      subcategory: t.subcategory || "All",
      lessonCount: t._count.lessons,
      estimatedTime: t.estimatedTime,
      progress: userProgressValue,
      thumbnail: t.thumbnail || undefined,
    };
  });

  return {
    topics: items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// Fetch user progress for specific topics (NOT cached - user specific)
async function getUserTopicsProgress(userId: string, topicIds: string[]) {
  if (topicIds.length === 0) return [];

  return prisma.userTopicProgress.findMany({
    where: {
      userId,
      topicId: { in: topicIds },
    },
    select: {
      topicId: true,
      progress: true,
    },
  });
}

// ============================================================================
// Get Grammar Topic Detail by ID (cached)
// ============================================================================
export const getGrammarTopicById = unstable_cache(
  async (topicId: string) => {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        grammarNotes: true,
        lessons: {
          orderBy: { order: "asc" },
        },
        quizItems: true,
        _count: {
          select: { lessons: true },
        },
      },
    });

    if (!topic) return null;

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      level: topic.level,
      category: topic.category || "Grammar",
      subcategory: topic.subcategory || "",
      lessonCount: topic._count.lessons,
      estimatedTime: topic.estimatedTime,
      thumbnail: topic.thumbnail || undefined,
      grammarNotes: topic.grammarNotes.map((note) => ({
        id: note.id,
        title: note.title,
        explanation: note.explanation,
        examples: note.examples as { en: string; vi: string }[],
      })),
      lessons: topic.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        type: lesson.type,
        order: lesson.order,
      })),
      quizItems: topic.quizItems.map((quiz) => ({
        id: quiz.id,
        question: quiz.question,
        type: quiz.type,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
      })),
    };
  },
  ["grammar-topic-detail"],
  { revalidate: CACHE_TTL, tags: [GRAMMAR_CACHE_TAG] }
);

// ============================================================================
// Get User's Current Grammar Topic Progress
// ============================================================================
export async function getCurrentGrammarTopic(userId: string) {
  // Get the most recently accessed topic or currently in-progress topic
  const progress = await prisma.userTopicProgress.findFirst({
    where: {
      userId,
      progress: { gt: 0, lt: 100 }, // In progress
      topic: {
        topicGroup: { hubType: "grammar" },
      },
    },
    orderBy: { progress: "desc" },
    include: {
      topic: {
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  if (!progress) return null;

  // Calculate current lesson position
  const completedLessons = Math.floor(
    (progress.progress / 100) * progress.topic._count.lessons
  );

  return {
    id: progress.topic.id,
    title: progress.topic.title,
    subtitle: `Lesson ${completedLessons + 1} of ${
      progress.topic._count.lessons
    }`,
  };
}

// ============================================================================
// Search Grammar Topics
// ============================================================================
export async function searchGrammarTopics(query: string) {
  if (!query.trim()) return [];

  const topics = await prisma.topic.findMany({
    where: {
      AND: [
        {
          topicGroup: { hubType: "grammar" },
        },
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    take: 50,
    orderBy: { title: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  });

  return topics.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    level: t.level,
    category: t.category || "Tenses",
    subcategory: t.subcategory || "All",
    lessonCount: t._count.lessons,
    estimatedTime: t.estimatedTime,
    progress: 0,
    thumbnail: t.thumbnail || undefined,
  }));
}
