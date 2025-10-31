"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlossaryItem {
  word: string
  definition: string
  vietnamese: string
}

interface ReadingQuestion {
  id: string
  question: string
  type: "multiple-choice" | "short-answer"
  options?: string[]
  correctAnswer: string
  explanation: string
}

interface ReadingPassage {
  id: string
  title: string
  content: string
  glossary: GlossaryItem[]
  questions: ReadingQuestion[]
}

interface ReadingSectionProps {
  passage: ReadingPassage
}

export function ReadingSection({ passage }: ReadingSectionProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const glossaryMap = new Map(passage.glossary.map((item) => [item.word.toLowerCase(), item]))

  const handleWordHover = (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
    if (glossaryMap.has(word.toLowerCase())) {
      const rect = e.currentTarget.getBoundingClientRect()
      setTooltipPos({ x: rect.left, y: rect.top - 10 })
      setHoveredWord(word)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const correctCount = passage.questions.filter((q) => answers[q.id] === q.correctAnswer).length

  return (
    <div className="space-y-6">
      {/* Passage */}
      <Card className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">{passage.title}</h2>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
            {passage.content.split(/\b/).map((token, idx) => {
              const word = token.trim()
              const isGlossaryWord = glossaryMap.has(word.toLowerCase())

              if (!word) return token

              return (
                <span
                  key={idx}
                  onMouseEnter={(e) => handleWordHover(e, word)}
                  onMouseLeave={() => setHoveredWord(null)}
                  className={cn(isGlossaryWord ? "cursor-help border-b-2 border-blue-400 hover:bg-blue-500/10" : "")}
                >
                  {token}
                </span>
              )
            })}
          </p>
        </div>

        {/* Glossary Tooltip */}
        {hoveredWord && glossaryMap.has(hoveredWord.toLowerCase()) && (
          <div
            className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg p-3 max-w-xs"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: "translateY(-100%)",
            }}
          >
            <p className="font-semibold text-sm">{hoveredWord}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {glossaryMap.get(hoveredWord.toLowerCase())?.definition}
            </p>
            <p className="text-xs text-blue-600 mt-1">{glossaryMap.get(hoveredWord.toLowerCase())?.vietnamese}</p>
          </div>
        )}
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Comprehension Questions</h3>

        {passage.questions.map((question, idx) => {
          const isCorrect = answers[question.id] === question.correctAnswer
          const isAnswered = question.id in answers

          return (
            <Card key={question.id} className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="font-semibold text-base flex-1">{question.question}</h4>
              </div>

              {question.type === "multiple-choice" ? (
                <div className="space-y-2 ml-9">
                  {question.options?.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerChange(question.id, option)}
                      disabled={submitted}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border-2 transition-colors",
                        answers[question.id] === option
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50",
                        submitted && option === question.correctAnswer ? "border-green-500 bg-green-500/10" : "",
                        submitted && answers[question.id] === option && !isCorrect
                          ? "border-red-500 bg-red-500/10"
                          : "",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Type your answer..."
                  disabled={submitted}
                  className="w-full min-h-20 p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 ml-9"
                />
              )}

              {/* Feedback */}
              {submitted && isAnswered && (
                <div
                  className={cn(
                    "ml-9 p-4 rounded-lg flex items-start gap-3",
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
                    <p className="text-muted-foreground mt-1">{question.explanation}</p>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <Button onClick={handleSubmit} size="lg" className="w-full">
          Submit Answers
        </Button>
      )}

      {/* Results Summary */}
      {submitted && (
        <Card className="p-6 space-y-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Results</h3>
            <span className="text-2xl font-bold text-primary">
              {correctCount}/{passage.questions.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {correctCount === passage.questions.length
              ? "Perfect! You understood the passage well."
              : `You got ${correctCount} out of ${passage.questions.length} correct. Review the explanations above.`}
          </p>
        </Card>
      )}

      {/* Review Suggestions */}
      <Card className="p-6 space-y-4 bg-blue-500/5 border-blue-500/20">
        <h3 className="font-semibold flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Review Suggestions
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            After finishing reading practice, reinforce your learning with related activities.
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
