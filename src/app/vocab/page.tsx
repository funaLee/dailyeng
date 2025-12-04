import { getVocabTopics } from "@/lib/data/vocab";
import { VocabDashboard } from "@/components/vocab/vocab-dashboard";

export const metadata = {
  title: "Vocabulary Hub | DailyEng",
  description:
    "Build your vocabulary with interactive lessons and spaced repetition.",
};

export default async function VocabPage() {
  const topics = await getVocabTopics();

  return <VocabDashboard initialTopics={topics} />;
}
