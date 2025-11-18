"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { Calendar, Plus, ChevronRight, Clock, Target, TrendingUp, BookOpen, Mic, Headphones, PenTool, CheckCircle2, Circle, Settings, List, Network, Sparkles, BarChart3, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { mockTopics } from "@/lib/mock-data"

interface StudyPlan {
  id: string
  name: string
  goal: string
  level: string
  startDate: Date
  endDate: Date
  totalHours: number
  studiedHours: number
  progress: number
  units: StudyUnit[]
  status: "active" | "completed" | "paused"
}

interface StudyUnit {
  id: string
  title: string
  type: "vocab" | "grammar" | "listening" | "reading" | "speaking" | "writing"
  completed: boolean
  estimatedMinutes: number
  topicId?: string
}

interface DailyTask {
  id: string
  type: "vocab" | "grammar" | "listening" | "reading" | "speaking" | "writing"
  title: string
  link: string
  completed: boolean
  planId: string
}

interface TimeBlock {
  id: string
  day: string
  startTime: string
  endTime: string
  planId: string
  planName: string
}

export default function StudyPlanPage() {
  const { stats } = useAppStore()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    {
      id: "plan1",
      name: "IELTS Preparation",
      goal: "Achieve IELTS band 7.0",
      level: "B2",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-30"),
      totalHours: 200,
      studiedHours: 87,
      progress: 43.5,
      status: "active",
      units: [
        {
          id: "u1",
          title: "Travel Vocabulary",
          type: "vocab",
          completed: true,
          estimatedMinutes: 45,
          topicId: "1",
        },
        {
          id: "u2",
          title: "Food & Dining",
          type: "vocab",
          completed: true,
          estimatedMinutes: 50,
          topicId: "2",
        },
        {
          id: "u3",
          title: "Job Interview",
          type: "vocab",
          completed: false,
          estimatedMinutes: 60,
          topicId: "3",
        },
        { id: "u4", title: "Present Perfect Practice", type: "grammar", completed: false, estimatedMinutes: 40 },
        { id: "u5", title: "Listening Comprehension", type: "listening", completed: false, estimatedMinutes: 30 },
        { id: "u6", title: "Reading Practice", type: "reading", completed: false, estimatedMinutes: 35 },
      ],
    },
    {
      id: "plan2",
      name: "Business English",
      goal: "Master professional communication",
      level: "B1",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-05-31"),
      totalHours: 120,
      studiedHours: 34,
      progress: 28.3,
      status: "active",
      units: [
        {
          id: "u7",
          title: "Business Vocabulary",
          type: "vocab",
          completed: true,
          estimatedMinutes: 45,
          topicId: "3",
        },
        { id: "u8", title: "Email Writing", type: "writing", completed: false, estimatedMinutes: 40 },
        { id: "u9", title: "Presentation Skills", type: "speaking", completed: false, estimatedMinutes: 50 },
      ],
    },
  ])

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: "tb1",
      day: "Monday",
      startTime: "18:00",
      endTime: "19:00",
      planId: "plan1",
      planName: "IELTS Preparation",
    },
    {
      id: "tb2",
      day: "Wednesday",
      startTime: "18:00",
      endTime: "19:00",
      planId: "plan1",
      planName: "IELTS Preparation",
    },
    {
      id: "tb3",
      day: "Friday",
      startTime: "18:00",
      endTime: "19:00",
      planId: "plan2",
      planName: "Business English",
    },
  ])

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: "dt1", type: "vocab", title: "Learn 10 new words", link: "/vocab", completed: false, planId: "plan1" },
    {
      id: "dt2",
      type: "grammar",
      title: "Present Perfect exercises",
      link: "/grammar",
      completed: true,
      planId: "plan1",
    },
    {
      id: "dt3",
      type: "listening",
      title: "Listen to podcast",
      link: "/vocab/1",
      completed: false,
      planId: "plan1",
    },
    {
      id: "dt4",
      type: "speaking",
      title: "Practice presentation",
      link: "/speaking",
      completed: false,
      planId: "plan2",
    },
  ])

  const selectedPlan = studyPlans.find((p) => p.id === selectedPlanId) || studyPlans[0]
  const completedToday = dailyTasks.filter((t) => t.completed).length
  const totalToday = dailyTasks.length

  const typeIcons = {
    vocab: <BookOpen className="h-4 w-4" />,
    grammar: <PenTool className="h-4 w-4" />,
    listening: <Headphones className="h-4 w-4" />,
    reading: <BookOpen className="h-4 w-4" />,
    speaking: <Mic className="h-4 w-4" />,
    writing: <PenTool className="h-4 w-4" />,
  }

  const typeColors: Record<string, string> = {
    vocab: "bg-blue-100 text-blue-700",
    grammar: "bg-purple-100 text-purple-700",
    listening: "bg-orange-100 text-orange-700",
    reading: "bg-green-100 text-green-700",
    speaking: "bg-pink-100 text-pink-700",
    writing: "bg-indigo-100 text-indigo-700",
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8 text-[#C2E2FA]" />
          Study Plans
        </h1>
        <p className="text-muted-foreground mt-1">Manage your personalized learning paths</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Study Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Weekly Study Schedule</h2>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Weekly Overview Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-lg font-bold text-blue-600">8.5h</p>
              <p className="text-xs text-muted-foreground">Hours</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <p className="text-lg font-bold text-yellow-600">240</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="text-lg font-bold text-green-600">18</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <p className="text-lg font-bold text-red-600">1</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
          </div>

          {/* Calendar View */}
          <div className="border rounded-lg overflow-hidden">
            {/* Time slots */}
            <div className="grid grid-cols-8 border-b bg-secondary/30">
              <div className="p-2 text-xs font-semibold text-center">Time</div>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="p-2 text-xs font-semibold text-center border-l">
                  {day}
                </div>
              ))}
            </div>

            {/* Time rows */}
            {["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map((time) => (
              <div key={time} className="grid grid-cols-8 border-b min-h-[60px]">
                <div className="p-2 text-xs text-muted-foreground flex items-center justify-center bg-secondary/10">
                  {time}
                </div>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                  const block = timeBlocks.find((tb) => tb.day === day && tb.startTime === time)
                  return (
                    <div key={day} className="border-l p-1 hover:bg-secondary/20 cursor-pointer">
                      {block ? (
                        <div className="bg-[#C2E2FA]/40 border border-[#C2E2FA] rounded p-2 h-full">
                          <p className="text-xs font-medium truncate">{block.planName}</p>
                          <p className="text-xs text-muted-foreground">{block.startTime} - {block.endTime}</p>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Tasks */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Tasks</h3>
          <div className="space-y-2">
            {dailyTasks.map((task) => (
              <Link key={task.id} href={task.link}>
                <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 ${
                  task.completed ? "bg-secondary/30" : ""
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${typeColors[task.type]}`}>
                    {typeIcons[task.type]}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{completedToday}/{totalToday} completed</span>
            </div>
            <Progress value={(completedToday / totalToday) * 100} className="mt-2" />
          </div>

          {/* Daily Review SRS */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">Daily Review (SRS)</h4>
            <div className="text-center py-6 bg-[#C2E2FA]/10 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C2E2FA]/30 mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold mb-1">12</p>
              <p className="text-sm text-muted-foreground mb-3">cards due for review</p>
              <Link href="/notebook">
                <Button size="sm">
                  Start Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: My Study Plans */}
        <Card className="p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Study Plans</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Plan
            </Button>
          </div>

          <div className="space-y-3">
            {studyPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPlanId === plan.id || (!selectedPlanId && plan.id === studyPlans[0].id)
                    ? "border-[#C2E2FA] border-2 bg-[#C2E2FA]/5" 
                    : "hover:border-[#C2E2FA]/50"
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{plan.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      plan.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{plan.goal}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{Math.round(plan.progress)}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-1.5" />

                  <div className="flex items-center justify-between text-muted-foreground pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{plan.studiedHours}h / {plan.totalHours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{plan.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Study Plan Detail */}
        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Study Plan Detail</h2>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold">{selectedPlan.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{selectedPlan.goal}</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-2xl font-bold text-[#C2E2FA]">{Math.round(selectedPlan.progress)}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{selectedPlan.studiedHours}h</p>
              <p className="text-xs text-muted-foreground">Studied</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{selectedPlan.totalHours - selectedPlan.studiedHours}h</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{selectedPlan.level}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Study Content</h3>
            
            <div className="space-y-3">
              {selectedPlan.units.map((unit, index) => (
                <div
                  key={unit.id}
                  className={`flex items-start justify-between p-4 rounded-lg border ${
                    unit.completed ? "bg-green-50 border-green-200" : "bg-white hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-semibold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${unit.completed ? "text-green-700" : ""}`}>
                          {unit.title}
                        </h4>
                        {unit.completed && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${typeColors[unit.type]}`}>
                          {typeIcons[unit.type]}
                          {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {unit.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!unit.completed && (
                    <Link href={unit.topicId ? `/vocab/${unit.topicId}` : "/vocab"}>
                      <Button size="sm">
                        Start
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                  
                  {unit.completed && (
                    <Link href={unit.topicId ? `/vocab/${unit.topicId}` : "/vocab"}>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Study Plan Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Plan Name</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name}
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Daily Study Duration (minutes)</label>
                <input type="number" defaultValue={60} className="w-full px-3 py-2 rounded-lg border" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">New Lessons Per Week</label>
                <input type="number" defaultValue={5} className="w-full px-3 py-2 rounded-lg border" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowSettings(false)}>Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}