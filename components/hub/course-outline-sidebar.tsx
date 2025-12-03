"use client"

import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight, GraduationCap, Info, BookOpen, Layers, FolderOpen } from "lucide-react"
import { useState } from "react"

interface SubTopic {
  id: string
  title: string
}

interface Topic {
  id: string
  title: string
  subTopics: SubTopic[]
  isExpanded?: boolean
}

interface CourseOutlineSidebarProps {
  courseName: string
  topics: Topic[]
  activeSubTopic?: string
  onSubTopicSelect?: (subTopicId: string) => void
  showGrades?: boolean
  showInfo?: boolean
  activeView?: "outline" | "grades" | "info"
  onViewChange?: (view: "outline" | "grades" | "info") => void
}

export function CourseOutlineSidebar({
  courseName,
  topics,
  activeSubTopic,
  onSubTopicSelect,
  showGrades = true,
  showInfo = true,
  activeView = "outline",
  onViewChange,
}: CourseOutlineSidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<string[]>(topics.filter((t) => t.isExpanded).map((t) => t.id))

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <Card
      className={`rounded-3xl border-2 bg-card overflow-hidden shadow-lg ${
        activeView === "grades"
          ? "border-secondary-200"
          : activeView === "info"
            ? "border-accent-200"
            : "border-primary-200"
      }`}
    >
      <div
        className={`p-4 bg-gradient-to-r ${
          activeView === "grades"
            ? "from-secondary-500 to-secondary-600"
            : activeView === "info"
              ? "from-accent-500 to-accent-600"
              : "from-primary-500 to-primary-600"
        }`}
      >
        <div className="flex items-center gap-2 text-white">
          <Layers className="h-5 w-5" />
          <div>
            <p
              className={`text-xs ${
                activeView === "grades"
                  ? "text-secondary-100"
                  : activeView === "info"
                    ? "text-accent-100"
                    : "text-primary-100"
              }`}
            >
              Course
            </p>
            <h3 className="font-bold text-lg">{courseName}</h3>
          </div>
        </div>
      </div>

      {/* Course Outline - Topics > Sub-topics only (no lessons) */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Course Outline</p>
        <div className="space-y-2">
          {topics.map((topic) => {
            const isExpanded = expandedTopics.includes(topic.id)

            return (
              <div key={topic.id}>
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-semibold">{topic.title}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-1 pl-2">
                    {topic.subTopics.map((subTopic) => {
                      const isActive = activeSubTopic === subTopic.id

                      return (
                        <button
                          key={subTopic.id}
                          onClick={() => {
                            onSubTopicSelect?.(subTopic.id)
                            onViewChange?.("outline")
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all border-l-4 ${
                            isActive
                              ? "bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-900/20 text-primary-700 dark:text-primary-300 border-l-primary-400 font-medium"
                              : "border-l-transparent hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm">{subTopic.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {showGrades && (
        <>
          <div className="border-t-2 border-primary-100 dark:border-primary-800" />
          <div className="p-3">
            <button
              onClick={() => onViewChange?.("grades")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === "grades"
                  ? "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-md"
                  : "hover:bg-secondary-50 dark:hover:bg-secondary-900/30 text-foreground hover:text-secondary-700 dark:hover:text-secondary-300"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold">Grades</span>
            </button>
          </div>
        </>
      )}

      {showInfo && (
        <>
          <div className="border-t-2 border-primary-100 dark:border-primary-800" />
          <div className="p-3">
            <button
              onClick={() => onViewChange?.("info")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === "info"
                  ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md"
                  : "hover:bg-accent-50 dark:hover:bg-accent-900/30 text-foreground hover:text-accent-700 dark:hover:text-accent-300"
              }`}
            >
              <Info className="h-5 w-5" />
              <span className="font-semibold">Course Information</span>
            </button>
          </div>
        </>
      )}
    </Card>
  )
}
