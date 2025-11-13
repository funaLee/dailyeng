"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, BookOpen, ChevronLeft, ChevronRight, Star } from "lucide-react"
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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set())
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)

  const glossaryMap = new Map(passage.glossary.map((item) => [item.word.toLowerCase(), item]))
  const currentQ = passage.questions[currentQuestion]
  const isCurrentAnswered = currentQ?.id in answers
  const isCurrentChecked = checkedQuestions.has(currentQ?.id || "")
  const isCurrentCorrect = answers[currentQ?.id] === currentQ?.correctAnswer

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleCheck = () => {
    if (currentQ) {
      setCheckedQuestions((prev) => new Set([...prev, currentQ.id]))
    }
  }

  const handleNext = () => {
    if (currentQuestion < passage.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowHint(false)
    } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowHint(false)
    }
  }

  const correctCount = passage.questions.filter((q) => answers[q.id] === q.correctAnswer).length
  const accuracy = Math.round((correctCount / passage.questions.length) * 100)
  const stars = Math.ceil((correctCount / passage.questions.length) * 5)

  if (completed) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center space-y-6">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                className={cn("h-12 w-12", idx < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
              />
            ))}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">Reading Complete!</h2>
            <p className="text-muted-foreground">Great job on finishing the reading practice</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="text-2xl font-bold text-blue-900">{passage.questions.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-2xl font-bold text-green-900">{correctCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-purple-900">{accuracy}%</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setCompleted(false)
                setCurrentQuestion(0)
                setAnswers({})
                setCheckedQuestions(new Set())
              }}
            >
              Retry
            </Button>
            <Button>Back to Topics</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Vocabulary from this passage
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {passage.glossary.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                <p className="font-semibold text-sm">{item.word}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.definition}</p>
                <p className="text-xs text-blue-600 mt-1">{item.vietnamese}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card className="p-6 space-y-4 lg:sticky lg:top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h2 className="text-xl font-bold text-center">{passage.title}</h2>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {passage.content.split(/\b/).map((token, idx) => {
              const word = token.trim()
              const isGlossaryWord = glossaryMap.has(word.toLowerCase())

              if (!word) return token

              return (
                <span
                  key={idx}
                  className={cn(isGlossaryWord ? "cursor-help border-b border-blue-400 hover:bg-blue-500/10" : "")}
                  title={isGlossaryWord ? glossaryMap.get(word.toLowerCase())?.definition : undefined}
                >
                  {token}
                </span>
              )
            })}
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-4 flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
              {currentQuestion + 1}
            </div>
            <h3 className="font-semibold">Question's content</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
        </div>

        <p className="text-sm font-medium">{currentQ?.question}</p>

        {showHint && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
            <p className="font-semibold mb-1">Hint:</p>
            <p>{currentQ?.explanation}</p>
          </div>
        )}

        <div className="space-y-2 flex-1">
          {currentQ?.type === "multiple-choice" ? (
            currentQ.options?.map((option, optIdx) => (
              <button
                key={optIdx}
                onClick={() => handleAnswerChange(currentQ.id, option)}
                disabled={isCurrentChecked}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-colors text-sm",
                  answers[currentQ.id] === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 bg-gray-50",
                  isCurrentChecked && option === currentQ.correctAnswer ? "border-green-500 bg-green-50" : "",
                  isCurrentChecked && answers[currentQ.id] === option && !isCurrentCorrect
                    ? "border-red-500 bg-red-50"
                    : "",
                )}
              >
                {option}
              </button>
            ))
          ) : (
            <textarea
              value={answers[currentQ?.id] || ""}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Type your answer..."
              disabled={isCurrentChecked}
              className="w-full min-h-32 p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />
          )}
        </div>

        {isCurrentChecked && (
          <div
            className={cn(
              "p-4 rounded-lg flex items-start gap-3",
              isCurrentCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200",
            )}
          >
            {isCurrentCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className={cn("font-semibold", isCurrentCorrect ? "text-green-700" : "text-red-700")}>
                {isCurrentCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-muted-foreground mt-1">{currentQ?.explanation}</p>
            </div>
          </div>
        )}

        {!isCurrentChecked && isCurrentAnswered && (
          <Button onClick={handleCheck} className="w-full">
            Check Answer
          </Button>
        )}

        <div className="border-t border-border pt-4 space-y-4">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / passage.questions.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm font-medium px-4 py-1 rounded-full bg-blue-100 text-blue-900">
              {currentQuestion + 1} / {passage.questions.length}
            </span>

            <Button onClick={handleNext} disabled={!isCurrentChecked} className="gap-2">
              {currentQuestion === passage.questions.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
