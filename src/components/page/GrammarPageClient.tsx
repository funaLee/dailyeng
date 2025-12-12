"use client"

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";
import { Bookmark, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  toggleGrammarBookmark,
  getGrammarBookmarkIds,
  getGrammarBookmarks,
} from "@/actions/bookmark";
import {
  HubHero,
  TopicGroupsSidebar,
  LevelsSidebar,
  TopicCard,
  SubcategoryPills,
  type TopicGroup,
} from "@/components/hub";

interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  subcategory: string;
  lessonCount: number;
  estimatedTime: number;
  progress: number;
}

// Helper to map database Topic to UI GrammarTopic
function mapDbTopicToGrammarTopic(dbTopic: {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string | null;
  subcategory: string | null;
  wordCount: number;
  estimatedTime: number;
}): GrammarTopic {
  return {
    id: dbTopic.id,
    title: dbTopic.title,
    description: dbTopic.description,
    level: dbTopic.level,
    category: dbTopic.category || "Tenses",
    subcategory: dbTopic.subcategory || "All",
    lessonCount: dbTopic.wordCount,
    estimatedTime: dbTopic.estimatedTime,
    progress: 0,
  };
}

interface CurrentGrammarTopic {
  id: string;
  title: string;
  subtitle: string;
}

interface GrammarPageClientProps {
  grammarGroups: TopicGroup[];
  grammarTopics: GrammarTopic[];
  currentGrammarTopic: CurrentGrammarTopic;
  initialBookmarkIds?: string[];
}

type TabType = "topics" | "bookmarks";

export default function GrammarPageClient({
  grammarGroups,
  grammarTopics,
  currentGrammarTopic,
  initialBookmarkIds = [],
}: GrammarPageClientProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("Tenses");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [bookmarkedTopics, setBookmarkedTopics] =
    useState<string[]>(initialBookmarkIds);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [bookmarkTotalPages, setBookmarkTotalPages] = useState(1);
  const [bookmarkedTopicsList, setBookmarkedTopicsList] = useState<
    GrammarTopic[]
  >([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const bookmarksPerPage = 8;

  // Fetch bookmark IDs on mount
  useEffect(() => {
    if (session?.user?.id) {
      getGrammarBookmarkIds(session.user.id).then(setBookmarkedTopics);
    }
  }, [session?.user?.id]);

  // Fetch bookmarked topics for Bookmarks tab
  useEffect(() => {
    if (session?.user?.id && activeTab === "bookmarks") {
      setBookmarkLoading(true);
      getGrammarBookmarks(session.user.id, bookmarkPage, bookmarksPerPage)
        .then((result) => {
          setBookmarkedTopicsList(
            result.bookmarks.map(mapDbTopicToGrammarTopic)
          );
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
      await toggleGrammarBookmark(session.user.id, topicId);
      // Refresh bookmarked topics list if on bookmarks tab
      if (activeTab === "bookmarks") {
        const result = await getGrammarBookmarks(
          session.user.id,
          bookmarkPage,
          bookmarksPerPage
        );
        setBookmarkedTopicsList(result.bookmarks.map(mapDbTopicToGrammarTopic));
        setBookmarkTotalPages(result.totalPages);
      }
    });
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  // Check if we're in search mode
  const isSearchMode = searchQuery.trim().length > 0;

  const currentSubcategories =
    grammarGroups.find((g) => g.name === selectedGroup)?.subcategories || [];

  // Filter topics based on search or normal mode (similar to Speaking Room)
  const filteredTopics = grammarTopics.filter((topic) => {
    // In search mode, search ALL topics
    if (isSearchMode) {
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }

    // Normal mode: respect filters
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(topic.level);
    const matchesGroup = topic.category === selectedGroup;
    const matchesSubcategory =
      !selectedSubcategory ||
      selectedSubcategory === "All" ||
      topic.subcategory === selectedSubcategory;

    return matchesLevel && matchesGroup && matchesSubcategory;
  });

  const tabs = [
    { id: "topics", label: "All Topics" },
    { id: "bookmarks", label: "Bookmarks" },
  ];

  return (
    <ProtectedRoute
      pageName="Grammar Hub"
      pageDescription="Master English grammar with structured lessons and practice exercises."
      pageIcon={PageIcons.grammar}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HubHero
          title="GRAMMAR HUB"
          description="Master English grammar with structured lessons."
          primaryAction={{ label: "Build Study Plan" }}
          secondaryAction={{ label: "Choose Learning Topic" }}
          notification={{
            text: "Today's lessons: 5 lessons",
            actionLabel: "Review now",
          }}
          decorativeWords={["grammar", "structure", "syntax"]}
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
          <div className="relative mb-4 sm:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
            <Input
              placeholder="Search all grammar topics..."
              className={`pl-10 pr-10 h-10 text-sm rounded-full border-2 transition-all ${
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

        {activeTab === "topics" && (
          <>
            {/* Search Mode - Show results without filters */}
            {isSearchMode ? (
              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Search Results for "{searchQuery}" ({filteredTopics.length}{" "}
                    found)
                  </h2>
                </div>

                {filteredTopics.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredTopics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.lessonCount}
                        progress={topic.progress}
                        href={`/grammar/${topic.id}`}
                        onNotYet={() => {}}
                        type="grammar"
                        isBookmarked={bookmarkedTopics.includes(topic.id)}
                        onBookmarkToggle={handleBookmarkToggle}
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
              /* Normal Mode - Show filters and topics */
              <div className="grid lg:grid-cols-5 gap-8 mt-6">
                <div className="lg:col-span-1 space-y-6">
                  <TopicGroupsSidebar
                    groups={grammarGroups}
                    selectedGroup={selectedGroup}
                    onGroupChange={(name, firstSub) => {
                      setSelectedGroup(name);
                      setSelectedSubcategory("All");
                    }}
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
                  />

                  {filteredTopics.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredTopics.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          id={topic.id}
                          title={topic.title}
                          description={topic.description}
                          level={topic.level}
                          wordCount={topic.lessonCount}
                          progress={topic.progress}
                          href={`/grammar/${topic.id}`}
                          onNotYet={() => {}}
                          type="grammar"
                          isBookmarked={bookmarkedTopics.includes(topic.id)}
                          onBookmarkToggle={handleBookmarkToggle}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                      <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        No Topics Found
                      </h3>
                      <p className="text-muted-foreground">
                        No grammar topics match your current filters. Try
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
          <div className="space-y-6 mt-6">
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
                      wordCount={topic.lessonCount}
                      progress={topic.progress}
                      href={`/grammar/${topic.id}`}
                      onNotYet={() => {}}
                      type="grammar"
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
                      onClick={() => setBookmarkPage((p) => Math.max(1, p - 1))}
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
                  Click the bookmark icon on any topic card to save it here for
                  quick access.
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
      </div>
    </ProtectedRoute>
  );
}
