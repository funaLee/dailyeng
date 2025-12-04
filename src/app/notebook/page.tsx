"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  FileText,
  Zap,
  Volume2,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Mic,
  Square,
  X,
  Check,
  RotateCcw,
  Play,
  Shuffle,
  Undo2,
  GraduationCap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ProtectedRoute,
  PageIcons,
} from "@/components/auth/protected-route";

type Collection = {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
};

type NotebookItem = {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string[];
  vietnamese: string[];
  examples: { en: string; vi: string }[];
  partOfSpeech: string;
  level: string;
  note?: string;
  tags: string[];
  collectionId: string;
  masteryLevel: number;
};

export default function NotebookPage() {
  const [selectedCollection, setSelectedCollection] =
    useState<string>("vocabulary");
  const [viewMode, setViewMode] = useState<
    "list" | "flashcards" | "statistics"
  >("list");
  const [searchQuery] = useState("");
  const [starredItems, setStarredItems] = useState<Set<string>>(new Set());
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shadowingOpen, setShadowingOpen] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [cardAnimation, setCardAnimation] = useState<
    "" | "swipe-left" | "swipe-right"
  >("");
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());
  const [notLearnedCards, setNotLearnedCards] = useState<Set<string>>(
    new Set()
  );
  const [sessionCompleteOpen, setSessionCompleteOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const collections: Collection[] = [
    {
      id: "vocabulary",
      name: "Vocabulary",
      icon: <BookOpen className="h-4 w-4" />,
      count: 247,
    },
    {
      id: "grammar",
      name: "Grammar",
      icon: <FileText className="h-4 w-4" />,
      count: 45,
    },
  ];

  const [notebookItems] = useState<NotebookItem[]>([
    {
      id: "1",
      word: "Accomplish",
      pronunciation: "/əˈkʌmplɪʃ/",
      meaning: ["To complete or achieve something successfully"],
      vietnamese: ["Hoàn thành, đạt được"],
      examples: [
        {
          en: "She was able to accomplish all her goals this year.",
          vi: "Cô ấy đã có thể hoàn thành tất cả mục tiêu của mình trong năm nay.",
        },
      ],
      partOfSpeech: "verb",
      level: "B1",
      note: "Often used in professional contexts",
      tags: ["business", "achievement"],
      collectionId: "vocabulary",
      masteryLevel: 65,
    },
    {
      id: "2",
      word: "Collaborate",
      pronunciation: "/kəˈlæbəreɪt/",
      meaning: ["To work together with others on a project or task"],
      vietnamese: ["Cộng tác, làm việc cùng nhau"],
      examples: [
        {
          en: "The teams will collaborate to develop the new software.",
          vi: "Các nhóm sẽ cộng tác để phát triển phần mềm mới.",
        },
      ],
      partOfSpeech: "verb",
      level: "B2",
      note: "Very common in workplace English",
      tags: ["business", "teamwork"],
      collectionId: "vocabulary",
      masteryLevel: 40,
    },
    {
      id: "3",
      word: "behaviour",
      pronunciation: "/bɪˈheɪvjə(r)/",
      meaning: [
        "the way that somebody behaves, especially towards other people",
        "the way a person, an animal, a plant, a chemical, etc. behaves or functions in a particular situation",
      ],
      vietnamese: [
        "Hành vi / cách cư xử (đối với người khác)",
        "Cách hoạt động / phản ứng (trong một tình huống cụ thể)",
      ],
      examples: [
        {
          en: "It is hard to change old patterns of behaviour.",
          vi: "Thật khó để thay đổi những hành vi cũ.",
        },
        {
          en: "Animals in zoos often display disturbed behaviour.",
          vi: "Động vật trong vườn thú thường thể hiện hành vi bất thường.",
        },
      ],
      partOfSpeech: "noun",
      level: "A2",
      tags: [],
      collectionId: "vocabulary",
      masteryLevel: 80,
    },
  ]);

  const filteredItems = notebookItems.filter(
    (item) =>
      item.collectionId === selectedCollection &&
      (item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.some((m) =>
          m.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  // Items to show in flashcards mode (only selected items if any are selected)
  const flashcardItems =
    selectedItems.size > 0
      ? filteredItems.filter((item) => selectedItems.has(item.id))
      : filteredItems;

  const dueCount = 15;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode !== "flashcards" || sessionCompleteOpen) return;

      // Space or Up/Down arrows: flip card
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowDown"
      ) {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      }

      // Left arrow: mark as "not learned" and go to previous card
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (currentItem) {
          setNotLearnedCards((prev) => new Set(prev).add(currentItem.id));
          setLearnedCards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(currentItem.id);
            return newSet;
          });
        }
        setCardAnimation("swipe-left");
        setTimeout(() => {
          if (currentCardIndex < flashcardItems.length - 1) {
            handleNextCard();
          } else {
            setSessionCompleteOpen(true);
          }
          setCardAnimation("");
        }, 500);
      }

      // Right arrow: mark as "learned" and go to next card
      if (e.code === "ArrowRight") {
        e.preventDefault();
        if (currentItem) {
          setLearnedCards((prev) => new Set(prev).add(currentItem.id));
          setNotLearnedCards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(currentItem.id);
            return newSet;
          });
        }
        setCardAnimation("swipe-right");
        setTimeout(() => {
          if (currentCardIndex < flashcardItems.length - 1) {
            handleNextCard();
          } else {
            setSessionCompleteOpen(true);
          }
          setCardAnimation("");
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isFlipped,
    viewMode,
    currentCardIndex,
    flashcardItems.length,
    sessionCompleteOpen,
  ]);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  const handleNextCard = () => {
    if (currentCardIndex < flashcardItems.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  const currentItem = flashcardItems[currentCardIndex];

  return (
    <ProtectedRoute
      pageName="Notebook"
      pageDescription="Save and organize your vocabulary, notes, and learning materials."
      pageIcon={PageIcons.notebook}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 min-h-[calc(100vh-200px)]">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-6 sticky top-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Collections</h2>
              </div>

              <div className="space-y-1">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => {
                      setSelectedCollection(collection.id);
                      setViewMode("flashcards");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      selectedCollection === collection.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {collection.icon}
                      <span>{collection.name}</span>
                    </div>
                    <span className="text-xs">{collection.count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-start"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  New notebook
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* View Tabs */}
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as any)}
              className="w-full mb-6"
            >
              <TabsList className="grid w-full max-w-md grid-cols-3">
                {selectedCollection === "vocabulary" ? (
                  <>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="list">All rules</TabsTrigger>
                    <TabsTrigger value="flashcards">Quizzes</TabsTrigger>
                    <TabsTrigger value="statistics">Statistic</TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>

            {/* Content Area */}
            <div className="flex-1">
              {viewMode === "list" && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all"
                        checked={
                          selectedItems.size === filteredItems.length &&
                          filteredItems.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(
                              new Set(filteredItems.map((item) => item.id))
                            );
                          } else {
                            setSelectedItems(new Set());
                          }
                        }}
                      />
                      <label
                        htmlFor="select-all"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Select All ({selectedItems.size} selected)
                      </label>
                    </div>
                    <Button
                      onClick={() => {
                        setViewMode("flashcards");
                        setCurrentCardIndex(0);
                        setIsFlipped(false);
                      }}
                      disabled={selectedItems.size === 0}
                      className="gap-2"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Practice ({selectedItems.size})
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="w-[180px]">Word</TableHead>
                        <TableHead className="w-[300px]">Meaning</TableHead>
                        <TableHead className="w-[80px]">Level</TableHead>
                        <TableHead className="w-[140px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="py-4">
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedItems);
                                if (checked) {
                                  newSelected.add(item.id);
                                } else {
                                  newSelected.delete(item.id);
                                }
                                setSelectedItems(newSelected);
                              }}
                            />
                          </TableCell>
                          <TableCell className="py-4">
                            <div>
                              <p className="font-semibold">{item.word}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.pronunciation}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="text-sm line-clamp-1">
                                {item.meaning[0]}
                              </p>
                              {item.meaning.length > 1 && (
                                <p className="text-sm line-clamp-1 text-muted-foreground">
                                  {item.meaning[1]}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline">{item.level}</Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${item.masteryLevel}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {item.masteryLevel < 30
                                  ? "Learning"
                                  : item.masteryLevel < 70
                                  ? "Reviewing"
                                  : "Mastered"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {viewMode === "flashcards" && currentItem && (
                <div className="max-w-4xl mx-auto">
                  {/* Counter badges above card */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                      <X className="h-4 w-4 text-orange-600" />
                      <span className="text-lg font-semibold text-orange-600">
                        {notLearnedCards.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-semibold text-green-600">
                        {learnedCards.size}
                      </span>
                    </div>
                  </div>

                  <div
                    className="perspective-1000 cursor-pointer mb-6"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="relative w-full h-[480px] transition-transform duration-500 preserve-3d"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      }}
                    >
                      <Card
                        className="absolute inset-0 backface-hidden p-8"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {/* Overlay for swipe feedback */}
                        {cardAnimation === "swipe-left" && (
                          <div className="absolute inset-0 bg-orange-500/70 flex items-center justify-center rounded-lg z-10 transition-all duration-300 animate-in fade-in">
                            <X className="h-40 w-40 text-white stroke-[4] animate-in zoom-in duration-300" />
                          </div>
                        )}
                        {cardAnimation === "swipe-right" && (
                          <div className="absolute inset-0 bg-green-500/70 flex items-center justify-center rounded-lg z-10 transition-all duration-300 animate-in fade-in">
                            <Check className="h-40 w-40 text-white stroke-[4] animate-in zoom-in duration-300" />
                          </div>
                        )}

                        {/* Top section with badges and star */}
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="text-sm px-3 py-1"
                            >
                              {currentItem.partOfSpeech}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-sm px-3 py-1"
                            >
                              {currentItem.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Mastery Progress Bar */}
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2 w-48">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  New
                                </span>
                                <div className="relative flex-1 h-2 rounded-full overflow-hidden bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100">
                                  <div
                                    className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-green-500 transition-all duration-300"
                                    style={{
                                      clipPath: `inset(0 ${
                                        100 - currentItem.masteryLevel
                                      }% 0 0)`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  Mastered
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 rounded-full p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStarredItems((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(currentItem.id)) {
                                    newSet.delete(currentItem.id);
                                  } else {
                                    newSet.add(currentItem.id);
                                  }
                                  return newSet;
                                });
                              }}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  starredItems.has(currentItem.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Center content */}
                        <div className="flex flex-col items-center justify-center h-[calc(100%-120px)]">
                          <h2 className="text-5xl font-bold">
                            {currentItem.word}
                          </h2>
                        </div>
                      </Card>

                      <Card
                        className="absolute inset-0 backface-hidden p-8 overflow-hidden flex flex-col"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <h2 className="text-3xl font-bold">
                                {currentItem.word}
                              </h2>
                              <Badge variant="secondary" className="text-sm">
                                {currentItem.partOfSpeech}
                              </Badge>
                              <Badge variant="secondary" className="text-sm">
                                {currentItem.level}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 rounded-full p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStarredItems((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(currentItem.id)) {
                                    newSet.delete(currentItem.id);
                                  } else {
                                    newSet.add(currentItem.id);
                                  }
                                  return newSet;
                                });
                              }}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  starredItems.has(currentItem.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>

                          <p className="text-base text-muted-foreground mb-5">
                            {currentItem.pronunciation}
                          </p>

                          {/* Content - scrollable if needed */}
                          <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                                  Meaning
                                </h3>
                                <div className="space-y-2">
                                  {currentItem.meaning.map((m, idx) => (
                                    <div key={idx} className="flex gap-2">
                                      <div className="h-6 w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-blue-700">
                                        {idx + 1}
                                      </div>
                                      <p className="text-sm leading-relaxed">
                                        {m}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                                  Vietnamese
                                </h3>
                                <div className="space-y-2">
                                  {currentItem.vietnamese.map((v, idx) => (
                                    <div key={idx} className="flex gap-2">
                                      <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-green-700">
                                        {idx + 1}
                                      </div>
                                      <p className="text-sm leading-relaxed">
                                        {v}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                                Examples
                              </h3>
                              <div className="space-y-2.5">
                                {currentItem.examples.map((ex, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-muted/50 rounded-lg p-3 space-y-1"
                                  >
                                    <p className="text-sm italic">"{ex.en}"</p>
                                    <p className="text-sm text-muted-foreground">
                                      "{ex.vi}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer button */}
                          <div className="pt-4 mt-3 border-t">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShadowingOpen(true);
                                setCurrentSentence(0);
                              }}
                              variant="outline"
                              className="gap-2 bg-transparent w-full"
                            >
                              <Mic className="h-4 w-4" />
                              Shadowing Practice
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Navigation buttons below card */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        if (currentCardIndex > 0) {
                          setCurrentCardIndex(currentCardIndex - 1);
                          setIsFlipped(false);
                        }
                      }}
                      disabled={currentCardIndex === 0}
                    >
                      <Undo2 className="h-4 w-4" />
                      Back
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                      {currentCardIndex + 1} / {flashcardItems.length}
                    </span>
                    <Button variant="outline" className="gap-2">
                      <Shuffle className="h-4 w-4" />
                      Shuffle
                    </Button>
                  </div>
                </div>
              )}

              {viewMode === "statistics" && (
                <div className="max-w-2xl mx-auto">
                  <Card className="p-8 text-center">
                    <Zap className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Statistics</h2>
                    <p className="text-muted-foreground mb-6">
                      You have{" "}
                      <span className="font-semibold text-primary">
                        {dueCount} words
                      </span>{" "}
                      ready for review today.
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                      Consistent daily practice helps reinforce your learning
                      and improve retention.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Start Practice
                    </Button>
                  </Card>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-500">247</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total Words
                      </p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-500">182</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mastered
                      </p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-500">7</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Day Streak
                      </p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Practice Review</DialogTitle>
            </DialogHeader>
            {currentItem && (
              <div className="space-y-6">
                <Card className="p-6 bg-muted/30">
                  <h3 className="text-2xl font-bold mb-2">
                    {currentItem.word}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {currentItem.pronunciation}
                  </p>

                  {showAnswer ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Meaning:</p>
                        {currentItem.meaning.map((m, idx) => (
                          <p key={idx} className="text-sm">
                            • {m}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">
                          Vietnamese:
                        </p>
                        {currentItem.vietnamese.map((v, idx) => (
                          <p key={idx} className="text-sm">
                            • {v}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowAnswer(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Show Answer
                    </Button>
                  )}
                </Card>

                {showAnswer && (
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100"
                    >
                      Again
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-yellow-50 hover:bg-yellow-100"
                    >
                      Hard
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100"
                    >
                      Good
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100"
                    >
                      Easy
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={shadowingOpen} onOpenChange={setShadowingOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-6">
                Shadowing this sentence
              </DialogTitle>
            </DialogHeader>
            {currentItem && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setCurrentSentence(Math.max(0, currentSentence - 1))
                    }
                    disabled={currentSentence === 0}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">
                    Câu {currentSentence + 1} / {currentItem.examples.length}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setCurrentSentence(
                        Math.min(
                          currentItem.examples.length - 1,
                          currentSentence + 1
                        )
                      )
                    }
                    disabled={
                      currentSentence === currentItem.examples.length - 1
                    }
                    className="rounded-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <Card className="p-6 bg-muted/30">
                  <p className="text-xl mb-4">
                    {currentItem.examples[currentSentence].en}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {currentItem.examples[currentSentence].vi}
                  </p>
                </Card>

                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={handleRecording}
                    className="h-24 w-24 rounded-full"
                  >
                    {isRecording ? (
                      <Square className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {isRecording
                      ? "Recording... Click to stop"
                      : "Click to start recording"}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Volume2 className="h-4 w-4" />
                    Play Original
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    disabled={!isRecording}
                  >
                    <Volume2 className="h-4 w-4" />
                    Play Recording
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Session Complete Dialog */}
        <Dialog
          open={sessionCompleteOpen}
          onOpenChange={setSessionCompleteOpen}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">
                Review Complete
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              {/* Circular Progress Chart */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#fed7aa"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${
                        (notLearnedCards.size /
                          (learnedCards.size + notLearnedCards.size)) *
                        502.4
                      } 502.4`}
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#86efac"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${
                        (learnedCards.size /
                          (learnedCards.size + notLearnedCards.size)) *
                        502.4
                      } 502.4`}
                      strokeDashoffset={`-${
                        (notLearnedCards.size /
                          (learnedCards.size + notLearnedCards.size)) *
                        502.4
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">
                      {Math.round(
                        (learnedCards.size /
                          (learnedCards.size + notLearnedCards.size)) *
                          100
                      )}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-300"></div>
                    <div>
                      <p className="text-sm font-medium">Learning</p>
                      <p className="text-xs text-muted-foreground">
                        {notLearnedCards.size} cards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-300"></div>
                    <div>
                      <p className="text-sm font-medium">Mastered</p>
                      <p className="text-xs text-muted-foreground">
                        {learnedCards.size} cards
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  disabled={notLearnedCards.size === 0}
                  onClick={() => {
                    setCurrentCardIndex(0);
                    setSessionCompleteOpen(false);
                    setIsFlipped(false);
                  }}
                >
                  <Play className="h-5 w-5" />
                  Review Unmastered Cards ({notLearnedCards.size})
                </Button>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setCurrentCardIndex(0);
                    setLearnedCards(new Set());
                    setNotLearnedCards(new Set());
                    setSessionCompleteOpen(false);
                    setIsFlipped(false);
                  }}
                >
                  <RotateCcw className="h-5 w-5" />
                  Start Over
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
