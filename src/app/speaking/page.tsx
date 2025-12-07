// Server Component - No "use client" directive
// Data fetching happens here on the server

import SpeakingPageClient from "@/components/page/SpeakingPageClient";
import type {
  Scenario,
  CriteriaItem,
  HistoryGraphItem,
  HistoryTopicItem,
} from "@/components/page/SpeakingPageClient";
import type { TopicGroup } from "@/components/hub";
import {
  getSpeakingScenarios,
  getTopicGroups,
  getUserSessionHistory,
} from "@/lib/db/speaking";

// ============================================
// MOCK DATA (commented out - replaced with DB queries)
// ============================================

/*
const TOPIC_GROUPS: TopicGroup[] = [
  {
    name: "Daily Life",
    subcategories: ["Shopping", "Dining", "Healthcare", "Transportation"],
  },
  {
    name: "Professional English",
    subcategories: ["Meetings", "Presentations", "Negotiations", "Interviews"],
  },
  {
    name: "Academic",
    subcategories: ["Lectures", "Discussions", "Research", "Presentations"],
  },
  {
    name: "Business",
    subcategories: ["Marketing", "Sales", "Finance", "Management"],
  },
  {
    name: "Travel",
    subcategories: ["Hotels", "Airports", "Tourist Sites", "Emergency"],
  },
  {
    name: "Social Situations",
    subcategories: ["Parties", "Small Talk", "Making Friends", "Dating"],
  },
];

const mockScenarios: Scenario[] = [
  {
    id: "cafe-order",
    title: "Ordering at a Café",
    description: "Practice ordering coffee and food at a local café",
    category: "Daily Life",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 2,
    totalSessions: 5,
    progress: 40,
    duration: 7,
  },
  {
    id: "shopping",
    title: "Shopping for Clothes",
    description: "Navigate a clothing store and ask for sizes and colors",
    category: "Daily Life",
    level: "B1",
    image: "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 4,
    progress: 0,
    duration: 5,
  },
  {
    id: "meeting",
    title: "Team Meeting",
    description: "Participate in a professional team discussion",
    category: "Professional English",
    level: "B2",
    image: "/learning.png",
    sessionsCompleted: 3,
    totalSessions: 6,
    progress: 50,
    duration: 10,
  },
  {
    id: "presentation",
    title: "Product Presentation",
    description: "Present a new product to potential clients",
    category: "Professional English",
    level: "C1",
    image: "/learning.png",
    sessionsCompleted: 1,
    totalSessions: 4,
    progress: 25,
    duration: 15,
  },
  {
    id: "hotel",
    title: "Hotel Check-in",
    description: "Check into a hotel and ask about amenities",
    category: "Travel",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 8,
    progress: 0,
    duration: 6,
  },
  {
    id: "small-talk",
    title: "Making Small Talk",
    description: "Have casual conversations with new acquaintances",
    category: "Social Situations",
    level: "B1",
    image: "/learning.png",
    sessionsCompleted: 2,
    totalSessions: 5,
    progress: 40,
    duration: 8,
  },
];

const HISTORY_TOPICS_DATA: HistoryTopicItem[] = [
  {
    id: "1",
    title: "Space Exploration",
    description:
      "Learn vocabulary used in space travel, astronomy, and scientific discovery.",
    score: 95,
    date: "2024-03-10",
    level: "B2",
    image: "/learning.png",
    progress: 100,
    wordCount: 8,
  },
  {
    id: "2",
    title: "Magic & Fantasy",
    description:
      "Discuss magical worlds, spells, and fantasy creatures in descriptive English.",
    score: 92,
    date: "2024-03-09",
    level: "C1",
    image: "/learning.png",
    progress: 100,
    wordCount: 10,
  },
  {
    id: "3",
    title: "Future Technology",
    description:
      "Debate the implications of AI, robotics, and future tech trends.",
    score: 94,
    date: "2024-03-08",
    level: "C1",
    image: "/learning.png",
    progress: 100,
    wordCount: 12,
  },
  {
    id: "4",
    title: "Sustainable Living",
    description: "Talk about eco-friendly habits and saving the planet.",
    score: 91,
    date: "2024-03-05",
    level: "B2",
    image: "/learning.png",
    progress: 100,
    wordCount: 9,
  },
  {
    id: "5",
    title: "Job Interview",
    description:
      "Practice answering common interview questions professionally.",
    score: 85,
    date: "2024-03-04",
    level: "B2",
    image: "/learning.png",
    progress: 100,
    wordCount: 15,
  },
  {
    id: "6",
    title: "Coffee Culture",
    description: "Describe different types of coffee and café experiences.",
    score: 88,
    date: "2024-03-03",
    level: "A2",
    image: "/learning.png",
    progress: 100,
    wordCount: 7,
  },
  {
    id: "7",
    title: "Travel Planning",
    description: "Plan a trip, book hotels, and discuss itineraries.",
    score: 82,
    date: "2024-03-01",
    level: "B1",
    image: "/learning.png",
    progress: 100,
    wordCount: 10,
  },
  {
    id: "8",
    title: "Movie Reviews",
    description: "Share your opinions on recent movies and actors.",
    score: 89,
    date: "2024-02-28",
    level: "B1",
    image: "/learning.png",
    progress: 100,
    wordCount: 8,
  },
];
*/

// Demo criteria data (static - not stored in DB)
const DEMO_CRITERIA: CriteriaItem[] = [
  { title: "Vocabulary", score: 95 },
  { title: "Grammar", score: 92 },
  { title: "Pronounciation", score: 93 },
  { title: "Fluency", score: 85 },
  { title: "Coherence", score: 83 },
];

// History graph data (generated - could be computed from DB data)
const HISTORY_GRAPH_DATA: HistoryGraphItem[] = Array.from(
  { length: 50 },
  (_, i) => ({
    session: i + 1,
    score: Math.floor(Math.random() * 40) + 60 + (i % 5) * 2,
  })
);

export default async function SpeakingPage() {
  // TODO: Get userId from auth session when available
  const userId: string | undefined = undefined;

  // Fetch data from database
  const [topicGroupsFromDB, scenariosFromDB] = await Promise.all([
    getTopicGroups(),
    getSpeakingScenarios(userId),
  ]);

  // Get user session history if logged in
  const historyTopicsFromDB = userId ? await getUserSessionHistory(userId) : [];

  // Transform DB data to match component types
  const topicGroups: TopicGroup[] = topicGroupsFromDB.map((tg) => ({
    name: tg.name,
    subcategories: tg.subcategories,
  }));

  const scenarios: Scenario[] = scenariosFromDB.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    level: s.level,
    image: s.image,
    sessionsCompleted: s.sessionsCompleted,
    totalSessions: s.totalSessions,
    progress: s.progress,
    duration: s.duration,
  }));

  const historyTopicsData: HistoryTopicItem[] = historyTopicsFromDB.map(
    (h) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      score: h.score,
      date: h.date,
      level: h.level,
      image: h.image,
      progress: h.progress,
      wordCount: h.wordCount,
    })
  );

  return (
    <SpeakingPageClient
      topicGroups={topicGroups}
      scenarios={scenarios}
      demoCriteria={DEMO_CRITERIA}
      historyGraphData={HISTORY_GRAPH_DATA}
      historyTopicsData={historyTopicsData}
    />
  );
}
