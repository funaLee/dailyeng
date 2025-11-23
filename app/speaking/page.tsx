"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Play, Gift, MessageSquarePlus, Search, ChevronRight, Eye, RotateCcw } from 'lucide-react'
import { z } from "zod"
import { RadarChart } from "@/components/speaking/radar-chart"
import { Scenario, ScenarioSchema } from "@/types"

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



export default function SpeakingRoomPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Daily Life")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Shopping")
  const [activeTab, setActiveTab] = useState<TabType>("available")
  const excellentScrollRef = useRef<HTMLDivElement>(null)
  const goodScrollRef = useRef<HTMLDivElement>(null)
  const averageScrollRef = useRef<HTMLDivElement>(null)
  const poorScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const response = await fetch('http://localhost:3001/api/scenarios');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Validate and transform the data using the Zod schema
        const parsedScenarios = z.array(ScenarioSchema).parse(data);
        setScenarios(parsedScenarios);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(`Data validation failed: ${err.errors.map(e => e.message).join(', ')}`);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchScenarios();
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
        ref.current.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        // Scroll right normally
        ref.current.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }
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

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Failed to load scenarios</h2>
          <p className="mt-2 text-muted-foreground">
            Error: {error}. Please try again later.
          </p>
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
            Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency,
            grammar, and content.
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

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-6 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === "available" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Available Topics
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-6 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === "custom" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Custom Topics
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === "history" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          History
        </button>
      </div>

      {activeTab === "available" && (
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
                      <div className="h-4 w-4 rounded-full border-4 border-primary flex-shrink-0" />
                    )}
                    {selectedGroup !== group.name && (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
                    )}
                    <span>{group.name}</span>
                  </button>
                ))}
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
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-blue-300 relative flex items-center justify-center">
                    <span className="text-blue-600/40 text-3xl font-bold">{scenario.image}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-base mb-1.5 line-clamp-2">{scenario.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{scenario.description}</p>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                        {scenario.category}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                        {scenario.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-2">
                      {scenario.sessionsCompleted} / {scenario.totalSessions} sessions
                    </div>
                    <div className="h-1 bg-secondary rounded-full mb-3">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${scenario.progress}%` }}
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <Link href={`/speaking/session/${scenario.id}`} className="flex-1">
                        <Button className="w-full gap-1.5 text-xs h-7" size="sm">
                          <Play className="h-3 w-3" />
                          {scenario.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-transparent">
                        Info
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
        <Card className="p-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Create custom role-play speaking rooms</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <button className="group">
                <Card className="p-12 bg-[#C2E2FA]/40 hover:bg-[#C2E2FA]/60 transition-all hover:shadow-lg border-2 border-transparent hover:border-primary">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Gift className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Surprise me</h3>
                  </div>
                </Card>
              </button>

              <button className="group">
                <Card className="p-12 bg-[#C2E2FA]/40 hover:bg-[#C2E2FA]/60 transition-all hover:shadow-lg border-2 border-transparent hover:border-primary">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <MessageSquarePlus className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Create my own</h3>
                  </div>
                </Card>
              </button>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 my-12" />

            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Topics you've created</h3>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search for topics you created" className="pl-10 bg-[#C2E2FA]/20" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Space", level: "A1" },
                { title: "Magic", level: "A2" },
                { title: "World War II", level: "A1" },
                { title: "Samurai", level: "A2" },
              ].map((topic, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-2">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-blue-300" />
                  <div className="p-3">
                    <h4 className="font-semibold text-base mb-1.5">{topic.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.
                    </p>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                        Daily Life
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                        {topic.level}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-[10px] font-medium">
                        A2
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <Button className="flex-1 text-xs h-7" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-transparent">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === "history" && (
        <Card className="p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Review your speaking journey</h2>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search for the topic you have practiced" className="pl-10 bg-[#C2E2FA]/20" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-6">Your 5 recent speaking result:</h3>
                <div className="flex flex-col items-center mb-8">
                  <div className="w-48 h-48 rounded-full bg-[#C2E2FA] flex items-center justify-center mb-4">
                    <span className="text-6xl font-bold text-blue-900">81</span>
                  </div>
                  <p className="text-lg font-semibold">Overall speaking score</p>
                </div>

                <Card className="p-8 bg-gray-50">
                  <RadarChart
                    data={[
                      { label: "Relevance", value: 94 },
                      { label: "Pronunciation", value: 82 },
                      { label: "Intonation & Stress", value: 74 },
                      { label: "Fluency", value: 76 },
                      { label: "Grammar", value: 80 },
                    ]}
                    size={400}
                    levels={5}
                    className="w-full h-80"
                  />
                </Card>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Excellent range score topic (&gt; 90):</h3>
                    <button
                      onClick={() => scrollRight(excellentScrollRef)}
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                  <div 
                    ref={excellentScrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[
                      { title: "Space", score: 95 },
                      { title: "Magic", score: 92 },
                      { title: "Future Tech", score: 93 },
                    ].map((topic, index) => (
                      <Card key={index} className="flex-shrink-0 w-64 overflow-hidden border-2">
                        <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-blue-300" />
                        <div className="p-3">
                          <h4 className="font-semibold text-base mb-1.5">{topic.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.
                          </p>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                              Daily Life
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                              A1
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-[10px] font-medium">
                              Score: {topic.score}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1">
                              <Eye className="h-3 w-3" />
                              View result
                            </Button>
                            <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                              <RotateCcw className="h-3 w-3" />
                              Speak again
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Good range score topic (80-90):</h3>
                    <button
                      onClick={() => scrollRight(goodScrollRef)}
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                  <div 
                    ref={goodScrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[
                      { title: "Shopping", score: 85 },
                      { title: "Travel", score: 83 },
                      { title: "Business", score: 88 },
                    ].map((topic, index) => (
                      <Card key={index} className="flex-shrink-0 w-64 overflow-hidden border-2">
                        <div className="aspect-[4/3] bg-gradient-to-br from-green-200 to-green-300" />
                        <div className="p-3">
                          <h4 className="font-semibold text-base mb-1.5">{topic.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.
                          </p>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                              Daily Life
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                              A2
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-[10px] font-medium">
                              Score: {topic.score}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1">
                              <Eye className="h-3 w-3" />
                              View result
                            </Button>
                            <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                              <RotateCcw className="h-3 w-3" />
                              Speak again
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Average range score topic (60-80):</h3>
                    <button
                      onClick={() => scrollRight(averageScrollRef)}
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                  <div 
                    ref={averageScrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[
                      { title: "Healthcare", score: 72 },
                      { title: "Education", score: 68 },
                      { title: "Sports", score: 75 },
                    ].map((topic, index) => (
                      <Card key={index} className="flex-shrink-0 w-64 overflow-hidden border-2">
                        <div className="aspect-[4/3] bg-gradient-to-br from-yellow-200 to-yellow-300" />
                        <div className="p-3">
                          <h4 className="font-semibold text-base mb-1.5">{topic.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.
                          </p>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                              Daily Life
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                              B1
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-[10px] font-medium">
                              Score: {topic.score}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1">
                              <Eye className="h-3 w-3" />
                              View result
                            </Button>
                            <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                              <RotateCcw className="h-3 w-3" />
                              Speak again
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Needs improvement (&lt; 60):</h3>
                    <button
                      onClick={() => scrollRight(poorScrollRef)}
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                  <div 
                    ref={poorScrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[
                      { title: "Interviews", score: 52 },
                      { title: "Presentations", score: 48 },
                      { title: "Negotiations", score: 55 },
                    ].map((topic, index) => (
                      <Card key={index} className="flex-shrink-0 w-64 overflow-hidden border-2">
                        <div className="aspect-[4/3] bg-gradient-to-br from-red-200 to-red-300" />
                        <div className="p-3">
                          <h4 className="font-semibold text-base mb-1.5">{topic.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            Learn vocabulary used in everyday eating, cooking, and ordering food in real situations.
                          </p>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                              Professional
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                              B2
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-[10px] font-medium">
                              Score: {topic.score}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1">
                              <Eye className="h-3 w-3" />
                              View result
                            </Button>
                            <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                              <RotateCcw className="h-3 w-3" />
                              Speak again
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
