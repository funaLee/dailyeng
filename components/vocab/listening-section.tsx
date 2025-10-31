"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, BookOpen, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListeningTask {
  id: string
  type: "dictation" | "mcq"
  question: string
  audio: string
  transcript: string
  options?: string[]
  correctAnswer: string
}

interface ListeningProps {
  topicTitle: string
  tasks?: ListeningTask[]
}

export function ListeningSection({ topicTitle, tasks = [] }: ListeningProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showTranscript, setShowTranscript] = useState(false)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTask = tasks[currentTaskIndex]

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }

  const handleAnswerChange = (taskId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [taskId]: answer }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleNext = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
      setSubmitted(false)
    }
  }

  const isCorrect = answers[currentTask?.id] === currentTask?.correctAnswer

  if (!currentTask) {
    return (
      <Card className="p-8 text-center">
        <Volume2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No listening tasks available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Audio Player</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="flex gap-1">
              {[0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-colors",
                    playbackSpeed === speed
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Waveform Placeholder */}
        <div className="bg-secondary rounded-lg p-4 flex items-center justify-center h-16">
          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all",
                  isPlaying ? "animate-pulse" : "",
                  Math.random() > 0.5 ? "h-8 bg-primary" : "h-4 bg-primary/50",
                )}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button onClick={handlePlayPause} size="lg" className="gap-2">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Button variant="outline" onClick={() => setShowTranscript(!showTranscript)} className="gap-2">
            <BookOpen className="h-4 w-4" />
            {showTranscript ? "Hide" : "Show"} Transcript
          </Button>
        </div>

        {/* Transcript */}
        {showTranscript && (
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <p className="text-sm italic text-foreground">{currentTask.transcript}</p>
          </div>
        )}

        <audio ref={audioRef} src={currentTask.audio} onEnded={() => setIsPlaying(false)} />
      </Card>

      {/* Task */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">{currentTask.question}</h3>

        {currentTask.type === "dictation" ? (
          <div className="space-y-3">
            <textarea
              value={answers[currentTask.id] || ""}
              onChange={(e) => handleAnswerChange(currentTask.id, e.target.value)}
              placeholder="Type what you hear..."
              disabled={submitted}
              className="w-full min-h-24 p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />
          </div>
        ) : (
          <div className="space-y-2">
            {currentTask.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerChange(currentTask.id, option)}
                disabled={submitted}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-2 transition-colors",
                  answers[currentTask.id] === option
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50",
                  submitted && option === currentTask.correctAnswer ? "border-green-500 bg-green-500/10" : "",
                  submitted && answers[currentTask.id] === option && !isCorrect ? "border-red-500 bg-red-500/10" : "",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div
            className={cn(
              "p-4 rounded-lg flex items-start gap-3",
              isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30",
            )}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className={cn("font-semibold", isCorrect ? "text-green-700" : "text-red-700")}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              {!isCorrect && (
                <p className="text-muted-foreground mt-1">
                  Correct answer: <span className="font-medium text-foreground">{currentTask.correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {!submitted ? (
            <Button onClick={handleSubmit} className="flex-1">
              Submit Answer
            </Button>
          ) : (
            <>
              {currentTaskIndex < tasks.length - 1 && (
                <Button onClick={handleNext} className="flex-1">
                  Next Task
                </Button>
              )}
              {currentTaskIndex === tasks.length - 1 && (
                <div className="flex-1 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-sm font-semibold text-green-700">All tasks completed!</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Review Suggestions */}
      <Card className="p-6 space-y-4 bg-blue-500/5 border-blue-500/20">
        <h3 className="font-semibold flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Review Suggestions
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            After finishing listening practice, review related vocabulary and grammar to reinforce your learning.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              Back to Learn
            </Button>
            <Button variant="outline" size="sm">
              Review Flashcards
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
