"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache configuration
const VOCAB_CACHE_TAG = "vocab-data";
const CACHE_TTL = 86400; // 24 hours in seconds

// Helper to capitalize first letter of each word
function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================================================
// Fetch TopicGroups for Vocabulary Hub (cached)
// ============================================================================
export const getVocabTopicGroups = unstable_cache(
  async () => {
    const groups = await prisma.topicGroup.findMany({
      where: { hubType: "vocab" },
      orderBy: { order: "asc" },
    });

    // Transform to UI format
    return groups.map((g) => ({
      id: g.id,
      name: toTitleCase(g.name),
      subcategories: g.subcategories.map((s) => toTitleCase(s)),
    }));
  },
  ["vocab-topic-groups"],
  { revalidate: CACHE_TTL, tags: [VOCAB_CACHE_TAG] }
);

// ============================================================================
// Cached Base Topics Query (without user progress)
// ============================================================================
async function fetchVocabTopicsBase(
  category?: string,
  subcategory?: string,
  levels?: string[],
  page: number = 1,
  limit: number = 12
) {
  const skip = (page - 1) * limit;

  // First, find the TopicGroup by name to get its ID
  let topicGroupId: string | undefined;
  if (category) {
    const group = await prisma.topicGroup.findFirst({
      where: {
        name: { equals: category, mode: "insensitive" },
        hubType: "vocab",
      },
    });
    topicGroupId = group?.id;
  }

  // Build where clause for Topics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    topicGroupId: topicGroupId ? topicGroupId : { not: null },
  };

  // Filter by subcategory if not "All"
  if (subcategory && subcategory !== "All") {
    where.subcategory = { equals: subcategory, mode: "insensitive" };
  }

  // Filter by levels
  if (levels && levels.length > 0) {
    where.level = { in: levels };
  }

  // Only get topics that belong to vocab TopicGroups
  where.topicGroup = { hubType: "vocab" };

  // Fetch topics WITHOUT user progress (cacheable)
  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      include: {
        topicGroup: true,
        _count: {
          select: { vocabItems: true },
        },
      },
      orderBy: [{ topicGroup: { order: "asc" } }, { order: "asc" }],
      skip,
      take: limit,
    }),
    prisma.topic.count({ where }),
  ]);

  return { topics, total, page, limit };
}

// Create cached version with dynamic cache key based on filters
function getCachedVocabTopics(
  category?: string,
  subcategory?: string,
  levels?: string[],
  page: number = 1,
  limit: number = 12
) {
  // Build cache key from parameters
  const cacheKey = `vocab-topics-${category || "all"}-${subcategory || "all"}-${
    (levels || []).sort().join(",") || "all"
  }-p${page}-l${limit}`;

  return unstable_cache(
    () => fetchVocabTopicsBase(category, subcategory, levels, page, limit),
    [cacheKey],
    { revalidate: CACHE_TTL, tags: [VOCAB_CACHE_TAG] }
  )();
}

// Fetch user progress for specific topics (NOT cached - user specific)
async function getUserTopicsProgress(userId: string, topicIds: string[]) {
  if (topicIds.length === 0) return new Map<string, number>();

  // Get all vocab items for these topics with user progress
  const vocabItems = await prisma.vocabItem.findMany({
    where: {
      topicId: { in: topicIds },
    },
    select: {
      topicId: true,
      userProgress: {
        where: { userId },
        select: { masteryLevel: true },
      },
    },
  });

  // Calculate progress per topic
  const topicProgress = new Map<string, { total: number; mastered: number }>();

  for (const item of vocabItems) {
    const current = topicProgress.get(item.topicId) || {
      total: 0,
      mastered: 0,
    };
    current.total++;
    if (
      item.userProgress.length > 0 &&
      item.userProgress[0].masteryLevel >= 100
    ) {
      current.mastered++;
    }
    topicProgress.set(item.topicId, current);
  }

  // Convert to percentage
  const progressMap = new Map<string, number>();
  for (const [topicId, { total, mastered }] of topicProgress) {
    progressMap.set(
      topicId,
      total > 0 ? Math.round((mastered / total) * 100) : 0
    );
  }

  return progressMap;
}

// ============================================================================
// Fetch Vocabulary Topics with User Progress (Paginated)
// Uses cached topics + separate user progress query
// ============================================================================
export async function getVocabTopicsWithProgress(
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
  const limit = options?.limit || 12;

  // Step 1: Get cached topics (no user data)
  const { topics, total } = await getCachedVocabTopics(
    options?.category,
    options?.subcategory,
    options?.levels,
    page,
    limit
  );

  // Step 2: Get user progress separately (if logged in)
  const topicIds = topics.map((t) => t.id);
  const progressMap = userId
    ? await getUserTopicsProgress(userId, topicIds)
    : new Map<string, number>();

  // Step 3: Transform and merge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = topics.map((t: any) => {
    const progress = progressMap.get(t.id) || 0;

    return {
      id: t.id,
      title: t.title,
      description: t.description || "",
      level: t.level || "A1",
      category: t.topicGroup?.name ? toTitleCase(t.topicGroup.name) : "General",
      subcategory: t.subcategory ? toTitleCase(t.subcategory) : "",
      wordCount: t._count.vocabItems || t.wordCount || 0,
      estimatedTime: t.estimatedTime || 30,
      thumbnail: t.thumbnail || "/learning.png",
      progress,
    };
  });

  return {
    topics: items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// ============================================================================
// Search Vocabulary Topics
// ============================================================================
export async function searchVocabTopics(query: string, userId?: string) {
  if (!query.trim()) return [];

  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
      topicGroup: { hubType: "vocab" },
    },
    include: {
      topicGroup: true,
      _count: {
        select: { vocabItems: true },
      },
    },
    take: 50,
    orderBy: { title: "asc" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return topics.map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    level: t.level || "A1",
    category: t.topicGroup?.name ? toTitleCase(t.topicGroup.name) : "General",
    subcategory: t.subcategory ? toTitleCase(t.subcategory) : "",
    wordCount: t._count.vocabItems || t.wordCount || 0,
    estimatedTime: t.estimatedTime || 30,
    thumbnail: t.thumbnail || "/learning.png",
    progress: 0,
  }));
}

// ============================================================================
// Fetch Single Topic by ID with Vocab Items
// ============================================================================
export async function getVocabTopicById(topicId: string, userId?: string) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      vocabItems: {
        include: {
          // Include user progress if userId is provided
          userProgress: userId ? { where: { userId } } : false
        }
      }
    }
  });

  if (!topic) return null;

  // Transform vocab items to match UI requirements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vocabItems = topic.vocabItems.map((item: any) => ({
    id: item.id,
    word: item.word,
    type: item.partOfSpeech,
    partOfSpeech: item.partOfSpeech,
    phon_br: item.phonBr,
    phon_n_am: item.phonNAm,
    pronunciation: item.pronunciation,
    meaning: item.meaning,
    vietnameseMeaning: item.vietnameseMeaning,
    exampleSentence: item.exampleSentence,
    exampleTranslation: item.exampleTranslation,
    definitions: item.definitions,
    synonyms: item.synonyms,
    antonyms: item.antonyms,
    collocations: item.collocations,
    masteryLevel: item.userProgress?.[0]?.masteryLevel || 0
  }));

  // Return plain object, excluding Date fields or converting them
  return {
    id: topic.id,
    title: topic.title,
    subtitle: topic.subtitle || "",
    description: topic.description,
    level: topic.level,
    wordCount: topic.wordCount,
    estimatedTime: topic.estimatedTime,
    thumbnail: topic.thumbnail || null,
    category: topic.category,
    subcategory: topic.subcategory,
    vocab: vocabItems
  };
}
