"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// NOTIFICATION ACTIONS
// ============================================

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
  sortOrder?: "newest" | "oldest";
  searchQuery?: string;
}

export interface NotificationResult {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface GetNotificationsResponse {
  notifications: NotificationResult[];
  total: number;
  totalPages: number;
  currentPage: number;
  unreadCount: number;
}

/**
 * Get notifications for a user with pagination, search, and filter
 */
export async function getNotifications(
  userId: string,
  options: GetNotificationsOptions = {}
): Promise<GetNotificationsResponse> {
  const {
    page = 1,
    limit = 10,
    sortOrder = "newest",
    searchQuery = "",
  } = options;

  const skip = (page - 1) * limit;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId };

  // Add search filter if provided
  if (searchQuery.trim()) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { message: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Fetch notifications with pagination
  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: sortOrder === "newest" ? "desc" : "asc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return {
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.isRead,
      createdAt: n.createdAt,
    })),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    unreadCount,
  };
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  revalidatePath("/user/notifications");
  return { success: true };
}

/**
 * Mark multiple notifications as read (batch operation)
 */
export async function markNotificationsAsRead(notificationIds: string[]) {
  if (notificationIds.length === 0) return { success: true, count: 0 };

  const result = await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath("/user/notifications");
  return { success: true, count: result.count };
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string) {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return count;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/user/notifications");
  return { success: true, count: result.count };
}
