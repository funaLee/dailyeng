"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { Calendar, Zap, CheckCircle2, Circle, Flame, BookOpen, ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createStudyPlanAction } from "@/app/actions/study-plan"
import type { StudyPlanData } from "@/app/actions/study-plan"
import { mockTopics } from "@/lib/mock-data"

interface Task {
  id: string
  date: Date
  type: "vocab" | "grammar" | "speaking" | "listening"
  title: string
  link: string
  completed: boolean
}

const placementTestQuestions = [
  {
    id: 1,
    question: "What is the correct form: 'She ___ to work every day.'",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: "goes",
    level: "A1",
  },
  {
    id: 2,
    question: "Choose the correct word: 'I ___ a book yesterday.'",
    options: ["read", "readed", "reading", "reads"],
    correctAnswer: "read",
    level: "A2",
  },
  {
    id: 3,
    question: "Complete: 'If I ___ you, I would study harder.'",
    options: ["am", "was", "were", "be"],
    correctAnswer: "were",
    level: "B1",
  },
  {
    id: 4,
    question: "What does 'procrastinate' mean?",
    options: ["To delay doing something", "To finish quickly", "To work hard", "To celebrate success"],
    correctAnswer: "To delay doing something",
    level: "B1",
  },
  {
    id: 5,
    question: "Choose the correct phrase: 'The meeting has been ___.'",
    options: ["put off", "put up", "put on", "put down"],
    correctAnswer: "put off",
    level: "B2",
  },
  {
    id: 6,
    question: "What is a synonym for 'meticulous'?",
    options: ["Careless", "Detailed", "Quick", "Simple"],
    correctAnswer: "Detailed",
    level: "B2",
  },
  {
    id: 7,
    question: "Complete: 'Despite ___ tired, she continued working.'",
    options: ["being", "be", "been", "to be"],
    correctAnswer: "being",
    level: "B1",
  },
  {
    id: 8,
    question: "Which sentence is correct?",
    options: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She not like coffee"],
    correctAnswer: "She doesn't like coffee",
    level: "A1",
  },
]

export default function StudyPlanPage() {
  const router = useRouter()
  const { stats } = useAppStore()
  const [plan, setPlan] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)

  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState({
    goal: "",
    level: "",
    interests: [] as string[],
    minutesPerDay: 30,
    wordsPerDay: 12,
  })
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({})
  const [testCompleted, setTestCompleted] = useState(false)
  const [calculatedLevel, setCalculatedLevel] = useState<string>("")

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

  const evaluatePlacementTest = () => {
    let correctCount = 0
    placementTestQuestions.forEach((q) => {
      if (testAnswers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const percentage = (correctCount / placementTestQuestions.length) * 100
    let level = "A1"

    if (percentage >= 90) {
      level = "B2"
    } else if (percentage >= 70) {
      level = "B1"
    } else if (percentage >= 50) {
      level = "A2"
    } else {
      level = "A1"
    }

    setCalculatedLevel(level)
    setWizardData({ ...wizardData, level })
    setTestCompleted(true)
  }

  const handleNext = () => {
    if (currentStep === 1 && !testCompleted) {
      evaluatePlacementTest()
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleWizardSubmit = async () => {
    try {
  const result = await createStudyPlanAction(wizardData as StudyPlanData)

      if (result.success) {
        localStorage.setItem("studyPlan", JSON.stringify(result.plan))
        setPlan(result.plan)
        generateTasks(result.plan)
        setShowOnboarding(false)
        router.push("/profile")
      }
    } catch (error) {
      console.error("Error creating study plan:", error)
    }
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
    const goalOptions = [
      { value: "conversation", label: "Daily Conversation", desc: "Learn to chat comfortably" },
      { value: "travel", label: "Travel", desc: "Navigate foreign countries" },
      { value: "work", label: "Work", desc: "Professional communication" },
      { value: "exam", label: "Exam", desc: "IELTS, TOEIC, Cambridge" },
    ]

    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Build Your Study Plan</h1>
          <p className="text-muted-foreground">Let's personalize your learning journey</p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step === currentStep ? "w-8 bg-primary" : step < currentStep ? "w-2 bg-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep + 1} of 4</p>
        </div>

        <Card className="p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">What's your learning goal?</h2>
                <div className="space-y-3">
                  {goalOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                        wizardData.goal === option.value ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={option.value}
                        checked={wizardData.goal === option.value}
                        onChange={(e) => setWizardData({ ...wizardData, goal: e.target.value })}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                      {wizardData.goal === option.value && <Check className="h-5 w-5 text-primary" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Mini Placement Test</h2>
                <p className="text-muted-foreground mb-6">Answer these questions to determine your level (A1-B2)</p>

                {!testCompleted ? (
                  <div className="space-y-4">
                    {placementTestQuestions.map((q) => (
                      <div key={q.id} className="p-4 border rounded-lg">
                        <p className="font-medium mb-3">
                          {q.id}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <label
                              key={option}
                              className={`flex items-center p-2 border rounded cursor-pointer transition-all hover:bg-secondary ${
                                testAnswers[q.id] === option ? "border-primary bg-primary/5" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={option}
                                checked={testAnswers[q.id] === option}
                                onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                                className="mr-3"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Test Completed!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your level: <span className="font-bold text-primary">{calculatedLevel}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Click Next to continue building your study plan</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Select Your Interests</h2>
                <p className="text-muted-foreground mb-4">Choose topics you'd like to learn (at least 1)</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mockTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        setWizardData((prev) => ({
                          ...prev,
                          interests: prev.interests.includes(topic.id)
                            ? prev.interests.filter((i) => i !== topic.id)
                            : [...prev.interests, topic.id],
                        }))
                      }}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        wizardData.interests.includes(topic.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-input hover:border-primary"
                      }`}
                    >
                      <p className="font-medium">{topic.title}</p>
                      <p className="text-xs opacity-80 mt-1">{topic.level}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Set Your Schedule</h2>

                {/* Minutes per day slider */}
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-3">
                    Minutes per day: {wizardData.minutesPerDay} min
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="10"
                    value={wizardData.minutesPerDay}
                    onChange={(e) => setWizardData({ ...wizardData, minutesPerDay: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>10 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* Words per day radio */}
                <div>
                  <label className="text-sm font-medium block mb-3">Words per day:</label>
                  <div className="space-y-2">
                    {[
                      { value: 8, label: "8 words", desc: "Light pace" },
                      { value: 12, label: "12 words", desc: "Moderate pace" },
                      { value: 20, label: "20 words", desc: "Intensive pace" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                          wizardData.wordsPerDay === option.value ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="wordsPerDay"
                          value={option.value}
                          checked={wizardData.wordsPerDay === option.value}
                          onChange={(e) =>
                            setWizardData({ ...wizardData, wordsPerDay: Number.parseInt(e.target.value) })
                          }
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <ul className="text-sm space-y-1">
                    <li>Goal: {goalOptions.find((g) => g.value === wizardData.goal)?.label}</li>
                    <li>Level: {wizardData.level}</li>
                    <li>Topics: {wizardData.interests.length} selected</li>
                    <li>
                      Daily: {wizardData.minutesPerDay} min, {wizardData.wordsPerDay} words
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !wizardData.goal) ||
                  (currentStep === 1 && Object.keys(testAnswers).length < placementTestQuestions.length) ||
                  (currentStep === 2 && wizardData.interests.length === 0)
                }
              >
                {currentStep === 1 && !testCompleted ? "Submit Test" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleWizardSubmit}>
                Create Study Plan
                <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
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
                  <option value="conversation">Daily Conversation</option>
                  <option value="travel">Travel</option>
                  <option value="work">Work</option>
                  <option value="exam">Exam</option>
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
