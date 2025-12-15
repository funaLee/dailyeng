"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar";
import {
  Search,
  ArrowUpDown,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  getNotifications,
  markNotificationsAsRead,
  type NotificationResult,
} from "@/actions/notification";

// Type labels for NotificationType enum
const typeLabels: Record<string, string> = {
  notebook: "Notebook",
  plan: "Study Plan",
  achievement: "Achievement",
  system: "System",
};

// Type colors for badges
const typeColors: Record<string, string> = {
  notebook: "border-blue-300 text-blue-600 bg-blue-50",
  plan: "border-green-300 text-green-600 bg-green-50",
  achievement: "border-amber-300 text-amber-600 bg-amber-50",
  system: "border-gray-300 text-gray-600 bg-gray-50",
};

interface NotificationsPageClientProps {
  notifications: NotificationResult[];
  totalPages: number;
  currentPage: number;
  unreadCount: number;
  userName: string;
  userId: string;
}

// Format timestamp with "Just now" for < 1 minute
function formatTimestamp(createdAt: Date): string {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format date for display
function formatDate(createdAt: Date): string {
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Format time for display
function formatTime(createdAt: Date): string {
  const date = new Date(createdAt);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function NotificationsPageClient({
  notifications: initialNotifications,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  unreadCount: initialUnreadCount,
  userName,
  userId,
}: NotificationsPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Refs for IntersectionObserver - marks as read in DB only (no UI update until reload)
  const observerRef = useRef<IntersectionObserver | null>(null);
  const unreadToMarkRef = useRef<Set<string>>(new Set());
  const markedInSessionRef = useRef<Set<string>>(new Set()); // Track what we've already marked this session
  const markReadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications with current filters
  const fetchNotifications = useCallback(
    async (page: number, search: string, sort: "newest" | "oldest") => {
      setIsLoading(true);
      try {
        const result = await getNotifications(userId, {
          page,
          limit: 10,
          sortOrder: sort,
          searchQuery: search,
        });
        setNotifications(result.notifications);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
        setUnreadCount(result.unreadCount);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotifications(1, searchQuery, sortOrder);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, sortOrder, fetchNotifications]);

  // Mark notifications as read when they become visible (only in DB, no UI update)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-notification-id");
            const isRead = entry.target.getAttribute("data-is-read") === "true";

            // Only add if not already read and not already marked in this session
            if (id && !isRead && !markedInSessionRef.current.has(id)) {
              unreadToMarkRef.current.add(id);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Batch mark as read every 2 seconds - only update DB, not UI
    markReadTimerRef.current = setInterval(() => {
      if (unreadToMarkRef.current.size > 0) {
        const idsToMark = Array.from(unreadToMarkRef.current);
        unreadToMarkRef.current.clear();

        // Mark these as processed in this session so we don't re-mark them
        idsToMark.forEach((id) => markedInSessionRef.current.add(id));

        // Update database but DON'T update UI - user needs to reload to see changes
        startTransition(async () => {
          await markNotificationsAsRead(idsToMark);
          // Intentionally NOT updating localMarkedRead or unreadCount
          // UI only updates on page reload
        });
      }
    }, 2000);

    return () => {
      observerRef.current?.disconnect();
      if (markReadTimerRef.current) {
        clearInterval(markReadTimerRef.current);
      }
    };
  }, []);

  // Observe notification cards
  const notificationCardRef = useCallback((node: HTMLDivElement | null) => {
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchNotifications(page, searchQuery, sortOrder);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "newest" ? "oldest" : "newest";
    setSortOrder(newOrder);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Check if notification is read (only from DB, not local state)
  const isNotificationRead = (notification: NotificationResult) => {
    return notification.isRead;
  };

  return (
    <ProtectedRoute
      pageName="Notifications"
      pageDescription="Stay updated with your learning progress, achievements, and important announcements."
      pageIcon={<Bell className="w-10 h-10 text-primary" />}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar activePage="notifications" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">
                    Hello, {userName}!
                  </h1>
                  {unreadCount > 0 && (
                    <Badge className="bg-primary text-white">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 bg-white p-10 border-border border-2 shadow-sm rounded-2xl">
              {/* Title */}
              <h2 className="text-xl font-bold text-foreground">
                Your Notifications
              </h2>

              {/* Search and Sort Controls */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-10 text-sm border-input focus:border-primary focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={toggleSortOrder}
                  className="border-input cursor-pointer"
                  disabled={isLoading}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </Button>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card
                      key={i}
                      className="border-border shadow-sm animate-pulse"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-6 w-32 bg-gray-200 rounded" />
                              <div className="h-5 w-20 bg-gray-100 rounded-full" />
                            </div>
                            <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded" />
                          </div>
                          <div className="text-right">
                            <div className="h-4 w-16 bg-gray-100 rounded mb-1" />
                            <div className="h-4 w-20 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                /* Empty State */
                <Card className="p-12 rounded-2xl border-2 border-primary-100 text-center bg-white">
                  <Bell className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {searchQuery ? "No Results Found" : "No Notifications Yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? "Try searching with different keywords."
                      : "You're all caught up! Check back later for updates."}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="default"
                      onClick={clearSearch}
                      className="cursor-pointer"
                    >
                      Clear Search
                    </Button>
                  )}
                </Card>
              ) : (
                <>
                  {/* Notifications List */}
                  <div className="space-y-4">
                    {notifications.map((notification) => {
                      const isRead = isNotificationRead(notification);

                      return (
                        <Card
                          key={notification.id}
                          ref={notificationCardRef}
                          data-notification-id={notification.id}
                          data-is-read={isRead.toString()}
                          className={`border-border shadow-sm transition-all hover:shadow-md ${
                            !isRead ? "bg-primary/5" : ""
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-lg text-foreground">
                                    {notification.title}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-3 py-0.5 ${
                                      typeColors[notification.type] ||
                                      "border-input text-muted-foreground"
                                    }`}
                                  >
                                    {typeLabels[notification.type] ||
                                      notification.type}
                                  </Badge>
                                  {/* Unread indicator dot */}
                                  {!isRead && (
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  )}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {notification.message}
                                </p>
                              </div>

                              <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                <span className="text-xs font-medium text-muted-foreground italic">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                                <span className="text-xs text-foreground font-semibold">
                                  {formatTime(notification.createdAt)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          const showPage =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1;

                          const showEllipsis =
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2);

                          if (showEllipsis) {
                            return (
                              <span
                                key={page}
                                className="px-2 text-muted-foreground"
                              >
                                ...
                              </span>
                            );
                          }

                          if (!showPage) return null;

                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              className="h-9 w-9 p-0 cursor-pointer"
                              onClick={() => goToPage(page)}
                              disabled={isLoading}
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
