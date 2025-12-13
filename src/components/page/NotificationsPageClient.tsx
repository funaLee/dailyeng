"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { Search, ArrowUpDown, Bell } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface Notification {
  id: number;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  date: string;
  read: boolean;
}

interface NotificationsPageClientProps {
  notifications: Notification[];
}

export default function NotificationsPageClient({
  notifications,
}: NotificationsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredNotifications = notifications
    .filter((notif) => {
      if (
        searchQuery &&
        !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notif.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.id - a.id;
      }
      return a.id - b.id;
    });

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
                <h1 className="text-2xl font-bold text-foreground">
                  Hello, Thanh Truc!
                </h1>
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-input focus:border-primary focus:ring-primary"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                  }
                  className="border-input"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </Button>
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-border shadow-sm transition-all hover:shadow-md ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-5 pt-1 pb-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-foreground">
                              {notification.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-input text-muted-foreground text-xs px-3 py-0.5"
                            >
                              {notification.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {notification.description}
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="text-xs font-medium text-muted-foreground italic">
                            {notification.timestamp}
                          </span>
                          <span className="text-xs text-foreground font-semibold">
                            {notification.timestamp.includes(":")
                              ? notification.timestamp
                              : ""}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {notification.date}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
