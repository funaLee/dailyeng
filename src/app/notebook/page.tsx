"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BookOpen,
  FileText,
  Zap,
  Volume2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Mic,
  Square,
  X,
  Check,
  RotateCcw,
  Play,
  Shuffle,
  Undo2,
  GraduationCap,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Flame,
  Award,
  BarChart3,
  Brain,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"

type Collection = {
  id: string
  name: string
  icon: React.ReactNode
  count: number
  mastered: number
  color: string
}

type NotebookItem = {
  id: string
  word: string
  pronunciation: string
  meaning: string[]
  vietnamese: string[]
  examples: { en: string; vi: string }[]
  partOfSpeech: string
  level: string
  note?: string
  tags: string[]
  collectionId: string
  masteryLevel: number
  lastReviewed?: string
}

export default function NotebookPage() {
  const [selectedCollection, setSelectedCollection] = useState<string>("vocabulary")
  const [viewMode, setViewMode] = useState<"list" | "flashcards" | "statistics">("list")
  const [searchQuery] = useState("")
  const [starredItems, setStarredItems] = useState<Set<string>>(new Set())
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shadowingOpen, setShadowingOpen] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [cardAnimation, setCardAnimation] = useState<"" | "swipe-left" | "swipe-right">("")
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set())
  const [notLearnedCards, setNotLearnedCards] = useState<Set<string>>(new Set())
  const [sessionCompleteOpen, setSessionCompleteOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const collections: Collection[] = [
    {
      id: "vocabulary",
      name: "Vocabulary",
      icon: <BookOpen className="h-5 w-5" />,
      count: 247,
      mastered: 182,
      color: "primary",
    },
    {
      id: "grammar",
      name: "Grammar",
      icon: <FileText className="h-5 w-5" />,
      count: 45,
      mastered: 32,
      color: "secondary",
    },
  ]

  const [notebookItems] = useState<NotebookItem[]>([
    {
      id: "1",
      word: "Accomplish",
      pronunciation: "/əˈkʌmplɪʃ/",
      meaning: ["To complete or achieve something successfully"],
      vietnamese: ["Hoàn thành, đạt được"],
      examples: [
        {
          en: "She was able to accomplish all her goals this year.",
          vi: "Cô ấy đã có thể hoàn thành tất cả mục tiêu của mình trong năm nay.",
        },
      ],
      partOfSpeech: "verb",
      level: "B1",
      note: "Often used in professional contexts",
      tags: ["business", "achievement"],
      collectionId: "vocabulary",
      masteryLevel: 65,
      lastReviewed: "2 days ago",
    },
    {
      id: "2",
      word: "Collaborate",
      pronunciation: "/kəˈlæbəreɪt/",
      meaning: ["To work together with others on a project or task"],
      vietnamese: ["Cộng tác, làm việc cùng nhau"],
      examples: [
        {
          en: "The teams will collaborate to develop the new software.",
          vi: "Các nhóm sẽ cộng tác để phát triển phần mềm mới.",
        },
      ],
      partOfSpeech: "verb",
      level: "B2",
      note: "Very common in workplace English",
      tags: ["business", "teamwork"],
      collectionId: "vocabulary",
      masteryLevel: 40,
      lastReviewed: "5 days ago",
    },
    {
      id: "3",
      word: "behaviour",
      pronunciation: "/bɪˈheɪvjə(r)/",
      meaning: [
        "the way that somebody behaves, especially towards other people",
        "the way a person, an animal, a plant, a chemical, etc. behaves or functions in a particular situation",
      ],
      vietnamese: [
        "Hành vi / cách cư xử (đối với người khác)",
        "Cách hoạt động / phản ứng (trong một tình huống cụ thể)",
      ],
      examples: [
        { en: "It is hard to change old patterns of behaviour.", vi: "Thật khó để thay đổi những hành vi cũ." },
        {
          en: "Animals in zoos often display disturbed behaviour.",
          vi: "Động vật trong vườn thú thường thể hiện hành vi bất thường.",
        },
      ],
      partOfSpeech: "noun",
      level: "A2",
      tags: [],
      collectionId: "vocabulary",
      masteryLevel: 80,
      lastReviewed: "Today",
    },
  ])

  const filteredItems = notebookItems.filter(
    (item) =>
      item.collectionId === selectedCollection &&
      (item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const flashcardItems =
    selectedItems.size > 0 ? filteredItems.filter((item) => selectedItems.has(item.id)) : filteredItems

  const dueCount = 15
  const currentCollection = collections.find((c) => c.id === selectedCollection)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode !== "flashcards" || sessionCompleteOpen) return

      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") {
        e.preventDefault()
        setIsFlipped(!isFlipped)
      }

      if (e.code === "ArrowLeft") {
        e.preventDefault()
        if (currentItem) {
          setNotLearnedCards((prev) => new Set(prev).add(currentItem.id))
          setLearnedCards((prev) => {
            const newSet = new Set(prev)
            newSet.delete(currentItem.id)
            return newSet
          })
        }
        setCardAnimation("swipe-left")
        setTimeout(() => {
          if (currentCardIndex < flashcardItems.length - 1) {
            handleNextCard()
          } else {
            setSessionCompleteOpen(true)
          }
          setCardAnimation("")
        }, 500)
      }

      if (e.code === "ArrowRight") {
        e.preventDefault()
        if (currentItem) {
          setLearnedCards((prev) => new Set(prev).add(currentItem.id))
          setNotLearnedCards((prev) => {
            const newSet = new Set(prev)
            newSet.delete(currentItem.id)
            return newSet
          })
        }
        setCardAnimation("swipe-right")
        setTimeout(() => {
          if (currentCardIndex < flashcardItems.length - 1) {
            handleNextCard()
          } else {
            setSessionCompleteOpen(true)
          }
          setCardAnimation("")
        }, 500)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isFlipped, viewMode, currentCardIndex, flashcardItems.length, sessionCompleteOpen])

  useEffect(() => {
    setIsFlipped(false)
  }, [currentCardIndex])

  const handleNextCard = () => {
    if (currentCardIndex < flashcardItems.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleRecording = () => {
    setIsRecording(!isRecording)
  }

  const currentItem = flashcardItems[currentCardIndex]

  return (
    <ProtectedRoute
      pageName="Notebook"
      pageDescription="Save and organize your vocabulary, notes, and learning materials."
      pageIcon={PageIcons.notebook}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex gap-6 min-h-[calc(100vh-350px)]">
          <div className="w-72 flex-shrink-0">
            <Card className="p-5 sticky top-20 border-2 border-border bg-white">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Collections</h2>
                <Badge variant="secondary" className="text-xs">
                  {collections.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => {
                      setSelectedCollection(collection.id)
                      setViewMode("flashcards")
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                      selectedCollection === collection.id
                        ? "bg-primary-100 border-2 border-primary-300 shadow-sm"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        selectedCollection === collection.id ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {collection.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`font-semibold ${selectedCollection === collection.id ? "text-primary-700" : "text-gray-900"}`}
                      >
                        {collection.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{collection.count} items</span>
                        <span className="text-xs text-success-600">{collection.mastered} mastered</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-center h-11 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  New Collection
                </Button>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Last studied</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">This week</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">42 words</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Accuracy</span>
                    </div>
                    <span className="text-sm font-medium text-success-600">87%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-white rounded-xl">
                  {selectedCollection === "vocabulary" ? (
                    <>
                      <TabsTrigger
                        value="list"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2 "
                      >
                        List View
                      </TabsTrigger>
                      <TabsTrigger
                        value="flashcards"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2"
                      >
                        Flashcards
                      </TabsTrigger>
                      <TabsTrigger
                        value="statistics"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2"
                      >
                        Statistics
                      </TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger
                        value="list"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2"
                      >
                        All Rules
                      </TabsTrigger>
                      <TabsTrigger
                        value="flashcards"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2"
                      >
                        Quizzes
                      </TabsTrigger>
                      <TabsTrigger
                        value="statistics"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2"
                      >
                        Statistics
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
              </Tabs>

              {viewMode === "list" && selectedItems.size > 0 && (
                <Button
                  onClick={() => {
                    setViewMode("flashcards")
                    setCurrentCardIndex(0)
                    setIsFlipped(false)
                  }}
                  className="gap-2 rounded-xl h-11"
                >
                  <GraduationCap className="h-4 w-4" />
                  Practice ({selectedItems.size})
                </Button>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {viewMode === "list" && (
                <Card className="p-6 border-2 border-border-100 bg-white">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-100">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="select-all"
                        checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(new Set(filteredItems.map((item) => item.id)))
                          } else {
                            setSelectedItems(new Set())
                          }
                        }}
                        className="h-5 w-5 border-2 border-border"
                      />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer text-gray-700">
                        Select All
                      </label>
                      {selectedItems.size > 0 && (
                        <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
                          {selectedItems.size} selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{filteredItems.length} words in collection</p>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-gray-100">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="w-[200px] font-semibold text-gray-700">Word</TableHead>
                        <TableHead className="w-[320px] font-semibold text-gray-700">Meaning</TableHead>
                        <TableHead className="w-[80px] font-semibold text-gray-700">Level</TableHead>
                        <TableHead className="w-[160px] font-semibold text-gray-700">Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="py-4">
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedItems)
                                if (checked) {
                                  newSelected.add(item.id)
                                } else {
                                  newSelected.delete(item.id)
                                }
                                setSelectedItems(newSelected)
                              }}
                              className="h-5 w-5 border-2 border-border"
                            />
                          </TableCell>
                          <TableCell className="py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{item.word}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.pronunciation}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-700 line-clamp-1">{item.meaning[0]}</p>
                              {item.meaning.length > 1 && (
                                <p className="text-sm line-clamp-1 text-gray-500">{item.meaning[1]}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={`font-medium ${
                                item.level.startsWith("A")
                                  ? "border-success-300 text-success-700 bg-success-50"
                                  : item.level.startsWith("B")
                                    ? "border-primary-300 text-primary-700 bg-primary-50"
                                    : "border-secondary-300 text-secondary-700 bg-secondary-50"
                              }`}
                            >
                              {item.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      item.masteryLevel < 30
                                        ? "bg-warning-500"
                                        : item.masteryLevel < 70
                                          ? "bg-primary-500"
                                          : "bg-success-500"
                                    }`}
                                    style={{ width: `${item.masteryLevel}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-600 w-8">{item.masteryLevel}%</span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {item.masteryLevel < 30
                                  ? "Learning"
                                  : item.masteryLevel < 70
                                    ? "Reviewing"
                                    : "Mastered"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {viewMode === "flashcards" && currentItem && (
                <div className="max-w-4xl mx-auto">
                  <div className="flex justify-center gap-6 mb-8">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-warning-50 to-warning-100 border-2 border-warning-200 shadow-sm">
                      <div className="h-8 w-8 rounded-full bg-warning-500 flex items-center justify-center">
                        <X className="h-6 w-6 text-warning-300" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-warning-300">{notLearnedCards.size}</span>
                        <p className="text-xs text-warning-300">Learning</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 shadow-sm">
                      <div className="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center">
                        <Check className="h-6 w-6 text-success-300" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-success-300">{learnedCards.size}</span>
                        <p className="text-xs text-success-300">Mastered</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="perspective-1000 cursor-pointer mb-8"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="relative w-full h-[500px] transition-transform duration-500 preserve-3d"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      <Card
                        className="absolute inset-0 backface-hidden p-8 border-2 border-gray-100 shadow-lg bg-white"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {cardAnimation === "swipe-left" && (
                          <div className="absolute inset-0 bg-warning-100/50 flex items-center justify-center rounded-lg z-10 transition-all duration-300 animate-in fade-in">
                            <X className="h-40 w-40 text-warning-200 stroke-[4] animate-in zoom-in duration-300" />
                          </div>
                        )}
                        {cardAnimation === "swipe-right" && (
                          <div className="absolute inset-0 bg-success-100/50 flex items-center justify-center rounded-lg z-10 transition-all duration-300 animate-in fade-in">
                            <Check className="h-40 w-40 text-success-200 stroke-[4] animate-in zoom-in duration-300" />
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-2">
                            <Badge className="text-sm px-4 py-1.5 rounded-lg">{currentItem.partOfSpeech}</Badge>
                            <Badge
                              className={`text-sm px-4 py-1.5 rounded-lg ${
                                currentItem.level.startsWith("A")
                                  ? "bg-success-100 text-success-700 hover:bg-success-100"
                                  : currentItem.level.startsWith("B")
                                    ? "bg-primary-100 text-primary-700 hover:bg-primary-100"
                                    : "bg-secondary-100 text-secondary-700 hover:bg-secondary-100"
                              }`}
                            >
                              {currentItem.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2 w-48">
                                <span className="text-xs text-gray-500 whitespace-nowrap">New</span>
                                <div className="relative flex-1 h-2.5 rounded-full overflow-hidden bg-gray-100">
                                  <div
                                    className="absolute inset-0 bg-gradient-to-r from-warning-500 via-primary-500 to-success-500 transition-all duration-300"
                                    style={{
                                      clipPath: `inset(0 ${100 - currentItem.masteryLevel}% 0 0)`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">Mastered</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 w-10 rounded-full p-0 hover:bg-yellow-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                setStarredItems((prev) => {
                                  const newSet = new Set(prev)
                                  if (newSet.has(currentItem.id)) {
                                    newSet.delete(currentItem.id)
                                  } else {
                                    newSet.add(currentItem.id)
                                  }
                                  return newSet
                                })
                              }}
                            >
                              <Star
                                className={`h-5 w-5 ${starredItems.has(currentItem.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                              />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center h-[calc(100%-120px)]">
                          <h2 className="text-6xl font-bold text-gray-900">{currentItem.word}</h2>
                          <p className="text-xl text-gray-500 mt-4">Click to reveal meaning</p>
                        </div>
                      </Card>

                      <Card
                        className="absolute inset-0 backface-hidden p-8 overflow-hidden flex flex-col border-2 border-gray-100 shadow-lg bg-white"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h2 className="text-3xl font-bold text-gray-900">{currentItem.word}</h2>
                              <Badge className="text-sm">{currentItem.partOfSpeech}</Badge>
                              <Badge
                                className={`text-sm ${
                                  currentItem.level.startsWith("A")
                                    ? "bg-success-100 text-success-700 hover:bg-success-100"
                                    : currentItem.level.startsWith("B")
                                      ? "bg-primary-100 text-primary-700 hover:bg-primary-100"
                                      : "bg-secondary-100 text-secondary-700 hover:bg-secondary-100"
                                }`}
                              >
                                {currentItem.level}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 w-10 rounded-full p-0 hover:bg-yellow-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                setStarredItems((prev) => {
                                  const newSet = new Set(prev)
                                  if (newSet.has(currentItem.id)) {
                                    newSet.delete(currentItem.id)
                                  } else {
                                    newSet.add(currentItem.id)
                                  }
                                  return newSet
                                })
                              }}
                            >
                              <Star
                                className={`h-5 w-5 ${starredItems.has(currentItem.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                              />
                            </Button>
                          </div>

                          <p className="text-lg text-gray-500 mb-5">{currentItem.pronunciation}</p>

                          <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="bg-primary-50 rounded-xl p-4">
                                <h3 className="text-sm font-bold uppercase text-primary-700 mb-3 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Meaning
                                </h3>
                                <div className="space-y-2">
                                  {currentItem.meaning.map((m, idx) => (
                                    <div key={idx} className="flex gap-2">
                                      <div className="h-6 w-6 rounded-full bg-primary-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary-700">
                                        {idx + 1}
                                      </div>
                                      <p className="text-sm leading-relaxed text-gray-700">{m}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-success-50 rounded-xl p-4">
                                <h3 className="text-sm font-bold uppercase text-success-700 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Vietnamese
                                </h3>
                                <div className="space-y-2">
                                  {currentItem.vietnamese.map((v, idx) => (
                                    <div key={idx} className="flex gap-2">
                                      <div className="h-6 w-6 rounded-full bg-primary-200 text-primary-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-success-700">
                                        {idx + 1}
                                      </div>
                                      <p className="text-sm leading-relaxed text-gray-700">{v}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="bg-primary-50 rounded-xl p-4">
                              <h3 className="text-sm font-bold uppercase text-primary-700 mb-3 flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Examples
                              </h3>
                              <div className="space-y-2.5">
                                {currentItem.examples.map((ex, idx) => (
                                  <div key={idx} className="bg-white rounded-lg p-3 space-y-1 border border-gray-100">
                                    <p className="text-sm italic text-gray-800">"{ex.en}"</p>
                                    <p className="text-sm text-gray-500">"{ex.vi}"</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-gray-100">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShadowingOpen(true)
                                setCurrentSentence(0)
                              }}
                              variant="outline"
                              className="gap-2 bg-transparent w-full h-11 rounded-xl border-2"
                            >
                              <Mic className="h-4 w-4" />
                              Shadowing Practice
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-transparent rounded-2xl p-4">
                    <Button
                      variant="outline"
                      className="gap-2 h-11 rounded-xl border-2 bg-transparent"
                      onClick={() => {
                        if (currentCardIndex > 0) {
                          setCurrentCardIndex(currentCardIndex - 1)
                          setIsFlipped(false)
                        }
                      }}
                      disabled={currentCardIndex === 0}
                    >
                      <Undo2 className="h-4 w-4" />
                      Back
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{currentCardIndex + 1}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-lg text-gray-500">{flashcardItems.length}</span>
                    </div>
                    <Button variant="outline" className="gap-2 h-11 rounded-xl border-2 bg-transparent">
                      <Shuffle className="h-4 w-4" />
                      Shuffle
                    </Button>
                  </div>
                </div>
              )}

              {viewMode === "statistics" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card className="p-6 border-2 border-border bg-white">
                    <div className="flex items-center gap-6">
                      {/* Left column - Icon and main text */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200 shrink-0">
                          <Zap className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Ready to Practice!</h2>
                          <p className="text-gray-600 text-sm">
                            You have <span className="font-bold text-primary-600">{dueCount} words</span> ready for
                            review today.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Consistent daily practice improves retention.</p>
                        </div>
                      </div>
                      {/* Right column - Button */}
                      <Button
                        size="lg"
                        onClick={() => setIsReviewModalOpen(true)}
                        className="gap-2 h-11 px-6 rounded-xl shrink-0"
                      >
                        <Zap className="h-5 w-5" />
                        Start Practice
                      </Button>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 text-center border-2 border-gray-100 hover:border-primary-200 transition-colors bg-white hover:bg-primary-50">
                      <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">247</p>
                      <p className="text-sm text-gray-500">Total Words</p>
                    </Card>
                    <Card className="p-5 text-center border-2 border-gray-100 hover:border-success-200 transition-colors bg-white hover:bg-success-100/40">
                      <div className="h-12 w-12 rounded-xl bg-success-100 flex items-center justify-center mx-auto">
                        <Award className="h-6 w-6 text-success-300" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">182</p>
                      <p className="text-sm text-gray-500">Mastered</p>
                    </Card>
                    <Card className="p-5 text-center border-2 border-gray-100 hover:border-warning-200 transition-colors bg-white hover:bg-warning-100/40">
                      <div className="h-12 w-12 rounded-xl bg-warning-100 flex items-center justify-center mx-auto">
                        <Flame className="h-6 w-6 text-warning-300" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">7</p>
                      <p className="text-sm text-gray-500">Day Streak</p>
                    </Card>
                    <Card className="p-5 text-center border-2 border-gray-100 hover:border-secondary-200 transition-colors bg-white hover:bg-secondary-50">
                      <div className="h-12 w-12 rounded-xl bg-secondary-100 flex items-center justify-center mx-auto">
                        <BarChart3 className="h-6 w-6 text-secondary-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">87%</p>
                      <p className="text-sm text-gray-500">Accuracy</p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Learning Status - Donut Chart */}
                    <Card className="p-6 border-2 border-border bg-white">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Status</h3>
                      <div className="flex items-center justify-center gap-8">
                        {/* Donut Chart */}
                        <div className="relative">
                          <svg width="160" height="160" viewBox="0 0 160 160">
                            {/* Background circle */}
                            <circle cx="80" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="24" />
                            {/* Mastered segment (65%) */}
                            <circle
                              cx="80"
                              cy="80"
                              r="60"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="24"
                              strokeDasharray={`${0.65 * 377} ${0.35 * 377}`}
                              strokeDashoffset="94.25"
                              strokeLinecap="round"
                              className="transition-all duration-500"
                            />
                            {/* Learning segment (35%) */}
                            <circle
                              cx="80"
                              cy="80"
                              r="60"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="24"
                              strokeDasharray={`${0.35 * 377} ${0.65 * 377}`}
                              strokeDashoffset={`${94.25 - 0.65 * 377}`}
                              strokeLinecap="round"
                              className="transition-all duration-500"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900">65%</span>
                            <span className="text-xs text-gray-500">Mastered</span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-success-500" />
                            <span className="text-sm text-gray-700">65% Mastered</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-warning-500" />
                            <span className="text-sm text-gray-700">35% Learning</span>
                          </div>
                        </div>
                      </div>

                      {/* Tip */}
                      <div className="mt-6 p-4 bg-success-50 rounded-xl border border-success-100">
                        <p className="text-sm text-success-700">
                          <span className="font-semibold">Great progress!</span> Your mastered rate (65%) is very good.
                          Keep reviewing the remaining 35% to achieve full mastery!
                        </p>
                      </div>
                    </Card>

                    {/* Vocabulary Distribution by Level - Bar Chart */}
                    <Card className="p-6 border-2 border-border bg-white">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Vocabulary Distribution by Level</h3>
                      <div className="space-y-4">
                        {[
                          { level: "A1", count: 85, percentage: 100, color: "bg-primary-600" },
                          { level: "A2", count: 72, percentage: 85, color: "bg-primary-500" },
                          { level: "B1", count: 48, percentage: 56, color: "bg-primary-400" },
                          { level: "B2", count: 28, percentage: 33, color: "bg-primary-300" },
                          { level: "C1", count: 10, percentage: 12, color: "bg-gray-400" },
                          { level: "C2", count: 4, percentage: 5, color: "bg-gray-300" },
                        ].map((item) => (
                          <div key={item.level} className="flex items-center gap-4">
                            <span className="w-8 text-sm font-semibold text-gray-700">{item.level}</span>
                            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-3`}
                                style={{ width: `${item.percentage}%` }}
                              >
                                {item.percentage > 20 && (
                                  <span className="text-xs font-semibold text-white">{item.count}</span>
                                )}
                              </div>
                            </div>
                            {item.percentage <= 20 && (
                              <span className="text-xs font-semibold text-gray-500 w-8">{item.count}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                        <span>Total: 247 words</span>
                        <span>Focus: A1-B1 levels</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialogs remain mostly the same with minor styling updates */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Practice Review</DialogTitle>
            </DialogHeader>
            {currentItem && (
              <div className="space-y-6">
                <Card className="p-6 bg-gray-50 border-2 border-gray-100">
                  <h3 className="text-2xl font-bold mb-2">{currentItem.word}</h3>
                  <p className="text-gray-500 mb-4">{currentItem.pronunciation}</p>

                  {showAnswer ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Meaning:</p>
                        {currentItem.meaning.map((m, idx) => (
                          <p key={idx} className="text-sm">
                            • {m}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Vietnamese:</p>
                        {currentItem.vietnamese.map((v, idx) => (
                          <p key={idx} className="text-sm">
                            • {v}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setShowAnswer(true)} variant="outline" className="w-full">
                      Show Answer
                    </Button>
                  )}
                </Card>

                {showAnswer && (
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200">
                      Again
                    </Button>
                    <Button variant="outline" className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200">
                      Hard
                    </Button>
                    <Button variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
                      Good
                    </Button>
                    <Button variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                      Easy
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={shadowingOpen} onOpenChange={setShadowingOpen}>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-6">Shadowing Practice</DialogTitle>
            </DialogHeader>
            {currentItem && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                    disabled={currentSentence === 0}
                    className="rounded-full h-10 w-10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">
                    Sentence {currentSentence + 1} / {currentItem.examples.length}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCurrentSentence(Math.min(currentItem.examples.length - 1, currentSentence + 1))}
                    disabled={currentSentence === currentItem.examples.length - 1}
                    className="rounded-full h-10 w-10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <Card className="p-6 bg-primary-50 border-2 border-border">
                  <p className="text-xl mb-4 text-gray-900">{currentItem.examples[currentSentence].en}</p>
                  <p className="text-base text-gray-500">{currentItem.examples[currentSentence].vi}</p>
                </Card>

                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={handleRecording}
                    className="h-24 w-24 rounded-full"
                  >
                    {isRecording ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                  </Button>
                  <p className="text-sm text-gray-500">
                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Volume2 className="h-4 w-4" />
                    Play Original
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent" disabled={!isRecording}>
                    <Volume2 className="h-4 w-4" />
                    Play Recording
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={sessionCompleteOpen} onOpenChange={setSessionCompleteOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Session Complete!</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#fde68a"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${(notLearnedCards.size / Math.max(learnedCards.size + notLearnedCards.size, 1)) * 502.4} 502.4`}
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#86efac"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${(learnedCards.size / Math.max(learnedCards.size + notLearnedCards.size, 1)) * 502.4} 502.4`}
                      strokeDashoffset={`-${(notLearnedCards.size / Math.max(learnedCards.size + notLearnedCards.size, 1)) * 502.4}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-900">
                      {learnedCards.size + notLearnedCards.size > 0
                        ? Math.round((learnedCards.size / (learnedCards.size + notLearnedCards.size)) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-gray-500">Mastered</p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
                    <div>
                      <p className="text-sm font-medium">Learning</p>
                      <p className="text-xs text-gray-500">{notLearnedCards.size} cards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-300"></div>
                    <div>
                      <p className="text-sm font-medium">Mastered</p>
                      <p className="text-xs text-gray-500">{learnedCards.size} cards</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  className="w-full gap-2 h-12 rounded-xl"
                  size="lg"
                  disabled={notLearnedCards.size === 0}
                  onClick={() => {
                    setCurrentCardIndex(0)
                    setSessionCompleteOpen(false)
                    setIsFlipped(false)
                  }}
                >
                  <Play className="h-5 w-5" />
                  Review Unmastered ({notLearnedCards.size})
                </Button>
                <Button
                  className="w-full gap-2 h-12 rounded-xl bg-transparent"
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setCurrentCardIndex(0)
                    setLearnedCards(new Set())
                    setNotLearnedCards(new Set())
                    setSessionCompleteOpen(false)
                    setIsFlipped(false)
                  }}
                >
                  <RotateCcw className="h-5 w-5" />
                  Start Over
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
