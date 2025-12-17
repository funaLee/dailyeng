
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Vocabulary Seed Data...");

    try {
        const vocabCount = await prisma.vocabItem.count();
        console.log(`Total Vocab Items: ${vocabCount}`);

        const topicCount = await prisma.topic.count();
        console.log(`Total Topics: ${topicCount}`);

        const groups = await prisma.topicGroup.findMany({
            where: { hubType: 'vocab' },
            include: { topics: true }
        });

        console.log("\nBreakdown by Group:");
        for (const group of groups) {
            console.log(`- ${group.name}: ${group.topics.length} topics`);
        }

    } catch (e) {
        console.error("Error verifying data:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
