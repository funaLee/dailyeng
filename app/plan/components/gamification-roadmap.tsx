"use client"

import { useState } from "react"
import {
  BookOpen,
  Mic,
  PenTool,
  Headphones,
  GraduationCap,
  Star,
  Trophy,
  Lock,
  CheckCircle2,
  Play,
  Clock,
  Target,
  Zap,
  X,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Lesson {
  id: string
  title: string
  type: "vocab" | "grammar" | "speaking" | "listening" | "reading"
  duration: string
  completed: boolean
}

interface Module {
  id: string
  number: number
  title: string
  description: string
  status: "completed" | "current" | "locked"
  progress: number
  xp: number
  lessons: Lesson[]
  score?: number
}

// Mock data for 10 modules
const mockModules: Module[] = [
  {
    id: "m1",
    number: 1,
    title: "Foundation",
    description: "Basic grammar and essential vocabulary",
    status: "completed",
    progress: 100,
    xp: 150,
    score: 92,
    lessons: [
      { id: "l1", title: "Basic Greetings", type: "vocab", duration: "15 min", completed: true },
      { id: "l2", title: "Present Simple", type: "grammar", duration: "20 min", completed: true },
      { id: "l3", title: "Introduce Yourself", type: "speaking", duration: "25 min", completed: true },
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Daily Life",
    description: "Everyday conversations and routines",
    status: "completed",
    progress: 100,
    xp: 180,
    score: 88,
    lessons: [
      { id: "l4", title: "Daily Routines", type: "vocab", duration: "15 min", completed: true },
      { id: "l5", title: "Present Continuous", type: "grammar", duration: "20 min", completed: true },
      { id: "l6", title: "Describe Your Day", type: "speaking", duration: "25 min", completed: true },
    ],
  },
  {
    id: "m3",
    number: 3,
    title: "Travel & Places",
    description: "Navigation and travel vocabulary",
    status: "completed",
    progress: 100,
    xp: 200,
    score: 95,
    lessons: [
      { id: "l7", title: "Travel Vocabulary", type: "vocab", duration: "20 min", completed: true },
      { id: "l8", title: "Past Simple", type: "grammar", duration: "25 min", completed: true },
      { id: "l9", title: "At the Airport", type: "speaking", duration: "30 min", completed: true },
    ],
  },
  {
    id: "m4",
    number: 4,
    title: "Food & Dining",
    description: "Restaurant conversations and food vocabulary",
    status: "current",
    progress: 60,
    xp: 120,
    lessons: [
      { id: "l10", title: "Food & Drinks", type: "vocab", duration: "15 min", completed: true },
      { id: "l11", title: "Countable/Uncountable", type: "grammar", duration: "20 min", completed: true },
      { id: "l12", title: "Ordering Food", type: "speaking", duration: "25 min", completed: false },
      { id: "l13", title: "Restaurant Dialog", type: "listening", duration: "20 min", completed: false },
    ],
  },
  {
    id: "m5",
    number: 5,
    title: "Shopping",
    description: "Shopping dialogs and bargaining",
    status: "locked",
    progress: 0,
    xp: 0,
    lessons: [
      { id: "l14", title: "Shopping Vocabulary", type: "vocab", duration: "15 min", completed: false },
      { id: "l15", title: "Comparatives", type: "grammar", duration: "20 min", completed: false },
      { id: "l16", title: "At the Store", type: "speaking", duration: "25 min", completed: false },
    ],
  },
  {
    id: "m6",
    number: 6,
    title: "Health & Body",
    description: "Medical vocabulary and doctor visits",
    status: "locked",
    progress: 0,
    xp: 0,
    lessons: [
      { id: "l17", title: "Body Parts", type: "vocab", duration: "15 min", completed: false },
      { id: "l18", title: "Should/Shouldn't", type: "grammar", duration: "20 min", completed: false },
      { id: "l19", title: "At the Doctor", type: "speaking", duration: "30 min", completed: false },
    ],
  },
  {
    id: "m7",
    number: 7,
    title: "Work & Career",
    description: "Professional English and job interviews",
    status: "locked",
    progress: 0,
    xp: 0,
    lessons: [
      { id: "l20", title: "Office Vocabulary", type: "vocab", duration: "20 min", completed: false },
      { id: "l21", title: "Present Perfect", type: "grammar", duration: "25 min", completed: false },
      { id: "l22", title: "Job Interview", type: "speaking", duration: "35 min", completed: false },
    ],
  },
  {
    id: "m8",
    number: 8,
    title: "Entertainment",
    description: "Movies, music, and hobbies",
    status: "locked",
    progress: 0,
    xp: 0,
    lessons: [
      { id: "l23", title: "Entertainment Words", type: "vocab", duration: "15 min", completed: false },
      { id: "l24", title: "Gerunds & Infinitives", type: "grammar", duration: "25 min", completed: false },
      { id: "l25", title: "Discuss Hobbies", type: "speaking", duration: "25 min", completed: false },
    ],
  },
  {
    id: "m9",
    number: 9,
    title: "News & Media",
    description: "Current events and media literacy",
    status: "locked",
    progress: 0,
    xp: 0,
    lessons: [
      { id: "l26", title: "News Vocabulary", type: "vocab", duration: "20 min", completed: false },
      { id: "l27", title: "Passive Voice", type: "grammar", duration: "25 min", completed: false },
      { id: "l28", title: "News Discussion", type: "speaking", duration: "30 min", completed: false },
    ],
  },
  {
    id: "m10",
    number: 10,
    title: "Mastery",
    description: "Advanced topics and final assessment",
    status: "locked",
    progress: 0,
    xp: 0,
    lessons: [
      { id: "l29", title: "Advanced Vocabulary", type: "vocab", duration: "25 min", completed: false },
      { id: "l30", title: "Complex Sentences", type: "grammar", duration: "30 min", completed: false },
      { id: "l31", title: "Final Speaking Test", type: "speaking", duration: "40 min", completed: false },
      { id: "l32", title: "Final Assessment", type: "reading", duration: "45 min", completed: false },
    ],
  },
]

const getModuleIcon = (number: number) => {
  const icons = [BookOpen, PenTool, Mic, Headphones, GraduationCap]
  return icons[(number - 1) % icons.length]
}

const getLessonIcon = (type: Lesson["type"]) => {
  switch (type) {
    case "vocab":
      return BookOpen
    case "grammar":
      return PenTool
    case "speaking":
      return Mic
    case "listening":
      return Headphones
    case "reading":
      return GraduationCap
  }
}

const getStatusColor = (status: Module["status"]) => {
  switch (status) {
    case "completed":
      return "bg-success-500"
    case "current":
      return "bg-primary-500"
    case "locked":
      return "bg-muted"
  }
}

const getStatusBorder = (status: Module["status"]) => {
  switch (status) {
    case "completed":
      return "border-success-300 bg-success-50"
    case "current":
      return "border-primary-300 bg-primary-50 ring-2 ring-primary-200"
    case "locked":
      return "border-muted bg-muted/30"
  }
}

export function GamificationRoadmap() {
  const currentModule = mockModules.find((m) => m.status === "current") || null
  const [selectedModule, setSelectedModule] = useState<Module | null>(currentModule)

  const completedModules = mockModules.filter((m) => m.status === "completed").length
  const totalXP = mockModules.reduce((acc, m) => acc + m.xp, 0)

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center justify-between bg-primary-50 rounded-xl p-3 border border-primary-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-medium text-primary-900">{completedModules}/10 Modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-warning-500" />
            <span className="text-xs font-medium text-primary-900">{totalXP} XP</span>
          </div>
        </div>
        <div className="text-xs text-primary-600">Click a node to view details</div>
      </div>

      {/* Main Content: Roadmap + Detail Panel */}
      <div className="flex gap-4">
        {/* Roadmap */}
        <div className={`transition-all duration-300 ${selectedModule ? "w-1/2" : "w-full"}`}>
          <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-xl border border-primary-200 p-4 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -mr-8 -mt-8" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent-100/50 rounded-full -ml-6 -mb-6" />

            {/* Path Container */}
            <div className="relative flex flex-wrap gap-2 justify-center">
              {mockModules.map((module, index) => {
                const Icon = getModuleIcon(module.number)
                const isSelected = selectedModule?.id === module.id

                return (
                  <div key={module.id} className="relative">
                    {/* Connection line */}
                    {index < mockModules.length - 1 && index !== 4 && (
                      <div
                        className={`absolute top-1/2 -right-2 w-2 h-0.5 ${
                          mockModules[index + 1].status !== "locked" ? "bg-success-300" : "bg-muted"
                        }`}
                      />
                    )}

                    {/* Node */}
                    <button
                      onClick={() => module.status !== "locked" && setSelectedModule(isSelected ? null : module)}
                      disabled={module.status === "locked"}
                      className={`
                        relative w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center
                        transition-all duration-200
                        ${getStatusBorder(module.status)}
                        ${module.status !== "locked" ? "cursor-pointer hover:scale-105 hover:shadow-md" : "cursor-not-allowed opacity-60"}
                        ${isSelected ? "ring-2 ring-primary-400 scale-105 shadow-lg" : ""}
                      `}
                    >
                      {module.status === "locked" ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : module.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 text-success-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-primary-600" />
                      )}

                      <span
                        className={`text-[10px] font-bold mt-0.5 ${
                          module.status === "locked"
                            ? "text-muted-foreground"
                            : module.status === "completed"
                              ? "text-success-700"
                              : "text-primary-700"
                        }`}
                      >
                        {module.number}
                      </span>

                      {/* Current indicator */}
                      {module.status === "current" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                      )}

                      {/* Score badge for completed */}
                      {module.status === "completed" && module.score && (
                        <div className="absolute -bottom-1 -right-1 bg-success-500 text-white text-[8px] font-bold px-1 rounded">
                          {module.score}%
                        </div>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-primary-100">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-success-500" />
                <span className="text-[10px] text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary-500" />
                <span className="text-[10px] text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" />
                <span className="text-[10px] text-muted-foreground">Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedModule && (
          <div className="w-1/2 bg-white rounded-xl border border-primary-200 p-4 animate-in slide-in-from-right-5 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedModule.status === "completed"
                        ? "bg-success-100 text-success-700"
                        : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    Module {selectedModule.number}
                  </span>
                  {selectedModule.score && (
                    <span className="text-xs font-bold text-success-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                      {selectedModule.score}%
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground">{selectedModule.title}</h3>
                <p className="text-xs text-muted-foreground">{selectedModule.description}</p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary-700">Progress</span>
                <span className="text-xs font-bold text-primary-900">{selectedModule.progress}%</span>
              </div>
              <Progress value={selectedModule.progress} className="h-2 bg-primary-100" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-primary-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {selectedModule.xp} XP earned
                </span>
                <span className="text-[10px] text-primary-600">
                  {selectedModule.lessons.filter((l) => l.completed).length}/{selectedModule.lessons.length} lessons
                </span>
              </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground mb-2">Lessons</h4>
              {selectedModule.lessons.map((lesson) => {
                const LessonIcon = getLessonIcon(lesson.type)
                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      lesson.completed
                        ? "bg-success-50 border-success-200"
                        : "bg-white border-muted hover:border-primary-200 hover:bg-primary-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        lesson.completed ? "bg-success-100" : "bg-primary-100"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-success-600" />
                      ) : (
                        <LessonIcon className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          lesson.completed ? "text-success-800" : "text-foreground"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </p>
                    </div>
                    {!lesson.completed && selectedModule.status === "current" && (
                      <Button size="sm" className="h-7 text-xs bg-primary-500 hover:bg-primary-600">
                        <Play className="w-3 h-3 mr-1" /> Start
                      </Button>
                    )}
                    {lesson.completed && <ChevronRight className="w-4 h-4 text-success-400" />}
                  </div>
                )
              })}
            </div>

            {/* Action Button */}
            {selectedModule.status === "current" && (
              <Button className="w-full mt-4 bg-primary-500 hover:bg-primary-600">Continue Learning</Button>
            )}
            {selectedModule.status === "completed" && (
              <Button
                variant="outline"
                className="w-full mt-4 border-success-200 text-success-700 hover:bg-success-50 bg-transparent"
              >
                <Trophy className="w-4 h-4 mr-2" /> Review Module
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
