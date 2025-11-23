"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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
      <div className="mb-8 flex items-center border-b">
        <button className="px-6 py-3 font-bold text-sm border-b-2 border-primary text-primary transition-colors">
          All Topics
        </button>
        <button className="px-6 py-3 font-bold text-sm border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">
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
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4 bg-slate-50 border-none shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3 px-2">Topic Groups</h3>
            <div className="space-y-1">
              {GRAMMAR_GROUPS.map((group) => (
                <button
                  key={group.name}
                  onClick={() => {
                    setSelectedGroup(group.name)
                    setSelectedSubcategory(group.subcategories[0])
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${
                    selectedGroup === group.name
                      ? "bg-white font-semibold text-primary shadow-sm ring-1 ring-black/5"
                      : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                  }`}
                >
                  {selectedGroup === group.name ? (
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
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

          <Card className="p-4 bg-slate-50 border-none shadow-sm">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-bold text-sm text-slate-900">Levels</h3>
            </div>
            <Select defaultValue="cefr">
              <SelectTrigger className="w-full bg-white mb-4 h-9 text-xs">
                <SelectValue placeholder="Select system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cefr">CEFR (European)</SelectItem>
                <SelectItem value="ielts">IELTS</SelectItem>
                <SelectItem value="toefl">TOEFL</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2 px-1">
              {CEFR_LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`flex items-center justify-center h-5 w-5 rounded border transition-colors ${
                      selectedLevels.includes(level)
                        ? "bg-primary border-primary text-white"
                        : "border-slate-300 bg-white group-hover:border-primary"
                    }`}
                  >
                    {selectedLevels.includes(level) && (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                    />
                  </div>
                  <span
                    className={`text-sm transition-colors ${selectedLevels.includes(level) ? "font-medium text-slate-900" : "text-slate-600"}`}
                  >
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {currentSubcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcategory(subcat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSubcategory === subcat
                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {mockGrammarTopics.map((topic) => (
              <Card
                key={topic.id}
                className="group overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                  <Image
                    src="/learning.png"
                    alt={topic.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md text-[10px] h-5 px-1.5"
                      >
                        {topic.level}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-black/40 hover:bg-black/50 text-white border-0 backdrop-blur-md text-[10px] h-5 px-1.5"
                      >
                        Grammar
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8 leading-relaxed">{topic.description}</p>
                  <div className="flex items-center justify-between mb-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>30%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full w-1/3" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/grammar/${topic.id}`} className="contents">
                      <Button className="w-full h-8 text-xs font-semibold rounded-lg shadow-sm group-hover:shadow-md transition-all">
                        Start
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs font-semibold rounded-lg bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
