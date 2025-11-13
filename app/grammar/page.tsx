"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

      <div className="mb-6 flex gap-2 items-center">
        <Input
          placeholder="Search grammar topics..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-[#C2E2FA]/30">
            <h3 className="font-bold text-lg mb-4">Topic Groups</h3>
            <div className="space-y-1">
              {GRAMMAR_GROUPS.map((group) => (
                <button
                  key={group.name}
                  onClick={() => {
                    setSelectedGroup(group.name)
                    setSelectedSubcategory(group.subcategories[0])
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                    selectedGroup === group.name ? "bg-white font-semibold shadow-sm" : "hover:bg-white/50"
                  }`}
                >
                  {selectedGroup === group.name && (
                    <div className="h-4 w-4 rounded-full border-4 border-primary flex-shrink-0" />
                  )}
                  {selectedGroup !== group.name && (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
                  )}
                  <span>{group.name}</span>
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs mt-2 bg-gray-400 text-white hover:bg-gray-500 hover:text-white"
              >
                More
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-[#C2E2FA]/30">
            <h3 className="font-bold text-lg mb-4">Levels</h3>
            <Button variant="outline" size="sm" className="w-full justify-center text-xs mb-3 bg-white">
              CEFR
            </Button>
            <div className="space-y-2">
              {CEFR_LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => toggleLevel(level)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{level} CEFR</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <div className="flex flex-wrap gap-3 mb-6">
            {currentSubcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcategory(subcat)}
                className={`px-6 py-3 rounded-lg text-base font-semibold whitespace-nowrap transition-colors shadow-sm ${
                  selectedSubcategory === subcat
                    ? "bg-blue-800 text-white"
                    : "bg-[#C2E2FA] text-blue-900 hover:bg-blue-300"
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {mockGrammarTopics.map((topic) => (
              <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-blue-300" />
                <div className="p-3">
                  <h3 className="font-semibold text-base mb-1.5 line-clamp-2">{topic.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                      Grammar
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                      {topic.level}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-2">
                    {topic.lessonCount} lessons • {topic.estimatedTime} min
                  </div>
                  <div className="h-1 bg-secondary rounded-full mb-3">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "30%" }} />
                  </div>
                  <div className="flex gap-1.5">
                    <Link href={`/grammar/${topic.id}`} className="flex-1">
                      <Button className="w-full text-xs h-7" size="sm">
                        Continue
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-transparent">
                      View
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
