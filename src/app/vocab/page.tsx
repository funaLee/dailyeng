"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTopics, mockVocab } from "@/lib/mock-data"
import type { Topic } from "@/src/types"
import { Edit, Bookmark, Network, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import { HubHero, HubTabs, CoursesSidebar, LevelsSidebar, CourseDetail, TopicCard, type Course } from "@/components/hub"
import { VocabMindmap } from "@/components/hub/vocab-mindmap"

const COURSES: Course[] = [
  {
    id: "ielts-7",
    name: "IELTS 7.0",
    description:
      "Comprehensive IELTS vocabulary preparation for band 7.0 and above. Focus on academic and general training modules.",
    estimatedCompletion: "12/12/2025",
    progress: 12,
  },
  {
    id: "business",
    name: "Business English",
    description:
      "Professional vocabulary for workplace communication, meetings, presentations, and business correspondence.",
    estimatedCompletion: "15/01/2026",
    progress: 0,
  },
  {
    id: "toeic",
    name: "TOEIC Preparation",
    description: "Essential vocabulary for TOEIC test success covering business and everyday English contexts.",
    estimatedCompletion: "20/02/2026",
    progress: 0,
  },
]

const CURRENT_TOPIC = {
  id: "animal-behaviours",
  title: "Animal Behaviours",
  subtitle: "Reading Practice 1",
  progress: 40,
}

type TabType = "courses" | "bookmarks" | "mindmap" | "statistic"

export default function VocabPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [activeTab, setActiveTab] = useState<TabType>("courses")
  const [selectedCourse, setSelectedCourse] = useState<string>("ielts-7")
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([])
  const [dictionarySearch, setDictionarySearch] = useState("")
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null)
  const [selectedDictLevels, setSelectedDictLevels] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [dictionaryWords] = useState([
    {
      id: "1",
      word: "Abandon",
      pronunciation: "/əˈbændən/",
      meaning: "To leave behind or give up completely",
      partOfSpeech: "Verb",
      level: "B1",
      category: "Action",
      masteryLevel: 45,
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
      word: "Benefit",
      pronunciation: "/ˈbenɪfɪt/",
      meaning: "An advantage or profit gained from something",
      partOfSpeech: "Noun",
      level: "A2",
      category: "General",
      masteryLevel: 80,
    },
    {
      id: "4",
      word: "Collaborate",
      pronunciation: "/kəˈlæbəreɪt/",
      meaning: "To work together with others on a project",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Workplace",
      masteryLevel: 70,
    },
    {
      id: "5",
      word: "Determine",
      pronunciation: "/dɪˈtɜːmɪn/",
      meaning: "To decide or establish something precisely",
      partOfSpeech: "Verb",
      level: "B1",
      category: "Action",
      masteryLevel: 55,
    },
    {
      id: "6",
      word: "Efficient",
      pronunciation: "/ɪˈfɪʃnt/",
      meaning: "Working in a well-organized and competent way",
      partOfSpeech: "Adjective",
      level: "B2",
      category: "Quality",
      masteryLevel: 60,
    },
    {
      id: "7",
      word: "Family",
      pronunciation: "/ˈfæmɪli/",
      meaning: "A group of people related by blood or marriage",
      partOfSpeech: "Noun",
      level: "A1",
      category: "Family",
      masteryLevel: 95,
    },
    {
      id: "8",
      word: "Generate",
      pronunciation: "/ˈdʒenəreɪt/",
      meaning: "To produce or create something",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Action",
      masteryLevel: 50,
    },
    {
      id: "9",
      word: "Hypothesis",
      pronunciation: "/haɪˈpɒθəsɪs/",
      meaning: "A proposed explanation for a phenomenon",
      partOfSpeech: "Noun",
      level: "C1",
      category: "Academic",
      masteryLevel: 30,
    },
    {
      id: "10",
      word: "Implement",
      pronunciation: "/ˈɪmplɪment/",
      meaning: "To put a plan or decision into effect",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Business",
      masteryLevel: 40,
    },
    {
      id: "11",
      word: "Journey",
      pronunciation: "/ˈdʒɜːni/",
      meaning: "An act of traveling from one place to another",
      partOfSpeech: "Noun",
      level: "A2",
      category: "Travel",
      masteryLevel: 85,
    },
    {
      id: "12",
      word: "Knowledge",
      pronunciation: "/ˈnɒlɪdʒ/",
      meaning: "Facts, information, and skills acquired through experience",
      partOfSpeech: "Noun",
      level: "A2",
      category: "Education",
      masteryLevel: 90,
    },
    {
      id: "13",
      word: "Language",
      pronunciation: "/ˈlæŋɡwɪdʒ/",
      meaning: "A system of communication used by a country or community",
      partOfSpeech: "Noun",
      level: "A1",
      category: "Education",
      masteryLevel: 95,
    },
    {
      id: "14",
      word: "Magnificent",
      pronunciation: "/mæɡˈnɪfɪsnt/",
      meaning: "Extremely beautiful, elaborate, or impressive",
      partOfSpeech: "Adjective",
      level: "B2",
      category: "Quality",
      masteryLevel: 35,
    },
    {
      id: "15",
      word: "Negotiate",
      pronunciation: "/nɪˈɡəʊʃieɪt/",
      meaning: "To discuss something in order to reach an agreement",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Business",
      masteryLevel: 45,
    },
    {
      id: "16",
      word: "Opportunity",
      pronunciation: "/ˌɒpəˈtjuːnɪti/",
      meaning: "A time or set of circumstances that makes it possible to do something",
      partOfSpeech: "Noun",
      level: "B1",
      category: "General",
      masteryLevel: 75,
    },
    {
      id: "17",
      word: "Parent",
      pronunciation: "/ˈpeərənt/",
      meaning: "A father or mother of a person or an animal",
      partOfSpeech: "Noun",
      level: "A1",
      category: "Family",
      masteryLevel: 98,
    },
    {
      id: "18",
      word: "Qualify",
      pronunciation: "/ˈkwɒlɪfaɪ/",
      meaning: "To be entitled to a particular benefit or privilege",
      partOfSpeech: "Verb",
      level: "B1",
      category: "General",
      masteryLevel: 55,
    },
    {
      id: "19",
      word: "Recommend",
      pronunciation: "/ˌrekəˈmend/",
      meaning: "To suggest that someone or something would be good for a particular purpose",
      partOfSpeech: "Verb",
      level: "B1",
      category: "Action",
      masteryLevel: 70,
    },
    {
      id: "20",
      word: "Significant",
      pronunciation: "/sɪɡˈnɪfɪkənt/",
      meaning: "Sufficiently great or important to be worthy of attention",
      partOfSpeech: "Adjective",
      level: "B2",
      category: "Quality",
      masteryLevel: 60,
    },
    {
      id: "21",
      word: "Transform",
      pronunciation: "/trænsˈfɔːm/",
      meaning: "To make a thorough or dramatic change in form or appearance",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Action",
      masteryLevel: 50,
    },
    {
      id: "22",
      word: "Understand",
      pronunciation: "/ˌʌndəˈstænd/",
      meaning: "To perceive the intended meaning of words or a speaker",
      partOfSpeech: "Verb",
      level: "A1",
      category: "General",
      masteryLevel: 95,
    },
    {
      id: "23",
      word: "Vocabulary",
      pronunciation: "/vəˈkæbjʊləri/",
      meaning: "The body of words used in a particular language",
      partOfSpeech: "Noun",
      level: "A2",
      category: "Education",
      masteryLevel: 85,
    },
    {
      id: "24",
      word: "Widespread",
      pronunciation: "/ˈwaɪdspred/",
      meaning: "Found or distributed over a large area or number of people",
      partOfSpeech: "Adjective",
      level: "B2",
      category: "Quality",
      masteryLevel: 40,
    },
    {
      id: "25",
      word: "Xenophobia",
      pronunciation: "/ˌzenəˈfəʊbiə/",
      meaning: "Dislike of or prejudice against people from other countries",
      partOfSpeech: "Noun",
      level: "C1",
      category: "Social",
      masteryLevel: 20,
    },
    {
      id: "26",
      word: "Yield",
      pronunciation: "/jiːld/",
      meaning: "To produce or provide a natural, agricultural, or industrial product",
      partOfSpeech: "Verb",
      level: "B2",
      category: "General",
      masteryLevel: 35,
    },
    {
      id: "27",
      word: "Zealous",
      pronunciation: "/ˈzeləs/",
      meaning: "Having or showing great energy or enthusiasm",
      partOfSpeech: "Adjective",
      level: "C1",
      category: "Quality",
      masteryLevel: 25,
    },
  ])

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const dictLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  const filteredDictionaryWords = dictionaryWords.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
      word.meaning.toLowerCase().includes(dictionarySearch.toLowerCase())
    const matchesAlphabet = !selectedAlphabet || word.word.toUpperCase().startsWith(selectedAlphabet)
    const matchesLevel = selectedDictLevels.length === 0 || selectedDictLevels.includes(word.level)
    return matchesSearch && matchesAlphabet && matchesLevel
  })

  const totalPages = Math.ceil(filteredDictionaryWords.length / itemsPerPage)
  const paginatedWords = filteredDictionaryWords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setTopics(mockTopics)
    setLoading(false)
    const saved = localStorage.getItem("vocab-bookmarks")
    if (saved) {
      setBookmarkedTopics(JSON.parse(saved))
    }
  }, [])

  const handleBookmarkToggle = (topicId: string) => {
    setBookmarkedTopics((prev) => {
      const newBookmarks = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      localStorage.setItem("vocab-bookmarks", JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(topic.level)
    return matchesSearch && matchesLevel
  })

  const bookmarkedTopicsList = topics.filter((topic) => bookmarkedTopics.includes(topic.id))

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const currentCourse = COURSES.find((c) => c.id === selectedCourse) || COURSES[0]

  const tabs = [
    { id: "courses", label: "Courses" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "mindmap", label: "Mindmap" },
    { id: "statistic", label: "Dictionary" },
  ]

  const mindmapData = [
    {
      id: "daily-life",
      name: "Daily Life",
      color: "primary" as const,
      topics: [
        {
          id: "1",
          title: "Travel",
          words: mockVocab["1"] || [],
        },
        {
          id: "2",
          title: "Food & Dining",
          words: mockVocab["2"] || [],
        },
      ],
    },
    {
      id: "professional",
      name: "Professional",
      color: "secondary" as const,
      topics: [
        {
          id: "3",
          title: "Job Interview",
          words: mockVocab["3"] || [],
        },
      ],
    },
    {
      id: "academic",
      name: "Academic",
      color: "accent" as const,
      topics: [
        {
          id: "academic-1",
          title: "Science",
          words: mockVocab["1"]?.slice(0, 3) || [],
        },
      ],
    },
  ]

  const toggleDictLevel = (level: string) => {
    setSelectedDictLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  return (
    <ProtectedRoute
      pageName="Vocabulary Hub"
      pageDescription="Build your vocabulary with interactive lessons and spaced repetition."
      pageIcon={PageIcons.vocabulary}
    >
      {loading ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <HubHero
            title="VOCABULARY HUB"
            description="Your daily vocabulary journey starts here."
            primaryAction={{ label: "View your Study Plan" }}
            secondaryAction={{ label: "See All Course" }}
            notification={{
              text: "You have 3 lessons to review",
              actionLabel: "Review now",
            }}
            decorativeWords={["appointment", "outcome", "curiosity"]}
          />

          <HubTabs tabs={tabs} activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as TabType)} />

          {activeTab === "courses" && (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <CoursesSidebar
                  courses={COURSES}
                  selectedCourse={selectedCourse}
                  onCourseChange={setSelectedCourse}
                  onAddCourse={() => {}}
                />

                <LevelsSidebar selectedLevels={selectedLevels} onLevelToggle={toggleLevel} />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <CourseDetail
                  title={`${currentCourse.name} Academic`}
                  description={currentCourse.description}
                  estimatedCompletion={currentCourse.estimatedCompletion}
                  progress={currentCourse.progress}
                  currentTopic={{
                    id: CURRENT_TOPIC.id,
                    title: CURRENT_TOPIC.title,
                    subtitle: CURRENT_TOPIC.subtitle,
                    href: `/vocab/${CURRENT_TOPIC.id}`,
                  }}
                />

                <div className="flex justify-end">
                  <Input
                    placeholder="Search vocabulary topics..."
                    className="max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      id={topic.id}
                      title={topic.title}
                      description={topic.description}
                      level={topic.level}
                      wordCount={topic.wordCount || 25}
                      thumbnail={topic.thumbnail}
                      progress={topic.progress}
                      href={`/vocab/${topic.id}`}
                      onNotYet={() => {}}
                      type="vocabulary"
                      isBookmarked={bookmarkedTopics.includes(topic.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              {bookmarkedTopicsList.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Bookmark className="h-6 w-6 text-primary-500 fill-primary-500" />
                    <h2 className="text-xl font-bold text-foreground">
                      Your Bookmarked Topics ({bookmarkedTopicsList.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {bookmarkedTopicsList.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.wordCount || 25}
                        thumbnail={topic.thumbnail}
                        progress={topic.progress}
                        href={`/vocab/${topic.id}`}
                        onNotYet={() => {}}
                        type="vocabulary"
                        isBookmarked={true}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                  <Bookmark className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Bookmarks Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Click the bookmark icon on any topic card to save it here for quick access.
                  </p>
                  <Button variant="default" onClick={() => setActiveTab("courses")} className="cursor-pointer">
                    Browse Topics
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === "mindmap" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Network className="h-6 w-6 text-primary-500" />
                <h2 className="text-xl font-bold text-foreground">Vocabulary Mindmap</h2>
                <span className="text-sm text-muted-foreground">Explore words organized by topic groups</span>
              </div>
              <VocabMindmap topicGroups={mindmapData} />
            </div>
          )}

          {activeTab === "statistic" && (
            <Card className="p-8 rounded-3xl border-2 border-primary-100 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Dictionary</h3>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search words..."
                    className="w-64"
                    value={dictionarySearch}
                    onChange={(e) => setDictionarySearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={selectedAlphabet === null ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-10 text-xs font-semibold cursor-pointer"
                    onClick={() => setSelectedAlphabet(null)}
                  >
                    All
                  </Button>
                  {alphabet.map((letter) => (
                    <Button
                      key={letter}
                      variant={selectedAlphabet === letter ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 text-xs font-semibold cursor-pointer"
                      onClick={() => setSelectedAlphabet(letter)}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Level:</span>
                  {dictLevels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedDictLevels.includes(level) ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold cursor-pointer"
                      onClick={() => toggleDictLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                  {selectedDictLevels.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground cursor-pointer"
                      onClick={() => setSelectedDictLevels([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                Showing {paginatedWords.length} of {filteredDictionaryWords.length} words
                {selectedAlphabet && ` starting with "${selectedAlphabet}"`}
                {selectedDictLevels.length > 0 && ` at level ${selectedDictLevels.join(", ")}`}
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-bold">Word</TableHead>
                      <TableHead className="font-bold">Pronunciation</TableHead>
                      <TableHead className="font-bold">Meaning</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Level</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWords.length > 0 ? (
                      paginatedWords.map((word) => (
                        <TableRow key={word.id} className="hover:bg-primary-50/50 transition-colors">
                          <TableCell className="font-semibold text-primary-600">{word.word}</TableCell>
                          <TableCell className="text-slate-500 font-mono text-sm">{word.pronunciation}</TableCell>
                          <TableCell className="max-w-xs truncate">{word.meaning}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {word.partOfSpeech}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary-100 text-primary-700 text-xs">{word.level}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No words found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1

                    const showEllipsis =
                      (page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }

                    if (!showPage) return null

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </ProtectedRoute>
  )
}
