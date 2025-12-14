import SpeakingSessionClient from "@/components/page/SpeakingSessionClient";
import type {
  InitialTurn,
  DetailedFeedbackData,
  LearningRecord,
} from "@/components/page/SpeakingSessionClient";
import {
  getScenarioById,
  getLearningRecordsForScenario,
} from "@/actions/speaking";
import { auth } from "@/lib/auth";

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

  // Get authenticated user
  const session = await auth();
  const userId = session?.user?.id || "user-1"; // Fallback for dev

  // Fetch real scenario from database
  const scenario = await getScenarioById(id);
  const initialTurns: InitialTurn[] = [];

  // Fetch learning records (past completed sessions) for this scenario
  let learningRecords: LearningRecord[] = [];
  if (scenario) {
    const records = await getLearningRecordsForScenario(userId, id);
    learningRecords = records.map((r) => ({
      id: r.id,
      overallScore: r.overallScore,
      completedTurns: r.completedTurns,
      totalTurns: r.totalTurns,
      date: r.date,
    }));
  }

  // If scenario not found, the client will handle the null case

  return (
    <SpeakingSessionClient
      // Pass the resolved scenario.id as the "scenarioId" prop to client
      scenario={scenario}
      initialTurns={initialTurns}
      learningRecords={learningRecords}
      detailedFeedback={mockDetailedFeedback}
      scenarioId={scenario ? scenario.id : id}
    />
  );
}

