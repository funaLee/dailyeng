import SpeakingPageClient from "@/components/page/SpeakingPageClient";
import type { CriteriaItem } from "@/components/page/SpeakingPageClient";
import {
  getSpeakingTopicGroups,
  getSpeakingScenariosWithProgress,
  getUserSpeakingHistory,
} from "@/actions/speaking";
import { auth } from "@/lib/auth";

// Demo criteria - will be calculated from real session data later
const DEMO_CRITERIA: CriteriaItem[] = [
  { title: "Vocabulary", score: 95 },
  { title: "Grammar", score: 92 },
  { title: "Pronounciation", score: 93 },
  { title: "Fluency", score: 85 },
  { title: "Coherence", score: 83 },
];

export default async function SpeakingPage() {
  // Get user from auth session
  const session = await auth();
  const userId = session?.user?.id;

  // Only fetch data if user is authenticated
  // Unauthenticated users will see block UI from ProtectedRoute in SpeakingPageClient
  if (!userId) {
    // Pass empty data - ProtectedRoute will show block UI before content
    return (
      <SpeakingPageClient
        topicGroups={[]}
        scenarios={[]}
        demoCriteria={DEMO_CRITERIA}
        historyGraphData={[]}
        historyTopicsData={[]}
        userId=""
      />
    );
  }

  // Fetch real data from database
  const [topicGroups, scenarios, historyData] = await Promise.all([
    getSpeakingTopicGroups(),
    getSpeakingScenariosWithProgress(userId),
    getUserSpeakingHistory(userId),
  ]);

  return (
    <SpeakingPageClient
      topicGroups={topicGroups}
      scenarios={scenarios}
      demoCriteria={DEMO_CRITERIA}
      historyGraphData={historyData.historyGraph}
      historyTopicsData={historyData.historyTopics}
      userId={userId}
    />
  );
}

