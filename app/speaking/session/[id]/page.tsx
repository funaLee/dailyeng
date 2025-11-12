"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SessionChat } from "@/components/speaking/session-chat"
import { SessionTranscript } from "@/components/speaking/session-transcript"
import { mockSpeakingScenarios, mockSpeakingTurns, mockCustomScenarios } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import { ArrowLeft, BarChart3, BookOpen, Download } from "lucide-react"
import Link from "next/link"

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

export default function SpeakingSessionPage() {
  const params = useParams()
  const router = useRouter()
  const { addFlashcard, addXP } = useAppStore()
  const scenarioId = params.id as string

  const [scenario, setScenario] = useState<any>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    avgPronunciation: 0,
    avgFluency: 0,
    avgGrammar: 0,
    avgContent: 0,
  })

  const TURNS_FOR_COMPLETION = 6

  useEffect(() => {
    // Flatten all scenarios from all categories
    const allScenarios = Object.values(mockSpeakingScenarios)
      .reduce((acc, curr) => [...acc, ...curr], [])
      .concat(mockCustomScenarios)
    
    const found = allScenarios.find((s) => s.id === scenarioId)
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

          if (finalTurns.length >= TURNS_FOR_COMPLETION) {
            setSessionComplete(true)
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

      if (finalTurns.length >= TURNS_FOR_COMPLETION) {
        setSessionComplete(true)
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
        lastReviewDate: new Date()
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

  if (!scenario) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/speaking">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Speaking Room
          </Button>
        </Link>

        <Card className="p-8 text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Session Complete! 🎉</h1>
          <p className="text-muted-foreground mb-6">Great job! You've completed this speaking session.</p>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{sessionStats.avgPronunciation}</p>
              <p className="text-sm text-muted-foreground">Pronunciation</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{sessionStats.avgFluency}</p>
              <p className="text-sm text-muted-foreground">Fluency</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{sessionStats.avgGrammar}</p>
              <p className="text-sm text-muted-foreground">Grammar</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{sessionStats.avgContent}</p>
              <p className="text-sm text-muted-foreground">Content</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <Button onClick={handleExtractWords} className="w-full gap-2 bg-transparent" variant="outline">
              <BookOpen className="h-4 w-4" />
              Extract New Words → Save to Flashcards
            </Button>
            <Button onClick={handleDownloadTranscript} className="w-full gap-2 bg-transparent" variant="outline">
              <Download className="h-4 w-4" />
              Download Transcript
            </Button>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg mb-6 text-left max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-3">Session Transcript</h3>
            <div className="space-y-3 text-sm">
              {turns.map((turn) => (
                <div key={turn.id}>
                  <p className="font-medium text-xs text-muted-foreground uppercase">
                    {turn.role === "user" ? "You" : "Tutor"}
                  </p>
                  <p className="mt-1">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={() => router.push("/speaking")} className="w-full">
            Start Another Session
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        {/* Chat */}
        <div className="lg:col-span-2 rounded-2xl border border-border overflow-hidden flex flex-col">
          <SessionChat
            turns={turns}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6 overflow-y-auto">
          {/* Goals */}
          <div className="rounded-2xl border border-border p-4">
            <h3 className="font-semibold mb-3">Session Goal</h3>
            <p className="text-sm text-muted-foreground">{scenario.goal}</p>
          </div>

          {/* Stats */}
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
                    className="bg-purple-500 h-2 rounded-full"
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

          {/* Transcript */}
          <SessionTranscript turns={turns} scenarioTitle={scenario.title} />
        </div>
      </div>
    </div>
  )
}
