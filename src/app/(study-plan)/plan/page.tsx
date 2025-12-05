"use client"

import { useState } from "react"
import Link from "next/link" // Added Link for navigation
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
} from "lucide-react"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import { GamificationRoadmap } from "./components/gamification-roadmap"
import Image from "next/image"

interface StudyPlan {
  id: string
  name: string
  goal: string
  level: string
  progress: number
  status: "active" | "completed" | "paused"
  studiedHours: number
  totalHours: number
  remainHours: number
}

interface StudyGoals {
  currentLevel: string
  targetLevel: string
  hoursPerWeek: number
  durationMonths: number
}

interface IELTSExam {
  examDate: Date
  daysRemaining: number
}

interface Reminder {
  id: string
  type: "speaking" | "notebook" | "missed"
  title: string
  description: string
  action: string
  href: string
}

interface TodayLesson {
  id: string
  type: "vocab" | "grammar" | "speaking"
  title: string
  topic: string
  duration: string
  completed: boolean
  link?: string // Added link property for navigation
}

export default function PlanPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan1")
  const [activeMissionTab, setActiveMissionTab] = useState<"today" | "weekly" | "monthly">("today")
  const [isEditing, setIsEditing] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [studyGoals] = useState<StudyGoals>({
    currentLevel: "3.0",
    targetLevel: "6.0",
    hoursPerWeek: 10,
    durationMonths: 4,
  })

  const [ieltsExam, setIeltsExam] = useState<IELTSExam>({
    examDate: new Date("2026-03-28"),
    daysRemaining: 120,
  })

  const [isEditingExamDate, setIsEditingExamDate] = useState(false)

  const todayLessons: TodayLesson[] = [
    {
      id: "l1",
      type: "vocab",
      title: "Vocabulary Topic: Animals",
      topic: "Từ mới: 13 • Khóa học: IELTS Preparation",
      duration: "Thời gian học: 20 phút",
      completed: false,
      link: "/vocab/animals", // Added mock link
    },
    {
      id: "l2",
      type: "grammar",
      title: "Grammar Topic: Present Simple",
      topic: "Ngữ pháp mới: 4 • Khóa học: IELTS Preparation",
      duration: "Thời gian học: 10 phút",
      completed: false,
      link: "/grammar/present-simple",
    },
    {
      id: "l3",
      type: "grammar",
      title: "Grammar Topic: Could/Should",
      topic: "Ngữ pháp mới: 4 • Khóa học: IELTS Preparation",
      duration: "Thời gian học: 10 phút",
      completed: false,
      link: "/grammar/modals",
    },
  ]

  const reminders: Reminder[] = [
    {
      id: "r1",
      type: "speaking",
      title: "Speaking Room",
      description: "Bạn chưa luyện nói lần nào",
      action: "Luyện ngay",
      href: "/speaking",
    },
    {
      id: "r2",
      type: "notebook",
      title: "Notebook",
      description: "Bạn còn 34 từ cần học hôm nay",
      action: "Ôn tập ngay",
      href: "/notebook",
    },
    {
      id: "r3",
      type: "missed",
      title: "Missed Tasks",
      description: "Bạn còn nhiệm vụ hôm qua chưa hoàn thành",
      action: "Quay lại",
      href: "/plan",
    },
  ]

  const toggleLesson = (id: string) => {
    setCompletedLessons((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleMission = (id: string) => {
    setCompletedMissions((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const selectedPlan = todayLessons.find((p) => p.id === selectedPlanId) || todayLessons[0]

  return (
    <ProtectedRoute
      pageName="Study Plan"
      pageDescription="View and manage your personalized learning schedule."
      pageIcon={PageIcons.studyPlan}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* 1. Header Section */}

          {/* 2. This week's plan Section */}
          <Card className="p-6 border-primary-200 shadow-md bg-white">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">This week&apos;s plan</h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Stats & Calendar (8 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Số giờ học trong ngày</p>
                    <p className="text-xl font-bold text-primary-900">1.5h</p>
                  </div>
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Số giờ học trong tuần</p>
                    <p className="text-xl font-bold text-primary-900">13h</p>
                  </div>
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Total Hours</p>
                    <p className="text-xl font-bold text-primary-900">70h</p>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="rounded-xl border border-primary-200 overflow-hidden shadow-sm bg-white">
                  <div className="grid grid-cols-8 border-b border-primary-200 text-center text-xs font-semibold text-slate-500 bg-primary-50/30">
                    <div className="p-3 border-r border-primary-100">time</div>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="p-3 border-r border-primary-100 last:border-r-0 text-primary-900">
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Simplified Time Blocks for visual matching */}
                  <div className="grid grid-cols-8 text-xs min-h-[60px] border-b border-primary-50">
                    <div className="p-2 border-r border-primary-50 text-center text-slate-400 font-mono font-bold text-sm">
                      6:00
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50 p-1">
                      <div
                        className={`w-full h-full rounded-lg ${isEditing ? "animate-pulse ring-1 ring-primary-300" : ""} bg-primary-200 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm`}
                      >
                        Speaking
                      </div>
                    </div>
                    <div className="border-r border-primary-50 p-1">
                      <div
                        className={`w-full h-full rounded-lg ${isEditing ? "animate-pulse ring-1 ring-primary-300" : ""} bg-primary-200 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm`}
                      >
                        Speaking
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50 p-1">
                      <div
                        className={`w-full h-full rounded-lg ${isEditing ? "animate-pulse ring-1 ring-primary-300" : ""} bg-primary-200 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm`}
                      >
                        Speaking
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                  </div>
                  <div className="grid grid-cols-8 text-xs min-h-[60px] border-b border-primary-50">
                    <div className="p-2 border-r border-primary-50 text-center text-slate-400 font-mono font-bold text-sm">
                      12:00
                    </div>
                    <div className="border-r border-primary-50 p-1">
                      <div className="w-full h-full rounded-lg bg-primary-200 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm">
                        Speaking
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                  </div>
                  <div className="grid grid-cols-8 text-xs min-h-[60px] border-b border-primary-50">
                    <div className="p-2 border-r border-primary-50 text-center text-slate-400 font-mono font-bold text-sm">
                      1:00
                    </div>
                    <div className="border-r border-primary-50 p-1">
                      <div className="w-full h-full rounded-lg bg-primary-100 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm">
                        Vocabulary
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50 p-1">
                      <div className="w-full h-full rounded-lg bg-primary-200 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm">
                        Speaking
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50 p-1">
                      <div className="w-full h-full rounded-lg bg-primary-200 text-primary-900 font-medium flex items-center justify-center text-[10px] shadow-sm">
                        Speaking
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                  </div>
                  <div className="grid grid-cols-8 text-xs min-h-[60px]">
                    <div className="p-2 border-r border-primary-50 text-center text-slate-400 font-mono font-bold text-sm">
                      5:00
                    </div>
                    <div className="border-r border-primary-50 p-1">
                      <div className="w-full h-full rounded-lg bg-secondary-100 text-orange-900 font-medium flex items-center justify-center text-[10px] shadow-sm">
                        Grammar
                      </div>
                    </div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                    <div className="border-r border-primary-50"></div>
                  </div>
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
                  {todayLessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id)
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => toggleLesson(lesson.id)}
                        className={`relative flex items-start gap-4 p-4 border rounded-xl transition-all cursor-pointer group ${
                          isCompleted
                            ? "bg-success-100 border-2 border-success-200"
                            : "bg-white border-primary-200 border-2 hover:border-primary-300 hover:shadow-md"
                        }`}
                      >
                        <div className="mt-1">
                          <div
                            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                              isCompleted
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
                  })}
                </div>

                <div className="flex justify-center gap-2 mt-4 text-xs font-medium text-slate-500">
                  <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-sm">
                    1
                  </span>
                  <span className="w-6 h-6 rounded-full hover:bg-primary-100 hover:text-primary-700 flex items-center justify-center cursor-pointer transition-colors">
                    2
                  </span>
                  <span className="w-6 h-6 rounded-full hover:bg-primary-100 hover:text-primary-700 flex items-center justify-center cursor-pointer transition-colors">
                    &gt;
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Missions & Reminders Section (GRID LAYOUT UPDATED) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Goals Section */}
            <Card className="p-6 border-primary-200 shadow-md lg:col-span-1 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Mục tiêu của bạn</h2>
              </div>

              <div className="space-y-4">
                {/* Current Level */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm text-slate-600">Trình độ hiện tại</span>
                  <span className="px-4 py-1.5 bg-primary-100 text-primary-700 font-bold text-sm rounded-lg border-2 border-primary-200">
                    IELTS {studyGoals.currentLevel}
                  </span>
                </div>

                {/* Target Level */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm text-slate-600">Mục tiêu của bạn</span>
                  <span className="px-4 py-1.5 bg-success-100 text-success-700 font-bold text-sm rounded-lg border-2 border-success-200">
                    IELTS {studyGoals.targetLevel}
                  </span>
                </div>

                {/* Study Hours */}
                <div className="mt-6 p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200 text-center">
                  <p className="text-sm text-slate-600 mb-2">Giờ học ước tính mỗi tuần</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary-700">{studyGoals.hoursPerWeek}h</span>
                    <span className="text-lg text-primary-600">/ tuần</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">trong {studyGoals.durationMonths} tháng</p>
                </div>
              </div>
            </Card>

            {/* IELTS Exam Schedule Section */}
            <Card className="p-6 border-primary-200 shadow-md lg:col-span-1 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Lịch thi IELTS</h2>
              </div>

              <div className="space-y-4">
                {/* Exam Date and Days Remaining */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Ngày dự thi</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-slate-800">{ieltsExam.examDate.toLocaleDateString("vi-VN")}</span>
                      <button
                        onClick={() => setIsEditingExamDate(true)}
                        className="w-6 h-6 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                      >
                        <Pencil className="w-3 h-3 text-primary-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Số ngày còn lại</p>
                    <span className="font-bold text-primary-600 text-lg">{ieltsExam.daysRemaining} ngày</span>
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
                      Bạn sẽ đạt được aim nếu học với lịch học hiện tại vào ngày{" "}
                      <span className="font-bold">28/12</span>!
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
                <h2 className="text-xl font-bold text-slate-800">Lời nhắc</h2>
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

          {/* 4. Plans Grid Section (GRID LAYOUT UPDATED) */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* My Study Plan - Takes up 2 Columns */}
            <Card className="p-6 h-full border-primary-100 shadow-md lg:col-span-2 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Study Plan</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-xs"
                >
                  New plan
                </Button>
              </div>

              <div className="space-y-4">
                {todayLessons.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedPlanId === plan.id
                        ? "ring-2 ring-primary-500 border-transparent bg-primary-50 shadow-sm"
                        : "border-gray-200 hover:border-primary-300 hover:shadow-sm bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`font-bold text-sm ${
                          selectedPlanId === plan.id ? "text-primary-900" : "text-slate-700"
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

            {/* Detail Study Plan - Takes up 5 Columns */}
            <Card className="p-6 border-primary-100 shadow-md lg:col-span-5 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-slate-800">Detail Study Plan</h2>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary-600">
                  <Brain className="w-5 h-5" />
                </Button>
              </div>

              <h3 className="text-lg font-bold mb-4 text-primary-900">{selectedPlan.title}</h3>
              <p className="text-sm text-slate-500 mb-6 border-b border-gray-100 pb-4">{selectedPlan.topic}</p>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="border border-primary-100 bg-primary-50/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-primary-600 font-medium mb-1">Duration</p>
                  <p className="font-bold text-slate-800">{selectedPlan.duration}</p>
                </div>
              </div>

              {/* Gamification Placeholders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-800">Learning Journey</h4>
                  <span className="text-xs text-primary-600">10 Modules</span>
                </div>
                <GamificationRoadmap />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
