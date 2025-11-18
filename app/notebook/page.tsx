"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, FileText, Link2, MessageSquare, Zap, FileCheck, LinkIcon, Volume2, Info, Edit, Plus, Search, ChevronLeft, ChevronRight, Star, Mic, Square } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Collection = {
  id: string
  name: string
  icon: React.ReactNode
  count: number
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
}

export default function NotebookPage() {
  const [selectedCollection, setSelectedCollection] = useState<string>("vocabulary")
  const [viewMode, setViewMode] = useState<"list" | "flashcards" | "daily-review">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shadowingOpen, setShadowingOpen] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isRecording, setIsRecording] = useState(false)

  const collections: Collection[] = [
    { id: "vocabulary", name: "Vocabulary", icon: <BookOpen className="h-4 w-4" />, count: 247 },
    { id: "grammar", name: "Grammar", icon: <FileText className="h-4 w-4" />, count: 45 },
    { id: "collocations", name: "Collocations", icon: <Link2 className="h-4 w-4" />, count: 89 },
    { id: "idioms", name: "Idioms & Expressions", icon: <MessageSquare className="h-4 w-4" />, count: 67 },
    { id: "phrasal-verbs", name: "Phrasal Verbs", icon: <Zap className="h-4 w-4" />, count: 123 },
    { id: "sentence-patterns", name: "Sentence Patterns", icon: <FileCheck className="h-4 w-4" />, count: 34 },
    { id: "linking-words", name: "Linking Words", icon: <LinkIcon className="h-4 w-4" />, count: 56 },
    { id: "pronunciation", name: "Pronunciation", icon: <Volume2 className="h-4 w-4" />, count: 78 },
    { id: "common-mistakes", name: "Common Mistakes", icon: <Info className="h-4 w-4" />, count: 29 },
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
    },
  ])

  const filteredItems = notebookItems.filter(
    (item) =>
      item.collectionId === selectedCollection &&
      (item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const dueCount = 15

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && viewMode === "flashcards") {
        e.preventDefault()
        setIsFlipped(!isFlipped)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isFlipped, viewMode])

  useEffect(() => {
    setIsFlipped(false)
  }, [currentCardIndex])

  const handleNextCard = () => {
    if (currentCardIndex < filteredItems.length - 1) {
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

  const currentItem = filteredItems[currentCardIndex]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6 min-h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card className="p-6 sticky top-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Collections</h2>
              <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    setSelectedCollection(collection.id)
                    setViewMode("list")
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedCollection === collection.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {collection.icon}
                    <span>{collection.name}</span>
                  </div>
                  <span className="text-xs">{collection.count}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Knowledge Notebook</h1>
            <p className="text-sm text-muted-foreground">Organize and review your English learning notes</p>
          </div>

          {/* Collection Header with Actions */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {collections.find((c) => c.id === selectedCollection)?.icon}
                <h2 className="text-lg font-semibold capitalize">{selectedCollection}</h2>
                <span className="text-sm text-muted-foreground">({filteredItems.length} items)</span>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Tabs */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="daily-review">Daily Review</TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>

          {/* Content Area */}
          <div className="flex-1">
            {viewMode === "list" && (
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
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="py-4">
                          <div>
                            <p className="font-semibold">{item.word}</p>
                            <p className="text-xs text-muted-foreground">{item.pronunciation}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="text-sm line-clamp-1">{item.meaning[0]}</p>
                            {item.meaning.length > 1 && (
                              <p className="text-sm line-clamp-1 text-muted-foreground">{item.meaning[1]}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline">{item.level}</Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${item.masteryLevel}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.masteryLevel < 30 ? "Learning" : item.masteryLevel < 70 ? "Reviewing" : "Mastered"}
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

            {viewMode === "flashcards" && currentItem && (
              <div className="max-w-4xl mx-auto">
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
                      className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="text-center space-y-6">
                        <h2 className="text-5xl font-bold">{currentItem.word}</h2>
                        <div className="flex items-center gap-3 justify-center">
                          <Badge variant="secondary" className="text-lg px-4 py-1">
                            {currentItem.partOfSpeech}
                          </Badge>
                          <Badge variant="outline" className="text-lg px-4 py-1">
                            {currentItem.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 justify-center mt-8">
                          <span className="text-sm text-muted-foreground">
                            {currentItem.masteryLevel < 30 ? "New" : currentItem.masteryLevel < 70 ? "Learning" : "Mastered"}
                          </span>
                          <div className="w-48 h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${currentItem.masteryLevel}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-8">Click or press Space to flip</p>
                      </div>
                    </Card>

                    <Card
                      className="absolute inset-0 backface-hidden p-8 overflow-y-auto"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold">{currentItem.word}</h2>
                            <Badge variant="secondary">{currentItem.partOfSpeech}</Badge>
                            <Badge variant="outline">{currentItem.level}</Badge>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-lg text-muted-foreground">{currentItem.pronunciation}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Meaning</h3>
                            <div className="space-y-2">
                              {currentItem.meaning.map((m, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <div className="h-6 w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-blue-700">
                                    {idx + 1}
                                  </div>
                                  <p className="text-sm">{m}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Vietnamese</h3>
                            <div className="space-y-2">
                              {currentItem.vietnamese.map((v, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-green-700">
                                    {idx + 1}
                                  </div>
                                  <p className="text-sm">{v}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Examples</h3>
                          <div className="space-y-3">
                            {currentItem.examples.map((ex, idx) => (
                              <div key={idx} className="bg-muted/50 rounded-lg p-3 space-y-1">
                                <p className="text-sm italic">"{ex.en}"</p>
                                <p className="text-sm text-muted-foreground">"{ex.vi}"</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShadowingOpen(true)
                              setCurrentSentence(0)
                            }}
                            variant="outline"
                            className="gap-2 bg-transparent"
                          >
                            <Mic className="h-4 w-4" />
                            shadowing these sentences
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground text-center pt-4">
                          Click or press Space to flip back
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className="rounded-full bg-transparent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">
                    {currentCardIndex + 1} / {filteredItems.length}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleNextCard}
                    disabled={currentCardIndex === filteredItems.length - 1}
                    className="rounded-full bg-transparent"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {viewMode === "daily-review" && (
              <div className="max-w-2xl mx-auto">
                <Card className="p-8 text-center">
                  <Zap className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Daily Review</h2>
                  <p className="text-muted-foreground mb-6">
                    You have <span className="font-semibold text-primary">{dueCount} words</span> ready for review
                    today.
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Consistent daily practice helps reinforce your learning and improve retention.
                  </p>
                  <Button size="lg" onClick={() => setIsReviewModalOpen(true)} className="gap-2">
                    <Zap className="h-5 w-5" />
                    Start Practice
                  </Button>
                </Card>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-500">247</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Words</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-500">182</p>
                    <p className="text-xs text-muted-foreground mt-1">Mastered</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-500">7</p>
                    <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Practice Review</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-6">
              <Card className="p-6 bg-muted/30">
                <h3 className="text-2xl font-bold mb-2">{currentItem.word}</h3>
                <p className="text-muted-foreground mb-4">{currentItem.pronunciation}</p>

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
                  <Button variant="outline" className="bg-red-50 hover:bg-red-100">
                    Again
                  </Button>
                  <Button variant="outline" className="bg-yellow-50 hover:bg-yellow-100">
                    Hard
                  </Button>
                  <Button variant="outline" className="bg-green-50 hover:bg-green-100">
                    Good
                  </Button>
                  <Button variant="outline" className="bg-blue-50 hover:bg-blue-100">
                    Easy
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={shadowingOpen} onOpenChange={setShadowingOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Shadowing this sentence</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                  disabled={currentSentence === 0}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium">
                  Câu {currentSentence + 1} / {currentItem.examples.length}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCurrentSentence(Math.min(currentItem.examples.length - 1, currentSentence + 1))}
                  disabled={currentSentence === currentItem.examples.length - 1}
                  className="rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <Card className="p-6 bg-muted/30">
                <p className="text-xl mb-4">{currentItem.examples[currentSentence].en}</p>
                <p className="text-base text-muted-foreground">{currentItem.examples[currentSentence].vi}</p>
              </Card>

              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={handleRecording}
                  className="h-24 w-24 rounded-full"
                >
                  {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Volume2 className="h-4 w-4" />
                  Play Original
                </Button>
                <Button variant="outline" className="gap-2" disabled={!isRecording}>
                  <Volume2 className="h-4 w-4" />
                  Play Recording
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
