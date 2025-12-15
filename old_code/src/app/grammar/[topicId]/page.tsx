import GrammarTopicPageClient from "@/components/page/GrammarTopicPageClient";
import { mockGrammar } from "@/lib/mock-data";

// Mock lesson data for grammar topics
const mockGrammarLessonGroups = [
  {
    id: "grammar-learning",
    title: "Grammar Learning",
    lessons: [
      {
        id: "grammar-1",
        title: "Grammar Pack 1",
        duration: "30 min",
        status: "completed" as const,
        score: 90,
      },
      {
        id: "grammar-2",
        title: "Grammar Pack 2",
        duration: "30 min",
        status: "in_progress" as const,
        progress: 60,
      },
      {
        id: "grammar-3",
        title: "Grammar Rules",
        duration: "30 min",
        status: "not_started" as const,
      },
    ],
  },
  {
    id: "translate-practice",
    title: "Translate Practice",
    lessons: [
      {
        id: "translate-1",
        title: "Translate Practice 1",
        duration: "30 min",
        status: "not_started" as const,
      },
      {
        id: "translate-2",
        title: "Translate Practice 2",
        duration: "30 min",
        status: "not_started" as const,
      },
      {
        id: "translate-3",
        title: "Translate Practice 3",
        duration: "30 min",
        status: "not_started" as const,
      },
    ],
  },
  {
    id: "listening-practice",
    title: "Listening Practice",
    lessons: [
      {
        id: "listening-1",
        title: "Listening Practice 1",
        duration: "30 min",
        status: "not_started" as const,
      },
      {
        id: "listening-2",
        title: "Listening Practice 2",
        duration: "30 min",
        status: "not_started" as const,
      },
    ],
  },
  {
    id: "reading-practice",
    title: "Reading Practice",
    lessons: [
      {
        id: "reading-1",
        title: "Reading Practice 1",
        duration: "30 min",
        status: "not_started" as const,
      },
      {
        id: "reading-2",
        title: "Reading Practice 2",
        duration: "30 min",
        status: "not_started" as const,
      },
    ],
  },
  {
    id: "writing-practice",
    title: "Writing Practice",
    lessons: [
      {
        id: "writing-1",
        title: "Writing Practice 1",
        duration: "30 min",
        status: "not_started" as const,
      },
      {
        id: "writing-2",
        title: "Writing Practice 2",
        duration: "30 min",
        status: "not_started" as const,
      },
    ],
  },
  {
    id: "quiz-practice",
    title: "Quiz Practice",
    lessons: [
      {
        id: "quiz-1",
        title: "Quiz Practice 1",
        duration: "30 min",
        status: "not_started" as const,
      },
      {
        id: "quiz-2",
        title: "Quiz Practice 2",
        duration: "30 min",
        status: "not_started" as const,
      },
    ],
  },
];

// Mock course outline sections for grammar
const mockGrammarCourseSections = [
  {
    id: "tenses",
    title: "Tenses",
    isExpanded: true,
    lessons: [
      { id: "present-simple", title: "Present Simple" },
      { id: "present-continuous", title: "Present Continuous" },
      { id: "past-simple", title: "Past Simple" },
      { id: "future-simple", title: "Future Simple" },
    ],
  },
  {
    id: "conditionals",
    title: "Conditionals",
    isExpanded: false,
    lessons: [
      { id: "zero-conditional", title: "Zero Conditional" },
      { id: "first-conditional", title: "First Conditional" },
      { id: "second-conditional", title: "Second Conditional" },
    ],
  },
  {
    id: "passive-voice",
    title: "Passive Voice",
    isExpanded: false,
    lessons: [
      { id: "passive-present", title: "Present Passive" },
      { id: "passive-past", title: "Past Passive" },
    ],
  },
];

function getTopicData(topicId: string) {
  return {
    id: topicId,
    title:
      topicId === "1"
        ? "Travel Grammar"
        : topicId === "2"
        ? "Food & Dining Grammar"
        : "Job Interview Grammar",
    description:
      topicId === "1"
        ? "Master grammar rules for travel conversations"
        : topicId === "2"
        ? "Learn grammar for food and dining situations"
        : "Professional grammar for job interviews",
    level: "A2",
  };
}

function getGrammarNotes(topicId: string) {
  const lookupId = topicId?.startsWith("g") ? topicId.slice(1) : topicId;
  let notes = mockGrammar[lookupId] || [];
  if (notes.length === 0) {
    const numeric = lookupId.replace(/\D/g, "");
    if (numeric) notes = mockGrammar[numeric] || [];
  }
  return notes;
}

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function GrammarTopicPage({ params }: PageProps) {
  const { topicId } = await params;

  // Mock data - will be replaced with actual data fetching from DB/API later
  const topic = getTopicData(topicId);
  const grammarNotes = getGrammarNotes(topicId);

  return (
    <GrammarTopicPageClient
      topicId={topicId}
      topic={topic}
      grammarNotes={grammarNotes}
      lessonGroups={mockGrammarLessonGroups}
      courseSections={mockGrammarCourseSections}
    />
  );
}
