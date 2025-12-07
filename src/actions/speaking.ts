"use server";

import { prisma } from "@/lib/prisma";
import { generateSpeakingResponse, generateScenario } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

// Helper to ensure user exists (Temporary for dev until real auth)
async function ensureUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        await prisma.user.create({
            data: {
                id: userId,
                name: "Demo User",
                email: `demo-${userId}@example.com`,
                password: "password123", // Mock
                level: "B1",
            }
        });
    }
}

// Fetch topics
export async function getTopics() {
    return await prisma.speakingScenario.findMany({
        where: { isCustom: false },
        include: {
            topic: true
        }
    });
}

// Fetch custom topics for a user
export async function getCustomTopics(userId: string) {
    await ensureUser(userId);
    return await prisma.speakingScenario.findMany({
        where: {
            isCustom: true,
            createdById: userId
        },
        orderBy: { id: 'desc' }
    });
}

// Create custom scenario
export async function createCustomScenario(userId: string, topicPrompt: string) {
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
            duration: generated.duration,
            isCustom: true,
            createdById: userId,
            category: "Custom",
        }
    });

    revalidatePath("/speaking");
    return scenario;
}

// Create Session
export async function createSession(userId: string, scenarioId: string) {
    await ensureUser(userId);
    return await prisma.speakingSession.create({
        data: {
            userId,
            scenarioId,
        }
    });
}

// Submit Turn
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
            turns: { orderBy: { timestamp: 'asc' } }
        }
    });

    if (!session) throw new Error("Session not found");

    // 2. Prepare History for AI
    const history = session.turns.map((t: any) => ({
        role: t.role === "user" ? "user" : "model" as "user" | "model",
        text: t.text
    }));

    // 3. Call Gemini
    const aiResult = await generateSpeakingResponse(session.scenario.context, history, userText);

    // 4. Save User Turn
    await prisma.speakingTurn.create({
        data: {
            sessionId,
            role: "user",
            text: userText,
            audioUrl: audioUrl, // In a real app, upload audio to storage and save URL
            // Fill scores from AI analysis of USER's text
            pronunciationScore: aiResult.scores.pronunciation,
            fluencyScore: aiResult.scores.fluency,
            grammarScore: aiResult.scores.grammar,
            contentScore: aiResult.scores.content,
            relevanceScore: aiResult.scores.relevance,
            intonationScore: aiResult.scores.intonation,
            errors: {
                create: aiResult.errors.map(e => ({
                    word: e.word,
                    correction: e.correction,
                    errorType: e.type
                }))
            }
        }
    });

    // 5. Save AI Turn
    const aiTurn = await prisma.speakingTurn.create({
        data: {
            sessionId,
            role: "tutor",
            text: aiResult.response,
        }
    });

    return {
        aiResponse: aiResult.response,
        scores: aiResult.scores,
        errors: aiResult.errors,
        turnId: aiTurn.id
    };
}

export async function getSessionHistory(userId: string) {
    await ensureUser(userId);
    const sessions = await prisma.speakingSession.findMany({
        where: { userId },
        include: {
            scenario: true,
            turns: true
        },
        orderBy: { createdAt: 'desc' }
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
            createdById: userId
        }
    });

    if (!scenario) {
        scenario = await prisma.speakingScenario.create({
            data: {
                title: freeTalkTitle,
                description: "Open conversation with AI tutor. Talk about anything you want!",
                goal: "Practice free conversation",
                difficulty: "B1", // Default
                context: "You are having a casual conversation with a friendly AI tutor.",
                image: "/scenarios/free-talk.png", // Ensure this image path is handled or generic
                duration: 999,
                isCustom: true,
                createdById: userId, // Link to user so they own it
                category: "Custom"
            }
        });
    }

    return scenario;
}
