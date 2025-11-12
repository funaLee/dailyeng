"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { authService } from "@/lib/auth"
import { ChevronDown, Star } from "lucide-react"

export default function Home() {
  const { user, login } = useAppStore()
  const [activeTab, setActiveTab] = useState("language-hub")

  useEffect(() => {
    // Initialize from localStorage on mount
    const initializeUser = async () => {
      const storedUser = await authService.getCurrentUser()
      if (storedUser && !user) {
        login(storedUser)
      }
    }

    initializeUser()
  }, [user, login])

  const featureTabs = [
    {
      id: "language-hub",
      label: "Language Hub",
      title: "Language Hub",
      description:
        "No more rote memorization. Every word and rule you learn is reinforced through exercises, conversations, and real applications.",
      imagePlaceholder: true,
    },
    {
      id: "speaking-room",
      label: "Speaking Room",
      title: "Virtual Speaking Room",
      description:
        "Practice speaking in real-life contexts with AI tutors. Get instant feedback and interactive speaking sessions. Build confidence step by step.",
      imagePlaceholder: true,
    },
    {
      id: "study-plan",
      label: "Personal Study Plan",
      title: "Personal Study Plan",
      description:
        "DailyEng adapts to your goals. Whether you're practicing for school, work, or exams — we guide your progress with a personalized learning roadmap.",
      imagePlaceholder: true,
    },
    {
      id: "learning-profile",
      label: "Your Learning Profile",
      title: "Your Learning Profile",
      description:
        "Track your achievements, streaks, strengths, and areas to improve. Grow with your own learning journey.",
      imagePlaceholder: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <section className="relative overflow-hidden bg-white rounded-[2rem] mx-4 my-6 sm:mx-8 border border-gray-200">
        {/* Geometric shapes background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#a8c5d1] rounded-lg transform rotate-12 opacity-60" />
          <div className="absolute top-20 left-32 w-48 h-48 bg-[#7fa8bc] rounded-lg transform -rotate-6 opacity-40" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#7fa8bc] rounded-lg transform rotate-45 opacity-50" />
          <div className="absolute top-16 right-16 w-56 h-56 bg-[#a8c5d1] rounded-lg transform -rotate-12 opacity-50" />
          <div className="absolute top-32 right-32 w-32 h-32 bg-[#5a8ba0] rounded-lg transform rotate-6 opacity-60" />
          <div className="absolute bottom-16 right-24 w-48 h-48 bg-[#7fa8bc] rounded-lg transform -rotate-12 opacity-40" />
        </div>

        <div className="relative z-10 text-center py-20 sm:py-32 px-4">
          <div className="inline-block bg-[#7fa8bc] text-white text-sm px-6 py-2 rounded-full mb-6">
            The best English learning website ever you can find
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-[#3b82f6]">DailyEng</span>
            <br />
            Learn English the Smart & Fun Way!
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Here, you don't just memorize words — you use them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#7fa8bc] hover:bg-[#6a92a5] text-white rounded-full px-8">
                Join now
              </Button>
            </Link>
            <Link href="/help">
              <Button
                size="lg"
                variant="outline"
                className="bg-[#a8c5d1] hover:bg-[#92b3c4] border-0 text-gray-800 rounded-full px-8"
              >
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-4 sm:mx-8 my-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="bg-[#7fa8bc] text-white rounded-lg px-6 py-3">
            <div className="font-semibold">Over 100,000 people using it</div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 text-sm">Rating</span>
            </div>
          </div>

          <Card className="bg-[#7fa8bc] border-0 p-6 flex-1 max-w-2xl">
            <p className="text-white italic text-center">
              "Some quote about learning (especially in English) here, for nothing but it seems quite fun"
            </p>
            <p className="text-white text-sm text-center mt-2">T.Truc - University of Information Technology</p>
          </Card>

          <Button variant="outline" className="bg-[#7fa8bc] hover:bg-[#6a92a5] text-white border-0 rounded-lg">
            See all reviews here →
          </Button>
        </div>
      </section>

      <div className="flex justify-center my-8">
        <div className="w-px h-16 bg-gray-300 relative">
          <ChevronDown className="h-8 w-8 text-gray-400 absolute -bottom-2 -left-4 animate-bounce" />
        </div>
      </div>

      <section className="mx-4 sm:mx-8 my-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Makes DailyEng Different?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Speak First",
              description: "Practice real-life conversations in our Virtual Speaking Room.",
            },
            {
              title: "Learn by Using",
              description: "Vocabulary & grammar are applied through listening, reading, and writing.",
            },
            {
              title: "Stay Motivated",
              description: "Points, streaks, minigames, and leaderboards keep learning fun.",
            },
            {
              title: "Smart Companion",
              description: "Kitty Tutor guides you, answers questions, and helps you study anytime.",
            },
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="bg-[#a8c5d1] rounded-t-2xl h-48 mb-0" />
              <Card className="rounded-t-none rounded-b-2xl border-2 border-t-0 border-gray-200 p-6 flex-1">
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center my-8">
        <div className="w-px h-16 bg-gray-300 relative">
          <ChevronDown className="h-8 w-8 text-gray-400 absolute -bottom-2 -left-4 animate-bounce" />
        </div>
      </div>

      <section className="mx-4 sm:mx-8 my-16">
        <h2 className="text-3xl font-bold text-center mb-8">What You Can Do on DailyEng</h2>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-full p-2 max-w-4xl mx-auto border border-gray-200">
          {featureTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-[#7fa8bc] text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#a8c5d1] rounded-3xl p-8 sm:p-12">
          {featureTabs.map((tab) => (
            <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-[#7fa8bc] rounded-2xl h-64 sm:h-80" />
                <div>
                  <h3 className="text-2xl font-bold mb-4">{tab.title}</h3>
                  <p className="text-gray-800 leading-relaxed">{tab.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center my-8">
        <div className="w-px h-16 bg-gray-300 relative">
          <ChevronDown className="h-8 w-8 text-gray-400 absolute -bottom-2 -left-4 animate-bounce" />
        </div>
      </div>

      <section className="mx-4 sm:mx-8 my-16">
        <Card className="rounded-3xl p-8 sm:p-12 border-2 border-gray-200 bg-white">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-center md:text-left">
                REVIEW
                <br />
                FROM
                <br />
                LEARNER
              </h2>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className={`bg-[#a8c5d1] rounded-xl ${item === 3 || item === 6 ? "h-32" : item === 2 || item === 5 ? "h-24" : "h-28"}`}
                />
              ))}
            </div>
          </div>
        </Card>
      </section>

      <div className="flex justify-center my-8">
        <div className="w-px h-16 bg-gray-300 relative">
          <ChevronDown className="h-8 w-8 text-gray-400 absolute -bottom-2 -left-4 animate-bounce" />
        </div>
      </div>

      <section className="mx-4 sm:mx-8 my-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#5a8ba0] rounded-3xl h-96" />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Starting your Learning Journey right now!</h2>
            <p className="text-gray-700 mb-6">How comfortable are you speaking English?</p>
            <div className="space-y-3">
              <Link href="/plan">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gray-200 hover:bg-gray-300 border-0 rounded-lg text-left"
                >
                  I'm just starting
                </Button>
              </Link>
              <Link href="/plan">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gray-200 hover:bg-gray-300 border-0 rounded-lg text-left"
                >
                  I can speak with effort
                </Button>
              </Link>
              <Link href="/plan">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gray-200 hover:bg-gray-300 border-0 rounded-lg text-left"
                >
                  I want to sound more natural
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#a8c5d1] py-20 mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-gray-700 mb-8">Join thousands of learners improving their English every day.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-[#5a8ba0] hover:bg-[#4a7a8f] text-white rounded-full px-12">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
