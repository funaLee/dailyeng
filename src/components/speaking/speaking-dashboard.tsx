"use client";

import Image from "next/image";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Gift,
  MessageSquarePlus,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react";
import { RadarChart } from "@/components/speaking/radar-chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect, useRef } from "react";
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
  DEMO_TOPICS,
  HISTORY_GRAPH_DATA,
  HISTORY_TOPICS_DATA,
} from "@/lib/mock-data";

const TOPIC_GROUPS: TopicGroup[] = [
  {
    name: "Daily Life",
    subcategories: ["Shopping", "Dining", "Healthcare", "Transportation"],
  },
  {
    name: "Professional English",
    subcategories: ["Meetings", "Presentations", "Negotiations", "Interviews"],
  },
  {
    name: "Academic",
    subcategories: ["Lectures", "Discussions", "Research", "Presentations"],
  },
  {
    name: "Business",
    subcategories: ["Marketing", "Sales", "Finance", "Management"],
  },
  {
    name: "Travel",
    subcategories: ["Hotels", "Airports", "Tourist Sites", "Emergency"],
  },
  {
    name: "Social Situations",
    subcategories: ["Parties", "Small Talk", "Making Friends", "Dating"],
  },
];

type TabType = "available" | "custom" | "history" | "bookmarks";

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
  duration?: number;
}

interface SpeakingDashboardProps {
  initialScenarios: Scenario[];
}

export function SpeakingDashboard({
  initialScenarios,
}: SpeakingDashboardProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"]);
  const [selectedGroup, setSelectedGroup] = useState<string>("Daily Life");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string>("Shopping");
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);

  const [historyFilter, setHistoryFilter] = useState<string>("excellent");
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const saved = localStorage.getItem("speaking-bookmarks");
    if (saved) {
      setBookmarkedTopics(JSON.parse(saved));
    }
  }, []);

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(scenario.level);
    return matchesSearch && matchesLevel;
  });

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const currentSubcategories =
    TOPIC_GROUPS.find((g) => g.name === selectedGroup)?.subcategories || [];

  const getFilteredHistory = () => {
    switch (historyFilter) {
      case "excellent":
        return HISTORY_TOPICS_DATA.filter((t) => t.score >= 90);
      case "good":
        return HISTORY_TOPICS_DATA.filter((t) => t.score >= 80 && t.score < 90);
      case "average":
        return HISTORY_TOPICS_DATA.filter((t) => t.score >= 60 && t.score < 80);
      case "improvement":
        return HISTORY_TOPICS_DATA.filter((t) => t.score < 60);
      default:
        return HISTORY_TOPICS_DATA;
    }
  };

  const filteredHistory = getFilteredHistory();
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentHistoryItems = filteredHistory.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  const bookmarkedTopicsList = scenarios.filter((topic) =>
    bookmarkedTopics.includes(topic.id)
  );

  const tabs = [
    { id: "available", label: "Available Topics" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "custom", label: "Custom Topics" },
    { id: "history", label: "History" },
  ];

  const handleBookmarkToggle = (topicId: string) => {
    setBookmarkedTopics((prev) => {
      const newBookmarks = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem("speaking-bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  return (
    <ProtectedRoute
      pageName="Speaking Room"
      pageDescription="Practice your speaking skills with AI-powered conversations and get instant feedback."
      pageIcon={PageIcons.speaking}
    >
      <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <HubHero
          title="SPEAKING ROOM"
          description="Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency, grammar, and content."
          primaryAction={{ label: "Build Study Plan" }}
          secondaryAction={{ label: "Random Topic" }}
          notification={{
            text: "Practice streak: 7 days",
            actionLabel: "Continue",
          }}
          decorativeWords={["speaking", "fluency", "practice"]}
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
          <div className="flex-1 hidden sm:block" />
          <Input
            placeholder="Search"
            className="max-w-xs mb-4 sm:mb-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          {activeTab === "available" && (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <TopicGroupsSidebar
                  groups={TOPIC_GROUPS}
                  selectedGroup={selectedGroup}
                  onGroupChange={(name, firstSub) => {
                    setSelectedGroup(name);
                    setSelectedSubcategory(firstSub);
                  }}
                  title="Topic Groups"
                  showViewMore={false}
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredScenarios.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      id={topic.id}
                      title={topic.title}
                      description={topic.description}
                      level={topic.level}
                      wordCount={topic.duration || 7}
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
              </div>
            </div>
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
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                    {bookmarkedTopicsList.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.duration || 7}
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
                </>
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
                    onClick={() => setActiveTab("available")}
                    className="cursor-pointer"
                  >
                    Browse Topics
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === "custom" && (
            <Card className="p-8 rounded-3xl border-2 border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Create Custom Topic
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Design your own speaking scenario for personalized practice
                  </p>
                </div>
                <Button className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  New Topic
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <MessageSquarePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold mb-2">Role Play</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a custom role-play scenario
                    </p>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold mb-2">Topic Discussion</h4>
                    <p className="text-sm text-muted-foreground">
                      Discuss any topic of your choice
                    </p>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold mb-2">Free Practice</h4>
                    <p className="text-sm text-muted-foreground">
                      Open conversation with AI tutor
                    </p>
                  </div>
                </Card>
              </div>
            </Card>
          )}

          {activeTab === "history" && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/50">
                  <h3 className="text-lg font-bold mb-4">
                    Performance Overview
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={HISTORY_GRAPH_DATA}>
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                  </div>
                </Card>

                <Card className="p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/50">
                  <h3 className="text-lg font-bold mb-4">Topic Performance</h3>
                  <div className="h-64">
                    <RadarChart
                      data={DEMO_TOPICS.map((t) => ({
                        label: t.title,
                        value: t.score,
                      }))}
                    />
                  </div>
                </Card>
              </div>

              <Card className="p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Session History</h3>
                  <div className="flex gap-2">
                    {["excellent", "good", "average", "improvement"].map(
                      (filter) => (
                        <Button
                          key={filter}
                          variant={
                            historyFilter === filter ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setHistoryFilter(filter);
                            setHistoryPage(1);
                          }}
                          className="capitalize cursor-pointer"
                        >
                          {filter === "improvement" ? "Needs Work" : filter}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {currentHistoryItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            className={`${
                              item.score >= 90
                                ? "bg-green-500"
                                : item.score >= 80
                                ? "bg-blue-500"
                                : item.score >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            } text-white`}
                          >
                            {item.score}%
                          </Badge>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm mb-1 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.date}
                      </p>
                      <div className="flex gap-1">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {historyPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setHistoryPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={historyPage === totalPages}
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
  );
}
