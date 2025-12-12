"use client"

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Topic, VocabItem } from "@/types";

// Helper to map database Topic to UI Topic type
function mapDbTopicToTopic(dbTopic: {
  id: string;
  title: string;
  description: string;
  level: string;
  wordCount: number;
  estimatedTime: number;
  thumbnail: string | null;
}): Topic {
  return {
    id: dbTopic.id,
    title: dbTopic.title,
    description: dbTopic.description,
    level: dbTopic.level as "A1" | "A2" | "B1" | "B2",
    wordCount: dbTopic.wordCount,
    estimatedTime: dbTopic.estimatedTime,
    thumbnail: dbTopic.thumbnail || undefined,
    progress: 0,
  };
}
import {
  Edit,
  Bookmark,
  Network,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";
import {
  HubHero,
  HubTabs,
  CoursesSidebar,
  LevelsSidebar,
  CourseDetail,
  TopicCard,
  type Course,
} from "@/components/hub";
import { VocabMindmap } from "@/components/hub/vocab-mindmap";
import {
  toggleVocabBookmark,
  getVocabBookmarkIds,
  getVocabBookmarks,
} from "@/actions/bookmark";

interface DictionaryWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  level: string;
  category: string;
  masteryLevel: number;
}

interface MindmapTopicGroup {
  id: string;
  name: string;
  color: "primary" | "secondary" | "accent";
  topics: {
    id: string;
    title: string;
    words: VocabItem[];
  }[];
}

interface CurrentTopic {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
}

interface VocabPageClientProps {
  courses: Course[];
  topics: Topic[];
  currentTopic: CurrentTopic;
  dictionaryWords: DictionaryWord[];
  mindmapData: MindmapTopicGroup[];
  initialBookmarkIds?: string[];
}

type TabType = "courses" | "bookmarks" | "mindmap" | "statistic";

export default function VocabPageClient({
  courses,
  topics: initialTopics,
  currentTopic,
  dictionaryWords,
  mindmapData,
  initialBookmarkIds = [],
}: VocabPageClientProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [selectedCourse, setSelectedCourse] = useState<string>("ielts-7");
  const [bookmarkedTopics, setBookmarkedTopics] =
    useState<string[]>(initialBookmarkIds);
  const [dictionarySearch, setDictionarySearch] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null);
  const [selectedDictLevels, setSelectedDictLevels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [bookmarkTotalPages, setBookmarkTotalPages] = useState(1);
  const [bookmarkedTopicsList, setBookmarkedTopicsList] = useState<Topic[]>([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const itemsPerPage = 10;
  const bookmarksPerPage = 8;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const dictLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const filteredDictionaryWords = dictionaryWords.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
      word.meaning.toLowerCase().includes(dictionarySearch.toLowerCase());
    const matchesAlphabet =
      !selectedAlphabet || word.word.toUpperCase().startsWith(selectedAlphabet);
    const matchesLevel =
      selectedDictLevels.length === 0 ||
      selectedDictLevels.includes(word.level);
    return matchesSearch && matchesAlphabet && matchesLevel;
  });

  const totalPages = Math.ceil(filteredDictionaryWords.length / itemsPerPage);
  const paginatedWords = filteredDictionaryWords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch bookmark IDs on mount
  useEffect(() => {
    if (session?.user?.id) {
      getVocabBookmarkIds(session.user.id).then(setBookmarkedTopics);
    }
  }, [session?.user?.id]);

  // Fetch bookmarked topics for Bookmarks tab
  useEffect(() => {
    if (session?.user?.id && activeTab === "bookmarks") {
      setBookmarkLoading(true);
      getVocabBookmarks(session.user.id, bookmarkPage, bookmarksPerPage)
        .then((result) => {
          setBookmarkedTopicsList(result.bookmarks.map(mapDbTopicToTopic));
          setBookmarkTotalPages(result.totalPages);
        })
        .finally(() => setBookmarkLoading(false));
    }
  }, [session?.user?.id, activeTab, bookmarkPage]);

  const handleBookmarkToggle = (topicId: string) => {
    if (!session?.user?.id) return;

    // Optimistic update
    setBookmarkedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );

    startTransition(async () => {
      await toggleVocabBookmark(session.user.id, topicId);
      // Refresh bookmarked topics list if on bookmarks tab
      if (activeTab === "bookmarks") {
        const result = await getVocabBookmarks(
          session.user.id,
          bookmarkPage,
          bookmarksPerPage
        );
        setBookmarkedTopicsList(result.bookmarks.map(mapDbTopicToTopic));
        setBookmarkTotalPages(result.totalPages);
      }
    });
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(topic.level);
    return matchesSearch && matchesLevel;
  });

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const currentCourse =
    courses.find((c) => c.id === selectedCourse) || courses[0];

  const tabs = [
    { id: "courses", label: "Courses" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "mindmap", label: "Mindmap" },
    { id: "statistic", label: "Dictionary" },
  ];

  const toggleDictLevel = (level: string) => {
    setSelectedDictLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  return (
    <ProtectedRoute
      pageName="Vocabulary Hub"
      pageDescription="Build your vocabulary with interactive lessons and spaced repetition."
      pageIcon={PageIcons.vocabulary}
    >
      {loading ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-secondary animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <HubHero
            title="VOCABULARY HUB"
            description="Your daily vocabulary journey starts here."
            primaryAction={{ label: "View your Study Plan" }}
            secondaryAction={{ label: "See All Course" }}
            notification={{
              text: "You have 3 lessons to review",
              actionLabel: "Review now",
            }}
            decorativeWords={["appointment", "outcome", "curiosity"]}
          />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-gray-200 pb-0">
            <div className="flex gap-8 overflow-x-auto pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-3 px-2 text-lg font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="relative mb-4 sm:mb-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
              <Input
                placeholder="Search vocabulary topics..."
                className={`pl-10 pr-10 h-10 text-sm rounded-full border-2 transition-all ${
                  searchQuery
                    ? "w-80 border-primary-400 shadow-lg bg-white"
                    : "w-64 border-primary-200 hover:border-primary-300"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 text-primary-500" />
                </button>
              )}
            </div>
          </div>

          {activeTab === "courses" && (
            <div className="grid lg:grid-cols-5 gap-8 mt-6">
              <div className="lg:col-span-1 space-y-6">
                <CoursesSidebar
                  courses={courses}
                  selectedCourse={selectedCourse}
                  onCourseChange={setSelectedCourse}
                  onAddCourse={() => {}}
                />

                <LevelsSidebar
                  selectedLevels={selectedLevels}
                  onLevelToggle={toggleLevel}
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      id={topic.id}
                      title={topic.title}
                      description={topic.description}
                      level={topic.level}
                      wordCount={topic.wordCount || 25}
                      thumbnail={topic.thumbnail}
                      progress={topic.progress}
                      href={`/vocab/${topic.id}`}
                      onNotYet={() => {}}
                      type="vocabulary"
                      isBookmarked={bookmarkedTopics.includes(topic.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="space-y-6 mt-6">
              {bookmarkedTopicsList.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Bookmark className="h-6 w-6 text-primary-500 fill-primary-500" />
                    <h2 className="text-xl font-bold text-foreground">
                      Your Bookmarked Topics ({bookmarkedTopicsList.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {bookmarkedTopicsList.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.wordCount || 25}
                        thumbnail={topic.thumbnail}
                        progress={topic.progress}
                        href={`/vocab/${topic.id}`}
                        onNotYet={() => {}}
                        type="vocabulary"
                        isBookmarked={true}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {bookmarkTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                        onClick={() =>
                          setBookmarkPage((p) => Math.max(1, p - 1))
                        }
                        disabled={bookmarkPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from(
                        { length: bookmarkTotalPages },
                        (_, i) => i + 1
                      ).map((page) => {
                        const showPage =
                          page === 1 ||
                          page === bookmarkTotalPages ||
                          Math.abs(page - bookmarkPage) <= 1;

                        const showEllipsis =
                          (page === 2 && bookmarkPage > 3) ||
                          (page === bookmarkTotalPages - 1 &&
                            bookmarkPage < bookmarkTotalPages - 2);

                        if (showEllipsis) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <Button
                            key={page}
                            variant={
                              bookmarkPage === page ? "default" : "outline"
                            }
                            size="sm"
                            className="h-9 w-9 p-0 cursor-pointer"
                            onClick={() => setBookmarkPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                        onClick={() =>
                          setBookmarkPage((p) =>
                            Math.min(bookmarkTotalPages, p + 1)
                          )
                        }
                        disabled={bookmarkPage === bookmarkTotalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : bookmarkLoading ? (
                <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 w-16 bg-primary-100 rounded-full mx-auto" />
                    <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
                    <div className="h-4 w-64 bg-gray-100 rounded mx-auto" />
                  </div>
                </Card>
              ) : (
                <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                  <Bookmark className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No Bookmarks Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Click the bookmark icon on any topic card to save it here
                    for quick access.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setActiveTab("courses")}
                    className="cursor-pointer"
                  >
                    Browse Topics
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === "mindmap" && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Network className="h-6 w-6 text-primary-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Vocabulary Mindmap
                </h2>
                <span className="text-sm text-muted-foreground">
                  Explore words organized by topic groups
                </span>
              </div>
              <VocabMindmap topicGroups={mindmapData} />
            </div>
          )}

          {activeTab === "statistic" && (
            <Card className="p-8 rounded-3xl border-2 border-primary-100 bg-white mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Dictionary</h3>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search words..."
                    className="w-64"
                    value={dictionarySearch}
                    onChange={(e) => setDictionarySearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={selectedAlphabet === null ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-10 text-xs font-semibold cursor-pointer"
                    onClick={() => setSelectedAlphabet(null)}
                  >
                    All
                  </Button>
                  {alphabet.map((letter) => (
                    <Button
                      key={letter}
                      variant={
                        selectedAlphabet === letter ? "default" : "outline"
                      }
                      size="sm"
                      className="h-8 w-8 text-xs font-semibold cursor-pointer"
                      onClick={() => setSelectedAlphabet(letter)}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Level:
                  </span>
                  {dictLevels.map((level) => (
                    <Button
                      key={level}
                      variant={
                        selectedDictLevels.includes(level)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold cursor-pointer"
                      onClick={() => toggleDictLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                  {selectedDictLevels.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground cursor-pointer"
                      onClick={() => setSelectedDictLevels([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                Showing {paginatedWords.length} of{" "}
                {filteredDictionaryWords.length} words
                {selectedAlphabet && ` starting with "${selectedAlphabet}"`}
                {selectedDictLevels.length > 0 &&
                  ` at level ${selectedDictLevels.join(", ")}`}
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-bold">Word</TableHead>
                      <TableHead className="font-bold">Pronunciation</TableHead>
                      <TableHead className="font-bold">Meaning</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Level</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWords.length > 0 ? (
                      paginatedWords.map((word) => (
                        <TableRow
                          key={word.id}
                          className="hover:bg-primary-50/50 transition-colors"
                        >
                          <TableCell className="font-semibold text-primary-600">
                            {word.word}
                          </TableCell>
                          <TableCell className="text-slate-500 font-mono text-sm">
                            {word.pronunciation}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {word.meaning}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {word.partOfSpeech}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary-100 text-primary-700 text-xs">
                              {word.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No words found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      const showEllipsis =
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 &&
                          currentPage < totalPages - 2);

                      if (showEllipsis) {
                        return (
                          <span
                            key={page}
                            className="px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0 cursor-pointer"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
