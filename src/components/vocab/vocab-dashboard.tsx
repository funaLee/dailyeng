"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockVocab } from "@/lib/mock-data";
import type { Topic } from "@/types";
import { Bookmark, Network } from "lucide-react";
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

const COURSES: Course[] = [
  {
    id: "ielts-7",
    name: "IELTS 7.0",
    description:
      "Comprehensive IELTS vocabulary preparation for band 7.0 and above. Focus on academic and general training modules.",
    estimatedCompletion: "12/12/2025",
    progress: 12,
  },
  {
    id: "business",
    name: "Business English",
    description:
      "Professional vocabulary for workplace communication, meetings, presentations, and business correspondence.",
    estimatedCompletion: "15/01/2026",
    progress: 0,
  },
  {
    id: "toeic",
    name: "TOEIC Preparation",
    description:
      "Essential vocabulary for TOEIC test success covering business and everyday English contexts.",
    estimatedCompletion: "20/02/2026",
    progress: 0,
  },
];

const CURRENT_TOPIC = {
  id: "animal-behaviours",
  title: "Animal Behaviours",
  subtitle: "Reading Practice 1",
  progress: 40,
};

type TabType = "courses" | "bookmarks" | "mindmap";

interface VocabDashboardProps {
  initialTopics: Topic[];
}

export function VocabDashboard({ initialTopics }: VocabDashboardProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"]);
  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [selectedCourse, setSelectedCourse] = useState<string>("ielts-7");
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vocab-bookmarks");
    if (saved) {
      setBookmarkedTopics(JSON.parse(saved));
    }
  }, []);

  const handleBookmarkToggle = (topicId: string) => {
    setBookmarkedTopics((prev) => {
      const newBookmarks = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem("vocab-bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
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

  const bookmarkedTopicsList = topics.filter((topic) =>
    bookmarkedTopics.includes(topic.id)
  );

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const currentCourse =
    COURSES.find((c) => c.id === selectedCourse) || COURSES[0];

  const tabs = [
    { id: "courses", label: "Courses" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "mindmap", label: "Mindmap" },
  ];

  const mindmapData = [
    {
      id: "daily-life",
      name: "Daily Life",
      color: "primary" as const,
      topics: [
        {
          id: "1",
          title: "Travel",
          words: mockVocab["1"] || [],
        },
        {
          id: "2",
          title: "Food & Dining",
          words: mockVocab["2"] || [],
        },
      ],
    },
    {
      id: "professional",
      name: "Professional",
      color: "secondary" as const,
      topics: [
        {
          id: "3",
          title: "Job Interview",
          words: mockVocab["3"] || [],
        },
      ],
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

  return (
    <ProtectedRoute
      pageName="Vocabulary Hub"
      pageDescription="Build your vocabulary with interactive lessons and spaced repetition."
      pageIcon={PageIcons.vocabulary}
    >
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

        <HubTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
        />

        {activeTab === "courses" && (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <CoursesSidebar
                courses={COURSES}
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
              <CourseDetail
                title={`${currentCourse.name} Academic`}
                description={currentCourse.description}
                estimatedCompletion={currentCourse.estimatedCompletion}
                progress={currentCourse.progress}
                currentTopic={{
                  id: CURRENT_TOPIC.id,
                  title: CURRENT_TOPIC.title,
                  subtitle: CURRENT_TOPIC.subtitle,
                  href: `/vocab/${CURRENT_TOPIC.id}`,
                }}
              />

              <div className="flex justify-end">
                <Input
                  placeholder="Search vocabulary topics..."
                  className="max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
          <div className="space-y-6">
            {bookmarkedTopicsList.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Bookmark className="h-6 w-6 text-primary-500 fill-primary-500" />
                  <h2 className="text-xl font-bold text-foreground">
                    Your Bookmarked Topics ({bookmarkedTopicsList.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <VocabMindmap topicGroups={mindmapData} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
