"use client"

import type React from "react"
import Image from "next/image"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Gift,
  MessageSquarePlus,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Clock,
  Star,
  Trash2,
  Plus,
} from "lucide-react"
import { RadarChart } from "@/components/speaking/radar-chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect, useRef } from "react"

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const TOPIC_GROUPS = [
  {
    name: "Daily Life",
    subcategories: ["Shopping", "Dining", "Healthcare", "Transportation"],
  },
  {
    name: "Professional English",
    subcategories: ["Meetings", "Presentations", "Negotiations", "Interviews"],
  },
  {
    name: "Academic",
    subcategories: ["Lectures", "Discussions", "Research", "Presentations"],
  },
  {
    name: "Business",
    subcategories: ["Marketing", "Sales", "Finance", "Management"],
  },
  {
    name: "Travel",
    subcategories: ["Hotels", "Airports", "Tourist Sites", "Emergency"],
  },
  {
    name: "Social Situations",
    subcategories: ["Parties", "Small Talk", "Making Friends", "Dating"],
  },
]

type TabType = "available" | "custom" | "history"

interface Scenario {
  id: string
  title: string
  description: string
  category: string
  level: string
  image: string
  sessionsCompleted: number
  totalSessions: number
  progress: number
}

const mockScenarios: Scenario[] = [
  {
    id: "1",
    title: "Ordering at a Café",
    description: "Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.",
    category: "Daily Life",
    level: "A1",
    image: "/learning.png",
    sessionsCompleted: 2,
    totalSessions: 5,
    progress: 40,
  },
  {
    id: "2",
    title: "Visiting the doctor",
    description: "Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.",
    category: "Daily Life",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 4,
    progress: 0,
  },
  {
    id: "3",
    title: "Artificial Intelligence",
    description: "Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.",
    category: "Daily Life",
    level: "B1",
    image: "/learning.png",
    sessionsCompleted: 3,
    totalSessions: 6,
    progress: 50,
  },
  {
    id: "4",
    title: "Shopping for Clothes",
    description: "Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.",
    category: "Daily Life",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 1,
    totalSessions: 4,
    progress: 25,
  },
  {
    id: "5",
    title: "Job Interview",
    description: "Practice professional conversations and learn how to present yourself confidently.",
    category: "Professional English",
    level: "B2",
    image: "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 8,
    progress: 0,
  },
  {
    id: "6",
    title: "Hotel Check-in",
    description: "Learn essential phrases for traveling and staying at hotels.",
    category: "Travel",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 2,
    totalSessions: 5,
    progress: 40,
  },
]

const DEMO_TOPICS = [
  { title: "Space", score: 95 },
  { title: "Magic", score: 92 },
  { title: "Future Tech", score: 93 },
  { title: "Shopping", score: 85 },
  { title: "Travel", score: 83 },
  { title: "Business", score: 88 },
  { title: "Healthcare", score: 72 },
  { title: "Education", score: 68 },
  { title: "Sports", score: 75 },
  { title: "Interviews", score: 52 },
  { title: "Presentations", score: 48 },
  { title: "Negotiations", score: 55 },
]

const HISTORY_GRAPH_DATA = Array.from({ length: 50 }, (_, i) => ({
  session: i + 1,
  score: Math.floor(Math.random() * 40) + 60 + (i % 5) * 2, // Random score between 60-100 with some trend
}))

const HISTORY_TOPICS_DATA = [
  {
    id: 1,
    title: "Space Exploration",
    description: "Learn vocabulary used in space travel, astronomy, and scientific discovery.",
    score: 95,
    date: "2024-03-10",
    tags: ["Science", "B2"],
    image: "/learning.png",
  },
  {
    id: 2,
    title: "Magic & Fantasy",
    description: "Discuss magical worlds, spells, and fantasy creatures in descriptive English.",
    score: 92,
    date: "2024-03-09",
    tags: ["Fiction", "C1"],
    image: "/learning.png",
  },
  {
    id: 3,
    title: "Future Technology",
    description: "Debate the implications of AI, robotics, and future tech trends.",
    score: 94,
    date: "2024-03-08",
    tags: ["Tech", "C1"],
    image: "/learning.png",
  },
  {
    id: 4,
    title: "Sustainable Living",
    description: "Talk about eco-friendly habits and saving the planet.",
    score: 91,
    date: "2024-03-05",
    tags: ["Environment", "B2"],
    image: "/learning.png",
  },
  {
    id: 5,
    title: "Job Interview",
    description: "Practice answering common interview questions professionally.",
    score: 85,
    date: "2024-03-04",
    tags: ["Business", "B2"],
    image: "/learning.png",
  },
  {
    id: "6",
    title: "Coffee Culture",
    description: "Describe different types of coffee and café experiences.",
    score: 88,
    date: "2024-03-03",
    tags: ["Daily Life", "A2"],
    image: "/learning.png",
  },
  {
    id: 7,
    title: "Travel Planning",
    description: "Plan a trip, book hotels, and discuss itineraries.",
    score: 82,
    date: "2024-03-01",
    tags: ["Travel", "B1"],
    image: "/learning.png",
  },
  {
    id: 8,
    title: "Movie Reviews",
    description: "Share your opinions on recent movies and actors.",
    score: 89,
    date: "2024-02-28",
    tags: ["Entertainment", "B1"],
    image: "/learning.png",
  },
]

export default function SpeakingRoomPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Daily Life")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Shopping")
  const [activeTab, setActiveTab] = useState<TabType>("available")

  const [historyFilter, setHistoryFilter] = useState<string>("excellent")
  const [historyPage, setHistoryPage] = useState(1)
  const itemsPerPage = 4

  const excellentScrollRef = useRef<HTMLDivElement>(null)
  const goodScrollRef = useRef<HTMLDivElement>(null)
  const averageScrollRef = useRef<HTMLDivElement>(null)
  const poorScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setScenarios(mockScenarios)
    setLoading(false)
  }, [])

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(scenario.level)
    return matchesSearch && matchesLevel
  })

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const currentSubcategories = TOPIC_GROUPS.find((g) => g.name === selectedGroup)?.subcategories || []

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10 // 10px threshold

      if (isAtEnd) {
        // Loop back to start
        ref.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        // Scroll right normally
        ref.current.scrollBy({ left: 300, behavior: "smooth" })
      }
    }
  }

  const getFilteredHistory = () => {
    switch (historyFilter) {
      case "excellent":
        return HISTORY_TOPICS_DATA.filter((t) => t.score >= 90)
      case "good":
        return HISTORY_TOPICS_DATA.filter((t) => t.score >= 80 && t.score < 90)
      case "average":
        return HISTORY_TOPICS_DATA.filter((t) => t.score >= 60 && t.score < 80)
      case "improvement":
        return HISTORY_TOPICS_DATA.filter((t) => t.score < 60)
      default:
        return HISTORY_TOPICS_DATA
    }
  }

  const filteredHistory = getFilteredHistory()
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const currentHistoryItems = filteredHistory.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage)

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">SPEAKING ROOM</h1>
          <p className="text-muted-foreground mb-6">
            Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency, grammar,
            and content.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button className="gap-2">Start Practice</Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Choose Topic
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Practice streak: 7 days</span>
            <Button variant="outline" size="sm">
              Continue
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
          <div className="absolute right-12 top-12 text-blue-600/20 text-6xl font-bold rotate-12">speaking</div>
          <div className="absolute right-24 top-32 text-blue-600/20 text-5xl font-bold -rotate-6">fluency</div>
          <div className="absolute right-8 top-52 text-blue-600/20 text-4xl font-bold rotate-3">practice</div>
        </div>
      </Card>

      <div className="mb-8 flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("available")}
          className={`pb-3 px-2 text-lg font-bold transition-colors border-b-2 ${
            activeTab === "available"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-gray-900"
          }`}
        >
          Available Topics
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`pb-3 px-2 text-lg font-bold transition-colors border-b-2 ${
            activeTab === "custom"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-gray-900"
          }`}
        >
          Custom Topics
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-2 text-lg font-bold transition-colors border-b-2 ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-gray-900"
          }`}
        >
          History
        </button>
        <div className="flex-1" />
        <Input
          placeholder="Search"
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {activeTab === "available" && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-5 bg-[#F0F9FF] border-blue-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-blue-900">Topic Groups</h3>
              <div className="space-y-1">
                {TOPIC_GROUPS.map((group) => (
                  <button
                    key={group.name}
                    onClick={() => {
                      setSelectedGroup(group.name)
                      setSelectedSubcategory(group.subcategories[0])
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-3 ${
                      selectedGroup === group.name
                        ? "bg-white font-semibold text-blue-700 shadow-sm border border-blue-100"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {selectedGroup === group.name && <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    {selectedGroup !== group.name && (
                      <div className="h-2 w-2 rounded-full bg-slate-300 flex-shrink-0" />
                    )}
                    <span>{group.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-[#F0F9FF] border-blue-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-blue-900">Levels</h3>
              <Select defaultValue="CEFR">
                <SelectTrigger className="w-full mb-4 bg-white border-blue-200">
                  <SelectValue placeholder="Select Level System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEFR">CEFR</SelectItem>
                  <SelectItem value="IELTS">IELTS</SelectItem>
                  <SelectItem value="TOEFL">TOEFL</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2.5">
                {CEFR_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 cursor-pointer group hover:bg-blue-50 p-1.5 rounded-md text-sm transition-colors -mx-1.5"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => toggleLevel(level)}
                        className="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-800">{level} Level</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="flex flex-wrap gap-2 mb-6">
              {currentSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    selectedSubcategory === subcat
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredScenarios.map((topic, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="absolute right-3 top-3 z-10">
                    <Badge className="bg-white/90 font-bold text-blue-600 shadow-sm backdrop-blur-sm hover:bg-white/90">
                      {topic.level}
                    </Badge>
                  </div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={topic.image || "/learning.png"}
                      alt={topic.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600"
                      >
                        {topic.category}
                      </Badge>
                      <span className="flex items-center text-[10px] font-medium text-slate-400">
                        <Clock className="mr-1 h-3 w-3" />
                        5-7 min
                      </span>
                    </div>
                    <h4 className="mb-2 line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="mb-4 line-clamp-2 text-xs text-slate-500">{topic.description}</p>
                    <div className="flex gap-2">
                      <Button className="h-9 flex-1 rounded-xl bg-blue-600 text-xs font-semibold shadow-lg shadow-blue-100/50 transition-all hover:bg-blue-700 hover:shadow-blue-300">
                        <Play className="mr-1.5 h-3.5 w-3.5" />
                        Start Speaking
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "custom" && (
        <Card className="p-8 md:p-12 border-none shadow-none bg-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Create Your Own Speaking Scenario</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Customize your learning experience by creating unique role-play scenarios or let AI surprise you with a
                random topic tailored to your level.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <button className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 p-1 text-left transition-all hover:shadow-2xl hover:shadow-violet-200 hover:-translate-y-1">
                <div className="relative h-full rounded-[20px] bg-white/10 p-8 backdrop-blur-sm transition-colors group-hover:bg-white/20">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-md">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Surprise Me</h3>
                  <p className="text-blue-100">
                    Let AI generate a random, exciting scenario for you to practice immediately.
                  </p>
                </div>
              </button>

              <button className="group relative overflow-hidden rounded-3xl bg-white p-1 text-left shadow-lg shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-1 ring-1 ring-slate-100">
                <div className="relative h-full rounded-[20px] bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 transition-colors group-hover:from-blue-100/50 group-hover:to-indigo-100/50">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                    <MessageSquarePlus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">Create Custom Topic</h3>
                  <p className="text-slate-500">
                    Design your own scenario, choose the characters, and set the difficulty level.
                  </p>
                </div>
              </button>
            </div>

            <div className="relative mb-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#F8FAFC] px-4 text-slate-400 font-semibold tracking-wider">Your Library</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <h3 className="text-xl font-bold text-slate-900">Topics you've created</h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search your topics..."
                  className="pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Space Adventure", level: "A1", category: "Sci-Fi" },
                { title: "Magic School", level: "A2", category: "Fantasy" },
                { title: "Job Interview", level: "B1", category: "Business" },
                { title: "Cooking Class", level: "A2", category: "Lifestyle" },
              ].map((topic, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute right-3 top-3 z-10">
                    <Badge className="bg-white/90 font-bold text-blue-600 shadow-sm backdrop-blur-sm">
                      {topic.level}
                    </Badge>
                  </div>
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-lg shadow-violet-100/50 ring-1 ring-slate-100">
                      <Sparkles className="h-7 w-7 text-blue-500" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600"
                      >
                        {topic.category}
                      </Badge>
                      <span className="flex items-center text-[10px] font-medium text-slate-400">Custom</span>
                    </div>
                    <h4 className="mb-1 line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="mb-4 text-xs text-slate-500">Created 2 days ago</p>
                    <div className="flex gap-2">
                      <Button className="h-8 flex-1 rounded-lg bg-slate-200 text-xs font-semibold shadow-md transition-all hover:bg-slate-800">
                        <Play className="mr-1.5 h-3 w-3" />
                        Start
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Empty State / Add New Placeholder */}
              <button className="group relative flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-blue-400 hover:bg-blue-50/50">
                <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110">
                  <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="text-sm font-semibold text-slate-500 group-hover:text-blue-600">Create New</span>
              </button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "history" && (
        <Card className="p-8 lg:p-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold">Review your speaking journey</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for the topic you have practiced"
                  className="pl-10 bg-blue-50/50 border-blue-100 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 mb-16">
              {/* Left Column: Overall Score & Radar Chart */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Your 5 recent speaking result:</h3>
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center mb-4 shadow-lg shadow-blue-100">
                      <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
                        <span className="text-6xl font-bold text-blue-500">81</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-slate-800">Overall speaking score</p>
                  </div>

                  <div className="relative p-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <RadarChart
                      data={[
                        { label: "Relevance", value: 94 },
                        { label: "Pronunciation", value: 82 },
                        { label: "Intonation & Stress", value: 74 },
                        { label: "Fluency", value: 76 },
                        { label: "Grammar", value: 80 },
                      ]}
                      size={350}
                      levels={5}
                      className="w-full aspect-square"
                    />
                  </div>
                </div>
              </div>

              {/* Divider Line (visible on large screens) */}
              <div className="hidden lg:block lg:col-span-1 flex justify-center">
                <div className="h-full w-px bg-slate-200" />
              </div>

              {/* Right Column: Filtered Topic Grid */}
              <div className="lg:col-span-6 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-xl font-bold whitespace-nowrap">
                    {historyFilter === "excellent" && "Excellent range score topic (> 90):"}
                    {historyFilter === "good" && "Good range score topic (80-90):"}
                    {historyFilter === "average" && "Average range score topic (60-80):"}
                    {historyFilter === "improvement" && "Needs improvement (< 60):"}
                  </h3>
                  <Select
                    value={historyFilter}
                    onValueChange={(val) => {
                      setHistoryFilter(val)
                      setHistoryPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[180px] rounded-xl border-slate-200 font-medium">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (&gt;90)</SelectItem>
                      <SelectItem value="good">Good (80-90)</SelectItem>
                      <SelectItem value="average">Average (60-80)</SelectItem>
                      <SelectItem value="improvement">Improvement (&lt;60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {currentHistoryItems.length > 0 ? (
                      currentHistoryItems.map((topic) => (
                        <Card
                          key={topic.id}
                          className="overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group"
                        >
                          <div className="h-28 bg-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img
                                src={topic.image || "/placeholder.svg"}
                                alt={topic.title}
                                className="w-full h-full object-cover opacity-80"
                              />
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-slate-900 mb-1 truncate">{topic.title}</h4>
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2 h-8 leading-4">
                              {topic.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {topic.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <MessageSquarePlus className="h-10 w-10 mb-2 opacity-20" />
                        <p>No topics found in this range</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 mt-auto pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-transparent"
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setHistoryPage(page)}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        historyPage === page ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-transparent"
                    onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                    disabled={historyPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Graph */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">Graph</h3>
              <div className="h-[300px] w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HISTORY_GRAPH_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="session"
                      tick={{ fontSize: 10, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                    />
                    <YAxis
                      domain={[0, 100]}
                      hide={false}
                      tick={{ fontSize: 10, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{ color: "#1E293B", fontWeight: 600 }}
                      cursor={{ stroke: "#94A3B8", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#2563EB" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
