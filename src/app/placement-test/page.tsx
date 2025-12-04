"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Headphones,
  MessageSquare,
  PenTool,
  BookMarked,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  PlayCircle,
  Volume2,
  Mic,
  MicOff,
  Home,
  Trophy,
  Target,
  TrendingUp,
  Award,
  RotateCcw,
  Highlighter,
  Lightbulb,
  ChevronRight,
  FileTextIcon,
  CheckCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Test steps in order
const TEST_STEPS = [
  {
    id: "vocabulary",
    label: "Vocabulary",
    icon: BookMarked,
    color: "accent",
    description: "Test your word knowledge",
  },
  {
    id: "grammar",
    label: "Grammar",
    icon: BookOpen,
    color: "primary",
    description: "Assess grammar understanding",
  },
  {
    id: "reading",
    label: "Reading",
    icon: FileTextIcon,
    color: "warning",
    description: "Reading comprehension",
  },
  {
    id: "listening",
    label: "Listening",
    icon: Headphones,
    color: "info",
    description: "Test listening skills",
  },
  {
    id: "speaking",
    label: "Speaking",
    icon: MessageSquare,
    color: "secondary",
    description: "Assess speaking ability",
  },
  {
    id: "writing",
    label: "Writing",
    icon: PenTool,
    color: "primary",
    description: "Evaluate writing skills",
  },
];

// Mock questions for each test
const mockQuestions: Record<
  string,
  Array<{
    id: number;
    type:
      | "multiple-choice"
      | "fill-blank"
      | "reading"
      | "listening"
      | "speaking"
      | "writing";
    question: string;
    options?: string[];
    correctAnswer?: number | string;
    passage?: string;
    prompt?: string;
    hint?: string;
  }>
> = {
  vocabulary: [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the synonym of 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Choose the correct word: 'The weather is ___ today.'",
      options: ["beauty", "beautiful", "beautifully", "beautify"],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "What does 'ubiquitous' mean?",
      options: ["Rare", "Present everywhere", "Ancient", "Modern"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "multiple-choice",
      question: "Select the antonym of 'generous':",
      options: ["Kind", "Selfish", "Wealthy", "Poor"],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "Which word means 'to make something better'?",
      options: ["Worsen", "Improve", "Destroy", "Ignore"],
      correctAnswer: 1,
    },
    {
      id: 6,
      type: "fill-blank",
      question: "Complete: 'She has a great ___ for music.'",
      correctAnswer: "talent",
    },
    {
      id: 7,
      type: "multiple-choice",
      question: "What is the meaning of 'inevitable'?",
      options: ["Avoidable", "Certain to happen", "Unlikely", "Impossible"],
      correctAnswer: 1,
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Choose the correct definition of 'pragmatic':",
      options: ["Idealistic", "Practical", "Romantic", "Theoretical"],
      correctAnswer: 1,
    },
  ],
  grammar: [
    {
      id: 1,
      type: "multiple-choice",
      question: "Choose the correct form: 'She ___ to school every day.'",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Select the correct sentence:",
      options: [
        "He don't like coffee",
        "He doesn't likes coffee",
        "He doesn't like coffee",
        "He not like coffee",
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "Which is correct? 'I have been waiting ___ two hours.'",
      options: ["since", "for", "from", "during"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "multiple-choice",
      question:
        "Choose the correct past tense: 'Yesterday, I ___ a great movie.'",
      options: ["watch", "watched", "watching", "watches"],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "multiple-choice",
      question:
        "Select the correct conditional: 'If I ___ rich, I would travel.'",
      options: ["am", "was", "were", "be"],
      correctAnswer: 2,
    },
    {
      id: 6,
      type: "multiple-choice",
      question: "Which uses present perfect correctly?",
      options: [
        "I have see that",
        "I have saw that",
        "I have seen that",
        "I seen that",
      ],
      correctAnswer: 2,
    },
    {
      id: 7,
      type: "multiple-choice",
      question:
        "Choose the correct article: '___ apple a day keeps the doctor away.'",
      options: ["A", "An", "The", "No article"],
      correctAnswer: 1,
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Select the correct passive: 'The cake ___ by my mother.'",
      options: ["baked", "was baked", "is bake", "baking"],
      correctAnswer: 1,
    },
  ],
  reading: [
    {
      id: 1,
      type: "reading",
      passage:
        "Climate change is one of the most pressing issues of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary cause.",
      question:
        "What is the main cause of climate change according to the passage?",
      options: [
        "Natural cycles",
        "Human activities",
        "Solar radiation",
        "Volcanic eruptions",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "reading",
      passage:
        "The invention of the printing press by Gutenberg in the 15th century revolutionized information spread. Before this, books were copied by hand, making them expensive and rare. The press made books cheaper and more accessible, increasing literacy rates.",
      question: "What was the main effect of the printing press?",
      options: [
        "Books became expensive",
        "Literacy rates increased",
        "Books were for wealthy",
        "Information spread slowly",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "reading",
      passage:
        "Sleep is essential for good health. During sleep, the body repairs tissues, consolidates memories, and releases growth hormones. Adults typically need 7-9 hours per night. Lack of sleep can lead to obesity, heart disease, and decreased cognitive function.",
      question: "How many hours of sleep do adults typically need?",
      options: ["5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "reading",
      passage:
        "The Great Barrier Reef, off Australia's coast, is the world's largest coral reef system stretching over 2,300 kilometers. It's home to thousands of marine species but is threatened by climate change, pollution, and overfishing.",
      question: "Where is the Great Barrier Reef located?",
      options: [
        "Caribbean Sea",
        "Mediterranean",
        "Off Australia",
        "Pacific Islands",
      ],
      correctAnswer: 2,
    },
  ],
  listening: [
    {
      id: 1,
      type: "listening",
      question: "What time does the train depart?",
      options: ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "listening",
      question: "Where is the meeting being held?",
      options: [
        "Conference Room A",
        "Conference Room B",
        "Main Hall",
        "Office 201",
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      type: "listening",
      question: "What does the speaker recommend?",
      options: [
        "Taking a break",
        "Working harder",
        "Changing jobs",
        "Getting more sleep",
      ],
      correctAnswer: 3,
    },
    {
      id: 4,
      type: "listening",
      question: "How much does the item cost?",
      options: ["$15", "$25", "$35", "$45"],
      correctAnswer: 2,
    },
  ],
  speaking: [
    {
      id: 1,
      type: "speaking",
      prompt: "Introduce yourself and talk about your hobbies.",
      question: "Record your response (1-2 minutes)",
    },
    {
      id: 2,
      type: "speaking",
      prompt: "Describe your favorite place to visit and explain why.",
      question: "Record your response (1-2 minutes)",
    },
    {
      id: 3,
      type: "speaking",
      prompt: "Discuss the advantages and disadvantages of social media.",
      question: "Record your response (2-3 minutes)",
    },
  ],
  writing: [
    {
      id: 1,
      type: "writing",
      prompt:
        "Write a short paragraph (50-100 words) about your daily routine.",
      question: "Describe your typical day from morning to evening.",
    },
    {
      id: 2,
      type: "writing",
      prompt:
        "Write an email (100-150 words) inviting a friend to your birthday party.",
      question: "Include date, time, location, and special instructions.",
    },
    {
      id: 3,
      type: "writing",
      prompt:
        "Write a short essay (150-200 words) about learning a foreign language.",
      question: "Discuss at least two benefits of being bilingual.",
    },
  ],
};

const calculateCEFRLevel = (
  score: number
): { level: string; description: string; color: string } => {
  if (score >= 90)
    return {
      level: "C2",
      description: "Proficient - Mastery",
      color: "text-success-600",
    };
  if (score >= 80)
    return {
      level: "C1",
      description: "Proficient - Advanced",
      color: "text-primary-600",
    };
  if (score >= 70)
    return {
      level: "B2",
      description: "Independent - Upper Intermediate",
      color: "text-info-600",
    };
  if (score >= 55)
    return {
      level: "B1",
      description: "Independent - Intermediate",
      color: "text-warning-600",
    };
  if (score >= 40)
    return {
      level: "A2",
      description: "Basic - Elementary",
      color: "text-warning-500",
    };
  return {
    level: "A1",
    description: "Basic - Beginner",
    color: "text-secondary-600",
  };
};

export default function PlacementTestPage() {
  // Test state
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const [testScores, setTestScores] = useState<Record<string, number>>({});
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(
    null
  );
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [writingAnswer, setWritingAnswer] = useState("");
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Show feedback page after each test
  const [showTestFeedback, setShowTestFeedback] = useState(false);
  const [feedbackTestId, setFeedbackTestId] = useState<string | null>(null);
  const [feedbackAnswers, setFeedbackAnswers] = useState<
    Record<number, number | string>
  >({});
  const [feedbackReadingAnswers, setFeedbackReadingAnswers] = useState<
    Record<number, number>
  >({});

  // Reading test state
  const [readingHighlights, setReadingHighlights] = useState<
    Array<{
      start: number;
      end: number;
      color: "green" | "red";
      type: "user" | "hint";
    }>
  >([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [readingHints, setReadingHints] = useState<Record<number, boolean>>({});
  const [showReadingHint, setShowReadingHint] = useState(false);
  const [currentReadingQuestion, setCurrentReadingQuestion] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>(
    {}
  );
  const [checkedReadingQuestions, setCheckedReadingQuestions] = useState<
    Set<number>
  >(new Set());
  const passageRef = useRef<HTMLDivElement>(null);

  const readingPassage = {
    title: "The Future of Renewable Energy",
    content: `The global transition to renewable energy sources has accelerated dramatically in recent years. Solar and wind power have become increasingly cost-competitive with traditional fossil fuels, leading many countries to revise their energy policies.

In 2023, renewable energy accounted for nearly 30% of global electricity generation, a significant increase from just 20% a decade earlier. This growth has been driven by technological improvements, government incentives, and growing public awareness of climate change.

Solar energy, in particular, has seen remarkable advances. The efficiency of photovoltaic cells has improved substantially, while manufacturing costs have decreased by over 80% since 2010. Many experts predict that solar power will become the cheapest source of electricity in most countries within the next decade.

Wind power has also experienced significant growth. Offshore wind farms, which can generate electricity more consistently due to stronger and more reliable winds at sea, have become increasingly popular in Europe and Asia. The United Kingdom, for example, now generates over 10% of its electricity from offshore wind.

However, the transition to renewable energy is not without challenges. The intermittent nature of solar and wind power requires significant investment in energy storage solutions. Battery technology has improved, but large-scale storage remains expensive. Grid infrastructure also needs substantial upgrades to handle the variable output of renewable sources.

Despite these challenges, the momentum toward renewable energy appears unstoppable. Major corporations, cities, and even entire nations have committed to achieving carbon neutrality by 2050 or earlier. This shift represents not just an environmental imperative but also an economic opportunity, with millions of jobs being created in the renewable energy sector worldwide.`,
    questions: [
      {
        question:
          "According to the passage, what percentage of global electricity was generated by renewable energy in 2023?",
        options: ["20%", "25%", "Nearly 30%", "35%"],
        correctAnswer: 2,
        explanation:
          "The passage states that 'In 2023, renewable energy accounted for nearly 30% of global electricity generation.'",
      },
      {
        question: "What has contributed to the decrease in solar energy costs?",
        options: [
          "Government regulations",
          "Improved efficiency and reduced manufacturing costs",
          "Increased fossil fuel prices",
          "International trade agreements",
        ],
        correctAnswer: 1,
        explanation:
          "The passage mentions that 'The efficiency of photovoltaic cells has improved substantially, while manufacturing costs have decreased by over 80% since 2010.'",
      },
      {
        question: "Why have offshore wind farms become popular?",
        options: [
          "They are cheaper to build",
          "They generate electricity more consistently",
          "They require less maintenance",
          "They are closer to cities",
        ],
        correctAnswer: 1,
        explanation:
          "The passage explains that offshore wind farms 'can generate electricity more consistently due to stronger and more reliable winds at sea.'",
      },
      {
        question:
          "What is mentioned as a major challenge for renewable energy?",
        options: [
          "Lack of public support",
          "High cost of solar panels",
          "The intermittent nature of solar and wind power",
          "Shortage of skilled workers",
        ],
        correctAnswer: 2,
        explanation:
          "The passage states that 'The intermittent nature of solar and wind power requires significant investment in energy storage solutions.'",
      },
      {
        question:
          "What does the passage suggest about the future of renewable energy?",
        options: [
          "It will likely fail due to high costs",
          "Only developed countries will adopt it",
          "The momentum toward it appears unstoppable",
          "It will remain a minor energy source",
        ],
        correctAnswer: 2,
        explanation:
          "The passage concludes that 'the momentum toward renewable energy appears unstoppable' with many commitments to carbon neutrality.",
      },
    ],
  };

  // Check if step is unlocked
  const isStepUnlocked = (stepId: string) => {
    const stepIndex = TEST_STEPS.findIndex((s) => s.id === stepId);
    if (stepIndex === 0) return true;
    const prevStep = TEST_STEPS[stepIndex - 1];
    return completedTests.includes(prevStep.id);
  };

  // Check if step is completed
  const isStepCompleted = (stepId: string) => completedTests.includes(stepId);

  // Get active step index
  const activeStepIndex = TEST_STEPS.findIndex((s) => s.id === activeTestId);

  // Calculate overall progress
  const overallProgress = Math.round(
    (completedTests.length / TEST_STEPS.length) * 100
  );

  // Calculate overall score
  const calculateOverallScore = () => {
    if (completedTests.length === 0) return 0;
    const total = Object.values(testScores).reduce((a, b) => a + b, 0);
    return Math.round(total / completedTests.length);
  };

  // Handle starting a test
  const handleStartTest = (testId: string) => {
    if (!isStepUnlocked(testId)) return;
    setActiveTestId(testId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setWritingAnswer("");
    setFillBlankAnswer("");
    if (testId === "reading") {
      setCurrentReadingQuestion(0);
      setReadingAnswers({});
      setCheckedReadingQuestions(new Set());
      setReadingHighlights([]);
      setIsHighlightMode(false);
      setShowReadingHint(false);
      setReadingHints({});
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (answer: number | string) => {
    setSelectedAnswer(answer);
  };

  // Handle next question
  const handleNextQuestion = () => {
    const questions = mockQuestions[activeTestId!];
    const currentQ = questions[currentQuestion];

    let answerToSave: number | string | null = selectedAnswer;
    if (currentQ.type === "fill-blank") answerToSave = fillBlankAnswer;
    if (currentQ.type === "writing") answerToSave = writingAnswer;
    if (currentQ.type === "speaking" && isRecording) answerToSave = "recorded";

    if (answerToSave !== null && answerToSave !== "") {
      const newAnswers = { ...answers, [currentQuestion]: answerToSave };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWritingAnswer("");
        setFillBlankAnswer("");
      } else {
        let correct = 0;
        Object.entries(newAnswers).forEach(([qIdx, ans]) => {
          const q = questions[Number(qIdx)];
          if (q.correctAnswer !== undefined && ans === q.correctAnswer) {
            correct++;
          } else if (q.type === "speaking" || q.type === "writing") {
            correct += 0.7;
          } else if (
            q.type === "fill-blank" &&
            typeof q.correctAnswer === "string"
          ) {
            if (
              String(ans).toLowerCase().trim() === q.correctAnswer.toLowerCase()
            ) {
              correct++;
            }
          }
        });
        const score = Math.round((correct / questions.length) * 100);

        setTestScores((prev) => ({ ...prev, [activeTestId!]: score }));

        setFeedbackTestId(activeTestId);
        setFeedbackAnswers(newAnswers);
        setShowTestFeedback(true);
        setActiveTestId(null);
      }
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  // Toggle recording for speaking
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setSelectedAnswer("recorded");
      }, 3000);
    }
  };

  // Play audio for listening
  const playAudio = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  // Restart test
  const handleRestartTest = () => {
    setCompletedTests([]);
    setTestScores({});
    setActiveTestId(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setCurrentReadingQuestion(0);
    setReadingAnswers({});
    setCheckedReadingQuestions(new Set());
    setReadingHighlights([]);
    setIsHighlightMode(false);
    setShowReadingHint(false);
    setReadingHints({});
  };

  // Submit test (used for reading test completion)
  const handleSubmitTest = () => {
    if (activeTestId === "reading") {
      let correct = 0;
      readingPassage.questions.forEach((_, idx) => {
        if (
          readingAnswers[idx] === readingPassage.questions[idx].correctAnswer
        ) {
          correct++;
        }
      });
      const score = Math.round(
        (correct / readingPassage.questions.length) * 100
      );

      setTestScores((prev) => ({ ...prev, [activeTestId]: score }));

      setFeedbackTestId(activeTestId);
      setFeedbackReadingAnswers(readingAnswers);
      setShowTestFeedback(true);
      setActiveTestId(null);
    }
  };

  // Function to continue to next test after viewing feedback
  const handleContinueFromFeedback = () => {
    if (feedbackTestId) {
      setCompletedTests((prev) => [...prev, feedbackTestId]);

      const newCompleted = [...completedTests, feedbackTestId];
      if (newCompleted.length === TEST_STEPS.length) {
        setShowResults(true);
      }
    }

    setShowTestFeedback(false);
    setFeedbackTestId(null);
    setFeedbackAnswers({});
    setFeedbackReadingAnswers({});
    setAnswers({});
    setReadingAnswers({});
    setCurrentQuestion(0);
    setSelectedAnswer(null);
  };

  const renderTestFeedback = () => {
    if (!feedbackTestId) return null;

    const testInfo = TEST_STEPS.find((t) => t.id === feedbackTestId);
    const score = testScores[feedbackTestId] || 0;
    const isReadingTest = feedbackTestId === "reading";

    const questions = isReadingTest
      ? readingPassage.questions
      : mockQuestions[feedbackTestId];
    const userAnswers = isReadingTest
      ? feedbackReadingAnswers
      : feedbackAnswers;

    let correctCount = 0;
    questions.forEach((q: any, idx: number) => {
      const userAnswer = userAnswers[idx];
      if (isReadingTest) {
        if (userAnswer === q.correctAnswer) correctCount++;
      } else {
        if (q.correctAnswer !== undefined && userAnswer === q.correctAnswer) {
          correctCount++;
        } else if (
          q.type === "fill-blank" &&
          typeof q.correctAnswer === "string"
        ) {
          if (
            String(userAnswer).toLowerCase().trim() ===
            q.correctAnswer.toLowerCase()
          ) {
            correctCount++;
          }
        }
      }
    });

    const getPerformanceLevel = (score: number) => {
      if (score >= 90)
        return {
          label: "Excellent",
          color: "text-success-600",
          bg: "bg-success-50",
          border: "border-success-200",
        };
      if (score >= 70)
        return {
          label: "Good",
          color: "text-primary-600",
          bg: "bg-primary-50",
          border: "border-primary-200",
        };
      if (score >= 50)
        return {
          label: "Average",
          color: "text-warning-600",
          bg: "bg-warning-50",
          border: "border-warning-200",
        };
      return {
        label: "Needs Improvement",
        color: "text-error-600",
        bg: "bg-error-50",
        border: "border-error-200",
      };
    };
    const performance = getPerformanceLevel(score);

    const getFeedback = (q: any, userAnswer: any, isCorrect: boolean) => {
      if (q.type === "speaking") {
        return "Your speaking response has been recorded. Focus on pronunciation, fluency, and coherence.";
      }
      if (q.type === "writing") {
        return "Your writing has been evaluated. Consider grammar, vocabulary range, and coherence in your response.";
      }
      if (isCorrect) {
        return "Correct! Well done.";
      }
      if (q.hint) {
        return `Incorrect. Hint: ${q.hint}`;
      }
      return "Incorrect. Review this topic for better understanding.";
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div
              className={`${performance.bg} ${performance.border} border-b px-6 py-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${performance.bg} ${performance.border} border-2 flex items-center justify-center`}
                  >
                    {testInfo && (
                      <testInfo.icon
                        className={`w-6 h-6 ${performance.color}`}
                      />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      {testInfo?.label} Test - Results
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {questions.length} questions completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${performance.color}`}>
                    {score}%
                  </div>
                  <Badge
                    className={`${performance.bg} ${performance.color} ${performance.border} border`}
                  >
                    {performance.label}
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-success-50 rounded-xl">
                  <div className="text-2xl font-bold text-success-600">
                    {correctCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-error-50 rounded-xl">
                  <div className="text-2xl font-bold text-error-600">
                    {questions.length - correctCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="p-4 bg-primary-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600">
                    {questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Answers */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-primary-600" />
                Detailed Review
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {questions.map((q: any, idx: number) => {
                  const userAnswer = userAnswers[idx];
                  let isCorrect = false;

                  if (isReadingTest) {
                    isCorrect = userAnswer === q.correctAnswer;
                  } else if (q.type === "speaking" || q.type === "writing") {
                    isCorrect = true;
                  } else if (
                    q.type === "fill-blank" &&
                    typeof q.correctAnswer === "string"
                  ) {
                    isCorrect =
                      String(userAnswer).toLowerCase().trim() ===
                      q.correctAnswer.toLowerCase();
                  } else {
                    isCorrect = userAnswer === q.correctAnswer;
                  }

                  const feedback = getFeedback(q, userAnswer, isCorrect);

                  return (
                    <div
                      key={idx}
                      className={`p-5 ${
                        isCorrect ? "bg-success-50/50" : "bg-error-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect
                              ? "bg-success-100 text-success-600"
                              : "bg-error-100 text-error-600"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase">
                              Question {idx + 1}
                            </span>
                            <p className="font-medium text-foreground mt-1">
                              {q.question || q.text}
                            </p>
                          </div>

                          {q.options && (
                            <div className="grid grid-cols-1 gap-2 mt-3">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isUserAnswer = userAnswer === optIdx;
                                const isCorrectAnswer =
                                  q.correctAnswer === optIdx;

                                return (
                                  <div
                                    key={optIdx}
                                    className={`px-4 py-2 rounded-lg text-sm flex items-center gap-3 ${
                                      isCorrectAnswer
                                        ? "bg-success-100 text-success-800 border border-success-300"
                                        : isUserAnswer && !isCorrectAnswer
                                        ? "bg-error-100 text-error-800 border border-error-300"
                                        : "bg-card text-muted-foreground border border-border"
                                    }`}
                                  >
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCorrectAnswer
                                          ? "bg-success-600 text-white"
                                          : isUserAnswer && !isCorrectAnswer
                                          ? "bg-error-600 text-white"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{opt}</span>
                                    {isCorrectAnswer && (
                                      <CheckCircle className="w-4 h-4 ml-auto text-success-600" />
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <X className="w-4 h-4 ml-auto text-error-600" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {q.type === "fill-blank" && (
                            <div className="flex gap-4 mt-3">
                              <div
                                className={`px-4 py-2 rounded-lg text-sm ${
                                  isCorrect
                                    ? "bg-success-100 text-success-800"
                                    : "bg-error-100 text-error-800"
                                }`}
                              >
                                <span className="text-xs uppercase font-medium opacity-70">
                                  Your answer:
                                </span>
                                <p className="font-medium">
                                  {String(userAnswer) || "(empty)"}
                                </p>
                              </div>
                              {!isCorrect && (
                                <div className="px-4 py-2 rounded-lg text-sm bg-success-100 text-success-800">
                                  <span className="text-xs uppercase font-medium opacity-70">
                                    Correct answer:
                                  </span>
                                  <p className="font-medium">
                                    {q.correctAnswer}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {q.type === "writing" && (
                            <div className="mt-3 p-4 bg-card rounded-lg border border-border">
                              <span className="text-xs uppercase font-medium text-muted-foreground">
                                Your response:
                              </span>
                              <p className="mt-1 text-foreground whitespace-pre-wrap">
                                {String(userAnswer) || "(No response)"}
                              </p>
                            </div>
                          )}

                          {q.type === "speaking" && (
                            <div className="mt-3 flex items-center gap-2 text-primary-600">
                              <Mic className="w-4 h-4" />
                              <span className="text-sm">
                                Audio response recorded
                              </span>
                            </div>
                          )}

                          <div
                            className={`mt-3 p-3 rounded-lg text-sm ${
                              isCorrect
                                ? "bg-success-100/50 text-success-700"
                                : "bg-warning-100/50 text-warning-700"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{feedback}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinueFromFeedback}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {completedTests.length + 1 >= TEST_STEPS.length ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  View Final Results
                </>
              ) : (
                <>
                  Continue to Next Test
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const handleTextSelection = () => {
    if (!isHighlightMode || !passageRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(passageRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    setReadingHighlights((prev) => [
      ...prev.filter(
        (h) => h.type === "user" && (h.end <= start || h.start >= end)
      ),
      { start, end, color: "green", type: "user" },
    ]);
    selection.removeAllRanges();
  };

  const renderHighlightedContent = () => {
    const content = readingPassage.content;
    const segments: {
      text: string;
      highlight?: (typeof readingHighlights)[0];
    }[] = [];
    let lastIndex = 0;

    const sortedHighlights = [...readingHighlights].sort(
      (a, b) => a.start - b.start
    );

    sortedHighlights.forEach((highlight) => {
      if (highlight.start > lastIndex) {
        segments.push({ text: content.slice(lastIndex, highlight.start) });
      }
      segments.push({
        text: content.slice(highlight.start, highlight.end),
        highlight,
      });
      lastIndex = highlight.end;
    });

    if (lastIndex < content.length) {
      segments.push({ text: content.slice(lastIndex) });
    }

    return segments.map((segment, idx) => {
      if (segment.highlight) {
        return (
          <mark
            key={idx}
            className={cn(
              "px-0.5 rounded",
              segment.highlight.color === "green"
                ? "bg-success-200 text-success-900"
                : "bg-error-200 text-error-900"
            )}
          >
            {segment.text}
          </mark>
        );
      }
      return <span key={idx}>{segment.text}</span>;
    });
  };

  const handleToggleReadingHint = () => {
    setShowReadingHint(!showReadingHint);
    if (!showReadingHint) {
      const questionWords = readingPassage.questions[
        currentReadingQuestion
      ]?.question
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 4);
      const content = readingPassage.content.toLowerCase();
      const newHintHighlights: typeof readingHighlights = [];

      questionWords?.forEach((word) => {
        let index = content.indexOf(word);
        while (index !== -1) {
          newHintHighlights.push({
            start: index,
            end: index + word.length,
            color: "red",
            type: "hint",
          });
          index = content.indexOf(word, index + 1);
        }
      });
      setReadingHighlights((prev) => [
        ...prev.filter((h) => h.type !== "hint"),
        ...newHintHighlights,
      ]);
    } else {
      setReadingHighlights((prev) => prev.filter((h) => h.type !== "hint"));
    }
  };

  const handleReadingAnswer = (questionIdx: number, answerIdx: number) => {
    setReadingAnswers((prev) => ({ ...prev, [questionIdx]: answerIdx }));
  };

  const handleCheckReadingAnswer = () => {
    setCheckedReadingQuestions(
      (prev) => new Set([...prev, currentReadingQuestion])
    );
  };

  const handleNextReadingQuestion = () => {
    if (currentReadingQuestion < readingPassage.questions.length - 1) {
      setCurrentReadingQuestion((prev) => prev + 1);
      setShowReadingHint(false);
      setReadingHighlights((prev) => prev.filter((h) => h.type === "user"));
    }
  };

  const handlePrevReadingQuestion = () => {
    if (currentReadingQuestion > 0) {
      setCurrentReadingQuestion((prev) => prev - 1);
      setShowReadingHint(false);
      setReadingHighlights((prev) => prev.filter((h) => h.type === "user"));
    }
  };

  const isReadingQuestionAnswered = currentReadingQuestion in readingAnswers;
  const isReadingQuestionChecked = checkedReadingQuestions.has(
    currentReadingQuestion
  );

  const renderTestContent = () => {
    if (activeTestId === "reading") {
      return renderReadingTest();
    }

    const questions = mockQuestions[activeTestId!];
    const currentQ = questions[currentQuestion];
    const testInfo = TEST_STEPS.find((s) => s.id === activeTestId)!;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Test Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTestId(null)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit Test
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">No time limit</span>
              </div>
            </div>

            <Card className="p-4 bg-primary-50 border-primary-200 ">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <testInfo.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-foreground">
                    {testInfo.label} Test
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(
                      ((currentQuestion + 1) / questions.length) * 100
                    )}
                    %
                  </div>
                </div>
              </div>
              <Progress
                value={((currentQuestion + 1) / questions.length) * 100}
                className="mt-4 h-2"
              />
            </Card>
          </div>

          {/* Question Card */}
          <Card className="p-6 mb-6 rounded-2xl border-0 shadow-lg">
            {/* Listening Audio */}
            {currentQ.type === "listening" && (
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-primary-100"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {isPlaying ? (
                    <Volume2 className="w-10 h-10 text-primary-600 animate-pulse" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Reading Passage */}
            {currentQ.type === "reading" && currentQ.passage && (
              <div className="p-4 bg-muted/50 rounded-xl mb-6">
                <p className="text-sm leading-relaxed text-foreground">
                  {currentQ.passage}
                </p>
              </div>
            )}

            {/* Speaking Prompt */}
            {currentQ.type === "speaking" && currentQ.prompt && (
              <div className="p-4 bg-secondary-50 rounded-xl mb-6">
                <p className="text-sm font-medium text-secondary-800 mb-1">
                  Topic:
                </p>
                <p className="text-foreground">{currentQ.prompt}</p>
              </div>
            )}

            {/* Writing Prompt */}
            {currentQ.type === "writing" && currentQ.prompt && (
              <div className="p-4 bg-info-50 rounded-xl mb-6">
                <p className="text-sm font-medium text-info-800 mb-1">Task:</p>
                <p className="text-foreground">{currentQ.prompt}</p>
              </div>
            )}

            {/* Question */}
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            {currentQ.type === "multiple-choice" ||
            currentQ.type === "reading" ||
            currentQ.type === "listening" ? (
              <div className="space-y-3">
                {currentQ.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAnswer === idx
                        ? "border-primary-500 bg-primary-50"
                        : "border-border hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          selectedAnswer === idx
                            ? "bg-primary-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-foreground">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : currentQ.type === "fill-blank" ? (
              <Input
                value={fillBlankAnswer}
                onChange={(e) => setFillBlankAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="h-12 rounded-xl"
              />
            ) : currentQ.type === "speaking" ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={toggleRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-error-500 animate-pulse"
                      : selectedAnswer === "recorded"
                      ? "bg-success-500"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : selectedAnswer === "recorded" ? (
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? "Recording... Click to stop"
                    : selectedAnswer === "recorded"
                    ? "Recording saved!"
                    : "Click to start recording"}
                </p>
              </div>
            ) : currentQ.type === "writing" ? (
              <Textarea
                value={writingAnswer}
                onChange={(e) => setWritingAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="min-h-[200px] rounded-xl"
              />
            ) : null}
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="gap-2 rounded-xl bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={
                ((currentQ.type === "multiple-choice" ||
                  currentQ.type === "reading" ||
                  currentQ.type === "listening") &&
                  selectedAnswer === null) ||
                (currentQ.type === "fill-blank" && !fillBlankAnswer) ||
                (currentQ.type === "writing" && !writingAnswer) ||
                (currentQ.type === "speaking" && selectedAnswer !== "recorded")
              }
              className="gap-2 rounded-xl bg-primary-600 hover:bg-primary-700"
            >
              {currentQuestion === questions.length - 1
                ? "Complete Test"
                : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderReadingTest = () => {
    const highlights = readingHighlights.filter((h) => h.type === "user");
    return (
      <div className="w-full max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <Card className="lg:col-span-3 p-8 space-y-4 lg:sticky lg:top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {readingPassage.title}
              </h2>
              <Button
                variant={isHighlightMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsHighlightMode(!isHighlightMode)}
                className="gap-2"
              >
                <Highlighter className="h-4 w-4" />
                {isHighlightMode ? "Highlighting" : "Highlight"}
              </Button>
            </div>

            <div
              ref={passageRef}
              onMouseUp={handleTextSelection}
              className={cn(
                "prose prose-base max-w-none",
                isHighlightMode ? "cursor-text select-text" : "select-none"
              )}
            >
              <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {renderHighlightedContent()}
              </p>
            </div>

            {highlights.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {highlights.length} highlight(s) saved
                </p>
              </div>
            )}
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-bold text-lg text-foreground">Questions</h3>
              <span className="text-sm text-muted-foreground">
                {Object.keys(readingAnswers).length} of{" "}
                {readingPassage.questions.length} answered
              </span>
            </div>

            <div className="space-y-8">
              {readingPassage.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="space-y-3 pb-6 border-b border-border last:border-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {qIdx + 1}
                      </div>
                      <p className="text-sm font-medium text-foreground pt-0.5">
                        {q.question}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newHints = { ...readingHints };
                        newHints[qIdx] = !newHints[qIdx];
                        setReadingHints(newHints);
                      }}
                      className="text-xs text-muted-foreground hover:text-primary-600 flex-shrink-0"
                    >
                      <Lightbulb className="h-3.5 w-3.5 mr-1" />
                      Hint
                    </Button>
                  </div>

                  {readingHints[qIdx] && (
                    <div className="ml-10 p-3 rounded-lg bg-warning-50 border border-warning-200 text-sm text-warning-800">
                      <p>{q.explanation}</p>
                    </div>
                  )}

                  <div className="ml-10 space-y-2">
                    {q.options?.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleReadingAnswer(qIdx, optIdx)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all text-sm flex items-center gap-3",
                          readingAnswers[qIdx] === optIdx
                            ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                            : "border-border hover:border-primary-300 hover:bg-muted/50"
                        )}
                      >
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                            readingAnswers[qIdx] === optIdx
                              ? "bg-primary-600 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-foreground">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                onClick={() => {
                  let correct = 0;
                  readingPassage.questions.forEach((q, idx) => {
                    if (readingAnswers[idx] === q.correctAnswer) correct++;
                  });
                  const score = Math.round(
                    (correct / readingPassage.questions.length) * 100
                  );
                  setTestScores((prev) => ({ ...prev, reading: score }));

                  setFeedbackTestId("reading");
                  setFeedbackReadingAnswers(readingAnswers);
                  setShowTestFeedback(true);
                  setActiveTestId(null);
                }}
                disabled={
                  Object.keys(readingAnswers).length <
                  readingPassage.questions.length
                }
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                Submit All Answers
              </Button>
              {Object.keys(readingAnswers).length <
                readingPassage.questions.length && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Please answer all questions before submitting
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const overallScore = calculateOverallScore();
    const cefrResult = calculateCEFRLevel(overallScore);

    const radarData = TEST_STEPS.map((step) => ({
      skill: step.label,
      score: testScores[step.id] || 0,
      fullMark: 100,
    }));

    const barData = TEST_STEPS.map((step) => ({
      name: step.label,
      score: testScores[step.id] || 0,
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Test Completed!
            </h1>
            <p className="text-muted-foreground">
              Here's your comprehensive English assessment
            </p>
          </div>

          {/* CEFR Level Card */}
          <Card className="p-8 mb-8 rounded-2xl border-0 shadow-xl bg-card text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-primary-600" />
              <h2 className="text-xl font-bold text-foreground">
                Your CEFR Level
              </h2>
            </div>
            <div className={`text-7xl font-black ${cefrResult.color} mb-2`}>
              {cefrResult.level}
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              {cefrResult.description}
            </p>
            <div className="flex items-center justify-center gap-2 bg-primary-50 rounded-full px-6 py-3 inline-flex">
              <Target className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-primary-600">
                Overall Score: {overallScore}%
              </span>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Radar Chart */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-card">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Skills Overview
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="var(--primary-500)"
                      fill="var(--primary-500)"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar Chart */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-card">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-600" />
                Score by Skill
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="score"
                      fill="var(--primary-500)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Detailed Scores */}
          <Card className="p-6 rounded-2xl border-0 shadow-lg bg-card mb-8">
            <h3 className="font-bold text-foreground mb-6">Detailed Scores</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEST_STEPS.map((step) => {
                const score = testScores[step.id] || 0;
                const Icon = step.icon;
                const skillCefr = calculateCEFRLevel(score);
                return (
                  <div key={step.id} className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {step.label}
                        </p>
                        <p className={`text-sm font-medium ${skillCefr.color}`}>
                          {skillCefr.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Score
                      </span>
                      <span className="font-bold text-foreground">
                        {score}%
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleRestartTest}
              variant="outline"
              className="gap-2 px-6 py-3 rounded-xl bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </Button>
            <Link href="/">
              <Button className="gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Test Feedback View
  if (showTestFeedback) {
    return renderTestFeedback();
  }

  // Active Test View
  if (activeTestId) {
    return renderTestContent();
  }

  // Results View
  if (showResults) {
    return renderResults();
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            English Placement Test
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete each test in order to receive your comprehensive English
            level assessment.
          </p>
        </div>

        <Card className="p-6 mb-8 rounded-2xl border-0 shadow-lg bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-foreground">Overall Progress</h2>
              <p className="text-sm text-muted-foreground">
                {completedTests.length} of {TEST_STEPS.length} tests completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary-600">
                {overallProgress}%
              </span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3 mb-6" />

          {/* Test Steps */}
          <div className="space-y-4">
            {TEST_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isUnlocked = isStepUnlocked(step.id);
              const isCompleted = isStepCompleted(step.id);
              const score = testScores[step.id];

              return (
                <div
                  key={step.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all cursor-pointer",
                    isCompleted
                      ? "border-success-300 bg-success-50"
                      : isUnlocked
                      ? "border-primary-300 bg-primary-50 hover:border-primary-400"
                      : "border-border bg-muted/50 opacity-60 cursor-not-allowed"
                  )}
                  onClick={() =>
                    isUnlocked && !isCompleted && handleStartTest(step.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isCompleted
                          ? "bg-success-100"
                          : isUnlocked
                          ? "bg-primary-100"
                          : "bg-muted"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-success-600" />
                      ) : isUnlocked ? (
                        <Icon className="w-6 h-6 text-primary-600" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {step.label}
                        </h3>
                        {isCompleted && score !== undefined && (
                          <Badge className="bg-success-100 text-success-700 border-success-200">
                            {score}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {isUnlocked && !isCompleted && (
                      <Button
                        size="sm"
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        Start
                      </Button>
                    )}
                    {isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTest(step.id);
                        }}
                      >
                        Retake
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Complete All Button */}
        {completedTests.length === TEST_STEPS.length && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setShowResults(true)}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View Final Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
