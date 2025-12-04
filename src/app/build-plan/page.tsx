"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Clock,
  BookOpen,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  MessageCircle,
  Headphones,
  PenTool,
  Brain,
  Sparkles,
  Check,
  Star,
  X,
  Plane,
} from "lucide-react"; // Added Plane import
import Link from "next/link";
import Image from "next/image";

interface Question {
  id: number;
  question: string;
  // icon can be either a React component (ElementType) or a React node (JSX)
  icon?: React.ElementType | React.ReactNode;
  subtitle?: string;
  options: {
    id: string;
    value: string; // Changed from 'id' to 'value' for consistency
    label: string;
    icon?: React.ElementType | React.ReactNode;
    description?: string;
  }[];
  multiSelect?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  skills: string[];
  recommended?: boolean;
  matchScore?: number;
  lessons?: number; // Added lessons property
  match?: number; // Added match property
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is your primary goal for learning English?",
    icon: Briefcase, // Added icon
    subtitle: "This helps us recommend the most relevant courses for you",
    options: [
      {
        id: "career",
        value: "career", // Changed from 'id' to 'value'
        label: "Career Advancement",
        icon: <Briefcase className="w-5 h-5" />,
        description: "Get promoted, change jobs, or work internationally",
      },
      {
        id: "study",
        value: "study", // Changed from 'id' to 'value'
        label: "Academic Study",
        icon: <GraduationCap className="w-5 h-5" />,
        description: "Prepare for university or academic programs",
      },
      {
        id: "exam",
        value: "exam", // Changed from 'id' to 'value'
        label: "Pass an Exam",
        icon: Target, // Added icon
        description: "IELTS, TOEFL, TOEIC, or other certifications",
      },
      {
        id: "travel",
        value: "travel", // Changed from 'id' to 'value'
        label: "Travel & Culture",
        icon: Plane, // Added icon
        description: "Communicate while traveling abroad",
      },
      {
        id: "personal",
        value: "personal", // Changed from 'id' to 'value'
        label: "Personal Growth",
        icon: <Star className="w-5 h-5" />,
        description: "Self-improvement and intellectual curiosity",
      },
    ],
  },
  {
    id: 2,
    question: "Which exam are you preparing for? (if any)",
    icon: Target, // Added icon
    subtitle: "Select all that apply",
    multiSelect: true,
    options: [
      {
        id: "ielts",
        value: "ielts",
        label: "IELTS",
        description: "International English Language Testing System",
      },
      {
        id: "toefl",
        value: "toefl",
        label: "TOEFL",
        description: "Test of English as a Foreign Language",
      },
      {
        id: "toeic",
        value: "toeic",
        label: "TOEIC",
        description: "Test of English for International Communication",
      },
      {
        id: "cambridge",
        value: "cambridge",
        label: "Cambridge (FCE/CAE/CPE)",
        description: "Cambridge English Qualifications",
      },
      {
        id: "duolingo",
        value: "duolingo",
        label: "Duolingo English Test",
        description: "Modern adaptive English test",
      },
      {
        id: "none",
        value: "none",
        label: "No specific exam",
        description: "I'm not preparing for any exam",
      },
    ],
  },
  {
    id: 3,
    question: "How much time can you dedicate to learning each day?",
    icon: Clock, // Added icon
    options: [
      {
        id: "15min",
        value: "15min",
        label: "15 minutes",
        icon: <Clock className="w-5 h-5" />,
        description: "Quick daily practice",
      },
      {
        id: "30min",
        value: "30min", // Changed from 'id' to 'value'
        label: "30 minutes",
        icon: <Clock className="w-5 h-5" />,
        description: "Moderate daily commitment",
      },
      {
        id: "1hour",
        value: "1hour",
        label: "1 hour",
        icon: <Clock className="w-5 h-5" />,
        description: "Dedicated daily study",
      },
      {
        id: "2hours",
        value: "2hours", // Changed from 'id' to 'value'
        label: "2+ hours",
        icon: <Clock className="w-5 h-5" />,
        description: "Intensive learning schedule",
      },
    ],
  },
  {
    id: 4,
    question: "When do you need to achieve your goal?",
    icon: <span className="w-5 h-5">Calendar</span>, // Placeholder for Calendar icon
    options: [
      {
        id: "1month",
        value: "1month",
        label: "Within 1 month",
        description: "Urgent deadline approaching",
      },
      {
        id: "3months",
        value: "3months",
        label: "Within 3 months",
        description: "Short-term goal",
      },
      {
        id: "6months",
        value: "6months",
        label: "Within 6 months",
        description: "Medium-term planning",
      },
      {
        id: "1year",
        value: "1year",
        label: "Within 1 year",
        description: "Long-term commitment",
      },
      {
        id: "flexible",
        value: "flexible",
        label: "No specific deadline",
        description: "Learning at my own pace",
      },
    ],
  },
  {
    id: 5,
    question: "Which skills do you want to improve the most?",
    icon: Brain, // Added icon
    subtitle: "Select up to 3 skills",
    multiSelect: true,
    options: [
      {
        id: "speaking",
        value: "speaking", // Changed from 'id' to 'value'
        label: "Speaking",
        icon: <Users className="w-5 h-5" />,
        description: "Fluency, pronunciation, confidence",
      },
      {
        id: "listening",
        value: "listening", // Changed from 'id' to 'value'
        label: "Listening",
        icon: <Headphones className="w-5 h-5" />, // Changed icon
        description: "Understanding native speakers",
      },
      {
        id: "reading",
        value: "reading", // Changed from 'id' to 'value'
        label: "Reading",
        icon: <BookOpen className="w-5 h-5" />,
        description: "Comprehension and speed",
      },
      {
        id: "writing",
        value: "writing", // Changed from 'id' to 'value'
        label: "Writing",
        icon: <PenTool className="w-5 h-5" />, // Changed icon
        description: "Essays, emails, reports",
      },
      {
        id: "vocabulary",
        value: "vocabulary", // Changed from 'id' to 'value'
        label: "Vocabulary",
        icon: <Brain className="w-5 h-5" />, // Changed icon
        description: "Word knowledge and usage",
      },
      {
        id: "grammar",
        value: "grammar", // Changed from 'id' to 'value'
        label: "Grammar",
        icon: <BookOpen className="w-5 h-5" />,
        description: "Accuracy and structure",
      },
    ],
  },
  {
    id: 6,
    question: "What type of English do you need most?",
    icon: Globe, // Added icon
    options: [
      {
        id: "general",
        value: "general", // Changed from 'id' to 'value'
        label: "General English",
        icon: <Globe className="w-5 h-5" />,
        description: "Everyday communication",
      },
      {
        id: "business",
        value: "business", // Changed from 'id' to 'value'
        label: "Business English",
        icon: <Briefcase className="w-5 h-5" />,
        description: "Professional workplace communication",
      },
      {
        id: "academic",
        value: "academic", // Changed from 'id' to 'value'
        label: "Academic English",
        icon: <GraduationCap className="w-5 h-5" />,
        description: "University and research",
      },
      {
        id: "conversational",
        value: "conversational", // Changed from 'id' to 'value'
        label: "Conversational",
        icon: <MessageCircle className="w-5 h-5" />, // Changed icon
        description: "Casual daily conversations",
      },
    ],
  },
  {
    id: 7,
    question: "How do you prefer to learn?",
    icon: BookOpen, // Added icon
    subtitle: "Select all that apply",
    multiSelect: true,
    options: [
      {
        id: "video",
        value: "video",
        label: "Video Lessons",
        description: "Watch and learn from instructors",
      },
      {
        id: "interactive",
        value: "interactive",
        label: "Interactive Exercises",
        description: "Practice with quizzes and games",
      },
      {
        id: "conversation",
        value: "conversation",
        label: "AI Conversation Practice",
        description: "Talk with AI tutors",
      },
      {
        id: "reading",
        value: "reading",
        label: "Reading Materials",
        description: "Articles, stories, and texts",
      },
      {
        id: "flashcards",
        value: "flashcards",
        label: "Flashcards & Spaced Repetition",
        description: "Memorize vocabulary efficiently",
      },
    ],
  },
  {
    id: 8,
    question: "What topics interest you most?",
    icon: Star, // Added icon
    subtitle: "Select up to 4 topics",
    multiSelect: true,
    options: [
      {
        id: "tech",
        value: "tech",
        label: "Technology & Innovation",
        description: "AI, startups, digital trends",
      },
      {
        id: "business",
        value: "business",
        label: "Business & Finance",
        description: "Markets, economics, entrepreneurship",
      },
      {
        id: "science",
        value: "science",
        label: "Science & Nature",
        description: "Environment, health, discoveries",
      },
      {
        id: "culture",
        value: "culture",
        label: "Culture & Arts",
        description: "Movies, music, literature",
      },
      {
        id: "sports",
        value: "sports",
        label: "Sports & Fitness",
        description: "Athletics, wellness, competitions",
      },
      {
        id: "travel",
        value: "travel",
        label: "Travel & Lifestyle",
        description: "Food, fashion, destinations",
      },
    ],
  },
  {
    id: 9,
    question: "What challenges do you face when learning English?",
    icon: Target, // Added icon
    subtitle: "Select all that apply",
    multiSelect: true,
    options: [
      {
        id: "motivation",
        value: "motivation",
        label: "Staying Motivated",
        description: "Hard to maintain consistency",
      },
      {
        id: "speaking-fear",
        value: "speaking-fear",
        label: "Fear of Speaking",
        description: "Nervous to speak with others",
      },
      {
        id: "vocabulary",
        value: "vocabulary",
        label: "Remembering Vocabulary",
        description: "Words don't stick",
      },
      {
        id: "grammar",
        value: "grammar",
        label: "Understanding Grammar",
        description: "Rules are confusing",
      },
      {
        id: "listening",
        value: "listening",
        label: "Understanding Native Speakers",
        description: "They speak too fast",
      },
      {
        id: "time",
        value: "time",
        label: "Finding Time",
        description: "Busy schedule",
      },
    ],
  },
  {
    id: 10,
    question: "What motivates you to keep learning?",
    icon: Star, // Added icon
    subtitle: "Select your top motivators",
    multiSelect: true,
    options: [
      {
        id: "progress",
        value: "progress",
        label: "Seeing Progress",
        description: "Tracking improvements motivates me",
      },
      {
        id: "rewards",
        value: "rewards",
        label: "Rewards & Achievements",
        description: "Badges, points, and milestones",
      },
      {
        id: "community",
        value: "community",
        label: "Community & Competition",
        description: "Learning with others",
      },
      {
        id: "practical",
        value: "practical",
        label: "Real-world Application",
        description: "Using English in daily life",
      },
      {
        id: "goals",
        value: "goals",
        label: "Clear Goals",
        description: "Working towards specific targets",
      },
      {
        id: "fun",
        value: "fun",
        label: "Fun & Engaging Content",
        description: "Enjoying the learning process",
      },
    ],
  },
];

const allCourses: Course[] = [
  {
    id: "ielts-complete",
    title: "IELTS Complete Preparation",
    description:
      "Comprehensive IELTS preparation covering all four skills with practice tests and expert strategies.",
    duration: "12 weeks",
    level: "Intermediate - Advanced",
    category: "Exam Prep",
    image: "/learning.png",
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    lessons: 50, // Added lessons
    match: 90, // Added match
  },
  {
    id: "toeic-intensive",
    title: "TOEIC Intensive Course",
    description:
      "Master the TOEIC test with focused practice on Listening and Reading sections.",
    duration: "8 weeks",
    level: "Intermediate",
    category: "Exam Prep",
    image: "/learning.png",
    skills: ["Listening", "Reading", "Vocabulary"],
    lessons: 40, // Added lessons
    match: 85, // Added match
  },
  {
    id: "business-english",
    title: "Business English Mastery",
    description:
      "Professional communication skills for the workplace including meetings, presentations, and emails.",
    duration: "10 weeks",
    level: "Intermediate - Advanced",
    category: "Business",
    image: "/learning.png",
    skills: ["Speaking", "Writing", "Vocabulary"],
    lessons: 45, // Added lessons
    match: 80, // Added match
  },
  {
    id: "speaking-confidence",
    title: "Speaking with Confidence",
    description:
      "Overcome speaking anxiety and develop fluency through AI conversation practice.",
    duration: "6 weeks",
    level: "All Levels",
    category: "Speaking",
    image: "/learning.png",
    skills: ["Speaking", "Pronunciation", "Fluency"],
    lessons: 30, // Added lessons
    match: 95, // Added match
  },
  {
    id: "academic-writing",
    title: "Academic Writing Excellence",
    description:
      "Master academic essay writing, research papers, and formal writing conventions.",
    duration: "8 weeks",
    level: "Intermediate - Advanced",
    category: "Academic",
    image: "/learning.png",
    skills: ["Writing", "Grammar", "Vocabulary"],
    lessons: 40, // Added lessons
    match: 75, // Added match
  },
  {
    id: "vocabulary-builder",
    title: "Vocabulary Builder Pro",
    description:
      "Expand your vocabulary with spaced repetition and contextual learning.",
    duration: "Ongoing",
    level: "All Levels",
    category: "Vocabulary",
    image: "/learning.png",
    skills: ["Vocabulary", "Reading"],
    lessons: 60, // Added lessons
    match: 88, // Added match
  },
  {
    id: "grammar-foundations",
    title: "Grammar Foundations",
    description:
      "Build a solid grammar foundation from basic to advanced structures.",
    duration: "10 weeks",
    level: "Beginner - Intermediate",
    category: "Grammar",
    image: "/learning.png",
    skills: ["Grammar", "Writing"],
    lessons: 50, // Added lessons
    match: 82, // Added match
  },
  {
    id: "listening-mastery",
    title: "Listening Mastery",
    description:
      "Understand native speakers with diverse accents through authentic materials.",
    duration: "8 weeks",
    level: "Intermediate",
    category: "Listening",
    image: "/learning.png",
    skills: ["Listening", "Vocabulary"],
    lessons: 40, // Added lessons
    match: 78, // Added match
  },
  {
    id: "toefl-prep",
    title: "TOEFL iBT Preparation",
    description:
      "Complete preparation for the TOEFL iBT test with strategies and practice.",
    duration: "10 weeks",
    level: "Intermediate - Advanced",
    category: "Exam Prep",
    image: "/learning.png",
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    lessons: 55, // Added lessons
    match: 92, // Added match
  },
  {
    id: "conversation-daily",
    title: "Daily Conversation Practice",
    description:
      "Practice everyday conversations with AI tutors on various topics.",
    duration: "Ongoing",
    level: "All Levels",
    category: "Speaking",
    image: "/learning.png",
    skills: ["Speaking", "Listening", "Fluency"],
    lessons: 70, // Added lessons
    match: 88, // Added match
  },
  {
    id: "reading-speed",
    title: "Speed Reading & Comprehension",
    description:
      "Improve reading speed while maintaining comprehension with diverse texts.",
    duration: "6 weeks",
    level: "Intermediate",
    category: "Reading",
    image: "/learning.png",
    skills: ["Reading", "Vocabulary"],
    lessons: 35, // Added lessons
    match: 70, // Added match
  },
  {
    id: "pronunciation-perfect",
    title: "Perfect Pronunciation",
    description:
      "Master English pronunciation with AI-powered feedback and practice.",
    duration: "6 weeks",
    level: "All Levels",
    category: "Speaking",
    image: "/learning.png",
    skills: ["Pronunciation", "Speaking"],
    lessons: 30, // Added lessons
    match: 85, // Added match
  },
];

export default function BuildPlanPage() {
  const [stage, setStage] = useState<"intro" | "questions" | "results">(
    "intro"
  ); // Renamed from currentStep to stage
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [otherCourses, setOtherCourses] = useState<Course[]>([]);

  // Intro Screen
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Close button */}
        <div className="absolute top-6 right-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8 cursor-pointer">
              <Sparkles className="w-4 h-4" />
              Personalized Learning Path
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Let's Build Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400 pt-2.5">
                Perfect Study Plan
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-12">
              Answer 10 quick questions about your goals, schedule, and
              preferences. We'll create a customized learning roadmap just for
              you.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Clock,
                  title: "5 Minutes",
                  desc: "Quick questionnaire",
                },
                {
                  icon: Target,
                  title: "Personalized",
                  desc: "Tailored to your goals",
                },
                {
                  icon: BookOpen,
                  title: "10+ Courses",
                  desc: "Matched for you",
                },
              ].map((feature, idx) => (
                <Card
                  key={idx}
                  className="p-6 border border-primary-200 bg-white/80 backdrop-blur-sm cursor-pointer hover:border-primary-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setStage("questions")}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Building My Plan
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Questions Stage
  if (stage === "questions") {
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const currentAnswers = answers[currentQ?.id] || []; // Kept from original

    const handleSelectOption = (
      questionId: number,
      optionValue: string,
      multiSelect?: boolean
    ) => {
      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];

        if (multiSelect) {
          if (currentAnswers.includes(optionValue)) {
            return {
              ...prev,
              [questionId]: currentAnswers.filter((id) => id !== optionValue),
            };
          } else {
            return { ...prev, [questionId]: [...currentAnswers, optionValue] };
          }
        } else {
          return { ...prev, [questionId]: [optionValue] };
        }
      });
    };

    const handleAnswer = (questionId: number, optionValue: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [optionValue], // Assuming single select for now based on the new structure
      }));
    };

    const handleNext = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        generateRecommendations();
        setStage("results");
      }
    };

    const handlePrevious = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1);
      }
    };

    const generateRecommendations = () => {
      // Score each course based on user answers
      const scoredCourses = allCourses.map((course) => {
        let score = 0;

        // Goal matching (Q1)
        const goals = answers[1] || [];
        if (goals.includes("exam") && course.category === "Exam Prep")
          score += 30;
        if (
          goals.includes("career") &&
          (course.category === "Business" || course.id === "toeic-intensive")
        )
          score += 25;
        if (
          goals.includes("study") &&
          (course.category === "Academic" || course.category === "Exam Prep")
        )
          score += 25;

        // Exam matching (Q2)
        const exams = answers[2] || [];
        if (exams.includes("ielts") && course.id.includes("ielts")) score += 40;
        if (exams.includes("toefl") && course.id.includes("toefl")) score += 40;
        if (exams.includes("toeic") && course.id.includes("toeic")) score += 40;

        // Skills matching (Q5)
        const skills = answers[5] || [];
        skills.forEach((skill) => {
          if (course.skills.map((s) => s.toLowerCase()).includes(skill))
            score += 15;
        });

        // English type matching (Q6)
        const englishType = answers[6] || [];
        if (englishType.includes("business") && course.category === "Business")
          score += 20;
        if (englishType.includes("academic") && course.category === "Academic")
          score += 20;
        if (
          englishType.includes("conversational") &&
          course.category === "Speaking"
        )
          score += 20;

        // Challenges matching (Q9)
        const challenges = answers[9] || [];
        if (
          challenges.includes("speaking-fear") &&
          course.category === "Speaking"
        )
          score += 15;
        if (
          challenges.includes("vocabulary") &&
          course.id.includes("vocabulary")
        )
          score += 15;
        if (challenges.includes("grammar") && course.id.includes("grammar"))
          score += 15;
        if (challenges.includes("listening") && course.id.includes("listening"))
          score += 15;

        // Calculate match percentage
        const calculatedMatchScore = Math.min(
          Math.round((score / 200) * 100),
          100
        ); // Normalize score to a percentage, max 200 points

        return {
          ...course,
          matchScore: score,
          match: calculatedMatchScore,
          recommended: calculatedMatchScore >= 60,
        }; // Changed threshold to 60%
      });

      // Sort by score
      const sorted = scoredCourses.sort(
        (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
      );

      // Split into recommended and others
      const recommended = sorted.filter((c) => c.recommended).slice(0, 3); // Reduced to 3 recommended courses
      const others = sorted.filter(
        (c) => !c.recommended || !recommended.includes(c)
      );

      setRecommendedCourses(
        recommended.length > 0 ? recommended : sorted.slice(0, 3)
      );
      setOtherCourses(others);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Header */}
        <div className="border-b border-primary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="gap-2 cursor-pointer hover:bg-primary_50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Exit
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-bprimary-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary-500" />
                </div>
                <span className="font-semibold text-slate-900">
                  Study Plan Builder
                </span>
              </div>
              <div className="text-sm text-slate-500">
                {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Progress value={progress} className="h-2 [&>div]:bg-primary-400" />
        </div>

        {/* Question Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="text-center mb-8">
            {/* <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {React.isValidElement(currentQ.icon)
                ? currentQ.icon
                : currentQ.icon
                  ? // Render component-type icons (e.g. Lucide components) and pass default styling
                    (() => {
                      const Icon = currentQ.icon as React.ElementType
                      return <Icon className="w-8 h-8 text-primary-500" />
                    })()
                  : null}
            </div> */}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 pb-3">
              {currentQ.question}
            </h2>
            {currentQ.subtitle && (
              <p className="text-slate-500">{currentQ.subtitle}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 mb-12">
            {currentQ.options.map((option) => {
              const isSelected = currentAnswers.includes(option.value); // Changed from answers[currentQ.id] === option.value
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    handleSelectOption(
                      currentQ.id,
                      option.value,
                      currentQ.multiSelect
                    )
                  } // Changed handler
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 shadow-md"
                      : "border-slate-200 hover:border-primary-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "border-primary-700 bg-primary-700"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${
                          isSelected ? "text-primary-700" : "text-slate-900"
                        }`}
                      >
                        {option.label}
                      </div>
                      {option.description && ( // Changed from option.desc
                        <div className="text-sm text-slate-500 mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="gap-2 cursor-pointer bg-transparent hover:bg-primary-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentAnswers.length === 0} // Changed from !answers[currentQ.id]
              className="gap-2 cursor-pointer bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600"
            >
              {currentQuestion === questions.length - 1
                ? "See My Courses"
                : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Stage
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plan Generated Successfully
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Your Personalized Study Plan is Ready!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Based on your answers, we've selected the best courses to help you
            achieve your goals.
          </p>
        </div>

        {/* Recommended Courses */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary-500" />
            Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden border-2 border-primary-200 hover:border-primary-300 transition-all hover:shadow-lg"
              >
                <div className="relative h-40">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {course.matchScore}% Match
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                    <span className="mx-1">•</span>
                    {course.level}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs bg-transparent"
                    >
                      View Course
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      Add to Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Other Courses */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Other Courses You Might Like
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherCourses.map((course) => (
              <Card
                key={course.id}
                className="p-4 hover:shadow-md transition-all border border-slate-200"
              >
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 mb-1 truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      {course.duration}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs px-2 text-primary-600 bg-primary-100"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs px-2 text-primary-600"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/plan">
            <Button
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8"
            >
              Go to My Study Plan
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setStage("intro");
              setCurrentQuestion(0);
              setAnswers({});
            }}
          >
            Retake Questionnaire
          </Button>
        </div>
      </div>
    </div>
  );
}
