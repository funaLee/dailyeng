"use client";

import { Bell, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  icon?: "info" | "success" | "warning";
  message: string;
  highlight?: string;
  time: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Completed a daily challenge for July LeetCoding Challenge 2024",
    highlight: "+10",
    time: "a year ago",
  },
  {
    id: "2",
    message: "Completed a daily challenge for July LeetCoding Challenge 2024",
    highlight: "+10",
    time: "a year ago",
  },
  {
    id: "3",
    message: "Completed a daily challenge for June LeetCoding Challenge 2024",
    highlight: "+10",
    time: "2 years ago",
  },
  {
    id: "4",
    message: "Completed a daily challenge for June LeetCoding Challenge 2024",
    highlight: "+10",
    time: "2 years ago",
  },
  {
    id: "5",
    message: "Completed a daily challenge for June LeetCoding Challenge 2024",
    highlight: "+10",
    time: "2 years ago",
  },
  {
    id: "6",
    message: "Completed a daily challenge for June LeetCoding Challenge 2024",
    highlight: "+10",
    time: "2 years ago",
  },
  {
    id: "7",
    message: "You've earned a new badge: Vocabulary Master",
    highlight: "+50",
    time: "3 days ago",
  },
  {
    id: "8",
    message: "Your speaking session score improved by 15%",
    time: "1 week ago",
  },
  {
    id: "9",
    message: "New grammar lesson available: Advanced Tenses",
    time: "2 weeks ago",
  },
  {
    id: "10",
    message: "Welcome to DailyEng! Start your learning journey today",
    time: "1 month ago",
  },
];

export function NotificationDropdown() {
  return (
    <DropdownMenu>
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
        align="end"
        className="w-80 max-h-96 overflow-y-auto bg-white border-gray-200 shadow-lg p-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          :global(.notification-scroll::-webkit-scrollbar) {
            display: none;
          }
        `}</style>
        <div className="notification-scroll">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-6 w-6 rounded-full border-2 border-purple-500 flex items-center justify-center">
                  <Info className="h-3.5 w-3.5 text-purple-500" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">
                  {notification.message}
                  {notification.highlight && (
                    <span className="ml-1 text-amber-500 font-medium">
                      ● {notification.highlight}
                    </span>
                  )}
                </p>
              </div>

              {/* Time */}
              <div className="flex-shrink-0">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {notification.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
