"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GrammarSection } from "@/components/vocab/grammar-section"
import { QuizSection } from "@/components/vocab/quiz-section"
import { TranslateSpeakLab } from "@/components/vocab/translate-speak-lab"
import { ListeningSection } from "@/components/vocab/listening-section"
import { ReadingSection } from "@/components/vocab/reading-section"
import {
  mockTopics,
  mockVocab,
  mockGrammar,
  mockQuizzes,
  mockListeningTasks,
  mockReadingPassages,
} from "@/lib/mock-data"
import type { VocabItem } from "@/types"
import { ArrowLeft, BookOpen, Lightbulb, Headphones, BookMarked, HelpCircle, Languages, Plus } from "lucide-react"
import Link from "next/link"

type TabType = "learn" | "translate" | "grammar" | "listening" | "reading" | "quiz"

export default function TopicDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const topicId = params.topicId as string
  const selectedWordId = searchParams.get("w")

  const [activeTab, setActiveTab] = useState<TabType>("learn")
  const [topic, setTopic] = useState<any>(null)
  const [vocab, setVocab] = useState<VocabItem[]>([])
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null)
  const [savedFlashcards, setSavedFlashcards] = useState<VocabItem[]>([])
  const wordListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const foundTopic = mockTopics.find((t) => t.id === topicId)
    setTopic(foundTopic)
    const topicVocab = mockVocab[topicId] || []
    setVocab(topicVocab)

    if (selectedWordId) {
      const word = topicVocab.find((w) => w.id === selectedWordId)
      if (word) {
        setSelectedWord(word)
      } else if (topicVocab.length > 0) {
        setSelectedWord(topicVocab[0])
      }
    } else if (topicVocab.length > 0) {
      setSelectedWord(topicVocab[0])
    }
  }, [topicId, selectedWordId])

  const handleSelectWord = (word: VocabItem) => {
    setSelectedWord(word)
    router.push(`/vocab/${topicId}?w=${word.id}`, { scroll: false })
  }

  const handleAddFlashcard = (word: VocabItem) => {
    setSavedFlashcards((prev) => {
      const exists = prev.some((w) => w.id === word.id)
      if (exists) {
        return prev.filter((w) => w.id !== word.id)
      }
      return [...prev, word]
    })
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
      </div>
    )
  }

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: "learn", label: "Learn", icon: <BookOpen className="h-4 w-4" /> },
    { id: "translate", label: "Translate & Speak", icon: <Languages className="h-4 w-4" /> },
    { id: "grammar", label: "Grammar", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "listening", label: "Listening", icon: <Headphones className="h-4 w-4" /> },
    { id: "reading", label: "Reading", icon: <BookMarked className="h-4 w-4" /> },
    { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-4 w-4" /> },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/vocab">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Topics
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">
              {vocab.length} words • {topic.estimatedTime} min
            </p>
            <p className="text-xs text-muted-foreground mt-1">Level: {topic.level}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border overflow-x-auto">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "learn" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Vocabulary</h2>
              {savedFlashcards.length > 0 && (
                <Link href="/notebook">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    View {savedFlashcards.length} Saved
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Word List */}
              <div
                ref={wordListRef}
                className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto border border-border rounded-lg p-3"
              >
                {vocab.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No words available</p>
                  </div>
                ) : (
                  vocab.map((word) => (
                    <button
                      key={word.id}
                      onClick={() => handleSelectWord(word)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        selectedWord?.id === word.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      {word.word}
                    </button>
                  ))
                )}
              </div>

              {/* Right Column: Word Details + Grammar */}
              <div className="lg:col-span-2 space-y-6">
                {selectedWord ? (
                  <>
                    {/* Word Details Card */}
                    <Card className="p-6 space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold mb-2">{selectedWord.word}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{selectedWord.pronunciation}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">MEANING</p>
                          <p className="text-sm">{selectedWord.meaning}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">VIETNAMESE</p>
                          <p className="text-sm">{selectedWord.vietnameseMeaning}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">PART OF SPEECH</p>
                        <span className="inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                          {selectedWord.partOfSpeech}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">COLLOCATIONS</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedWord.collocations.map((collocation, idx) => (
                            <span key={idx} className="px-2 py-1 rounded bg-blue-500/10 text-blue-700 text-xs">
                              {collocation}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">EXAMPLE</p>
                        <p className="text-sm italic mb-2">"{selectedWord.exampleSentence}"</p>
                        <p className="text-sm text-muted-foreground">"{selectedWord.exampleTranslation}"</p>
                      </div>

                      <Button
                        onClick={() => handleAddFlashcard(selectedWord)}
                        variant={savedFlashcards.some((w) => w.id === selectedWord.id) ? "default" : "outline"}
                        className="w-full gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {savedFlashcards.some((w) => w.id === selectedWord.id)
                          ? "Added to Flashcards"
                          : "Add to Flashcards"}
                      </Button>
                    </Card>

                    {/* Micro-grammar Accordion */}
                    <GrammarSection notes={mockGrammar[topicId] || []} />
                  </>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Select a word to view details</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "translate" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Translate & Speak Lab</h2>
            <TranslateSpeakLab topicTitle={topic.title} />
          </div>
        )}

        {activeTab === "grammar" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Grammar Notes</h2>
            <GrammarSection notes={mockGrammar[topicId] || []} />
          </div>
        )}

        {activeTab === "listening" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Listening Practice</h2>
            <ListeningSection topicTitle={topic.title} tasks={mockListeningTasks[topicId] || []} />
          </div>
        )}

        {activeTab === "reading" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reading Practice</h2>
            {mockReadingPassages[topicId] ? (
              <ReadingSection passage={mockReadingPassages[topicId]} />
            ) : (
              <Card className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reading passage available</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Quiz</h2>
            <QuizSection items={mockQuizzes[topicId] || []} />
          </div>
        )}
      </div>
    </div>
  )
}
