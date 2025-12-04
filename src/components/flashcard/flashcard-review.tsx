"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCw } from "lucide-react";
import type { SRSCard, ReviewQuality } from "@/lib/srs";
import { calculateNextReview } from "@/lib/srs";

interface FlashcardReviewProps {
  cards: SRSCard[];
  onComplete: (updatedCards: SRSCard[]) => void;
}

export function FlashcardReview({ cards, onComplete }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [updatedCards, setUpdatedCards] = useState<SRSCard[]>(cards);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
  });

  const current = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleReview = (quality: ReviewQuality) => {
    const updated = calculateNextReview(current, quality);
    const newCards = [...updatedCards];
    newCards[currentIndex] = updated;

    setUpdatedCards(newCards);
    setSessionStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (quality >= 3 ? 1 : 0),
      incorrect: prev.incorrect + (quality < 3 ? 1 : 0),
    }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete(newCards);
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!current) return null;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">
            Card {currentIndex + 1} of {cards.length}
          </p>
          <p className="text-sm font-medium">
            Correct: {sessionStats.correct} | Incorrect:{" "}
            {sessionStats.incorrect}
          </p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer perspective h-64 rounded-2xl"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s",
        }}
      >
        <Card
          className={`h-full flex flex-col items-center justify-center p-8 text-center ${
            isFlipped ? "bg-primary text-primary-foreground" : "bg-secondary"
          }`}
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              {isFlipped ? "Answer" : "Question"}
            </p>
            <p className="text-3xl font-bold">
              {isFlipped ? current.back : current.front}
            </p>
            <p className="text-sm text-muted-foreground">
              Click to {isFlipped ? "see question" : "reveal answer"}
            </p>

            {isFlipped && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(current.back);
                }}
                className="gap-2 mx-auto"
              >
                <Volume2 className="h-4 w-4" />
                Pronounce
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Actions */}
      {isFlipped && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-center">
            How well did you remember this?
          </p>
          <div className="grid grid-cols-5 gap-2">
            <Button
              variant="outline"
              onClick={() => handleReview(0)}
              className="text-xs"
              title="Again - Forgot completely"
            >
              Again
            </Button>
            <Button
              variant="outline"
              onClick={() => handleReview(1)}
              className="text-xs"
              title="Hard - Remembered with difficulty"
            >
              Hard
            </Button>
            <Button
              variant="outline"
              onClick={() => handleReview(2)}
              className="text-xs"
              title="Good - Remembered with effort"
            >
              Good
            </Button>
            <Button
              variant="outline"
              onClick={() => handleReview(3)}
              className="text-xs"
              title="Easy - Remembered easily"
            >
              Easy
            </Button>
            <Button
              variant="outline"
              onClick={() => handleReview(4)}
              className="text-xs"
              title="Perfect - Remembered instantly"
            >
              Perfect
            </Button>
          </div>
        </div>
      )}

      {!isFlipped && (
        <div className="text-center">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => setIsFlipped(true)}
          >
            <RotateCw className="h-4 w-4" />
            Reveal Answer
          </Button>
        </div>
      )}
    </div>
  );
}
