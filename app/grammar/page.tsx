"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Clock } from "lucide-react"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const GRAMMAR_GROUPS = [
  {
    name: "Tenses",
    subcategories: ["Present Simple", "Past Simple", "Future Simple", "Present Perfect", "Past Perfect"],
  },
  {
    name: "Sentence Structure",
    subcategories: ["Basic Sentences", "Compound Sentences", "Complex Sentences", "Word Order"],
  },
  {
    name: "Modals",
    subcategories: ["Can/Could", "May/Might", "Must/Have to", "Should/Ought to", "Will/Would"],
  },
  {
    name: "Conditionals",
    subcategories: ["Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"],
  },
  {
    name: "Passive Voice",
    subcategories: ["Present Passive", "Past Passive", "Future Passive", "Modal Passive"],
  },
  {
    name: "Reported Speech",
    subcategories: ["Statements", "Questions", "Commands", "Time Changes"],
  },
  {
    name: "Articles",
    subcategories: ["A/An", "The", "Zero Article", "Article Rules"],
  },
  {
    name: "Prepositions",
    subcategories: ["Time Prepositions", "Place Prepositions", "Movement", "Common Phrases"],
  },
]

const mockGrammarTopics = [
  {
    id: "g1",
    title: "Present Simple",
    description: "Learn how to use present simple tense for habits, facts, and routines",
    level: "A1",
    lessonCount: 8,
    estimatedTime: 30,
  },
  {
    id: "g2",
    title: "Past Simple",
    description: "Master past simple for completed actions in the past",
    level: "A2",
    lessonCount: 10,
    estimatedTime: 40,
  },
  {
    id: "g3",
    title: "Modal Verbs",
    description: "Understand how to use can, could, may, might, must, should, and will",
    level: "B1",
    lessonCount: 12,
    estimatedTime: 50,
  },
]

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Tenses")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Present Simple")

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const currentSubcategories = GRAMMAR_GROUPS.find((g) => g.name === selectedGroup)?.subcategories || []

  return (
    <ProtectedRoute
      pageName="Grammar Hub"
      pageDescription="Master English grammar with structured lessons and practice exercises."
      pageIcon={PageIcons.grammar}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">GRAMMAR HUB</h1>
            <p className="text-muted-foreground mb-6">Master English grammar with structured lessons.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button className="gap-2">Build Study Plan</Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                Choose Learning Topic
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Today's lessons: 5 lessons</span>
              <Button variant="outline" size="sm">
                Review now
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
            <div className="absolute right-12 top-12 text-blue-600/20 text-6xl font-bold rotate-12">grammar</div>
            <div className="absolute right-24 top-32 text-blue-600/20 text-5xl font-bold -rotate-6">structure</div>
            <div className="absolute right-8 top-52 text-blue-600/20 text-4xl font-bold rotate-3">syntax</div>
          </div>
        </Card>
        <div className="mb-8 flex items-center border-b border-gray-200">
          <button className="pb-3 px-4 text-lg font-bold transition-colors border-b-2 border-primary text-primary">
            All Topics
          </button>
          <button className="pb-3 px-4 text-lg font-bold transition-colors border-b-2 border-transparent text-muted-foreground hover:text-gray-900">
            Bookmarks
          </button>
          <div className="flex-1" />
          <Input
            placeholder="Search grammar topics..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-5 bg-[#F0F9FF] border-blue-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-blue-900">Topic Groups</h3>
              <div className="space-y-1">
                {GRAMMAR_GROUPS.map((group) => (
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
                    {selectedGroup === group.name ? (
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300 flex-shrink-0" />
                    )}
                    <span className="truncate">{group.name}</span>
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-muted-foreground mt-2 px-2 hover:bg-transparent hover:text-primary"
                >
                  + View more groups
                </Button>
              </div>
            </Card>

            <Card className="p-5 bg-[#F0F9FF] border-blue-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-blue-900">Levels</h3>
              <Select defaultValue="cefr">
                <SelectTrigger className="w-full mb-4 bg-white border-blue-200">
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cefr">CEFR</SelectItem>
                  <SelectItem value="ielts">IELTS</SelectItem>
                  <SelectItem value="toefl">TOEFL</SelectItem>
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
                      ? "bg-blue-400 text-white border-blue-400 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockGrammarTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="group relative overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="absolute right-3 top-3 z-10">
                    <Badge className="bg-white/90 font-bold text-blue-600 shadow-sm backdrop-blur-sm hover:bg-white/90">
                      {topic.level}
                    </Badge>
                  </div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src="/learning.png"
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
                        Grammar
                      </Badge>
                      <span className="flex items-center text-[10px] font-medium text-slate-400">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        15 min
                      </span>
                    </div>
                    <h4 className="mb-2 line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{topic.description}</p>

                    <div className="flex gap-2">
                      <Link href={`/grammar/${topic.id}`} className="flex-1">
                        <Button className="w-full h-9 rounded-xl bg-blue-300 text-xs font-semibold shadow-lg shadow-blue-100/50 transition-all hover:bg-blue-400 hover:shadow-blue-300">
                          <Play className="mr-1.5 h-3.5 w-3.5" />
                          Start Lesson
                        </Button>
                      </Link>
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
      </div>
    </ProtectedRoute>
  )
}
