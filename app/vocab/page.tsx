"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTopics } from "@/lib/mock-data"
import type { Topic } from "@/types"
import { Plus, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import { HubHero, HubTabs, CoursesSidebar, LevelsSidebar, CourseDetail, TopicCard, type Course } from "@/components/hub"

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
    description: "Essential vocabulary for TOEIC test success covering business and everyday English contexts.",
    estimatedCompletion: "20/02/2026",
    progress: 0,
  },
]

const CURRENT_TOPIC = {
  id: "animal-behaviours",
  title: "Animal Behaviours",
  subtitle: "Reading Practice 1",
  progress: 40,
}

type TabType = "courses" | "statistic"

export default function VocabPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["A1", "A2"])
  const [activeTab, setActiveTab] = useState<TabType>("courses")
  const [selectedCourse, setSelectedCourse] = useState<string>("ielts-7")

  const [dictionaryWords] = useState([
    {
      id: "1",
      word: "Parent",
      pronunciation: "/ˈpeərənt/",
      meaning: "A father or mother of a person or an animal",
      partOfSpeech: "Noun",
      level: "A1",
      category: "Family",
      masteryLevel: 33,
    },
    {
      id: "2",
      word: "Accomplish",
      pronunciation: "/əˈkʌmplɪʃ/",
      meaning: "To complete or achieve something successfully",
      partOfSpeech: "Verb",
      level: "B1",
      category: "Action",
      masteryLevel: 65,
    },
    {
      id: "3",
      word: "Collaborate",
      pronunciation: "/kəˈlæbəreɪt/",
      meaning: "To work together with others on a project or task",
      partOfSpeech: "Verb",
      level: "B2",
      category: "Workplace",
      masteryLevel: 80,
    },
  ])

  useEffect(() => {
    setTopics(mockTopics)
    setLoading(false)
  }, [])

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(topic.level)
    return matchesSearch && matchesLevel
  })

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const currentCourse = COURSES.find((c) => c.id === selectedCourse) || COURSES[0]

  const tabs = [
    { id: "courses", label: "Courses" },
    { id: "statistic", label: "Statistic" },
  ]

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
              <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
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
            notification={{ text: "You have 3 lessons to review", actionLabel: "Review now" }}
            decorativeWords={["appointment", "outcome", "curiosity"]}
          />

          <HubTabs tabs={tabs} activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as TabType)} />

          {activeTab === "courses" && (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <CoursesSidebar
                  courses={COURSES}
                  selectedCourse={selectedCourse}
                  onCourseChange={setSelectedCourse}
                  onAddCourse={() => {}}
                />

                <LevelsSidebar selectedLevels={selectedLevels} onLevelToggle={toggleLevel} />
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "statistic" && (
            <Card className="p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">My Dictionary</h3>
                <div className="flex items-center gap-3">
                  <Input placeholder="Search words..." className="w-64" />
                  <Button variant="outline" className="gap-2 cursor-pointer bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add Word
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead className="font-bold">Word</TableHead>
                      <TableHead className="font-bold">Pronunciation</TableHead>
                      <TableHead className="font-bold">Meaning</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Level</TableHead>
                      <TableHead className="font-bold">Mastery</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dictionaryWords.map((word) => (
                      <TableRow
                        key={word.id}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <TableCell className="font-semibold text-blue-600 dark:text-blue-400">{word.word}</TableCell>
                        <TableCell className="text-slate-500 font-mono text-sm">{word.pronunciation}</TableCell>
                        <TableCell className="max-w-xs truncate">{word.meaning}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {word.partOfSpeech}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                            {word.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${word.masteryLevel}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{word.masteryLevel}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      )}
    </ProtectedRoute>
  )
}
