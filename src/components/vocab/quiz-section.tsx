"use client";
import type { QuizItem } from "@/src/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, XCircle, BookMarked, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface QuizSectionProps {
  items: QuizItem[];
  topicId?: string;
}

interface WrongItem {
  item: QuizItem;
  userAnswer: string;
}

export function QuizSection({ items, topicId }: QuizSectionProps) {
  const { addXP } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongItems, setWrongItems] = useState<WrongItem[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const current = items[currentIndex];
  const isCorrect = selectedAnswer === current.correctAnswer;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongItems((prev) => [
        ...prev,
        { item: current, userAnswer: selectedAnswer },
      ]);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      const xpEarned = score * 10;
      addXP(xpEarned);
      setQuizComplete(true);
    }
  };

  const handleAddToFlashcards = () => {
    // Mock: In real app, would save these to flashcards
    console.log("[v0] Adding wrong items to flashcards:", wrongItems);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setWrongItems([]);
    setQuizComplete(false);
  };

  const progress = ((currentIndex + 1) / items.length) * 100;

  if (quizComplete) {
    const xpEarned = score * 10;
    const percentage = Math.round((score / items.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground">
              Great job on finishing the quiz.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-3xl font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground mt-1">Correct</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg">
              <p className="text-3xl font-bold text-red-500">
                {items.length - score}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Incorrect</p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-3xl font-bold text-yellow-500">
                {percentage}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Score</p>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-green-500" />
              <p className="font-semibold text-green-700">
                +{xpEarned} XP Earned!
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep up the great work!
            </p>
          </div>

          {wrongItems.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                You got {wrongItems.length} items wrong
              </p>
              <Button
                onClick={handleAddToFlashcards}
                variant="outline"
                className="w-full gap-2 bg-transparent"
              >
                <BookMarked className="h-4 w-4" />
                Add Wrong Items to Flashcards
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleRestart} className="flex-1">
              Retake Quiz
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Back to Topic
            </Button>
          </div>
        </Card>

        {/* Wrong Items Review */}
        {wrongItems.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Items to Review</h3>
            <div className="space-y-4">
              {wrongItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-red-200 rounded-lg bg-red-50"
                >
                  <p className="font-medium mb-2">{item.item.question}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Your answer:</p>
                      <p className="text-red-600 font-medium">
                        {item.userAnswer}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Correct answer:</p>
                      <p className="text-green-600 font-medium">
                        {item.item.correctAnswer}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-red-200">
                      <p className="text-muted-foreground text-xs">
                        {item.item.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">
            Question {currentIndex + 1} of {items.length}
          </p>
          <p className="text-sm font-medium">Score: {score}</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">{current.question}</h3>

        {current.type === "multiple-choice" && (
          <div className="space-y-3 mb-6">
            {current.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAnswer === option
                    ? showResult
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && selectedAnswer === option && (
                    <>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {current.type === "fill-blank" && (
          <div className="mb-6">
            <input
              type="text"
              value={selectedAnswer || ""}
              onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
              disabled={showResult}
              placeholder="Type your answer here..."
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                showResult
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-border focus:border-primary focus:outline-none"
              }`}
            />
          </div>
        )}

        {current.type === "matching" && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Match the items:
            </p>
            {current.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAnswer === option
                    ? showResult
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && selectedAnswer === option && (
                    <>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Explanation */}
        {showResult && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className="text-sm font-medium mb-2">
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            <p className="text-sm text-muted-foreground">
              {current.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentIndex < items.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
