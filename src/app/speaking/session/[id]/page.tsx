
import SpeakingSessionClient from "@/components/page/SpeakingSessionClient";
import type {
  ScenarioData,
  InitialTurn,
  LearningRecord,
  DetailedFeedbackData,
} from "@/components/page/SpeakingSessionClient";
import { prisma } from "@/lib/prisma";

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

  let scenario: ScenarioData | null = null;
  let initialTurns: InitialTurn[] = [];

  // 1. Try to find as Scenario
  const dbScenario = await prisma.speakingScenario.findUnique({
    where: { id },
  });

  if (dbScenario) {
    scenario = {
      id: dbScenario.id,
      title: dbScenario.title,
      context: dbScenario.context,
      goal: dbScenario.goal,
    };
    // No initial turns for a fresh scenario (unless we fetch previous sessions, but let's keep it simple)
  } else {
    // 2. Try to find as Session
    const dbSession = await prisma.speakingSession.findUnique({
      where: { id },
      include: {
        scenario: true,
        turns: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (dbSession) {
      scenario = {
        id: dbSession.scenario.id,
        title: dbSession.scenario.title,
        context: dbSession.scenario.context,
        goal: dbSession.scenario.goal,
      };

      initialTurns = dbSession.turns.map((t: any) => ({
        id: t.id,
        role: t.role === "user" ? "user" : "tutor",
        text: t.text,
        timestamp: t.timestamp.toISOString(),
        scores: {
          pronunciation: t.pronunciationScore || 0,
          fluency: t.fluencyScore || 0,
          grammar: t.grammarScore || 0,
          content: t.contentScore || 0,
        }
      }));
    }
  }

  // If still null, return 404 or empty state
  // We'll let the client handle null scenario

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
