/**
 * Seed Sample Speaking Sessions & Turns
 * 
 * Tạo data mẫu để test:
 * - 1 demo user
 * - 3 speaking sessions
 * - Turns (hội thoại) cho mỗi session
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎤 Seeding Speaking Sessions & Turns...\n");

  // 1. Tạo demo user (only use fields that exist in schema)
  console.log("👤 Creating demo user...");
  const user = await prisma.user.upsert({
    where: { email: "demo@englishflow.com" },
    update: {},
    create: {
      email: "demo@englishflow.com",
      name: "Demo User",
      password: "hashed_password_here", // In production, hash this!
    },
  });
  console.log(`✅ Created/found user: ${user.email}\n`);

  // 2. Lấy scenarios
  const scenarios = await prisma.speakingScenario.findMany({
    take: 3,
  });

  if (scenarios.length === 0) {
    console.log("⚠️  No scenarios found. Run seed-speaking.ts first!");
    return;
  }

  // 3. Tạo sessions với turns
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];

    console.log(`📝 Creating session ${i + 1}: ${scenario.title}`);

    const session = await prisma.speakingSession.create({
      data: {
        userId: user.id,
        scenarioId: scenario.id,
      },
    });

    // Tạo turns cho session (using correct Role enum values)
    const turns = [
      {
        role: "tutor" as const,
        text: "Hello! Welcome. How can I help you today?",
      },
      {
        role: "user" as const,
        text: "Hi! I'd like to order a cappuccino, please.",
        pronunciationScore: 85,
        fluencyScore: 80,
        grammarScore: 90,
        contentScore: 85,
      },
      {
        role: "tutor" as const,
        text: "Of course! Would you like that hot or iced?",
      },
      {
        role: "user" as const,
        text: "Hot, please. And do you have any pastries?",
        pronunciationScore: 80,
        fluencyScore: 75,
        grammarScore: 85,
        contentScore: 80,
      },
      {
        role: "tutor" as const,
        text: "Yes, we have croissants, muffins, and cookies. What would you like?",
      },
      {
        role: "user" as const,
        text: "I'll take a chocolate croissant, thank you.",
        pronunciationScore: 85,
        fluencyScore: 85,
        grammarScore: 90,
        contentScore: 90,
      },
    ];

    for (const turn of turns) {
      await prisma.speakingTurn.create({
        data: {
          sessionId: session.id,
          role: turn.role,
          text: turn.text,
          pronunciationScore: turn.pronunciationScore,
          fluencyScore: turn.fluencyScore,
          grammarScore: turn.grammarScore,
          contentScore: turn.contentScore,
        },
      });
    }

    console.log(`  ✅ Created ${turns.length} turns`);
  }

  console.log("\n🎉 Sample sessions & turns created!");
  console.log(`\n📊 Summary:`);
  console.log(`  - User: ${user.email}`);
  console.log(`  - Sessions: ${scenarios.length}`);
  console.log(`  - Turns per session: 6`);
  console.log(`\n🔗 Test URLs:`);
  console.log(
    `  - Sessions: http://localhost:3000/api/speaking/sessions?userId=${user.id}`
  );
  console.log(`  - User ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

