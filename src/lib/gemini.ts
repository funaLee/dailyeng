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

export async function generateSpeakingResponse(
    context: string,
    history: { role: "user" | "model"; text: string }[],
    userMessage: string
): Promise<FeedbackData> {
    // dynamically create model to include context in system instruction
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `
        You are an English tutor Roleplaying in a specific scenario.
        
        Context: ${context}
        
        Your task:
        1. Analyze the user's latest message for grammar, vocabulary, and relevance.
        2. Give scores (0-100) for pronunciation (guess based on text if unsure, but assume good), fluency (guess), grammar, content, relevance, intonation (guess).
        3. Identify specific errors (grammar, vocab, etc.) and provide corrections.
        4. Generate a natural, conversational response to continue the roleplay. Keep it concise (1-2 sentences).
        
        Output JSON format ONLY:
        {
          "response": "Your response here",
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
