"use server";

import { prisma } from "@/lib/prisma";

// Helper to capitalize first letter of each word
function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================================================
// Fetch TopicGroups for Vocabulary Hub
// ============================================================================
export async function getVocabTopicGroups() {
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
}

// ============================================================================
// Fetch Vocabulary Topics with User Progress (Paginated)
// ============================================================================
export async function getVocabTopicsWithProgress(
  userId?: string,
  options?: {
    page?: number;
    limit?: number;
    category?: string; // TopicGroup name
    subcategory?: string; // "All" or specific subcategory
    levels?: string[]; // ["A1", "A2", ...]
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 12;
  const skip = (page - 1) * limit;

  // First, find the TopicGroup by name to get its ID
  let topicGroupId: string | undefined;
  if (options?.category) {
    const group = await prisma.topicGroup.findFirst({
      where: {
        name: { equals: options.category, mode: "insensitive" },
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
  if (options?.subcategory && options.subcategory !== "All") {
    where.subcategory = { equals: options.subcategory, mode: "insensitive" };
  }

  // Filter by levels
  if (options?.levels && options.levels.length > 0) {
    where.level = { in: options.levels };
  }

  // Only get topics that belong to vocab TopicGroups
  where.topicGroup = { hubType: "vocab" };

  // Fetch topics with vocab items count
  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      include: {
        topicGroup: true,
        _count: {
          select: { vocabItems: true },
        },
        // Include vocab items to calculate progress
        vocabItems: userId
          ? {
            include: {
              userProgress: {
                where: { userId },
              },
            },
          }
          : false,
      },
      orderBy: [{ topicGroup: { order: "asc" } }, { order: "asc" }],
      skip,
      take: limit,
    }),
    prisma.topic.count({ where }),
  ]);

  // Transform to UI format with progress calculation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = topics.map((t: any) => {
    // Calculate progress based on UserVocabProgress
    let progress = 0;
    if (t.vocabItems && t.vocabItems.length > 0) {
      const totalWords = t.vocabItems.length;
      const masteredWords = t.vocabItems.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (v: any) =>
          v.userProgress &&
          v.userProgress.length > 0 &&
          v.userProgress[0].masteryLevel >= 100
      ).length;
      progress = Math.round((masteredWords / totalWords) * 100);
    }

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
