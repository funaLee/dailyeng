"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

export type NotebookData = {
  id: string;
  name: string;
  type: string;
  color: string;
  count: number;
  mastered: number;
};

// Base function to fetch notebooks from DB
async function fetchNotebooks(userId: string): Promise<NotebookData[]> {
  const notebooks = await prisma.notebook.findMany({
    where: { userId },
    include: {
      items: {
        select: { masteryLevel: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return notebooks.map((nb) => ({
    id: nb.id,
    name: nb.name,
    type: nb.type,
    color: nb.color,
    count: nb.items.length,
    mastered: nb.items.filter((item) => item.masteryLevel >= 80).length,
  }));
}

// Cached version of fetchNotebooks
const getCachedNotebooks = (userId: string) =>
  unstable_cache(() => fetchNotebooks(userId), [`notebooks-${userId}`], {
    revalidate: 300, // Cache for 5 minutes
    tags: [`notebooks-${userId}`, "notebooks"],
  })();

// Get all notebooks for current user (with caching)
export async function getNotebooks(): Promise<NotebookData[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return getCachedNotebooks(session.user.id);
}

// Revalidate notebook cache for current user
export async function revalidateNotebookCache(): Promise<void> {
  const session = await auth();
  if (session?.user?.id) {
    revalidateTag(`notebooks-${session.user.id}`);
  }
  revalidatePath("/notebook");
}

// Create a new notebook
export async function createNotebook(data: {
  name: string;
  type: string;
  color?: string;
}): Promise<{ success: boolean; error?: string; notebook?: NotebookData }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Check if notebook with same name exists
    const existing = await prisma.notebook.findUnique({
      where: {
        userId_name: {
          userId: session.user.id,
          name: data.name,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Notebook with this name already exists",
      };
    }

    const notebook = await prisma.notebook.create({
      data: {
        userId: session.user.id,
        name: data.name,
        type: data.type,
        color: data.color || "primary",
      },
    });

    // Invalidate cache and path
    revalidateTag(`notebooks-${session.user.id}`);
    revalidatePath("/notebook");

    return {
      success: true,
      notebook: {
        id: notebook.id,
        name: notebook.name,
        type: notebook.type,
        color: notebook.color,
        count: 0,
        mastered: 0,
      },
    };
  } catch (error) {
    console.error("Error creating notebook:", error);
    return { success: false, error: "Failed to create notebook" };
  }
}

// Delete a notebook
export async function deleteNotebook(
  notebookId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Verify ownership
    const notebook = await prisma.notebook.findFirst({
      where: {
        id: notebookId,
        userId: session.user.id,
      },
    });

    if (!notebook) {
      return { success: false, error: "Notebook not found" };
    }

    await prisma.notebook.delete({
      where: { id: notebookId },
    });

    // Invalidate cache and path
    revalidateTag(`notebooks-${session.user.id}`);
    revalidatePath("/notebook");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notebook:", error);
    return { success: false, error: "Failed to delete notebook" };
  }
}

// Update notebook name
export async function updateNotebook(
  notebookId: string,
  data: { name?: string; color?: string }
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const notebook = await prisma.notebook.findFirst({
      where: {
        id: notebookId,
        userId: session.user.id,
      },
    });

    if (!notebook) {
      return { success: false, error: "Notebook not found" };
    }

    await prisma.notebook.update({
      where: { id: notebookId },
      data,
    });

    // Invalidate cache and path
    revalidateTag(`notebooks-${session.user.id}`);
    revalidatePath("/notebook");
    return { success: true };
  } catch (error) {
    console.error("Error updating notebook:", error);
    return { success: false, error: "Failed to update notebook" };
  }
}

// Types for NotebookItem
export type NotebookItemData = {
  id: string;
  word: string;
  pronunciation: string | null;
  meaning: string[];
  vietnamese: string[];
  examples: { en: string; vi: string }[];
  partOfSpeech: string | null;
  level: string | null;
  note: string | null;
  tags: string[];
  notebookId: string;
  masteryLevel: number;
  lastReviewed: string | null;
  nextReview: string | null;
};

// Base function to fetch notebook items from DB
async function fetchNotebookItems(
  notebookId: string,
  userId: string
): Promise<NotebookItemData[]> {
  const items = await prisma.notebookItem.findMany({
    where: {
      notebookId,
      userId,
    },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => ({
    id: item.id,
    word: item.word,
    pronunciation: item.pronunciation,
    meaning: item.meaning,
    vietnamese: item.vietnamese,
    examples: item.examples as { en: string; vi: string }[],
    partOfSpeech: item.partOfSpeech,
    level: item.level,
    note: item.note,
    tags: item.tags,
    notebookId: item.notebookId,
    masteryLevel: item.masteryLevel,
    lastReviewed: item.lastReviewed?.toISOString() || null,
    nextReview: item.nextReview?.toISOString() || null,
  }));
}

// Cached version of fetchNotebookItems
const getCachedNotebookItems = (notebookId: string, userId: string) =>
  unstable_cache(
    () => fetchNotebookItems(notebookId, userId),
    [`notebook-items-${notebookId}`],
    {
      revalidate: 300, // Cache for 5 minutes
      tags: [`notebooks-${userId}`, `notebook-items-${notebookId}`],
    }
  )();

// Get all items for a notebook (with caching)
export async function getNotebookItems(
  notebookId: string
): Promise<NotebookItemData[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return getCachedNotebookItems(notebookId, session.user.id);
}

// Create a new notebook item
export async function createNotebookItem(data: {
  notebookId: string;
  word: string;
  pronunciation?: string;
  meaning: string[];
  vietnamese: string[];
  examples: { en: string; vi: string }[];
  partOfSpeech?: string;
  level?: string;
  note?: string;
  tags?: string[];
}): Promise<{ success: boolean; error?: string; item?: NotebookItemData }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const item = await prisma.notebookItem.create({
      data: {
        userId: session.user.id,
        notebookId: data.notebookId,
        word: data.word,
        pronunciation: data.pronunciation,
        meaning: data.meaning,
        vietnamese: data.vietnamese,
        examples: data.examples,
        partOfSpeech: data.partOfSpeech,
        level: data.level,
        note: data.note,
        tags: data.tags || [],
        masteryLevel: 0,
        nextReview: new Date(),
      },
    });

    // Invalidate cache and path
    revalidateTag(`notebooks-${session.user.id}`);
    revalidatePath("/notebook");

    return {
      success: true,
      item: {
        id: item.id,
        word: item.word,
        pronunciation: item.pronunciation,
        meaning: item.meaning,
        vietnamese: item.vietnamese,
        examples: item.examples as { en: string; vi: string }[],
        partOfSpeech: item.partOfSpeech,
        level: item.level,
        note: item.note,
        tags: item.tags,
        notebookId: item.notebookId,
        masteryLevel: item.masteryLevel,
        lastReviewed: null,
        nextReview: item.nextReview?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error("Error creating notebook item:", error);
    return { success: false, error: "Failed to create item" };
  }
}

// Delete a notebook item
export async function deleteNotebookItem(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await prisma.notebookItem.delete({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    // Invalidate cache and path
    revalidateTag(`notebooks-${session.user.id}`);
    revalidatePath("/notebook");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notebook item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

// Update notebook item mastery
export async function updateNotebookItemMastery(
  itemId: string,
  masteryLevel: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await prisma.notebookItem.update({
      where: {
        id: itemId,
        userId: session.user.id,
      },
      data: {
        masteryLevel: Math.max(0, Math.min(100, masteryLevel)),
        lastReviewed: new Date(),
      },
    });

    // Invalidate cache and path
    revalidateTag(`notebooks-${session.user.id}`);
    revalidatePath("/notebook");
    return { success: true };
  } catch (error) {
    console.error("Error updating mastery:", error);
    return { success: false, error: "Failed to update mastery" };
  }
}
