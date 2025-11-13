"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Play } from "lucide-react"

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
    image: "png1",
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
    image: "png2",
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
    image: "png3",
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
    image: "png4",
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
    image: "png5",
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
    image: "png6",
    sessionsCompleted: 2,
    totalSessions: 5,
    progress: 40,
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
            <Button className="gap-2">
              <Mic className="h-4 w-4" />
              Start Quick Practice
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Choose Scenario
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Today's practice: 3 sessions completed</span>
            <Button variant="outline" size="sm">
              Continue learning
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
          <div className="absolute right-12 top-12 text-blue-600/20 text-6xl font-bold rotate-12">
            <Mic className="h-20 w-20" />
          </div>
          <div className="absolute right-24 top-32 text-blue-600/20 text-5xl font-bold -rotate-6">conversation</div>
          <div className="absolute right-8 top-52 text-blue-600/20 text-4xl font-bold rotate-3">fluency</div>
        </div>
      </Card>

      <div className="mb-6 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "available"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Available Scenarios
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "custom"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Custom Scenarios
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Practice History
        </button>
        <div className="flex-1" />
        <Input
          placeholder="Search scenarios"
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
          {activeTab === "available" && (
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
            </>
          )}

          {activeTab === "custom" && (
            <Card className="p-8">
              <div className="text-center max-w-md mx-auto">
                <Mic className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Create Custom Scenarios</h3>
                <p className="text-muted-foreground mb-6">
                  Design your own speaking practice scenarios tailored to your specific needs and goals.
                </p>
                <Button className="gap-2">Create New Scenario</Button>
              </div>
            </Card>
          )}

          {activeTab === "history" && (
            <Card className="p-8">
              <div className="text-center max-w-md mx-auto">
                <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Practice History</h3>
                <p className="text-muted-foreground mb-6">
                  Review your past speaking sessions and track your progress over time.
                </p>
                <Button variant="outline">View All Sessions</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
