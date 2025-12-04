"use server"

import { prisma } from "@/lib/prisma"

export async function checkSystemStatus() {
    try {
        // Test database connection
        const scenarioCount = await prisma.speakingScenario.count()
        const topicCount = await prisma.topic.count()

        return {
            success: true,
            message: "API and Database are working!",
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                scenarios: scenarioCount,
                topics: topicCount,
            },
        }
    } catch (error: any) {
        return {
            success: false,
            message: "API works but Database connection failed",
            timestamp: new Date().toISOString(),
            database: {
                connected: false,
                error: error.message,
            },
        }
    }
}
