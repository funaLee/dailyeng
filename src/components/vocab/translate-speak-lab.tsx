"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Check, X, Trophy, Star } from "lucide-react";

interface TranslateSpeakLabProps {
  topicTitle: string;
}

export function TranslateSpeakLab({ topicTitle }: TranslateSpeakLabProps) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [translation, setTranslation] = useState("");
  const [checkedWords, setCheckedWords] = useState<Set<number>>(new Set());
  const [checkedGrammar, setCheckedGrammar] = useState<Set<number>>(new Set());
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(
    new Set()
  );
  const [showResults, setShowResults] = useState(false);

  const sentences = [
    {
      vietnamese:
        "Trong lớp, có giáo luôn khen những bạn có hành vi tốt, nhắc nhở những bạn có hành vi xấu, và đặc biệt chú ý đến những hành vi kỳ lạ trong cách cư xử với người khác.",
      sampleAnswer:
        "In class, teachers always praise students with good behaviour, remind those with bad behaviour, and pay special attention to strange behaviour in the way they interact with others.",
      vocabularyHints: [
        { word: "praise (n)", meaning: "khen" },
        { word: "pay attention (v)", meaning: "chú ý" },
        { word: "strange (adj)", meaning: "kỳ lạ" },
      ],
      grammarHints: [
        "praise + someone + for + something",
        "remind / warn + someone + about + something",
        "pay attention to + something",
        "behaviour towards + someone",
      ],
    },
    {
      vietnamese:
        "Học sinh cần có hành vi tốt trong lớp học và tôn trọng giáo viên.",
      sampleAnswer:
        "Students need to have good behaviour in the classroom and respect teachers.",
      vocabularyHints: [
        { word: "respect (v)", meaning: "tôn trọng" },
        { word: "classroom (n)", meaning: "lớp học" },
        { word: "student (n)", meaning: "học sinh" },
      ],
      grammarHints: [
        "need to + verb",
        "show respect to + someone",
        "behave well in + place",
      ],
    },
  ];

  const currentData = sentences[currentSentence];
  const totalSentences = sentences.length;

  const wordCount = translation.trim()
    ? translation.trim().split(/\s+/).length
    : 0;

  const handleCheck = () => {
    setIsChecked(true);
    // Simple check - in real app, would use more sophisticated comparison
    const isAnswerCorrect = translation.trim().length > 10;
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setCompletedSentences((prev) => new Set(prev).add(currentSentence));
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1);
      setTranslation("");
      setCheckedWords(new Set());
      setCheckedGrammar(new Set());
      setIsChecked(false);
      setIsCorrect(null);
    }
  };

  const handleNext = () => {
    if (currentSentence < totalSentences - 1) {
      setCurrentSentence(currentSentence + 1);
      setTranslation("");
      setCheckedWords(new Set());
      setCheckedGrammar(new Set());
      setIsChecked(false);
      setIsCorrect(null);
    } else {
      setShowResults(true);
    }
  };

  const handleToggleWord = (index: number) => {
    setCheckedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleToggleGrammar = (index: number) => {
    setCheckedGrammar((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRetry = () => {
    setShowResults(false);
    setCurrentSentence(0);
    setTranslation("");
    setCheckedWords(new Set());
    setCheckedGrammar(new Set());
    setIsChecked(false);
    setIsCorrect(null);
    setCompletedSentences(new Set());
  };

  if (showResults) {
    const correctCount = completedSentences.size;
    const accuracy = Math.round((correctCount / totalSentences) * 100);

    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-blue-900" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Congratulations!</h2>
            <p className="text-muted-foreground">
              You've completed all translation exercises
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">{correctCount}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {totalSentences}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 ${
                  i < Math.floor(accuracy / 20)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = "/vocab")}>
              Back to Topics
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Vietnamese sentence and translation */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Vietnamese sentence:</h3>
            <p className="text-sm mb-6 leading-relaxed">
              {currentData.vietnamese}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Translation:</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                >
                  Sample answer
                </Button>
              </div>

              <div className="relative">
                <textarea
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  placeholder="Type your translation here..."
                  className="w-full h-32 p-4 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isChecked}
                />
                <button
                  className="absolute bottom-3 right-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Voice input"
                >
                  <Mic className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {wordCount} words
                </span>
                {!isChecked ? (
                  <Button
                    size="sm"
                    onClick={handleCheck}
                    disabled={translation.trim().length === 0}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Check
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Great job!
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          Try again
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {isChecked && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Sample answer:
                  </p>
                  <p className="text-sm text-blue-800">
                    {currentData.sampleAnswer}
                  </p>
                </Card>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <div className="space-y-2">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 transition-all duration-500 ease-out shadow-md"
                    style={{
                      width: `${
                        ((currentSentence + 1) / totalSentences) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-900 text-sm font-medium">
                    {currentSentence + 1} / {totalSentences}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSentence === 0}
                >
                  Previous
                </Button>
                <Button onClick={handleNext} disabled={!isChecked}>
                  {currentSentence >= totalSentences - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Hints */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Suggested words:</h3>
            <div className="space-y-3">
              {currentData.vocabularyHints.map((hint, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={checkedWords.has(idx)}
                    onChange={() => handleToggleWord(idx)}
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <p
                    className={`text-sm flex-1 transition-colors ${
                      checkedWords.has(idx)
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    <span className="font-medium">{hint.word}:</span>{" "}
                    {hint.meaning}
                  </p>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Suggested grammar patterns:
            </h3>
            <div className="space-y-3">
              {currentData.grammarHints.map((hint, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={checkedGrammar.has(idx)}
                    onChange={() => handleToggleGrammar(idx)}
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <p
                    className={`text-sm flex-1 transition-colors ${
                      checkedGrammar.has(idx)
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {hint}
                  </p>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
