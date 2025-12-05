"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, Bot, User, Volume2, Lightbulb } from "lucide-react"

interface FeedbackScore {
  label: string
  value: number
  icon: React.ReactNode
}

interface ErrorCategory {
  name: string
  count: number
}

interface ConversationTurn {
  role: "tutor" | "user"
  text: string
  userErrors?: { word: string; correction: string; type: string }[]
  correctedSentence?: string
  audioUrl?: string
}

interface DetailedFeedbackProps {
  scores: FeedbackScore[]
  errorCategories: ErrorCategory[]
  conversation: ConversationTurn[]
  overallRating: string
  tip: string
  onBack: () => void
}

export function DetailedFeedback({
  scores,
  errorCategories,
  conversation,
  overallRating,
  tip,
  onBack,
}: DetailedFeedbackProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "excellent":
        return "bg-success-500"
      case "good":
        return "bg-success-400"
      case "average":
        return "bg-warning-500"
      case "needs improvement":
        return "bg-error-500"
      default:
        return "bg-primary-500"
    }
  }

  const getRatingHeight = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "excellent":
        return "90%"
      case "good":
        return "70%"
      case "average":
        return "50%"
      case "needs improvement":
        return "30%"
      default:
        return "50%"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-xl bg-transparent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Detailed Feedback</h1>
        <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Score Metrics Row */}
      <Card className="p-4 border-[1.4px] border-primary-200">
        <div className="grid grid-cols-5 gap-4">
          {scores.map((score, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{score.label}</p>
              <div className="flex items-center justify-center gap-1">
                <div className="text-primary-500">{score.icon}</div>
                <span className="text-lg font-bold">{score.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Vertical Rating Bar */}
        <div className="col-span-1">
          <div className="h-full flex flex-col items-center">
            <div className="flex-1 w-4 bg-muted rounded-full overflow-hidden relative">
              <div
                className={`absolute bottom-0 left-0 right-0 ${getRatingColor(overallRating)} rounded-full transition-all`}
                style={{ height: getRatingHeight(overallRating) }}
              />
            </div>
            <p className="mt-4 text-sm font-bold text-center">{overallRating}</p>
          </div>
        </div>

        {/* Right: Conversation and Filters */}
        <div className="col-span-11 space-y-4">
          {/* Error Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
              className="rounded-full"
            >
              <span className="font-bold mr-1">{errorCategories.reduce((sum, cat) => sum + cat.count, 0)}</span>
              All
            </Button>
            {errorCategories.map((cat, index) => (
              <Button
                key={index}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.name)}
                className="rounded-full"
              >
                <span className="font-bold mr-1">{cat.count}</span>
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Conversation */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {conversation.map((turn, index) => (
              <div key={index} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex gap-3 max-w-xl">
                  {turn.role === "tutor" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-600" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Card
                      className={`p-3 border-[1.4px] ${
                        turn.role === "user" ? "bg-primary-50 border-primary-200" : "bg-muted border-border"
                      }`}
                    >
                      {turn.role === "user" && turn.userErrors ? (
                        <p className="text-sm leading-relaxed">{renderTextWithErrors(turn.text, turn.userErrors)}</p>
                      ) : (
                        <p className="text-sm leading-relaxed">{turn.text}</p>
                      )}
                    </Card>

                    {/* Audio waveform for user messages */}
                    {turn.role === "user" && turn.audioUrl && (
                      <div className="flex items-center gap-2 px-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                          <Volume2 className="h-3 w-3" />
                        </Button>
                        <div className="flex-1 h-6 bg-muted rounded-full flex items-center px-2">
                          <div className="w-full h-2 bg-primary-200 rounded-full" />
                        </div>
                      </div>
                    )}

                    {/* Corrected sentence */}
                    {turn.role === "user" && turn.correctedSentence && (
                      <Card className="p-3 bg-success-50 border-[1.4px] border-success-200">
                        <p className="text-xs font-bold text-success-700 mb-1">Correct sentence</p>
                        <p className="text-sm">{renderCorrectedText(turn.correctedSentence, turn.userErrors || [])}</p>
                      </Card>
                    )}
                  </div>

                  {turn.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <Card className="p-4 bg-info-50 border-[1.4px] border-info-200 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-info-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-info-700">{tip}</p>
      </Card>
    </div>
  )
}

// Helper function to render text with error highlights
function renderTextWithErrors(text: string, errors: { word: string; correction: string; type: string }[]) {
  const result = text
  const elements: React.ReactNode[] = []
  let lastIndex = 0

  errors.forEach((error, i) => {
    const index = result.toLowerCase().indexOf(error.word.toLowerCase(), lastIndex)
    if (index !== -1) {
      // Add text before error
      if (index > lastIndex) {
        elements.push(<span key={`text-${i}`}>{result.slice(lastIndex, index)}</span>)
      }
      // Add error word with strikethrough
      elements.push(
        <span key={`error-${i}`} className="text-error-500 line-through">
          {result.slice(index, index + error.word.length)}
        </span>,
      )
      // Add correction
      elements.push(
        <span key={`correction-${i}`} className="text-success-600 font-medium">
          {" "}
          {error.correction}
        </span>,
      )
      lastIndex = index + error.word.length
    }
  })

  // Add remaining text
  if (lastIndex < result.length) {
    elements.push(<span key="remaining">{result.slice(lastIndex)}</span>)
  }

  return elements.length > 0 ? elements : text
}

// Helper function to render corrected text with highlights
function renderCorrectedText(text: string, errors: { word: string; correction: string; type: string }[]) {
  const result = text
  const corrections = errors.map((e) => e.correction.toLowerCase())

  return text.split(" ").map((word, i) => {
    const isCorrection = corrections.some((c) => word.toLowerCase().includes(c) || c.includes(word.toLowerCase()))
    return (
      <span key={i} className={isCorrection ? "text-success-600 font-medium" : ""}>
        {word}{" "}
      </span>
    )
  })
}
