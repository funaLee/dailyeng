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
  // Tenses > Present Simple
  {
    id: "g1",
    title: "Present Simple Basics",
    description: "Learn how to use present simple tense for habits, facts, and routines",
    level: "A1",
    category: "Tenses",
    subcategory: "Present Simple",
    lessonCount: 8,
    estimatedTime: 30,
    progress: 40,
  },
  {
    id: "g2",
    title: "Present Simple: Negative & Questions",
    description: "Master negative sentences and questions in present simple",
    level: "A1",
    category: "Tenses",
    subcategory: "Present Simple",
    lessonCount: 6,
    estimatedTime: 25,
    progress: 60,
  },
  // Tenses > Past Simple
  {
    id: "g3",
    title: "Past Simple Regular Verbs",
    description: "Learn past simple with regular verbs",
    level: "A2",
    category: "Tenses",
    subcategory: "Past Simple",
    lessonCount: 10,
    estimatedTime: 40,
    progress: 0,
  },
  {
    id: "g4",
    title: "Past Simple Irregular Verbs",
    description: "Master irregular verbs in past tense",
    level: "A2",
    category: "Tenses",
    subcategory: "Past Simple",
    lessonCount: 12,
    estimatedTime: 50,
    progress: 20,
  },
  // Tenses > Future Simple
  {
    id: "g5",
    title: "Future with Will",
    description: "Learn future tense using will",
    level: "A2",
    category: "Tenses",
    subcategory: "Future Simple",
    lessonCount: 8,
    estimatedTime: 35,
    progress: 100,
  },
  {
    id: "g6",
    title: "Future with Going To",
    description: "Express plans and intentions with going to",
    level: "A2",
    category: "Tenses",
    subcategory: "Future Simple",
    lessonCount: 7,
    estimatedTime: 30,
    progress: 0,
  },
  // Tenses > Present Perfect
  {
    id: "g7",
    title: "Present Perfect Introduction",
    description: "Connect past events to the present using present perfect",
    level: "B1",
    category: "Tenses",
    subcategory: "Present Perfect",
    lessonCount: 10,
    estimatedTime: 45,
    progress: 25,
  },
  {
    id: "g8",
    title: "Present Perfect vs Past Simple",
    description: "Understand the difference between these two tenses",
    level: "B1",
    category: "Tenses",
    subcategory: "Present Perfect",
    lessonCount: 8,
    estimatedTime: 40,
    progress: 0,
  },
  // Modals > Can/Could
  {
    id: "g9",
    title: "Can for Ability",
    description: "Use can to express ability and possibility",
    level: "A1",
    category: "Modals",
    subcategory: "Can/Could",
    lessonCount: 6,
    estimatedTime: 25,
    progress: 80,
  },
  {
    id: "g10",
    title: "Could for Past & Polite Requests",
    description: "Master could in different contexts",
    level: "A2",
    category: "Modals",
    subcategory: "Can/Could",
    lessonCount: 7,
    estimatedTime: 30,
    progress: 0,
  },
  // Modals > Must/Have to
  {
    id: "g11",
    title: "Must for Obligation",
    description: "Express strong obligation with must",
    level: "B1",
    category: "Modals",
    subcategory: "Must/Have to",
    lessonCount: 8,
    estimatedTime: 35,
    progress: 0,
  },
  // Conditionals > First Conditional
  {
    id: "g12",
    title: "First Conditional",
    description: "Real possibilities with if-clauses",
    level: "B1",
    category: "Conditionals",
    subcategory: "First Conditional",
    lessonCount: 10,
    estimatedTime: 45,
    progress: 50,
  },
  // Conditionals > Second Conditional
  {
    id: "g13",
    title: "Second Conditional",
    description: "Hypothetical situations and imaginary conditions",
    level: "B2",
    category: "Conditionals",
    subcategory: "Second Conditional",
    lessonCount: 12,
    estimatedTime: 55,
    progress: 0,
  },
  // Sentence Structure > Basic Sentences
  {
    id: "g14",
    title: "Subject-Verb-Object",
    description: "Learn the basic sentence structure in English",
    level: "A1",
    category: "Sentence Structure",
    subcategory: "Basic Sentences",
    lessonCount: 5,
    estimatedTime: 20,
    progress: 100,
  },
  // Articles
  {
    id: "g15",
    title: "A vs An",
    description: "Master when to use a and an",
    level: "A1",
    category: "Articles",
    subcategory: "A/An",
    lessonCount: 4,
    estimatedTime: 15,
    progress: 75,
  },
  {
    id: "g16",
    title: "The Definite Article",
    description: "Learn when to use 'the'",
    level: "A2",
    category: "Articles",
    subcategory: "The",
    lessonCount: 6,
    estimatedTime: 25,
    progress: 0,
  },
  // Prepositions
  {
    id: "g17",
    title: "Prepositions of Time",
    description: "In, on, at for time expressions",
    level: "A1",
    category: "Prepositions",
    subcategory: "Time Prepositions",
    lessonCount: 6,
    estimatedTime: 25,
    progress: 90,
  },
  {
    id: "g18",
    title: "Prepositions of Place",
    description: "In, on, at for locations",
    level: "A2",
    category: "Prepositions",
    subcategory: "Place Prepositions",
    lessonCount: 7,
    estimatedTime: 30,
    progress: 0,
  },
];

const CURRENT_GRAMMAR_TOPIC = {
  id: "g1",
  title: "Present Simple Basics",
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
