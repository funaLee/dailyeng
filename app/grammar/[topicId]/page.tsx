"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopicHeader, CourseOutlineSidebar, LessonGroup } from "@/components/hub"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { mockGrammar } from "@/lib/mock-data"

// Mock lesson data for grammar topics
const mockGrammarLessonGroups = [
  {
    id: "grammar-learning",
    title: "Grammar Learning",
    lessons: [
      { id: "grammar-1", title: "Grammar Pack 1", duration: "30 min", status: "completed" as const, score: 90 },
      { id: "grammar-2", title: "Grammar Pack 2", duration: "30 min", status: "in_progress" as const, progress: 60 },
      { id: "grammar-3", title: "Grammar Rules", duration: "30 min", status: "not_started" as const },
    ],
  },
  {
    id: "translate-practice",
    title: "Translate Practice",
    lessons: [
      { id: "translate-1", title: "Translate Practice 1", duration: "30 min", status: "not_started" as const },
      { id: "translate-2", title: "Translate Practice 2", duration: "30 min", status: "not_started" as const },
      { id: "translate-3", title: "Translate Practice 3", duration: "30 min", status: "not_started" as const },
    ],
  },
  {
    id: "listening-practice",
    title: "Listening Practice",
    lessons: [
      { id: "listening-1", title: "Listening Practice 1", duration: "30 min", status: "not_started" as const },
      { id: "listening-2", title: "Listening Practice 2", duration: "30 min", status: "not_started" as const },
    ],
  },
  {
    id: "reading-practice",
    title: "Reading Practice",
    lessons: [
      { id: "reading-1", title: "Reading Practice 1", duration: "30 min", status: "not_started" as const },
      { id: "reading-2", title: "Reading Practice 2", duration: "30 min", status: "not_started" as const },
    ],
  },
  {
    id: "writing-practice",
    title: "Writing Practice",
    lessons: [
      { id: "writing-1", title: "Writing Practice 1", duration: "30 min", status: "not_started" as const },
      { id: "writing-2", title: "Writing Practice 2", duration: "30 min", status: "not_started" as const },
    ],
  },
  {
    id: "quiz-practice",
    title: "Quiz Practice",
    lessons: [
      { id: "quiz-1", title: "Quiz Practice 1", duration: "30 min", status: "not_started" as const },
      { id: "quiz-2", title: "Quiz Practice 2", duration: "30 min", status: "not_started" as const },
    ],
  },
]

// Mock course outline sections for grammar
const mockGrammarCourseSections = [
  {
    id: "tenses",
    title: "Tenses",
    isExpanded: true,
    lessons: [
      { id: "present-simple", title: "Present Simple" },
      { id: "present-continuous", title: "Present Continuous" },
      { id: "past-simple", title: "Past Simple" },
      { id: "future-simple", title: "Future Simple" },
    ],
  },
  {
    id: "conditionals",
    title: "Conditionals",
    isExpanded: false,
    lessons: [
      { id: "zero-conditional", title: "Zero Conditional" },
      { id: "first-conditional", title: "First Conditional" },
      { id: "second-conditional", title: "Second Conditional" },
    ],
  },
  {
    id: "passive-voice",
    title: "Passive Voice",
    isExpanded: false,
    lessons: [
      { id: "passive-present", title: "Present Passive" },
      { id: "passive-past", title: "Past Passive" },
    ],
  },
]

export default function GrammarTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string

  const [activeLesson, setActiveLesson] = useState<string>("present-simple")
  const [lessonGroups, setLessonGroups] = useState(mockGrammarLessonGroups)
  const [grammarNotes, setGrammarNotes] = useState<any[]>([])

  useEffect(() => {
    const lookupId = topicId?.startsWith("g") ? topicId.slice(1) : topicId
    let notes = mockGrammar[lookupId] || []
    if (notes.length === 0) {
      const numeric = lookupId.replace(/\D/g, "")
      if (numeric) notes = mockGrammar[numeric] || []
    }
    setGrammarNotes(notes)
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
  }

  const handleLessonSelect = (lessonId: string) => {
    setActiveLesson(lessonId)
  }

  const handleStartLesson = (lessonId: string) => {
    router.push(`/grammar/${topicId}/lesson/${lessonId}`)
  }

  if (grammarNotes.length === 0) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-96 bg-muted animate-pulse rounded-2xl" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Header */}
        <TopicHeader
          title={topic.title}
          description={topic.description}
          wordCount={grammarNotes.length}
          duration="30 mins"
          levels={[topic.level, "B1"]}
          backUrl="/grammar"
          backLabel="Back to Grammar Hub"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Course Outline */}
          <div className="lg:col-span-1">
            <CourseOutlineSidebar
              sections={mockGrammarCourseSections}
              activeLesson={activeLesson}
              onLessonSelect={handleLessonSelect}
              showGrades={true}
              showInfo={true}
            />
          </div>

          {/* Right Content - Lesson Groups */}
          <div className="lg:col-span-3 space-y-6">
            {lessonGroups.map((group) => (
              <LessonGroup
                key={group.id}
                title={group.title}
                lessons={group.lessons}
                onLessonClick={handleStartLesson}
              />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
