import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export interface TurnScore {
    pronunciation: number;
    fluency: number;
    grammar: number;
    content: number;
    relevance: number;
    intonation: number;
}

export interface FeedbackData {
  response: string;
  scores: TurnScore;
  errors: {
    word: string;
    correction: string;
    type: string;
  }[];
}

export interface ScenarioConfig {
  context: string;
  userRole?: string;
  botRole?: string;
  goal?: string;
}

export async function generateSpeakingResponse(
  scenario: ScenarioConfig,
  history: { role: "user" | "model"; text: string }[],
  userMessage: string
): Promise<FeedbackData> {
  // Build role description for system prompt
  const userRoleDesc = scenario.userRole
    ? `The user is playing the role of: ${scenario.userRole}`
    : "";
  const botRoleDesc = scenario.botRole
    ? `You are playing the role of: ${scenario.botRole}`
    : "You are an English tutor";
  const goalDesc = scenario.goal ? `Conversation goal: ${scenario.goal}` : "";

  // dynamically create model to include context in system instruction
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
        You are an English tutor helping a language learner practice speaking through roleplay.
        
        SCENARIO CONTEXT: ${scenario.context}
        ${botRoleDesc}
        ${userRoleDesc}
        ${goalDesc}
        
        Your task:
        1. Stay in character as ${
          scenario.botRole || "the tutor"
        } and respond naturally to continue the roleplay.
        2. Analyze the user's latest message for grammar, vocabulary, and relevance.
        3. Give scores (0-100) for pronunciation (estimate based on text), fluency (estimate), grammar, content, relevance, intonation (estimate).
        4. Identify specific errors (grammar, vocab, etc.) and provide corrections.
        5. Generate a natural, conversational response that advances the scenario. Keep it concise (1-2 sentences).
        
        IMPORTANT: Your response should be in character as ${
          scenario.botRole || "the tutor"
        }. Be natural and engaging.
        
        Output JSON format ONLY:
        {
          "response": "Your in-character response here",
          "scores": {
            "pronunciation": 80,
            "fluency": 80,
            "grammar": 80,
            "content": 80,
            "relevance": 80,
            "intonation": 80
          },
          "errors": [
            { "word": "wrong_word", "correction": "correct_word", "type": "Grammar/Vocab/etc" }
          ]
        }
        `,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: "application/json",
    },
  });

  try {
    // Convert history to Gemini Content format
    const contents: Content[] = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const result = await model.generateContent({ contents });
    const text = result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback
    return {
      response: "I'm sorry, I didn't catch that. Could you repeat?",
      scores: {
        pronunciation: 70,
        fluency: 70,
        grammar: 70,
        content: 70,
        relevance: 70,
        intonation: 70,
      },
      errors: [],
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
    duration: number;
}> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
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
        "image": "/learning.png",
        "duration": 10
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
            duration: 10
        };
    }
}

export interface SessionSummaryData {
    title: string;
    description: string;
    overallScore: number;
    scores: {
        relevance: number;
        pronunciation: number;
        intonation: number;
        fluency: number;
        grammar: number;
    };
    newWords?: {
        word: string;
        definition: string;
        example: string;
    }[];
}

export async function generateSessionSummary(
    context: string,
    conversation: { role: "user" | "tutor"; text: string }[]
): Promise<SessionSummaryData> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
        },
    });

    const conversationText = conversation
        .map((c) => `${c.role === "user" ? "User" : "Tutor"}: ${c.text}`)
        .join("\n");

    const prompt = `
      Analyze this English speaking practice conversation and provide a summary.
      
      Context: ${context}
      
      Conversation:
      ${conversationText}
      
      Provide a comprehensive analysis with:
      1. A short encouraging title (e.g., "Amazing context understanding", "Great vocabulary usage", "Good pronunciation")
      2. A detailed paragraph (2-3 sentences) explaining what they did well and what needs improvement
      3. Scores (0-100) for: relevance, pronunciation (estimate), intonation (estimate), fluency (estimate), grammar
      4. Overall score (0-100)
      5. Extract 3 advanced or useful vocabulary words from the conversation (or suggest relevant ones if user vocab was simple) with definitions and context examples.
      
      Output JSON format ONLY:
      {
        "title": "Short encouraging title",
        "description": "Detailed feedback paragraph explaining strengths and areas for improvement",
        "overallScore": 85,
        "scores": {
          "relevance": 86,
          "pronunciation": 88,
          "intonation": 69,
          "fluency": 86,
          "grammar": 88
        },
        "newWords": [
            { "word": "word1", "definition": "definition...", "example": "example usage..." }
        ]
      }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to generate session summary", e);
        return {
            title: "Session Complete",
            description: "Great effort! Keep practicing to improve your English speaking skills.",
            overallScore: 75,
            scores: {
                relevance: 75,
                pronunciation: 75,
                intonation: 70,
                fluency: 75,
                grammar: 75,
            },
            newWords: []
        };
    }
}

export interface ErrorAnalysis {
    word: string;
    correction: string;
    type: string;
}

export interface TurnAnalysis {
    originalText: string;
    errors: ErrorAnalysis[];
    correctedSentence: string;
}

export interface DetailedErrorAnalysis {
    errorCategories: { name: string; count: number }[];
    turnAnalyses: TurnAnalysis[];
    overallRating: string;
    tip: string;
}

export async function analyzeSessionErrors(
    userTurns: { text: string }[]
): Promise<DetailedErrorAnalysis> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2000,
            responseMimeType: "application/json",
        },
    });

    const turnsText = userTurns.map((t, i) => `Turn ${i + 1}: "${t.text}"`).join("\n");

    const prompt = `
      Analyze these English sentences from a language learner and identify all grammar, vocabulary, and usage errors.
      
      User turns:
      ${turnsText}
      
      For each turn:
      1. Identify specific errors (grammar, vocabulary, preposition, article, verb tense, word choice, etc.)
      2. Provide the incorrect word/phrase and its correction
      3. Generate the fully corrected sentence
      
      Also provide:
      - Error category counts (e.g., {"name": "Prepositions", "count": 3})
      - Overall rating: "Excellent" (0-5 errors), "Good" (6-10), "Average" (11-15), "Needs Improvement" (16+)
      - A personalized tip for improvement
      
      Output JSON format ONLY:
      {
        "errorCategories": [
          {"name": "Prepositions", "count": 2},
          {"name": "Articles", "count": 1},
          {"name": "Verb Tense", "count": 3}
        ],
        "turnAnalyses": [
          {
            "originalText": "I go to school yesterday",
            "errors": [
              {"word": "go", "correction": "went", "type": "Verb Tense"}
            ],
            "correctedSentence": "I went to school yesterday"
          }
        ],
        "overallRating": "Good",
        "tip": "Pay attention to verb tenses when talking about past events. Keep practicing!"
      }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to analyze session errors", e);
        return {
            errorCategories: [],
            turnAnalyses: userTurns.map((t) => ({
                originalText: t.text,
                errors: [],
                correctedSentence: t.text,
            })),
            overallRating: "Good",
            tip: "Keep practicing to improve your English skills!",
        };
    }
}
