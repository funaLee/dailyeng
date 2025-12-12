import SpeakingSessionClient from "@/components/page/SpeakingSessionClient";
import type {
  InitialTurn,
  DetailedFeedbackData,
} from "@/components/page/SpeakingSessionClient";
import { getScenarioById } from "@/actions/speaking";

// Mock data for fallback or initial props
const mockDetailedFeedback: DetailedFeedbackData = {
  scores: [
    { label: "Relevance", value: 0 },
    { label: "Pronunciation", value: 0 },
    { label: "Intonation & Stress", value: 0 },
    { label: "Fluency", value: 0 },
    { label: "Grammar", value: 0 },
  ],
  errorCategories: [],
  conversation: [],
  overallRating: "N/A",
  tip: "Start speaking to get feedback!",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeakingSessionPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch real scenario from database
  const scenario = await getScenarioById(id);
  const initialTurns: InitialTurn[] = [];

  // If scenario not found, the client will handle the null case

  return (
    <SpeakingSessionClient
      // Pass the resolved scenario.id as the "scenarioId" prop to client
      scenario={scenario}
      initialTurns={initialTurns}
      learningRecords={[]} // TODO: Fetch real records if needed
      detailedFeedback={mockDetailedFeedback}
      scenarioId={scenario ? scenario.id : id}
    />
  );
}
