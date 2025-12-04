"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { Search, Filter, ArrowUpDown, Bookmark, Lock, FolderOpen } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface Collection {
  id: string
  title: string
  description: string
  image: string
  type: "vocabulary" | "grammar" | "speaking"
  itemCount: number
  progress: number
  isSaved: boolean
  isLocked: boolean
  difficulty: "beginner" | "intermediate" | "advanced"
  lastUpdated: string
}

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const collections: Collection[] = [
    {
      id: "c1",
      title: "Business English Essentials",
      description: "Master professional vocabulary for workplace communication",
      image: "/learning.jpg",
      type: "vocabulary",
      itemCount: 120,
      progress: 65,
      isSaved: true,
      isLocked: false,
      difficulty: "intermediate",
      lastUpdated: "2 days ago",
    },
    {
      id: "c2",
      title: "Advanced Grammar Patterns",
      description: "Complex sentence structures and academic writing",
      image: "/learning.jpg",
      type: "grammar",
      itemCount: 48,
      progress: 30,
      isSaved: true,
      isLocked: false,
      difficulty: "advanced",
      lastUpdated: "1 week ago",
    },
    {
      id: "c3",
      title: "Conversation Starters",
      description: "Practice natural dialogues for everyday situations",
      image: "/learning.jpg",
      type: "speaking",
      itemCount: 75,
      progress: 85,
      isSaved: false,
      isLocked: false,
      difficulty: "beginner",
      lastUpdated: "3 days ago",
    },
    {
      id: "c4",
      title: "IELTS Vocabulary Booster",
      description: "Essential words for IELTS exam preparation",
      image: "/learning.jpg",
      type: "vocabulary",
      itemCount: 200,
      progress: 0,
      isSaved: false,
      isLocked: true,
      difficulty: "advanced",
      lastUpdated: "1 month ago",
    },
    {
      id: "c5",
      title: "Phrasal Verbs Mastery",
      description: "Common phrasal verbs with real-world examples",
      image: "/learning.jpg",
      type: "grammar",
      itemCount: 90,
      progress: 45,
      isSaved: true,
      isLocked: false,
      difficulty: "intermediate",
      lastUpdated: "5 days ago",
    },
    {
      id: "c6",
      title: "Travel & Tourism Vocabulary",
      description: "Essential phrases for international travel",
      image: "/learning.jpg",
      type: "vocabulary",
      itemCount: 85,
      progress: 20,
      isSaved: false,
      isLocked: false,
      difficulty: "beginner",
      lastUpdated: "1 week ago",
    },
  ]

  const toggleSave = (id: string) => {
    console.log("[v0] Toggled save for collection:", id)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200"
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vocabulary":
        return "📚"
      case "grammar":
        return "📝"
      case "speaking":
        return "🎤"
      default:
        return "📖"
    }
  }

  return (
    <ProtectedRoute
      pageName="Collections"
      pageDescription="Organize and track your learning materials across vocabulary, grammar, and speaking topics."
      pageIcon={<FolderOpen className="w-10 h-10 text-primary" />}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar activePage="collections" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">My Collections</h1>
                <p className="text-sm text-muted-foreground">
                  Organize and track your learning materials across vocabulary, grammar, and speaking topics
                </p>
              </CardContent>
            </Card>

            {/* Search and Filter Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-input focus:border-primary focus:ring-primary"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px] border-input">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="border-input hover:bg-muted"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === "newest" ? "Newest" : "Oldest"}
              </Button>
            </div>

            {/* Collections Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  className={`border-border shadow-sm overflow-hidden group hover:shadow-lg transition-all ${
                    collection.isLocked ? "opacity-75" : ""
                  }`}
                >
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.title}
                      fill
                      className="object-cover"
                    />
                    {collection.isLocked && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <Lock className="h-10 w-10 text-foreground" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-3 left-3 border ${getDifficultyColor(collection.difficulty)} capitalize`}
                    >
                      {collection.difficulty}
                    </Badge>
                    <button
                      onClick={() => toggleSave(collection.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                        collection.isSaved
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-background/90 text-muted-foreground hover:bg-background"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${collection.isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground flex-1">{collection.title}</h3>
                      <span className="text-xl">{getTypeIcon(collection.type)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{collection.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{collection.itemCount} items</span>
                      <span>{collection.lastUpdated}</span>
                    </div>

                    {!collection.isLocked && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="text-primary font-bold">{collection.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${collection.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className={`w-full ${
                        collection.isLocked
                          ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      } transition-colors`}
                      disabled={collection.isLocked}
                    >
                      {collection.isLocked ? "Locked" : "Continue Learning"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Summary */}
            <Card className="border-border shadow-sm bg-primary/5">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">6</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Collections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">3</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">618</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">48%</p>
                    <p className="text-sm text-muted-foreground mt-1">Avg Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
