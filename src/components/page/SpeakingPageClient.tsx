"use client"
import { Bookmark, Loader2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Gift, MessageSquarePlus, ChevronRight, ChevronLeft, Plus, Search, X } from "lucide-react"
import { RadarChart } from "@/components/speaking/radar-chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect, useRef } from "react"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import {
  HubHero,
  TopicGroupsSidebar,
  LevelsSidebar,
  SubcategoryPills,
  TopicCard,
  type TopicGroup,
} from "@/components/hub"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Mock function - will be replaced with actual server action later
const createCustomScenario = async (userId: string, prompt: string) => {
  console.log("Mock: createCustomScenario", userId, prompt);
  // Return a mock scenario
  return {
    id: `custom-${Date.now()}`,
    title: prompt.slice(0, 50),
    description: prompt,
    context: prompt,
    goal: "Practice speaking",
  };
};

// Types for props
export interface Scenario {
  id: string
  title: string
  description: string
  category: string
  level: string
  image: string
  sessionsCompleted: number
  totalSessions: number
  progress: number
  duration?: number
  isCustom?: boolean
  subcategory?: string
}

export interface CriteriaItem {
  title: string
  score: number
}

export interface HistoryGraphItem {
  session: number
  score: number
}

export interface HistoryTopicItem {
  id: string
  title: string
  description: string
  score: number
  date: string
  level: string
  image: string
  progress: number
  wordCount: number
}

export interface SpeakingPageClientProps {
  topicGroups: TopicGroup[]
  scenarios: Scenario[]
  demoCriteria: CriteriaItem[]
  historyGraphData: HistoryGraphItem[]
  historyTopicsData: HistoryTopicItem[]
  userId: string
}

type TabType = "available" | "custom" | "history" | "bookmarks"

export default function SpeakingPageClient({
  topicGroups,
  scenarios: initialScenarios,
  demoCriteria,
  historyGraphData,
  historyTopicsData,
  userId,
}: SpeakingPageClientProps) {
  const router = useRouter()
  const [scenarios] = useState<Scenario[]>(initialScenarios)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Daily Life")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Shopping")
  const [activeTab, setActiveTab] = useState<TabType>("available")
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([])

  const [historyFilter, setHistoryFilter] = useState<string>("excellent")
  const [historyPage, setHistoryPage] = useState(1)
  const itemsPerPage = 4

  // Custom Topic Logic
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [topicPrompt, setTopicPrompt] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("speaking-bookmarks")
    if (saved) {
      setBookmarkedTopics(JSON.parse(saved))
    }
  }, [])

  // Check if we're in search mode
  const isSearchMode = searchQuery.trim().length > 0

  // Filter scenarios based on search or normal mode
  const filteredScenarios = scenarios.filter((scenario) => {
    // In search mode, search ALL topics (both regular and custom)
    if (isSearchMode) {
      const matchesSearch =
        scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    }

    // Normal mode: respect tab and filters
    if (activeTab === "custom" && !scenario.isCustom) return false;
    if (activeTab === "available" && scenario.isCustom) return false;

    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(scenario.level)

    // Group and Subcategory filtering (only for 'available' tab)
    const matchesGroup = activeTab === "available" ? scenario.category === selectedGroup : true
    const matchesSubcategory = activeTab === "available" ? (!selectedSubcategory || selectedSubcategory === "All" || scenario.subcategory === selectedSubcategory) : true

    return matchesLevel && matchesGroup && matchesSubcategory
  })

  const toggleLevel = (level: string) => {
    if (level === "All") {
      // If all are currently selected, deselect all. Otherwise, select all.
      // Assuming all possible levels are defined in LevelsSidebar or a constant
      const allLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]
      if (selectedLevels.length === allLevels.length) {
        setSelectedLevels([])
      } else {
        setSelectedLevels(allLevels)
      }
    } else {
      setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
    }
  }

  const currentSubcategories = topicGroups.find((g) => g.name === selectedGroup)?.subcategories || []

  const getFilteredHistory = () => {
    switch (historyFilter) {
      case "excellent":
        return historyTopicsData.filter((t) => t.score >= 90)
      case "good":
        return historyTopicsData.filter((t) => t.score >= 80 && t.score < 90)
      case "average":
        return historyTopicsData.filter((t) => t.score >= 60 && t.score < 80)
      case "improvement":
        return historyTopicsData.filter((t) => t.score < 60)
      default:
        return historyTopicsData
    }
  }

  const filteredHistory = getFilteredHistory()
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const currentHistoryItems = filteredHistory.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage)

  const bookmarkedTopicsList = scenarios.filter((topic) => bookmarkedTopics.includes(topic.id))

  const tabs = [
    { id: "available", label: "Available Topics" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "custom", label: "Custom Topics" },
    { id: "history", label: "History" },
  ]

  const handleBookmarkToggle = (topicId: string) => {
    setBookmarkedTopics((prev) => {
      const newBookmarks = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      localStorage.setItem("speaking-bookmarks", JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }

  const handleCreateScenario = async () => {
    if (!topicPrompt.trim()) return;

    setIsCreating(true);
    try {
      const scenario = await createCustomScenario(userId, topicPrompt);
      toast.success("Scenario created!");
      setIsDialogOpen(false);
      setTopicPrompt("");
      // Redirect to the new session
      router.push(`/speaking/session/${scenario.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create scenario");
    } finally {
      setIsCreating(false);
    }
  }

  const handleSurpriseMe = () => {
    // Filter available scenarios (not custom)
    const availableScenarios = scenarios.filter(s => !s.isCustom)
    if (availableScenarios.length === 0) {
      toast.error("No topics available")
      return
    }
    const randomIndex = Math.floor(Math.random() * availableScenarios.length)
    const randomTopic = availableScenarios[randomIndex]
    router.push(`/speaking/session/${randomTopic.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <ProtectedRoute
        pageName="Speaking Room"
        pageDescription="Practice your speaking skills with AI-powered conversations and get instant feedback."
        pageIcon={PageIcons.speaking}
      >
        <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <HubHero
            title="SPEAKING ROOM"
            description="Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency, grammar, and content."
            primaryAction={{ label: "Build Study Plan" }}
            secondaryAction={{ label: "Random Topic", onClick: handleSurpriseMe }}
            notification={{ text: "Practice streak: 7 days", actionLabel: "Continue" }}
            decorativeWords={["speaking", "fluency", "practice"]}
          />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-gray-200 pb-0">
            {!isSearchMode && (
              <div className="flex gap-8 overflow-x-auto pb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`pb-3 px-2 text-lg font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-gray-900"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1" />
            <div className="relative mb-4 sm:mb-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
              <Input
                placeholder="Search all topics..."
                className={`pl-10 pr-10 h-12 text-base rounded-full border-2 transition-all ${isSearchMode ? 'w-80 border-primary-400 shadow-lg bg-white' : 'w-64 border-primary-200 hover:border-primary-300'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearchMode && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 text-primary-500" />
                </button>
              )}
            </div>
          </div>

          <div>
            {/* Search Results Mode */}
            {isSearchMode && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Search Results for "{searchQuery}" ({filteredScenarios.length} found)
                  </h2>
                </div>
                {filteredScenarios.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredScenarios.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.duration || 7}
                        thumbnail={topic.image}
                        progress={topic.progress}
                        href={`/speaking/session/${topic.id}`}
                        onNotYet={() => { }}
                        type="speaking"
                        isBookmarked={bookmarkedTopics.includes(topic.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 rounded-3xl border-2 border-primary-100 text-center bg-white">
                    <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No Topics Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try searching with different keywords or check your spelling.
                    </p>
                    <Button variant="default" onClick={() => setSearchQuery("")} className="cursor-pointer">
                      Clear Search
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Normal Tab Content */}
            {!isSearchMode && activeTab === "available" && (
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <TopicGroupsSidebar
                    groups={topicGroups}
                    selectedGroup={selectedGroup}
                    onGroupChange={(name, firstSub) => {
                      setSelectedGroup(name)
                      setSelectedSubcategory(firstSub)
                    }}
                    title="Topic Groups"
                    showViewMore={false}
                  />

                  <LevelsSidebar selectedLevels={selectedLevels} onLevelToggle={toggleLevel} />
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <SubcategoryPills
                    subcategories={currentSubcategories}
                    selectedSubcategory={selectedSubcategory}
                    onSubcategoryChange={setSelectedSubcategory}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredScenarios.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.duration || 7}
                        thumbnail={topic.image}
                        progress={topic.progress}
                        href={`/speaking/session/${topic.id}`}
                        onNotYet={() => { }}
                        type="speaking"
                        isBookmarked={bookmarkedTopics.includes(topic.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!isSearchMode && activeTab === "bookmarks" && (
              <div className="space-y-6">
                {bookmarkedTopicsList.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <Bookmark className="h-6 w-6 text-primary-600 fill-primary-600" />
                      <h2 className="text-xl font-bold text-foreground">
                        Your Bookmarked Topics ({bookmarkedTopicsList.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                      {bookmarkedTopicsList.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          id={topic.id}
                          title={topic.title}
                          description={topic.description}
                          level={topic.level}
                          wordCount={topic.duration || 7}
                          thumbnail={topic.image}
                          progress={topic.progress}
                          href={`/speaking/session/${topic.id}`}
                          onNotYet={() => { }}
                          type="speaking"
                          isBookmarked={true}
                          onBookmarkToggle={handleBookmarkToggle}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center bg-white">
                    <Bookmark className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No Bookmarks Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Click the bookmark icon on any topic card to save it here for quick access.
                    </p>
                    <Button variant="default" onClick={() => setActiveTab("available")} className="cursor-pointer">
                      Browse Topics
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {!isSearchMode && activeTab === "custom" && (
              <div className="space-y-6">
                <Card className="p-8 rounded-3xl border-2 border-primary-100 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Create Custom Topic</h3>
                      <p className="text-muted-foreground text-sm">
                        Design your own speaking scenario for personalized practice
                      </p>
                    </div>
                    <Button className="gap-2 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4" />
                      New Topic
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card onClick={() => setIsDialogOpen(true)} className="p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:border-primary-400 transition-colors cursor-pointer group">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <MessageSquarePlus className="h-6 w-6 text-primary-600" />
                        </div>
                        <h4 className="font-bold mb-2">Role Play by Topic</h4>
                        <p className="text-sm text-muted-foreground">Generated optimized scenario from your topic</p>
                      </div>
                    </Card>

                    <Card
                      onClick={handleSurpriseMe}
                      className="p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:border-primary-400 transition-colors cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <Gift className="h-6 w-6 text-primary-600" />
                        </div>
                        <h4 className="font-bold mb-2">Surprise Me</h4>
                        <p className="text-sm text-muted-foreground">Get a random topic based on your level</p>
                      </div>
                    </Card>

                    <Card
                      onClick={() => router.push('/speaking/free-talk')}
                      className="p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:border-primary-400 transition-colors cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <Play className="h-6 w-6 text-primary-600" />
                        </div>
                        <h4 className="font-bold mb-2">Free Talk</h4>
                        <p className="text-sm text-muted-foreground">Open conversation with AI tutor</p>
                      </div>
                    </Card>
                  </div>
                </Card>

                {/* List of custom scenarios */}
                <h3 className="text-xl font-bold mt-8 mb-4">Your Custom Scenarios</h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredScenarios.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      id={topic.id}
                      title={topic.title}
                      description={topic.description}
                      level={topic.level}
                      wordCount={topic.duration || 7}
                      thumbnail={topic.image}
                      progress={topic.progress}
                      href={`/speaking/session/${topic.id}`}
                      onNotYet={() => { }}
                      type="speaking"
                      isBookmarked={bookmarkedTopics.includes(topic.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                  {filteredScenarios.length === 0 && (
                    <p className="text-muted-foreground col-span-3 text-center py-8">
                      You haven't created any custom scenarios yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isSearchMode && activeTab === "history" && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="p-6 rounded-3xl border-2 border-primary-100 bg-white">
                    <h3 className="text-lg font-bold mb-4">Performance Overview</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyGraphData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="session" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorScore)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-6 rounded-3xl border-2 border-primary-100 bg-white">
                    <h3 className="text-lg font-bold mb-4">Criteria Score</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                      <RadarChart data={demoCriteria.map((t) => ({ label: t.title, value: t.score }))} size={300} />
                    </div>
                  </Card>
                </div>

                <Card className="p-6 rounded-3xl border-2 border-primary-100 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Session History</h3>
                    <div className="flex gap-2">
                      {["excellent", "good", "average", "improvement"].map((filter) => (
                        <Button
                          key={filter}
                          variant={historyFilter === filter ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setHistoryFilter(filter)
                            setHistoryPage(1)
                          }}
                          disabled={historyFilter === filter}
                          className="capitalize cursor-pointer"
                        >
                          {filter === "improvement" ? "Needs Work" : filter}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {currentHistoryItems.map((item) => (
                      <TopicCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        level={item.level}
                        wordCount={item.wordCount}
                        thumbnail={item.image}
                        progress={item.progress}
                        href={`/speaking/session/${item.id}`} // This will redirect to the session details/replay if implemented
                        type="speaking"
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                        disabled={historyPage === 1}
                        className="cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {historyPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                        disabled={historyPage === totalPages}
                        className="cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Topic</DialogTitle>
            <DialogDescription>
              Describe the situation or topic you want to practice. AI will generate a roleplay scenario for you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="E.g. I want to practice arguing about a refund at an electronics store..."
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>Cancel</Button>
            <Button onClick={handleCreateScenario} disabled={isCreating || !topicPrompt.trim()}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Generating..." : "Create Scenario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
