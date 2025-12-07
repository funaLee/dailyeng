/**
 * Database queries for Speaking feature
 * Server-side only - for use in Server Components
 */

import { prisma } from "@/lib/prisma";
import type { Level } from "@prisma/client";

// ============================================
// Types for Speaking Page
// ============================================

export interface ScenarioFromDB {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  image: string;
  sessionsCompleted: number;
  totalSessions: number;
  progress: number;
  duration: number;
}

export interface TopicGroupFromDB {
  name: string;
  subcategories: string[];
}

export interface SessionHistoryFromDB {
  id: string;
  title: string;
  description: string;
  score: number;
  date: string;
  level: string;
  image: string;
  progress: number;
  wordCount: number;
}

// ============================================
// Types for Speaking Session Page
// ============================================

export interface ScenarioDataFromDB {
  id: string;
  title: string;
  context: string;
  goal: string;
}

export interface InitialTurnFromDB {
  id: string;
  role: "user" | "tutor";
  text: string;
  timestamp: string;
  scores?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    content?: number;
  };
}

export interface LearningRecordFromDB {
  id: string;
  overallScore: number;
  completedTurns: number;
  totalTurns: number;
  date: string;
}

// ============================================
// Database Query Functions
// ============================================

/**
 * Get all speaking scenarios grouped by category for the main speaking page
 */
export async function getSpeakingScenarios(
  userId?: string
): Promise<ScenarioFromDB[]> {
  const scenarios = await prisma.speakingScenario.findMany({
    include: {
      sessions: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
      _count: {
        select: { sessions: true },
      },
    },
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  return scenarios.map((scenario) => {
    const sessionsCompleted = userId
      ? (scenario.sessions as { id: string }[])?.length || 0
      : 0;
    // Assuming 5 sessions as default total for progress tracking
    const totalSessions = 5;

    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      category: scenario.category || "General",
      level: scenario.difficulty || "B1",
      image: scenario.image || "/learning.png",
      sessionsCompleted,
      totalSessions,
      progress: Math.round((sessionsCompleted / totalSessions) * 100),
      duration: scenario.duration || 10,
    };
  });
}

/**
 * Get unique topic groups (categories) with their subcategories
 */
export async function getTopicGroups(): Promise<TopicGroupFromDB[]> {
  const scenarios = await prisma.speakingScenario.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
    where: {
      category: { not: null },
    },
  });

  // Group scenarios by category
  const categoryGroups = scenarios
    .filter((s) => s.category)
    .map((s) => ({
      name: s.category as string,
      subcategories: [] as string[], // Subcategories could be expanded later
    }));

  // Fallback if no categories found
  if (categoryGroups.length === 0) {
    return [
      {
        name: "Daily Life",
        subcategories: ["Shopping", "Dining", "Healthcare", "Transportation"],
      },
      {
        name: "Professional English",
        subcategories: [
          "Meetings",
          "Presentations",
          "Negotiations",
          "Interviews",
        ],
      },
      {
        name: "Academic",
        subcategories: ["Lectures", "Discussions", "Research", "Presentations"],
      },
      {
        name: "Business",
        subcategories: ["Marketing", "Sales", "Finance", "Management"],
      },
      {
        name: "Travel",
        subcategories: ["Hotels", "Airports", "Tourist Sites", "Emergency"],
      },
      {
        name: "Social Situations",
        subcategories: ["Parties", "Small Talk", "Making Friends", "Dating"],
      },
    ];
  }

  return categoryGroups;
}

/**
 * Get user's speaking session history for the history tab
 */
export async function getUserSessionHistory(
  userId: string
): Promise<SessionHistoryFromDB[]> {
  const sessions = await prisma.speakingSession.findMany({
    where: { userId },
    include: {
      scenario: true,
      turns: {
        select: {
          grammarScore: true,
          fluencyScore: true,
          pronunciationScore: true,
          contentScore: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return sessions.map((session) => {
    // Calculate average score from turns
    const scores = session.turns
      .map((t) => {
        const avgTurnScore =
          ((t.grammarScore || 0) +
            (t.fluencyScore || 0) +
            (t.pronunciationScore || 0) +
            (t.contentScore || 0)) /
          4;
        return avgTurnScore;
      })
      .filter((s) => s > 0);

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
      id: session.id,
      title: session.scenario.title,
      description: session.scenario.description,
      score: avgScore,
      date: session.createdAt.toISOString().split("T")[0],
      level: session.scenario.difficulty || "B1",
      image: session.scenario.image || "/learning.png",
      progress: 100, // Completed sessions are 100% progress
      wordCount: session.turns.length,
    };
  });
}

/**
 * Get a specific scenario by ID for the session page
 */
export async function getScenarioById(
  scenarioId: string
): Promise<ScenarioDataFromDB | null> {
  const scenario = await prisma.speakingScenario.findUnique({
    where: { id: scenarioId },
  });

  if (!scenario) {
    return null;
  }

  return {
    id: scenario.id,
    title: scenario.title,
    context: scenario.context,
    goal: scenario.goal,
  };
}

/**
 * Get speaking session with turns for displaying conversation history
 */
export async function getSessionWithTurns(
  sessionId: string
): Promise<{ turns: InitialTurnFromDB[] } | null> {
  const session = await prisma.speakingSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: {
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (!session) {
    return null;
  }

  return {
    turns: session.turns.map((turn) => ({
      id: turn.id,
      role: turn.role as "user" | "tutor",
      text: turn.text,
      timestamp: turn.timestamp.toISOString(),
      scores: {
        pronunciation: turn.pronunciationScore || undefined,
        fluency: turn.fluencyScore || undefined,
        grammar: turn.grammarScore || undefined,
        content: turn.contentScore || undefined,
      },
    })),
  };
}

/**
 * Get user's learning records (completed sessions) for a specific scenario
 */
export async function getUserLearningRecords(
  userId: string,
  scenarioId: string
): Promise<LearningRecordFromDB[]> {
  const sessions = await prisma.speakingSession.findMany({
    where: { userId, scenarioId },
    include: {
      turns: {
        select: {
          grammarScore: true,
          fluencyScore: true,
          pronunciationScore: true,
          contentScore: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return sessions.map((session) => {
    const scores = session.turns
      .map((t) => {
        const avgTurnScore =
          ((t.grammarScore || 0) +
            (t.fluencyScore || 0) +
            (t.pronunciationScore || 0) +
            (t.contentScore || 0)) /
          4;
        return avgTurnScore;
      })
      .filter((s) => s > 0);

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
      id: session.id,
      overallScore: avgScore,
      completedTurns: session.turns.filter((t) => t.grammarScore !== null)
        .length,
      totalTurns: session.turns.length,
      date: session.createdAt.toISOString(),
    };
  });
}

/**
 * Get the initial greeting turn for a new session
 * This creates a tutor greeting based on the scenario
 */
export function getInitialTutorGreeting(
  scenario: ScenarioDataFromDB
): InitialTurnFromDB {
  // Generate a contextual greeting based on scenario
  const greetings: Record<string, string> = {
    cafe: "Welcome to the café! What can I get for you today?",
    hotel: "Good afternoon! Welcome to our hotel. How may I help you?",
    meeting:
      "Good morning everyone. Let's get started with our team meeting. Who would like to share their updates first?",
    default: `Hello! ${scenario.context} How can I help you today?`,
  };

  const greeting =
    greetings[scenario.id.toLowerCase()] || greetings["default"];

  return {
    id: "initial-turn",
    role: "tutor",
    text: greeting,
    timestamp: new Date().toISOString(),
    scores: {
      pronunciation: 100,
      fluency: 100,
      grammar: 100,
      content: 100,
    },
  };
}
