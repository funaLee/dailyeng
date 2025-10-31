"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { Calendar, Zap, CheckCircle2, Circle, Flame, BookOpen } from "lucide-react"
import Link from "next/link"

interface Task {
  id: string
  date: Date
  type: "vocab" | "grammar" | "speaking" | "listening"
  title: string
  link: string
  completed: boolean
}

export default function StudyPlanPage() {
  const { stats } = useAppStore()
  const [plan, setPlan] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState({
    goal: "intermediate",
    level: "A2",
    minutesPerDay: 30,
    interests: [] as string[],
  })

  useEffect(() => {
    const savedPlan = localStorage.getItem("studyPlan")
    if (!savedPlan) {
      setShowOnboarding(true)
    } else {
      const parsedPlan = JSON.parse(savedPlan)
      setPlan(parsedPlan)
      generateTasks(parsedPlan)
    }
  }, [])

  const generateTasks = (planData: any) => {
    const mockTasks: Task[] = []
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const types: Array<"vocab" | "grammar" | "speaking" | "listening"> = ["vocab", "grammar", "speaking", "listening"]
      const titles: Record<string, string> = {
        vocab: "Learn 5 new words",
        grammar: "Study present perfect",
        speaking: "Practice pronunciation",
        listening: "Listen to podcast",
      }
      const links: Record<string, string> = {
        vocab: "/vocab",
        grammar: "/vocab",
        speaking: "/speaking",
        listening: "/vocab",
      }

      types.forEach((type) => {
        mockTasks.push({
          id: `task-${i}-${type}`,
          date,
          type,
          title: titles[type],
          link: links[type],
          completed: i > 0 || Math.random() > 0.3,
        })
      })
    }
    setTasks(mockTasks)
  }

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPlan = {
      goal: onboardingData.goal,
      level: onboardingData.level,
      minutesPerDay: onboardingData.minutesPerDay,
      interests: onboardingData.interests,
      startDate: new Date(),
    }
    localStorage.setItem("studyPlan", JSON.stringify(newPlan))
    setPlan(newPlan)
    generateTasks(newPlan)
    setShowOnboarding(false)
  }

  const todayTasks = tasks.filter((t) => {
    const taskDate = new Date(t.date)
    const today = new Date()
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    )
  })

  const completedToday = todayTasks.filter((t) => t.completed).length
  const completionRate = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0

  const typeColors: Record<string, string> = {
    vocab: "bg-blue-100 text-blue-700",
    grammar: "bg-purple-100 text-purple-700",
    speaking: "bg-green-100 text-green-700",
    listening: "bg-orange-100 text-orange-700",
  }

  const typeIcons: Record<string, string> = {
    vocab: "📚",
    grammar: "✏️",
    speaking: "🎤",
    listening: "👂",
  }

  if (showOnboarding) {
    const interestOptions = ["Travel", "Food", "Business", "Entertainment", "Sports", "Technology"]

    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Learning Journey! 🚀</h1>
          <p className="text-muted-foreground">Let's set up your personalized study plan</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            {/* Goal Selection */}
            <div>
              <label className="text-sm font-semibold block mb-3">What's your learning goal?</label>
              <div className="space-y-2">
                {[
                  { value: "casual", label: "Casual Learner", desc: "Learn at your own pace" },
                  { value: "intermediate", label: "Intermediate", desc: "Consistent daily practice" },
                  { value: "fluent", label: "Fluent Speaker", desc: "Intensive daily training" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary"
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={option.value}
                      checked={onboardingData.goal === option.value}
                      onChange={(e) => setOnboardingData({ ...onboardingData, goal: e.target.value })}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <label className="text-sm font-semibold block mb-3">What's your current level?</label>
              <select
                value={onboardingData.level}
                onChange={(e) => setOnboardingData({ ...onboardingData, level: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
              </select>
            </div>

            {/* Time Slider */}
            <div>
              <label className="text-sm font-semibold block mb-3">
                How many minutes per day? ({onboardingData.minutesPerDay} min)
              </label>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={onboardingData.minutesPerDay}
                onChange={(e) =>
                  setOnboardingData({ ...onboardingData, minutesPerDay: Number.parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>15 min</span>
                <span>120 min</span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-sm font-semibold block mb-3">What interests you? (Select at least one)</label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      setOnboardingData((prev) => ({
                        ...prev,
                        interests: prev.interests.includes(interest)
                          ? prev.interests.filter((i) => i !== interest)
                          : [...prev.interests, interest],
                      }))
                    }}
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      onboardingData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input hover:border-primary"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={onboardingData.interests.length === 0} className="w-full" size="lg">
              Start Learning
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Calendar className="h-8 w-8 text-blue-500" />
          Study Plan
        </h1>
        <p className="text-muted-foreground">Stay on track with your personalized learning schedule</p>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Today Tab */}
        <TabsContent value="today" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">SRS Due</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Weekly Streak</p>
                  <p className="text-2xl font-bold">{stats?.streak || 0} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">XP Earned</p>
                  <p className="text-2xl font-bold">{stats?.xp || 0}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </Card>
          </div>

          {/* Progress Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Progress</h3>
              <span className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {completedToday} of {todayTasks.length} tasks completed
            </p>
          </Card>

          {/* Today's Tasks */}
          <div className="space-y-3">
            <h3 className="font-semibold">Today's Tasks</h3>
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <Link key={task.id} href={task.link}>
                  <Card
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      task.completed ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="flex-shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${typeColors[task.type]}`}>
                        {typeIcons[task.type]} {task.type}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks for today. Great job!</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Week Tab */}
        <TabsContent value="week" className="space-y-6">
          <div className="grid md:grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
              const date = new Date()
              date.setDate(date.getDate() - ((new Date().getDay() - 1 + 7) % 7) + idx)

              const dayTasks = tasks.filter((t) => {
                const taskDate = new Date(t.date)
                return (
                  taskDate.getDate() === date.getDate() &&
                  taskDate.getMonth() === date.getMonth() &&
                  taskDate.getFullYear() === date.getFullYear()
                )
              })

              const completed = dayTasks.filter((t) => t.completed).length
              const total = dayTasks.length

              return (
                <Card key={day} className="p-4 text-center">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{day}</p>
                  <p className="text-2xl font-bold mb-2">{date.getDate()}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {completed}/{total}
                    </p>
                    <div className="w-full bg-secondary rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full"
                        style={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Weekly Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Weekly Summary</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-3xl font-bold text-blue-500">
                  {tasks.filter((t) => t.type === "vocab" && t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Vocab Tasks</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-500">
                  {tasks.filter((t) => t.type === "grammar" && t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Grammar Tasks</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500">
                  {tasks.filter((t) => t.type === "speaking" && t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Speaking Tasks</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">
                  {tasks.filter((t) => t.type === "listening" && t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Listening Tasks</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Learning Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Goal</label>
                <select
                  defaultValue={plan.goal}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="casual">Casual Learner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="fluent">Fluent Speaker</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Current Level</label>
                <select
                  defaultValue={plan.level}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Minutes per Day</label>
                <input
                  type="number"
                  defaultValue={plan.minutesPerDay}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button className="w-full">Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
