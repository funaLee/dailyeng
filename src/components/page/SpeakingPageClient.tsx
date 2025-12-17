"use client"
import { Bookmark, Loader2, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Gift,
  MessageSquarePlus,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  X,
  BarChart3,
} from "lucide-react";
import { RadarChart } from "@/components/speaking/radar-chart";
import { LearningRecordCard } from "@/components/speaking/learning-record-card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect, useTransition, useRef } from "react";
import { useSession } from "next-auth/react";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";
import {
  HubHero,
  TopicGroupsSidebar,
  LevelsSidebar,
  SubcategoryPills,
  TopicCard,
  type TopicGroup,
} from "@/components/hub";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCustomScenario,
  createRandomScenario,
  getSpeakingScenariosWithProgress,
  searchSpeakingScenarios,
  getCustomTopics,
  getSpeakingTopicGroups,
  getSpeakingHistorySessions,
  getSpeakingHistoryStats,
} from "@/actions/speaking";
import {
  toggleSpeakingBookmark,
  getSpeakingBookmarkIds,
  getSpeakingBookmarks,
} from "@/actions/bookmark";

// Types for props
export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  image: string;
  sessionsCompleted: number;
  totalSessions: number;
  progress: number;
  isCustom?: boolean;
  subcategory?: string;
}

// Helper to map database SpeakingScenario to UI Scenario
function mapDbScenarioToScenario(dbScenario: {
  id: string;
  title: string;
  description: string;
  category: string | null;
  difficulty: string | null;
  image: string | null;
  isCustom: boolean;
  subcategory: string | null;
}): Scenario {
  return {
    id: dbScenario.id,
    title: dbScenario.title,
    description: dbScenario.description,
    category: dbScenario.category || "Daily Life",
    level: dbScenario.difficulty || "A2",
    image: dbScenario.image || "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 10,
    progress: 0,
    isCustom: dbScenario.isCustom,
    subcategory: dbScenario.subcategory || undefined,
  };
}

export interface CriteriaItem {
  title: string;
  score: number;
}

export interface HistoryGraphItem {
  session: number;
  score: number;
}

export interface HistoryTopicItem {
  id: string;
  title: string;
  description: string;
  score: number;
  date: string;
  level: string;
  image: string;
  progress: number;
  wordCount: number;
}

export interface SpeakingPageClientProps {
  initialTopicGroups?: TopicGroup[];
  demoCriteria: CriteriaItem[];
  historyGraphData: HistoryGraphItem[];
  historyTopicsData: HistoryTopicItem[];
  userId: string;
  initialBookmarkIds?: string[];
}

type TabType = "available" | "custom" | "history" | "bookmarks";

const SCENARIOS_PER_PAGE = 12;

export default function SpeakingPageClient({
  initialTopicGroups = [],
  demoCriteria,
  historyGraphData,
  historyTopicsData,
  userId,
  initialBookmarkIds = [],
}: SpeakingPageClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // Topic Groups state (client-side fetching)
  const [topicGroups, setTopicGroups] =
    useState<TopicGroup[]>(initialTopicGroups);
  const [topicGroupsLoading, setTopicGroupsLoading] = useState(
    initialTopicGroups.length === 0
  );
  // Flag to prevent re-fetching topic groups after initial load
  const topicGroupsFetched = useRef(false);

  // Available Topics pagination & loading
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioPage, setScenarioPage] = useState(1);
  const [scenarioTotalPages, setScenarioTotalPages] = useState(1);
  const [scenariosLoading, setScenariosLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("Daily Life");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [bookmarkedTopics, setBookmarkedTopics] =
    useState<string[]>(initialBookmarkIds);

  const [historyFilter, setHistoryFilter] = useState<string>("excellent");
  const [historyPage, setHistoryPage] = useState(1);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [bookmarkTotalPages, setBookmarkTotalPages] = useState(1);
  const [bookmarkedTopicsList, setBookmarkedTopicsList] = useState<Scenario[]>(
    []
  );
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const itemsPerPage = 4;
  const bookmarksPerPage = 8;

  // Custom Topic Logic
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Search results state
  const [searchResults, setSearchResults] = useState<Scenario[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Generating scenario loading state (for sparkle overlay)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState("");

  // Custom scenarios state
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
  const [customScenariosLoading, setCustomScenariosLoading] = useState(false);

  // History tab state (lazy loaded)
  interface HistorySession {
    id: string;
    scenarioId: string;
    scenarioTitle: string;
    overallScore: number;
    grammarScore: number;
    relevanceScore: number;
    fluencyScore: number;
    pronunciationScore: number;
    intonationScore: number;
    feedbackRating: string;
    createdAt: Date;
  }
  interface HistoryStats {
    performanceData: { session: number; score: number }[];
    criteriaAverages: {
      relevance: number;
      pronunciation: number;
      intonation: number;
      fluency: number;
      grammar: number;
    };
    totalSessions: number;
    highestScore: number;
    averageScore: number;
  }
  const [historySessions, setHistorySessions] = useState<HistorySession[]>([]);
  const [historyStats, setHistoryStats] = useState<HistoryStats | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyStatsLoading, setHistoryStatsLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyRatingFilter, setHistoryRatingFilter] = useState<string | null>(
    null
  );
  const historyFetched = useRef(false);

  // Fetch topic groups client-side (for skeleton loading experience)
  useEffect(() => {
    // Prevent re-fetching after initial load
    if (topicGroupsFetched.current) return;

    // If we have initial data, mark as fetched and skip
    if (initialTopicGroups.length > 0) {
      topicGroupsFetched.current = true;
      setTopicGroupsLoading(false);
      return;
    }

    // Mark as fetching to prevent duplicate calls
    topicGroupsFetched.current = true;

    getSpeakingTopicGroups()
      .then((groups) => {
        setTopicGroups(groups);
        // Set selected group to first group if available and current selection doesn't exist
        if (
          groups.length > 0 &&
          !groups.find((g) => g.name === selectedGroup)
        ) {
          setSelectedGroup(groups[0].name);
        }
      })
      .finally(() => setTopicGroupsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Fetch scenarios for Available Topics tab with pagination
  useEffect(() => {
    if (!session?.user?.id) return;
    if (activeTab !== "available" || searchQuery.trim().length > 0) return;

    setScenariosLoading(true);
    getSpeakingScenariosWithProgress(session.user.id, {
      page: scenarioPage,
      limit: SCENARIOS_PER_PAGE,
      category: selectedGroup,
      subcategory: selectedSubcategory,
      levels: selectedLevels.length > 0 ? selectedLevels : undefined,
    })
      .then((result) => {
        setScenarios(result.scenarios as Scenario[]);
        setScenarioTotalPages(result.totalPages);
      })
      .finally(() => setScenariosLoading(false));
  }, [
    session?.user?.id,
    activeTab,
    scenarioPage,
    selectedGroup,
    selectedSubcategory,
    selectedLevels,
    searchQuery,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setScenarioPage(1);
  }, [selectedGroup, selectedSubcategory, selectedLevels]);

  // Fetch bookmark IDs on mount
  useEffect(() => {
    if (session?.user?.id) {
      getSpeakingBookmarkIds(session.user.id).then(setBookmarkedTopics);
    }
  }, [session?.user?.id]);

  // Fetch bookmarked topics for Bookmarks tab
  useEffect(() => {
    if (session?.user?.id && activeTab === "bookmarks") {
      setBookmarkLoading(true);
      getSpeakingBookmarks(session.user.id, bookmarkPage, bookmarksPerPage)
        .then((result) => {
          setBookmarkedTopicsList(
            result.bookmarks.map(mapDbScenarioToScenario)
          );
          setBookmarkTotalPages(result.totalPages);
        })
        .finally(() => setBookmarkLoading(false));
    }
  }, [session?.user?.id, activeTab, bookmarkPage]);

  // Fetch search results when search query changes (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setSearchLoading(true);
      searchSpeakingScenarios(searchQuery, session?.user?.id)
        .then((results) => setSearchResults(results as Scenario[]))
        .finally(() => setSearchLoading(false));
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, session?.user?.id]);

  // Fetch custom topics
  useEffect(() => {
    if (!session?.user?.id) return;
    if (activeTab !== "custom") return;

    setCustomScenariosLoading(true);
    getCustomTopics(session.user.id)
      .then((customTopics) => {
        setCustomScenarios(
          customTopics.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.category || "Custom",
            level: s.difficulty || "B1",
            image: s.image || "/learning.png",
            sessionsCompleted: 0,
            totalSessions: 10,
            progress: 0,
            isCustom: true,
          }))
        );
      })
      .finally(() => setCustomScenariosLoading(false));
  }, [session?.user?.id, activeTab]);

  // Lazy load history stats when History tab is first opened
  useEffect(() => {
    if (!session?.user?.id) return;
    if (activeTab !== "history") return;
    if (historyFetched.current) return;

    historyFetched.current = true;
    setHistoryStatsLoading(true);
    getSpeakingHistoryStats(session.user.id)
      .then((stats) => setHistoryStats(stats))
      .finally(() => setHistoryStatsLoading(false));
  }, [session?.user?.id, activeTab]);

  // Fetch history sessions when filter or page changes
  useEffect(() => {
    if (!session?.user?.id) return;
    if (activeTab !== "history") return;

    setHistoryLoading(true);
    getSpeakingHistorySessions(session.user.id, {
      page: historyPage,
      limit: 10,
      rating: historyRatingFilter || undefined,
    })
      .then((result) => {
        setHistorySessions(
          result.sessions.map((s) => ({
            ...s,
            createdAt: new Date(s.createdAt),
          }))
        );
        setHistoryTotalPages(result.totalPages);
      })
      .finally(() => setHistoryLoading(false));
  }, [session?.user?.id, activeTab, historyPage, historyRatingFilter]);

  // Check if we're in search mode
  const isSearchMode = searchQuery.trim().length > 0;

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const currentSubcategories =
    topicGroups.find((g) => g.name === selectedGroup)?.subcategories || [];

  const tabs = [
    { id: "available", label: "Available Topics" },
    { id: "custom", label: "Custom Topics" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "history", label: "History" },
  ];

  const handleBookmarkToggle = (topicId: string) => {
    if (!session?.user?.id) return;

    // Optimistic update
    setBookmarkedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );

    startTransition(async () => {
      await toggleSpeakingBookmark(session.user.id, topicId);
      // Refresh bookmarked topics list if on bookmarks tab
      if (activeTab === "bookmarks") {
        const result = await getSpeakingBookmarks(
          session.user.id,
          bookmarkPage,
          bookmarksPerPage
        );
        setBookmarkedTopicsList(result.bookmarks.map(mapDbScenarioToScenario));
        setBookmarkTotalPages(result.totalPages);
      }
    });
  };

  const handleCreateScenario = async () => {
    if (!topicPrompt.trim()) return;

    setIsDialogOpen(false);
    setIsGenerating(true);
    setGeneratingMessage("Creating your custom scenario...");

    try {
      const result = await createCustomScenario(userId, topicPrompt);
      setTopicPrompt("");
      // Redirect to the new session (use sessionId from result)
      router.push(
        `/speaking/session/${result.scenario.id}?session=${result.sessionId}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to create scenario");
      setIsGenerating(false);
    }
  };

  const handleSurpriseMe = async () => {
    setIsGenerating(true);
    setGeneratingMessage("Generating a surprise scenario...");

    try {
      const result = await createRandomScenario(userId);
      // Redirect to the new session
      router.push(
        `/speaking/session/${result.scenario.id}?session=${result.sessionId}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate random scenario");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sparkle Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white shadow-xl border border-primary-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              {/* Floating sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
              <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-yellow-500 animate-bounce delay-100" />
              <Sparkles className="absolute top-1/2 -right-4 w-4 h-4 text-primary-400 animate-bounce delay-200" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {generatingMessage || "Generating scenario..."}
              </h3>
              <p className="text-muted-foreground text-sm">
                AI is crafting the perfect scenario for you
              </p>
            </div>
            <div className="flex gap-1.5">
              <div
                className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-primary-600 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}

      <ProtectedRoute
        pageName="Speaking Room"
        pageDescription="Practice your speaking skills with AI-powered conversations and get instant feedback."
        pageIcon={PageIcons.speaking}
      >
        <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <HubHero
            title="SPEAKING ROOM"
            description="Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency, grammar, and content."
            imageSrc="/hero-speaking.jpg"
            primaryAction={{ label: "Build Study Plan" }}
            secondaryAction={{
              label: "Random Topic",
              onClick: handleSurpriseMe,
            }}
            notification={{
              text: "Practice streak: 7 days",
              actionLabel: "Continue",
            }}
            decorativeWords={["speaking", "fluency", "practice"]}
          />

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

          <div>
            {/* Search Results Mode */}
            {isSearchMode && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Search Results for "{searchQuery}" ({searchResults.length}{" "}
                    found)
                  </h2>
                </div>
                {searchLoading ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                      >
                        <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-full mb-4" />
                        <div className="h-6 w-12 bg-gray-200 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {searchResults.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={7}
                        thumbnail={topic.image}
                        progress={topic.progress}
                        href={`/speaking/session/${topic.id}`}
                        onNotYet={() => {}}
                        type="speaking"
                        isBookmarked={bookmarkedTopics.includes(topic.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 rounded-3xl border-2 border-primary-100 text-center bg-white">
                    <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      No Topics Found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try searching with different keywords or check your
                      spelling.
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
            )}

            {/* Normal Tab Content */}
            {!isSearchMode && activeTab === "available" && (
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <TopicGroupsSidebar
                    groups={topicGroups}
                    selectedGroup={selectedGroup}
                    onGroupChange={(name, firstSub) => {
                      setSelectedGroup(name);
                      setSelectedSubcategory("All");
                    }}
                    title="Topic Groups"
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
                    onSubcategoryChange={setSelectedSubcategory}
                    isLoading={topicGroupsLoading}
                  />

                  {/* Skeleton Loading */}
                  {scenariosLoading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                        >
                          <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                          <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
                          <div className="flex justify-between items-center">
                            <div className="h-6 w-12 bg-gray-200 rounded-full" />
                            <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {scenarios.map((topic) => (
                          <TopicCard
                            key={topic.id}
                            id={topic.id}
                            title={topic.title}
                            description={topic.description}
                            level={topic.level}
                            wordCount={7}
                            thumbnail={topic.image}
                            progress={topic.progress}
                            href={`/speaking/session/${topic.id}`}
                            onNotYet={() => {}}
                            type="speaking"
                            isBookmarked={bookmarkedTopics.includes(topic.id)}
                            onBookmarkToggle={handleBookmarkToggle}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {scenarioTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                            onClick={() =>
                              setScenarioPage((p) => Math.max(1, p - 1))
                            }
                            disabled={scenarioPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {Array.from(
                            { length: scenarioTotalPages },
                            (_, i) => i + 1
                          ).map((page) => {
                            const showPage =
                              page === 1 ||
                              page === scenarioTotalPages ||
                              Math.abs(page - scenarioPage) <= 1;

                            const showEllipsis =
                              (page === 2 && scenarioPage > 3) ||
                              (page === scenarioTotalPages - 1 &&
                                scenarioPage < scenarioTotalPages - 2);

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
                                  scenarioPage === page ? "default" : "outline"
                                }
                                size="sm"
                                className="h-9 w-9 p-0 cursor-pointer"
                                onClick={() => setScenarioPage(page)}
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
                              setScenarioPage((p) =>
                                Math.min(scenarioTotalPages, p + 1)
                              )
                            }
                            disabled={scenarioPage === scenarioTotalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {!isSearchMode && activeTab === "bookmarks" && (
              <div className="space-y-6">
                {bookmarkedTopicsList.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <Bookmark className="h-6 w-6 text-primary-600 fill-primary-600" />
                      <h2 className="text-xl font-bold text-foreground">
                        Your Bookmarked Topics ({bookmarkedTopicsList.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                      {bookmarkedTopicsList.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          id={topic.id}
                          title={topic.title}
                          description={topic.description}
                          level={topic.level}
                          wordCount={7}
                          thumbnail={topic.image}
                          progress={topic.progress}
                          href={`/speaking/session/${topic.id}`}
                          onNotYet={() => {}}
                          type="speaking"
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
                  <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center bg-white">
                    <div className="animate-pulse space-y-4">
                      <div className="h-16 w-16 bg-primary-100 rounded-full mx-auto" />
                      <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
                      <div className="h-4 w-64 bg-gray-100 rounded mx-auto" />
                    </div>
                  </Card>
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
                      onClick={() => setActiveTab("available")}
                      className="cursor-pointer"
                    >
                      Browse Topics
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {!isSearchMode && activeTab === "custom" && (
              <div className="space-y-6">
                <Card className="p-8 rounded-3xl border-2 border-primary-100 bg-white">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">
                      Create Custom Topic
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Design your own speaking scenario for personalized
                      practice
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card
                      onClick={() => setIsDialogOpen(true)}
                      className="p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:border-primary-400 transition-colors cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <MessageSquarePlus className="h-6 w-6 text-primary-600" />
                        </div>
                        <h4 className="font-bold mb-2">
                          Create your own scenario
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Generate a scenario from your description
                        </p>
                      </div>
                    </Card>

                    <Card
                      onClick={handleSurpriseMe}
                      className="p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:border-primary-400 transition-colors cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <Gift className="h-6 w-6 text-primary-600" />
                        </div>
                        <h4 className="font-bold mb-2">Surprise Me</h4>
                        <p className="text-sm text-muted-foreground">
                          Get a random scenario based on your level
                        </p>
                      </div>
                    </Card>
                  </div>
                </Card>

                {/* List of custom scenarios */}
                <h3 className="text-xl font-bold mt-8 mb-4">
                  Your Custom Scenarios
                </h3>
                {customScenariosLoading ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                      >
                        <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                        <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
                        <div className="flex justify-between items-center">
                          <div className="h-6 w-12 bg-gray-200 rounded-full" />
                          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
                    {customScenarios.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={7}
                        thumbnail={topic.image}
                        progress={topic.progress}
                        href={`/speaking/session/${topic.id}`}
                        onNotYet={() => {}}
                        type="speaking"
                        isBookmarked={bookmarkedTopics.includes(topic.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                    {customScenarios.length === 0 && (
                      <p className="text-muted-foreground col-span-full text-center py-8">
                        You haven't created any custom scenarios yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isSearchMode && activeTab === "history" && (
              <div className="space-y-8">
                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Performance Overview Chart */}
                  <Card className="p-6 rounded-3xl border-2 border-primary-100 bg-white">
                    <h3 className="text-lg font-bold mb-4">
                      Performance Overview
                    </h3>
                    <div className="h-64">
                      {historyStatsLoading ? (
                        <div className="animate-pulse h-full flex flex-col justify-end gap-2">
                          <div className="flex items-end gap-1 h-48">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-primary-100 rounded-t"
                                style={{
                                  height: `${30 + Math.random() * 60}%`,
                                }}
                              />
                            ))}
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-full" />
                        </div>
                      ) : historyStats &&
                        historyStats.performanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={historyStats.performanceData}>
                            <defs>
                              <linearGradient
                                id="colorScore"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e2e8f0"
                            />
                            <XAxis
                              dataKey="session"
                              stroke="#94a3b8"
                              fontSize={12}
                            />
                            <YAxis
                              stroke="#94a3b8"
                              fontSize={12}
                              domain={[0, 100]}
                            />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="score"
                              stroke="#3b82f6"
                              fillOpacity={1}
                              fill="url(#colorScore)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          No session data yet
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Criteria Score Radar Chart */}
                  <Card className="p-6 rounded-3xl border-2 border-primary-100 bg-white">
                    <h3 className="text-lg font-bold mb-4">Criteria Score</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                      {historyStatsLoading ? (
                        <div className="animate-pulse w-48 h-48 rounded-full bg-primary-100" />
                      ) : historyStats && historyStats.totalSessions > 0 ? (
                        <RadarChart
                          data={[
                            {
                              label: "Relevance",
                              value: historyStats.criteriaAverages.relevance,
                            },
                            {
                              label: "Pronunciation",
                              value:
                                historyStats.criteriaAverages.pronunciation,
                            },
                            {
                              label: "Intonation",
                              value: historyStats.criteriaAverages.intonation,
                            },
                            {
                              label: "Fluency",
                              value: historyStats.criteriaAverages.fluency,
                            },
                            {
                              label: "Grammar",
                              value: historyStats.criteriaAverages.grammar,
                            },
                          ]}
                          size={300}
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          No session data yet
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Session History Section */}
                <Card className="p-6 rounded-3xl border-2 border-primary-100 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Session History</h3>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { value: null, label: "All" },
                        { value: "Excellent", label: "Excellent" },
                        { value: "Good", label: "Good" },
                        { value: "Average", label: "Average" },
                        { value: "Needs Improvement", label: "Needs Work" },
                      ].map((filter) => (
                        <Button
                          key={filter.label}
                          variant={
                            historyRatingFilter === filter.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setHistoryRatingFilter(filter.value);
                            setHistoryPage(1);
                          }}
                          disabled={historyRatingFilter === filter.value}
                          className="cursor-pointer"
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Session List */}
                  <div className="space-y-3 mb-6">
                    {historyLoading ? (
                      // Skeleton loading
                      Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse p-4 rounded-xl border border-primary-200 bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary-100" />
                            <div className="flex-1 flex justify-evenly">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <div
                                  key={j}
                                  className="flex flex-col items-center gap-1"
                                >
                                  <div className="w-4 h-4 bg-gray-200 rounded" />
                                  <div className="w-6 h-4 bg-gray-200 rounded" />
                                </div>
                              ))}
                            </div>
                            <div className="text-right">
                              <div className="w-20 h-4 bg-gray-200 rounded mb-1" />
                              <div className="w-16 h-3 bg-gray-100 rounded" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : historySessions.length > 0 ? (
                      historySessions.map((session) => (
                        <div key={session.id} className="relative">
                          <div className="text-xs text-muted-foreground mb-1 pl-1">
                            {session.scenarioTitle}
                          </div>
                          <LearningRecordCard
                            overallScore={session.overallScore}
                            grammarScore={session.grammarScore}
                            relevanceScore={session.relevanceScore}
                            fluencyScore={session.fluencyScore}
                            pronunciationScore={session.pronunciationScore}
                            intonationScore={session.intonationScore}
                            date={session.createdAt}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 rounded-xl border border-dashed border-primary-200 bg-primary-50/50">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-primary-400" />
                        </div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          No sessions found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {historyRatingFilter
                            ? `No sessions with "${historyRatingFilter}" rating`
                            : "Complete a speaking session to see your history"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {historyTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setHistoryPage((p) => Math.max(1, p - 1))
                        }
                        disabled={historyPage === 1}
                        className="cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {historyPage} of {historyTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setHistoryPage((p) =>
                            Math.min(historyTotalPages, p + 1)
                          )
                        }
                        disabled={historyPage === historyTotalPages}
                        className="cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Topic</DialogTitle>
            <DialogDescription>
              Describe the situation or topic you want to practice. AI will
              generate a roleplay scenario for you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="E.g. I want to practice arguing about a refund at an electronics store..."
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateScenario}
              disabled={isCreating || !topicPrompt.trim()}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Generating..." : "Create Scenario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
