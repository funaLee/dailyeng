"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopicHeader, CourseOutlineSidebar, LessonGroup } from "@/components/hub"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface Lesson {
  id: string
  title: string
  duration: string
  status: "not_started" | "in_progress" | "completed"
  score?: number
  progress?: number
}

interface LessonGroupData {
  id: string
  title: string
  lessons: Lesson[]
}

interface CourseSection {
  id: string
  title: string
  isExpanded?: boolean
  lessons: { id: string; title: string }[]
}

interface TopicData {
  id: string
  title: string
  description: string
  level: string
}

interface GrammarTopicPageClientProps {
  topicId: string
  topic: TopicData
  grammarNotes: any[]
  lessonGroups: LessonGroupData[]
  courseSections: CourseSection[]
}

export default function GrammarTopicPageClient({
  topicId,
  topic,
  grammarNotes,
  lessonGroups,
  courseSections,
}: GrammarTopicPageClientProps) {
  const router = useRouter()
  const [activeLesson, setActiveLesson] = useState<string>("present-simple")

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
              courseName={topic.title}
              topics={courseSections.map((section) => ({
                id: section.id,
                title: section.title,
                subTopics: section.lessons,
              }))}
              activeSubTopic={activeLesson}
              onSubTopicSelect={handleLessonSelect}
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
