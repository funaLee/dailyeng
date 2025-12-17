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
    image: scenario.image || "/learning.png",
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

// ============================================================================
// Pexels API Integration for Dynamic Images
// ============================================================================

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
  };
}

interface PexelsResponse {
  total_results: number;
  photos: PexelsPhoto[];
}

/**
 * Fetch an image from Pexels API based on keyword
 * Returns medium-sized image URL or fallback
 */
async function fetchPexelsImage(keyword: string): Promise<string> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

  if (!PEXELS_API_KEY) {
    console.warn(
      "[fetchPexelsImage] PEXELS_API_KEY not found, using fallback image"
    );
    return "/learning.png";
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        keyword
      )}&per_page=3&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error(`[fetchPexelsImage] Pexels API error: ${response.status}`);
      return "/learning.png";
    }

    const data: PexelsResponse = await response.json();

    if (data.photos.length === 0) {
      console.log(`[fetchPexelsImage] No photos found for "${keyword}"`);
      return "/learning.png";
    }

    // Randomly pick from top 3 for variety
    const randomIndex = Math.floor(
      Math.random() * Math.min(3, data.photos.length)
    );
    const imageUrl = data.photos[randomIndex].src.medium;

    console.log(`[fetchPexelsImage] Found image for "${keyword}": ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(
      `[fetchPexelsImage] Error fetching image for "${keyword}":`,
      error
    );
    return "/learning.png";
  }
}

// Create custom scenario with complete data and auto-start session
export async function createCustomScenario(
  userId: string,
  topicPrompt: string
): Promise<{ scenario: any; sessionId: string }> {
  await ensureUser(userId);

  // Get user's current level
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });
  const userLevel = user?.level || "B1";

  // Generate scenario with user's level
  const generated = await generateScenario(topicPrompt, userLevel);

  // Fetch image from Pexels using the generated keyword
  const imageUrl = await fetchPexelsImage(generated.imageKeyword);

  // Create scenario with all fields
  const scenario = await prisma.speakingScenario.create({
    data: {
      title: generated.title,
      description: generated.description,
      goal: generated.goal,
      difficulty: generated.level as any,
      context: generated.context,
      image: imageUrl, // Use Pexels image instead of static
      userRole: generated.userRole,
      botRole: generated.botRole,
      openingLine: generated.openingLine,
      objectives: generated.objectives,
      isCustom: true,
      createdById: userId,
      category: "Custom",
    },
  });

  // Create a session for immediate practice
  const session = await prisma.speakingSession.create({
    data: {
      userId,
      scenarioId: scenario.id,
    },
  });

  // Save opening greeting as first turn
  if (generated.openingLine) {
    await prisma.speakingTurn.create({
      data: {
        sessionId: session.id,
        role: "tutor",
        text: generated.openingLine,
      },
    });
  }

  revalidatePath("/speaking");
  return { scenario, sessionId: session.id };
}

// Create random scenario (Surprise Me feature)
export async function createRandomScenario(
  userId: string
): Promise<{ scenario: any; sessionId: string }> {
  await ensureUser(userId);

  // Get user's current level
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });
  const userLevel = user?.level || "B1";

  // Generate random scenario (pass null as topic)
  const generated = await generateScenario(null, userLevel);

  // Fetch image from Pexels using the generated keyword
  const imageUrl = await fetchPexelsImage(generated.imageKeyword);

  // Create scenario with all fields
  const scenario = await prisma.speakingScenario.create({
    data: {
      title: generated.title,
      description: generated.description,
      goal: generated.goal,
      difficulty: generated.level as any,
      context: generated.context,
      image: imageUrl, // Use Pexels image instead of static
      userRole: generated.userRole,
      botRole: generated.botRole,
      openingLine: generated.openingLine,
      objectives: generated.objectives,
      isCustom: true,
      createdById: userId,
      category: "Random",
    },
  });

  // Create a session for immediate practice
  const session = await prisma.speakingSession.create({
    data: {
      userId,
      scenarioId: scenario.id,
    },
  });

  // Save opening greeting as first turn
  if (generated.openingLine) {
    await prisma.speakingTurn.create({
      data: {
        sessionId: session.id,
        role: "tutor",
        text: generated.openingLine,
      },
    });
  }

  revalidatePath("/speaking");
  return { scenario, sessionId: session.id };
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

// Submit Turn - Now with speech metrics for fluency & pronunciation scoring
export async function submitTurn(
  sessionId: string,
  userText: string,
  audioUrl: string | null = null,
  speechMetrics?: {
    confidenceScores: number[];
    wordCount: number;
    speakingDurationMs: number;
    pauseCount: number;
    // [NEW] Pitch data for intonation scoring
    pitchVariance: number | null;
    avgPitch: number | null;
    pitchSamplesCount: number | null;
  }
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

  // 4. Calculate pronunciation & fluency scores from speech metrics
  let pronunciationScore: number | null = null;
  let fluencyScore: number | null = null;

  if (speechMetrics && speechMetrics.wordCount > 0) {
    // Fluency = based on WPM and pause penalty
    // Target WPM: 120-150 for fluent English (native ~150-160)
    const wpm = speechMetrics.speakingDurationMs > 0
      ? (speechMetrics.wordCount / speechMetrics.speakingDurationMs) * 60000
      : 0;
    
    // WPM score (0-100): optimal at 120-150 WPM, decreases outside 80-180 range
    // Made slightly stricter: lower base for slow speech
    let wpmScore = 100;
    if (wpm < 80) {
      wpmScore = Math.max(0, 40 + (wpm / 80) * 60); // 0 WPM = 40, 80 WPM = 100
    } else if (wpm > 180) {
      wpmScore = Math.max(0, 100 - (wpm - 180) * 0.8); // Stronger penalty for speaking too fast
    }
    
    // Pause penalty: -7 points per pause beyond the first (stricter penalty)
    const pausePenalty = Math.max(0, (speechMetrics.pauseCount - 1) * 7);
    
    fluencyScore = Math.round(Math.max(0, Math.min(100, wpmScore - pausePenalty)));

    // Pronunciation score calculation
    // Filter out zero/invalid confidence values (Chrome sometimes returns 0)
    const validConfidences = speechMetrics.confidenceScores.filter((c) => c > 0);
    
    if (validConfidences.length > 0) {
      // If we have valid confidence data from Web Speech API, use it
      const avgConfidence = 
        validConfidences.reduce((a, b) => a + b, 0) / 
        validConfidences.length;
      pronunciationScore = Math.round(avgConfidence * 100);
    } else {
      // Chrome doesn't return confidence in continuous mode (or returns 0)
      // Estimate pronunciation from fluency (smooth speech correlates with good pronunciation)
      // Made slightly stricter: lower base scores
      if (wpm >= 80 && wpm <= 180) {
        // Natural speaking pace → estimate pronunciation (stricter range)
        pronunciationScore = Math.round(65 + (fluencyScore / 100) * 20); // 65-85 range
      } else {
        // Abnormal pace → less confident in pronunciation
        pronunciationScore = Math.round(55 + (fluencyScore / 100) * 20); // 55-75 range
      }
    }

    console.log("[submitTurn] Speech metrics calculated:", {
      wordCount: speechMetrics.wordCount,
      speakingDurationMs: speechMetrics.speakingDurationMs,
      wpm: wpm.toFixed(1),
      wpmScore: wpmScore.toFixed(1),
      pauseCount: speechMetrics.pauseCount,
      pausePenalty,
      fluencyScore,
      hasConfidence: speechMetrics.confidenceScores.length > 0,
      pronunciationScore,
    });
  }

  // 5. Save User Turn with speech metrics
  const userTurn = await prisma.speakingTurn.create({
    data: {
      sessionId,
      role: "user",
      text: userText,
      audioUrl: audioUrl,
      // [NEW] Speech metrics
      pronunciationScore,
      fluencyScore,
      confidenceScores: speechMetrics?.confidenceScores || [],
      wordCount: speechMetrics?.wordCount || null,
      speakingDurationMs: speechMetrics?.speakingDurationMs || null,
      pauseCount: speechMetrics?.pauseCount || null,
      // [NEW] Pitch data for intonation scoring
      pitchVariance: speechMetrics?.pitchVariance || null,
      avgPitch: speechMetrics?.avgPitch || null,
      pitchSamplesCount: speechMetrics?.pitchSamplesCount || null,
    },
  });

  // 6. Save AI Turn
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

  // 6. Calculate fluency & pronunciation from turn averages (instead of hardcoded 70)
  // Filter turns that have valid speech metrics (wordCount > 0 means user actually spoke)
  const userTurnsWithScores = session.turns.filter(
    (t: any) => t.role === "user" && t.wordCount !== null && t.wordCount > 0 && t.pronunciationScore !== null
  );

  const pronunciationScore = userTurnsWithScores.length > 0
    ? Math.round(
        userTurnsWithScores.reduce((sum: number, t: any) => sum + t.pronunciationScore, 0) /
        userTurnsWithScores.length
      )
    : 70; // Fallback if no speech data (e.g., user typed instead of speaking)

  const fluencyScore = userTurnsWithScores.length > 0
    ? Math.round(
        userTurnsWithScores.reduce((sum: number, t: any) => sum + (t.fluencyScore || 0), 0) /
        userTurnsWithScores.length
      )
    : 70; // Fallback if no speech data

  // 7. Calculate intonation score from pitch variance
  // Higher variance = more expressive speech = better intonation
  // Scoring logic:
  // - Very low variance (<10 Hz): Monotone, score 50-60
  // - Low variance (10-20 Hz): Limited expression, score 60-70
  // - Medium variance (20-40 Hz): Good expression, score 70-85
  // - High variance (40-60 Hz): Excellent expression, score 85-95
  // - No data: Fallback to 70
  const turnsWithPitchData = session.turns.filter(
    (t: any) => t.role === "user" && t.pitchVariance !== null && t.pitchVariance > 0
  );

  let intonationScore = 65; // Default fallback (lowered from 70)
  if (turnsWithPitchData.length > 0) {
    const avgPitchVariance = turnsWithPitchData.reduce(
      (sum: number, t: any) => sum + t.pitchVariance, 0
    ) / turnsWithPitchData.length;
    
    // Map variance to score (0-100) - Made stricter:
    // Requires higher variance to reach high scores
    if (avgPitchVariance < 15) {
      // Very monotone speech: 45-60
      intonationScore = 45 + Math.round(avgPitchVariance); 
    } else if (avgPitchVariance < 30) {
      // Limited expression: 60-72
      intonationScore = 60 + Math.round((avgPitchVariance - 15) * 0.8); 
    } else if (avgPitchVariance < 50) {
      // Good expression: 72-85
      intonationScore = 72 + Math.round((avgPitchVariance - 30) * 0.65); 
    } else if (avgPitchVariance < 70) {
      // Excellent expression: 85-92
      intonationScore = 85 + Math.round((avgPitchVariance - 50) * 0.35); 
    } else {
      // Exceptional: cap at 92
      intonationScore = Math.min(92, 85 + Math.round((avgPitchVariance - 50) * 0.35));
    }
    
    console.log("[analyzeAndScoreSession] Pitch variance analysis:", {
      turnsWithPitchData: turnsWithPitchData.length,
      avgPitchVariance: avgPitchVariance.toFixed(2),
      intonationScore,
    });
  }

  console.log("[analyzeAndScoreSession] Aggregated speech scores:", {
    userTurnsWithScores: userTurnsWithScores.length,
    pronunciationScore,
    fluencyScore,
    intonationScore,
  });

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

// ============================================================================
// Learning Records - Get past sessions for a specific scenario
// ============================================================================

/**
 * Fetch all completed sessions for a specific scenario (for Learning Records feature)
 * Returns sessions sorted by date (newest first)
 */
export async function getLearningRecordsForScenario(
  userId: string,
  scenarioId: string
): Promise<{
  id: string;
  overallScore: number;
  grammarScore: number;
  relevanceScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  intonationScore: number;
  date: Date;
}[]> {
  const sessions = await prisma.speakingSession.findMany({
    where: {
      userId,
      scenarioId,
      endedAt: { not: null }, // Only completed sessions
    },
    select: {
      id: true,
      createdAt: true,
      overallScore: true,
      grammarScore: true,
      relevanceScore: true,
      fluencyScore: true,
      pronunciationScore: true,
      intonationScore: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return sessions.map((s) => ({
    id: s.id,
    overallScore: s.overallScore ?? 0,
    grammarScore: s.grammarScore ?? 0,
    relevanceScore: s.relevanceScore ?? 0,
    fluencyScore: s.fluencyScore ?? 0,
    pronunciationScore: s.pronunciationScore ?? 0,
    intonationScore: s.intonationScore ?? 0,
    date: s.createdAt,
  }));
}

/**
 * Get detailed session data by ID (for viewing past session records)
 * Includes all turns with their errors and session-level scores
 */
export async function getSessionDetailsById(sessionId: string): Promise<{
  session: {
    id: string;
    createdAt: Date;
    endedAt: Date | null;
    duration: number | null;
    overallScore: number | null;
    grammarScore: number | null;
    relevanceScore: number | null;
    fluencyScore: number | null;
    pronunciationScore: number | null;
    intonationScore: number | null;
    feedbackTitle: string | null;
    feedbackSummary: string | null;
    feedbackRating: string | null;
    feedbackTip: string | null;
  };
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
    }[];
  }[];
} | null> {
  const session = await prisma.speakingSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: {
        orderBy: { timestamp: "asc" },
        include: {
          errors: true,
        },
      },
    },
  });

  if (!session) return null;

  // Build error categories from turn errors
  const errorCategoryMap: Record<string, number> = {};
  for (const turn of session.turns) {
    for (const error of turn.errors) {
      errorCategoryMap[error.errorType] =
        (errorCategoryMap[error.errorType] || 0) + 1;
    }
  }
  const errorCategories = Object.entries(errorCategoryMap).map(
    ([name, count]) => ({ name, count })
  );

  // Build conversation with errors
  const conversation = session.turns.map((t) => ({
    role: t.role as "user" | "tutor",
    text: t.text,
    turnId: t.id,
    userErrors:
      t.role === "user" && t.errors.length > 0
        ? t.errors.map((e) => ({
            word: e.word,
            correction: e.correction,
            type: e.errorType,
          }))
        : undefined,
  }));

  return {
    session: {
      id: session.id,
      createdAt: session.createdAt,
      endedAt: session.endedAt,
      duration: session.duration,
      overallScore: session.overallScore,
      grammarScore: session.grammarScore,
      relevanceScore: session.relevanceScore,
      fluencyScore: session.fluencyScore,
      pronunciationScore: session.pronunciationScore,
      intonationScore: session.intonationScore,
      feedbackTitle: session.feedbackTitle,
      feedbackSummary: session.feedbackSummary,
      feedbackRating: session.feedbackRating,
      feedbackTip: session.feedbackTip,
    },
    scores: {
      grammar: session.grammarScore ?? 0,
      relevance: session.relevanceScore ?? 0,
      fluency: session.fluencyScore ?? 0,
      pronunciation: session.pronunciationScore ?? 0,
      intonation: session.intonationScore ?? 0,
      overall: session.overallScore ?? 0,
    },
    errorCategories,
    conversation,
  };
}

// ============================================================================
// Speaking History Feature - Sessions list and stats for History tab
// ============================================================================

/**
 * Get paginated speaking sessions for History tab with optional rating filter
 */
export async function getSpeakingHistorySessions(
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    rating?: string; // "Excellent" | "Good" | "Average" | "Needs Improvement"
  }
): Promise<{
  sessions: {
    id: string;
    scenarioId: string;
    scenarioTitle: string;
    overallScore: number;
    grammarScore: number;
    relevanceScore: number;
    fluencyScore: number;
    pronunciationScore: number;
    intonationScore: number;
    feedbackRating: string;
    createdAt: Date;
  }[];
  totalPages: number;
  totalCount: number;
}> {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    userId,
    endedAt: { not: null }, // Only completed sessions
  };

  // Add rating filter if specified
  if (options?.rating) {
    where.feedbackRating = options.rating;
  }

  const [sessions, totalCount] = await Promise.all([
    prisma.speakingSession.findMany({
      where,
      include: {
        scenario: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.speakingSession.count({ where }),
  ]);

  return {
    sessions: sessions.map((s) => ({
      id: s.id,
      scenarioId: s.scenario.id,
      scenarioTitle: s.scenario.title,
      overallScore: s.overallScore ?? 0,
      grammarScore: s.grammarScore ?? 0,
      relevanceScore: s.relevanceScore ?? 0,
      fluencyScore: s.fluencyScore ?? 0,
      pronunciationScore: s.pronunciationScore ?? 0,
      intonationScore: s.intonationScore ?? 0,
      feedbackRating: s.feedbackRating ?? "N/A",
      createdAt: s.createdAt,
    })),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

/**
 * Get speaking history stats from last 20 sessions for charts
 */
export async function getSpeakingHistoryStats(userId: string): Promise<{
  performanceData: { session: number; score: number }[];
  criteriaAverages: {
    relevance: number;
    pronunciation: number;
    intonation: number;
    fluency: number;
    grammar: number;
  };
  totalSessions: number;
  highestScore: number;
  averageScore: number;
}> {
  // Get last 20 completed sessions
  const sessions = await prisma.speakingSession.findMany({
    where: {
      userId,
      endedAt: { not: null },
    },
    select: {
      overallScore: true,
      grammarScore: true,
      relevanceScore: true,
      fluencyScore: true,
      pronunciationScore: true,
      intonationScore: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (sessions.length === 0) {
    return {
      performanceData: [],
      criteriaAverages: {
        relevance: 0,
        pronunciation: 0,
        intonation: 0,
        fluency: 0,
        grammar: 0,
      },
      totalSessions: 0,
      highestScore: 0,
      averageScore: 0,
    };
  }

  // Reverse to show oldest first for chart (left to right chronological)
  const reversedSessions = [...sessions].reverse();
  const performanceData = reversedSessions.map((s, i) => ({
    session: i + 1,
    score: s.overallScore ?? 0,
  }));

  // Calculate averages
  const totalSessions = sessions.length;
  const scores = sessions.map((s) => s.overallScore ?? 0);
  const highestScore = Math.max(...scores);
  const averageScore = Math.round(
    scores.reduce((a, b) => a + b, 0) / totalSessions
  );

  // Calculate criteria averages
  const criteriaAverages = {
    relevance: Math.round(
      sessions.reduce((sum, s) => sum + (s.relevanceScore ?? 0), 0) /
        totalSessions
    ),
    pronunciation: Math.round(
      sessions.reduce((sum, s) => sum + (s.pronunciationScore ?? 0), 0) /
        totalSessions
    ),
    intonation: Math.round(
      sessions.reduce((sum, s) => sum + (s.intonationScore ?? 0), 0) /
        totalSessions
    ),
    fluency: Math.round(
      sessions.reduce((sum, s) => sum + (s.fluencyScore ?? 0), 0) /
        totalSessions
    ),
    grammar: Math.round(
      sessions.reduce((sum, s) => sum + (s.grammarScore ?? 0), 0) /
        totalSessions
    ),
  };

  return {
    performanceData,
    criteriaAverages,
    totalSessions,
    highestScore,
    averageScore,
  };
}
