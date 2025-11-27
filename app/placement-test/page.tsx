"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  FileText,
  Headphones,
  MessageSquare,
  PenTool,
  BookMarked,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  PlayCircle,
  Volume2,
  Mic,
  MicOff,
  Home,
  Trophy,
  Target,
  TrendingUp,
  Award,
  RotateCcw,
  Highlighter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils" // Assuming cn is available for conditional styling

// Test steps in order
const TEST_STEPS = [
  {
    id: "vocabulary",
    label: "Vocabulary",
    icon: BookMarked,
    color: "emerald",
    description: "Test your word knowledge",
  },
  {
    id: "grammar",
    label: "Grammar",
    icon: BookOpen,
    color: "blue",
    description: "Assess grammar understanding",
  },
  {
    id: "reading",
    label: "Reading",
    icon: FileText,
    color: "amber",
    description: "Reading comprehension",
  },
  {
    id: "listening",
    label: "Listening",
    icon: Headphones,
    color: "purple",
    description: "Test listening skills",
  },
  {
    id: "speaking",
    label: "Speaking",
    icon: MessageSquare,
    color: "rose",
    description: "Assess speaking ability",
  },
  {
    id: "writing",
    label: "Writing",
    icon: PenTool,
    color: "cyan",
    description: "Evaluate writing skills",
  },
]

// Mock questions for each test
const mockQuestions: Record<
  string,
  Array<{
    id: number
    type: "multiple-choice" | "fill-blank" | "reading" | "listening" | "speaking" | "writing"
    question: string
    options?: string[]
    correctAnswer?: number | string
    passage?: string
    prompt?: string
  }>
> = {
  vocabulary: [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the synonym of 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Choose the correct word: 'The weather is ___ today.'",
      options: ["beauty", "beautiful", "beautifully", "beautify"],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "What does 'ubiquitous' mean?",
      options: ["Rare", "Present everywhere", "Ancient", "Modern"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "multiple-choice",
      question: "Select the antonym of 'generous':",
      options: ["Kind", "Selfish", "Wealthy", "Poor"],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "Which word means 'to make something better'?",
      options: ["Worsen", "Improve", "Destroy", "Ignore"],
      correctAnswer: 1,
    },
    { id: 6, type: "fill-blank", question: "Complete: 'She has a great ___ for music.'", correctAnswer: "talent" },
    {
      id: 7,
      type: "multiple-choice",
      question: "What is the meaning of 'inevitable'?",
      options: ["Avoidable", "Certain to happen", "Unlikely", "Impossible"],
      correctAnswer: 1,
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Choose the correct definition of 'pragmatic':",
      options: ["Idealistic", "Practical", "Romantic", "Theoretical"],
      correctAnswer: 1,
    },
  ],
  grammar: [
    {
      id: 1,
      type: "multiple-choice",
      question: "Choose the correct form: 'She ___ to school every day.'",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Select the correct sentence:",
      options: ["He don't like coffee", "He doesn't likes coffee", "He doesn't like coffee", "He not like coffee"],
      correctAnswer: 2,
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "Which is correct? 'I have been waiting ___ two hours.'",
      options: ["since", "for", "from", "during"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "multiple-choice",
      question: "Choose the correct past tense: 'Yesterday, I ___ a great movie.'",
      options: ["watch", "watched", "watching", "watches"],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "Select the correct conditional: 'If I ___ rich, I would travel.'",
      options: ["am", "was", "were", "be"],
      correctAnswer: 2,
    },
    {
      id: 6,
      type: "multiple-choice",
      question: "Which uses present perfect correctly?",
      options: ["I have see that", "I have saw that", "I have seen that", "I seen that"],
      correctAnswer: 2,
    },
    {
      id: 7,
      type: "multiple-choice",
      question: "Choose the correct article: '___ apple a day keeps the doctor away.'",
      options: ["A", "An", "The", "No article"],
      correctAnswer: 1,
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Select the correct passive: 'The cake ___ by my mother.'",
      options: ["baked", "was baked", "is bake", "baking"],
      correctAnswer: 1,
    },
  ],
  reading: [
    {
      id: 1,
      type: "reading",
      passage:
        "Climate change is one of the most pressing issues of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary cause.",
      question: "What is the main cause of climate change according to the passage?",
      options: ["Natural cycles", "Human activities", "Solar radiation", "Volcanic eruptions"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "reading",
      passage:
        "The invention of the printing press by Gutenberg in the 15th century revolutionized information spread. Before this, books were copied by hand, making them expensive and rare. The press made books cheaper and more accessible, increasing literacy rates.",
      question: "What was the main effect of the printing press?",
      options: [
        "Books became expensive",
        "Literacy rates increased",
        "Books were for wealthy",
        "Information spread slowly",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "reading",
      passage:
        "Sleep is essential for good health. During sleep, the body repairs tissues, consolidates memories, and releases growth hormones. Adults typically need 7-9 hours per night. Lack of sleep can lead to obesity, heart disease, and decreased cognitive function.",
      question: "How many hours of sleep do adults typically need?",
      options: ["5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "reading",
      passage:
        "The Great Barrier Reef, off Australia's coast, is the world's largest coral reef system stretching over 2,300 kilometers. It's home to thousands of marine species but is threatened by climate change, pollution, and overfishing.",
      question: "Where is the Great Barrier Reef located?",
      options: ["Caribbean Sea", "Mediterranean", "Off Australia", "Pacific Islands"],
      correctAnswer: 2,
    },
  ],
  listening: [
    {
      id: 1,
      type: "listening",
      question: "What time does the train depart?",
      options: ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "listening",
      question: "Where is the meeting being held?",
      options: ["Conference Room A", "Conference Room B", "Main Hall", "Office 201"],
      correctAnswer: 0,
    },
    {
      id: 3,
      type: "listening",
      question: "What does the speaker recommend?",
      options: ["Taking a break", "Working harder", "Changing jobs", "Getting more sleep"],
      correctAnswer: 3,
    },
    {
      id: 4,
      type: "listening",
      question: "How much does the item cost?",
      options: ["$15", "$25", "$35", "$45"],
      correctAnswer: 2,
    },
  ],
  speaking: [
    {
      id: 1,
      type: "speaking",
      prompt: "Introduce yourself and talk about your hobbies.",
      question: "Record your response (1-2 minutes)",
    },
    {
      id: 2,
      type: "speaking",
      prompt: "Describe your favorite place to visit and explain why.",
      question: "Record your response (1-2 minutes)",
    },
    {
      id: 3,
      type: "speaking",
      prompt: "Discuss the advantages and disadvantages of social media.",
      question: "Record your response (2-3 minutes)",
    },
  ],
  writing: [
    {
      id: 1,
      type: "writing",
      prompt: "Write a short paragraph (50-100 words) about your daily routine.",
      question: "Describe your typical day from morning to evening.",
    },
    {
      id: 2,
      type: "writing",
      prompt: "Write an email (100-150 words) inviting a friend to your birthday party.",
      question: "Include date, time, location, and special instructions.",
    },
    {
      id: 3,
      type: "writing",
      prompt: "Write a short essay (150-200 words) about learning a foreign language.",
      question: "Discuss at least two benefits of being bilingual.",
    },
  ],
}

// CEFR level calculation
const calculateCEFRLevel = (score: number): { level: string; description: string; color: string } => {
  if (score >= 90) return { level: "C2", description: "Proficient - Mastery", color: "text-emerald-600" }
  if (score >= 80) return { level: "C1", description: "Proficient - Advanced", color: "text-blue-600" }
  if (score >= 70) return { level: "B2", description: "Independent - Upper Intermediate", color: "text-cyan-600" }
  if (score >= 55) return { level: "B1", description: "Independent - Intermediate", color: "text-amber-600" }
  if (score >= 40) return { level: "A2", description: "Basic - Elementary", color: "text-orange-600" }
  return { level: "A1", description: "Basic - Beginner", color: "text-rose-600" }
}

export default function PlacementTestPage() {
  // Test state
  const [completedTests, setCompletedTests] = useState<string[]>([])
  const [testScores, setTestScores] = useState<Record<string, number>>({})
  const [activeTestId, setActiveTestId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [writingAnswer, setWritingAnswer] = useState("")
  const [fillBlankAnswer, setFillBlankAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Reading test state
  const [readingHighlights, setReadingHighlights] = useState<
    Array<{ start: number; end: number; color: "green" | "red"; type: "user" | "hint" }>
  >([])
  const [isHighlightMode, setIsHighlightMode] = useState(false)
  const [showReadingHint, setShowReadingHint] = useState(false)
  const [currentReadingQuestion, setCurrentReadingQuestion] = useState(0)
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>({})
  const [checkedReadingQuestions, setCheckedReadingQuestions] = useState<Set<number>>(new Set())
  const passageRef = useRef<HTMLDivElement>(null)

  const readingPassage = {
    title: "The Future of Renewable Energy",
    content: `The global transition to renewable energy sources has accelerated dramatically in recent years. Solar and wind power have become increasingly cost-competitive with traditional fossil fuels, leading many countries to revise their energy policies.

In 2023, renewable energy accounted for nearly 30% of global electricity generation, a significant increase from just 20% a decade earlier. This growth has been driven by technological improvements, government incentives, and growing public awareness of climate change.

Solar energy, in particular, has seen remarkable advances. The efficiency of photovoltaic cells has improved substantially, while manufacturing costs have decreased by over 80% since 2010. Many experts predict that solar power will become the cheapest source of electricity in most countries within the next decade.

Wind power has also experienced significant growth. Offshore wind farms, which can generate electricity more consistently due to stronger and more reliable winds at sea, have become increasingly popular in Europe and Asia. The United Kingdom, for example, now generates over 10% of its electricity from offshore wind.

However, the transition to renewable energy is not without challenges. The intermittent nature of solar and wind power requires significant investment in energy storage solutions. Battery technology has improved, but large-scale storage remains expensive. Grid infrastructure also needs substantial upgrades to handle the variable output of renewable sources.

Despite these challenges, the momentum toward renewable energy appears unstoppable. Major corporations, cities, and even entire nations have committed to achieving carbon neutrality by 2050 or earlier. This shift represents not just an environmental imperative but also an economic opportunity, with millions of jobs being created in the renewable energy sector worldwide.`,
    questions: [
      {
        question:
          "According to the passage, what percentage of global electricity was generated by renewable energy in 2023?",
        options: ["20%", "25%", "Nearly 30%", "35%"],
        correctAnswer: 2,
        explanation:
          "The passage states that 'In 2023, renewable energy accounted for nearly 30% of global electricity generation.'",
      },
      {
        question: "What has contributed to the decrease in solar energy costs?",
        options: [
          "Government regulations",
          "Improved efficiency and reduced manufacturing costs",
          "Increased fossil fuel prices",
          "International trade agreements",
        ],
        correctAnswer: 1,
        explanation:
          "The passage mentions that 'The efficiency of photovoltaic cells has improved substantially, while manufacturing costs have decreased by over 80% since 2010.'",
      },
      {
        question: "Why have offshore wind farms become popular?",
        options: [
          "They are cheaper to build",
          "They generate electricity more consistently",
          "They require less maintenance",
          "They are closer to cities",
        ],
        correctAnswer: 1,
        explanation:
          "The passage explains that offshore wind farms 'can generate electricity more consistently due to stronger and more reliable winds at sea.'",
      },
      {
        question: "What is mentioned as a major challenge for renewable energy?",
        options: [
          "Lack of public support",
          "High cost of solar panels",
          "The intermittent nature of solar and wind power",
          "Shortage of skilled workers",
        ],
        correctAnswer: 2,
        explanation:
          "The passage states that 'The intermittent nature of solar and wind power requires significant investment in energy storage solutions.'",
      },
      {
        question: "What does the passage suggest about the future of renewable energy?",
        options: [
          "It will likely fail due to high costs",
          "Only developed countries will adopt it",
          "The momentum toward it appears unstoppable",
          "It will remain a minor energy source",
        ],
        correctAnswer: 2,
        explanation:
          "The passage concludes that 'the momentum toward renewable energy appears unstoppable' with many commitments to carbon neutrality.",
      },
    ],
  }

  // Check if step is unlocked
  const isStepUnlocked = (stepId: string) => {
    const stepIndex = TEST_STEPS.findIndex((s) => s.id === stepId)
    if (stepIndex === 0) return true
    const prevStep = TEST_STEPS[stepIndex - 1]
    return completedTests.includes(prevStep.id)
  }

  // Check if step is completed
  const isStepCompleted = (stepId: string) => completedTests.includes(stepId)

  // Get active step index
  const activeStepIndex = TEST_STEPS.findIndex((s) => s.id === activeTestId)

  // Calculate overall progress
  const overallProgress = Math.round((completedTests.length / TEST_STEPS.length) * 100)

  // Calculate overall score
  const calculateOverallScore = () => {
    if (completedTests.length === 0) return 0
    const total = Object.values(testScores).reduce((a, b) => a + b, 0)
    return Math.round(total / completedTests.length)
  }

  // Handle starting a test
  const handleStartTest = (testId: string) => {
    if (!isStepUnlocked(testId)) return
    setActiveTestId(testId)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers({})
    setWritingAnswer("")
    setFillBlankAnswer("")
    // Reset reading-specific states if switching to reading test
    if (testId === "reading") {
      setCurrentReadingQuestion(0)
      setReadingAnswers({})
      setCheckedReadingQuestions(new Set())
      setReadingHighlights([])
      setIsHighlightMode(false)
      setShowReadingHint(false)
    }
  }

  // Handle answer selection
  const handleSelectAnswer = (answer: number | string) => {
    setSelectedAnswer(answer)
  }

  // Handle next question
  const handleNextQuestion = () => {
    const questions = mockQuestions[activeTestId!]
    const currentQ = questions[currentQuestion]

    let answerToSave: number | string | null = selectedAnswer
    if (currentQ.type === "fill-blank") answerToSave = fillBlankAnswer
    if (currentQ.type === "writing") answerToSave = writingAnswer
    if (currentQ.type === "speaking" && isRecording) answerToSave = "recorded"

    if (answerToSave !== null && answerToSave !== "") {
      const newAnswers = { ...answers, [currentQuestion]: answerToSave }
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setWritingAnswer("")
        setFillBlankAnswer("")
      } else {
        // Calculate score for this test
        let correct = 0
        Object.entries(newAnswers).forEach(([qIdx, ans]) => {
          const q = questions[Number(qIdx)]
          if (q.correctAnswer !== undefined && ans === q.correctAnswer) {
            correct++
          } else if (q.type === "speaking" || q.type === "writing") {
            correct += 0.7 // Partial credit for subjective
          } else if (q.type === "fill-blank" && typeof q.correctAnswer === "string") {
            if (String(ans).toLowerCase().trim() === q.correctAnswer.toLowerCase()) {
              correct++
            }
          }
        })
        const score = Math.round((correct / questions.length) * 100)

        setTestScores((prev) => ({ ...prev, [activeTestId!]: score }))
        setCompletedTests((prev) => [...prev, activeTestId!])

        // Check if all tests completed
        const newCompleted = [...completedTests, activeTestId!]
        if (newCompleted.length === TEST_STEPS.length) {
          setShowResults(true)
        }

        setActiveTestId(null)
      }
    }
  }

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] ?? null)
    }
  }

  // Toggle recording for speaking
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setSelectedAnswer("recorded")
      }, 3000)
    }
  }

  // Play audio for listening
  const playAudio = () => {
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 3000)
  }

  // Restart test
  const handleRestartTest = () => {
    setCompletedTests([])
    setTestScores({})
    setActiveTestId(null)
    setShowResults(false)
    setCurrentQuestion(0)
    setAnswers({})
    // Reset reading-specific states
    setCurrentReadingQuestion(0)
    setReadingAnswers({})
    setCheckedReadingQuestions(new Set())
    setReadingHighlights([])
    setIsHighlightMode(false)
    setShowReadingHint(false)
  }

  // Submit test (used for reading test completion)
  const handleSubmitTest = () => {
    if (activeTestId === "reading") {
      // Calculate score for reading test
      let correct = 0
      readingPassage.questions.forEach((_, idx) => {
        if (readingAnswers[idx] === readingPassage.questions[idx].correctAnswer) {
          correct++
        }
      })
      const score = Math.round((correct / readingPassage.questions.length) * 100)

      setTestScores((prev) => ({ ...prev, [activeTestId]: score }))
      setCompletedTests((prev) => [...prev, activeTestId])

      // Check if all tests completed
      const newCompleted = [...completedTests, activeTestId]
      if (newCompleted.length === TEST_STEPS.length) {
        setShowResults(true)
      }

      setActiveTestId(null)
    }
  }

  const handleTextSelection = () => {
    if (!isHighlightMode || !passageRef.current) return
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const range = selection.getRangeAt(0)
    const preSelectionRange = range.cloneRange()
    preSelectionRange.selectNodeContents(passageRef.current)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    const start = preSelectionRange.toString().length
    const end = start + range.toString().length

    setReadingHighlights((prev) => [
      ...prev.filter((h) => h.type === "user" && (h.end <= start || h.start >= end)),
      { start, end, color: "green", type: "user" },
    ])
    selection.removeAllRanges()
  }

  const renderHighlightedContent = () => {
    const content = readingPassage.content
    const segments: { text: string; highlight?: (typeof readingHighlights)[0] }[] = []
    let lastIndex = 0

    const sortedHighlights = [...readingHighlights].sort((a, b) => a.start - b.start)

    sortedHighlights.forEach((highlight) => {
      if (highlight.start > lastIndex) {
        segments.push({ text: content.slice(lastIndex, highlight.start) })
      }
      segments.push({ text: content.slice(highlight.start, highlight.end), highlight })
      lastIndex = highlight.end
    })

    if (lastIndex < content.length) {
      segments.push({ text: content.slice(lastIndex) })
    }

    return segments.map((segment, idx) => {
      if (segment.highlight) {
        return (
          <mark
            key={idx}
            className={cn(
              "px-0.5 rounded",
              segment.highlight.color === "green" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900",
            )}
          >
            {segment.text}
          </mark>
        )
      }
      return <span key={idx}>{segment.text}</span>
    })
  }

  const handleToggleReadingHint = () => {
    setShowReadingHint(!showReadingHint)
    if (!showReadingHint) {
      const questionWords = readingPassage.questions[currentReadingQuestion]?.question
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 4)
      const content = readingPassage.content.toLowerCase()
      const newHintHighlights: typeof readingHighlights = []

      questionWords?.forEach((word) => {
        let index = content.indexOf(word)
        while (index !== -1) {
          newHintHighlights.push({ start: index, end: index + word.length, color: "red", type: "hint" })
          index = content.indexOf(word, index + 1)
        }
      })
      setReadingHighlights((prev) => [...prev.filter((h) => h.type !== "hint"), ...newHintHighlights])
    } else {
      setReadingHighlights((prev) => prev.filter((h) => h.type !== "hint"))
    }
  }

  const handleReadingAnswer = (questionIdx: number, answerIdx: number) => {
    setReadingAnswers((prev) => ({ ...prev, [questionIdx]: answerIdx }))
  }

  const handleCheckReadingAnswer = () => {
    setCheckedReadingQuestions((prev) => new Set([...prev, currentReadingQuestion]))
  }

  const handleNextReadingQuestion = () => {
    if (currentReadingQuestion < readingPassage.questions.length - 1) {
      setCurrentReadingQuestion((prev) => prev + 1)
      setShowReadingHint(false)
      setReadingHighlights((prev) => prev.filter((h) => h.type === "user"))
    }
  }

  const handlePrevReadingQuestion = () => {
    if (currentReadingQuestion > 0) {
      setCurrentReadingQuestion((prev) => prev - 1)
      setShowReadingHint(false)
      setReadingHighlights((prev) => prev.filter((h) => h.type === "user"))
    }
  }

  const isReadingQuestionAnswered = currentReadingQuestion in readingAnswers
  const isReadingQuestionChecked = checkedReadingQuestions.has(currentReadingQuestion)
  const isReadingAnswerCorrect =
    readingAnswers[currentReadingQuestion] === readingPassage.questions[currentReadingQuestion]?.correctAnswer
  const allReadingQuestionsChecked = checkedReadingQuestions.size === readingPassage.questions.length

  // Function to render the content of the active test
  const renderTestContent = () => {
    if (!activeTestId) return null

    const testStep = TEST_STEPS.find((s) => s.id === activeTestId)!
    const questions = mockQuestions[activeTestId]
    const currentQ = questions[currentQuestion]
    const questionProgress = Math.round(((currentQuestion + 1) / questions.length) * 100)
    const Icon = testStep.icon

    if (activeTestId === "reading") {
      return renderReadingTest()
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Test Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTestId(null)}
                className="gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit Test
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 bg-${testStep.color}-100 dark:bg-${testStep.color}-900/30 rounded-xl flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 text-${testStep.color}-600`} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{testStep.label} Test</h1>
                <p className="text-sm text-gray-500">{testStep.description}</p>
              </div>
            </div>

            <Progress value={questionProgress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="p-6 rounded-2xl border-0 shadow-lg bg-white dark:bg-slate-800 mb-6">
            {/* Reading Passage */}
            {currentQ.type === "reading" && currentQ.passage && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentQ.passage}
              </div>
            )}

            {/* Listening Audio */}
            {currentQ.type === "listening" && (
              <div className="flex items-center justify-center mb-6">
                <Button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className={`gap-2 px-6 py-3 rounded-xl ${isPlaying ? "bg-blue-100 text-blue-600" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "Playing..." : "Play Audio"}
                </Button>
              </div>
            )}

            {/* Speaking Prompt */}
            {currentQ.type === "speaking" && currentQ.prompt && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl mb-6">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Prompt:</p>
                <p className="text-gray-700 dark:text-gray-300">{currentQ.prompt}</p>
              </div>
            )}

            {/* Writing Prompt */}
            {currentQ.type === "writing" && currentQ.prompt && (
              <div className="p-4 bg-cyan-50 dark:bg-cyan-900/30 rounded-xl mb-6">
                <p className="text-sm font-medium text-cyan-800 dark:text-cyan-300 mb-1">Task:</p>
                <p className="text-gray-700 dark:text-gray-300">{currentQ.prompt}</p>
              </div>
            )}

            {/* Question */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{currentQ.question}</h2>

            {/* Answer Options */}
            {currentQ.type === "multiple-choice" || currentQ.type === "reading" || currentQ.type === "listening" ? (
              <div className="space-y-3">
                {currentQ.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAnswer === idx
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          selectedAnswer === idx
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : currentQ.type === "fill-blank" ? (
              <Input
                value={fillBlankAnswer}
                onChange={(e) => setFillBlankAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="h-12 rounded-xl"
              />
            ) : currentQ.type === "speaking" ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={toggleRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500 animate-pulse"
                      : selectedAnswer === "recorded"
                        ? "bg-green-500"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : selectedAnswer === "recorded" ? (
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
                <p className="text-sm text-gray-500">
                  {isRecording
                    ? "Recording... Click to stop"
                    : selectedAnswer === "recorded"
                      ? "Recording saved!"
                      : "Click to start recording"}
                </p>
              </div>
            ) : currentQ.type === "writing" ? (
              <Textarea
                value={writingAnswer}
                onChange={(e) => setWritingAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="min-h-[200px] rounded-xl"
              />
            ) : null}
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="gap-2 rounded-xl bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={
                ((currentQ.type === "multiple-choice" ||
                  currentQ.type === "reading" ||
                  currentQ.type === "listening") &&
                  selectedAnswer === null) ||
                (currentQ.type === "fill-blank" && !fillBlankAnswer) ||
                (currentQ.type === "writing" && !writingAnswer) ||
                (currentQ.type === "speaking" && selectedAnswer !== "recorded")
              }
              className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestion === questions.length - 1 ? "Complete Test" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderReadingTest = () => {
    const currentQ = readingPassage.questions[currentReadingQuestion]

    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Left Column - Reading Passage */}
          <Card className="p-6 space-y-4 lg:sticky lg:top-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{readingPassage.title}</h2>
              <Button
                variant={isHighlightMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsHighlightMode(!isHighlightMode)}
                className="gap-2"
              >
                <Highlighter className="h-4 w-4" />
                {isHighlightMode ? "Highlighting" : "Highlight"}
              </Button>
            </div>

            <div
              ref={passageRef}
              onMouseUp={handleTextSelection}
              className={cn(
                "prose prose-sm max-w-none dark:prose-invert",
                isHighlightMode ? "cursor-text select-text" : "select-none",
              )}
            >
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {renderHighlightedContent()}
              </p>
            </div>
          </Card>

          {/* Right Column - Questions */}
          <Card className="p-6 space-y-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                  {currentReadingQuestion + 1}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Question</h3>
              </div>
              <Button variant="outline" size="sm" onClick={handleToggleReadingHint}>
                {showReadingHint ? "Hide Hint" : "Show Hint"}
              </Button>
            </div>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentQ?.question}</p>

            {showReadingHint && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
                <p className="font-semibold mb-1">Hint:</p>
                <p>{currentQ?.explanation}</p>
              </div>
            )}

            <div className="space-y-2 flex-1">
              {currentQ?.options?.map((option, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleReadingAnswer(currentReadingQuestion, optIdx)}
                  disabled={isReadingQuestionChecked}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-colors text-sm",
                    readingAnswers[currentReadingQuestion] === optIdx
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-slate-200 hover:border-blue-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700",
                    isReadingQuestionChecked && optIdx === currentQ.correctAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                      : "",
                    isReadingQuestionChecked &&
                      readingAnswers[currentReadingQuestion] === optIdx &&
                      !isReadingAnswerCorrect
                      ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                      : "",
                  )}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                  {option}
                </button>
              ))}
            </div>

            {isReadingQuestionChecked && (
              <div
                className={cn(
                  "p-4 rounded-lg flex items-start gap-3",
                  isReadingAnswerCorrect
                    ? "bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-700"
                    : "bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-700",
                )}
              >
                {isReadingAnswerCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  <p
                    className={cn(
                      "font-semibold",
                      isReadingAnswerCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400",
                    )}
                  >
                    {isReadingAnswerCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{currentQ?.explanation}</p>
                </div>
              </div>
            )}

            {!isReadingQuestionChecked && isReadingQuestionAnswered && (
              <Button onClick={handleCheckReadingAnswer} className="w-full bg-blue-600 hover:bg-blue-700">
                Check Answer
              </Button>
            )}

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
              <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentReadingQuestion + 1) / readingPassage.questions.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevReadingQuestion}
                  disabled={currentReadingQuestion === 0}
                  className="gap-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm font-medium px-4 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300">
                  {currentReadingQuestion + 1} / {readingPassage.questions.length}
                </span>

                {currentReadingQuestion === readingPassage.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitTest}
                    disabled={!allReadingQuestionsChecked}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    Finish Test
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNextReadingQuestion} disabled={!isReadingQuestionChecked} className="gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Results Page
  if (showResults) {
    const overallScore = calculateOverallScore()
    const cefrResult = calculateCEFRLevel(overallScore)

    const radarData = TEST_STEPS.map((step) => ({
      skill: step.label,
      score: testScores[step.id] || 0,
      fullMark: 100,
    }))

    const barData = TEST_STEPS.map((step) => ({
      name: step.label,
      score: testScores[step.id] || 0,
    }))

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Test Completed!</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's your comprehensive English assessment</p>
          </div>

          {/* CEFR Level Card */}
          <Card className="p-8 mb-8 rounded-2xl border-0 shadow-xl bg-white dark:bg-slate-800 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your CEFR Level</h2>
            </div>
            <div className={`text-7xl font-black ${cefrResult.color} mb-2`}>{cefrResult.level}</div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{cefrResult.description}</p>
            <div className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-full px-6 py-3 inline-flex">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-600">Overall Score: {overallScore}%</span>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Radar Chart */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-white dark:bg-slate-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Skills Overview
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar Chart */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-white dark:bg-slate-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Score by Skill
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Detailed Scores */}
          <Card className="p-6 rounded-2xl border-0 shadow-lg bg-white dark:bg-slate-800 mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Detailed Scores</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEST_STEPS.map((step) => {
                const score = testScores[step.id] || 0
                const Icon = step.icon
                const skillCefr = calculateCEFRLevel(score)
                return (
                  <div key={step.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 bg-${step.color}-100 dark:bg-${step.color}-900/30 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 text-${step.color}-600`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{step.label}</p>
                        <p className={`text-sm font-medium ${skillCefr.color}`}>{skillCefr.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Score</span>
                      <span className="font-bold text-gray-900 dark:text-white">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleRestartTest} variant="outline" className="gap-2 px-6 py-3 rounded-xl bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </Button>
            <Link href="/">
              <Button className="gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Active Test View
  if (activeTestId) {
    return renderTestContent()
  }

  // Main Test Selection with Progress Stepper
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">English Placement Test</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete each test in order to receive your comprehensive English level assessment.
          </p>
        </div>

        <Card className="p-6 mb-8 rounded-2xl border-0 shadow-lg bg-white dark:bg-slate-800">
          {/* Header with title and percentage */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Overall Progress</h2>
              <p className="text-sm text-gray-500 mt-1">
                {completedTests.length} of {TEST_STEPS.length} tests completed
              </p>
            </div>
            <span className="text-3xl font-bold text-blue-600">{overallProgress}%</span>
          </div>

          {/* Progress Stepper */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 mx-12" />
            <div
              className="absolute top-8 left-0 h-1 bg-blue-500 mx-12 transition-all duration-500"
              style={{ width: `calc(${(completedTests.length / TEST_STEPS.length) * 100}% - 6rem)` }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {TEST_STEPS.map((step, index) => {
                const Icon = step.icon
                const isCompleted = isStepCompleted(step.id)
                const isUnlocked = isStepUnlocked(step.id)
                const isNext = !isCompleted && isUnlocked

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => isUnlocked && handleStartTest(step.id)}
                      disabled={!isUnlocked}
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                        ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isNext
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110 cursor-pointer hover:bg-blue-700"
                              : isUnlocked
                                ? "bg-white border-blue-200 text-blue-600 hover:border-blue-400 cursor-pointer"
                                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-7 w-7" />
                      ) : isNext ? (
                        <PlayCircle className="h-7 w-7" />
                      ) : !isUnlocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </button>
                    <span
                      className={`
                      text-xs font-medium text-center transition-colors duration-300
                      ${isNext ? "text-blue-700 font-bold" : isUnlocked ? "text-slate-600" : "text-gray-400"}
                    `}
                    >
                      {step.label}
                    </span>
                    {isCompleted && testScores[step.id] !== undefined && (
                      <span className="text-xs font-bold text-green-600">{testScores[step.id]}%</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Test Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEST_STEPS.map((step, index) => {
            const Icon = step.icon
            const isCompleted = isStepCompleted(step.id)
            const isUnlocked = isStepUnlocked(step.id)
            const isNext = !isCompleted && isUnlocked
            const questions = mockQuestions[step.id]

            return (
              <Card
                key={step.id}
                onClick={() => isUnlocked && !isCompleted && handleStartTest(step.id)}
                className={`p-5 rounded-2xl border-0 shadow-md transition-all ${
                  isCompleted
                    ? "bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500"
                    : isNext
                      ? "bg-white dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1 cursor-pointer ring-2 ring-blue-500"
                      : isUnlocked
                        ? "bg-white dark:bg-slate-800 hover:shadow-lg cursor-pointer"
                        : "bg-gray-100 dark:bg-slate-800/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCompleted ? "bg-green-100" : `bg-${step.color}-100 dark:bg-${step.color}-900/30`
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : !isUnlocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Icon className={`w-6 h-6 text-${step.color}-600`} />
                    )}
                  </div>
                  {isNext && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">START</span>
                  )}
                  {isCompleted && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                      {testScores[step.id]}%
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{step.label}</h3>
                <p className="text-sm text-gray-500 mb-3">{step.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{questions.length} questions</span>
                  <span>~{Math.round(questions.length * 1.5)} mins</span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
