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

  const prompt = `You are a STRICT but fair English language evaluator. Analyze this conversation with HONEST and ACCURATE scoring.

SCENARIO CONTEXT: ${scenarioContext}

CONVERSATION:
${conversationText}

YOUR TASK - BE STRICT AND THOROUGH:
1. For each USER turn, identify ALL errors including:
   - Grammar mistakes (even subtle ones like subject-verb agreement)
   - Missing/wrong articles, prepositions, punctuation
   - Awkward phrasing or unnatural expressions
   - Vocabulary misuse or informal language in formal context
2. For each error, provide the EXACT position (startIndex, endIndex) in the original text.
3. Calculate HONEST scores - do NOT inflate scores to be "nice". A native speaker would score 95+.
4. Generate constructive but honest feedback.

ERROR TYPES to look for:
- Grammar: Subject-verb agreement, sentence structure, fragments
- Vocabulary: Wrong word usage, inappropriate register
- Preposition: Wrong preposition (in/on/at/to/for/with)
- Article: Missing or wrong articles (a/an/the) - THIS IS COMMON!
- Verb Tense: Wrong tense, consistency issues
- Word Choice: Unnatural or awkward word selection

STRICT SCORING GUIDELINES (be honest, not generous):
GRAMMAR SCORE:
- 90-100: PERFECT or near-perfect (0-1 minor errors) - rare for non-native speakers
- 80-89: Very good (1-2 small errors only)
- 70-79: Good (3-4 errors, mostly minor)
- 60-69: Average (5-7 errors, some noticeable)
- 50-59: Below average (8-10 errors)
- Below 50: Needs significant improvement (10+ errors)

RELEVANCE SCORE:
- 90-100: Perfectly on-topic, natural conversation flow
- 80-89: Mostly relevant, minor deviations
- 70-79: Generally relevant but some off-topic or unnatural responses
- 60-69: Partially relevant, noticeable issues with context understanding
- Below 60: Often off-topic or inappropriate responses

FEEDBACK RATING criteria:
- "Excellent": Both scores 85+ (rare achievement)
- "Good": Both scores 70+
- "Average": At least one score 60-69
- "Needs Improvement": Any score below 60

Return JSON with this EXACT structure:
{
  "feedbackTitle": "<honest but encouraging title, max 5 words>",
  "feedbackSummary": "<2-sentence HONEST feedback about strengths and areas to improve>",
  "feedbackRating": "<Excellent|Good|Average|Needs Improvement>",
  "feedbackTip": "<specific actionable tip based on biggest weakness>",
  "grammarScore": <0-100 - BE HONEST, don't inflate>,
  "relevanceScore": <0-100 - BE HONEST>,
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

CRITICAL REMINDERS:
- DO NOT give 90+ unless the speech is nearly perfect
- Missing articles like "a/an/the" ARE errors - count them!
- Every user turn must be analyzed, even if it has no errors
- startIndex and endIndex must be accurate character positions
- Be a helpful critic, not a flattering friend`;

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

export interface GeneratedScenario {
  title: string;
  description: string;
  goal: string;
  level: string;
  context: string;
  image: string;
  imageKeyword: string; // For Pexels API search
  userRole: string;
  botRole: string;
  openingLine: string;
  objectives: string[];
}

export async function generateScenario(
  topic: string | null, // null = random scenario (Surprise Me)
  userLevel?: string // A1-C2 from user profile
): Promise<GeneratedScenario> {
  // Use gemini-2.5-flash with thinking disabled
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.8, // Slightly higher for more creative scenarios
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      // @ts-expect-error - thinkingConfig is supported but not in types yet
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const levelInstruction = userLevel
    ? `The scenario MUST be appropriate for ${userLevel} level learners. Use ${getLevelGuidance(
        userLevel
      )}.`
    : "The scenario should be appropriate for B1 (intermediate) level learners.";

  const topicInstruction = topic
    ? `Create a speaking roleplay scenario based on the user's description: "${topic}".`
    : `Create a RANDOM, creative, and interesting speaking roleplay scenario. Be creative! Choose from diverse topics like: travel, shopping, dining, job interviews, doctor visits, customer service, making friends, apartment hunting, banking, etc.`;

  const prompt = `${topicInstruction}

${levelInstruction}

IMPORTANT: Generate a complete, engaging roleplay scenario with realistic roles.
CRITICAL: ALL content (title, description, context, openingLine, etc.) MUST be in ENGLISH only. Even if the scenario is about a non-English speaking country (e.g., Japan, France, Vietnam), all text must still be written in English.

Output JSON format ONLY:
{
  "title": "Short catchy title (2-5 words)",
  "description": "Brief description of the scenario (1-2 sentences)",
  "goal": "What the user needs to achieve in this conversation",
  "level": "${userLevel || "B1"}",
  "context": "CREATE a detailed, creative USER-FACING description of the situation/setting (2-3 sentences). This is what the LEARNER sees before starting. Do NOT copy the user's input - instead, expand and enrich it into a vivid scenario. Example: 'You are at a cozy coffee shop on a rainy afternoon. The barista behind the counter looks friendly and ready to take your order. You want to order your favorite drink and maybe try something new from their pastry selection.'",
  "image": "/learning.png",
  "imageKeyword": "A 2-3 word search term for finding a stock photo (e.g., 'coffee shop', 'job interview', 'airport travel')",
  "userRole": "The role the learner plays (e.g., Customer, Job Applicant, Patient, Tourist)",
  "botRole": "The role the AI plays (e.g., Shop Assistant, Interviewer, Doctor, Local Guide)",
  "openingLine": "The AI's first message to start the conversation. Should be natural and in-character.",
  "objectives": ["Learning objective 1", "Learning objective 2", "Learning objective 3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    // Ensure all fields exist
    return {
      title: parsed.title || (topic ? topic.slice(0, 50) : "Random Scenario"),
      description: parsed.description || "Practice speaking in this scenario",
      goal: parsed.goal || "Complete the conversation successfully",
      level: parsed.level || userLevel || "B1",
      context:
        parsed.context || "You are having a conversation with the learner.",
      image: parsed.image || "/learning.png",
      imageKeyword:
        parsed.imageKeyword ||
        parsed.title?.split(" ").slice(0, 2).join(" ") ||
        "english learning",
      userRole: parsed.userRole || "Learner",
      botRole: parsed.botRole || "English Tutor",
      openingLine: parsed.openingLine || "Hello! How can I help you today?",
      objectives: parsed.objectives || [
        "Practice speaking naturally",
        "Use appropriate vocabulary",
      ],
    };
  } catch (e) {
    console.error("Failed to generate scenario", e);
    return {
      title: topic ? topic.slice(0, 50) : "Practice Conversation",
      description: "Custom speaking scenario",
      goal: "Practice conversation",
      level: userLevel || "B1",
      context: topic
        ? `Roleplay about ${topic}`
        : "Have a casual English conversation",
      image: "/learning.png",
      imageKeyword: topic
        ? topic.split(" ").slice(0, 2).join(" ")
        : "conversation practice",
      userRole: "Learner",
      botRole: "English Tutor",
      openingLine:
        "Hello! I'm here to help you practice English. What would you like to talk about?",
      objectives: ["Practice speaking naturally", "Build confidence"],
    };
  }
}
