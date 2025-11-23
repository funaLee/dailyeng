"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Star,
  MessageSquare,
  BookOpen,
  Target,
  Sparkles,
  Quote,
  CheckCircle2,
  Zap,
  Mic,
  Users,
  ChevronRight,
} from "lucide-react"
import { InteractiveGridBackground } from "@/components/ui/interactive-grid-background"
import { StackedCardCarousel } from "@/components/home/stacked-card-carousel"

// Scroll Animation Component
function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("language-hub")

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
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: "study-plan",
      label: "Personal Study Plan",
      title: "Personal Study Plan",
      description:
        "DailyEng adapts to your goals. Whether you're practicing for school, work, or exams — we guide your progress with a personalized learning roadmap.",
      image: "/learning.png",
      icon: <Target className="w-5 h-5" />,
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
  ]

  const reviews = [
    {
      name: "Nguyen Van A",
      avatar: "/avatar.png",
      ielts: "7.5",
      content: "DailyEng helped me improve my speaking skills dramatically. The AI tutor is amazing!",
      direction: "up",
    },
    {
      name: "Tran Thi B",
      avatar: "/avatar.png",
      ielts: "8.0",
      content: "I love the gamification features. Learning English has never been this fun!",
      direction: "up",
    },
    {
      name: "Le Van C",
      avatar: "/avatar.png",
      ielts: "7.0",
      content: "The personalized study plan keeps me motivated every day. Highly recommended!",
      direction: "up",
    },
    {
      name: "Pham Thi D",
      avatar: "/avatar.png",
      ielts: "8.5",
      content: "Best English learning platform I've ever used. The speaking room is a game-changer!",
      direction: "down",
    },
    {
      name: "Hoang Van E",
      avatar: "/avatar.png",
      ielts: "7.5",
      content: "Great for exam preparation. I improved my IELTS score significantly!",
      direction: "down",
    },
    {
      name: "Vo Thi F",
      avatar: "/avatar.png",
      ielts: "8.0",
      content: "The vocabulary exercises are engaging and effective. I can see real progress!",
      direction: "down",
    },
  ]

  const partnerLogos = [
    { src: "/bc-logo.png", alt: "British Council" },
    { src: "/idp-logo.png", alt: "IDP" },
    { src: "/cambridge-logo.png", alt: "Cambridge" },
    { src: "/toefl-logo.png", alt: "TOEFL" },
    { src: "/ielts-logo.png", alt: "IELTS" },
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#C2E2FA] selection:text-blue-900">
      {/* Hero Section - Reduced padding to show logos above fold */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16">
        <InteractiveGridBackground rows={12} cols={20} className="z-0 opacity-80" />

        <div className="pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left">
              <RevealOnScroll className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-100 shadow-sm">
                <Sparkles className="w-4 h-4 fill-blue-400 text-blue-500" />
                <span>The #1 AI-Powered English Platform</span>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                {/* Updated Title: Plain Blue "Eng" */}
                <h1 className="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.1] tracking-tight text-gray-700">
                  Daily<span className="text-blue-400">Eng</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-6 leading-relaxed text-gray-500">
                  Master English the <br className="hidden lg:block" />
                  <span className="text-blue-400 font-semibold">Smart & Fun Way!</span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">
                  Stop memorizing lists. Start using the language. Practice with real-world scenarios, AI tutors, and
                  personalized roadmaps.
                </p>
              </RevealOnScroll>

              <RevealOnScroll
                delay={400}
                className="flex flex-col sm:flex-row gap-4 pointer-events-auto w-full sm:w-auto"
              >
                <Link href="/auth/signup" className="pointer-events-auto w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-blue-400 hover:bg-blue-500 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg font-semibold"
                  >
                    Start Learning Free
                  </Button>
                </Link>
                <Link href="/help" className="pointer-events-auto w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 px-8 py-6 rounded-full text-lg bg-transparent"
                  >
                    How it works
                  </Button>
                </Link>
              </RevealOnScroll>

              <RevealOnScroll delay={500} className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <Image src={`/placeholder-user.jpg`} width={32} height={32} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Trusted by 10,000+ learners</p>
              </RevealOnScroll>
            </div>

            {/* Right Visual - StackedCardCarousel */}
            <div
              className="relative w-full pointer-events-auto lg:pl-10 animate-fade-in-up"
              style={{ animationDelay: "600ms" }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl -z-10" />
              <StackedCardCarousel
                images={[
                  "/learning.png",
                  "/abstract-job-concept.png",
                  "/diverse-travelers-world-map.png",
                  "/diverse-food-spread.png",
                ]}
                autoPlayInterval={3000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logos Marquee - Infinite Loop, No Grayscale */}
      <section className="py-8 bg-white border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Prepared for success with</p>
        </div>

        <div className="relative flex overflow-hidden">
          {/* First set of logos */}
          <div className="flex animate-scroll-left whitespace-nowrap py-2">
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div key={`logo-1-${index}`} className="flex items-center justify-center mx-12 w-32 h-16 relative">
                <Image src={logo.src || "/placeholder.svg"} alt={logo.alt} fill className="object-contain" />
              </div>
            ))}
          </div>
          {/* Second set for seamless loop (absolute positioned or just doubled in the flex container usually works best with CSS anim, here I doubled the array above which is often safer for width calculation) */}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-15 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rating Card */}
            <RevealOnScroll>
              <Card className="bg-blue-400 text-white border-0 p-6 shadow-xl rounded-2xl relative overflow-hidden group transition-transform hover:scale-[1.02] h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-blue-100 font-medium text-sm">
                      <Users className="w-4 h-4" />
                      <span>Our Community</span>
                    </div>
                    <div className="text-4xl font-bold mb-1 tracking-tighter">100k+</div>
                    <div className="text-blue-100 text-base mb-4">active learners worldwide</div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 w-fit border border-white/10">
                    <div className="flex -space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <div className="h-6 w-px bg-white/20"></div>
                    <div>
                      <span className="font-bold text-base">4.9</span>
                      <span className="text-blue-100 text-xs ml-1">/ 5.0</span>
                    </div>
                  </div>
                </div>
              </Card>
            </RevealOnScroll>

            {/* Quote Card */}
            <RevealOnScroll delay={200}>
              <Card className="bg-slate-50 border border-slate-200 p-6 shadow-lg rounded-2xl relative flex flex-col justify-center group hover:border-blue-200 transition-colors h-full">
                <Quote className="absolute top-4 right-4 w-10 h-10 text-blue-100 -z-0 rotate-12" />
                <div className="relative z-10">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  <p className="text-gray-900 text-lg font-medium leading-relaxed mb-6">
                    "This app completely changed how I prepare for my interviews. The AI speaking partner feels
                    incredibly realistic."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      TT
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Thanh Truc</div>
                      <div className="text-blue-400 text-xs font-medium">Software Engineer</div>
                    </div>
                  </div>
                </div>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Why Learners Choose DailyEng</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine advanced AI with proven learning methods to help you achieve fluency faster.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {/* Large Feature - Speak First */}
            <RevealOnScroll className="md:col-span-2">
              <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 overflow-hidden group">
                <div className="flex-1 z-10">
                  <div className="w-12 h-12 bg-blue-100 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                    <Mic className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Speak From Day One</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Don't just read about English. Practice real-life conversations with our AI tutor who listens,
                    corrects your pronunciation, and helps you sound natural.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Real-time pronunciation scoring
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Context-based roleplays
                    </li>
                  </ul>
                </div>
                <div className="flex-1 relative h-64 w-full md:h-full bg-blue-50 rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <Image src="/learning.png" alt="Speaking Practice" fill className="object-cover" />
                </div>
              </Card>
            </RevealOnScroll>

            {/* Feature 2 - Context Learning */}
            <RevealOnScroll delay={100}>
              <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 rounded-3xl flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Contextual Learning</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Learn vocabulary and grammar in the context of stories and articles, not isolated lists.
                  </p>
                </div>
                <div className="mt-6 h-32 relative rounded-xl overflow-hidden bg-purple-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-purple-200 select-none">A+</span>
                  </div>
                </div>
              </Card>
            </RevealOnScroll>

            {/* Feature 3 - Gamification */}
            <RevealOnScroll delay={200}>
              <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 rounded-3xl flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Stay Motivated</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Daily streaks, XP rewards, and leaderboards designed to keep you coming back every day.
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="bg-yellow-50 px-3 py-1 rounded-lg text-yellow-700 font-bold text-xs border border-yellow-100">
                    🔥 12 Day Streak
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-lg text-blue-700 font-bold text-xs border border-blue-100">
                    🏆 Top 10
                  </div>
                </div>
              </Card>
            </RevealOnScroll>

            {/* Large Feature - AI Companion */}
            <RevealOnScroll className="md:col-span-2" delay={300}>
              <Card className="h-full bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all p-8 rounded-3xl flex flex-col md:flex-row-reverse items-center gap-8 overflow-hidden group">
                <div className="flex-1 z-10">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Kitty Tutor Companion</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Stuck on a word? Need grammar help? Kitty is your 24/7 AI companion ready to explain concepts
                    instantly inside any lesson.
                  </p>
                  <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                    Chat with Kitty
                  </Button>
                </div>
                <div className="flex-1 relative h-64 w-full md:h-full rounded-2xl overflow-hidden bg-purple-50/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent z-10" />
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Fluency</h2>
            <p className="text-xl text-gray-600">A complete ecosystem for English mastery</p>
          </RevealOnScroll>

          <RevealOnScroll className="flex flex-col lg:flex-row gap-8">
            {/* Tabs Navigation */}
            <div className="lg:w-1/3 flex flex-col gap-3">
              {featureTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 ${
                    activeTab === tab.id ? "bg-blue-50 ring-1 ring-blue-200 shadow-sm" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-400 text-white shadow-md"
                        : "bg-white text-gray-400 border border-gray-200 group-hover:border-blue-200 group-hover:text-blue-500"
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${activeTab === tab.id ? "text-blue-900" : "text-gray-700"}`}>
                      {tab.label}
                    </h3>
                    {activeTab === tab.id && (
                      <p className="text-sm text-blue-400 mt-1 font-medium animate-fade-in">Active Feature</p>
                    )}
                  </div>
                  {activeTab === tab.id && <ChevronRight className="ml-auto w-5 h-5 text-blue-500" />}
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="lg:w-2/3">
              <div className="relative h-[500px] w-full bg-gray-50 rounded-[2.5rem] border border-gray-100 p-2 overflow-hidden shadow-lg">
                {featureTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`absolute inset-2 bg-white rounded-[2rem] flex flex-col transition-all duration-500 ease-in-out ${
                      activeTab === tab.id
                        ? "opacity-100 translate-y-0 z-10"
                        : "opacity-0 translate-y-8 z-0 pointer-events-none"
                    }`}
                  >
                    <div className="relative h-64 w-full overflow-hidden rounded-t-[2rem]">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                      <Image src={tab.image || "/placeholder.svg"} alt={tab.title} fill className="object-cover" />
                      <div className="absolute bottom-6 left-8 z-20">
                        <div className="inline-block bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                          FEATURE
                        </div>
                        <h3 className="text-3xl font-bold text-white">{tab.title}</h3>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-between flex-1 bg-white rounded-b-[2rem]">
                      <p className="text-lg text-gray-600 leading-relaxed">{tab.description}</p>
                      <div className="flex gap-4 mt-6">
                        <Button className="rounded-full px-6" onClick={() => (window.location.href = "/auth/signup")}>
                          Try for free
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 text-gray-600">
                          Learn more
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

      {/* Reviews Marquee Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Learner Stories</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-medium text-gray-600">4.8/5 average rating</span>
            </div>
          </div>
          <Button variant="outline" className="hidden sm:flex bg-transparent">
            View all reviews
          </Button>
        </RevealOnScroll>

        <div className="relative w-full">
          {/* Fade masks for smooth scrolling edges */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />

          <div
            className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px] overflow-hidden"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
          >
            {/* Column 1 - Scroll Up */}
            <div className="space-y-6 animate-scroll-up hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((review, idx) => (
                <Card key={`col1-${idx}`} className="p-6 border-0 shadow-sm bg-white rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                      <Image
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">IELTS {review.ielts}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">"{review.content}"</p>
                </Card>
              ))}
            </div>

            {/* Column 2 - Scroll Down */}
            <div className="space-y-6 animate-scroll-down hover:[animation-play-state:paused] hidden md:block">
              {[...reviews.reverse(), ...reviews].map((review, idx) => (
                <Card key={`col2-${idx}`} className="p-6 border-0 shadow-sm bg-white rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                      <p className="text-xs text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                        Verified Student
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">"{review.content}"</p>
                </Card>
              ))}
            </div>
            {/* Column 3 - Scroll Up */}
            <div className="space-y-6 animate-scroll-up hover:[animation-play-state:paused] hidden lg:block">
              {[...reviews, ...reviews].map((review, idx) => (
                <Card key={`col3-${idx}`} className="p-6 border-0 shadow-sm bg-white rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                      <Image
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">TOEFL 105</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">"{review.content}"</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-blue-400">
          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          ></div>
        </div>

        <RevealOnScroll className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-white tracking-tight">
            Ready to speak English with confidence?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of learners who are already improving their careers and lives with DailyEng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-blue-400 hover:bg-blue-50 rounded-full px-10 py-7 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 w-full sm:w-auto"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/plan">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-400 text-white hover:bg-blue-700/50 hover:border-blue-300 bg-transparent rounded-full px-10 py-7 text-lg font-semibold w-full sm:w-auto"
              >
                Take Placement Test
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200 opacity-80">No credit card required • Cancel anytime</p>
        </RevealOnScroll>
      </section>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-up {
          animation: scroll-up 40s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 40s linear infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        /* Mask for marquee edges */
        .mask-linear-fade {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        /* Hide scrollbar for cleaner UI */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      <div className="hidden">
        <UsersIcon className="w-0 h-0" />
      </div>
    </div>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
