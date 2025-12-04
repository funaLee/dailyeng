"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  CheckCircle2,
  BookOpen,
  Zap,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("language-hub");

  const featureTabs = [
    {
      id: "language-hub",
      label: "Language Hub",
      title: "Language Hub",
      description:
        "No more rote memorization. Every word and rule you learn is reinforced through exercises, conversations, and real applications.",
      image: "/learning.png",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "speaking-room",
      label: "Speaking Room",
      title: "Virtual Speaking Room",
      description:
        "Practice speaking in real-life contexts with AI tutors. Get instant feedback and interactive speaking sessions. Build confidence step by step.",
      image: "/learning.png",
      icon: <Mic className="w-5 h-5" />, // Changed from MessageSquare to Mic for consistency or keep MessageSquare if imported
    },
    {
      id: "study-plan",
      label: "Personal Study Plan",
      title: "Personal Study Plan",
      description:
        "DailyEng adapts to your goals. Whether you're practicing for school, work, or exams — we guide your progress with a personalized learning roadmap.",
      image: "/learning.png",
      icon: <Zap className="w-5 h-5" />, // Changed from Target to Zap or keep Target if imported
    },
    {
      id: "learning-profile",
      label: "Your Learning Profile",
      title: "Your Learning Profile",
      description:
        "Track your achievements, streaks, strengths, and areas to improve. Grow with your own learning journey.",
      image: "/learning.png",
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Features Section - Bento Grid */}
      <section className="py-20 bg-linear-to-br from-primary-200 via-primary-50 to-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-800 mb-6">
              Why Learners Choose DailyEng
            </h2>
            <p className="text-xl text-gray-600">
              We combine advanced AI with proven learning methods to help you
              achieve fluency faster.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {/* Large Feature - Speak First */}
            <RevealOnScroll className="md:col-span-2">
              <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 overflow-hidden group cursor-pointer">
                <div className="flex-1 z-10">
                  <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                    <Mic className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Speak From Day One
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Don't just read about English. Practice real-life
                    conversations with our AI tutor who listens, corrects your
                    pronunciation, and helps you sound natural.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-accent-500" />{" "}
                      Real-time pronunciation scoring
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-accent-500" />{" "}
                      Context-based roleplays
                    </li>
                  </ul>
                </div>
                <div className="flex-1 relative h-64 w-full md:h-full bg-primary-50 rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/learning.png"
                    alt="Speaking Practice"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </RevealOnScroll>

            {/* Feature 2 - Context Learning */}
            <RevealOnScroll delay={100}>
              <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 rounded-3xl flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Contextual Learning
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Learn vocabulary and grammar in the context of stories and
                    articles, not isolated lists.
                  </p>
                </div>
                <div className="mt-6 h-32 relative rounded-xl overflow-hidden bg-secondary-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-secondary-200 select-none">
                      A+
                    </span>
                  </div>
                </div>
              </Card>
            </RevealOnScroll>

            {/* Feature 3 - Gamification */}
            <RevealOnScroll delay={200}>
              <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 rounded-3xl flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Stay Motivated</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Daily streaks, XP rewards, and leaderboards designed to keep
                    you coming back every day.
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="bg-warning-100 px-3 py-1 rounded-lg text-warning-300 font-bold text-xs border border-warning-200/30">
                    🔥 12 Day Streak
                  </div>
                  <div className="bg-primary-50 px-3 py-1 rounded-lg text-primary-700 font-bold text-xs border border-primary-100">
                    🏆 Top 10
                  </div>
                </div>
              </Card>
            </RevealOnScroll>

            {/* Large Feature - AI Companion */}
            <RevealOnScroll className="md:col-span-2" delay={300}>
              <Card className="h-full bg-white border border-secondary-100 shadow-sm hover:shadow-lg transition-all p-8 rounded-3xl flex flex-col md:flex-row-reverse items-center gap-8 overflow-hidden group cursor-pointer">
                <div className="flex-1 z-10">
                  <div className="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-2xl flex items-center justify-center mb-6 border border-secondary-100">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Kitty Tutor Companion
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Stuck on a word? Need grammar help? Kitty is your 24/7 AI
                    companion ready to explain concepts instantly inside any
                    lesson.
                  </p>
                  <Button
                    variant="secondary"
                    className="bg-secondary-300 hover:bg-secondary-400 text-white rounded-full cursor-pointer"
                  >
                    Chat with Kitty
                  </Button>
                </div>
                <div className="flex-1 relative h-64 w-full md:h-full rounded-2xl overflow-hidden bg-secondary-50/50">
                  <div className="absolute inset-0 bg-linear-to-r from-white/40 to-transparent z-10" />
                  <Image
                    src="/abstract-job-concept.png"
                    alt="AI Companion"
                    fill
                    className="object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Tabs */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Fluency
            </h2>
            <p className="text-xl text-gray-600">
              A complete ecosystem for English mastery
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="flex flex-col lg:flex-row gap-8">
            {/* Tabs Navigation */}
            <div className="lg:w-1/3 flex flex-col gap-3">
              {featureTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary-50 ring-1 ring-primary-200 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-500 text-white shadow-md"
                        : "bg-white text-gray-400 border border-gray-200 group-hover:border-primary-200 group-hover:text-primary-500"
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-lg ${
                        activeTab === tab.id
                          ? "text-primary-900"
                          : "text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </h3>
                    {activeTab === tab.id && (
                      <p className="text-sm text-primary-500 mt-1 font-medium animate-fade-in">
                        Active Feature
                      </p>
                    )}
                  </div>
                  {activeTab === tab.id && (
                    <ChevronRight className="ml-auto w-5 h-5 text-primary-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="lg:w-2/3">
              <div className="relative h-[500px] w-full bg-primary-100 rounded-[2.5rem] border border-primary-100 p-2 overflow-hidden shadow-lg">
                {featureTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`absolute inset-2 bg-white rounded-4xl flex flex-col transition-all duration-500 ease-in-out ${
                      activeTab === tab.id
                        ? "opacity-100 translate-y-0 z-10"
                        : "opacity-0 translate-y-8 z-0 pointer-events-none"
                    }`}
                  >
                    <div className="relative h-64 w-full overflow-hidden rounded-t-4xl">
                      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-10" />
                      <Image
                        src={tab.image || "/placeholder.svg"}
                        alt={tab.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-6 left-8 z-20">
                        <div className="inline-block bg-secondary-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                          FEATURE
                        </div>
                        <h3 className="text-3xl font-bold text-white">
                          {tab.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-between flex-1 bg-white rounded-b-4xl">
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {tab.description}
                      </p>
                      <div className="flex gap-4 mt-6">
                        <Button
                          className="rounded-full px-6 bg-primary-500 hover:bg-primary-600 cursor-pointer"
                          onClick={() =>
                            (window.location.href = "/auth/signup")
                          }
                        >
                          Try for free
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
