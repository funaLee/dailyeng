"use client";

import type { VocabItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, BookmarkPlus } from "lucide-react";
import { useState } from "react";

interface WordCardProps {
  word: VocabItem;
  onAddFlashcard?: (word: VocabItem) => void;
}

export function WordCard({ word, onAddFlashcard }: WordCardProps) {
  const [saved, setSaved] = useState(false);

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddFlashcard = () => {
    setSaved(true);
    onAddFlashcard?.(word);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Word Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{word.word}</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {word.pronunciation}
            </p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              {word.partOfSpeech}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSpeak}
            aria-label="Pronounce word"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Meanings */}
        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              English
            </p>
            <p className="text-sm">{word.meaning}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Vietnamese
            </p>
            <p className="text-sm">{word.vietnameseMeaning}</p>
          </div>
        </div>

        {/* Collocations */}
        {word.collocations.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Collocations
            </p>
            <div className="flex flex-wrap gap-2">
              {word.collocations.map((collocation, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-secondary px-2 py-1 rounded"
                >
                  {collocation}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Example */}
        <div className="bg-secondary/50 p-3 rounded-lg">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
            Example
          </p>
          <p className="text-sm mb-2">{word.exampleSentence}</p>
          <p className="text-xs text-muted-foreground italic">
            {word.exampleTranslation}
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant={saved ? "default" : "outline"}
          className="w-full gap-2"
          onClick={handleAddFlashcard}
        >
          <BookmarkPlus className="h-4 w-4" />
          {saved ? "Added to Flashcards" : "Add to Flashcards"}
        </Button>
      </div>
    </Card>
  );
}
