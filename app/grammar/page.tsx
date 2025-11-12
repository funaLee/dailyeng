"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const GRAMMAR_GROUPS = [
  "Sentence Structure",
  "Tenses",
  "Modals",
  "Conditionals",
  "Passive Voice",
  "Reported Speech",
  "Articles",
  "Prepositions",
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

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

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
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-purple-200/50 to-purple-400/30 rounded-lg pointer-events-none">
          <div className="absolute right-12 top-12 text-purple-600/20 text-6xl font-bold rotate-12">grammar</div>
          <div className="absolute right-24 top-32 text-purple-600/20 text-5xl font-bold -rotate-6">structure</div>
          <div className="absolute right-8 top-52 text-purple-600/20 text-4xl font-bold rotate-3">syntax</div>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6 flex gap-2 items-center">
        <Input
          placeholder="Search grammar topics..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Grammar Topics</h3>
            <div className="space-y-1">
              {GRAMMAR_GROUPS.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    selectedGroup === group ? "bg-secondary font-medium" : "hover:bg-secondary/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {selectedGroup === group && <div className="h-2 w-2 rounded-full bg-primary" />}
                    {group}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Levels</h3>
            <div className="space-y-2">
              {CEFR_LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
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

        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {mockGrammarTopics.map((topic) => (
              <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-200 to-purple-300" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-900 text-xs font-medium">Grammar</span>
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                      {topic.level}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {topic.lessonCount} lessons • {topic.estimatedTime} min
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full mb-4">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "30%" }} />
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/grammar/${topic.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        Continue
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      View topic
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
