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
        return "bg-gradient-to-t from-emerald-500 to-emerald-400"
      case "good":
        return "bg-gradient-to-t from-primary-500 to-primary-400"
      case "average":
        return "bg-gradient-to-t from-amber-500 to-amber-400"
      case "needs improvement":
        return "bg-gradient-to-t from-rose-500 to-rose-400"
      default:
        return "bg-gradient-to-t from-primary-500 to-primary-400"
    }
  }

  const getRatingLabelColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "excellent":
        return "text-emerald-600 bg-emerald-50"
      case "good":
        return "text-primary-600 bg-primary-50"
      case "average":
        return "text-amber-600 bg-amber-50"
      case "needs improvement":
        return "text-rose-600 bg-rose-50"
      default:
        return "text-primary-600 bg-primary-50"
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-muted h-10 w-10 bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Detailed Feedback</h1>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted h-10 w-10">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Score Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {scores.map((score, index) => (
          <Card key={index} className="p-4 border-2 border-border bg-white hover:border-primary transition-colors">
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{score.label}</p>
              <div className="p-2 rounded-lg bg-primary-50 text-primary mb-2">
                {score.icon}
              </div>
              <span className="text-xl font-bold text-foreground">{score.value}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Vertical Rating Bar */}
        <div className="col-span-12 md:col-span-1">
          <Card className="h-full py-4 flex flex-col items-center border-2 border-border bg-white">
            <div className="flex-1 w-5 bg-muted rounded-full overflow-hidden relative">
              <div
                className={`absolute bottom-0 left-0 right-0 ${getRatingColor(overallRating)} transition-all duration-1000 ease-out`}
                style={{ height: getRatingHeight(overallRating) }}
              />
            </div>
            <div className={`mt-3 px-2 py-1 rounded text-xs font-bold ${getRatingLabelColor(overallRating)} -rotate-90 md:rotate-0 origin-center`}>
              {overallRating}
            </div>
          </Card>
        </div>

        {/* Right: Conversation and Filters */}
        <div className="col-span-12 md:col-span-11 space-y-4">
          {/* Error Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              size="sm"
              className={`rounded-full ${selectedCategory === "All" ? "bg-primary hover:bg-primary/90" : "border-border hover:bg-muted"}`}
            >
              <span className="font-medium mr-1.5 text-sm">
                {errorCategories.reduce((sum, cat) => sum + cat.count, 0)}
              </span>
              All Errors
            </Button>
            {errorCategories.map((cat, index) => (
              <Button
                key={index}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.name)}
                size="sm"
                className={`rounded-full ${selectedCategory === cat.name ? "bg-primary hover:bg-primary/90" : "border-border hover:bg-muted"}`}
              >
                <span className="font-medium mr-1.5 text-sm">
                  {cat.count}
                </span>
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Conversation */}
          <Card className="p-4 border-2 border-border bg-white max-h-[500px] overflow-y-auto">
            <div className="space-y-6">
              {conversation.map((turn, index) => (
                <div key={index} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-3 max-w-xl">
                    {turn.role === "tutor" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 border border-border flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div
                        className={`p-4 rounded-xl ${turn.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                          }`}
                      >
                        {turn.role === "user" && turn.userErrors ? (
                          <p className="text-sm leading-relaxed">{renderTextWithErrors(turn.text, turn.userErrors)}</p>
                        ) : (
                          <p className="text-sm leading-relaxed">{turn.text}</p>
                        )}
                      </div>

                      {/* Corrected sentence */}
                      {turn.role === "user" && turn.correctedSentence && (
                        <div className="ml-auto rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="h-3 w-3 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-600">Better way</span>
                          </div>
                          <p className="text-sm text-emerald-800">{renderCorrectedText(turn.correctedSentence, turn.userErrors || [])}</p>
                        </div>
                      )}
                    </div>

                    {turn.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
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
      // Add error word with styled badge
      elements.push(
        <span key={`error-${i}`} className="inline-flex flex-col items-center mx-1 align-bottom group cursor-help relative">
          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-semibold line-through decoration-rose-400 decoration-2">
            {result.slice(index, index + error.word.length)}
          </span>
          <span className="absolute bottom-full mb-1 px-2 py-1 bg-rose-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none mb-2">
            {error.type}
            <span className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-rose-800"></span>
          </span>
        </span>,
      )
      // Add correction inline? No, let's just keep the strikethrough distinct and show better version in the correction box
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
    // Check if word contains any correction (handling punctuation)
    const cleanWord = word.replace(/[.,!?]/g, "").toLowerCase()
    const isCorrection = corrections.some((c) => cleanWord === c || c.includes(cleanWord))

    return (
      <span key={i} className={isCorrection ? "text-emerald-600 font-bold bg-emerald-50 px-1 rounded" : ""}>
        {word}{" "}
      </span>
    )
  })
}
