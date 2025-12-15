"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Bookmark, Network, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import {
  HubHero,
  TopicGroupsSidebar,
  LevelsSidebar,
  TopicCard,
  SubcategoryPills,
  type TopicGroup,
} from "@/components/hub"
import { VocabMindmap } from "@/components/hub/vocab-mindmap"
import { VocabItem } from "@/types"

// New Interface based on Grammar Hub structure
interface VocabTopic {
  id: string
  title: string
  description: string
  level: string
  category: string
  subcategory: string
  lessonCount: number
  estimatedTime: number
  progress: number
  thumbnail?: string
}

interface DictionaryWord {
  id: string
  word: string
  pronunciation: string
  meaning: string
  partOfSpeech: string
  level: string
  category: string
  masteryLevel: number
}

interface MindmapTopicGroup {
  id: string
  name: string
  color: "primary" | "secondary" | "accent"
  topics: {
    id: string
    title: string
    words: VocabItem[]
  }[]
}

interface CurrentTopic {
  id: string
  title: string
  subtitle: string
  progress: number
}

interface VocabPageClientProps {
  vocabGroups: TopicGroup[]
  vocabTopics: VocabTopic[]
  currentTopic: CurrentTopic
  dictionaryWords: DictionaryWord[]
  mindmapData: MindmapTopicGroup[]
}

type TabType = "topics" | "bookmarks" | "mindmap" | "dictionary"

export default function VocabPageClient({
  vocabGroups,
  vocabTopics,
  currentTopic,
  dictionaryWords,
  mindmapData,
}: VocabPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  // Hub Filters
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Daily Life")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Travel")
  const [activeTab, setActiveTab] = useState<TabType>("topics")
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([])

  // Dictionary State
  const [dictionarySearch, setDictionarySearch] = useState("")
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null)
  const [selectedDictLevels, setSelectedDictLevels] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const dictLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  useEffect(() => {
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

  const toggleLevel = (level: string) => {
    if (level === "All") {
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

  // --- Filtering Logic ---
  const isSearchMode = searchQuery.trim().length > 0
  const currentSubcategories = vocabGroups.find((g) => g.name === selectedGroup)?.subcategories || []

  // Filter topics based on search or normal mode
  const filteredTopics = vocabTopics.filter((topic) => {
    if (isSearchMode) {
      return (
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(topic.level)
    const matchesGroup = topic.category === selectedGroup
    const matchesSubcategory = !selectedSubcategory || selectedSubcategory === "All" || topic.subcategory === selectedSubcategory

    return matchesLevel && matchesGroup && matchesSubcategory
  })

  // Filter Dictionary
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

  const toggleDictLevel = (level: string) => {
    setSelectedDictLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const bookmarkedTopicsList = vocabTopics.filter((topic) => bookmarkedTopics.includes(topic.id))

  const tabs = [
    { id: "topics", label: "Available Topics" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "mindmap", label: "Mindmap" },
    { id: "dictionary", label: "Dictionary" },
  ]

  return (
    <ProtectedRoute
      pageName="Vocabulary Hub"
      pageDescription="Expand your vocabulary with structured topics and interactive flashcards."
      pageIcon={PageIcons.vocabulary}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HubHero
          title="VOCABULARY HUB"
          description="Expand your vocabulary with structured topics and interactive flashcards."
          primaryAction={{ label: "View Study Plan" }}
          secondaryAction={{ label: "Browse Topics" }}
          notification={{ text: "Recommended: Daily Routine", actionLabel: "Start" }}
          decorativeWords={["lexicon", "fluency", "expression"]}
        />

        {/* Tabs & Search */}
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
              placeholder="Search vocabulary topics..."
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

        {/* CONTENT AREA */}
        <div className="mt-6">
          {activeTab === "topics" && (
            <>
              {/* Search Mode - Show results without filters */}
              {isSearchMode ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      Search Results for "{searchQuery}" ({filteredTopics.length} found)
                    </h2>
                  </div>

                  {filteredTopics.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {filteredTopics.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          id={topic.id}
                          title={topic.title}
                          description={topic.description}
                          level={topic.level}
                          wordCount={topic.lessonCount}
                          progress={topic.progress}
                          href={`/vocab/${topic.id}`}
                          onNotYet={() => { }}
                          type="vocabulary"
                          isBookmarked={bookmarkedTopics.includes(topic.id)}
                          onBookmarkToggle={handleBookmarkToggle}
                          thumbnail={topic.thumbnail}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                      <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">No Results Found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search terms or browse topics by category.
                      </p>
                      <Button variant="default" onClick={() => setSearchQuery("")} className="cursor-pointer">
                        Clear Search
                      </Button>
                    </Card>
                  )}
                </div>
              ) : (
                /* Normal Mode */
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <TopicGroupsSidebar
                      groups={vocabGroups}
                      selectedGroup={selectedGroup}
                      onGroupChange={(name, firstSub) => {
                        setSelectedGroup(name)
                        setSelectedSubcategory(firstSub)
                      }}
                    />
                    <LevelsSidebar selectedLevels={selectedLevels} onLevelToggle={toggleLevel} />
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <SubcategoryPills
                      subcategories={currentSubcategories}
                      selectedSubcategory={selectedSubcategory}
                      onSubcategoryChange={setSelectedSubcategory}
                    />

                    {filteredTopics.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTopics.map((topic) => (
                          <TopicCard
                            key={topic.id}
                            id={topic.id}
                            title={topic.title}
                            description={topic.description}
                            level={topic.level}
                            wordCount={topic.lessonCount}
                            progress={topic.progress}
                            href={`/vocab/${topic.id}`}
                            onNotYet={() => { }}
                            type="vocabulary"
                            isBookmarked={bookmarkedTopics.includes(topic.id)}
                            onBookmarkToggle={handleBookmarkToggle}
                            thumbnail={topic.thumbnail}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                        <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">No Topics Found</h3>
                        <p className="text-muted-foreground">
                          No vocabulary topics match your current filters. Try selecting different levels or categories.
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </>
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
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {bookmarkedTopicsList.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.lessonCount}
                        progress={topic.progress}
                        href={`/vocab/${topic.id}`}
                        onNotYet={() => { }}
                        type="vocabulary"
                        isBookmarked={true}
                        onBookmarkToggle={handleBookmarkToggle}
                        thumbnail={topic.thumbnail}
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
                  <Button variant="default" onClick={() => setActiveTab("topics")} className="cursor-pointer">
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

          {/* Reintegrated Dictionary Tab */}
          {activeTab === "dictionary" && (
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
      </div>
    </ProtectedRoute>
  )
}
