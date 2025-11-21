"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuizSection } from "@/components/vocab/quiz-section"
import { TranslateSpeakLab } from "@/components/vocab/translate-speak-lab"
import { ListeningSection } from "@/components/vocab/listening-section"
import { ReadingSection } from "@/components/vocab/reading-section"
import { mockGrammar, mockQuizzes, mockListeningTasks, mockReadingPassages } from "@/lib/mock-data"
import { ArrowLeft, BookMarked, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"

type TabType = "learn" | "translate" | "listening" | "reading" | "writing" | "quiz"

export default function GrammarTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string

  const [activeTab, setActiveTab] = useState<TabType>("learn")
  const [grammarNotes, setGrammarNotes] = useState<any[]>([])
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [masterySelected, setMasterySelected] = useState(false)

  useEffect(() => {
    let notes = mockGrammar[topicId] || []
    
    // Fallback for id format mismatches (e.g., "g1" -> "1")
    if (notes.length === 0 && topicId?.startsWith("g")) {
      const numericId = topicId.slice(1)
      notes = mockGrammar[numericId] || []
    }
    
    if (notes.length === 0) {
      // Try numeric fallback directly
      notes = mockGrammar[topicId.replace(/\D/g, "")] || []
    }
    
    if (notes.length === 0) {
      console.warn("Grammar notes not found for topicId:", topicId, "available keys:", Object.keys(mockGrammar))
    }
    
    setGrammarNotes(notes)
    if (notes.length > 0) {
      setSelectedNote(notes[0])
      setCurrentNoteIndex(0)
    }
  }, [topicId])

  const lookupId = topicId?.startsWith("g") ? topicId.slice(1) : topicId

  const topic = {
    id: topicId,
    title: lookupId === "1" ? "Travel Grammar" : lookupId === "2" ? "Food & Dining Grammar" : "Job Interview Grammar",
    description:
      lookupId === "1"
        ? "Master grammar rules for travel conversations"
        : lookupId === "2"
          ? "Learn grammar for food and dining situations"
          : "Professional grammar for job interviews",
    level: "A2",
    estimatedTime: 30,
    lessonCount: grammarNotes.length,
  }

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "learn", label: "Learn" },
    { id: "translate", label: "Translate lab" },
    { id: "listening", label: "Listening" },
    { id: "reading", label: "Reading" },
    { id: "writing", label: "Writing" },
    { id: "quiz", label: "Quiz" },
  ]

  const handleSelectNote = (note: any, index: number) => {
    setSelectedNote(note)
    setCurrentNoteIndex(index)
    setMasterySelected(false)
  }

  const handleMasterySelect = (level: string) => {
    setMasterySelected(true)
    console.log(`[v0] Selected mastery level: ${level} for grammar: ${selectedNote?.title}`)
  }

  const handlePrevious = () => {
    if (currentNoteIndex > 0) {
      const prevNote = grammarNotes[currentNoteIndex - 1]
      handleSelectNote(prevNote, currentNoteIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentNoteIndex < grammarNotes.length - 1) {
      const nextNote = grammarNotes[currentNoteIndex + 1]
      handleSelectNote(nextNote, currentNoteIndex + 1)
    }
  }

  if (grammarNotes.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/grammar">
          <Button variant="ghost" className="gap-2 mb-4 bg-blue-200 hover:bg-blue-300 text-blue-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Grammar Hub
          </Button>
        </Link>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
              <p className="text-muted-foreground">{topic.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {topic.lessonCount} lessons - {topic.estimatedTime} mins
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-secondary text-xs">{topic.level}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <label key={tab.id} className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={activeTab === tab.id}
              onChange={() => setActiveTab(tab.id)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">{tab.label}</span>
          </label>
        ))}
      </div>

      <div>
        {activeTab === "learn" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learn Grammar</h2>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Grammar Topics List */}
              <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto border border-border rounded-lg p-3 bg-secondary/30">
                {grammarNotes.map((note, idx) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note, idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedNote?.id === note.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {idx + 1}. {note.title}
                  </button>
                ))}
              </div>

              {/* Right Column: Grammar Details */}
              <div className="lg:col-span-2 space-y-6">
                {selectedNote ? (
                  <Card className="p-6 space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-4">{selectedNote.title}</h3>
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-base leading-relaxed">{selectedNote.explanation}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <p className="text-xs font-semibold text-muted-foreground mb-4">EXAMPLES</p>
                      <div className="space-y-4">
                        {selectedNote.examples.map((example: any, idx: number) => (
                          <div key={idx} className="p-4 bg-secondary/30 rounded-lg">
                            <p className="text-base font-medium mb-2">
                              <span className="text-blue-600 font-bold mr-2">{idx + 1}.</span>
                              {example.en}
                            </p>
                            <p className="text-sm text-muted-foreground ml-6">
                              <span className="font-semibold">Vietnamese:</span> {example.vi}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="text-lg font-semibold mb-4">Practice Tips</h4>
                      <ul className="space-y-2 ml-4">
                        <li className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                          <p className="text-sm">Try creating your own sentences using this grammar structure</p>
                        </li>
                        <li className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                          <p className="text-sm">Practice with the exercises in the other tabs</p>
                        </li>
                        <li className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                          <p className="text-sm">Take the quiz to test your understanding</p>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-border pt-6">
                      <p className="text-center text-sm font-medium mb-4">How well do you understand this grammar?</p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {[
                          { label: "Brand New", color: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200" },
                          {
                            label: "Not Remembered",
                            color: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
                          },
                          {
                            label: "Normal",
                            color: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
                          },
                          { label: "Remembered", color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200" },
                          {
                            label: "Mastered",
                            color: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
                          },
                        ].map((level, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleMasterySelect(level.label)}
                            className={`px-4 py-2 rounded-full ${level.color} text-sm font-medium transition-colors border`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentNoteIndex === 0}
                        className="gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <span className="text-sm text-muted-foreground">
                        {masterySelected ? "Ready to continue" : "Select a mastery level to continue"}
                      </span>
                      
                      <Button
                        onClick={handleNext}
                        disabled={!masterySelected || currentNoteIndex === grammarNotes.length - 1}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Select a grammar topic to view details</p>
                  </Card>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${grammarNotes.length > 0 ? ((currentNoteIndex + 1) / grammarNotes.length) * 100 : 0}%` }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium">
                  {currentNoteIndex + 1} / {grammarNotes.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "translate" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Translate Lab</h2>
            <TranslateSpeakLab topicTitle={topic.title} />
          </div>
        )}

        {activeTab === "listening" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Listening Practice</h2>
            <ListeningSection topicTitle={topic.title} tasks={mockListeningTasks[lookupId] || []} />
          </div>
        )}

        {activeTab === "reading" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reading Practice</h2>
            {mockReadingPassages[lookupId] ? (
              <ReadingSection passage={mockReadingPassages[lookupId]} />
            ) : (
              <Card className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reading passage available</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "writing" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Writing Practice</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h3 className="font-semibold mb-4">Task</h3>
                <p className="text-sm mb-6">
                  Write 5 sentences using the grammar structures you learned in this lesson. Try to use different
                  examples from your own experience.
                </p>
                <h3 className="font-semibold mb-4">Your writing</h3>
                <textarea
                  className="w-full min-h-[300px] p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Start typing your response here..."
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">0 characters</span>
                  <div className="flex gap-2">
                    <Button variant="outline">Get feedback</Button>
                    <Button>Save</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Grammar points to include:</h3>
                <div className="space-y-2 mb-6">
                  {grammarNotes.map((note, idx) => (
                    <label key={note.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      <span className="text-sm">{note.title}</span>
                    </label>
                  ))}
                </div>
                <h3 className="font-semibold mb-4">Tips:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Write complete sentences</li>
                  <li>• Check your grammar structure</li>
                  <li>• Use examples from real situations</li>
                  <li>• Review the lesson before writing</li>
                </ul>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Quiz</h2>
            <QuizSection items={mockQuizzes[lookupId] || []} />
          </div>
        )}
      </div>
    </div>
  )
}
