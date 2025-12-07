import SpeakingPageClient from "@/components/page/SpeakingPageClient";
import type {
  Scenario,
  CriteriaItem,
  HistoryGraphItem,
  HistoryTopicItem,
} from "@/components/page/SpeakingPageClient";
import type { TopicGroup } from "@/components/hub";
import { getTopics, getCustomTopics, getSessionHistory } from "@/actions/speaking";

// Mock data for static parts
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

const DEMO_CRITERIA: CriteriaItem[] = [
  { title: "Vocabulary", score: 95 },
  { title: "Grammar", score: 92 },
  { title: "Pronounciation", score: 93 },
  { title: "Fluency", score: 85 },
  { title: "Coherence", score: 83 },
];

export default async function SpeakingPage() {
  // TODO: Get real user ID from auth
  const userId = "user-1";

  const [dbTopics, dbCustomTopics, dbSessions] = await Promise.all([
    getTopics(),
    getCustomTopics(userId),
    getSessionHistory(userId),
  ]);

  // Transform DB topics to UI format
  const scenarios: Scenario[] = [
    ...dbTopics.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category || "General",
      subcategory: t.subcategory || "",
      level: t.difficulty || "A1",
      image: t.image || "/learning.png",
      sessionsCompleted: 0, // Calculate from sessions if needed
      totalSessions: 10,
      progress: 0,
      duration: t.duration || 10,
      isCustom: false
    })),
    ...dbCustomTopics.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: "Custom",
      level: t.difficulty || "B1",
      image: t.image || "/learning.png",
      sessionsCompleted: 0,
      totalSessions: 10,
      progress: 0,
      duration: t.duration || 10,
      isCustom: true
    }))
  ];

  // Transform History
  // Only completed sessions or all? Let's show all
  const historyTopicsData: HistoryTopicItem[] = dbSessions.map((s: any) => ({
    id: s.id,
    title: s.scenario.title,
    description: s.scenario.description,
    score: 85, // TODO: Aggregate scores from turns or store session score
    date: s.createdAt.toISOString().split('T')[0],
    level: s.scenario.difficulty || "B1",
    image: s.scenario.image || "/learning.png",
    progress: 100,
    wordCount: s.scenario.duration || 10
  }));

  const HISTORY_GRAPH_DATA: HistoryGraphItem[] = dbSessions.map((s: any, i: number) => ({
    session: i + 1,
    score: 85 // Placeholder
  }));

  return (
    <SpeakingPageClient
      topicGroups={TOPIC_GROUPS}
      scenarios={scenarios}
      demoCriteria={DEMO_CRITERIA}
      historyGraphData={HISTORY_GRAPH_DATA}
      historyTopicsData={historyTopicsData}
      userId={userId}
    />
  );
}
