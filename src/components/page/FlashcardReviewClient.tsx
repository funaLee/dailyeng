"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen, FileText, Zap, Volume2, ChevronLeft, ChevronRight, Star,
  Mic, Square, X, Check, RotateCcw, Play, Shuffle, ArrowLeft, Settings,
  Eye, EyeOff, Lightbulb, Trophy, Target, Clock,
} from "lucide-react"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import type { NotebookItem } from "./NotebookPageClient"

interface FlashcardReviewClientProps {
  notebookItems: NotebookItem[]
}

type StudyMode = "flashcards" | "learn" | "test"
type CardSide = "front" | "back"

function speakText(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }
}

export default function FlashcardReviewClient({ notebookItems: initialItems }: FlashcardReviewClientProps) {
  const router = useRouter()

  // Core state
  const [items, setItems] = useState(initialItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode] = useState<StudyMode>("flashcards")

  // Progress tracking
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set())
  const [learningCards, setLearningCards] = useState<Set<string>>(new Set())
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set())

  // UI state
  const [showDefinitionFirst, setShowDefinitionFirst] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [animationClass, setAnimationClass] = useState("")

  // Dialogs
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shadowingOpen, setShadowingOpen] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isRecording, setIsRecording] = useState(false)

  const currentCard = items[currentIndex]
  const totalCards = items.length
  const progress = totalCards > 0 ? ((knownCards.size + learningCards.size) / totalCards) * 100 : 0
  const remainingCards = totalCards - knownCards.size - learningCards.size

  // Get front/back content based on settings
  const getFrontContent = useCallback(() => {
    if (!currentCard) return { main: "", sub: "" }
    if (showDefinitionFirst) {
      return { main: currentCard.vietnamese.join("; "), sub: currentCard.meaning[0] || "" }
    }
    return { main: currentCard.word, sub: currentCard.pronunciation }
  }, [currentCard, showDefinitionFirst])

  const getBackContent = useCallback(() => {
    if (!currentCard) return { main: "", sub: "", examples: [] }
    if (showDefinitionFirst) {
      return { main: currentCard.word, sub: currentCard.pronunciation, examples: currentCard.examples }
    }
    return { main: currentCard.vietnamese.join("; "), sub: currentCard.meaning[0] || "", examples: currentCard.examples }
  }, [currentCard, showDefinitionFirst])

  // Navigation
  const goToCard = useCallback((index: number) => {
    if (index >= 0 && index < totalCards) {
      setCurrentIndex(index)
      setIsFlipped(false)
      setShowHint(false)
    }
  }, [totalCards])

  const nextCard = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setAnimationClass("slide-out-left")
      setTimeout(() => {
        goToCard(currentIndex + 1)
        setAnimationClass("slide-in-right")
        setTimeout(() => setAnimationClass(""), 300)
      }, 200)
    } else if (knownCards.size + learningCards.size === totalCards) {
      setSessionComplete(true)
    }
  }, [currentIndex, totalCards, goToCard, knownCards.size, learningCards.size])

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setAnimationClass("slide-out-right")
      setTimeout(() => {
        goToCard(currentIndex - 1)
        setAnimationClass("slide-in-left")
        setTimeout(() => setAnimationClass(""), 300)
      }, 200)
    }
  }, [currentIndex, goToCard])

  // Card actions
  const markAsKnown = useCallback(() => {
    if (!currentCard) return
    setKnownCards(prev => new Set(prev).add(currentCard.id))
    setLearningCards(prev => { const s = new Set(prev); s.delete(currentCard.id); return s })

    setAnimationClass("swipe-right")
    setTimeout(() => {
      if (currentIndex < totalCards - 1) {
        setCurrentIndex(prev => prev + 1)
        setIsFlipped(false)
        setShowHint(false)
      } else {
        setSessionComplete(true)
      }
      setAnimationClass("")
    }, 300)
  }, [currentCard, currentIndex, totalCards])

  const markAsLearning = useCallback(() => {
    if (!currentCard) return
    setLearningCards(prev => new Set(prev).add(currentCard.id))
    setKnownCards(prev => { const s = new Set(prev); s.delete(currentCard.id); return s })

    setAnimationClass("swipe-left")
    setTimeout(() => {
      if (currentIndex < totalCards - 1) {
        setCurrentIndex(prev => prev + 1)
        setIsFlipped(false)
        setShowHint(false)
      } else {
        setSessionComplete(true)
      }
      setAnimationClass("")
    }, 300)
  }, [currentCard, currentIndex, totalCards])

  const toggleStar = useCallback(() => {
    if (!currentCard) return
    setStarredCards(prev => {
      const s = new Set(prev)
      s.has(currentCard.id) ? s.delete(currentCard.id) : s.add(currentCard.id)
      return s
    })
  }, [currentCard])

  const shuffleCards = useCallback(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    setItems(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCards(new Set())
    setLearningCards(new Set())
  }, [items])

  const resetSession = useCallback(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCards(new Set())
    setLearningCards(new Set())
    setSessionComplete(false)
    setShowHint(false)
  }, [])

  const studyLearningOnly = useCallback(() => {
    const learningItems = items.filter(item => learningCards.has(item.id))
    if (learningItems.length > 0) {
      setItems(learningItems)
      resetSession()
    }
  }, [items, learningCards, resetSession])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionComplete || settingsOpen || shadowingOpen) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          setIsFlipped(prev => !prev)
          break
        case "ArrowLeft":
          e.preventDefault()
          if (e.shiftKey) markAsLearning()
          else prevCard()
          break
        case "ArrowRight":
          e.preventDefault()
          if (e.shiftKey) markAsKnown()
          else nextCard()
          break
        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault()
          setIsFlipped(prev => !prev)
          break
        case "KeyS":
          e.preventDefault()
          toggleStar()
          break
        case "KeyH":
          e.preventDefault()
          setShowHint(prev => !prev)
          break
        case "Enter":
          e.preventDefault()
          if (currentCard) speakText(currentCard.word)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sessionComplete, settingsOpen, shadowingOpen, prevCard, nextCard, markAsKnown, markAsLearning, toggleStar, currentCard])

  // Auto-play pronunciation
  useEffect(() => {
    if (autoPlay && currentCard && !isFlipped) {
      const timer = setTimeout(() => speakText(currentCard.word), 500)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, currentCard, currentIndex, isFlipped])

  // Empty state
  if (!currentCard) {
    return (
      <ProtectedRoute pageName="Flashcard Review" pageDescription="Practice vocabulary" pageIcon={PageIcons.notebook}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <Card className="p-12 text-center max-w-md">
            <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-3">No Cards Available</h3>
            <p className="text-gray-500 mb-6">Add some words to your notebook to start practicing.</p>
            <Button onClick={() => router.push("/notebook")} size="lg" className="gap-2">
              <ArrowLeft className="h-5 w-5" /> Go to Notebook
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  const frontContent = getFrontContent()
  const backContent = getBackContent()

  return (
    <ProtectedRoute pageName="Flashcard Review" pageDescription="Practice vocabulary" pageIcon={PageIcons.notebook}>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.push("/notebook")} className="gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" /> Back
              </Button>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-100">
                    <Check className="h-4 w-4 text-success-300" />
                    <span className="font-semibold text-success-300">{knownCards.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-100">
                    <Target className="h-4 w-4 text-warning-300" />
                    <span className="font-semibold text-warning-300">{learningCards.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-500">{remainingCards}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={shuffleCards} className="h-10 w-10">
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="h-10 w-10">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1 text-center">{currentIndex + 1} of {totalCards}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Card container */}
          <div className="relative mb-8">
            {/* Navigation arrows */}
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 h-14 w-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex === totalCards - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 h-14 w-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Flashcard */}
            <div
              className={`flashcard-container relative cursor-pointer transition-all duration-300 ${animationClass}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`flashcard-inner h-[500px] ${isFlipped ? "flipped" : ""}`}>
                {/* Front */}
                <Card className="flashcard-face p-8 bg-white rounded-3xl shadow-2xl border-0 flex flex-col h-[500px]">
                  {/* Swipe overlays */}
                  {animationClass === "swipe-left" && (
                    <div className="absolute inset-0 bg-warning-100/80 rounded-3xl flex items-center justify-center z-10 animate-in fade-in duration-200">
                      <div className="text-center">
                        <X className="h-24 w-24 text-warning-300 mx-auto mb-2" strokeWidth={3} />
                        <p className="text-xl font-bold text-warning-300">Still Learning</p>
                      </div>
                    </div>
                  )}
                  {animationClass === "swipe-right" && (
                    <div className="absolute inset-0 bg-success-100/80 rounded-3xl flex items-center justify-center z-10 animate-in fade-in duration-200">
                      <div className="text-center">
                        <Check className="h-24 w-24 text-success-300 mx-auto mb-2" strokeWidth={3} />
                        <p className="text-xl font-bold text-success-300">Got it!</p>
                      </div>
                    </div>
                  )}

                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-auto">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary-100 text-primary-700 border-0">{currentCard.level}</Badge>
                      <Badge className="bg-gray-100 text-gray-600 border-0">{currentCard.partOfSpeech}</Badge>
                      {knownCards.has(currentCard.id) && <Badge className="bg-success-100 text-success-300 border-0">Known</Badge>}
                      {learningCards.has(currentCard.id) && <Badge className="bg-warning-100 text-warning-300 border-0">Learning</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={(e) => { e.stopPropagation(); toggleStar() }}>
                      <Star className={`h-6 w-6 transition-colors ${starredCards.has(currentCard.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`} />
                    </Button>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col items-center justify-center py-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center">{frontContent.main}</h1>
                    <p className="text-xl text-gray-500 mb-6">{frontContent.sub}</p>

                    <Button variant="outline" size="lg" className="gap-2 rounded-full px-6 bg-transparent" onClick={(e) => { e.stopPropagation(); speakText(currentCard.word) }}>
                      <Volume2 className="h-5 w-5" /> Listen
                    </Button>
                  </div>

                  {/* Bottom hint */}
                  <div className="text-center">
                    {showHint && currentCard.examples[0] && (
                      <p className="text-sm text-gray-400 italic mb-2">Hint: "{currentCard.examples[0].en.substring(0, 30)}..."</p>
                    )}
                    <p className="text-sm text-gray-400">Click or press Space to flip</p>
                  </div>
                </Card>

                {/* Back */}
                <Card className="flashcard-face flashcard-back p-8 bg-gradient-to-br from-primary-50 to-white rounded-3xl shadow-2xl border-0 flex flex-col h-[500px] overflow-y-auto scrollbar-hide">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary-100 text-primary-700 border-0">{currentCard.level}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={(e) => { e.stopPropagation(); toggleStar() }}>
                      <Star className={`h-6 w-6 ${starredCards.has(currentCard.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </Button>
                  </div>

                  {/* Answer content */}
                  <div className="flex-1">
                    <div className="text-center mb-6">
                      <h2 className="text-4xl font-bold text-gray-900 mb-2">{backContent.main}</h2>
                      <p className="text-lg text-gray-500">{backContent.sub}</p>
                    </div>

                    {/* Word info (when showing definition first, show word here) */}
                    {showDefinitionFirst && (
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-white" onClick={(e) => { e.stopPropagation(); speakText(currentCard.word) }}>
                          <Volume2 className="h-4 w-4" /> {currentCard.pronunciation}
                        </Button>
                      </div>
                    )}

                    {/* Examples */}
                    {backContent.examples.length > 0 && (
                      <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold uppercase text-primary-700 mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4" /> Examples
                        </h3>
                        <div className="space-y-3">
                          {backContent.examples.map((ex, idx) => (
                            <div key={idx} className="group">
                              <p className="text-gray-800 flex items-center gap-2">
                                <span className="text-primary-500">→</span>
                                <span className="italic">"{ex.en}"</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); speakText(ex.en) }}>
                                  <Volume2 className="h-3.5 w-3.5" />
                                </Button>
                              </p>
                              <p className="text-gray-500 text-sm ml-5">"{ex.vi}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shadowing button */}
                  <div className="mt-4">
                    <Button variant="outline" className="w-full gap-2 rounded-xl h-12 bg-white" onClick={(e) => { e.stopPropagation(); setShadowingOpen(true); setCurrentSentence(0) }}>
                      <Mic className="h-5 w-5" /> Practice Speaking
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={markAsLearning}
              className="gap-3 h-14 px-8 rounded-2xl border-2 border-warning-200 bg-warning-50 hover:bg-warning-100 text-warning-700"
            >
              <X className="h-6 w-6" /> Still Learning
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHint(!showHint)}
              className="h-14 w-14 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <Lightbulb className={`h-6 w-6 ${showHint ? "text-yellow-500" : "text-gray-400"}`} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={markAsKnown}
              className="gap-3 h-14 px-8 rounded-2xl border-2 border-success-200 bg-success-100 hover:bg-success-100 text-success-300"
            >
              <Check className="h-6 w-6" /> Got it!
            </Button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Space</kbd> flip ·
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">←</kbd> prev ·
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">→</kbd> next ·
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">Shift+←</kbd> learning ·
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">Shift+→</kbd> known
            </p>
          </div>
        </div>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Study Settings</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showDefinitionFirst ? <Eye className="h-5 w-5 text-primary-600" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
                  <div>
                    <p className="font-medium">Show definition first</p>
                    <p className="text-sm text-gray-500">See Vietnamese meaning, guess the word</p>
                  </div>
                </div>
                <Button variant={showDefinitionFirst ? "default" : "outline"} size="sm" onClick={() => setShowDefinitionFirst(!showDefinitionFirst)}>
                  {showDefinitionFirst ? "On" : "Off"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className={`h-5 w-5 ${autoPlay ? "text-primary-600" : "text-gray-400"}`} />
                  <div>
                    <p className="font-medium">Auto-play pronunciation</p>
                    <p className="text-sm text-gray-500">Hear the word automatically</p>
                  </div>
                </div>
                <Button variant={autoPlay ? "default" : "outline"} size="sm" onClick={() => setAutoPlay(!autoPlay)}>
                  {autoPlay ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Shadowing Dialog */}
        <Dialog open={shadowingOpen} onOpenChange={setShadowingOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle className="text-xl font-bold">Speaking Practice</DialogTitle></DialogHeader>
            {currentCard && currentCard.examples.length > 0 && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <Button size="icon" variant="outline" onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))} disabled={currentSentence === 0} className="rounded-full">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">Sentence {currentSentence + 1} / {currentCard.examples.length}</span>
                  <Button size="icon" variant="outline" onClick={() => setCurrentSentence(Math.min(currentCard.examples.length - 1, currentSentence + 1))} disabled={currentSentence === currentCard.examples.length - 1} className="rounded-full">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <Card className="p-6 bg-primary-50 border-0">
                  <p className="text-xl text-gray-900 mb-3">{currentCard.examples[currentSentence]?.en}</p>
                  <p className="text-gray-500">{currentCard.examples[currentSentence]?.vi}</p>
                </Card>

                <div className="flex flex-col items-center gap-4">
                  <Button size="lg" variant={isRecording ? "destructive" : "default"} onClick={() => setIsRecording(!isRecording)} className="h-20 w-20 rounded-full">
                    {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                  <p className="text-sm text-gray-500">{isRecording ? "Recording... Click to stop" : "Click to record"}</p>
                </div>

                <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => speakText(currentCard.examples[currentSentence]?.en || "")}>
                  <Volume2 className="h-4 w-4" /> Play Original
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Session Complete Dialog */}
        <Dialog open={sessionComplete} onOpenChange={setSessionComplete}>
          <DialogContent className="max-w-lg">
            <VisuallyHidden>
              <DialogTitle>Session Complete</DialogTitle>
            </VisuallyHidden>
            <div className="text-center py-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Session Complete!</h2>
              <p className="text-gray-500 mb-8">Great job! Here's your progress:</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 bg-success-100 border-0">
                  <Check className="h-8 w-8 text-success-300 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-success-300">{knownCards.size}</p>
                  <p className="text-sm text-success-300">Known</p>
                </Card>
                <Card className="p-4 bg-warning-100 border-0">
                  <Target className="h-8 w-8 text-warning-300 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-warning-300">{learningCards.size}</p>
                  <p className="text-sm text-warning-300">Still Learning</p>
                </Card>
              </div>

              <div className="space-y-3">
                {learningCards.size > 0 && (
                  <Button onClick={studyLearningOnly} className="w-full h-12 gap-2 rounded-xl">
                    <Play className="h-5 w-5" /> Study {learningCards.size} Learning Cards
                  </Button>
                )}
                <Button onClick={resetSession} variant="outline" className="w-full h-12 gap-2 rounded-xl bg-transparent">
                  <RotateCcw className="h-5 w-5" /> Start Over
                </Button>
                <Button onClick={() => router.push("/notebook")} variant="ghost" className="w-full h-12 gap-2 rounded-xl">
                  <ArrowLeft className="h-5 w-5" /> Back to Notebook
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
