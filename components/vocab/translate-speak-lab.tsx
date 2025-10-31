"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, Mic, MicOff, Volume2, Send, BookmarkPlus, Check } from "lucide-react"

interface TranslateSpeakLabProps {
  topicTitle: string
}

interface FeedbackBadge {
  type: "meaning" | "grammar" | "style"
  label: string
  color: string
}

interface ScoreRing {
  label: string
  score: number
  color: string
}

export function TranslateSpeakLab({ topicTitle }: TranslateSpeakLabProps) {
  const [translateTab, setTranslateTab] = useState<"en-vi" | "vi-en">("en-vi")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [translationFeedback, setTranslationFeedback] = useState<FeedbackBadge[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedText, setRecordedText] = useState("")
  const [speakingScores, setSpeakingScores] = useState<ScoreRing[]>([])
  const [writingText, setWritingText] = useState("")
  const [writingAnnotations, setWritingAnnotations] = useState<
    Array<{ start: number; end: number; type: string; message: string }>
  >([])
  const [savedSentence, setSavedSentence] = useState(false)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleTranslate = () => {
    if (translateTab === "en-vi") {
      const mockTranslations: Record<string, string> = {
        hello: "Xin chào",
        goodbye: "Tạm biệt",
        "thank you": "Cảm ơn",
        please: "Vui lòng",
        water: "Nước",
        food: "Thức ăn",
        "i would like to order": "Tôi muốn gọi",
      }

      const lower = sourceText.toLowerCase()
      const translated = mockTranslations[lower] || `[Mock translation of: ${sourceText}]`
      setTranslatedText(translated)

      // Mock feedback badges
      setTranslationFeedback([
        { type: "meaning", label: "Meaning: Accurate", color: "bg-green-100 text-green-800" },
        { type: "grammar", label: "Grammar: Correct", color: "bg-blue-100 text-blue-800" },
        { type: "style", label: "Style: Natural", color: "bg-purple-100 text-purple-800" },
      ])
    } else {
      const mockTranslations: Record<string, string> = {
        "xin chào": "Hello",
        "tạm biệt": "Goodbye",
        "cảm ơn": "Thank you",
        "vui lòng": "Please",
        nước: "Water",
        "thức ăn": "Food",
        "tôi muốn gọi": "I would like to order",
      }

      const lower = sourceText.toLowerCase()
      const translated = mockTranslations[lower] || `[Mock translation of: ${sourceText}]`
      setTranslatedText(translated)

      setTranslationFeedback([
        { type: "meaning", label: "Meaning: Accurate", color: "bg-green-100 text-green-800" },
        { type: "grammar", label: "Grammar: Correct", color: "bg-blue-100 text-blue-800" },
        { type: "style", label: "Style: Natural", color: "bg-purple-100 text-purple-800" },
      ])
    }
  }

  const handleToggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.start()
        setIsRecording(true)
        setRecordingTime(0)
        setRecordedText("")
        setSpeakingScores([])

        // Simulate recording timer
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)

        mediaRecorder.onstart = () => {
          console.log("[v0] Recording started")
        }
      } catch (error) {
        // Fallback: fake recording with timer
        console.log("[v0] Using fake recording mode")
        setIsRecording(true)
        setRecordingTime(0)
        setRecordedText("")
        setSpeakingScores([])

        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      setIsRecording(false)

      // Mock recorded text and scores
      setRecordedText("I would like to order a coffee, please.")
      setSpeakingScores([
        { label: "Pronunciation", score: 85, color: "text-green-600" },
        { label: "Fluency", score: 78, color: "text-blue-600" },
        { label: "Grammar", score: 82, color: "text-purple-600" },
        { label: "Content", score: 80, color: "text-orange-600" },
      ])
    }
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleGetWritingFeedback = () => {
    if (!writingText.trim()) return

    // Mock inline annotations
    setWritingAnnotations([
      {
        start: 0,
        end: 5,
        type: "grammar",
        message: "Consider capitalizing the first word",
      },
      {
        start: writingText.indexOf("favorite"),
        end: writingText.indexOf("favorite") + 8,
        type: "vocabulary",
        message: "Good word choice!",
      },
    ])
  }

  const handleSaveSentence = () => {
    setSavedSentence(true)
    setTimeout(() => setSavedSentence(false), 2000)
  }

  const renderScoreRing = (score: number, label: string, color: string) => {
    const circumference = 2 * Math.PI * 45
    const offset = circumference - (score / 100) * circumference

    return (
      <div key={label} className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-secondary"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${color} transition-all duration-500`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${color}`}>{score}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">{label}</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="translate" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="translate" className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Translate</span>
        </TabsTrigger>
        <TabsTrigger value="speak" className="gap-2">
          <Mic className="h-4 w-4" />
          <span className="hidden sm:inline">Read-Aloud</span>
        </TabsTrigger>
        <TabsTrigger value="write" className="gap-2">
          <span>✍️</span>
          <span className="hidden sm:inline">Writing</span>
        </TabsTrigger>
      </TabsList>

      {/* Translate Tab */}
      <TabsContent value="translate" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Source */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">{translateTab === "en-vi" ? "English" : "Vietnamese"}</label>
              <button
                onClick={() => setTranslateTab(translateTab === "en-vi" ? "vi-en" : "en-vi")}
                className="p-1 hover:bg-secondary rounded transition-colors"
                aria-label="Swap languages"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={translateTab === "en-vi" ? "Enter English text..." : "Nhập văn bản tiếng Việt..."}
              className="w-full h-32 p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleTranslate} className="w-full mt-3" disabled={!sourceText.trim()}>
              Translate
            </Button>
          </Card>

          {/* Target */}
          <Card className="p-4">
            <label className="text-sm font-semibold block mb-3">
              {translateTab === "en-vi" ? "Vietnamese" : "English"}
            </label>
            <div className="w-full h-32 p-3 rounded-lg border border-input bg-secondary/50 text-sm overflow-y-auto">
              {translatedText || <span className="text-muted-foreground">Translation will appear here...</span>}
            </div>

            {translationFeedback.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {translationFeedback.map((feedback) => (
                  <Badge key={feedback.type} className={`${feedback.color} border-0`}>
                    {feedback.label}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => handleSpeak(translatedText)}
              className="w-full mt-3 gap-2"
              disabled={!translatedText}
            >
              <Volume2 className="h-4 w-4" />
              Hear Translation
            </Button>
          </Card>
        </div>
      </TabsContent>

      {/* Read-Aloud Tab */}
      <TabsContent value="speak" className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Read-Aloud Practice: {topicTitle}</h3>

          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Prompt:</p>
              <p className="text-sm">"Imagine you're at a restaurant. Order a meal and ask about the ingredients."</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">Your Recording</label>
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  onClick={handleToggleRecording}
                  className="gap-2"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop ({recordingTime}s)
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              {isRecording && (
                <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm text-red-700">Recording...</span>
                </div>
              )}

              {(isRecording || recordedText) && (
                <div className="mb-3 p-4 rounded-lg border border-input bg-background">
                  <div className="flex items-center justify-center gap-1 h-12">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all ${
                          isRecording ? "bg-primary animate-pulse" : "bg-primary/60"
                        }`}
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: isRecording ? `${i * 0.05}s` : "0s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {recordedText && (
                <div className="p-3 rounded-lg border border-input bg-background mb-3">
                  <p className="text-sm">{recordedText}</p>
                </div>
              )}
            </div>

            {speakingScores.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {speakingScores.map((score) => renderScoreRing(score.score, score.label, score.color))}
              </div>
            )}

            {speakingScores.length > 0 && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Tips for Improvement:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Speak more slowly to improve clarity</li>
                  <li>Use more varied vocabulary</li>
                  <li>Practice stress and intonation patterns</li>
                </ul>
              </div>
            )}
          </div>
        </Card>
      </TabsContent>

      {/* Writing Tab */}
      <TabsContent value="write" className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Writing Practice: {topicTitle}</h3>

          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Task:</p>
              <p className="text-sm">
                Write a short paragraph (3-5 sentences) about your favorite food and why you like it.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Your Writing</label>
              <textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="Start typing your response here..."
                className="w-full h-40 p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">{writingText.length} characters</span>
                <div className="flex gap-2">
                  <Button onClick={handleGetWritingFeedback} disabled={!writingText.trim()} className="gap-2">
                    <Send className="h-4 w-4" />
                    Get Feedback
                  </Button>
                  <Button
                    variant={savedSentence ? "default" : "outline"}
                    onClick={handleSaveSentence}
                    disabled={!writingText.trim()}
                    className="gap-2"
                  >
                    {savedSentence ? (
                      <>
                        <Check className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-4 w-4" />
                        Save Sentence
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {writingAnnotations.length > 0 && (
              <div className="space-y-2">
                {writingAnnotations.map((annotation, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      annotation.type === "grammar" ? "bg-yellow-50 border-yellow-400" : "bg-green-50 border-green-400"
                    }`}
                  >
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {annotation.type === "grammar" ? "Grammar" : "Vocabulary"}
                    </p>
                    <p className="text-sm text-gray-700">{annotation.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
