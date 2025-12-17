
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const topicGroups = await prisma.topicGroup.findMany({
        where: {
            hubType: "vocab",
        },
        include: {
            topics: true,
        },
    });

    console.log(JSON.stringify(topicGroups, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
