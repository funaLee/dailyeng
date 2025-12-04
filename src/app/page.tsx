"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  GraduationCap,
  ArrowRight,
  Trophy,
  ChevronLeft,
  Check,
} from "lucide-react";
import { InteractiveGridBackground } from "@/components/ui/interactive-grid-background";
import { StackedCardBackground } from "@/components/home/stacked-card-background";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Scroll Animation Component
function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

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
  );
}

export default function HomePage() {
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
  ];

  const reviews = [
    {
      name: "Nguyen Van A",
      avatar: "/asian-male-student-portrait.png",
      ielts: "7.5",
      content:
        "DailyEng helped me improve my speaking skills dramatically. The AI tutor is amazing!",
      direction: "up",
      fullFeedback:
        "DailyEng completely transformed my English learning journey. Before using this platform, I struggled with speaking confidence and couldn't hold a conversation for more than a few minutes. The AI tutor feature is incredibly patient and provides instant feedback on pronunciation and grammar. After 6 months of consistent practice, I achieved my dream IELTS score. The gamification elements kept me motivated throughout, and the speaking room sessions with other learners gave me real-world practice opportunities.",
      courses: [
        "IELTS Speaking Mastery",
        "Academic Writing",
        "Pronunciation Pro",
      ],
      result: { type: "IELTS", score: "7.5", previousScore: "5.5" },
      duration: "6 months",
      photo: "/learning.png",
    },
    {
      name: "Tran Thi B",
      avatar: "/asian-female-student-portrait.png",
      ielts: "8.0",
      content:
        "I love the gamification features. Learning English has never been this fun!",
      direction: "up",
      fullFeedback:
        "As someone who always found traditional English classes boring, DailyEng was a breath of fresh air. The gamification features made me actually look forward to my daily lessons. I earned badges, competed on leaderboards, and the streak system ensured I never missed a day. The vocabulary hub is particularly impressive - I learned over 3000 new words in just 4 months. The platform's ability to adapt to my learning pace and style made all the difference in my IELTS preparation.",
      courses: [
        "Vocabulary Builder",
        "IELTS Complete Preparation",
        "Grammar Fundamentals",
      ],
      result: { type: "IELTS", score: "8.0", previousScore: "6.0" },
      duration: "4 months",
      photo: "/learning.png",
    },
    {
      name: "Le Van C",
      avatar: "/asian-male-professional-portrait.jpg",
      ielts: "7.0",
      content:
        "The personalized study plan keeps me motivated every day. Highly recommended!",
      direction: "up",
      fullFeedback:
        "Working full-time made it challenging to find time for English study, but DailyEng's personalized study plan fit perfectly into my busy schedule. The platform analyzed my strengths and weaknesses and created a custom curriculum just for me. The mobile app allowed me to study during commutes, and the short, focused lessons were perfect for my attention span. I went from intermediate to advanced level while maintaining my job, something I thought was impossible before.",
      courses: ["Business English", "Daily Conversation", "Listening Skills"],
      result: { type: "IELTS", score: "7.0", previousScore: "5.0" },
      duration: "8 months",
      photo: "/learning.png",
    },
    {
      name: "Pham Thi D",
      avatar: "/asian-female-graduate-portrait.jpg",
      ielts: "8.5",
      content:
        "Best English learning platform I've ever used. The speaking room is a game-changer!",
      direction: "down",
      fullFeedback:
        "I've tried numerous English learning platforms before DailyEng, but none came close to this experience. The speaking room feature connected me with learners from around the world, giving me invaluable practice in real conversations. The AI feedback on my speaking was spot-on and helped me identify issues I never knew I had. The comprehensive IELTS preparation materials, especially for the writing section, were exceptional. I achieved a band 8.5, exceeding my target of 7.5!",
      courses: [
        "IELTS Writing Excellence",
        "Speaking Room Premium",
        "Reading Strategies",
      ],
      result: { type: "IELTS", score: "8.5", previousScore: "6.5" },
      duration: "5 months",
      photo: "/learning.png",
    },
    {
      name: "Hoang Van E",
      avatar: "/asian-male-university-student-portrait.jpg",
      ielts: "7.5",
      content:
        "Great for exam preparation. I improved my IELTS score significantly!",
      direction: "down",
      fullFeedback:
        "DailyEng's exam preparation materials are comprehensive and well-structured. The practice tests closely mimic the actual IELTS format, which helped me feel confident on test day. The detailed explanations for each answer taught me valuable strategies and techniques. The progress tracking feature allowed me to see my improvement over time, which was incredibly motivating. I particularly loved the writing feedback system that provided specific suggestions for improvement.",
      courses: [
        "IELTS Full Preparation",
        "Test Strategies",
        "Time Management Skills",
      ],
      result: { type: "IELTS", score: "7.5", previousScore: "6.0" },
      duration: "3 months",
      photo: "/learning.png",
    },
    {
      name: "Nguyen Thi F",
      avatar: "/asian-female-business-professional-portrait.jpg",
      ielts: "N/A",
      content: "TOEIC preparation on DailyEng helped me get promoted at work!",
      direction: "up",
      fullFeedback:
        "My company required a minimum TOEIC score for promotion, and DailyEng helped me exceed that requirement by a huge margin. The business English focus was exactly what I needed for my career. The listening practice with various accents prepared me well for the real test. The vocabulary specific to corporate settings has been useful in my daily work communications. Within 2 months, I went from 650 to 890, opening new doors in my career.",
      courses: ["TOEIC Complete", "Business Communication", "Email Writing"],
      result: { type: "TOEIC", score: "890", previousScore: "650" },
      duration: "2 months",
      photo: "/learning.png",
    },
  ];

  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex(
      (prev) => (prev - 1 + reviews.length) % reviews.length
    );
  };

  const partnerLogos = [
    { src: "/bc-logo.png", alt: "British Council" },
    { src: "/idp-logo.png", alt: "IDP" },
    { src: "/cambridge-logo.png", alt: "Cambridge" },
    { src: "/toefl-logo.png", alt: "TOEFL" },
    { src: "/ielts-logo.png", alt: "IELTS" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary-200 selection:text-primary-900">
      {/* Hero Section - Reduced padding to show logos above fold */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16">
        <InteractiveGridBackground
          rows={12}
          cols={20}
          className="z-0 opacity-80"
        />

        <div className="pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left">
              <RevealOnScroll className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary-100 shadow-sm cursor-pointer hover:bg-primary-100 transition-colors">
                <Sparkles className="w-4 h-4 fill-primary-400 text-primary-500" />
                <span>The #1 AI-Powered English Platform</span>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h1 className="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.1] tracking-tight text-gray-700">
                  Daily<span className="text-primary-500">Eng</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-6 leading-relaxed text-gray-500">
                  Master English the <br className="hidden lg:block" />
                  <span className="text-primary-500 font-semibold">
                    Smart & Fun Way!
                  </span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">
                  Stop memorizing lists. Start using the language. Practice with
                  real-world scenarios, AI tutors, and personalized roadmaps.
                </p>
              </RevealOnScroll>

              <RevealOnScroll
                delay={400}
                className="flex flex-col sm:flex-row gap-4 pointer-events-auto w-full sm:w-auto"
              >
                <Link
                  href="/auth/signup"
                  className="pointer-events-auto w-full sm:w-auto cursor-pointer"
                >
                  <Button
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto bg-primary-400 hover:bg-primary-500 text-white px-8 py-6 rounded-full text-lg font-bold border-2 border-primary-700 cursor-pointer"
                  >
                    Start Learning Free
                  </Button>
                </Link>
                <Link
                  href="/help"
                  className="pointer-events-auto w-full sm:w-auto cursor-pointer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-primary-200 text-primary-700 hover:border-primary-300 hover:bg-primary-50 px-8 py-6 rounded-full text-lg bg-transparent cursor-pointer"
                  >
                    How it works
                  </Button>
                </Link>
              </RevealOnScroll>

              <RevealOnScroll
                delay={500}
                className="mt-8 flex items-center gap-4 text-sm text-gray-500"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                    >
                      <Image
                        src={`/placeholder-user.jpg`}
                        width={32}
                        height={32}
                        alt="User"
                      />
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
              <div className="absolute -inset-4 bg-linear-to-r from-primary-100 to-secondary-100 rounded-full opacity-30 blur-3xl z-0" />
              <StackedCardBackground
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
      <section className="py-8 bg-background border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Prepared for success with
          </p>
        </div>

        <div className="relative flex overflow-hidden">
          {/* First set of logos */}
          <div className="flex animate-scroll-left whitespace-nowrap py-2">
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div
                key={`logo-1-${index}`}
                className="flex items-center justify-center mx-12 w-32 h-16 relative"
              >
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rating Card */}
            <RevealOnScroll>
              <Card className="bg-primary-500 text-white border-0 p-6 shadow-xl rounded-2xl relative overflow-hidden group transition-transform hover:scale-[1.02] h-full cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-primary-100 font-medium text-sm">
                      <Users className="w-4 h-4" />
                      <span>Our Community</span>
                    </div>
                    <div className="text-4xl font-bold mb-1 tracking-tighter">
                      100k+
                    </div>
                    <div className="text-primary-100 text-base mb-4">
                      active learners worldwide
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 w-fit border border-white/10">
                    <div className="flex -space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="h-6 w-px bg-white/20"></div>
                    <div>
                      <span className="font-bold text-base">4.9</span>
                      <span className="text-primary-100 text-xs ml-1">
                        / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </RevealOnScroll>

            {/* Quote Card */}
            <RevealOnScroll delay={200}>
              <Card className="bg-gray-50 border border-gray-200 p-6 shadow-lg rounded-2xl relative flex flex-col justify-center group hover:border-primary-200 transition-colors h-full cursor-pointer">
                <Quote className="absolute top-4 right-4 w-10 h-10 text-primary-100 -z-0 rotate-12" />
                <div className="relative z-10">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary-500 text-primary-500"
                      />
                    ))}
                  </div>
                  <p className="text-gray-900 text-lg font-medium leading-relaxed mb-6">
                    "This app completely changed how I prepare for my
                    interviews. The AI speaking partner feels incredibly
                    realistic."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      TT
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        Thanh Truc
                      </div>
                      <div className="text-primary-500 text-xs font-medium">
                        Software Engineer
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

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

      {/* Reviews Marquee Section */}
      <section className="py-24 bg-primary-50 overflow-hidden">
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-primary-900 mb-2">
              Learner Stories
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-medium text-primary-600">
                4.8/5 average rating
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex bg-white hover:bg-white cursor-pointer"
            onClick={() => setShowReviewsDialog(true)}
          >
            View all reviews
          </Button>
        </RevealOnScroll>

        <div className="relative w-full">
          {/* Fade masks for smooth scrolling edges */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-primary-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-primary-50 to-transparent z-10 pointer-events-none" />

          <div
            className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px] overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            }}
          >
            {/* Column 1 - Scroll Up */}
            <div className="space-y-6 animate-scroll-up hover:paused">
              {[...reviews, ...reviews].map((review, idx) => (
                <Card
                  key={`col1-${idx}`}
                  className="p-6 border-0 shadow-sm bg-white rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                      <Image
                        src={review.avatar || "/learning.png"}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        IELTS {review.ielts}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    "{review.content}"
                  </p>
                </Card>
              ))}
            </div>

            {/* Column 2 - Scroll Down */}
            <div className="space-y-6 animate-scroll-down hover:paused hidden md:block">
              {[...reviews.reverse(), ...reviews].map((review, idx) => (
                <Card
                  key={`col2-${idx}`}
                  className="p-6 border-0 shadow-sm bg-white rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full inline-block">
                        Verified Student
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    "{review.content}"
                  </p>
                </Card>
              ))}
            </div>
            {/* Column 3 - Scroll Up */}
            <div className="space-y-6 animate-scroll-up hover:paused hidden lg:block">
              {[...reviews, ...reviews].map((review, idx) => (
                <Card
                  key={`col3-${idx}`}
                  className="p-6 border-0 shadow-sm bg-white rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                >
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
                      <p className="font-semibold text-sm text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-xs text-gray-500">TOEFL 105</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    "{review.content}"
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Dialog */}
      <Dialog open={showReviewsDialog} onOpenChange={setShowReviewsDialog}>
        <DialogContent className="!max-w-[1400px] w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <div className="relative">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-10 py-6">
              <DialogTitle className="text-3xl font-bold text-gray-800">
                Learner Stories
              </DialogTitle>
              <p className="text-gray-500 text-base mt-1">
                Real success stories from our community
              </p>

              {/* Review navigation dots */}
              <div className="flex items-center gap-2 mt-4">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentReviewIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentReviewIndex
                        ? "bg-primary-500 w-8"
                        : "bg-gray-300 hover:bg-gray-400 w-2.5"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Review Card */}
            <div className="p-10">
              <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-3xl p-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                  {/* Left Column - Photo and Result (2 cols) */}
                  <div className="lg:col-span-2">
                    {/* Photo */}
                    <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-lg">
                      <Image
                        src={
                          reviews[currentReviewIndex].photo ||
                          "/placeholder.svg"
                        }
                        alt={`${reviews[currentReviewIndex].name}'s journey`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <Quote className="w-10 h-10 text-white/70" />
                        {/* Result badge on photo */}
                        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-gray-800">
                            {reviews[currentReviewIndex].result.type}:{" "}
                            {reviews[currentReviewIndex].result.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score improvement card */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                        Score Improvement
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Before</p>
                          <p className="text-2xl font-bold text-gray-400">
                            {reviews[currentReviewIndex].result.previousScore}
                          </p>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="h-2 bg-gray-200 rounded-full relative">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-400 to-primary-500 rounded-full"
                              style={{ width: "100%" }}
                            />
                            <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 text-primary-500" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">After</p>
                          <p className="text-2xl font-bold text-primary-500">
                            {reviews[currentReviewIndex].result.score}
                          </p>
                        </div>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-3">
                        Achieved in {reviews[currentReviewIndex].duration}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - User Info and Review (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col">
                    {/* Top section with avatar and basic info */}
                    <div className="flex items-start gap-5 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                          <Image
                            src={
                              reviews[currentReviewIndex].avatar ||
                              "/placeholder.svg"
                            }
                            alt={reviews[currentReviewIndex].name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-accent-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md">
                          Verified
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {reviews[currentReviewIndex].name}
                        </h3>
                        <p className="text-gray-500 text-base mt-1">
                          Studied for {reviews[currentReviewIndex].duration}
                        </p>

                        {/* Stars */}
                        <div className="flex gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Full feedback */}
                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm flex-1">
                      <Quote className="w-8 h-8 text-primary-200 mb-3" />
                      <p className="text-gray-700 leading-relaxed text-lg">
                        "{reviews[currentReviewIndex].fullFeedback}"
                      </p>
                    </div>

                    {/* Courses taken */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Courses Completed
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {reviews[currentReviewIndex].courses.map(
                          (course, idx) => (
                            <span
                              key={idx}
                              className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                            >
                              {course}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center px-10 py-6 border-t bg-white">
                <Button
                  variant="outline"
                  onClick={prevReview}
                  className="cursor-pointer bg-transparent px-6 py-5"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                <span className="text-gray-500 text-base font-medium">
                  {currentReviewIndex + 1} of {reviews.length}
                </span>

                <Button
                  onClick={nextReview}
                  className="bg-primary-500 hover:bg-primary-600 text-white cursor-pointer px-6 py-5"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Your English Level Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <Card className="relative overflow-hidden border-0 shadow-xl rounded-3xl bg-linear-to-r from-secondary-50 to-white cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 w-fit border border-secondary-100 cursor-pointer hover:bg-primary-100 transition-colors">
                    <GraduationCap className="w-4 h-4" />
                    <span>Free Assessment</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    Test Your English Level
                  </h2>

                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Discover your current proficiency with our comprehensive
                    placement test. Get personalized recommendations based on
                    your results.
                  </p>

                  <blockquote className="border-l-4 border-secondary-400 pl-4 mb-8 italic text-gray-500">
                    "Knowing where you stand is the first step to reaching where
                    you want to be."
                  </blockquote>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/placement-test" className="cursor-pointer">
                      <Button
                        size="lg"
                        className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg font-semibold group cursor-pointer"
                      >
                        Take the Test
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-accent-500" />
                      <span>Takes only 15 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative h-64 md:h-auto min-h-[300px] bg-primary-50">
                  <Image
                    src="/learning.png"
                    alt="English Level Test"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/20 to-transparent" />

                  {/* Floating badges */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="text-xs text-gray-500 font-medium">
                      CEFR Levels
                    </div>
                    <div className="text-lg font-bold text-secondary-600">
                      A1 - C2
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        50K+ tests taken
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </RevealOnScroll>
        </div>
      </section>

      {/* Build Study Plan Section */}
      <section className="py-24 bg-gradient-to-br from-primary-200 via-primary-100 to-accent-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium cursor-pointer">
                <Target className="w-4 h-4" />
                Personalized Learning
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Build Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                  Study Plan
                </span>
              </h2>

              <p className="text-lg text-gray-600 max-w-lg">
                Tell us about your goals, schedule, and preferences. We will
                create a customized learning roadmap designed specifically for
                your success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/build-plan">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg cursor-pointer"
                  >
                    Build My Plan
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full cursor-pointer bg-transparent border-primary-300 text-primary-600 hover:bg-primary-50"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">5 min</div>
                  <div className="text-sm text-gray-500">To complete</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">10+</div>
                  <div className="text-sm text-gray-500">Course matches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Personalized</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-primary-100">
                {/* Mock questionnaire preview */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Study Plan Builder
                      </div>
                      <div className="text-sm text-gray-500">
                        Question 1 of 10
                      </div>
                    </div>
                  </div>

                  <Progress value={10} className="h-2 [&>div]:bg-primary-500" />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      What is your primary goal?
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Pass IELTS/TOEFL exam",
                        "Improve for career",
                        "Travel confidently",
                        "Academic studies",
                      ].map((option, idx) => (
                        <div
                          key={option}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            idx === 0
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-primary-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                idx === 0
                                  ? "border-primary-500 bg-primary-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {idx === 0 && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span
                              className={
                                idx === 0
                                  ? "font-medium text-primary-700"
                                  : "text-gray-600"
                              }
                            >
                              {option}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-primary-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary-600">
          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(var(--primary-50) 2px, transparent 2px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <RevealOnScroll className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-white tracking-tight">
            Ready to speak English with confidence?
          </h2>
          <p className="text-xl text-primary-200 mb-12 max-w-2xl mx-auto">
            Join thousands of learners who are already improving their careers
            and lives with DailyEng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="cursor-pointer">
              <Button
                size="lg"
                variant="default"
                className="border-2 border-primary-700 bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-800 rounded-full px-10 py-7 text-lg font-bold sm:w-auto cursor-pointer"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/placement-test" className="cursor-pointer">
              <Button
                size="lg"
                variant="default"
                className="border-2 border-primary-700 text-white hover:bg-primary-700 hover:border-primary-800 bg-transparent rounded-full px-10 py-7 text-lg font-semibold w-full sm:w-auto cursor-pointer"
              >
                Take Placement Test
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary-200 opacity-80">
            No credit card required • Cancel anytime
          </p>
        </RevealOnScroll>
      </section>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
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
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
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
  );
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
  );
}
