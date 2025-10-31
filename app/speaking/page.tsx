"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, ArrowRight, Sparkles, MessageCircle, Globe, Briefcase, Coffee, Plane, ShoppingBag, BookOpen, Users, TrendingUp } from "lucide-react"

// Mock data
const mockTopics = [
  { id: "daily", title: "Daily Life", icon: Coffee, color: "bg-linear-to-r from-amber-500 to-orange-500" },
  { id: "work", title: "Work & Business", icon: Briefcase, color: "bg-linear-to-r from-blue-500 to-indigo-500" },
  { id: "travel", title: "Travel", icon: Plane, color: "bg-linear-to-r from-emerald-500 to-teal-500" },
  { id: "social", title: "Social", icon: Users, color: "bg-linear-to-r from-pink-500 to-rose-500" },
]

const mockSpeakingScenarios = {
  daily: [
    {
      id: "cafe-order",
      title: "Ordering at a Café",
      description: "Practice ordering coffee and food at a local café",
      goal: "Learn to order confidently and handle common café interactions",
      difficulty: "A2",
      icon: Coffee,
    },
    {
      id: "shopping",
      title: "Shopping for Clothes",
      description: "Navigate a clothing store and ask for sizes and colors",
      goal: "Master retail vocabulary and polite requests",
      difficulty: "B1",
      icon: ShoppingBag,
    },
  ],
  work: [
    {
      id: "meeting",
      title: "Team Meeting",
      description: "Participate in a professional team discussion",
      goal: "Practice business vocabulary and professional communication",
      difficulty: "B2",
      icon: Users,
    },
    {
      id: "presentation",
      title: "Product Presentation",
      description: "Present a new product to potential clients",
      goal: "Develop presentation skills and persuasive language",
      difficulty: "C1",
      icon: TrendingUp,
    },
  ],
  travel: [
    {
      id: "hotel",
      title: "Hotel Check-in",
      description: "Check into a hotel and ask about amenities",
      goal: "Learn travel-related vocabulary and polite inquiries",
      difficulty: "A2",
      icon: Plane,
    },
  ],
  social: [
    {
      id: "small-talk",
      title: "Making Small Talk",
      description: "Have casual conversations with new acquaintances",
      goal: "Build confidence in informal social situations",
      difficulty: "B1",
      icon: MessageCircle,
    },
  ],
}

export default function SpeakingPage() {
  const [customScenarios, setCustomScenarios] = useState<Array<{
    id: string
    topicId: string
    title: string
    description: string
    goal: string
    context: string
    difficulty: string
    isCustom: boolean
    icon: any
  }>>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    topic: "",
    goal: "",
    context: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleCreateScenario = () => {
    if (!formData.topic || !formData.goal || !formData.context) return
    
    setIsCreating(true)

    setTimeout(() => {
      const newScenario = {
        id: `custom-${Date.now()}`,
        topicId: "custom",
        title: formData.topic,
        description: `Custom scenario: ${formData.topic}`,
        goal: formData.goal,
        context: formData.context,
        difficulty: "B1",
        isCustom: true,
        icon: Sparkles,
      }
      setCustomScenarios((prev) => [newScenario, ...prev])
      setFormData({ topic: "", goal: "", context: "" })
      setIsCreating(false)
    }, 1000)
  }

  const getDifficultyColor = (difficulty: 'A2' | 'B1' | 'B2' | 'C1') => {
    const colors = {
      A2: "bg-green-100 text-green-700 border-green-200",
      B1: "bg-blue-100 text-blue-700 border-blue-200",
      B2: "bg-purple-100 text-purple-700 border-purple-200",
      C1: "bg-red-100 text-red-700 border-red-200",
    } as const
    return colors[difficulty] || colors.B1
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-linear-to-r from-purple-100 to-pink-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with animated gradient */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-3xl -z-10 animate-pulse" />
        <div className="flex items-start gap-4">
          <div className="p-4 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Speaking Room
            </h1>
            <p className="text-muted-foreground text-lg">
              Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency, grammar,
              and content.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-linear-to-r from-purple-100 to-pink-100 rounded-xl h-14">
          <TabsTrigger 
            value="library" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-semibold transition-all duration-300"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Library
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-pink-600 font-semibold transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create Custom
          </TabsTrigger>
        </TabsList>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-12 mt-8">
          {mockTopics.map((topic) => {
            const topicScenarios = mockSpeakingScenarios[topic.id] || []
            if (topicScenarios.length === 0) return null

            const TopicIcon = topic.icon

            return (
              <div key={topic.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color} shadow-lg`}>
                    <TopicIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">{topic.title}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {topicScenarios.map((scenario) => {
                    const ScenarioIcon = scenario.icon
                    return (
                      <Card 
                        key={scenario.id} 
                        className="group relative overflow-hidden border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                        onMouseEnter={() => setHoveredCard(scenario.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Icon illustration */}
                        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                          <ScenarioIcon className="h-32 w-32 text-purple-500" />
                        </div>

                        <div className="relative p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${topic.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                <ScenarioIcon className="h-5 w-5 text-white" />
                              </div>
                              <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                                {scenario.title}
                              </h3>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 ${getDifficultyColor(scenario.difficulty)} shadow-sm`}>
                              {scenario.difficulty}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {scenario.description}
                          </p>

                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-5 border border-purple-100">
                            <p className="text-xs font-bold text-purple-600 uppercase mb-2 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Learning Goal
                            </p>
                            <p className="text-sm font-medium text-gray-700">{scenario.goal}</p>
                          </div>

                          <Button 
                            className="w-full gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/button"
                          >
                            Start Session
                            <ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* Custom Tab */}
        <TabsContent value="custom" className="space-y-6 mt-8">
          <Card className="p-8 border-2 border-pink-200 bg-linear-to-br from-pink-50 to-purple-50 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-pink-500 to-purple-500 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              Create Custom Scenario
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold block mb-2 text-gray-700">Topic/Scenario Title</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Business Meeting, Doctor's Appointment"
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2 text-gray-700">Learning Goal</label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="What do you want to learn from this scenario?"
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2 text-gray-700">Context/Situation</label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Describe the situation and what the AI tutor should do..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleCreateScenario}
                disabled={isCreating || !formData.topic || !formData.goal || !formData.context} 
                className="w-full gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Scenario
                    <Sparkles className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Custom Scenarios List */}
          {customScenarios.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-pink-500" />
                Your Custom Scenarios
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {customScenarios.map((scenario) => {
                  const ScenarioIcon = scenario.icon
                  return (
                    <Card 
                      key={scenario.id} 
                      className="group relative overflow-hidden border-2 border-pink-300 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 opacity-50" />
                      
                      <div className="absolute top-4 right-4 opacity-10">
                        <ScenarioIcon className="h-32 w-32 text-pink-500" />
                      </div>

                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-linear-to-br from-pink-500 to-purple-500 shadow-md">
                              <ScenarioIcon className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="text-xl font-bold">{scenario.title}</h4>
                          </div>
                          <span className="text-xs font-bold bg-linear-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                            Custom
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-5 border border-pink-200">
                          <p className="text-xs font-bold text-pink-600 uppercase mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Goal
                          </p>
                          <p className="text-sm font-medium text-gray-700">{scenario.goal}</p>
                        </div>

                        <Button className="w-full gap-2 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          Start Session
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}