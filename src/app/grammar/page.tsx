import GrammarPageClient from "@/components/page/GrammarPageClient";
import type { TopicGroup } from "@/components/hub";

const GRAMMAR_GROUPS: TopicGroup[] = [
  {
    name: "Tenses",
    subcategories: [
      "Present Simple",
      "Past Simple",
      "Future Simple",
      "Present Perfect",
      "Past Perfect",
    ],
  },
  {
    name: "Sentence Structure",
    subcategories: [
      "Basic Sentences",
      "Compound Sentences",
      "Complex Sentences",
      "Word Order",
    ],
  },
  {
    name: "Modals",
    subcategories: [
      "Can/Could",
      "May/Might",
      "Must/Have to",
      "Should/Ought to",
      "Will/Would",
    ],
  },
  {
    name: "Conditionals",
    subcategories: [
      "Zero Conditional",
      "First Conditional",
      "Second Conditional",
      "Third Conditional",
    ],
  },
  {
    name: "Passive Voice",
    subcategories: [
      "Present Passive",
      "Past Passive",
      "Future Passive",
      "Modal Passive",
    ],
  },
  {
    name: "Reported Speech",
    subcategories: ["Statements", "Questions", "Commands", "Time Changes"],
  },
  {
    name: "Articles",
    subcategories: ["A/An", "The", "Zero Article", "Article Rules"],
  },
  {
    name: "Prepositions",
    subcategories: [
      "Time Prepositions",
      "Place Prepositions",
      "Movement",
      "Common Phrases",
    ],
  },
];

const mockGrammarTopics = [
  {
    id: "g1",
    title: "Present Simple",
    description:
      "Learn how to use present simple tense for habits, facts, and routines",
    level: "A1",
    lessonCount: 8,
    estimatedTime: 30,
    progress: 40,
  },
  {
    id: "g2",
    title: "Past Simple",
    description: "Master past simple for completed actions in the past",
    level: "A2",
    lessonCount: 10,
    estimatedTime: 40,
    progress: 0,
  },
  {
    id: "g3",
    title: "Modal Verbs",
    description:
      "Understand how to use can, could, may, might, must, should, and will",
    level: "B1",
    lessonCount: 12,
    estimatedTime: 50,
    progress: 0,
  },
  {
    id: "g4",
    title: "Future Tenses",
    description: "Learn different ways to express future actions and plans",
    level: "A2",
    lessonCount: 8,
    estimatedTime: 35,
    progress: 100,
  },
  {
    id: "g5",
    title: "Present Perfect",
    description:
      "Connect past events to the present using present perfect tense",
    level: "B1",
    lessonCount: 10,
    estimatedTime: 45,
    progress: 25,
  },
  {
    id: "g6",
    title: "Conditionals",
    description: "Master if-clauses and conditional sentences in English",
    level: "B2",
    lessonCount: 14,
    estimatedTime: 60,
    progress: 0,
  },
];

const CURRENT_GRAMMAR_TOPIC = {
  id: "g1",
  title: "Present Simple",
  subtitle: "Lesson 3 of 8",
};

export default async function GrammarPage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  return (
    <GrammarPageClient
      grammarGroups={GRAMMAR_GROUPS}
      grammarTopics={mockGrammarTopics}
      currentGrammarTopic={CURRENT_GRAMMAR_TOPIC}
    />
  );
}
