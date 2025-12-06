// Server Component - No "use client" directive
// Data fetching happens here on the server

import SpeakingSessionClient from "@/components/page/SpeakingSessionClient";
import type {
  ScenarioData,
  InitialTurn,
  LearningRecord,
  DetailedFeedbackData,
} from "@/components/page/SpeakingSessionClient";
import {
  mockSpeakingScenarios,
  mockSpeakingTurns,
  mockCustomScenarios,
} from "@/lib/mock-data";

// Helper function to find scenario
function findScenario(scenarioId: string): ScenarioData | null {
  const allScenarios = Object.values(mockSpeakingScenarios)
    .reduce((acc, curr) => [...acc, ...curr], [])
    .concat(mockCustomScenarios);

  let found = allScenarios.find((s) => s.id === scenarioId);

  if (!found) {
    const numeric = Number.parseInt(scenarioId, 10);
    if (!isNaN(numeric) && numeric > 0 && numeric <= allScenarios.length) {
      found = allScenarios[numeric - 1];
    }
  }

  if (!found) {
    const normalized = (id: string) => id.replace(/[-_]/g, "").toLowerCase();
    const normalizedScenarioId = normalized(scenarioId);
    found = allScenarios.find((s) => normalized(s.id) === normalizedScenarioId);
  }

  if (!found) {
    return null;
  }

  return {
    id: found.id,
    title: found.title,
    context: found.context,
    goal: found.goal,
  };
}

// Mock learning records
const mockLearningRecords: LearningRecord[] = [
  {
    id: "record-1",
    overallScore: 74,
    completedTurns: 2,
    totalTurns: 3,
    date: new Date("2025-07-28T00:30:00"),
  },
  {
    id: "record-2",
    overallScore: 36,
    completedTurns: 2,
    totalTurns: 3,
    date: new Date("2025-07-28T06:50:00"),
  },
  {
    id: "record-3",
    overallScore: 18,
    completedTurns: 2,
    totalTurns: 3,
    date: new Date("2025-07-28T09:53:00"),
  },
];

// Mock detailed feedback (without icon - icons are rendered in client)
const mockDetailedFeedback: DetailedFeedbackData = {
  scores: [
    { label: "Relevance", value: 86 },
    { label: "Pronunciation", value: 90 },
    { label: "Intonation & Stress", value: 71 },
    { label: "Fluency", value: 80 },
    { label: "Grammar", value: 85 },
  ],
  errorCategories: [
    { name: "Prepositions", count: 10 },
    { name: "Articles", count: 3 },
    { name: "Verb Tense Conjugation", count: 7 },
    { name: "Adjective Choice", count: 9 },
    { name: "Verb Choice", count: 1 },
  ],
  conversation: [
    {
      role: "tutor" as const,
      text: "Ugh, this room feels smaller every day. No light, no space. I'm so over it. I need a real house with actual windows and breathing room!",
    },
    {
      role: "user" as const,
      text: "Same for me. Actually, I feel dizzy with this such small room already, and I need [...] small hug house with a swimming pool working closes and also the home theater.",
      userErrors: [
        { word: "with", correction: "in", type: "Prepositions" },
        { word: "such", correction: "this", type: "Articles" },
        { word: "working", correction: "that", type: "Verb Choice" },
        { word: "the", correction: "a", type: "Articles" },
      ],
      correctedSentence:
        "Same for me. Actually, I feel dizzy in this small room already, and I need a small hug house with a swimming pool that closes and also a home theater.",
      audioUrl: "/audio/user-response.mp3",
    },
  ],
  overallRating: "Good",
  tip: "Your grammar needs improvement. Please pay attention to tenses, types, and sentence structure. Keep trying!",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeakingSessionPage({ params }: PageProps) {
  const { id: scenarioId } = await params;

  // Find scenario on server
  const scenario = findScenario(scenarioId);

  // Get initial turns and serialize dates
  const firstTurn = mockSpeakingTurns.session1[0];
  const initialTurns: InitialTurn[] = firstTurn
    ? [
        {
          id: firstTurn.id,
          role: firstTurn.role,
          text: firstTurn.text,
          timestamp: firstTurn.timestamp.toISOString(),
          scores: firstTurn.scores,
        },
      ]
    : [];

  return (
    <SpeakingSessionClient
      scenarioId={scenarioId}
      scenario={scenario}
      initialTurns={initialTurns}
      learningRecords={mockLearningRecords}
      detailedFeedback={mockDetailedFeedback}
    />
  );
}
