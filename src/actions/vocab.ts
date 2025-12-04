"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getVocabByTopic(topicId: string) {
    try {
        if (!topicId) {
            throw new Error("topicId is required")
        }

        const vocabItems = await prisma.vocabItem.findMany({
            where: {
                topicId,
            },
            orderBy: {
                createdAt: "asc",
            },
        })

        // Parse JSON fields and format to match FE interface
        const formattedVocab = vocabItems.map((item) => ({
            id: item.id,
            word: item.word,
            pronunciation: item.pronunciation,
            partOfSpeech: item.partOfSpeech.toLowerCase(),
            meaning: JSON.parse(item.meanings as string)[0] || "", // FE expects single string
            vietnameseMeaning: JSON.parse(item.vietnameseMeanings as string)[0] || "",
            meanings: JSON.parse(item.meanings as string), // Full array
            vietnameseMeanings: JSON.parse(item.vietnameseMeanings as string),
            examples: JSON.parse(item.examples as string),
            collocations: item.collocations ? JSON.parse(item.collocations as string) : [],
            synonyms: item.synonyms ? JSON.parse(item.synonyms as string) : [],
            antonyms: item.antonyms ? JSON.parse(item.antonyms as string) : [],
            relatedWords: item.relatedWords ? JSON.parse(item.relatedWords as string) : [],
            audioUrl: item.audioUrl,
            // For backward compatibility with old FE interface
            exampleSentence: JSON.parse(item.examples as string)[0]?.en || "",
            exampleTranslation: JSON.parse(item.examples as string)[0]?.vi || "",
        }))

        return { success: true, data: formattedVocab }
    } catch (error) {
        console.error("Error fetching vocab:", error)
        return { success: false, error: "Failed to fetch vocabulary" }
    }
}

export async function createVocabItem(data: any) {
    try {
        const vocabItem = await prisma.vocabItem.create({
            data: {
                topicId: data.topicId,
                word: data.word,
                pronunciation: data.pronunciation,
                partOfSpeech: data.partOfSpeech.toUpperCase(),
                meanings: JSON.stringify(data.meanings),
                vietnameseMeanings: JSON.stringify(data.vietnameseMeanings),
                examples: JSON.stringify(data.examples),
                collocations: data.collocations ? JSON.stringify(data.collocations) : null,
                synonyms: data.synonyms ? JSON.stringify(data.synonyms) : null,
                antonyms: data.antonyms ? JSON.stringify(data.antonyms) : null,
                relatedWords: data.relatedWords ? JSON.stringify(data.relatedWords) : null,
                audioUrl: data.audioUrl,
            },
        })

        // Update topic wordCount
        await prisma.topic.update({
            where: { id: data.topicId },
            data: {
                wordCount: {
                    increment: 1,
                },
            },
        })

        revalidatePath("/vocab") // Adjust path as needed
        return { success: true, data: vocabItem }
    } catch (error) {
        console.error("Error creating vocab:", error)
        return { success: false, error: "Failed to create vocabulary" }
    }
}
