import SpeakingSessionClient from "@/components/page/SpeakingSessionClient";

// Mock data - will be replaced with actual data fetching from DB/API later
const mockFreeTalkScenario = {
  id: "free-talk-1",
  title: "Free Talk Practice",
  description: "Practice speaking about any topic you like",
  context:
    "This is an open conversation where you can practice speaking about anything. The AI tutor will engage with you on any topic and provide feedback on your speaking.",
  goal: "Practice natural conversation and improve your speaking fluency",
};

export default async function FreeTalkPage() {
  // TODO: Real auth
  const userId = "user-1";

  // Mock data - will be replaced with actual data fetching from DB/API later
  const scenario = mockFreeTalkScenario;

  return (
    <SpeakingSessionClient
      scenarioId={scenario.id}
      scenario={{
        id: scenario.id,
        title: scenario.title,
        context: scenario.context,
        goal: scenario.goal,
      }}
      initialTurns={[]}
      learningRecords={[]} // Empty for new session
      detailedFeedback={{
        // Initial empty feedback
        scores: [
          { label: "Pronunciation", value: 0 },
          { label: "Fluency", value: 0 },
          { label: "Grammar", value: 0 },
          { label: "Relevance", value: 0 },
          { label: "Intonation & Stress", value: 0 },
        ],
        errorCategories: [],
        conversation: [],
        overallRating: "Ready to start",
        tip: "Start speaking to get feedback.",
      }}
    />
  );
}
