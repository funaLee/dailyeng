"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockTopics, mockSpeakingScenarios } from "@/lib/mock-data"
import { Mic, ArrowRight, Sparkles } from "lucide-react"

export default function SpeakingPage() {
  const [scenarios, setScenarios] = useState<any[]>([])
  const [customScenarios, setCustomScenarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    topic: "",
    goal: "",
    context: "",
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const allScenarios = Object.values(mockSpeakingScenarios).flat()
    setScenarios(allScenarios)
    setLoading(false)
  }, [])

  const handleCreateScenario = async (e: React.FormEvent) => {
    e.preventDefault()
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
      }
      setCustomScenarios((prev) => [newScenario, ...prev])
      setFormData({ topic: "", goal: "", context: "" })
      setIsCreating(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Mic className="h-8 w-8 text-purple-500" />
          Speaking Room
        </h1>
        <p className="text-muted-foreground">
          Practice real conversations with AI tutors and get instant feedback on your pronunciation, fluency, grammar,
          and content.
        </p>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="custom">Create Custom</TabsTrigger>
        </TabsList>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-8">
          {Object.entries(mockSpeakingScenarios).map(([category, scenarios]) => {
            if (scenarios.length === 0) return null

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold">{scenario.title}</h3>
                        <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {scenario.difficulty}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

                      <div className="bg-secondary/50 p-3 rounded-lg mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Goal</p>
                        <p className="text-sm">{scenario.goal}</p>
                      </div>

                      <Link href={`/speaking/session/${scenario.id}`}>
                        <Button className="w-full gap-2">
                          Start Session
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* Custom Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Create Custom Scenario
            </h3>

            <form onSubmit={handleCreateScenario} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Topic/Scenario Title</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Business Meeting, Doctor's Appointment"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Learning Goal</label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="What do you want to learn from this scenario?"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Context/Situation</label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Describe the situation and what the AI tutor should do..."
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" disabled={isCreating} className="w-full gap-2">
                {isCreating ? "Creating..." : "Create Scenario"}
                <Sparkles className="h-4 w-4" />
              </Button>
            </form>
          </Card>

          {/* Custom Scenarios List */}
          {customScenarios.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Custom Scenarios</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {customScenarios.map((scenario) => (
                  <Card key={scenario.id} className="p-6 hover:shadow-lg transition-shadow border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold">{scenario.title}</h4>
                      <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Custom
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

                    <div className="bg-secondary/50 p-3 rounded-lg mb-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Goal</p>
                      <p className="text-sm">{scenario.goal}</p>
                    </div>

                    <Link href={`/speaking/session/${scenario.id}`}>
                      <Button className="w-full gap-2">
                        Start Session
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
