"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SessionChat } from "@/components/speaking/session-chat"
import { RadarChart } from "@/components/speaking/radar-chart"
import { LearningHistory } from "@/components/speaking/learning-history"
import { DetailedFeedback } from "@/components/speaking/detailed-feedback"
import { useAppStore } from "@/lib/store"
import { createSession, submitTurn } from "@/actions/speaking"
import { toast } from "sonner"
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

// Types
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

export interface LearningRecord {
  id: string
  overallScore: number
  completedTurns: number
  totalTurns: number
  date: Date
}

export interface DetailedFeedbackScore {
  label: string
  value: number
  // Note: icon is rendered in client based on label
}

export interface ErrorCategory {
  name: string
  count: number
}

export interface ConversationItem {
  role: "tutor" | "user"
  text: string
  userErrors?: Array<{
    word: string
    correction: string
    type: string
  }>
  correctedSentence?: string
  audioUrl?: string
}

export interface DetailedFeedbackData {
  scores: DetailedFeedbackScore[]
  errorCategories: ErrorCategory[]
  conversation: ConversationItem[]
  overallRating: string
  tip: string
}

export interface ScenarioData {
  id: string
  title: string
  context?: string
  goal?: string
}

export interface InitialTurn {
  id: string
  role: "user" | "tutor"
  text: string
  timestamp: string // ISO string for serialization
  scores?: {
    pronunciation?: number
    fluency?: number
    grammar?: number
    content?: number
  }
}

export interface SpeakingSessionClientProps {
  scenarioId: string
  scenario: ScenarioData | null
  initialTurns: InitialTurn[]
  learningRecords: LearningRecord[]
  detailedFeedback: DetailedFeedbackData
}

// Helper function to get icon based on label
function getScoreIcon(label: string): React.ReactNode {
  switch (label) {
    case "Relevance":
      return <Target className="h-4 w-4" />
    case "Pronunciation":
      return <Mic2 className="h-4 w-4" />
    case "Intonation & Stress":
      return <Waveform className="h-4 w-4" />
    case "Fluency":
      return <Zap className="h-4 w-4" />
    case "Grammar":
      return <Languages className="h-4 w-4" />
    default:
      return <Target className="h-4 w-4" />
  }
}

export default function SpeakingSessionClient({
  scenarioId,
  scenario,
  initialTurns,
  learningRecords,
  detailedFeedback,
}: SpeakingSessionClientProps) {
  const router = useRouter()
  const { addFlashcard, addXP } = useAppStore()

  // Convert serialized dates back to Date objects
  const [turns, setTurns] = useState<Turn[]>(
    initialTurns.map((t) => ({ ...t, timestamp: new Date(t.timestamp) }))
  )
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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const conversationRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    calculateStats(turns)
  }, [turns])

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }, [turns])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsRecording(false);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          toast.error("Microphone error. Please try typing.");
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, [sessionId]); // Add sessionId dep to refresh if needed, roughly

  const startSession = async () => {
    try {
      // TODO: Get real userId
      const userId = "user-1";
      const session = await createSession(userId, scenarioId);
      setSessionId(session.id);
      setViewState("active");

      // Speak initial greeting if it's a new session and no turns
      if (turns.length === 0 && scenario?.context) {
        // Maybe we can have a pre-generated greeting?
        // For now, let user speak first.
      }
    } catch (e) {
      console.error("Failed to start session", e);
      toast.error("Failed to start session");
    }
  }

  // Reset stats when recording starts
  useEffect(() => {
    if (isRecording) {
      setSessionStats({
        avgPronunciation: 0,
        avgFluency: 0,
        avgGrammar: 0,
        avgContent: 0,
      })
    }
  }, [isRecording])

  const calculateStats = (allTurns: Turn[]) => {
    // Find the latest user turn with scores for "Live Analysis"
    // We reverse to find the last one added
    const latestTurn = [...allTurns].reverse().find(t => t.role === 'user' && t.scores);

    if (latestTurn && latestTurn.scores) {
      setSessionStats({
        avgPronunciation: latestTurn.scores.pronunciation || 0,
        avgFluency: latestTurn.scores.fluency || 0,
        avgGrammar: latestTurn.scores.grammar || 0,
        avgContent: latestTurn.scores.content || 0,
      })
    }
  }

  const handleToggleRecording = () => {
    if (!sessionId) {
      toast.error("Session not started");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      // isRecording set to false in onend/onresult
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true)
      } catch (e) {
        console.error("Failed to start recording", e)
        toast.error("Could not start microphone")
      }
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      // Try to select a better voice
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(v => v.name.includes("Google US English"));
      if (googleVoice) utterance.voice = googleVoice;

      window.speechSynthesis.speak(utterance);
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!sessionId || !text.trim()) return;

    setIsProcessing(true);

    // Optimistically add user turn
    const tempId = `temp-${Date.now()}`;
    const userTurn: Turn = {
      id: tempId,
      role: "user",
      text,
      timestamp: new Date(),
    }

    setTurns(prev => [...prev, userTurn]);

    try {
      const result = await submitTurn(sessionId, text);

      // Update user turn with real ID and scores
      setTurns(prev => prev.map(t => t.id === tempId ? {
        ...t,
        id: `turn-${Date.now()}`, // In real app, we get this from DB, but action returns turnId?
        // Wait, action currently returns { aiResponse, scores, errors, turnId }.
        // Does it return USER turn ID? The action saves user turn, then AI turn. 
        // I should update action to return both or just refetch.
        // For now, I'll update scores.
        scores: result.scores as any
      } : t));

      // Add AI turn
      const aiTurn: Turn = {
        id: result.turnId, // This is AI turn ID
        role: "tutor",
        text: result.aiResponse,
        timestamp: new Date()
      };
      setTurns(prev => [...prev, aiTurn]);

      speakText(result.aiResponse);

    } catch (e) {
      console.error("Submit turn error", e);
      toast.error("Failed to process message");
      // Remove temp turn?
    } finally {
      setIsProcessing(false);
    }
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
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
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

  // Transform scores with icons for DetailedFeedback component
  const scoresWithIcons = detailedFeedback.scores.map((s) => ({
    ...s,
    icon: getScoreIcon(s.label),
  }))

  if (!scenario) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    )
  }

  // Render similar to before, but use startSession in preparation view

  if (viewState === "history") {
    // ... same as before
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <LearningHistory
          records={learningRecords}
          onSelectRecord={handleSelectRecord}
          onBack={() => setViewState("preparation")}
        />
      </div>
    )
  }

  if (viewState === "detail") {
    // ... same as before
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <DetailedFeedback
          scores={scoresWithIcons}
          errorCategories={detailedFeedback.errorCategories}
          conversation={detailedFeedback.conversation}
          overallRating={detailedFeedback.overallRating}
          tip={detailedFeedback.tip}
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

        {/* Similar content as before but button calls startSession() */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-8 space-y-8 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Learning Goals</h2>
              </div>
              <div className="space-y-3">
                <p className="p-4 bg-primary-50 rounded-xl">{scenario.goal || "Practice conversation skill"}</p>
                <p className="p-4 bg-primary-50 rounded-xl">Improve vocabulary</p>
                <p className="p-4 bg-primary-50 rounded-xl">Enhance fluency</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold">Context</h2>
            <div className="p-4 bg-primary-50 rounded-xl text-sm italic">
              {scenario.context}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 bg-white">
              <div className="aspect-video bg-linear-to-br from-primary-200 to-primary-300 rounded-2xl mb-6 relative overflow-hidden">
                <Image src="/learning.png" alt={scenario.title} fill className="object-cover rounded-2xl" />
              </div>

              <h1 className="text-3xl font-bold mb-4">{scenario.title}</h1>
              <p className="text-muted-foreground mt-2">{scenario.context}</p>

              <div className="flex gap-3 mt-6">
                <Button onClick={startSession} className="flex-1 gap-2 text-lg py-6" size="lg">
                  <Play className="h-5 w-5" />
                  Start Speaking
                </Button>
                <Button variant="outline" size="lg" className="px-6 bg-transparent" onClick={() => setViewState("history")}>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 h-screen max-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold">{scenario.title}</h1>
            <p className="text-muted-foreground text-sm opacity-90">{scenario.context}</p>
          </div>
          <Button
            variant="destructive"
            className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-500 transition-all rounded-full"
            onClick={() => {
              const userTurns = turns.filter(t => t.role === 'user').length;
              if (userTurns >= 5) {
                setViewState("complete");
              } else {
                if (confirm("You haven't completed 5 sentences yet. Ending now will not save your progress. Are you sure?")) {
                  setViewState("preparation");
                }
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            End Session
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0 pb-4">
          {/* Chat Area - 8 Columns */}
          <div className="lg:col-span-8 rounded-3xl border-2 border-border bg-primary-100 flex flex-col overflow-hidden relative shadow-2xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref={conversationRef}>
              {turns.map((turn) => (
                <div key={turn.id} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-4 max-w-2xl group">
                    {turn.role === "tutor" && (
                      <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg border border-border">
                        <Bot className="h-5 w-5 text-blue-400" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className={`rounded-2xl px-5 py-3 shadow-md backdrop-blur-sm ${turn.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white text-foreground border border-border rounded-tl-sm"
                        }`}>
                        <p className="text-base leading-relaxed">{turn.text}</p>
                      </div>
                      <div className={`flex gap-2 mt-1 px-1 ${turn.role === 'user' ? 'justify-end' : 'justify-start'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <button onClick={() => speakText(turn.text)} className="p-1.5 hover:bg-slate-700 rounded-full text-slate-500 hover:text-blue-400 transition-colors">
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {turn.role === "user" && (
                      <div className="shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 bg-white border border-border p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">Tutor is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border bg-white/80 backdrop-blur-xl absolute bottom-0 w-full z-10">
              <div className="flex justify-center items-center gap-6">
                <button
                  onClick={handleToggleRecording}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                    ? "bg-red-500 shadow-lg shadow-red-500/20 scale-110 ring-4 ring-red-500/20"
                    : "bg-blue-600 shadow-lg shadow-blue-600/20 hover:scale-105 hover:bg-blue-500"
                    } text-white group`}
                >
                  {isRecording ? <MicOff className="h-8 w-8 animate-pulse" /> : <Mic className="h-8 w-8" />}

                  {/* Ripple effect when recording */}
                  {isRecording && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
                  )}
                </button>
                <div className="text-sm font-medium text-muted-foreground absolute bottom-3">
                  {isRecording ? "Listening..." : "Tap to Speak"}
                </div>
              </div>
            </div>
            {/* Spacer for input area since it's absolute */}
            <div className="h-[120px] shrink-0" />
          </div>

          {/* Sidebar - 4 Columns (Full height stack) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
            {/* Live Analysis Card */}
            <div className="rounded-3xl border-2 border-border p-6 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Waveform className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-foreground">Live Analysis</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Pronunciation</span>
                    <span className="text-blue-400">{sessionStats.avgPronunciation}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${sessionStats.avgPronunciation * 10}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Grammar</span>
                    <span className="text-green-400">{sessionStats.avgGrammar}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${sessionStats.avgGrammar * 10}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Fluency</span>
                    <span className="text-orange-400">{sessionStats.avgFluency}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${sessionStats.avgFluency * 10}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vocab Helper - Fills remaining space */}
            <div className="flex-1 min-h-0 rounded-3xl overflow-hidden shadow-xl bg-white border-2 border-border backdrop-blur-md">
              <VocabHelperChatbot />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (viewState === "complete") {
    // Calculate averages from all turns for the summary
    const allScores = turns.filter((t) => t.scores)

    let finalStats = {
      avgPronunciation: 0,
      avgFluency: 0,
      avgGrammar: 0,
      avgContent: 0
    }

    if (allScores.length > 0) {
      finalStats = {
        avgPronunciation: allScores.reduce((sum, t) => sum + (t.scores?.pronunciation || 0), 0) / allScores.length,
        avgFluency: allScores.reduce((sum, t) => sum + (t.scores?.fluency || 0), 0) / allScores.length,
        avgGrammar: allScores.reduce((sum, t) => sum + (t.scores?.grammar || 0), 0) / allScores.length,
        avgContent: allScores.reduce((sum, t) => sum + (t.scores?.content || 0), 0) / allScores.length,
      }
    }

    const overallScore = Math.round(
      ((finalStats.avgPronunciation + finalStats.avgFluency + finalStats.avgGrammar + finalStats.avgContent) /
        4) *
      10,
    )

    const radarData = [
      { label: "Relevance", value: Math.round(finalStats.avgContent * 10) },
      { label: "Pronunciation", value: Math.round(finalStats.avgPronunciation * 10) },
      { label: "Intonation & Stress", value: Math.round(finalStats.avgFluency * 0.8 * 10) },
      { label: "Fluency", value: Math.round(finalStats.avgFluency * 10) },
      { label: "Grammar", value: Math.round(finalStats.avgGrammar * 10) },
    ]

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/speaking">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Speaking Room
          </Button>
        </Link>

        {/* Similar to before... */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-12 bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center">
            <div className="w-64 h-64 rounded-full bg-primary-500 flex items-center justify-center shadow-lg mb-6 text-white text-8xl font-bold">
              {overallScore}
            </div>
            <h2 className="text-xl font-bold">Session Score</h2>
          </Card>

          <Card className="p-8">
            <RadarChart data={radarData} size={400} />
          </Card>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => setViewState("preparation")}>Restart Session</Button>
          <Button variant="outline" onClick={() => router.push("/speaking")}>Finish</Button>
        </div>
      </div>
    )
  }

  return <div>Loading...</div>
}
