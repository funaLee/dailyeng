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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

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
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
          <div className="absolute right-12 top-12 text-blue-600/20 text-6xl font-bold rotate-12">appointment</div>
          <div className="absolute right-24 top-32 text-blue-600/20 text-5xl font-bold -rotate-6">outcome</div>
          <div className="absolute right-8 top-52 text-blue-600/20 text-4xl font-bold rotate-3">curiosity</div>
        </div>
      </Card>

      <div className="mb-8 flex items-center border-b">
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === "popular"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Popular Topics
        </button>
        <button
          onClick={() => setActiveTab("dictionary")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === "dictionary"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Dictionary
        </button>
        <button
          onClick={() => setActiveTab("mindmap")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === "mindmap"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Mind Map
        </button>
        <div className="flex-1" />
        <Input
          placeholder="Search topics..."
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
              {TOPIC_GROUPS.map((group) => (
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
          {activeTab === "popular" && (
            <>
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
                {filteredTopics.map((topic) => (
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
                            Daily Life
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8 leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="flex items-center justify-between mb-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        <span>Progress</span>
                        <span>50%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full w-1/2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/vocab/${topic.id}`} className="contents">
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
