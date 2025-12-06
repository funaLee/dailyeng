"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Languages,
  Headphones,
  BookText,
  PenTool,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  PlayCircle,
} from "lucide-react"

interface Lesson {
  id: string
  title: string
  duration?: string
  status: "not_started" | "in_progress" | "completed"
  progress?: number
  score?: number
}

interface LessonGroup {
  id: string
  title: string
  type: "vocabulary" | "translate" | "listening" | "reading" | "writing" | "quiz"
  lessons: Lesson[]
}

interface LessonsContentViewProps {
  subTopicTitle?: string
  lessonGroups: LessonGroup[]
  onLessonClick?: (lessonId: string) => void
}

const lessonTypeConfig = {
  vocabulary: {
    icon: BookOpen,
  },
  translate: {
    icon: Languages,
  },
  listening: {
    icon: Headphones,
  },
  reading: {
    icon: BookText,
  },
  writing: {
    icon: PenTool,
  },
  quiz: {
    icon: HelpCircle,
  },
}

export function LessonsContentView({ subTopicTitle, lessonGroups, onLessonClick }: LessonsContentViewProps) {
  // Find the global first not started lesson
  let globalFirstNotStartedId: string | null = null
  for (const group of lessonGroups) {
    for (const lesson of group.lessons) {
      if (lesson.status === "not_started") {
        globalFirstNotStartedId = lesson.id
        break
      }
    }
    if (globalFirstNotStartedId) break
  }

  return (
    <Card className="rounded-3xl border-[1.4px] border-primary-200 bg-white overflow-hidden shadow-lg">
      <div className="relative p-6 bg-gradient-to-r from-primary-500 to-primary-600 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-white/10 rounded-full translate-y-1/2" />
        <Sparkles className="absolute top-4 right-8 h-6 w-6 text-white/30" />

        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/80 font-medium">Sub-topic Lessons</p>
            <h2 className="text-2xl font-bold text-white">{subTopicTitle || "Course Lessons"}</h2>
          </div>
        </div>
      </div>

      {/* Lessons grouped by type */}
      <div className="p-6 space-y-6">
        {lessonGroups.map((group) => {
          const config = lessonTypeConfig[group.type] || lessonTypeConfig.vocabulary
          const Icon = config.icon

          return (
            <div key={group.id} className="rounded-2xl border-[1.4px] border-primary-200 overflow-hidden">
              {/* Group Header - primary color */}
              <div className="px-5 py-4 bg-primary-50 border-b-[1.4px] border-primary-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-primary-600">{group.title}</h3>
                  <span className="ml-auto text-sm text-muted-foreground">{group.lessons.length} lessons</span>
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-border">
                {group.lessons.map((lesson) => {
                  const isFirstNotStarted = lesson.id === globalFirstNotStartedId

                  return (
                    <div key={lesson.id} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {lesson.status === "completed" ? (
                            <div className="p-2 rounded-full bg-success-100">
                              <CheckCircle2 className="h-5 w-5 text-success-500" />
                            </div>
                          ) : lesson.status === "in_progress" ? (
                            <div className="p-2 rounded-full bg-warning-100">
                              <PlayCircle className="h-5 w-5 text-warning-500" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-full bg-muted">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div>
                          <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            {lesson.duration && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {lesson.duration}
                              </span>
                            )}
                            {lesson.status === "completed" && lesson.score && (
                              <span className="text-sm text-success-600 font-medium">Score: {lesson.score}%</span>
                            )}
                            {lesson.status === "in_progress" && lesson.progress && (
                              <span className="text-sm text-warning-600 font-medium">{lesson.progress}% complete</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        {lesson.status === "completed" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLessonClick?.(lesson.id)}
                            className="rounded-full border-primary-300 text-primary-600 hover:bg-primary-50"
                          >
                            Review
                          </Button>
                        ) : lesson.status === "in_progress" ? (
                          <Button
                            size="sm"
                            onClick={() => onLessonClick?.(lesson.id)}
                            className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md"
                          >
                            Continue
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        ) : isFirstNotStarted ? (
                          <Button
                            size="sm"
                            onClick={() => onLessonClick?.(lesson.id)}
                            className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md"
                          >
                            Get started
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" disabled className="rounded-full text-muted-foreground">
                            Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
