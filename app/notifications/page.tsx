"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { Search, Filter, ArrowUpDown, Bell } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface Notification {
  id: number
  title: string
  description: string
  category: string
  timestamp: string
  date: string
  read: boolean
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const notifications: Notification[] = [
    {
      id: 1,
      title: "Latest Update",
      description: "Your speaking session has been reviewed. Check your feedback now!",
      category: "Speaking",
      timestamp: "Just now",
      date: "23-11-2025",
      read: false,
    },
    {
      id: 2,
      title: "Latest Update",
      description: "New vocabulary lesson available in AI and Technology topic.",
      category: "Vocabulary",
      timestamp: "13:45",
      date: "23-11-2025",
      read: false,
    },
    {
      id: 3,
      title: "Latest Update",
      description: "You've earned a new badge: Week Warrior! Keep up the streak.",
      category: "Achievement",
      timestamp: "13:45",
      date: "23-11-2025",
      read: true,
    },
    {
      id: 4,
      title: "Latest Update",
      description: "Your grammar quiz results are ready. You scored 85%!",
      category: "Grammar",
      timestamp: "13:45",
      date: "23-11-2025",
      read: true,
    },
  ]

  const filteredNotifications = notifications
    .filter((notif) => {
      if (filterCategory !== "all" && notif.category.toLowerCase() !== filterCategory.toLowerCase()) {
        return false
      }
      if (
        searchQuery &&
        !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notif.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.id - a.id
      }
      return a.id - b.id
    })

  return (
    <ProtectedRoute
      pageName="Notifications"
      pageDescription="Stay updated with your learning progress, achievements, and important announcements."
      pageIcon={<Bell className="w-10 h-10 text-blue-500" />}
    >
      <div className="container mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar activePage="notifications" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-slate-900">Hello, Thanh Truc!</h1>
              </CardContent>
            </Card>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-900">Your Notifications</h2>

            {/* Search and Filter Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px] border-slate-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="border-slate-300"
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
                  className={`border-slate-200 shadow-sm transition-all hover:shadow-md ${
                    !notification.read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <CardContent className="px-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-slate-900">{notification.title}</h3>
                          <Badge variant="outline" className="border-slate-300 text-slate-600 text-xs px-3 py-0.5">
                            {notification.category}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{notification.description}</p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-900 font-semibold">
                          {notification.timestamp.includes(":") ? notification.timestamp : ""}
                        </span>
                        <span className="text-xs text-slate-500">{notification.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
