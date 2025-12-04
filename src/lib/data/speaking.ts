import { mockSpeakingScenarios } from "@/lib/mock-data";

export async function getSpeakingScenarios(filters?: {
  level?: string;
  category?: string;
}) {
  // Using mock data instead of database
  // Flatten the categorized scenarios into a single array
  const allScenarios = Object.entries(mockSpeakingScenarios).flatMap(
    ([category, scenarios]) =>
      scenarios.map((scenario) => ({
        ...scenario,
        category: category,
        subcategory: category,
        image: "png1",
        objectives: [],
        keyExpressions: [],
        totalSessions: 5,
        estimatedMinutes: 15,
        sessionsCompleted: 0,
        progress: 0,
        duration: 15,
        level: scenario.difficulty || "A2",
      }))
  );

  let result = allScenarios;

  if (filters?.level) {
    result = result.filter((s) => s.level === filters.level);
  }

  if (filters?.category) {
    result = result.filter((s) => s.category === filters.category);
  }

  return result;
}
