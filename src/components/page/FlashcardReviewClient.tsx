"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BookOpen,
  FileText,
  Zap,
  Volume2,
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
  ArrowLeft,
} from "lucide-react"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import type { NotebookItem } from "./NotebookPageClient"

interface FlashcardReviewClientProps {
  notebookItems: NotebookItem[]
}

export default function FlashcardReviewClient({ notebookItems }: FlashcardReviewClientProps) {
  const router = useRouter()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardAnimation, setCardAnimation] = useState<"" | "swipe-left" | "swipe-right">("")
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set())
  const [notLearnedCards, setNotLearnedCards] = useState<Set<string>>(new Set())
  const [sessionCompleteOpen, setSessionCompleteOpen] = useState(false)
  const [starredItems, setStarredItems] = useState<Set<string>>(new Set())
  const [shadowingOpen, setShadowingOpen] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isRecording, setIsRecording] = useState(false)

  const currentItem = notebookItems[currentCardIndex]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (sessionCompleteOpen) return

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
          if (currentCardIndex < notebookItems.length - 1) {
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
          if (currentCardIndex < notebookItems.length - 1) {
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
  }, [isFlipped, currentCardIndex, notebookItems.length, sessionCompleteOpen])

  useEffect(() => {
    setIsFlipped(false)
  }, [currentCardIndex])

  const handleNextCard = () => {
    if (currentCardIndex < notebookItems.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <ProtectedRoute
      pageName="Flashcard Review"
      pageDescription="Practice your vocabulary with interactive flashcards"
      pageIcon={PageIcons.notebook}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/notebook")}
            className="gap-2 rounded-xl border-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notebook
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Flashcard Review</h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Flashcard with Stats on sides */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            {/* Learning stat - Left side */}
            <div className="flex items-center justify-center px-6 py-3 rounded-r-full bg-warning-50 border-2 border-warning-200">
              <span className="text-2xl font-bold text-warning-700">{notLearnedCards.size}</span>
            </div>

            {/* Flashcard in center */}
            <div
              className="flex-1 perspective-1000 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: "1000px" }}
            >
            <div
              className="relative w-full h-[480px] transition-transform duration-500 preserve-3d"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front of Card */}
              <Card
                className="absolute inset-0 backface-hidden p-8 border-2 border-gray-100 shadow-xl bg-white"
                style={{ backfaceVisibility: "hidden" }}
              >
                {cardAnimation === "swipe-left" && (
                  <div className="absolute inset-0 bg-warning-100/50 flex items-center justify-center rounded-lg z-10 transition-all duration-300 animate-in fade-in">
                    <X className="h-40 w-40 text-warning-500 stroke-[4] animate-in zoom-in duration-300" />
                  </div>
                )}
                {cardAnimation === "swipe-right" && (
                  <div className="absolute inset-0 bg-success-100/50 flex items-center justify-center rounded-lg z-10 transition-all duration-300 animate-in fade-in">
                    <Check className="h-40 w-40 text-success-500 stroke-[4] animate-in zoom-in duration-300" />
                  </div>
                )}

                <div className="absolute top-8 left-8 flex items-center gap-2">
                  <Badge className="text-sm px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">{currentItem.partOfSpeech}</Badge>
                  <Badge className="text-sm px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">
                    {currentItem.level}
                  </Badge>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-8 right-8 h-10 w-10 rounded-full p-0 hover:bg-yellow-50"
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

                <div className="flex items-center justify-center h-full">
                  <h2 className="text-6xl font-bold text-gray-900">{currentItem.word}</h2>
                </div>
              </Card>

              {/* Back of Card */}
              <Card
                className="absolute inset-0 backface-hidden p-6 overflow-hidden flex flex-col border-2 border-gray-100 shadow-xl bg-white"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">{currentItem.word}</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0 hover:bg-yellow-50"
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
                        className={`h-4 w-4 ${starredItems.has(currentItem.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                      />
                    </Button>
                  </div>

                  <p className="text-base text-gray-500 mb-4">{currentItem.pronunciation}</p>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-primary-50 rounded-lg p-3">
                        <h3 className="text-xs font-bold uppercase text-primary-700 mb-2 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          Meaning
                        </h3>
                        <div className="space-y-1.5">
                          {currentItem.meaning.map((m, idx) => (
                            <div key={idx} className="flex gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-primary-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary-700">
                                {idx + 1}
                              </div>
                              <p className="text-xs leading-relaxed text-gray-700">{m}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-success-50 rounded-lg p-3">
                        <h3 className="text-xs font-bold uppercase text-success-700 mb-2 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Vietnamese
                        </h3>
                        <div className="space-y-1.5">
                          {currentItem.vietnamese.map((v, idx) => (
                            <div key={idx} className="flex gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-success-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-success-700">
                                {idx + 1}
                              </div>
                              <p className="text-xs leading-relaxed text-gray-700">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-50 rounded-lg p-3">
                      <h3 className="text-xs font-bold uppercase text-primary-700 mb-2 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" />
                        Examples
                      </h3>
                      <div className="space-y-2">
                        {currentItem.examples.map((ex, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-2.5 space-y-0.5 border border-gray-100">
                            <p className="text-xs italic text-gray-800">"{ex.en}"</p>
                            <p className="text-xs text-gray-500">"{ex.vi}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShadowingOpen(true)
                        setCurrentSentence(0)
                      }}
                      variant="outline"
                      className="gap-2 bg-transparent w-full h-10 rounded-xl border-2"
                    >
                      <Mic className="h-4 w-4" />
                      Shadowing Practice
                    </Button>
                  </div>
                </div>
              </Card>
              </div>
            </div>

            {/* Mastered stat - Right side */}
            <div className="flex items-center justify-center px-6 py-3 rounded-l-full bg-success-50 border-2 border-success-200">
              <span className="text-2xl font-bold text-success-700">{learnedCards.size}</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center bg-transparent rounded-2xl p-4">
            <Button
              variant="outline"
              className="gap-2 h-12 rounded-xl border-2 bg-transparent"
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
              <span className="text-xl font-bold text-gray-900">{currentCardIndex + 1}</span>
              <span className="text-gray-400">/</span>
              <span className="text-xl text-gray-500">{notebookItems.length}</span>
            </div>
            <Button variant="outline" className="gap-2 h-12 rounded-xl border-2 bg-transparent">
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </div>

        {/* Shadowing Dialog */}
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

        {/* Session Complete Dialog */}
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
                <Button
                  className="w-full gap-2 h-12 rounded-xl bg-transparent"
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/notebook")}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Notebook
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
