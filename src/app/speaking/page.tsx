import SpeakingPageClient from "@/components/page/SpeakingPageClient";
import type {
  Scenario,
  CriteriaItem,
  HistoryGraphItem,
  HistoryTopicItem,
} from "@/components/page/SpeakingPageClient";
import type { TopicGroup } from "@/components/hub";

// Mock data - will be replaced with actual data fetching from DB/API later
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

// Mock scenarios data
const mockScenarios: Scenario[] = [
  {
    id: "scenario-1",
    title: "Coffee Shop Ordering",
    description: "Practice ordering drinks and snacks at a coffee shop",
    category: "Daily Life",
    subcategory: "Dining",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 3,
    totalSessions: 10,
    progress: 30,
    isCustom: false,
  },
  {
    id: "scenario-2",
    title: "Job Interview",
    description: "Practice answering common interview questions",
    category: "Professional English",
    subcategory: "Interviews",
    level: "B2",
    image: "/learning.png",
    sessionsCompleted: 5,
    totalSessions: 10,
    progress: 50,
    isCustom: false,
  },
  {
    id: "scenario-3",
    title: "Hotel Check-in",
    description: "Practice checking into a hotel",
    category: "Travel",
    subcategory: "Hotels",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 2,
    totalSessions: 10,
    progress: 20,
    isCustom: false,
  },
  {
    id: "scenario-4",
    title: "Restaurant Reservation",
    description: "Practice making a restaurant reservation by phone",
    category: "Daily Life",
    subcategory: "Dining",
    level: "B1",
    image: "/learning.png",
    sessionsCompleted: 4,
    totalSessions: 10,
    progress: 40,
    isCustom: false,
  },
  {
    id: "scenario-5",
    title: "Doctor's Appointment",
    description: "Practice describing symptoms to a doctor",
    category: "Daily Life",
    subcategory: "Healthcare",
    level: "B1",
    image: "/learning.png",
    sessionsCompleted: 1,
    totalSessions: 10,
    progress: 10,
    isCustom: false,
  },
  {
    id: "scenario-6",
    title: "Business Meeting",
    description: "Practice leading and participating in business meetings",
    category: "Professional English",
    subcategory: "Meetings",
    level: "B2",
    image: "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 10,
    progress: 0,
    isCustom: false,
  },
  {
    id: "scenario-7",
    title: "Airport Navigation",
    description: "Practice asking for directions and help at the airport",
    category: "Travel",
    subcategory: "Airports",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 6,
    totalSessions: 10,
    progress: 60,
    isCustom: false,
  },
  {
    id: "scenario-8",
    title: "Casual Conversation",
    description: "Practice making small talk with new people",
    category: "Social Situations",
    subcategory: "Small Talk",
    level: "A2",
    image: "/learning.png",
    sessionsCompleted: 8,
    totalSessions: 10,
    progress: 80,
    isCustom: false,
  },
];

// Mock history data
const mockHistoryTopics: HistoryTopicItem[] = [
  {
    id: "session-1",
    title: "Coffee Shop Ordering",
    description: "Practice ordering drinks and snacks at a coffee shop",
    score: 85,
    date: "2024-12-08",
    level: "A2",
    image: "/learning.png",
    progress: 100,
    wordCount: 10,
  },
  {
    id: "session-2",
    title: "Job Interview",
    description: "Practice answering common interview questions",
    score: 78,
    date: "2024-12-07",
    level: "B2",
    image: "/learning.png",
    progress: 100,
    wordCount: 15,
  },
  {
    id: "session-3",
    title: "Casual Conversation",
    description: "Practice making small talk with new people",
    score: 92,
    date: "2024-12-05",
    level: "A2",
    image: "/learning.png",
    progress: 100,
    wordCount: 10,
  },
];

const mockHistoryGraph: HistoryGraphItem[] = [
  { session: 1, score: 72 },
  { session: 2, score: 78 },
  { session: 3, score: 75 },
  { session: 4, score: 82 },
  { session: 5, score: 85 },
  { session: 6, score: 88 },
  { session: 7, score: 85 },
  { session: 8, score: 92 },
];

export default async function SpeakingPage() {
  // TODO: Get real user ID from auth
  const userId = "user-1";

  // Mock data - will be replaced with actual data fetching from DB/API later
  const scenarios = mockScenarios;
  const historyTopicsData = mockHistoryTopics;
  const historyGraphData = mockHistoryGraph;

  return (
    <SpeakingPageClient
      topicGroups={TOPIC_GROUPS}
      scenarios={scenarios}
      demoCriteria={DEMO_CRITERIA}
      historyGraphData={historyGraphData}
      historyTopicsData={historyTopicsData}
      userId={userId}
    />
  );
}
