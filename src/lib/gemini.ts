import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Helper function to provide language guidance based on CEFR level
function getLevelGuidance(level: string): string {
  switch (level.toUpperCase()) {
    case "A1":
      return "very simple words, short sentences, present tense only, basic vocabulary";
    case "A2":
      return "simple vocabulary, short sentences, common phrases, past and future tenses";
    case "B1":
      return "everyday vocabulary, moderate sentence length, common idioms, varied tenses";
    case "B2":
      return "diverse vocabulary, complex sentences, idioms and expressions, all tenses";
    case "C1":
      return "sophisticated vocabulary, nuanced expressions, complex grammar structures";
    case "C2":
      return "native-level vocabulary, idiomatic expressions, any grammatical structure";
    default:
      return "moderate vocabulary and sentence complexity";
  }
}

export interface ScenarioConfig {
  context: string;
  userRole?: string;
  botRole?: string;
  goal?: string;
  level?: string; // A1, A2, B1, B2, C1, C2
}

// ============================================================================
// SIMPLIFIED: generateSpeakingResponse - Only returns AI response during conversation
// Error analysis and scoring is done AFTER session ends via analyzeSessionConversation
// ============================================================================
export async function generateSpeakingResponse(
  scenario: ScenarioConfig,
  history: { role: "user" | "model"; text: string }[],
  userMessage: string
): Promise<{ response: string }> {
  const userRoleDesc = scenario.userRole
    ? `The user is playing the role of: ${scenario.userRole}`
    : "";
  const botRoleDesc = scenario.botRole
    ? `You are playing the role of: ${scenario.botRole}`
    : "You are an English tutor";
  const goalDesc = scenario.goal ? `Conversation goal: ${scenario.goal}` : "";
  const levelDesc = scenario.level
    ? `LEARNER LEVEL: ${
        scenario.level
      } - Adjust your vocabulary and sentence complexity accordingly. For ${
        scenario.level
      } learners, use ${getLevelGuidance(scenario.level)}.`
    : "";

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
You are an English tutor helping a language learner practice speaking through roleplay.

SCENARIO CONTEXT: ${scenario.context}
${botRoleDesc}
${userRoleDesc}
${goalDesc}
${levelDesc}

Your task:
1. Stay in character as ${
      scenario.botRole || "the tutor"
    } and respond naturally to continue the roleplay.
2. Generate a natural, conversational response that advances the scenario. Keep it concise (1-2 sentences).

IMPORTANT: Your response should be in character as ${
      scenario.botRole || "the tutor"
    }. Be natural and engaging.
CRITICAL: Do NOT use any markdown formatting in your response (no **bold**, *italic*, headers, lists, etc.). Your response must be plain text only.

Output JSON format ONLY:
{
  "response": "<your natural in-character response>"
}
`,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      // @ts-expect-error - thinkingConfig is supported but not in types yet
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  try {
    const contents: Content[] = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const result = await model.generateContent({ contents });
    const text = result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("[generateSpeakingResponse] Gemini generation error:", error);
    return {
      response: "I'm sorry, I didn't catch that. Could you repeat?",
    };
  }
}

// ============================================================================
// NEW: Session Analysis Types and Function
// Called AFTER session ends to analyze all turns at once
// ============================================================================

export interface TurnError {
  word: string;
  correction: string;
  errorType: string;
  startIndex: number;
  endIndex: number;
}

export interface TurnAnalysis {
  turnIndex: number; // Index matching the userTurns array
  errors: TurnError[];
}

export interface SessionAnalysisResult {
  // Feedback for Complete page
  feedbackTitle: string;
  feedbackSummary: string;
  feedbackRating: string; // "Excellent" | "Good" | "Average" | "Needs Improvement"
  feedbackTip: string;

  // Scores (0-100)
  grammarScore: number;
  relevanceScore: number;

  // Per-turn error analysis
  turnAnalyses: TurnAnalysis[];
}

export async function analyzeSessionConversation(
  scenarioContext: string,
  turns: { role: "user" | "tutor"; text: string; id: string }[]
): Promise<SessionAnalysisResult> {
  console.log(
    "[analyzeSessionConversation] Starting analysis with",
    turns.length,
    "turns"
  );

  // Filter user turns for analysis
  const userTurns = turns.filter((t) => t.role === "user");

  if (userTurns.length === 0) {
    console.log("[analyzeSessionConversation] No user turns to analyze");
    return {
      feedbackTitle: "Session Complete",
      feedbackSummary: "Start speaking to get feedback on your English!",
      feedbackRating: "N/A",
      feedbackTip: "Try to speak more in your next session.",
      grammarScore: 0,
      relevanceScore: 0,
      turnAnalyses: [],
    };
  }

  // Build conversation text with turn indices for reference
  const conversationText = turns
    .map((t, i) => {
      const role = t.role === "user" ? "User" : "Tutor";
      const turnIndex =
        t.role === "user" ? userTurns.findIndex((u) => u.id === t.id) : -1;
      const indexLabel = turnIndex >= 0 ? ` [UserTurnIndex: ${turnIndex}]` : "";
      return `${role}${indexLabel}: "${t.text}"`;
    })
    .join("\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 16384,
      responseMimeType: "application/json",
      // @ts-expect-error - thinkingConfig is supported but not in types yet
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const prompt = `You are an expert English language teacher. Analyze this conversation between a learner (User) and AI tutor.

SCENARIO CONTEXT: ${scenarioContext}

CONVERSATION:
${conversationText}

YOUR TASK:
1. For each USER turn, identify ALL grammar, vocabulary, and usage errors.
2. For each error, provide the EXACT position (startIndex, endIndex) in the original text.
3. Calculate an overall GRAMMAR score (0-100) based on error frequency and severity.
4. Calculate a RELEVANCE score (0-100) based on how well user responses match the conversation context.
5. Generate encouraging feedback for the learner.

ERROR TYPES to look for:
- Grammar: General grammar mistakes
- Vocabulary: Wrong word usage
- Preposition: Wrong preposition (in/on/at/to/for)
- Article: Missing or wrong articles (a/an/the)
- Verb Tense: Wrong verb tense
- Word Choice: Inappropriate word for context

SCORING GUIDELINES:
- Grammar: 90-100 if 0-2 errors, 70-89 if 3-5 errors, 50-69 if 6-10 errors, below 50 if 10+ errors
- Relevance: Based on how well responses match the context and flow of conversation

Return JSON with this EXACT structure:
{
  "feedbackTitle": "<encouraging title, max 5 words>",
  "feedbackSummary": "<2-sentence constructive feedback>",
  "feedbackRating": "<Excellent|Good|Average|Needs Improvement>",
  "feedbackTip": "<specific tip based on most common error type>",
  "grammarScore": <0-100>,
  "relevanceScore": <0-100>,
  "turnAnalyses": [
    {
      "turnIndex": <index in userTurns array, starting from 0>,
      "errors": [
        {
          "word": "<exact incorrect word/phrase from text>",
          "correction": "<correct version>",
          "errorType": "<Grammar|Vocabulary|Preposition|Article|Verb Tense|Word Choice>",
          "startIndex": <start position in text>,
          "endIndex": <end position in text>
        }
      ]
    }
  ]
}

IMPORTANT:
- startIndex and endIndex must be accurate character positions in the USER's original text
- If a user turn has no errors, still include it with an empty errors array
- Be thorough but fair - focus on meaningful errors, not minor style preferences`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log(
      "[analyzeSessionConversation] Raw response length:",
      text.length
    );

    const parsed: SessionAnalysisResult = JSON.parse(text);

    // Validate required fields
    if (!parsed.feedbackTitle || parsed.grammarScore === undefined) {
      console.error("[analyzeSessionConversation] Invalid response structure");
      throw new Error("Invalid response structure");
    }

    console.log(
      "[analyzeSessionConversation] Success - rating:",
      parsed.feedbackRating,
      "grammar:",
      parsed.grammarScore
    );
    return parsed;
  } catch (e) {
    console.error("[analyzeSessionConversation] Failed:", e);
    return {
      feedbackTitle: "Session Complete",
      feedbackSummary:
        "Great effort! Keep practicing to improve your English speaking skills.",
      feedbackRating: "Good",
      feedbackTip: "Focus on grammar and vocabulary to improve your speaking.",
      grammarScore: 70,
      relevanceScore: 70,
      turnAnalyses: userTurns.map((_, i) => ({ turnIndex: i, errors: [] })),
    };
  }
}

export async function generateScenario(topic: string): Promise<{
  title: string;
  description: string;
  goal: string;
  level: string;
  context: string;
  image: string;
}> {
  // Use gemini-2.5-flash with thinking disabled
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192, // High quota - 1M TPM
      responseMimeType: "application/json",
      // @ts-expect-error - thinkingConfig is supported but not in types yet
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const prompt = `
      Create a speaking roleplay scenario based on the topic: "${topic}".
      
      Output JSON format ONLY:
      {
        "title": "Short catchy title",
        "description": "Brief description of the scenario",
        "goal": "What the user needs to achieve",
        "level": "A1/A2/B1/B2/C1/C2",
        "context": "Detailed context instructions for the AI tutor (you) to play this role",
        "image": "/learning.png"
      }
    `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to generate scenario", e);
    return {
      title: topic,
      description: "Custom scenario",
      goal: "Practice conversation",
      level: "B1",
      context: `Roleplay about ${topic}`,
      image: "/learning.png",
    };
  }
}
