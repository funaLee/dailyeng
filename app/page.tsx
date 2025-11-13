"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, MessageSquare, BookOpen, Target, Sparkles, Quote, ArrowRight } from "lucide-react"
import { InteractiveGridBackground } from "@/components/ui/interactive-grid-background"

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
    },
    {
      id: "speaking-room",
      label: "Speaking Room",
      title: "Virtual Speaking Room",
      description:
        "Practice speaking in real-life contexts with AI tutors. Get instant feedback and interactive speaking sessions. Build confidence step by step.",
      image: "/learning.png",
    },
    {
      id: "study-plan",
      label: "Personal Study Plan",
      title: "Personal Study Plan",
      description:
        "DailyEng adapts to your goals. Whether you're practicing for school, work, or exams — we guide your progress with a personalized learning roadmap.",
      image: "/learning.png",
    },
    {
      id: "learning-profile",
      label: "Your Learning Profile",
      title: "Your Learning Profile",
      description:
        "Track your achievements, streaks, strengths, and areas to improve. Grow with your own learning journey.",
      image: "/learning.png",
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section: left content + two images on right */}
      <section className="relative">
        <InteractiveGridBackground rows={12} cols={12} className="z-0" />

        <div className="pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Cột trái */}
            <div className="pointer-events-none">
              <div className="inline-flex items-center gap-2 bg-[#C2E2FA] text-gray-900 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#C2E2FA]/50">
                <Sparkles className="w-4 h-4" />
                The best English learning website ever you can find
              </div>

              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold mb-6 leading-tight text-primary">
                DailyEng
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-6 leading-relaxed text-gray-400">
                Learn English the Smart 
                <br />
                &amp; Fun Way!
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Here, you don't just memorize words — you use them. Practice with interactive exercises, AI tutors, and
                a personalized study plan.
              </p>

              {/* Chỗ này cần click được → bật lại pointer-events-auto */}
              <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
                <Link href="/auth/signup" className="pointer-events-auto">
                  <Button
                    size="lg"
                    className="pointer-events-auto bg-[#C2E2FA] hover:bg-[#A8D5F7] text-gray-900 px-6 py-3 rounded-full shadow font-semibold"
                  >
                    Join now
                  </Button>
                </Link>
                <Link href="/help" className="pointer-events-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="pointer-events-auto border-2 border-[#C2E2FA] text-gray-900 hover:bg-[#C2E2FA]/10 px-6 py-3 rounded-full bg-transparent"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>

            {/* Cột phải – chỉ là hình minh hoạ, không cần click */}
            <div className="relative w-full h-96 lg:h-150 flex items-center justify-center pointer-events-none">
              <div className="relative w-80 h-96 lg:w-120 lg:h-150 rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/learning.png" alt="Learning" fill className="object-cover" />
              </div>

              <div className="absolute -right-10 -top-10 w-48 h-64 lg:w-56 lg:h-72 rounded-xl overflow-hidden shadow-xl transform rotate-4">
                <Image src="/learning.png" alt="Learning overlay" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Logos Marquee */}
      <section className="py-8 bg-white border-y border-gray-100 overflow-hidden">
        <div className="flex animate-scroll-left whitespace-nowrap">
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-12 items-center px-6">
              <div className="w-50 h-30 relative transition-all inline-block">
                <Image src="/bc-logo.png" alt="British Council" fill className="object-contain" />
              </div>
              <div className="w-50 h-30 relative transition-all inline-block">
                <Image src="/idp-logo.png" alt="IDP" fill className="object-contain" />
              </div>
              <div className="w-50 h-30 relative transition-all inline-block">
                <Image src="/cambridge-logo.png" alt="Cambridge" fill className="object-contain" />
              </div>
              <div className="w-50 h-30 relative transition-all inline-block">
                <Image src="/toefl-logo.png" alt="TOEFL" fill className="object-contain" />
              </div>
              <div className="w-50 h-30 relative transition-all inline-block">
                <Image src="/ielts-logo.png" alt="IELTS" fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section - Redesigned */}
      <section className="py-16 bg-linear-to-b from-white to-[#C2E2FA]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rating Card */}
            <Card className="bg-[#C2E2FA] text-gray-900 border-0 p-8 shadow-xl rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <div className="text-6xl font-bold mb-2">100,000+</div>
                <div className="text-gray-700 text-lg mb-6">people using it</div>
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 inline-flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 font-semibold">5.0 Rating</span>
                </div>
              </div>
            </Card>

            {/* Quote Card */}
            <Card className="bg-white border-2 border-[#C2E2FA] p-8 shadow-lg rounded-3xl relative">
              <Quote className="absolute top-6 right-6 w-16 h-16 text-[#C2E2FA]" />
              <div className="relative z-10">
                <p className="text-gray-700 text-xl leading-relaxed mb-6 italic">
                  "Some quote about learning (especially in English) here, for nothing but it seems quite fun"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#C2E2FA] rounded-full flex items-center justify-center text-gray-900 font-bold">
                    TT
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">T.Truc</div>
                    <div className="text-sm text-gray-500">University of Information Technology</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-2 border-[#C2E2FA] text-gray-900 hover:bg-[#C2E2FA]/20 rounded-full px-8 py-3 bg-transparent"
            >
              See all reviews here <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* What Makes DailyEng Different Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes DailyEng Different?</h2>
            <p className="text-xl text-gray-600">Four powerful features that transform your learning experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Speak First",
                subtitle: "Real Conversations",
                description: "Practice real-life conversations in our Virtual Speaking Room.",
                icon: MessageSquare,
                image: "/learning.png",
              },
              {
                title: "Learn by Using",
                subtitle: "Active Learning",
                description: "Vocabulary & grammar are applied through listening, reading, and writing.",
                icon: BookOpen,
                image: "/learning.png",
              },
              {
                title: "Stay Motivated",
                subtitle: "Gamified Experience",
                description: "Points, streaks, minigames, and leaderboards keep learning fun.",
                icon: Target,
                image: "/learning.png",
              },
              {
                title: "Smart Companion",
                subtitle: "AI-Powered Tutor",
                description: "Kitty Tutor guides you, answers questions, and helps you study anytime.",
                icon: Sparkles,
                image: "/learning.png",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="bg-white border-2 border-[#C2E2FA] overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:border-[#A8D5F7] rounded-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <feature.icon className="w-6 h-6 text-[#C2E2FA]" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-gray-700 mb-1">{feature.subtitle}</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Do on DailyEng Section */}
      <section className="py-20 bg-linear-to-b from-white to-[#C2E2FA]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Can Do on DailyEng</h2>
            <p className="text-xl text-gray-600">Explore our comprehensive learning features</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {featureTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#C2E2FA] text-gray-900 shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-[#C2E2FA]/50 border border-[#C2E2FA]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="bg-white border-2 border-[#C2E2FA] p-12 shadow-xl rounded-3xl">
            {featureTabs.map((tab) => (
              <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative rounded-3xl h-80 overflow-hidden shadow-2xl">
                    <Image src={tab.image || "/placeholder.svg"} alt={tab.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">{tab.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8">{tab.description}</p>
                    <Button className="bg-[#C2E2FA] hover:bg-[#A8D5F7] text-gray-900 rounded-full px-8 font-semibold">
                      Try it now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* Review From Learner Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="rounded-3xl p-8 sm:p-12 border-2 border-[#C2E2FA]">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2 flex items-center justify-center">
                <div>
                  <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
                    REVIEW
                    <br />
                    FROM
                    <br />
                    LEARNER
                  </h2>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-[#C2E2FA] text-[#C2E2FA]" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 grid grid-cols-2 gap-4 max-h-[600px] overflow-hidden">
                {/* Left Column - Scroll Up */}
                <div className="space-y-4 animate-scroll-up">
                  {[...reviews.filter((r) => r.direction === "up"), ...reviews.filter((r) => r.direction === "up")].map(
                    (review, idx) => (
                      <Card
                        key={idx}
                        className="bg-[#C2E2FA]/30 border border-[#C2E2FA] p-4 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-[#C2E2FA] rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shrink-0">
                            {review.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate">{review.name}</div>
                            <span className="text-xs font-medium text-gray-900 bg-[#C2E2FA] px-2 py-0.5 rounded-full inline-block mt-1">
                              IELTS {review.ielts}
                            </span>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>
                      </Card>
                    ),
                  )}
                </div>

                {/* Right Column - Scroll Down */}
                <div className="space-y-4 animate-scroll-down">
                  {[
                    ...reviews.filter((r) => r.direction === "down"),
                    ...reviews.filter((r) => r.direction === "down"),
                  ].map((review, idx) => (
                    <Card
                      key={idx}
                      className="bg-[#C2E2FA]/30 border border-[#C2E2FA] p-4 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#C2E2FA] rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shrink-0">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{review.name}</div>
                          <span className="text-xs font-medium text-gray-900 bg-[#C2E2FA] px-2 py-0.5 rounded-full inline-block mt-1">
                            IELTS {review.ielts}
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Starting Journey Section - Redesigned */}
      <section className="py-20 bg-[#C2E2FA]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-2 border-[#C2E2FA] rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="relative h-full min-h-[400px]">
                <Image src="/learning.png" alt="Start Learning" fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-[#C2E2FA]/20 to-transparent"></div>
              </div>
              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Starting your Learning Journey right now!</h2>
                <p className="text-xl text-gray-600 mb-8">How comfortable are you speaking English?</p>
                <div className="space-y-4">
                  {[
                    { text: "I'm just starting", icon: "🌱", color: "bg-green-100" },
                    { text: "I can speak with effort", icon: "🚀", color: "bg-[#C2E2FA]" },
                    { text: "I want to sound more natural", icon: "⭐", color: "bg-purple-100" },
                  ].map((option, idx) => (
                    <Link key={idx} href="/plan">
                      <Card className="border-2 border-[#C2E2FA] hover:border-[#A8D5F7] hover:shadow-lg transition-all duration-300 p-6 rounded-2xl cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                            >
                              {option.icon}
                            </div>
                            <span className="text-lg font-semibold text-gray-900">{option.text}</span>
                          </div>
                          <ArrowRight className="w-6 h-6 text-gray-600 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#C2E2FA] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">Ready to start your journey?</h2>
          <p className="text-xl text-gray-700 mb-10">Join thousands of learners improving their English every day.</p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-50 rounded-full px-12 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 10s linear infinite;
        }

        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }

        .animate-scroll-up:hover,
        .animate-scroll-down:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
