"use client"

import { useState } from "react"
import Link from "next/link" // Added Link for navigation
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Gift, Check, Edit2, PlayCircle, BookOpen, Mic, Brain, Target } from "lucide-react"
import Image from "next/image"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"

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

interface Mission {
  id: string
  title: string
  points: number
  completed: boolean
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

export default function StudyPlanPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan1")
  const [activeMissionTab, setActiveMissionTab] = useState<"today" | "weekly" | "monthly">("today")
  const [isEditing, setIsEditing] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [completedMissions, setCompletedMissions] = useState<string[]>([])

  // Mock Data
  const studyPlans: StudyPlan[] = [
    {
      id: "plan1",
      name: "IELTS Preparation",
      goal: "Achieve IELTS Band 7.0",
      level: "C1",
      progress: 44,
      status: "active",
      studiedHours: 72,
      totalHours: 104,
      remainHours: 32,
    },
    {
      id: "plan2",
      name: "Business English",
      goal: "Achieve IELTS Band 6.0",
      level: "B2",
      progress: 44,
      status: "active",
      studiedHours: 45,
      totalHours: 120,
      remainHours: 75,
    },
  ]

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

  const missions: Mission[] = [
    { id: "m1", title: "Enter today", points: 5, completed: false },
    { id: "m2", title: "Study 30 minutes", points: 10, completed: false },
    { id: "m3", title: "Learn 10 new flashcard", points: 10, completed: false },
    { id: "m4", title: "Complete today lesson", points: 40, completed: false },
    { id: "m5", title: "Speaking 1 time", points: 30, completed: false },
    { id: "m6", title: "Review all notebook", points: 30, completed: false },
    { id: "m7", title: "Complete all tasks", points: 30, completed: false },
  ]

  const toggleLesson = (id: string) => {
    setCompletedLessons((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleMission = (id: string) => {
    setCompletedMissions((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const selectedPlan = studyPlans.find((p) => p.id === selectedPlanId) || studyPlans[0]

  const displayedMissions = missions.map((m) => ({
    ...m,
    // Add some variation for other tabs just for demo
    title:
      activeMissionTab === "today"
        ? m.title
        : activeMissionTab === "weekly"
          ? m.title.replace("today", "this week")
          : m.title.replace("today", "this month"),
    points: activeMissionTab === "today" ? m.points : m.points * 5,
  }))

  return (
    <ProtectedRoute
      pageName="Study Plan"
      pageDescription="View and manage your personalized learning schedule."
      pageIcon={PageIcons.studyPlan}
    >
      <div className="container mx-auto max-w-7xl py-8">
        <div className="space-y-8">
          {/* 1. Header Section */}
          <div className="relative overflow-hidden rounded-3xl border border-primary-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-4">
                <h1 className="text-4xl font-black uppercase tracking-tight text-primary-950">Your Study Plan</h1>
                <p className="text-lg text-slate-600">
                  Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency,
                  grammar, and content.
                </p>
              </div>
              <div className="relative h-48 w-48 md:h-64 md:w-64 flex-shrink-0">
                <div className="absolute inset-0 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
                <Image
                  src="learning.png"
                  alt="Study Plan Illustration"
                  width={300}
                  height={300}
                  className="relative z-10 object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* 2. This week's plan Section */}
          <Card className="p-6 border-primary-200 shadow-md">
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
                    <p className="text-xl font-bold text-slate-800">1.5h</p>
                  </div>
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Số giờ học trong tuần</p>
                    <p className="text-xl font-bold text-slate-800">13h</p>
                  </div>
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-center">
                    <p className="text-xs text-primary-600 font-medium mb-1">Total Hours</p>
                    <p className="text-xl font-bold text-slate-800">70h</p>
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
                      <div className="w-full h-full rounded-lg bg-orange-100 text-orange-900 font-medium flex items-center justify-center text-[10px] shadow-sm">
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
                  <span className="bg-primary-100 text-primary-700 font-semibold text-xs px-2.5 py-1 rounded-full">
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
                            ? "bg-primary-50 border-primary-200"
                            : "bg-white border-gray-100 hover:border-primary-300 hover:shadow-md"
                        }`}
                      >
                        <div className="mt-1">
                          <div
                            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-primary-500 border-primary-500"
                                : "border-gray-300 group-hover:border-primary-400"
                            }`}
                          >
                            {isCompleted && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className={`font-bold text-sm ${isCompleted ? "text-primary-900" : "text-slate-800"}`}>
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
            {/* Missions - Takes up 2 Columns */}
            <Card className="p-6 border-primary-200 shadow-md lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Mission</h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sidebar Tabs */}
                <div className="md:col-span-3 space-y-6">
                  <div className="flex flex-col border border-primary-200 rounded-xl overflow-hidden shadow-sm">
                    {(["today", "weekly", "monthly"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveMissionTab(tab)}
                        className={`p-3 text-sm font-medium text-left border-b border-primary-50 last:border-b-0 transition-all capitalize flex items-center justify-between ${
                          activeMissionTab === tab
                            ? "bg-primary-200 text-primary-900"
                            : "bg-white text-slate-600 hover:bg-primary-50"
                        }`}
                      >
                        {tab}
                        {activeMissionTab === tab && <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                      </button>
                    ))}
                  </div>

                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 text-center space-y-2 border border-primary-200">
                    <h4 className="font-bold text-sm text-slate-700">Countdown</h4>
                    <div className="bg-white/80 py-2 px-4 rounded-lg font-mono font-bold text-sm text-primary-600 shadow-sm border border-primary-200">
                      14:59 hours remains
                    </div>
                    <p className="text-[10px] text-slate-500">Kết thúc lúc 11:59PM ngày 23/11/2025</p>
                  </div>
                </div>

                {/* Mission List */}
                <div className="md:col-span-5">
                  <h3 className="font-bold mb-4 text-slate-800 capitalize">{activeMissionTab} Mission</h3>
                  <div className="space-y-3">
                    {displayedMissions.map((mission) => {
                      const isDone = completedMissions.includes(mission.id)
                      return (
                        <div
                          key={mission.id}
                          onClick={() => toggleMission(mission.id)}
                          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                            isDone
                              ? "bg-primary-50 border-primary-200"
                              : "bg-white border-slate-100 hover:border-primary-200 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              isDone ? "bg-primary-500 border-primary-500" : "border-slate-300"
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span
                            className={`flex-1 text-sm ${isDone ? "line-through text-slate-400" : "text-slate-700"}`}
                          >
                            {mission.title}
                          </span>
                          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                            +{mission.points}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Gift/Reward */}
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-6 text-center w-full">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <Gift className="w-full h-full text-primary-600" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Daily Gift</h4>
                    <p className="text-xs text-slate-500 mb-4">Complete all missions to claim!</p>
                    <Button
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                      disabled={completedMissions.length < displayedMissions.length}
                    >
                      Claim Gift
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reminders - Takes up 1 Column */}
            <Card className="p-6 border-primary-100 shadow-md flex flex-col lg:col-span-1">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Lời nhắc</h2>

              <div className="space-y-4 flex-1">
                <div className="border border-primary-100 bg-primary-50/30 rounded-xl p-4 text-center space-y-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-600">
                    <Mic className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-primary-900">Speaking Room</h3>
                  <p className="text-xs text-slate-500 px-4">You have not practiced speaking today</p>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="w-full bg-primary-100 hover:bg-primary-200 text-primary-700"
                  >
                    <Link href="/speaking">Practice Now</Link>
                  </Button>
                </div>

                <div className="border border-secondary-100 bg-secondary-50/30 rounded-xl p-4 text-center space-y-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mx-auto text-secondary-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-secondary-900">Notebook</h3>
                  <p className="text-xs text-slate-500 px-4">You have 34 words on reviewing</p>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="w-full bg-secondary-50 hover:bg-secondary-100 text-secondary-700"
                  >
                    <Link href="/notebook">Review Now</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 4. Plans Grid Section (GRID LAYOUT UPDATED) */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* My Study Plan - Takes up 1 Column */}
            <Card className="p-6 h-full border-primary-100 shadow-md lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Study Plan</h2>
                <Button variant="secondary" size="sm" className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-xs">
                  New plan
                </Button>
              </div>

              <div className="space-y-4">
                {studyPlans.map((plan) => (
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
                        {plan.name}
                      </h3>
                      {plan.status === "active" && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{plan.goal}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Progress</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-1.5 bg-primary-100" />
                      <p className="text-[10px] text-slate-400 mt-1">Remain: {plan.remainHours}h to complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Detail Study Plan - Takes up 3 Columns */}
            <Card className="p-6 border-primary-100 shadow-md lg:col-span-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-slate-800">Detail Study Plan</h2>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary-600">
                  <Brain className="w-5 h-5" />
                </Button>
              </div>

              <h3 className="text-lg font-bold mb-4 text-primary-900">{selectedPlan.name}</h3>
              <p className="text-sm text-slate-500 mb-6 border-b border-gray-100 pb-4">{selectedPlan.goal}</p>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="border border-primary-100 bg-primary-50/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-primary-600 font-medium mb-1">Progress</p>
                  <p className="font-bold text-slate-800">{selectedPlan.progress}%</p>
                </div>
                <div className="border border-primary-100 bg-primary-50/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-primary-600 font-medium mb-1">Studied</p>
                  <p className="font-bold text-slate-800">{selectedPlan.studiedHours}h</p>
                </div>
                <div className="border border-primary-100 bg-primary-50/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-primary-600 font-medium mb-1">Remain</p>
                  <p className="font-bold text-slate-800">{selectedPlan.remainHours}h</p>
                </div>
                <div className="border border-primary-100 bg-primary-50/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-primary-600 font-medium mb-1">Level</p>
                  <p className="font-bold text-slate-800">{selectedPlan.level}</p>
                </div>
              </div>

              {/* Gamification Placeholders */}
              <div className="space-y-6">
                <div className="w-full h-48 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-primary-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-8 -mb-8" />
                  <Target className="w-12 h-12 text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-primary-900 text-sm">Gamification Map Overview</p>
                  <p className="text-xs text-primary-600 mt-1">Unlock new islands as you progress!</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                      1
                    </span>
                    Chặng 1: Foundation
                  </h4>
                  <div className="w-full h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 relative">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Gamification Path"
                      fill
                      className="object-cover opacity-50 rounded-2xl"
                    />
                    <span className="relative z-10 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm font-medium">
                      Map Visualization Loading...
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
