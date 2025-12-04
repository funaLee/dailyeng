"use client"

import { Card } from "@/components/ui/card"
import { Info, Clock, BookOpen, Target, Calendar, CheckCircle2, Users, Award, FolderOpen, Layers } from "lucide-react"

interface LessonInfo {
  id: string
  title: string
  description: string
  duration: string
  type: string
}

interface SubTopicInfo {
  id: string
  title: string
  description: string
  lessons: LessonInfo[]
}

interface TopicInfo {
  id: string
  title: string
  description: string
  subTopics: SubTopicInfo[]
}

interface CourseInfoViewProps {
  courseName: string
  courseDescription: string
  totalHours: string
  totalLessons: number
  totalTopics: number
  totalSubTopics: number
  level: string
  targetAudience: string
  objectives: string[]
  topics: TopicInfo[]
}

export function CourseInfoView({
  courseName,
  courseDescription,
  totalHours,
  totalLessons,
  totalTopics,
  totalSubTopics,
  level,
  targetAudience,
  objectives,
  topics,
}: CourseInfoViewProps) {
  return (
    <Card className="rounded-3xl border-[1.4px] border-accent-200 bg-card overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="flex items-center gap-3 text-white">
          <Info className="h-6 w-6" />
          <h2 className="text-xl font-bold">Course Information</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Course Overview */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-accent-500" />
            <p className="text-sm font-medium text-muted-foreground">Course</p>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">{courseName}</h3>
          <p className="text-muted-foreground leading-relaxed">{courseDescription}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-[1.4px] border-accent-200">
            <Clock className="h-5 w-5 text-accent-500 mb-2" />
            <p className="text-2xl font-bold text-accent-700">{totalHours}</p>
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-[1.4px] border-accent-200">
            <FolderOpen className="h-5 w-5 text-accent-500 mb-2" />
            <p className="text-2xl font-bold text-accent-700">{totalTopics}</p>
            <p className="text-xs text-muted-foreground">Topics</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-[1.4px] border-accent-200">
            <BookOpen className="h-5 w-5 text-accent-500 mb-2" />
            <p className="text-2xl font-bold text-accent-700">{totalSubTopics}</p>
            <p className="text-xs text-muted-foreground">Sub-topics</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-[1.4px] border-accent-200">
            <Calendar className="h-5 w-5 text-accent-500 mb-2" />
            <p className="text-2xl font-bold text-accent-700">{totalLessons}</p>
            <p className="text-xs text-muted-foreground">Lessons</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-[1.4px] border-accent-200">
            <Award className="h-5 w-5 text-accent-500 mb-2" />
            <p className="text-2xl font-bold text-accent-700">{level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-[1.4px] border-accent-200">
            <Users className="h-5 w-5 text-accent-500 mb-2" />
            <p className="text-sm font-bold text-accent-700 line-clamp-1">{targetAudience}</p>
            <p className="text-xs text-muted-foreground">Target</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent-500" />
            Learning Objectives
          </h4>
          <div className="space-y-2">
            {objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-accent-50">
                <CheckCircle2 className="h-5 w-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-500" />
            Complete Course Syllabus
          </h4>
          <div className="space-y-6">
            {topics.map((topic, topicIndex) => (
              <div key={topic.id} className="rounded-2xl border-[1.4px] border-accent-200 overflow-hidden">
                {/* Topic Header - accent color */}
                <div className="p-4 bg-gradient-to-r from-accent-100 to-accent-50">
                  <h5 className="font-bold text-foreground flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-accent-500 text-white text-sm flex items-center justify-center">
                      {topicIndex + 1}
                    </span>
                    <FolderOpen className="h-4 w-4 text-accent-500" />
                    {topic.title}
                  </h5>
                  <p className="text-sm text-muted-foreground mt-1 ml-9">{topic.description}</p>
                </div>

                {/* Sub-topics */}
                <div className="divide-y divide-border">
                  {topic.subTopics.map((subTopic, subTopicIndex) => (
                    <div key={subTopic.id} className="p-4">
                      {/* Sub-topic Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="w-6 h-6 rounded-full bg-accent-400 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {topicIndex + 1}.{subTopicIndex + 1}
                        </span>
                        <div>
                          <h6 className="font-semibold text-foreground flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-accent-500" />
                            {subTopic.title}
                          </h6>
                          <p className="text-xs text-muted-foreground mt-0.5">{subTopic.description}</p>
                        </div>
                      </div>

                      {/* Lessons in Sub-topic */}
                      <div className="ml-9 space-y-2">
                        {subTopic.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-3 rounded-xl bg-accent-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-foreground text-sm">{lesson.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs ml-4">
                                <span className="px-2 py-0.5 rounded-full bg-accent-200 text-accent-700 text-xs capitalize">
                                  {lesson.type}
                                </span>
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
