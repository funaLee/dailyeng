"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import {
  HubHero,
  HubTabs,
  TopicGroupsSidebar,
  LevelsSidebar,
  CourseDetail,
  TopicCard,
  SubcategoryPills,
  type TopicGroup,
} from "@/components/hub"

const GRAMMAR_GROUPS: TopicGroup[] = [
  {
    name: "Tenses",
    subcategories: ["Present Simple", "Past Simple", "Future Simple", "Present Perfect", "Past Perfect"],
  },
  {
    name: "Sentence Structure",
    subcategories: ["Basic Sentences", "Compound Sentences", "Complex Sentences", "Word Order"],
  },
  {
    name: "Modals",
    subcategories: ["Can/Could", "May/Might", "Must/Have to", "Should/Ought to", "Will/Would"],
  },
  {
    name: "Conditionals",
    subcategories: ["Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"],
  },
  {
    name: "Passive Voice",
    subcategories: ["Present Passive", "Past Passive", "Future Passive", "Modal Passive"],
  },
  {
    name: "Reported Speech",
    subcategories: ["Statements", "Questions", "Commands", "Time Changes"],
  },
  {
    name: "Articles",
    subcategories: ["A/An", "The", "Zero Article", "Article Rules"],
  },
  {
    name: "Prepositions",
    subcategories: ["Time Prepositions", "Place Prepositions", "Movement", "Common Phrases"],
  },
]

const mockGrammarTopics = [
  {
    id: "g1",
    title: "Present Simple",
    description: "Learn how to use present simple tense for habits, facts, and routines",
    level: "A1",
    lessonCount: 8,
    estimatedTime: 30,
    progress: 40,
  },
  {
    id: "g2",
    title: "Past Simple",
    description: "Master past simple for completed actions in the past",
    level: "A2",
    lessonCount: 10,
    estimatedTime: 40,
    progress: 0,
  },
  {
    id: "g3",
    title: "Modal Verbs",
    description: "Understand how to use can, could, may, might, must, should, and will",
    level: "B1",
    lessonCount: 12,
    estimatedTime: 50,
    progress: 0,
  },
  {
    id: "g4",
    title: "Future Tenses",
    description: "Learn different ways to express future actions and plans",
    level: "A2",
    lessonCount: 8,
    estimatedTime: 35,
    progress: 100,
  },
  {
    id: "g5",
    title: "Present Perfect",
    description: "Connect past events to the present using present perfect tense",
    level: "B1",
    lessonCount: 10,
    estimatedTime: 45,
    progress: 25,
  },
  {
    id: "g6",
    title: "Conditionals",
    description: "Master if-clauses and conditional sentences in English",
    level: "B2",
    lessonCount: 14,
    estimatedTime: 60,
    progress: 0,
  },
]

const CURRENT_GRAMMAR_TOPIC = {
  id: "g1",
  title: "Present Simple",
  subtitle: "Lesson 3 of 8",
}

type TabType = "topics" | "bookmarks"

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [selectedGroup, setSelectedGroup] = useState<string>("Tenses")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Present Simple")
  const [activeTab, setActiveTab] = useState<TabType>("topics")

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const currentSubcategories = GRAMMAR_GROUPS.find((g) => g.name === selectedGroup)?.subcategories || []

  const filteredTopics = mockGrammarTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(topic.level)
    return matchesSearch && matchesLevel
  })

  const tabs = [
    { id: "topics", label: "All Topics" },
    { id: "bookmarks", label: "Bookmarks" },
  ]

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
          notification={{ text: "Today's lessons: 5 lessons", actionLabel: "Review now" }}
          decorativeWords={["grammar", "structure", "syntax"]}
        />
        
        <HubTabs tabs={tabs} activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as TabType)} />
        

        {activeTab === "topics" && (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <TopicGroupsSidebar
                groups={GRAMMAR_GROUPS}
                selectedGroup={selectedGroup}
                onGroupChange={(name, firstSub) => {
                  setSelectedGroup(name)
                  setSelectedSubcategory(firstSub)
                }}
              />

              <LevelsSidebar selectedLevels={selectedLevels} onLevelToggle={toggleLevel} />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <CourseDetail
                title={`${selectedGroup} - Grammar`}
                description={`Master ${selectedGroup.toLowerCase()} in English with comprehensive lessons and practice exercises.`}
                estimatedCompletion="15/01/2026"
                progress={25}
                currentTopic={{
                  id: CURRENT_GRAMMAR_TOPIC.id,
                  title: CURRENT_GRAMMAR_TOPIC.title,
                  subtitle: CURRENT_GRAMMAR_TOPIC.subtitle,
                  href: `/grammar/${CURRENT_GRAMMAR_TOPIC.id}`,
                }}
              />

              <SubcategoryPills
                subcategories={currentSubcategories}
                selectedSubcategory={selectedSubcategory}
                onSubcategoryChange={setSelectedSubcategory}
              />

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
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No bookmarked topics yet. Start learning and bookmark your favorite topics!</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
