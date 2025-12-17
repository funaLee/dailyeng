"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Check,
  Edit2,
  PlayCircle,
  BookOpen,
  Mic,
  Brain,
  Target,
  Calendar,
  Pencil,
  Sparkles,
  AlertCircle,
  Bell,
  Plus,
} from "lucide-react"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import { GamificationRoadmap } from "@/components/plan/gamification-roadmap"
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// Mock functions - will be replaced with actual server actions later
const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
  console.log("Mock: toggleTaskCompletion", taskId, completed);
  return { success: true };
};

const updateTaskTime = async (
  taskId: string,
  startTime: string,
  endTime: string
) => {
  console.log("Mock: updateTaskTime", taskId, startTime, endTime);
  return { success: true };
};

const updateExamDate = async (userId: string, date: Date) => {
  console.log("Mock: updateExamDate", userId, date);
  return { success: true };
};

// Types
export interface TodayLesson {
  id: string
  type: "vocab" | "grammar" | "speaking"
  title: string
  topic: string
  duration: string
  completed: boolean
  link?: string
  startTime?: string
  endTime?: string
}

export interface Reminder {
  id: string
  type: "speaking" | "notebook" | "missed"
  title: string
  description: string
  action: string
  href: string
}

export interface StudyGoals {
  currentLevel: string
  targetLevel: string
  hoursPerWeek: number
  durationMonths: number
}

export interface IELTSExam {
  examDate: string  // ISO string for serialization
  daysRemaining: number
}

export interface StudyStats {
  dailyHours: string
  weeklyHours: string
  totalHours: string
}

export interface PlanPageClientProps {
  todayLessons: TodayLesson[]
  reminders: Reminder[]
  studyGoals: StudyGoals
  ieltsExam: IELTSExam
  stats: StudyStats
}

// Helper to determine time slot row
const getTimePeriod = (time?: string) => {
  if (!time) return "morning";
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export default function PlanPageClient({
  todayLessons,
  reminders,
  studyGoals,
  ieltsExam: initialIeltsExam,
  stats,
}: PlanPageClientProps) {
  const router = useRouter()
  const [selectedPlanId, setSelectedPlanId] = useState<string>(todayLessons[0]?.id || "")
  const [isEditing, setIsEditing] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [ieltsExam, setIeltsExam] = useState(initialIeltsExam)
  const [isEditingExamDate, setIsEditingExamDate] = useState(false)
  const [tempExamDate, setTempExamDate] = useState(initialIeltsExam.examDate)

  // Calendar Edit State
  const [editingTask, setEditingTask] = useState<TodayLesson | null>(null)

  const toggleLesson = async (id: string) => {
    // Optimistic update
    const isCurrentlyCompleted = completedLessons.includes(id)
    const newCompleted = isCurrentlyCompleted ? completedLessons.filter(i => i !== id) : [...completedLessons, id]
    setCompletedLessons(newCompleted)

    // Server action
    try {
      await toggleTaskCompletion(id, !isCurrentlyCompleted)
    } catch (e) {
      console.error("Failed to toggle task", e)
      setCompletedLessons(completedLessons)
    }
  }

  const handleUpdateExamDate = async () => {
    try {
      const date = new Date(tempExamDate)
      await updateExamDate("user-1", date) // TODO: use real user id
      setIeltsExam({
        ...ieltsExam,
        examDate: tempExamDate,
        daysRemaining: Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      })
      setIsEditingExamDate(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleTaskClick = (task: TodayLesson) => {
    if (isEditing) {
      setEditingTask(task)
    } else {
      setSelectedPlanId(task.id)
    }
  }

  const selectedPlan = todayLessons.find((p) => p.id === selectedPlanId) || todayLessons[0]

  // Group tasks for calendar
  const groupedTasks = {
    morning: todayLessons.filter(t => getTimePeriod(t.startTime) === "morning"),
    afternoon: todayLessons.filter(t => getTimePeriod(t.startTime) === "afternoon"),
    evening: todayLessons.filter(t => getTimePeriod(t.startTime) === "evening"),
  }

  return (
    <ProtectedRoute
      pageName="Study Plan"
      pageDescription="View and manage your personalized learning schedule."
      pageIcon={PageIcons.studyPlan}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* 2. This week's plan Section */}
          <Card className="p-6 border-primary-200 shadow-md bg-white">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">This week&apos;s plan</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/build-plan')}
                  className="border-primary-200 text-primary-700 hover:bg-primary-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Plan
                </Button>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className={
                    isEditing ? "bg-primary-500 text-white" : "border-primary-200 text-primary-700 hover:bg-primary-50"
                  }
                >
                  {isEditing ? <Check className="w-4 h-4 mr-1" /> : <Edit2 className="w-4 h-4 mr-1" />}
                  {isEditing ? "Done" : "Edit"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Stats & Calendar (8 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Daily study hours</p>
                    <p className="text-xl font-bold text-primary-900">{stats.dailyHours}h</p>
                  </div>
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Weekly study hours</p>
                    <p className="text-xl font-bold text-primary-900">{stats.weeklyHours}h</p>
                  </div>
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Total Hours</p>
                    <p className="text-xl font-bold text-primary-900">{stats.totalHours}h</p>
                  </div>
                </div>

                {/* Calendar Grid - 3 Row Layout */}
                <div className="rounded-xl border border-primary-200 overflow-hidden shadow-sm bg-white relative">
                  {/* Header Days */}
                  <div className="grid grid-cols-8 border-b border-primary-200 text-center text-xs font-semibold text-slate-500 bg-primary-50/30">
                    <div className="p-3 border-r border-primary-100">Period</div>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="p-3 border-r border-primary-100 last:border-r-0 text-primary-900">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Morning Row */}
                  <div className="grid grid-cols-8 min-h-[80px] border-b border-primary-50">
                    <div className="p-2 border-r border-primary-50 text-center flex flex-col justify-center items-center bg-orange-50/30">
                      <span className="font-bold text-orange-600 text-xs uppercase mb-1">Morning</span>
                      <span className="text-[10px] text-slate-400">5am - 12pm</span>
                    </div>
                    <div className="col-span-7 grid grid-cols-7">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="border-r border-primary-50 p-1 relative group hover:bg-slate-50 transition-colors">
                          {i === 0 && groupedTasks.morning.map(task => (
                            <div key={task.id}
                              className={`mb-1 p-1 rounded-md bg-orange-100 border border-orange-200 text-[10px] text-orange-900 truncate hover:shadow-sm cursor-pointer ${isEditing ? 'ring-2 ring-primary-300 ring-offset-1' : ''}`}
                              onClick={() => handleTaskClick(task)}
                            >
                              <span className="font-bold block text-[9px]">{task.startTime}-{task.endTime}</span>
                              {task.title}
                            </div>
                          ))}
                          {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none">
                              <Edit2 className="w-3 h-3 text-slate-300" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Afternoon Row */}
                  <div className="grid grid-cols-8 min-h-[80px] border-b border-primary-50">
                    <div className="p-2 border-r border-primary-50 text-center flex flex-col justify-center items-center bg-blue-50/30">
                      <span className="font-bold text-blue-600 text-xs uppercase mb-1">Afternoon</span>
                      <span className="text-[10px] text-slate-400">12pm - 6pm</span>
                    </div>
                    <div className="col-span-7 grid grid-cols-7">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="border-r border-primary-50 p-1 relative group hover:bg-slate-50 transition-colors">
                          {i === 0 && groupedTasks.afternoon.map(task => (
                            <div key={task.id}
                              className={`mb-1 p-1 rounded-md bg-blue-100 border border-blue-200 text-[10px] text-blue-900 truncate hover:shadow-sm cursor-pointer ${isEditing ? 'ring-2 ring-primary-300 ring-offset-1' : ''}`}
                              onClick={() => handleTaskClick(task)}
                            >
                              <span className="font-bold block text-[9px]">{task.startTime}-{task.endTime}</span>
                              {task.title}
                            </div>
                          ))}
                          {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none">
                              <Edit2 className="w-3 h-3 text-slate-300" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evening Row */}
                  <div className="grid grid-cols-8 min-h-[80px]">
                    <div className="p-2 border-r border-primary-50 text-center flex flex-col justify-center items-center bg-indigo-50/30">
                      <span className="font-bold text-indigo-600 text-xs uppercase mb-1">Evening</span>
                      <span className="text-[10px] text-slate-400">6pm - 11pm</span>
                    </div>
                    <div className="col-span-7 grid grid-cols-7">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="border-r border-primary-50 p-1 relative group hover:bg-slate-50 transition-colors">
                          {i === 0 && groupedTasks.evening.map(task => (
                            <div key={task.id}
                              className={`mb-1 p-1 rounded-md bg-indigo-100 border border-indigo-200 text-[10px] text-indigo-900 truncate hover:shadow-sm cursor-pointer ${isEditing ? 'ring-2 ring-primary-300 ring-offset-1' : ''}`}
                              onClick={() => handleTaskClick(task)}
                            >
                              <span className="font-bold block text-[9px]">{task.startTime}-{task.endTime}</span>
                              {task.title}
                            </div>
                          ))}
                          {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none">
                              <Edit2 className="w-3 h-3 text-slate-300" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Task Edit Overlay */}
                  {editingTask && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                      <Card className="p-6 w-80 bg-white shadow-xl border-primary-200">
                        <h3 className="font-bold mb-4 text-slate-800">Edit Time: {editingTask.title}</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">Start Time</label>
                            <input type="time" className="w-full border p-2 rounded-lg text-sm"
                              defaultValue={editingTask.startTime}
                              id="edit-start-time"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">End Time</label>
                            <input type="time" className="w-full border p-2 rounded-lg text-sm"
                              defaultValue={editingTask.endTime}
                              id="edit-end-time"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingTask(null)}>Cancel</Button>
                            <Button size="sm" onClick={async () => {
                              const start = (document.getElementById('edit-start-time') as HTMLInputElement).value
                              const end = (document.getElementById('edit-end-time') as HTMLInputElement).value
                              if (start && end) {
                                await updateTaskTime(editingTask.id, start, end)
                                setEditingTask(null)
                              }
                            }}>Save</Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Today's Lesson */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Today&apos;s lesson</h3>
                  <span className="bg-success-100 text-success-300 font-semibold text-xs px-2.5 py-1 rounded-full">
                    Complete {completedLessons.length}/{todayLessons.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {todayLessons.length > 0 ? (
                    todayLessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id)
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            setSelectedPlanId(lesson.id)
                          }}
                          className={`relative flex items-start gap-4 p-4 border rounded-xl transition-all cursor-pointer group ${isCompleted
                            ? "bg-success-100 border-2 border-success-200"
                            : selectedPlanId === lesson.id
                              ? "bg-primary-50 border-2 border-primary-500"
                              : "bg-white border-primary-200 border-2 hover:border-primary-300 hover:shadow-md"
                            }`}
                        >
                          <div className="mt-1" onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }}>
                            <div
                              className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${isCompleted
                                ? "bg-success-300 border-success-300"
                                : "border-gray-300 group-hover:border-primary-400"
                                }`}
                            >
                              {isCompleted && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className={`font-bold text-sm ${isCompleted ? "text-success-300" : "text-primary-800"}`}>
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-slate-500 whitespace-pre-line">{lesson.topic}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <PlayCircle className="w-3 h-3" /> {lesson.duration}
                            </p>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Button
                              asChild
                              variant="secondary"
                              size="sm"
                              className="h-7 text-xs bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link href={lesson.link || "#"}>Learning now</Link>
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-sm italic">
                      No tasks for today.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Missions & Reminders Section (GRID LAYOUT UPDATED) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Goals Section */}
            <Card className="p-6 border-primary-200 shadow-md lg:col-span-1 bg-white relative">
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-primary-600">
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Your Goals</h2>
              </div>

              <div className="space-y-4">
                {/* Current Level */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm text-slate-600">Current Level</span>
                  <span className="px-4 py-1.5 bg-primary-100 text-primary-700 font-bold text-sm rounded-lg border-2 border-primary-200">
                    IELTS {studyGoals.currentLevel}
                  </span>
                </div>

                {/* Target Level */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm text-slate-600">Target Level</span>
                  <span className="px-4 py-1.5 bg-success-100 text-success-700 font-bold text-sm rounded-lg border-2 border-success-200">
                    IELTS {studyGoals.targetLevel}
                  </span>
                </div>

                {/* Study Hours */}
                <div className="mt-6 p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200 text-center">
                  <p className="text-sm text-slate-600 mb-2">Estimated study hours per week</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary-700">{studyGoals.hoursPerWeek}h</span>
                    <span className="text-lg text-primary-600">/ week</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">for {studyGoals.durationMonths} months</p>
                </div>
              </div>
            </Card>

            {/* IELTS Exam Schedule Section */}
            <Card className="p-6 border-primary-200 shadow-md lg:col-span-1 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">IELTS Exam Schedule</h2>
              </div>

              <div className="space-y-4">
                {/* Exam Date and Days Remaining */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center relative">
                    <p className="text-xs text-slate-500 mb-1">Exam Date</p>
                    {isEditingExamDate ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="date"
                          value={tempExamDate ? format(new Date(tempExamDate), "yyyy-MM-dd") : ""}
                          onChange={(e) => setTempExamDate(new Date(e.target.value).toISOString())}
                          className="w-full text-xs p-1 border rounded"
                        />
                        <div className="flex gap-1 justify-center">
                          <Button size="sm" className="h-6 text-[10px] px-2" onClick={handleUpdateExamDate}>Save</Button>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => setIsEditingExamDate(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-slate-800">
                          {ieltsExam.examDate ? new Date(ieltsExam.examDate).toLocaleDateString("en-US") : "N/A"}
                        </span>
                        <button
                          onClick={() => setIsEditingExamDate(true)}
                          className="w-6 h-6 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-primary-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Days Remaining</p>
                    <span className="font-bold text-primary-600 text-lg">{ieltsExam.daysRemaining} days</span>
                  </div>
                </div>

                {/* Illustration */}
                <div className="relative h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden border border-primary-100">
                  <Image src="/learning.png" alt="Study illustration" fill className="object-contain p-4" />
                </div>

                {/* Motivational Message */}
                <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200 text-center">
                  <div className="flex items-start gap-2 justify-center">
                    <Sparkles className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-success-700">
                      You will reach your goal if you follow your current study plan by{" "}
                      <span className="font-bold">
                        {ieltsExam.examDate ? new Date(ieltsExam.examDate).toLocaleDateString("en-US") : "..."}
                      </span>!
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary-100 shadow-md flex flex-col lg:col-span-1 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-warning-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Reminders</h2>
              </div>

              <div className="space-y-3 flex-1">
                {reminders.map((reminder) => {
                  const getIcon = () => {
                    switch (reminder.type) {
                      case "speaking":
                        return <Mic className="w-5 h-5" />
                      case "notebook":
                        return <BookOpen className="w-5 h-5" />
                      case "missed":
                        return <AlertCircle className="w-5 h-5" />
                    }
                  }

                  const getColors = () => {
                    switch (reminder.type) {
                      case "speaking":
                        return {
                          bg: "bg-primary-50/50",
                          border: "border-primary-100",
                          iconBg: "bg-primary-100",
                          iconColor: "text-primary-600",
                          titleColor: "text-primary-900",
                          btnBg: "bg-primary-100 hover:bg-primary-200",
                          btnText: "text-primary-700",
                        }
                      case "notebook":
                        return {
                          bg: "bg-secondary-50/50",
                          border: "border-secondary-100",
                          iconBg: "bg-secondary-100",
                          iconColor: "text-secondary-600",
                          titleColor: "text-secondary-900",
                          btnBg: "bg-secondary-100 hover:bg-secondary-200",
                          btnText: "text-secondary-700",
                        }
                      case "missed":
                        return {
                          bg: "bg-warning-50/50",
                          border: "border-warning-100",
                          iconBg: "bg-warning-100",
                          iconColor: "text-warning-600",
                          titleColor: "text-warning-900",
                          btnBg: "bg-warning-100 hover:bg-warning-200",
                          btnText: "text-warning-700",
                        }
                    }
                  }

                  const colors = getColors()

                  return (
                    <div key={reminder.id} className={`${colors.bg} ${colors.border} border rounded-xl p-4 space-y-3`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 ${colors.iconBg} rounded-full flex items-center justify-center ${colors.iconColor}`}
                        >
                          {getIcon()}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm ${colors.titleColor}`}>{reminder.title}</h3>
                          <p className="text-xs text-slate-500">{reminder.description}</p>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className={`w-full ${colors.btnBg} ${colors.btnText} font-medium`}
                      >
                        <Link href={reminder.href}>{reminder.action}</Link>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* 4. My Study Plan Section */}
          <div className="grid grid-cols-1 gap-8">
            {/* My Study Plan */}
            <Card className="p-6 border-primary-100 shadow-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Study Plan</h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/build-plan')}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> New
                </Button>
              </div>

              <div className="space-y-4">
                {todayLessons.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${selectedPlanId === plan.id
                      ? "ring-2 ring-primary-500 border-transparent bg-primary-50 shadow-sm"
                      : "border-gray-200 hover:border-primary-300 hover:shadow-sm bg-white"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`font-bold text-sm ${selectedPlanId === plan.id ? "text-primary-900" : "text-slate-700"
                          }`}
                      >
                        {plan.title}
                      </h3>
                      {plan.completed && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{plan.topic}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Duration</span>
                        <span>{plan.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>


          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
