/**
 * Database Seed Script
 * 
 * Mục đích:
 * - Tạo sample data trong database
 * - Chuyển mock data thành real data
 * - Giúp test ngay mà không cần tạo data thủ công
 * 
 * Cách chạy:
 * npx tsx prisma/seed.ts
 * hoặc
 * npm run db:seed
 * test 
 */

import { PrismaClient } from "../src/lib/generated/prisma";

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ============================================
  // 1. CREATE TOPICS
  // ============================================
  console.log('📚 Creating topics...')
  
  const travelTopic = await prisma.topic.create({
    data: {
      title: 'Travel',
      description: 'Essential vocabulary for traveling abroad',
      level: 'A2',
      category: 'Travel',
      subcategory: 'General',
      thumbnail: '/diverse-travelers-world-map.png',
      wordCount: 5,
      estimatedTime: 45,
    },
  })

  const foodTopic = await prisma.topic.create({
    data: {
      title: 'Food & Dining',
      description: 'Learn food names, cooking methods, and restaurant phrases',
      level: 'A2',
      category: 'Food and drink',
      subcategory: 'Meals',
      thumbnail: '/diverse-food-spread.png',
      wordCount: 5,
      estimatedTime: 50,
    },
  })

  const jobTopic = await prisma.topic.create({
    data: {
      title: 'Job Interview',
      description: 'Professional vocabulary and interview techniques',
      level: 'B1',
      category: 'Professional English',
      subcategory: 'Interviews',
      thumbnail: '/abstract-job-concept.png',
      wordCount: 5,
      estimatedTime: 60,
    },
  })

  console.log('✅ Created 3 topics\n')

  // ============================================
  // 2. CREATE VOCABULARY ITEMS
  // ============================================
  console.log('📖 Creating vocabulary items...')

  // Travel vocabulary
  await prisma.vocabItem.createMany({
    data: [
      {
        topicId: travelTopic.id,
        word: 'passport',
        pronunciation: '/ˈpæspɔːrt/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['An official document for international travel']),
        vietnameseMeanings: JSON.stringify(['Hộ chiếu']),
        examples: JSON.stringify([
          {
            en: 'I need to renew my passport before the trip.',
            vi: 'Tôi cần gia hạn hộ chiếu trước chuyến đi.',
          },
        ]),
        collocations: JSON.stringify(['renew a passport', 'check your passport']),
      },
      {
        topicId: travelTopic.id,
        word: 'luggage',
        pronunciation: '/ˈlʌɡɪdʒ/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['Bags and suitcases for carrying belongings']),
        vietnameseMeanings: JSON.stringify(['Hành lý']),
        examples: JSON.stringify([
          {
            en: 'Please put your luggage on the conveyor belt.',
            vi: 'Vui lòng đặt hành lý của bạn lên băng chuyền.',
          },
        ]),
        collocations: JSON.stringify(['pack luggage', 'check luggage']),
      },
      {
        topicId: travelTopic.id,
        word: 'accommodation',
        pronunciation: '/əˌkɒməˈdeɪʃən/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['A place to stay during travel']),
        vietnameseMeanings: JSON.stringify(['Chỗ ở']),
        examples: JSON.stringify([
          {
            en: 'We booked accommodation near the beach.',
            vi: 'Chúng tôi đã đặt chỗ ở gần bãi biển.',
          },
        ]),
        collocations: JSON.stringify(['book accommodation', 'find accommodation']),
      },
      {
        topicId: travelTopic.id,
        word: 'itinerary',
        pronunciation: '/aɪˈtɪnəreri/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['A planned route or journey']),
        vietnameseMeanings: JSON.stringify(['Lịch trình']),
        examples: JSON.stringify([
          {
            en: 'Our itinerary includes visits to three countries.',
            vi: 'Lịch trình của chúng tôi bao gồm thăm ba quốc gia.',
          },
        ]),
        collocations: JSON.stringify(['plan an itinerary', 'follow an itinerary']),
      },
      {
        topicId: travelTopic.id,
        word: 'souvenir',
        pronunciation: '/ˌsuːvəˈnɪr/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['A memento or gift from a place visited']),
        vietnameseMeanings: JSON.stringify(['Quà lưu niệm']),
        examples: JSON.stringify([
          {
            en: 'I bought some souvenirs from the local market.',
            vi: 'Tôi đã mua một số quà lưu niệm từ chợ địa phương.',
          },
        ]),
        collocations: JSON.stringify(['buy souvenirs', 'collect souvenirs']),
      },
    ],
  })

  // Food vocabulary
  await prisma.vocabItem.createMany({
    data: [
      {
        topicId: foodTopic.id,
        word: 'appetizer',
        pronunciation: '/ˈæpɪtaɪzər/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['A small dish served before the main course']),
        vietnameseMeanings: JSON.stringify(['Món khai vị']),
        examples: JSON.stringify([
          {
            en: 'We ordered shrimp appetizers to start.',
            vi: 'Chúng tôi đã gọi món khai vị tôm để bắt đầu.',
          },
        ]),
        collocations: JSON.stringify(['order appetizers', 'serve appetizers']),
      },
      {
        topicId: foodTopic.id,
        word: 'recipe',
        pronunciation: '/ˈresəpi/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['Instructions for preparing a dish']),
        vietnameseMeanings: JSON.stringify(['Công thức nấu ăn']),
        examples: JSON.stringify([
          {
            en: 'This recipe is easy to follow.',
            vi: 'Công thức này dễ theo dõi.',
          },
        ]),
        collocations: JSON.stringify(['follow a recipe', 'share a recipe']),
      },
      {
        topicId: foodTopic.id,
        word: 'ingredient',
        pronunciation: '/ɪnˈɡriːdiənt/',
        partOfSpeech: 'NOUN',
        meanings: JSON.stringify(['A component of a mixture or dish']),
        vietnameseMeanings: JSON.stringify(['Nguyên liệu']),
        examples: JSON.stringify([
          {
            en: 'The main ingredient is fresh tomatoes.',
            vi: 'Nguyên liệu chính là cà chua tươi.',
          },
        ]),
        collocations: JSON.stringify(['mix ingredients', 'list ingredients']),
      },
    ],
  })

  console.log('✅ Created 8 vocabulary items\n')

  // ============================================
  // 3. CREATE GRAMMAR NOTES
  // ============================================
  console.log('📝 Creating grammar notes...')

  await prisma.grammarNote.create({
    data: {
      topicId: travelTopic.id,
      title: 'Present Perfect for Recent Experiences',
      explanation:
        'Use present perfect to talk about experiences you have had. Form: have/has + past participle',
      examples: JSON.stringify([
        {
          en: 'I have traveled to five countries.',
          vi: 'Tôi đã du lịch đến năm quốc gia.',
        },
        {
          en: 'She has visited Paris twice.',
          vi: 'Cô ấy đã thăm Paris hai lần.',
        },
      ]),
    },
  })

  console.log('✅ Created 1 grammar note\n')

  // ============================================
  // 4. CREATE QUIZ ITEMS
  // ============================================
  console.log('❓ Creating quiz items...')

  await prisma.quizItem.createMany({
    data: [
      {
        topicId: travelTopic.id,
        question: "What is the correct pronunciation of 'passport'?",
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify(['/pæsˈpɔːrt/', '/ˈpæspɔːrt/', '/pæsˈpɔrt/', '/ˈpæspɔrt/']),
        correctAnswer: '/ˈpæspɔːrt/',
        explanation: 'The stress is on the first syllable: PASS-port',
      },
      {
        topicId: travelTopic.id,
        question: "Which word means 'a planned route or journey'?",
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify(['luggage', 'itinerary', 'accommodation', 'souvenir']),
        correctAnswer: 'itinerary',
        explanation: 'An itinerary is a detailed plan of a journey.',
      },
      {
        topicId: foodTopic.id,
        question: 'What is an appetizer?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'The main course',
          'A small dish served before the main course',
          'A sweet course at the end',
          'A type of restaurant',
        ]),
        correctAnswer: 'A small dish served before the main course',
        explanation: 'Appetizers are served at the beginning of a meal.',
      },
    ],
  })

  console.log('✅ Created 3 quiz items\n')

  // ============================================
  // 5. CREATE SPEAKING SCENARIOS
  // ============================================
  console.log('🎤 Creating speaking scenarios...')

  await prisma.speakingScenario.createMany({
    data: [
      {
        title: 'Ordering at a Café',
        description: 'Practice ordering coffee and food at a local café',
        category: 'Daily Life',
        subcategory: 'Dining',
        level: 'A2',
        goal: 'Learn to order confidently and handle common café interactions',
        context: 'You are at a café counter. The barista will take your order.',
        objectives: JSON.stringify([
          'Greet the barista',
          'Order drinks and food',
          'Ask about options',
          'Make payment',
        ]),
        keyExpressions: JSON.stringify([
          {
            en: "I'd like a cappuccino, please.",
            vi: 'Tôi muốn một ly cappuccino.',
          },
          {
            en: 'Do you have any dairy-free options?',
            vi: 'Bạn có lựa chọn nào không có sữa không?',
          },
        ]),
        totalSessions: 5,
        estimatedMinutes: 15,
      },
      {
        title: 'Shopping for Clothes',
        description: 'Navigate a clothing store and ask for sizes and colors',
        category: 'Daily Life',
        subcategory: 'Shopping',
        level: 'A2',
        goal: 'Master retail vocabulary and polite requests',
        context: 'You are in a clothing store looking for specific items.',
        objectives: JSON.stringify([
          'Ask for sizes',
          'Inquire about colors',
          'Try on clothes',
          'Make a purchase',
        ]),
        keyExpressions: JSON.stringify([
          {
            en: 'Do you have this in a medium?',
            vi: 'Bạn có cái này size M không?',
          },
          {
            en: 'Can I try this on?',
            vi: 'Tôi có thể thử cái này được không?',
          },
        ]),
        totalSessions: 4,
        estimatedMinutes: 12,
      },
      {
        title: 'Hotel Check-in',
        description: 'Check into a hotel and ask about amenities',
        category: 'Travel',
        subcategory: 'Hotels',
        level: 'A2',
        goal: 'Learn travel-related vocabulary and polite inquiries',
        context: 'You are checking in at a hotel reception.',
        objectives: JSON.stringify([
          'Provide booking information',
          'Ask about room amenities',
          'Inquire about breakfast',
          'Get room key',
        ]),
        keyExpressions: JSON.stringify([
          {
            en: 'I have a reservation under the name Smith.',
            vi: 'Tôi có đặt phòng dưới tên Smith.',
          },
          {
            en: 'What time is breakfast served?',
            vi: 'Bữa sáng được phục vụ lúc mấy giờ?',
          },
        ]),
        totalSessions: 5,
        estimatedMinutes: 15,
      },
    ],
  })

  console.log('✅ Created 3 speaking scenarios\n')

  // ============================================
  // 6. CREATE FLASHCARD COLLECTIONS
  // ============================================
  console.log('📇 Creating flashcard collections...')

  await prisma.flashcardCollection.createMany({
    data: [
      {
        name: 'Vocabulary',
        icon: 'BookOpen',
        type: 'VOCABULARY',
      },
      {
        name: 'Grammar',
        icon: 'FileText',
        type: 'GRAMMAR',
      },
      {
        name: 'Collocations',
        icon: 'Link2',
        type: 'COLLOCATIONS',
      },
      {
        name: 'Idioms & Expressions',
        icon: 'MessageSquare',
        type: 'IDIOMS',
      },
      {
        name: 'Phrasal Verbs',
        icon: 'Zap',
        type: 'PHRASAL_VERBS',
      },
    ],
  })

  console.log('✅ Created 5 flashcard collections\n')

  // ============================================
  // 7. CREATE BADGES
  // ============================================
  console.log('🏆 Creating badges...')

  await prisma.badge.createMany({
    data: [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'ACHIEVEMENT',
        requirement: JSON.stringify({ type: 'lessons_completed', count: 1 }),
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'STREAK',
        requirement: JSON.stringify({ type: 'streak', days: 7 }),
      },
      {
        name: 'Vocabulary Master',
        description: 'Learn 100 words',
        icon: '📚',
        category: 'VOCABULARY',
        requirement: JSON.stringify({ type: 'words_learned', count: 100 }),
      },
      {
        name: 'Speaking Star',
        description: 'Complete 10 speaking sessions',
        icon: '🎤',
        category: 'SPEAKING',
        requirement: JSON.stringify({ type: 'speaking_sessions', count: 10 }),
      },
      {
        name: 'Quiz Champion',
        description: 'Score 100% on 5 quizzes',
        icon: '🏅',
        category: 'QUIZ',
        requirement: JSON.stringify({ type: 'perfect_quizzes', count: 5 }),
      },
    ],
  })

  console.log('✅ Created 5 badges\n')

  // ============================================
  // SUMMARY
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎉 Database seeded successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📊 Summary:')
  console.log('  ✅ 3 Topics')
  console.log('  ✅ 8 Vocabulary Items')
  console.log('  ✅ 1 Grammar Note')
  console.log('  ✅ 3 Quiz Items')
  console.log('  ✅ 3 Speaking Scenarios')
  console.log('  ✅ 5 Flashcard Collections')
  console.log('  ✅ 5 Badges')
  console.log('\n🔍 Next steps:')
  console.log('  1. Run: npx prisma studio')
  console.log('  2. View data at: http://localhost:5555')
  console.log('  3. Create API routes to use this data')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
