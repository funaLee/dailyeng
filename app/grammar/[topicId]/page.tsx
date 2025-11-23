"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuizSection } from "@/components/vocab/quiz-section"
import { TranslateSpeakLab } from "@/components/vocab/translate-speak-lab"
import { ListeningSection } from "@/components/vocab/listening-section"
import { ReadingSection } from "@/components/vocab/reading-section"
import { mockGrammar, mockQuizzes, mockListeningTasks, mockReadingPassages } from "@/lib/mock-data"
import { ArrowLeft, BookMarked, ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, Lock } from "lucide-react"
import Link from "next/link"

type TabType = "learn" | "translate" | "listening" | "reading" | "writing" | "quiz"

const STEPS: { id: TabType; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "translate", label: "Translate" },
  { id: "listening", label: "Listening" },
  { id: "reading", label: "Reading" },
  { id: "writing", label: "Writing" },
  { id: "quiz", label: "Quiz" },
]

export default function GrammarTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string

  const [activeTab, setActiveTab] = useState<TabType>("learn")
  const [completedSteps, setCompletedSteps] = useState<TabType[]>([])
  const [grammarNotes, setGrammarNotes] = useState<any[]>([])
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [masterySelected, setMasterySelected] = useState(false)

  useEffect(() => {
    // Normalize topicId to handle ids like "g1" coming from the listing
    const lookupId = topicId?.startsWith("g") ? topicId.slice(1) : topicId

    let notes = mockGrammar[lookupId] || []

    // Try stripping non-digits if still empty (e.g. 'topic-1')
    if (notes.length === 0) {
      const numeric = lookupId.replace(/\D/g, "")
      if (numeric) notes = mockGrammar[numeric] || []
    }

    if (notes.length === 0) {
      console.warn("Grammar notes not found for topicId:", topicId, "lookupId:", lookupId, "available:", Object.keys(mockGrammar))
    }

    setGrammarNotes(notes)
    if (notes.length > 0) {
      setSelectedNote(notes[0])
      setCurrentNoteIndex(0)
    }
  }, [topicId])

  const topic = {
    id: topicId,
    title: topicId === "1" ? "Travel Grammar" : topicId === "2" ? "Food & Dining Grammar" : "Job Interview Grammar",
    description:
      topicId === "1"
        ? "Master grammar rules for travel conversations"
        : topicId === "2"
          ? "Learn grammar for food and dining situations"
          : "Professional grammar for job interviews",
    level: "A2",
    estimatedTime: 30,
    lessonCount: grammarNotes.length,
  }

  const handleSelectNote = (note: any, index: number) => {
    setSelectedNote(note)
    setCurrentNoteIndex(index)
    setMasterySelected(false)
  }

  const handleMasterySelect = (level: string) => {
    setMasterySelected(true)
    console.log(`[v0] Selected mastery level: ${level} for grammar: ${selectedNote?.title}`)
  }

  const handleNext = () => {
    if (currentNoteIndex < grammarNotes.length - 1) {
      const nextNote = grammarNotes[currentNoteIndex + 1]
      handleSelectNote(nextNote, currentNoteIndex + 1)
    }
  }

  const isStepUnlocked = (stepId: TabType) => {
    const stepIndex = STEPS.findIndex((s) => s.id === stepId)
    if (stepIndex === 0) return true
    const prevStep = STEPS[stepIndex - 1]
    return completedSteps.includes(prevStep.id)
  }

  const handleCompleteStep = () => {
    if (!completedSteps.includes(activeTab)) {
      setCompletedSteps([...completedSteps, activeTab])
    }
    const currentIndex = STEPS.findIndex((s) => s.id === activeTab)
    if (currentIndex < STEPS.length - 1) {
      setActiveTab(STEPS[currentIndex + 1].id)
      window.scrollTo(0, 0)
    }
  }

  const progressPercentage = Math.round((completedSteps.length / STEPS.length) * 100)

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
          <Button variant="ghost" className="gap-2 mb-4 bg-blue-50 hover:bg-blue-100 text-blue-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Grammar Hub
          </Button>
        </Link>

        <Card className="p-6 border-blue-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-blue-950">{topic.title}</h1>
              <p className="text-slate-600">{topic.description}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
                <span className="text-sm text-muted-foreground ml-1">Complete</span>
              </div>
              <div className="w-32 h-2 bg-gray-100 rounded-full ml-auto overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8 overflow-x-auto pb-4 pt-3">
        <div className="min-w-[768px] flex items-center justify-between relative px-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-200 -z-10 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isActive = activeTab === step.id
            const isUnlocked = isStepUnlocked(step.id)

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => isUnlocked && setActiveTab(step.id)}
                  disabled={!isUnlocked}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                          : isUnlocked
                            ? "bg-white border-blue-200 text-blue-600 hover:border-blue-400"
                            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isActive ? (
                    <PlayCircle className="h-5 w-5 fill-current" />
                  ) : !isUnlocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="font-semibold text-sm">{index + 1}</span>
                  )}
                </button>
                <span
                  className={`
                    text-xs font-medium transition-colors duration-300
                    ${isActive ? "text-blue-700 font-bold" : isUnlocked ? "text-slate-600" : "text-gray-400"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === "learn" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Learn Grammar</h2>
              <span className="text-sm text-muted-foreground">Step 1 of 6</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto border border-border rounded-lg p-3 bg-secondary/30">
                {grammarNotes.map((note, idx) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note, idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedNote?.id === note.id ? "bg-blue-600 text-white" : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {idx + 1}. {note.title}
                  </button>
                ))}
              </div>

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
                        onClick={handleNext}
                        disabled={currentNoteIndex === 0}
                        className="gap-2 bg-transparent"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        {masterySelected ? "Ready to continue" : "Select a mastery level to continue"}
                      </span>

                      <Button
                        onClick={handleCompleteStep}
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
                  style={{
                    width: `${grammarNotes.length > 0 ? ((currentNoteIndex + 1) / grammarNotes.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium">
                  {currentNoteIndex + 1} / {grammarNotes.length}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Finish Learning & Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "translate" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Translate Lab</h2>
              <span className="text-sm text-muted-foreground">Step 2 of 6</span>
            </div>
            <TranslateSpeakLab topicTitle={topic.title} />

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Complete Translation
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "listening" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Listening Practice</h2>
              <span className="text-sm text-muted-foreground">Step 3 of 6</span>
            </div>
            <ListeningSection topicTitle={topic.title} tasks={mockListeningTasks[topicId] || []} />

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Complete Listening
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "reading" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Reading Practice</h2>
              <span className="text-sm text-muted-foreground">Step 4 of 6</span>
            </div>
            {mockReadingPassages[topicId] ? (
              <ReadingSection passage={mockReadingPassages[topicId]} />
            ) : (
              <Card className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reading passage available</p>
              </Card>
            )}

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Submit Writing
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "writing" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Writing Practice</h2>
              <span className="text-sm text-muted-foreground">Step 5 of 6</span>
            </div>
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

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Submit Writing
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Quiz</h2>
              <span className="text-sm text-muted-foreground">Final Step</span>
            </div>
            <QuizSection items={mockQuizzes[topicId] || []} />

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Finish Lesson
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
