import SpeakingPageClient from "@/components/page/SpeakingPageClient";
import type { CriteriaItem } from "@/components/page/SpeakingPageClient";
import { getUserSpeakingHistory } from "@/actions/speaking";
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
        demoCriteria={DEMO_CRITERIA}
        historyGraphData={[]}
        historyTopicsData={[]}
        userId=""
      />
    );
  }

  // Fetch history data from database
  // Topic groups are now fetched client-side for better loading experience
  const historyData = await getUserSpeakingHistory(userId);

  return (
    <SpeakingPageClient
      demoCriteria={DEMO_CRITERIA}
      historyGraphData={historyData.historyGraph}
      historyTopicsData={historyData.historyTopics}
      userId={userId}
    />
  );
}


