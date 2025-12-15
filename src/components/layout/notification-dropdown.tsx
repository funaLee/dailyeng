"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  Trophy,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotifications,
  markNotificationsAsRead,
  type NotificationResult,
} from "@/actions/notification";

// Icon mapping for notification types
const typeIcons: Record<string, React.ElementType> = {
  notebook: BookOpen,
  plan: CalendarCheck,
  achievement: Trophy,
  system: Settings,
};

// Icon colors for notification types
const typeColors: Record<string, string> = {
  notebook: "text-blue-500 border-blue-300 bg-blue-50",
  plan: "text-green-500 border-green-300 bg-green-50",
  achievement: "text-amber-500 border-amber-300 bg-amber-50",
  system: "text-gray-500 border-gray-300 bg-gray-50",
};

// Truncate message to max words
function truncateWords(text: string, maxWords: number = 20): string {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

// Format relative timestamp
function formatRelativeTime(createdAt: Date): string {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export function NotificationDropdown() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // Cache notifications in state
  const [notifications, setNotifications] = useState<
    NotificationResult[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Refs for IntersectionObserver
  const observerRef = useRef<IntersectionObserver | null>(null);
  const unreadToMarkRef = useRef<Set<string>>(new Set());
  const markedInSessionRef = useRef<Set<string>>(new Set());
  const markReadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContentRef = useRef<HTMLDivElement | null>(null);

  // Fetch notifications when dropdown opens for the first time
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && notifications === null && session?.user?.id) {
      setIsLoading(true);
      try {
        const result = await getNotifications(session.user.id, {
          page: 1,
          limit: 10,
          sortOrder: "newest",
        });
        setNotifications(result.notifications);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Setup IntersectionObserver when dropdown opens
  useEffect(() => {
    if (!isOpen || !notifications) return;

    // Create observer for the dropdown content
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-notification-id");
            const isRead = entry.target.getAttribute("data-is-read") === "true";

            if (id && !isRead && !markedInSessionRef.current.has(id)) {
              unreadToMarkRef.current.add(id);
            }
          }
        });
      },
      {
        threshold: 0.5,
        root: dropdownContentRef.current,
      }
    );

    // Batch mark as read every 2 seconds
    markReadTimerRef.current = setInterval(() => {
      if (unreadToMarkRef.current.size > 0) {
        const idsToMark = Array.from(unreadToMarkRef.current);
        unreadToMarkRef.current.clear();

        idsToMark.forEach((id) => markedInSessionRef.current.add(id));

        startTransition(async () => {
          await markNotificationsAsRead(idsToMark);
        });
      }
    }, 2000);

    return () => {
      observerRef.current?.disconnect();
      if (markReadTimerRef.current) {
        clearInterval(markReadTimerRef.current);
      }
    };
  }, [isOpen, notifications]);

  // Observe notification items
  const notificationItemRef = useCallback((node: HTMLDivElement | null) => {
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        ref={dropdownContentRef}
        align="end"
        className="w-80 max-h-[420px] overflow-y-auto bg-white border-gray-200 shadow-lg p-0 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && notifications?.length === 0 && (
          <div className="text-center py-8 px-4">
            <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        )}

        {/* Notification Items */}
        {!isLoading && notifications && notifications.length > 0 && (
          <>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const IconComponent = typeIcons[notification.type] || Bell;
                const iconColorClass =
                  typeColors[notification.type] ||
                  "text-gray-500 border-gray-300 bg-gray-50";
                const isRead = notification.isRead;

                return (
                  <div
                    key={notification.id}
                    ref={notificationItemRef}
                    data-notification-id={notification.id}
                    data-is-read={isRead.toString()}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${iconColorClass}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {notification.title}
                        </p>
                        {/* Unread indicator */}
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-snug mt-0.5">
                        {truncateWords(notification.message, 20)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Link */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
              <Link
                href="/user/notifications"
                className="block text-center text-sm font-medium text-primary hover:text-primary-700 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
