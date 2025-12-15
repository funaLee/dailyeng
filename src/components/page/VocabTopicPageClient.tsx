"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopicHeader } from "@/components/hub";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { VocabFlashcardStack } from "@/components/learning/VocabFlashcardStack";
import { VocabPracticeMode } from "@/components/learning/VocabPracticeMode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Flame, BookOpen, GraduationCap, ChevronLeft } from "lucide-react";

interface VocabTopicPageClientProps {
  topicId: string;
  topic: {
    id: string;
    title: string;
    description: string;
    level: string;
  };
  vocab: any[];
}

export default function VocabTopicPageClient({
  topicId,
  topic,
  vocab,
}: VocabTopicPageClientProps) {
  const router = useRouter();
  const [learningPhase, setLearningPhase] = useState<"study" | "practice">("study");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [wordStatuses, setWordStatuses] = useState<Record<string, string>>({});

  // Use all vocab, no level filtering for now as per user request to show list
  const displayVocab = vocab;

  const handleRate = (wordId: string, rating: string) => {
    setWordStatuses(prev => ({
      ...prev,
      [wordId]: rating
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "again": return "bg-red-500";
      case "hard": return "bg-orange-500";
      case "good": return "bg-yellow-500";
      case "easy": return "bg-green-500";
      case "master": return "bg-blue-500";
      default: return "bg-slate-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4 h-[calc(100vh-80px)] flex flex-col">
        {/* Topic Header */}
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2 -ml-2 text-slate-500 hover:text-slate-900"
            onClick={() => router.push('/vocab')}
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Vocabulary Hub
          </Button>

          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
            {topic.title}
          </h1>
        </div>

        {/* Level Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border-2 border-border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Mode:</span>
            <div className="flex gap-2">
              <Button
                variant={learningPhase === "study" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearningPhase("study")}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" /> Learn
              </Button>
              <Button
                variant={learningPhase === "practice" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearningPhase("practice")}
                className="gap-2"
              >
                <Flame className="h-4 w-4" /> Practice
              </Button>
            </div>
          </div>
        </div>

        {/* Main Learning Content */}
        <div className="flex-1 min-h-0">
          {learningPhase === "study" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
              {/* Left: Vocab List */}
              <div className="md:col-span-4 lg:col-span-3 bg-white rounded-xl border-2 border-border shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-3 border-b border-border bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 text-lg">Words</h3>
                  <span className="text-[12px] bg-white px-2 py-0.5 rounded-full border border-border text-slate-500">{displayVocab.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {displayVocab.map((word, idx) => (
                    <button
                      key={word.id}
                      onClick={() => setCurrentWordIndex(idx)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center justify-between group text-md ${idx === currentWordIndex
                        ? "bg-primary-50 text-primary-700 font-semibold ring-1 ring-primary-200"
                        : "hover:bg-slate-50 text-slate-600"
                        }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${wordStatuses[word.id] ? getStatusColor(wordStatuses[word.id]) : "bg-slate-200"}`} />
                        <span className="truncate">{word.word}</span>
                      </div>
                      {idx === currentWordIndex && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Flashcards */}
              <div className="md:col-span-8 lg:col-span-9 h-full flex flex-col">
                <VocabFlashcardStack
                  words={displayVocab}
                  currentIndex={currentWordIndex}
                  onIndexChange={setCurrentWordIndex}
                  onRate={handleRate}
                  onComplete={() => setLearningPhase("practice")}
                />
              </div>
            </div>
          ) : (
            <VocabPracticeMode />
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
}
