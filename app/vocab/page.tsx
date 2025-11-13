"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTopics } from "@/lib/mock-data"
import type { Topic } from "@/types"
import { Volume2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
import { MindMap } from "@/components/vocab/mind-map"

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const TOPIC_GROUPS = [
  {
    name: "Animals",
    subcategories: ["Animals", "Birds", "Fish and shellfish", "Insects, worms, etc."],
  },
  {
    name: "Appearance",
    subcategories: ["Physical appearance", "Clothing", "Colors", "Shapes"],
  },
  {
    name: "Communication",
    subcategories: ["Speaking", "Writing", "Listening", "Body language"],
  },
  {
    name: "Culture",
    subcategories: ["Art", "Music", "Literature", "Traditions"],
  },
  {
    name: "Food and drink",
    subcategories: ["Meals", "Cooking", "Restaurants", "Beverages"],
  },
  {
    name: "Functions",
    subcategories: ["Greetings", "Requests", "Apologies", "Suggestions"],
  },
  {
    name: "Health",
    subcategories: ["Illness", "Treatment", "Exercise", "Wellbeing"],
  },
  {
    name: "Homes and buildings",
    subcategories: ["House types", "Rooms", "Furniture", "Appliances"],
  },
  {
    name: "Leisure",
    subcategories: ["Sports", "Hobbies", "Entertainment", "Games"],
  },
  {
    name: "Notions",
    subcategories: ["Time", "Space", "Quantity", "Quality"],
  },
]

type TabType = "popular" | "dictionary" | "mindmap"

export default function VocabPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Animals")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Animals")
  const [activeTab, setActiveTab] = useState<TabType>("popular")

  const [dictionaryWords] = useState([
    {
      id: "1",
      word: "Parent",
      pronunciation: "/ˈpeərənt/",
      meaning: "A father or mother of a person or an animal",
      partOfSpeech: "Noun",
      level: "A1",
      category: "Family",
      masteryLevel: 33,
    },
    {
      id: "2",
      word: "Accomplish",
      pronunciation: "/əˈkʌmplɪʃ/",
      meaning: "To complete or achieve something successfully",
      partOfSpeech: "Verb",
      level: "B1",
      category: "Action",
      masteryLevel: 65,
    },
    {
      id: "3",
      word: "Collaborate",
      pronunciation: "/kəˈlæbəreɪt/",
      meaning: "To work together with others on a project or task",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Workplace",
      masteryLevel: 80,
    },
  ])

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

  const currentSubcategories = TOPIC_GROUPS.find((g) => g.name === selectedGroup)?.subcategories || []

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
        <div className="absolute right-0 top-0 h-full w-1/2 bg-linear-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
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
          onClick={() => setActiveTab("mindmap")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "mindmap"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Mind Map
        </button>
        <div className="flex-1" />
        <Input
          placeholder="Search"
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
              {TOPIC_GROUPS.map((group) => (
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
                    <div className="h-4 w-4 rounded-full border-4 border-primary shrink-0" />
                  )}
                  {selectedGroup !== group.name && (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-400 shrink-0" />
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
          {activeTab === "popular" && (
            <>
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
                {filteredTopics.map((topic) => (
                  <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2">
                    <div className="aspect-[4/3] bg-linear-to-br from-blue-200 to-blue-300 relative">
                      <img
                        src={topic.thumbnail || "/placeholder.svg?height=150&width=200"}
                        alt={topic.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-base mb-1.5 line-clamp-2">{topic.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                          Daily Life
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                          {topic.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mb-2">
                        {topic.wordCount} / {topic.wordCount}
                      </div>
                      <div className="h-1 bg-secondary rounded-full mb-3">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "50%" }} />
                      </div>
                      <div className="flex gap-1.5">
                        <Link href={`/vocab/${topic.id}`} className="flex-1">
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
            </>
          )}

          {activeTab === "dictionary" && (
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Word</TableHead>
                    <TableHead className="w-[300px]">Meaning</TableHead>
                    <TableHead className="w-[80px]">Level</TableHead>
                    <TableHead className="w-[140px]">Status</TableHead>
                    <TableHead className="w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dictionaryWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="py-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-lg">{word.word}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{word.pronunciation}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {word.partOfSpeech}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-sm line-clamp-2">{word.meaning}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline">{word.level}</Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Using {Math.floor(word.masteryLevel / 3)}/30
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${word.masteryLevel}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {word.masteryLevel < 30 ? "Learning" : word.masteryLevel < 70 ? "Reviewing" : "Mastered"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 bg-transparent">
                            Practice
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {activeTab === "mindmap" && (
            <MindMap selectedGroup={selectedGroup} selectedSubcategory={selectedSubcategory} />
          )}
        </div>
      </div>
    </div>
  )
}
