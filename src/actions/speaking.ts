"use server";

import { prisma } from "@/lib/prisma";
import {
  generateSpeakingResponse,
  generateScenario,
  analyzeSessionConversation,
  SessionAnalysisResult,
} from "@/lib/gemini";
import { revalidatePath } from "next/cache";

// Helper to ensure user exists (Temporary for dev until real auth)
async function ensureUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: userId,
        name: "Demo User",
        email: `demo-${userId}@example.com`,
        password: "password123", // Mock
        level: "B1",
      },
    });
  }
}

// Fetch topics
export async function getTopics() {
  return await prisma.speakingScenario.findMany({
    where: { isCustom: false },
    include: {
      topic: true,
    },
  });
}

// Helper to capitalize first letter of each word
function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Fetch TopicGroups for Speaking Hub
export async function getSpeakingTopicGroups() {
  const groups = await prisma.topicGroup.findMany({
    where: { hubType: "speaking" },
    orderBy: { order: "asc" },
  });

  // Transform to UI format (capitalize names)
  return groups.map((g) => ({
    id: g.id,
    name: toTitleCase(g.name),
    subcategories: g.subcategories.map((s) => toTitleCase(s)),
  }));
}

// Fetch all Speaking Scenarios with user progress (with pagination)
export async function getSpeakingScenariosWithProgress(
  userId?: string,
  options?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    levels?: string[];
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 12;
  const skip = (page - 1) * limit;

  // Build where clause with optional filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    isCustom: false,
    topicGroupId: { not: null },
  };

  if (options?.category) {
    where.category = options.category.toLowerCase();
  }
  if (options?.subcategory && options.subcategory !== "All") {
    where.subcategory = options.subcategory.toLowerCase();
  }
  if (options?.levels && options.levels.length > 0) {
    where.difficulty = { in: options.levels };
  }

  const [scenarios, total] = await Promise.all([
    prisma.speakingScenario.findMany({
      where,
      include: {
        sessions: userId
          ? {
              where: { userId },
              select: { id: true, overallScore: true },
            }
          : false,
      },
      orderBy: [
        { category: "asc" },
        { subcategory: "asc" },
        { difficulty: "asc" },
      ],
      skip,
      take: limit,
    }),
    prisma.speakingScenario.count({ where }),
  ]);

  // Transform to UI Scenario format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = scenarios.map((s: any) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category ? toTitleCase(s.category) : "General",
    subcategory: s.subcategory ? toTitleCase(s.subcategory) : undefined,
    level: s.difficulty || "B1",
    image: s.image || "/learning.png",
    sessionsCompleted: Array.isArray(s.sessions) ? s.sessions.length : 0,
    totalSessions: 10, // Default target
    progress: Array.isArray(s.sessions)
      ? Math.min(s.sessions.length * 10, 100)
      : 0,
    isCustom: s.isCustom,
  }));

  return {
    scenarios: items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// Search speaking scenarios by title/description
export async function searchSpeakingScenarios(query: string, userId?: string) {
  if (!query.trim()) return [];

  const scenarios = await prisma.speakingScenario.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
      topicGroupId: { not: null },
    },
    take: 50, // Limit search results
    orderBy: { title: "asc" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return scenarios.map((s: any) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category ? toTitleCase(s.category) : "General",
    subcategory: s.subcategory ? toTitleCase(s.subcategory) : undefined,
    level: s.difficulty || "B1",
    image: s.image || "/learning.png",
    sessionsCompleted: 0,
    totalSessions: 10,
    progress: 0,
    isCustom: s.isCustom,
  }));
}

// Fetch user's speaking session history
export async function getScenarioById(id: string) {
  const scenario = await prisma.speakingScenario.findUnique({
    where: { id },
  });

  if (!scenario) return null;

  return {
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
    context: scenario.context,
    goal: scenario.goal,
    objectives: (scenario.objectives as string[]) || undefined,
    userRole: scenario.userRole || undefined,
    botRole: scenario.botRole || undefined,
    openingLine: scenario.openingLine || undefined,
  };
}

// Fetch user's speaking session history
export async function getUserSpeakingHistory(userId: string) {
  await ensureUser(userId);

  const sessions = await prisma.speakingSession.findMany({
    where: {
      userId,
      endedAt: { not: null }, // Only completed sessions
    },
    include: {
      scenario: true,
    },
    orderBy: { endedAt: "desc" },
    take: 20, // Limit to recent 20 sessions
  });

  // Transform for History tab
  const historyTopics = sessions.map((s) => ({
    id: s.id,
    title: s.scenario.title,
    description: s.scenario.description,
    score: s.overallScore || 0,
    date:
      s.endedAt?.toISOString().split("T")[0] ||
      s.createdAt.toISOString().split("T")[0],
    level: s.scenario.difficulty || "B1",
    image: s.scenario.image || "/learning.png",
    progress: 100, // Completed
    wordCount: 0, // Would need to count from turns
  }));

  // Build history graph from recent sessions
  const historyGraph = sessions
    .slice(0, 10)
    .reverse()
    .map((s, i) => ({
      session: i + 1,
      score: s.overallScore || 0,
    }));

  return { historyTopics, historyGraph };
}

// Fetch custom topics for a user
export async function getCustomTopics(userId: string) {
  await ensureUser(userId);
  return await prisma.speakingScenario.findMany({
    where: {
      isCustom: true,
      createdById: userId,
    },
    orderBy: { id: "desc" },
  });
}

// Create custom scenario
export async function createCustomScenario(
  userId: string,
  topicPrompt: string
) {
  await ensureUser(userId);
  const generated = await generateScenario(topicPrompt);

  const scenario = await prisma.speakingScenario.create({
    data: {
      title: generated.title,
      description: generated.description,
      goal: generated.goal,
      difficulty: generated.level as any, // Cast to enum
      context: generated.context,
      image: generated.image,
      isCustom: true,
      createdById: userId,
      category: "Custom",
    },
  });

  revalidatePath("/speaking");
  return scenario;
}

// Mock scenarios data for database seeding (matches UI mock data)
const mockScenariosData: Record<
  string,
  {
    title: string;
    description: string;
    goal: string;
    context: string;
    userRole: string;
    botRole: string;
    openingLine: string;
  }
> = {
  "scenario-1": {
    title: "Coffee Shop Ordering",
    description: "Practice ordering drinks and snacks at a coffee shop",
    goal: "Successfully order your preferred coffee drink with any customizations",
    context:
      "You are at a busy coffee shop during morning rush hour. The barista is ready to take your order.",
    userRole: "Customer",
    botRole: "Barista",
    openingLine:
      "Good morning! Welcome to Daily Brew. What can I get started for you today?",
  },
  "scenario-2": {
    title: "Job Interview",
    description: "Practice answering common interview questions",
    goal: "Make a great impression and answer interview questions confidently",
    context:
      "You are in a job interview for a position you really want. The interviewer is professional but friendly.",
    userRole: "Job Applicant",
    botRole: "HR Interviewer",
    openingLine:
      "Hello! Thank you for coming in today. Please, have a seat. I'm excited to learn more about you. Let's start - could you tell me a bit about yourself?",
  },
  "scenario-3": {
    title: "Hotel Check-in",
    description: "Practice checking into a hotel",
    goal: "Complete the check-in process and get information about the hotel",
    context:
      "You have just arrived at a hotel after a long journey. The receptionist is waiting to help you.",
    userRole: "Hotel Guest",
    botRole: "Hotel Receptionist",
    openingLine:
      "Good evening! Welcome to The Grand Hotel. How may I assist you today?",
  },
  "scenario-4": {
    title: "Restaurant Reservation",
    description: "Practice making a restaurant reservation by phone",
    goal: "Successfully book a table for your party",
    context:
      "You want to make a dinner reservation at a popular restaurant for a special occasion.",
    userRole: "Customer",
    botRole: "Restaurant Host",
    openingLine:
      "Good afternoon, thank you for calling Bella Italia. This is Maria speaking. How may I help you today?",
  },
  "scenario-5": {
    title: "Doctor's Appointment",
    description: "Practice describing symptoms to a doctor",
    goal: "Clearly describe your symptoms and understand the doctor's advice",
    context:
      "You are visiting a doctor because you haven't been feeling well lately.",
    userRole: "Patient",
    botRole: "Doctor",
    openingLine:
      "Hello! Please come in and have a seat. I'm Dr. Smith. I see from your chart that you've been feeling unwell. Can you tell me what's been bothering you?",
  },
};

// Helper to ensure scenario exists (Temporary for dev until proper seeding)
async function ensureScenario(scenarioId: string) {
  const scenario = await prisma.speakingScenario.findUnique({
    where: { id: scenarioId },
  });

  if (!scenario) {
    // Get scenario data from mock or use default
    const mockData = mockScenariosData[scenarioId];

    await prisma.speakingScenario.create({
      data: {
        id: scenarioId,
        title: mockData?.title || `Demo Scenario ${scenarioId}`,
        description:
          mockData?.description || "A demo speaking scenario for practice",
        goal:
          mockData?.goal ||
          "Practice speaking in English and improve your fluency",
        difficulty: "B1",
        context:
          mockData?.context ||
          "You are having a casual conversation with an AI tutor.",
        category: "General",
        isCustom: false,
        // Role definitions
        userRole: mockData?.userRole || "Learner",
        botRole: mockData?.botRole || "English Tutor",
        openingLine:
          mockData?.openingLine ||
          "Hello! I'm your English tutor. How can I help you practice today?",
      },
    });
  }
}

// Create Session (basic, without greeting)
export async function createSession(userId: string, scenarioId: string) {
  await ensureUser(userId);
  await ensureScenario(scenarioId);
  return await prisma.speakingSession.create({
    data: {
      userId,
      scenarioId,
    },
  });
}

// Create Session with Opening Greeting (Option A)
export async function startSessionWithGreeting(
  userId: string,
  scenarioId: string
) {
  await ensureUser(userId);
  await ensureScenario(scenarioId);

  // 1. Create session with scenario data
  const session = await prisma.speakingSession.create({
    data: {
      userId,
      scenarioId,
    },
    include: { scenario: true },
  });

  // 2. Save opening greeting as first turn (if exists)
  let greetingTurn = null;
  if (session.scenario.openingLine) {
    greetingTurn = await prisma.speakingTurn.create({
      data: {
        sessionId: session.id,
        role: "tutor",
        text: session.scenario.openingLine,
      },
    });
  }

  return {
    session,
    contextMessage: session.scenario.context,
    greetingMessage: session.scenario.openingLine,
    greetingTurnId: greetingTurn?.id,
  };
}

// Submit Turn - Simplified: Only saves text, no realtime scoring
export async function submitTurn(
  sessionId: string,
  userText: string,
  audioUrl: string | null = null
) {
  // 1. Get Session and Scenario Context
  const session = await prisma.speakingSession.findUnique({
    where: { id: sessionId },
    include: {
      scenario: true,
      turns: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!session) throw new Error("Session not found");

  // 2. Prepare History for AI
  const history = session.turns.map((t: any) => ({
    role: t.role === "user" ? "user" : ("model" as "user" | "model"),
    text: t.text,
  }));

  // 3. Call Gemini with scenario config (only getting response, no scoring)
  const scenarioConfig = {
    context: session.scenario.context,
    userRole: session.scenario.userRole || undefined,
    botRole: session.scenario.botRole || undefined,
    goal: session.scenario.goal || undefined,
    level: session.scenario.difficulty || undefined,
  };
  const aiResult = await generateSpeakingResponse(
    scenarioConfig,
    history,
    userText
  );

  // 4. Save User Turn (no scores - will be calculated after session ends)
  const userTurn = await prisma.speakingTurn.create({
    data: {
      sessionId,
      role: "user",
      text: userText,
      audioUrl: audioUrl,
    },
  });

  // 5. Save AI Turn
  const aiTurn = await prisma.speakingTurn.create({
    data: {
      sessionId,
      role: "tutor",
      text: aiResult.response,
    },
  });

  return {
    aiResponse: aiResult.response,
    userTurnId: userTurn.id,
    aiTurnId: aiTurn.id,
  };
}

export async function getSessionHistory(userId: string) {
  await ensureUser(userId);
  const sessions = await prisma.speakingSession.findMany({
    where: { userId },
    include: {
      scenario: true,
      turns: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform to frontend format if needed
  // For now returning raw
  return sessions;
}

export async function getOrCreateFreeTalkScenario(userId: string) {
  await ensureUser(userId);

  // Check if Free Talk scenario exists (globally or for user)
  // We'll make a global one or a specific custom logic.
  // Let's make a system-wide Free Talk scenario if possible, or a custom one if strict.
  // For simplicity, let's create a "Free Talk" custom scenario if not found.

  const freeTalkTitle = "Free Talk Mode";

  let scenario = await prisma.speakingScenario.findFirst({
    where: {
      title: freeTalkTitle,
      isCustom: true,
      createdById: userId,
    },
  });

  if (!scenario) {
    scenario = await prisma.speakingScenario.create({
      data: {
        title: freeTalkTitle,
        description:
          "Open conversation with AI tutor. Talk about anything you want!",
        goal: "Practice free conversation",
        difficulty: "B1", // Default
        context:
          "You are having a casual conversation with a friendly AI tutor.",
        image: "/scenarios/free-talk.png", // Ensure this image path is handled or generic
        isCustom: true,
        createdById: userId, // Link to user so they own it
        category: "Custom",
      },
    });
  }

  return scenario;
}

// ============================================================================
// NEW: Analyze and Score Session - Called after session ends
// Replaces getSessionSummary and getDetailedFeedback
// ============================================================================
export async function analyzeAndScoreSession(sessionId: string): Promise<{
  sessionAnalysis: SessionAnalysisResult;
  scores: {
    grammar: number;
    relevance: number;
    fluency: number;
    pronunciation: number;
    intonation: number;
    overall: number;
  };
  errorCategories: { name: string; count: number }[];
  conversation: {
    role: "user" | "tutor";
    text: string;
    turnId: string;
    userErrors?: {
      word: string;
      correction: string;
      type: string;
      startIndex: number;
      endIndex: number;
    }[];
  }[];
}> {
  console.log("[analyzeAndScoreSession] Starting for session:", sessionId);

  // 1. Get session with all turns
  const session = await prisma.speakingSession.findUnique({
    where: { id: sessionId },
    include: {
      scenario: true,
      turns: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!session) throw new Error("Session not found");

  // 2. Prepare turns for Gemini analysis
  const turnsForAnalysis = session.turns.map((t: any) => ({
    role: t.role as "user" | "tutor",
    text: t.text,
    id: t.id,
  }));

  // 3. Call Gemini to analyze the entire session
  const analysisResult = await analyzeSessionConversation(
    session.scenario.context,
    turnsForAnalysis
  );

  console.log(
    "[analyzeAndScoreSession] Gemini analysis complete - grammar:",
    analysisResult.grammarScore
  );

  // 4. Get user turns for saving errors
  const userTurns = session.turns.filter((t: any) => t.role === "user");

  // 5. Save errors to database for each user turn
  for (const turnAnalysis of analysisResult.turnAnalyses) {
    const userTurn = userTurns[turnAnalysis.turnIndex];
    if (!userTurn) continue;

    // Delete old errors first (if re-analyzing)
    await prisma.speakingTurnError.deleteMany({
      where: { turnId: userTurn.id },
    });

    // Save new errors with positions
    if (turnAnalysis.errors.length > 0) {
      await prisma.speakingTurnError.createMany({
        data: turnAnalysis.errors.map((err) => ({
          turnId: userTurn.id,
          word: err.word,
          correction: err.correction,
          errorType: err.errorType,
          startIndex: err.startIndex,
          endIndex: err.endIndex,
        })),
      });
    }
  }

  // 6. Calculate scores (fluency, pronunciation, intonation default to 70 for now)
  const fluencyScore = 70;
  const pronunciationScore = 70;
  const intonationScore = 70;

  const overallScore = Math.round(
    (analysisResult.grammarScore +
      analysisResult.relevanceScore +
      fluencyScore +
      pronunciationScore +
      intonationScore) /
      5
  );

  // 7. Update session with scores and feedback
  await prisma.speakingSession.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      duration: Math.round((Date.now() - session.createdAt.getTime()) / 1000),
      overallScore,
      grammarScore: analysisResult.grammarScore,
      relevanceScore: analysisResult.relevanceScore,
      fluencyScore,
      pronunciationScore,
      intonationScore,
      feedbackTitle: analysisResult.feedbackTitle,
      feedbackSummary: analysisResult.feedbackSummary,
      feedbackRating: analysisResult.feedbackRating,
      feedbackTip: analysisResult.feedbackTip,
    },
  });

  // 8. Calculate error categories
  const errorCategoryMap: Record<string, number> = {};
  for (const turnAnalysis of analysisResult.turnAnalyses) {
    for (const err of turnAnalysis.errors) {
      errorCategoryMap[err.errorType] =
        (errorCategoryMap[err.errorType] || 0) + 1;
    }
  }
  const errorCategories = Object.entries(errorCategoryMap).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  // 9. Build conversation with errors for frontend
  const conversation = session.turns.map((t: any) => {
    const turnAnalysis = analysisResult.turnAnalyses.find(
      (ta) => userTurns[ta.turnIndex]?.id === t.id
    );

    return {
      role: t.role as "user" | "tutor",
      text: t.text,
      turnId: t.id,
      userErrors:
        turnAnalysis?.errors.map((err) => ({
          word: err.word,
          correction: err.correction,
          type: err.errorType,
          startIndex: err.startIndex,
          endIndex: err.endIndex,
        })) || [],
    };
  });

  console.log(
    "[analyzeAndScoreSession] Complete - overall score:",
    overallScore
  );

  return {
    sessionAnalysis: analysisResult,
    scores: {
      grammar: analysisResult.grammarScore,
      relevance: analysisResult.relevanceScore,
      fluency: fluencyScore,
      pronunciation: pronunciationScore,
      intonation: intonationScore,
      overall: overallScore,
    },
    errorCategories,
    conversation,
  };
}
