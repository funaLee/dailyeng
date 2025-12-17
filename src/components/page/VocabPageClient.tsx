"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  X,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Network,
  Edit,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
  TopicGroupsSidebar,
  LevelsSidebar,
  TopicCard,
  SubcategoryPills,
  type TopicGroup,
} from "@/components/hub";
import { VocabMindmap } from "@/components/hub/vocab-mindmap";
import { mockVocab } from "@/lib/mock-data";
import {
  getVocabTopicGroups,
  getVocabTopicsWithProgress,
  searchVocabTopics,
} from "@/actions/vocab";

// Interface for vocab topics from server
interface VocabTopic {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  subcategory: string;
  wordCount: number;
  estimatedTime: number;
  progress: number;
  thumbnail?: string;
}

interface VocabPageClientProps {
  userId: string;
}

// Mock data for Dictionary tab
const MOCK_DICTIONARY_WORDS = [
  {
    id: "1",
    word: "Abandon",
    pronunciation: "/əˈbændən/",
    meaning: "To leave behind or give up completely",
    partOfSpeech: "Verb",
    level: "B1",
  },
  {
    id: "2",
    word: "Accomplish",
    pronunciation: "/əˈkʌmplɪʃ/",
    meaning: "To complete or achieve something successfully",
    partOfSpeech: "Verb",
    level: "B1",
  },
  {
    id: "3",
    word: "Benefit",
    pronunciation: "/ˈbenɪfɪt/",
    meaning: "An advantage or profit gained from something",
    partOfSpeech: "Noun",
    level: "A2",
  },
  {
    id: "4",
    word: "Collaborate",
    pronunciation: "/kəˈlæbəreɪt/",
    meaning: "To work together with others on a project",
    partOfSpeech: "Verb",
    level: "B2",
  },
  {
    id: "5",
    word: "Determine",
    pronunciation: "/dɪˈtɜːmɪn/",
    meaning: "To decide or establish something precisely",
    partOfSpeech: "Verb",
    level: "B1",
  },
  {
    id: "6",
    word: "Efficient",
    pronunciation: "/ɪˈfɪʃnt/",
    meaning: "Working in a well-organized and competent way",
    partOfSpeech: "Adjective",
    level: "B2",
  },
  {
    id: "7",
    word: "Family",
    pronunciation: "/ˈfæmɪli/",
    meaning: "A group of people related by blood or marriage",
    partOfSpeech: "Noun",
    level: "A1",
  },
  {
    id: "8",
    word: "Generate",
    pronunciation: "/ˈdʒenəreɪt/",
    meaning: "To produce or create something",
    partOfSpeech: "Verb",
    level: "B2",
  },
  {
    id: "9",
    word: "Hypothesis",
    pronunciation: "/haɪˈpɒθəsɪs/",
    meaning: "A proposed explanation for a phenomenon",
    partOfSpeech: "Noun",
    level: "C1",
  },
  {
    id: "10",
    word: "Implement",
    pronunciation: "/ˈɪmplɪment/",
    meaning: "To put a plan or decision into effect",
    partOfSpeech: "Verb",
    level: "B2",
  },
];

// Mock data for Mindmap tab
const MOCK_MINDMAP_DATA = [
  {
    id: "daily-life",
    name: "Daily Life",
    color: "primary" as const,
    topics: [
      { id: "1", title: "Travel", words: mockVocab["1"] || [] },
      { id: "2", title: "Food & Dining", words: mockVocab["2"] || [] },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    color: "secondary" as const,
    topics: [{ id: "3", title: "Job Interview", words: mockVocab["3"] || [] }],
  },
  {
    id: "academic",
    name: "Academic",
    color: "accent" as const,
    topics: [
      {
        id: "academic-1",
        title: "Science",
        words: mockVocab["1"]?.slice(0, 3) || [],
      },
    ],
  },
];

type TabType = "topics" | "bookmarks" | "mindmap" | "dictionary";

const TOPICS_PER_PAGE = 12;

export default function VocabPageClient({ userId }: VocabPageClientProps) {
  // Loading states
  const [topicGroupsLoading, setTopicGroupsLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);

  // Data states
  const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
  const [topics, setTopics] = useState<VocabTopic[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTopics, setTotalTopics] = useState(0);

  // Filters - defaults: All subcategory, no level filter (All)
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Search & UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VocabTopic[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);

  // Dictionary state
  const [dictionarySearch, setDictionarySearch] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null);
  const [selectedDictLevels, setSelectedDictLevels] = useState<string[]>([]);
  const [dictPage, setDictPage] = useState(1);
  const dictItemsPerPage = 10;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const dictLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  // Fetch topic groups on mount
  useEffect(() => {
    getVocabTopicGroups()
      .then((groups) => {
        setTopicGroups(groups);
        // Set first group as selected if available
        if (groups.length > 0 && !selectedGroup) {
          setSelectedGroup(groups[0].name);
        }
      })
      .finally(() => setTopicGroupsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch topics when filters change
  useEffect(() => {
    if (!selectedGroup) return;

    setTopicsLoading(true);
    getVocabTopicsWithProgress(userId || undefined, {
      page: currentPage,
      limit: TOPICS_PER_PAGE,
      category: selectedGroup,
      subcategory: selectedSubcategory,
      levels: selectedLevels.length > 0 ? selectedLevels : undefined,
    })
      .then((result) => {
        setTopics(result.topics);
        setTotalPages(result.totalPages);
        setTotalTopics(result.total);
      })
      .finally(() => setTopicsLoading(false));
  }, [userId, selectedGroup, selectedSubcategory, selectedLevels, currentPage]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vocab-bookmarks");
    if (saved) {
      setBookmarkedTopics(JSON.parse(saved));
    }
  }, []);

  // Search handler with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchVocabTopics(searchQuery, userId || undefined)
        .then(setSearchResults)
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, userId]);

  const handleBookmarkToggle = (topicId: string) => {
    setBookmarkedTopics((prev) => {
      const newBookmarks = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem("vocab-bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const toggleLevel = (level: string) => {
    if (level === "All") {
      // Toggle all levels
      const allLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
      if (selectedLevels.length === allLevels.length) {
        setSelectedLevels([]);
      } else {
        setSelectedLevels(allLevels);
      }
    } else {
      setSelectedLevels((prev) =>
        prev.includes(level)
          ? prev.filter((l) => l !== level)
          : [...prev, level]
      );
    }
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  };

  const handleGroupChange = (name: string) => {
    setSelectedGroup(name);
    setSelectedSubcategory("All");
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcat: string) => {
    setSelectedSubcategory(subcat);
    setCurrentPage(1);
  };

  // Get current subcategories for selected group
  const currentSubcategories =
    topicGroups.find((g) => g.name === selectedGroup)?.subcategories || [];

  const isSearchMode = searchQuery.trim().length > 0;
  const displayTopics = isSearchMode ? searchResults : topics;

  // Bookmarked topics (filter from fetched topics or search for more)
  const bookmarkedTopicsList = topics.filter((topic) =>
    bookmarkedTopics.includes(topic.id)
  );

  // Dictionary filtering
  const filteredDictionaryWords = MOCK_DICTIONARY_WORDS.filter((word) => {
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

  const dictTotalPages = Math.ceil(
    filteredDictionaryWords.length / dictItemsPerPage
  );
  const paginatedWords = filteredDictionaryWords.slice(
    (dictPage - 1) * dictItemsPerPage,
    dictPage * dictItemsPerPage
  );

  const toggleDictLevel = (level: string) => {
    setSelectedDictLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const tabs = [
    { id: "topics", label: "Available Topics" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "mindmap", label: "Mindmap" },
    { id: "dictionary", label: "Dictionary" },
  ];

  // Skeleton for topic cards
  const TopicCardSkeleton = () => (
    <Card className="p-4 rounded-2xl border-2 border-gray-100">
      <Skeleton className="h-32 w-full rounded-xl mb-4 bg-gray-200" />
      <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-1/2 mb-4 bg-gray-200" />
      <Skeleton className="h-9 w-full rounded-full bg-gray-200" />
    </Card>
  );

  return (
    <ProtectedRoute
      pageName="Vocabulary Hub"
      pageDescription="Expand your vocabulary with structured topics and interactive flashcards."
      pageIcon={PageIcons.vocabulary}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HubHero
          title="VOCABULARY HUB"
          description="Expand your vocabulary with structured topics and interactive flashcards."
          imageSrc="/hero-vocabulary.jpg"
          primaryAction={{ label: "View Study Plan" }}
          secondaryAction={{ label: "Browse Topics" }}
          notification={{
            text: "Recommended: Daily Routine",
            actionLabel: "Start",
          }}
          decorativeWords={["lexicon", "fluency", "expression"]}
        />

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-gray-200 pb-0">
          {!isSearchMode && (
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
          )}
          <div className="flex-1" />
          <div className="relative mb-4 sm:mb-0 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-primary-400" />
            <Input
              placeholder="Search all topics..."
              className={`pl-10 pr-10 h-9 text-sm rounded-full border-2 transition-all ${
                isSearchMode
                  ? "w-80 border-primary-400 shadow-lg bg-white"
                  : "w-64 border-primary-200 hover:border-primary-300"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearchMode && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-primary-500" />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="mt-6">
          {activeTab === "topics" && (
            <>
              {/* Search Mode */}
              {isSearchMode ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {isSearching
                        ? "Searching..."
                        : `Search Results for "${searchQuery}" (${searchResults.length} found)`}
                    </h2>
                  </div>

                  {isSearching ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <TopicCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {searchResults.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          id={topic.id}
                          title={topic.title}
                          description={topic.description}
                          level={topic.level}
                          wordCount={topic.wordCount}
                          progress={topic.progress}
                          href={`/vocab/${topic.id}`}
                          onNotYet={() => {}}
                          type="vocabulary"
                          isBookmarked={bookmarkedTopics.includes(topic.id)}
                          onBookmarkToggle={handleBookmarkToggle}
                          thumbnail={topic.thumbnail}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                      <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        No Results Found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search terms or browse topics by
                        category.
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setSearchQuery("")}
                        className="cursor-pointer"
                      >
                        Clear Search
                      </Button>
                    </Card>
                  )}
                </div>
              ) : (
                /* Normal Mode */
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <TopicGroupsSidebar
                      groups={topicGroups}
                      selectedGroup={selectedGroup}
                      onGroupChange={handleGroupChange}
                      showViewMore={false}
                      isLoading={topicGroupsLoading}
                    />
                    <LevelsSidebar
                      selectedLevels={selectedLevels}
                      onLevelToggle={toggleLevel}
                    />
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <SubcategoryPills
                      subcategories={currentSubcategories}
                      selectedSubcategory={selectedSubcategory}
                      onSubcategoryChange={handleSubcategoryChange}
                      isLoading={topicGroupsLoading}
                    />

                    {topicsLoading ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <TopicCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : displayTopics.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {displayTopics.map((topic) => (
                            <TopicCard
                              key={topic.id}
                              id={topic.id}
                              title={topic.title}
                              description={topic.description}
                              level={topic.level}
                              wordCount={topic.wordCount}
                              progress={topic.progress}
                              href={`/vocab/${topic.id}`}
                              onNotYet={() => {}}
                              type="vocabulary"
                              isBookmarked={bookmarkedTopics.includes(topic.id)}
                              onBookmarkToggle={handleBookmarkToggle}
                              thumbnail={topic.thumbnail}
                            />
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 cursor-pointer"
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => {
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
                                  variant={
                                    currentPage === page ? "default" : "outline"
                                  }
                                  size="sm"
                                  className="h-9 w-9 p-0 cursor-pointer"
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </Button>
                              );
                            })}

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 cursor-pointer"
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>

                            <span className="ml-4 text-sm text-muted-foreground">
                              {totalTopics} topics
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                        <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          No Topics Found
                        </h3>
                        <p className="text-muted-foreground">
                          No vocabulary topics match your current filters. Try
                          selecting different levels or categories.
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              {bookmarkedTopicsList.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Bookmark className="h-6 w-6 text-primary-500 fill-primary-500" />
                    <h2 className="text-xl font-bold text-foreground">
                      Your Bookmarked Topics ({bookmarkedTopicsList.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {bookmarkedTopicsList.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.wordCount}
                        progress={topic.progress}
                        href={`/vocab/${topic.id}`}
                        onNotYet={() => {}}
                        type="vocabulary"
                        isBookmarked={true}
                        onBookmarkToggle={handleBookmarkToggle}
                        thumbnail={topic.thumbnail}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center bg-white">
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
                    onClick={() => setActiveTab("topics")}
                    className="cursor-pointer"
                  >
                    Browse Topics
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === "mindmap" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Network className="h-6 w-6 text-primary-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Vocabulary Mindmap
                </h2>
                <span className="text-sm text-muted-foreground">
                  Explore words organized by topic groups
                </span>
              </div>
              <VocabMindmap topicGroups={MOCK_MINDMAP_DATA} />
            </div>
          )}

          {activeTab === "dictionary" && (
            <Card className="p-8 rounded-3xl border-2 border-primary-100 bg-white">
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

              <div className="mb-6 mt-4">
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

              {dictTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() => setDictPage((p) => Math.max(1, p - 1))}
                    disabled={dictPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: dictTotalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={dictPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer"
                        onClick={() => setDictPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() =>
                      setDictPage((p) => Math.min(dictTotalPages, p + 1))
                    }
                    disabled={dictPage === dictTotalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
