import { getOrCreateFreeTalkScenario } from "@/actions/speaking"
import SpeakingSessionClient from "@/components/page/SpeakingSessionClient"

export default async function FreeTalkPage() {
    // TODO: Real auth
    const userId = "user-1"

    const scenario = await getOrCreateFreeTalkScenario(userId)

    return (
        <SpeakingSessionClient
            scenarioId={scenario.id}
            scenario={{
                id: scenario.id,
                title: scenario.title,
                context: scenario.context,
                goal: scenario.goal
            }}
            initialTurns={[]}
            learningRecords={[]} // Empty for new session
            detailedFeedback={{
                // Initial empty feedback
                scores: [
                    { label: "Pronunciation", value: 0 },
                    { label: "Fluency", value: 0 },
                    { label: "Grammar", value: 0 },
                    { label: "Relevance", value: 0 },
                    { label: "Intonation & Stress", value: 0 },
                ],
                errorCategories: [],
                conversation: [],
                overallRating: "Ready to start",
                tip: "Start speaking to get feedback."
            }}
        />
    )
}
