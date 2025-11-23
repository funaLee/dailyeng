/**
 * Seed Sample Speaking Sessions & Turns
 * 
 * Tạo data mẫu để test:
 * - 1 demo user
 * - 3 speaking sessions
 * - Turns (hội thoại) cho mỗi session
 */

import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🎤 Seeding Speaking Sessions & Turns...\n')

  // 1. Tạo demo user
  console.log('👤 Creating demo user...')
  const user = await prisma.user.create({
    data: {
      email: 'demo@englishflow.com',
      name: 'Demo User',
      password: 'hashed_password_here', // In production, hash this!
      currentLevel: 'A2',
      xp: 1250,
      streak: 7,
    },
  })
  console.log(`✅ Created user: ${user.email}\n`)

  // 2. Lấy scenarios
  const scenarios = await prisma.speakingScenario.findMany({
    take: 3,
  })

  if (scenarios.length === 0) {
    console.log('⚠️  No scenarios found. Run seed-speaking.ts first!')
    return
  }

  // 3. Tạo sessions với turns
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i]
    
    console.log(`📝 Creating session ${i + 1}: ${scenario.title}`)
    
    const session = await prisma.speakingSession.create({
      data: {
        userId: user.id,
        scenarioId: scenario.id,
        status: i === 0 ? 'COMPLETED' : 'IN_PROGRESS',
        overallScore: i === 0 ? 85 : null,
        pronunciationScore: i === 0 ? 8.5 : null,
        fluencyScore: i === 0 ? 8.0 : null,
        grammarScore: i === 0 ? 8.5 : null,
        contentScore: i === 0 ? 9.0 : null,
        completedAt: i === 0 ? new Date() : null,
      },
    })

    // Tạo turns cho session
    const turns = [
      {
        role: 'TUTOR' as const,
        text: 'Hello! Welcome. How can I help you today?',
      },
      {
        role: 'USER' as const,
        text: "Hi! I'd like to order a cappuccino, please.",
        pronunciationScore: 8.5,
        fluencyScore: 8.0,
        grammarScore: 9.0,
        contentScore: 8.5,
      },
      {
        role: 'TUTOR' as const,
        text: 'Of course! Would you like that hot or iced?',
      },
      {
        role: 'USER' as const,
        text: 'Hot, please. And do you have any pastries?',
        pronunciationScore: 8.0,
        fluencyScore: 7.5,
        grammarScore: 8.5,
        contentScore: 8.0,
      },
      {
        role: 'TUTOR' as const,
        text: 'Yes, we have croissants, muffins, and cookies. What would you like?',
      },
      {
        role: 'USER' as const,
        text: "I'll take a chocolate croissant, thank you.",
        pronunciationScore: 8.5,
        fluencyScore: 8.5,
        grammarScore: 9.0,
        contentScore: 9.0,
      },
    ]

    for (const turn of turns) {
      await prisma.speakingTurn.create({
        data: {
          sessionId: session.id,
          ...turn,
        },
      })
    }

    console.log(`  ✅ Created ${turns.length} turns`)
  }

  console.log('\n🎉 Sample sessions & turns created!')
  console.log(`\n📊 Summary:`)
  console.log(`  - User: ${user.email}`)
  console.log(`  - Sessions: ${scenarios.length}`)
  console.log(`  - Turns per session: 6`)
  console.log(`\n🔗 Test URLs:`)
  console.log(`  - Sessions: http://localhost:3000/api/speaking/sessions?userId=${user.id}`)
  console.log(`  - User ID: ${user.id}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
