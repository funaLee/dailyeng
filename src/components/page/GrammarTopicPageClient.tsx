"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Flame, BookOpen, ChevronLeft } from "lucide-react"
import { GrammarFlashcardStack } from "@/components/learning/GrammarFlashcardStack"
import { GrammarPracticeMode } from "@/components/learning/GrammarPracticeMode"

interface GrammarTopicPageClientProps {
  topicId: string
  topic: {
    id: string
    title: string
    description: string
    level: string
  }
  grammarNotes: any[]
}

export default function GrammarTopicPageClient({
  topicId,
  topic,
  grammarNotes,
}: GrammarTopicPageClientProps) {
  const router = useRouter()
  const [learningPhase, setLearningPhase] = useState<"study" | "practice">("study")
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)

  // Track status for each grammar point
  const [noteStatuses, setNoteStatuses] = useState<Record<string, string>>({})

  const handleRate = (noteId: string, rating: string) => {
    setNoteStatuses(prev => ({
      ...prev,
      [noteId]: rating
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "again": return "bg-red-500"
      case "hard": return "bg-orange-500"
      case "good": return "bg-yellow-500"
      case "easy": return "bg-green-500"
      case "master": return "bg-blue-500"
      default: return "bg-slate-200"
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4 h-[calc(100vh-80px)] flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2 -ml-2 text-slate-500 hover:text-slate-900"
            onClick={() => router.push('/grammar')}
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Grammar Hub
          </Button>

          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
            {topic.title}
          </h1>
        </div>

        {/* Level/Mode Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border-2 border-border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Mode:</span>
            <div className="flex gap-2">
              <Button
                variant={learningPhase === "study" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearningPhase("study")}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" /> Learn
              </Button>
              <Button
                variant={learningPhase === "practice" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearningPhase("practice")}
                className="gap-2"
              >
                <Flame className="h-4 w-4" /> Practice
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          {learningPhase === "study" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
              {/* Left: Grammar Points List */}
              <div className="md:col-span-4 lg:col-span-3 bg-white rounded-xl border-2 border-border shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-3 border-b border-border bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 text-lg">Grammar Points</h3>
                  <span className="text-[12px] bg-white px-2 py-0.5 rounded-full border border-border text-slate-500">{grammarNotes.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {grammarNotes.map((note, idx) => (
                    <button
                      key={note.id}
                      onClick={() => setCurrentNoteIndex(idx)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center justify-between group text-md ${idx === currentNoteIndex
                        ? "bg-primary-50 text-primary-700 font-semibold ring-1 ring-primary-200"
                        : "hover:bg-slate-50 text-slate-600"
                        }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${noteStatuses[note.id] ? getStatusColor(noteStatuses[note.id]) : "bg-slate-200"}`} />
                        <span className="truncate">{note.title}</span>
                      </div>
                      {idx === currentNoteIndex && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Flashcards */}
              <div className="md:col-span-8 lg:col-span-9 h-full flex flex-col">
                <GrammarFlashcardStack
                  items={grammarNotes}
                  currentIndex={currentNoteIndex}
                  onIndexChange={setCurrentNoteIndex}
                  onRate={handleRate}
                  onComplete={() => setLearningPhase("practice")}
                />
              </div>
            </div>
          ) : (
            <GrammarPracticeMode />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
