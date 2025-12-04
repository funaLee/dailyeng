import { getSpeakingScenarios } from "@/lib/data/speaking";
import { SpeakingDashboard } from "@/components/speaking/speaking-dashboard";

export const metadata = {
  title: "Speaking Room | DailyEng",
  description: "Practice your speaking skills with AI-powered conversations.",
};

export default async function SpeakingPage() {
  const scenarios = await getSpeakingScenarios();

  return <SpeakingDashboard initialScenarios={scenarios} />;
}
