"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTopics } from "@/lib/mock-data"
import type { Topic } from "@/types"
import { Volume2 } from "lucide-react"

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const TOPIC_GROUPS = [
  "Animals",
  "Appearance",
  "Communication",
  "Culture",
  "Food and drink",
  "Functions",
  "Health",
  "Homes and buildings",
  "Leisure",
  "Notions",
]

const TOPIC_CATEGORIES = ["Animals", "Birds", "Fish and shellfish", "Insects, worms, etc."]

type TabType = "popular" | "dictionary" | "wordlist"

export default function VocabPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Animals")
  const [activeTab, setActiveTab] = useState<TabType>("popular")

  useEffect(() => {
    setTopics(mockTopics)
    setLoading(false)
  }, [])

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(topic.level)
    return matchesSearch && matchesLevel
  })

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

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
          <h1 className="text-4xl font-bold mb-2">VOCABULARY HUB</h1>
          <p className="text-muted-foreground mb-6">Your daily vocabulary journey starts here.</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button className="gap-2">Build Study Plan</Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Choose Learning Topic
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Today's word: 30 words</span>
            <Button variant="outline" size="sm">
              Review now
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
          <div className="absolute right-12 top-12 text-blue-600/20 text-6xl font-bold rotate-12">appointment</div>
          <div className="absolute right-24 top-32 text-blue-600/20 text-5xl font-bold -rotate-6">outcome</div>
          <div className="absolute right-8 top-52 text-blue-600/20 text-4xl font-bold rotate-3">curiosity</div>
        </div>
      </Card>

      <div className="mb-6 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "popular"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Popular Topics
        </button>
        <button
          onClick={() => setActiveTab("dictionary")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "dictionary"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Dictionary
        </button>
        <button
          onClick={() => setActiveTab("wordlist")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "wordlist"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Word list
        </button>
        <div className="flex-1" />
        <Input
          placeholder="Search"
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {TOPIC_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 rounded-full bg-blue-200 text-blue-900 text-sm font-medium whitespace-nowrap hover:bg-blue-300 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Topic Groups</h3>
            <div className="space-y-1">
              {TOPIC_GROUPS.map((group) => (
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
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                More
              </Button>
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
          {activeTab === "popular" && (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-200 to-blue-300 relative">
                    <img
                      src={topic.thumbnail || "/placeholder.svg?height=200&width=400"}
                      alt={topic.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-900 text-xs font-medium">
                        Daily Life
                      </span>
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                        {topic.level}
                      </span>
                      <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                        {topic.level}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {topic.wordCount} / {topic.wordCount}
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full mb-4">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "50%" }} />
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/vocab/${topic.id}`} className="flex-1">
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
          )}

          {activeTab === "dictionary" && (
            <div className="grid md:grid-cols-4 gap-4">
              {["Parent", "Parent", "Parent", "Parent", "Parent", "Parent", "Parent", "Parent"].map((word, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs">Noun</span>
                      <span className="px-2 py-0.5 rounded bg-secondary text-xs">Family</span>
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{word}</h3>
                  <div className="text-xs text-muted-foreground mb-3">Using 10/30</div>
                  <div className="h-1 bg-secondary rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "33%" }} />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "wordlist" && (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">Word list view coming soon...</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
