const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Get most recent sessions
  const sessions = await prisma.speakingSession.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      scenarioId: true,
      createdAt: true,
      endedAt: true,
      overallScore: true,
    },
    take: 10,
  });

  console.log("Most recent 10 sessions:");
  sessions.forEach((s: any, i: number) => {
    console.log(
      `${i + 1}. userId: "${s.userId}", scenarioId: ${s.scenarioId.substring(
        0,
        10
      )}..., createdAt: ${s.createdAt.toISOString()}, endedAt: ${
        s.endedAt ? "SET" : "NULL"
      }, score: ${s.overallScore}`
    );
  });

  // Check users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });
  console.log("\nUsers in database:");
  users.forEach((u: any) =>
    console.log(`  - id: "${u.id}", email: ${u.email}, name: ${u.name}`)
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
