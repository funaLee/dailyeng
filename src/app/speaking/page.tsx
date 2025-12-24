import SpeakingPageClient from "@/components/page/SpeakingPageClient";
import type { CriteriaItem } from "@/components/page/SpeakingPageClient";
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
  const userId = session?.user?.id || "";

  // Render immediately - all data is fetched client-side for better loading UX
  // History data is lazy-loaded via getSpeakingHistoryStats and getSpeakingHistorySessions
  // Topic groups are fetched client-side via getSpeakingTopicGroups
  // Scenarios are fetched client-side via getSpeakingScenariosWithProgress
  return <SpeakingPageClient demoCriteria={DEMO_CRITERIA} userId={userId} />;
}


