"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SessionChat } from "@/components/speaking/session-chat"
import { SessionTranscript } from "@/components/speaking/session-transcript"
import { RadarChart } from "@/components/speaking/radar-chart"
import { LearningHistory } from "@/components/speaking/learning-history"
import { DetailedFeedback } from "@/components/speaking/detailed-feedback"
import { mockSpeakingScenarios, mockSpeakingTurns, mockCustomScenarios } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Download,
  Play,
  RotateCcw,
  User,
  Bot,
  Volume2,
  Copy,
  Check,
  Mic,
  MoreVertical,
  RefreshCw,
  MicOff,
  Target,
  Mic2,
  AudioWaveform as Waveform,
  Zap,
  Languages,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import VocabHelperChatbot from "@/components/speaking/vocab-helper-chatbot"

interface Turn {
  id: string
  role: "user" | "tutor"
  text: string
  timestamp: Date
  scores?: {
    pronunciation?: number
    fluency?: number
    grammar?: number
    content?: number
  }
}

type ViewState = "preparation" | "active" | "complete" | "history" | "detail"

const mockLearningRecords = [
  {
    id: "record-1",
    overallScore: 74,
    completedTurns: 2,
    totalTurns: 3,
    date: new Date("2025-07-28T00:30:00"),
  },
  {
    id: "record-2",
    overallScore: 36,
    completedTurns: 2,
    totalTurns: 3,
    date: new Date("2025-07-28T06:50:00"),
  },
  {
    id: "record-3",
    overallScore: 18,
    completedTurns: 2,
    totalTurns: 3,
    date: new Date("2025-07-28T09:53:00"),
  },
]

const mockDetailedFeedback = {
  scores: [
    { label: "Relevance", value: 86, icon: <Target className="h-4 w-4" /> },
    { label: "Pronunciation", value: 90, icon: <Mic2 className="h-4 w-4" /> },
    { label: "Intonation & Stress", value: 71, icon: <Waveform className="h-4 w-4" /> },
    { label: "Fluency", value: 80, icon: <Zap className="h-4 w-4" /> },
    { label: "Grammar", value: 85, icon: <Languages className="h-4 w-4" /> },
  ],
  errorCategories: [
    { name: "Prepositions", count: 10 },
    { name: "Articles", count: 3 },
    { name: "Verb Tense Conjugation", count: 7 },
    { name: "Adjective Choice", count: 9 },
    { name: "Verb Choice", count: 1 },
  ],
  conversation: [
    {
      role: "tutor" as const,
      text: "Ugh, this room feels smaller every day. No light, no space. I'm so over it. I need a real house with actual windows and breathing room!",
    },
    {
      role: "user" as const,
      text: "Same for me. Actually, I feel dizzy with this such small room already, and I need [...] small hug house with a swimming pool working closes and also the home theater.",
      userErrors: [
        { word: "with", correction: "in", type: "Prepositions" },
        { word: "such", correction: "this", type: "Articles" },
        { word: "working", correction: "that", type: "Verb Choice" },
        { word: "the", correction: "a", type: "Articles" },
      ],
      correctedSentence:
        "Same for me. Actually, I feel dizzy in this small room already, and I need a small hug house with a swimming pool that closes and also a home theater.",
      audioUrl: "/audio/user-response.mp3",
    },
  ],
  overallRating: "Good",
  tip: "Your grammar needs improvement. Please pay attention to tenses, types, and sentence structure. Keep trying!",
}

export default function SpeakingSessionPage() {
  const params = useParams()
  const router = useRouter()
  const { addFlashcard, addXP } = useAppStore()
  const scenarioId = params.id as string

  const [scenario, setScenario] = useState<any>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [viewState, setViewState] = useState<ViewState>("preparation")
  const [sessionStats, setSessionStats] = useState({
    avgPronunciation: 0,
    avgFluency: 0,
    avgGrammar: 0,
    avgContent: 0,
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  useEffect(() => {
    const allScenarios = Object.values(mockSpeakingScenarios)
      .reduce((acc, curr) => [...acc, ...curr], [])
      .concat(mockCustomScenarios)

    console.log("Looking for scenarioId:", scenarioId)
    console.log(
      "Available scenarios:",
      allScenarios.map((s) => s.id),
    )

    let found = allScenarios.find((s) => s.id === scenarioId)

    if (!found) {
      const numeric = Number.parseInt(scenarioId, 10)
      if (!isNaN(numeric) && numeric > 0 && numeric <= allScenarios.length) {
        found = allScenarios[numeric - 1]
        console.log("Found by numeric index:", numeric - 1, found?.id)
      }
    }

    if (!found) {
      const normalized = (id: string) => id.replace(/[-_]/g, "").toLowerCase()
      const normalizedScenarioId = normalized(scenarioId)
      found = allScenarios.find((s) => {
        const match = normalized(s.id) === normalizedScenarioId
        if (match) console.log("Found by loose match:", s.id)
        return match
      })
    }

    if (!found) {
      console.warn(
        "Speaking scenario not found for id:",
        scenarioId,
        "available:",
        allScenarios.map((s) => s.id),
      )
    } else {
      console.log("Successfully found scenario:", found.title)
    }

    setScenario(found)

    setTurns(mockSpeakingTurns.session1 as Turn[])
    calculateStats(mockSpeakingTurns.session1 as Turn[])
  }, [scenarioId])

  const calculateStats = (allTurns: Turn[]) => {
    const allScores = allTurns.filter((t) => t.scores)
    if (allScores.length > 0) {
      const avgPronunciation = allScores.reduce((sum, t) => sum + (t.scores?.pronunciation || 0), 0) / allScores.length
      const avgFluency = allScores.reduce((sum, t) => sum + (t.scores?.fluency || 0), 0) / allScores.length
      const avgGrammar = allScores.reduce((sum, t) => sum + (t.scores?.grammar || 0), 0) / allScores.length
      const avgContent = allScores.reduce((sum, t) => sum + (t.scores?.content || 0), 0) / allScores.length

      setSessionStats({
        avgPronunciation: Math.round(avgPronunciation * 10) / 10,
        avgFluency: Math.round(avgFluency * 10) / 10,
        avgGrammar: Math.round(avgGrammar * 10) / 10,
        avgContent: Math.round(avgContent * 10) / 10,
      })
    }
  }

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        const newTurn: Turn = {
          id: `t${turns.length + 1}`,
          role: "user",
          text: "I would like a window seat if possible, and I have a vegetarian meal preference.",
          timestamp: new Date(),
          scores: {
            pronunciation: 8.5,
            fluency: 8,
            grammar: 8.5,
            content: 8,
          },
        }
        const updatedTurns = [...turns, newTurn]
        setTurns(updatedTurns)
        calculateStats(updatedTurns)

        setTimeout(() => {
          const tutorTurn: Turn = {
            id: `t${updatedTurns.length + 1}`,
            role: "tutor",
            text: "Excellent! I've noted your preferences. Your window seat is confirmed, and I've added a vegetarian meal to your booking. Your flight departs at 10:30 AM. Have a great trip!",
            timestamp: new Date(),
            scores: {
              pronunciation: 9,
              fluency: 9,
              grammar: 9,
              content: 9,
            },
          }
          const finalTurns = [...updatedTurns, tutorTurn]
          setTurns(finalTurns)
          calculateStats(finalTurns)

          if (finalTurns.length >= 6) {
            setViewState("complete")
            addXP(50)
          }
        }, 1000)
      }, 2000)
    }
  }

  const handleSendMessage = (text: string) => {
    const newTurn: Turn = {
      id: `t${turns.length + 1}`,
      role: "user",
      text,
      timestamp: new Date(),
      scores: {
        pronunciation: 7.5 + Math.random() * 2,
        fluency: 7 + Math.random() * 2,
        grammar: 7.5 + Math.random() * 2,
        content: 8 + Math.random() * 1.5,
      },
    }
    const updatedTurns = [...turns, newTurn]
    setTurns(updatedTurns)
    calculateStats(updatedTurns)

    setTimeout(() => {
      const tutorTurn: Turn = {
        id: `t${updatedTurns.length + 1}`,
        role: "tutor",
        text: "That's a great point! Let me help you with that. Could you tell me more about what you mean?",
        timestamp: new Date(),
        scores: {
          pronunciation: 9,
          fluency: 9,
          grammar: 9,
          content: 9,
        },
      }
      const finalTurns = [...updatedTurns, tutorTurn]
      setTurns(finalTurns)
      calculateStats(finalTurns)

      if (finalTurns.length >= 6) {
        setViewState("complete")
        addXP(50)
      }
    }, 1000)
  }

  const handleExtractWords = () => {
    const newWords = [
      { word: "preference", meaning: "a greater liking for one alternative over another" },
      { word: "confirm", meaning: "to establish the truth or correctness of something" },
      { word: "booking", meaning: "a reservation or arrangement" },
    ]

    newWords.forEach((item) => {
      addFlashcard({
        id: `fc-${Date.now()}-${Math.random()}`,
        front: item.word,
        back: `${item.meaning}\n\nExample: Used in speaking session "${scenario?.title}"`,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        lastReviewDate: new Date(),
      })
    })

    alert("3 new words added to your flashcards!")
  }

  const handleDownloadTranscript = () => {
    const transcript = turns.map((turn) => `${turn.role === "user" ? "You" : "Tutor"}: ${turn.text}`).join("\n\n")
    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`)
    element.setAttribute("download", `${scenario?.title}-transcript.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId)
    setViewState("detail")
  }

  if (!scenario) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (viewState === "history") {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <LearningHistory
          records={mockLearningRecords}
          onSelectRecord={handleSelectRecord}
          onBack={() => setViewState("preparation")}
        />
      </div>
    )
  }

  if (viewState === "detail") {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <DetailedFeedback
          scores={mockDetailedFeedback.scores}
          errorCategories={mockDetailedFeedback.errorCategories}
          conversation={mockDetailedFeedback.conversation}
          overallRating={mockDetailedFeedback.overallRating}
          tip={mockDetailedFeedback.tip}
          onBack={() => setViewState(selectedRecordId ? "history" : "complete")}
        />
      </div>
    )
  }

  if (viewState === "preparation") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/speaking">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-8 space-y-8 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Learning Goals</h2>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 p-4 bg-primary-50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <p className="text-sm">Talk about being tired of a small room.</p>
                </div>
                <div className="flex gap-3 p-4 bg-primary-50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <p className="text-sm">Describe your dream house.</p>
                </div>
                <div className="flex gap-3 p-4 bg-primary-50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="text-sm">Compare and talk about two types of houses.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">Key expressions</h2>
              </div>
              <div className="space-y-4 p-4 bg-primary-50 rounded-xl text-sm">
                <div>
                  <p className="font-medium mb-1">
                    1. One day, I'm going to have a house with a pool, a walk-in closet, and a huge kitchen.
                  </p>
                  <p className="text-muted-foreground italic">
                    Một ngày nào đó, tôi sẽ có một căn nhà với hồ bơi, tủ đồ cỡ mà có thể bước vào được, và một căn bếp
                    rất mà rất lớn.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">
                    2. Don't forget the home theater! I'll invite you over for movie nights every weekend.
                  </p>
                  <p className="text-muted-foreground italic">
                    Đừng quên rạp chiếu phim tại nhà nhé! Tớ sẽ mời cậu tới xem phim mỗi cuối tuần.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">3. Sounds perfect … now if only our bank accounts would agree.</p>
                  <p className="text-muted-foreground italic">
                    Nghe hoàn hảo đây … giá mà tài khoản ngân hàng của chúng ta cũng đồng ý.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 bg-white">
              <div className="aspect-video bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl mb-6 relative overflow-hidden">
                <Image src="/learning.png" alt={scenario.title} fill className="object-cover rounded-2xl" />
              </div>

              <h1 className="text-3xl font-bold mb-4">{scenario.title || "Share about your dream house"}</h1>

              <p className="text-muted-foreground mt-2">{scenario.context}</p>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">You play as:</p>
                    <p className="text-base font-bold">Student B</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">AI plays as:</p>
                    <p className="text-base font-bold">Student A</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setViewState("active")} className="flex-1 gap-2 text-lg py-6" size="lg">
                  <Play className="h-5 w-5" />
                  Start Speaking
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 bg-transparent"
                  onClick={() => setViewState("history")}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (viewState === "active") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-card p-8 col-span-2">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => setViewState("preparation")} className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <h1 className="text-2xl font-bold text-center">{scenario.title || "Share about your dream house"}</h1>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Situation Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In a shabby room, A dreams of a mansion with countless rooms: a game room, a cinema room, and a spa. B
                dreams of a cottage surrounded by flowers and butterflies. While they are arguing, the power suddenly
                goes out, and the sounds of neighbors complaining bring them both back to reality.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-3">Objectives</h3>
              <ol className="space-y-2 text-sm">
                <li>1. Express frustration with the small rented room.</li>
                <li>2. Describe your dream house.</li>
                <li>3. Compare and discuss the two types of houses.</li>
              </ol>
            </div>

            <div className="space-y-4 mb-8 min-h-[300px]">
              {turns.map((turn) => (
                <div key={turn.id} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-3 max-w-lg">
                    {turn.role === "tutor" && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary-600" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          turn.role === "user"
                            ? "bg-primary-50 border border-gray-200"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{turn.text}</p>
                      </div>

                      <div className="flex gap-2 mt-2 ml-2">
                        <button
                          onClick={() => {
                            if ("speechSynthesis" in window) {
                              const utterance = new SpeechSynthesisUtterance(turn.text)
                              utterance.lang = "en-US"
                              window.speechSynthesis.speak(utterance)
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                          aria-label="Speak"
                        >
                          <Volume2 className="h-4 w-4 text-primary-600" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(turn.text)
                            setCopiedId(turn.id)
                            setTimeout(() => setCopiedId(null), 2000)
                          }}
                          className="w-8 h-8 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                          aria-label="Copy"
                        >
                          {copiedId === turn.id ? (
                            <Check className="h-4 w-4 text-primary-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-primary-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {turn.role === "user" && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {turns.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">Ready to start speaking?</p>
                  <p className="text-sm">Tap the microphone button below to begin</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleToggleRecording}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    isRecording
                      ? "bg-secondary-500 animate-pulse shadow-lg shadow-secondary-200"
                      : "bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-200"
                  }
                `}
              >
                {isRecording ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isRecording ? "Recording... Tap to stop" : "Tap to speak"}
            </p>
          </div>

          <div className="col-span-1">
            <VocabHelperChatbot />
          </div>
        </div>
      </div>
    )
  }

  if (viewState === "complete") {
    const overallScore = Math.round(
      ((sessionStats.avgPronunciation + sessionStats.avgFluency + sessionStats.avgGrammar + sessionStats.avgContent) /
        4) *
        10,
    )

    const radarData = [
      { label: "Relevance", value: Math.round(sessionStats.avgContent * 10) },
      { label: "Pronunciation", value: Math.round(sessionStats.avgPronunciation * 10) },
      { label: "Intonation & Stress", value: Math.round(sessionStats.avgFluency * 0.8 * 10) },
      { label: "Fluency", value: Math.round(sessionStats.avgFluency * 10) },
      { label: "Grammar", value: Math.round(sessionStats.avgGrammar * 10) },
    ]

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/speaking">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Speaking Room
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="p-12 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center shadow-lg mb-6">
                  <span className="text-8xl font-bold text-white">{overallScore}</span>
                </div>
                <p className="text-xl font-bold text-center">Overall speaking score</p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <h2 className="text-3xl font-bold mb-4">Amazing context understanding</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Amazing work! You seem to understand the context really well, you also got nice pronunciation and good
                use of grammar. However, you may want to put in more time in speaking session to improve your fluency,
                since there are a couple of times you pause a bit too long to remember the pronunciation of a word.
              </p>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-8">
              <RadarChart data={radarData} size={400} className="mb-4" />
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setSelectedRecordId(null)
                  setViewState("detail")
                }}
                className="gap-2 flex-col h-auto py-2"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-[14px] text-center">View Detailed Feedback</span>
              </Button>
              <Button
                onClick={handleExtractWords}
                className="gap-2 flex-col h-auto py-2 bg-transparent"
                variant="outline"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-[14px] text-center">Extract New Words</span>
              </Button>
              <Button
                onClick={handleDownloadTranscript}
                className="gap-2 flex-col h-auto py-2 bg-transparent"
                variant="outline"
              >
                <Download className="h-5 w-5" />
                <span className="text-[14px] text-center">Download Transcript</span>
              </Button>
              <Button
                onClick={() => router.push("/speaking")}
                className="gap-2 flex-col h-auto py-2 bg-transparent"
                variant="outline"
              >
                <RotateCcw className="h-5 w-5" />
                <span className="text-[14px] text-center">Start Another Session</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
      <div className="mb-6">
        <Link href="/speaking">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Speaking Room
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{scenario.title}</h1>
        <p className="text-muted-foreground mt-2">{scenario.context}</p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 rounded-2xl border border-border overflow-hidden flex flex-col">
          <SessionChat
            turns={turns}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            onSendMessage={handleSendMessage}
          />
        </div>

        <div className="space-y-6 overflow-y-auto">
          <div className="rounded-2xl border border-border p-4">
            <h3 className="font-semibold mb-3">Session Goal</h3>
            <p className="text-sm text-muted-foreground">{scenario.goal}</p>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Live Scores</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Pronunciation</span>
                  <span className="text-sm font-bold">{sessionStats.avgPronunciation}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(sessionStats.avgPronunciation / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Fluency</span>
                  <span className="text-sm font-bold">{sessionStats.avgFluency}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(sessionStats.avgFluency / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Grammar</span>
                  <span className="text-sm font-bold">{sessionStats.avgGrammar}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(sessionStats.avgGrammar / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Content</span>
                  <span className="text-sm font-bold">{sessionStats.avgContent}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(sessionStats.avgContent / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <SessionTranscript turns={turns} scenarioTitle={scenario.title} />
        </div>
      </div>
    </div>
  )
}
