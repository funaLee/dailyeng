import { prisma } from "@/lib/prisma"

// Data Access Layer for Vocabulary
// Encapsulates Prisma queries

export async function getVocabItems(topicId: string) {
    return await prisma.vocabItem.findMany({
        where: { topicId },
        orderBy: { createdAt: "asc" },
    })
}
