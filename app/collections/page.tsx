"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { Search, Filter, ArrowUpDown, Bookmark, Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

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
      image: "/learning.png",
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
      image: "/learning.png",
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
      image: "/learning.png",
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
      image: "/learning.png",
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
      image: "/learning.png",
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
      image: "/learning.png",
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
        return "bg-slate-100 text-slate-700 border-slate-200"
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
    <div className="container mx-auto px-8 py-8">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          <UserProfileSidebar activePage="collections" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">My Collections</h1>
              <p className="text-sm text-slate-600">
                Organize and track your learning materials across vocabulary, grammar, and speaking topics
              </p>
            </CardContent>
          </Card>

          {/* Search and Filter Controls */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px] border-slate-300">
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
              className="border-slate-300 hover:bg-slate-50"
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
                className={`border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all ${
                  collection.isLocked ? "opacity-75" : ""
                }`}
              >
                <div className="relative aspect-video bg-slate-100">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                  {collection.isLocked && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-white" />
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
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white/90 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${collection.isSaved ? "fill-current" : ""}`} />
                  </button>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 flex-1">{collection.title}</h3>
                    <span className="text-xl">{getTypeIcon(collection.type)}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{collection.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{collection.itemCount} items</span>
                    <span>{collection.lastUpdated}</span>
                  </div>

                  {!collection.isLocked && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Progress</span>
                        <span className="text-blue-600 font-bold">{collection.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${collection.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className={`w-full ${
                      collection.isLocked
                        ? "bg-slate-400 hover:bg-slate-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition-colors`}
                    disabled={collection.isLocked}
                  >
                    {collection.isLocked ? "Locked" : "Continue Learning"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Summary */}
          <Card className="border-slate-200 shadow-sm bg-blue-50/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">6</p>
                  <p className="text-sm text-slate-600 mt-1">Total Collections</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">3</p>
                  <p className="text-sm text-slate-600 mt-1">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">618</p>
                  <p className="text-sm text-slate-600 mt-1">Total Items</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">48%</p>
                  <p className="text-sm text-slate-600 mt-1">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
