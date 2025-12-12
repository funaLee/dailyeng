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
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ============================================
  // 1. CREATE TOPICS
  // ============================================
  // ============================================
  // 0. CLEANUP
  // ============================================
  console.log('🧹 Cleaning up database...')
  try {
    await prisma.speakingTurn.deleteMany()
    await prisma.speakingSession.deleteMany()
    await prisma.speakingScenario.deleteMany()
    await prisma.vocabItem.deleteMany()
    await prisma.grammarNote.deleteMany()
    await prisma.quizItem.deleteMany()
    await prisma.topic.deleteMany()
    // await prisma.flashcardCollection.deleteMany()
    // await prisma.badge.deleteMany()
    console.log('✅ Database cleaned\n')
  } catch (e) {
    console.warn('⚠️ Cleanup warning (tables might be empty or missing):', e)
  }

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
        partOfSpeech: 'noun',
        meaning: 'An official document for international travel',
        vietnameseMeaning: 'Hộ chiếu',
        exampleSentence: 'I need to renew my passport before the trip.',
        exampleTranslation: 'Tôi cần gia hạn hộ chiếu trước chuyến đi.',
        collocations: ['renew a passport', 'check your passport'],
      },
      {
        topicId: travelTopic.id,
        word: 'luggage',
        pronunciation: '/ˈlʌɡɪdʒ/',
        partOfSpeech: 'noun',
        meaning: 'Bags and suitcases for carrying belongings',
        vietnameseMeaning: 'Hành lý',
        exampleSentence: 'Please put your luggage on the conveyor belt.',
        exampleTranslation: 'Vui lòng đặt hành lý của bạn lên băng chuyền.',
        collocations: ['pack luggage', 'check luggage'],
      },
      {
        topicId: travelTopic.id,
        word: 'accommodation',
        pronunciation: '/əˌkɒməˈdeɪʃən/',
        partOfSpeech: 'noun',
        meaning: 'A place to stay during travel',
        vietnameseMeaning: 'Chỗ ở',
        exampleSentence: 'We booked accommodation near the beach.',
        exampleTranslation: 'Chúng tôi đã đặt chỗ ở gần bãi biển.',
        collocations: ['book accommodation', 'find accommodation'],
      },
      {
        topicId: travelTopic.id,
        word: 'itinerary',
        pronunciation: '/aɪˈtɪnəreri/',
        partOfSpeech: 'noun',
        meaning: 'A planned route or journey',
        vietnameseMeaning: 'Lịch trình',
        exampleSentence: 'Our itinerary includes visits to three countries.',
        exampleTranslation: 'Lịch trình của chúng tôi bao gồm thăm ba quốc gia.',
        collocations: ['plan an itinerary', 'follow an itinerary'],
      },
      {
        topicId: travelTopic.id,
        word: 'souvenir',
        pronunciation: '/ˌsuːvəˈnɪr/',
        partOfSpeech: 'noun',
        meaning: 'A memento or gift from a place visited',
        vietnameseMeaning: 'Quà lưu niệm',
        exampleSentence: 'I bought some souvenirs from the local market.',
        exampleTranslation: 'Tôi đã mua một số quà lưu niệm từ chợ địa phương.',
        collocations: ['buy souvenirs', 'collect souvenirs'],
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
        partOfSpeech: 'noun',
        meaning: 'A small dish served before the main course',
        vietnameseMeaning: 'Món khai vị',
        exampleSentence: 'We ordered shrimp appetizers to start.',
        exampleTranslation: 'Chúng tôi đã gọi món khai vị tôm để bắt đầu.',
        collocations: ['order appetizers', 'serve appetizers'],
      },
      {
        topicId: foodTopic.id,
        word: 'recipe',
        pronunciation: '/ˈresəpi/',
        partOfSpeech: 'noun',
        meaning: 'Instructions for preparing a dish',
        vietnameseMeaning: 'Công thức nấu ăn',
        exampleSentence: 'This recipe is easy to follow.',
        exampleTranslation: 'Công thức này dễ theo dõi.',
        collocations: ['follow a recipe', 'share a recipe'],
      },
      {
        topicId: foodTopic.id,
        word: 'ingredient',
        pronunciation: '/ɪnˈɡriːdiənt/',
        partOfSpeech: 'noun',
        meaning: 'A component of a mixture or dish',
        vietnameseMeaning: 'Nguyên liệu',
        exampleSentence: 'The main ingredient is fresh tomatoes.',
        exampleTranslation: 'Nguyên liệu chính là cà chua tươi.',
        collocations: ['mix ingredients', 'list ingredients'],
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
        type: 'multiple_choice',
        options: ['/pæsˈpɔːrt/', '/ˈpæspɔːrt/', '/pæsˈpɔrt/', '/ˈpæspɔrt/'],
        correctAnswer: '/ˈpæspɔːrt/',
        explanation: 'The stress is on the first syllable: PASS-port',
      },
      {
        topicId: travelTopic.id,
        question: "Which word means 'a planned route or journey'?",
        type: 'multiple_choice',
        options: ['luggage', 'itinerary', 'accommodation', 'souvenir'],
        correctAnswer: 'itinerary',
        explanation: 'An itinerary is a detailed plan of a journey.',
      },
      {
        topicId: foodTopic.id,
        question: 'What is an appetizer?',
        type: 'multiple_choice',
        options: [
          'The main course',
          'A small dish served before the main course',
          'A sweet course at the end',
          'A type of restaurant',
        ],
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
      // === DAILY LIFE ===
      {
        title: "Grocery Shopping",
        description:
          "Navigate the aisles of a supermarket, ask for specific items, and handle checkout interactions efficiently.",
        category: "Daily Life",
        subcategory: "Shopping",
        difficulty: "A2",
        goal: "Complete a grocery run smoothly",
        context:
          "You are shopping for a dinner party and need to find specific ingredients.",
        image: "/scenarios/grocery.png",
      },
      {
        title: "Buying a Gift",
        description:
          "Select a meaningful present for a friend by discussing options and preferences with a store clerk.",
        category: "Daily Life",
        subcategory: "Shopping",
        difficulty: "B1",
        goal: "Find the perfect birthday gift",
        context:
          "You are in a lifestyle store looking for a birthday gift for your best friend.",
        image: "/scenarios/gift-shop.png",
      },
      {
        title: "Ordering Dinner",
        description:
          "Place a detailed dinner order at a restaurant, including special dietary requests and drink selection.",
        category: "Daily Life",
        subcategory: "Dining",
        difficulty: "A2",
        goal: "Order a meal with modifications",
        context:
          "You are at an Italian restaurant effectively ordering a three-course meal.",
        image: "/scenarios/restaurant.png",
      },
      {
        title: "Doctor Appointment",
        description:
          "Explain your symptoms clearly to a doctor and understand the medical advice and prescription instructions.",
        category: "Daily Life",
        subcategory: "Healthcare",
        difficulty: "B2",
        goal: "Communicate health concerns accurately",
        context:
          "You have a persistent headache and are visiting a doctor for a checkup.",
        image: "/scenarios/doctor.png",
      },
      {
        title: "Pharmacy Visit",
        description:
          "Ask a pharmacist for advice on over-the-counter medication and understand dosage instructions correctly.",
        category: "Daily Life",
        subcategory: "Healthcare",
        difficulty: "B1",
        goal: "Purchase the right medication",
        context:
          "You need medicine for a cold and are asking the pharmacist for recommendations.",
        image: "/scenarios/pharmacy.png",
      },
      {
        title: "Taking a Taxi",
        description:
          "Direct a taxi driver to your destination, discuss the best route, and handle payment interactions.",
        category: "Daily Life",
        subcategory: "Transportation",
        difficulty: "A2",
        goal: "Reach destination efficiently",
        context:
          "You are in a new city taking a taxi to your hotel from the airport.",
        image: "/scenarios/taxi.png",
      },

      // === PROFESSIONAL ENGLISH ===
      {
        title: "Project Kickoff",
        description:
          "Lead a team introduction, outline project goals, and assign initial tasks in a business meeting.",
        category: "Professional English",
        subcategory: "Meetings",
        difficulty: "C1",
        goal: "Align team on project objectives",
        context:
          "You are the project manager leading the first meeting for a new software launch.",
        image: "/scenarios/meeting.png",
      },
      {
        title: "Salary Negotiation",
        description:
          "Discuss your achievements and negotiate a fair compensation package with your HR manager confidently.",
        category: "Professional English",
        subcategory: "Negotiations",
        difficulty: "C1",
        goal: "Secure a salary increase",
        context: "You are in an annual performance review negotiating a raise.",
        image: "/scenarios/negotiation.png",
      },
      {
        title: "Job Interview",
        description:
          "Answer common interview questions about your strengths, weaknesses, and professional experience persuasively.",
        category: "Professional English",
        subcategory: "Interviews",
        difficulty: "B2",
        goal: "Impress the hiring manager",
        context:
          "You are interviewing for a Senior Marketing role at a tech company.",
        image: "/scenarios/interview.png",
      },
      {
        title: "Client Presentation",
        description:
          "Present a new product proposal to a potential client, highlighting key benefits and addressing concerns.",
        category: "Professional English",
        subcategory: "Presentations",
        difficulty: "B2",
        goal: "Persuade client to buy",
        context:
          "You are pitching a new clear-energy solution to a corporate client.",
        image: "/scenarios/presentation.png",
      },

      // === TRAVEL ===
      {
        title: "Hotel Check-in",
        description:
          "Complete the check-in process, ask about hotel amenities, and request a room with a view.",
        category: "Travel",
        subcategory: "Hotels",
        difficulty: "A2",
        goal: "Check in seamlessly",
        context:
          "You have arrived at your hotel and are checking in at the front desk.",
        image: "/scenarios/hotel.png",
      },
      {
        title: "Airport Check-in",
        description:
          "Handle luggage check-in, seat selection, and boarding gate inquiries at the airport counter.",
        category: "Travel",
        subcategory: "Airports",
        difficulty: "B1",
        goal: "Board flight without issues",
        context:
          "You are checking in for an international flight at the airline counter.",
        image: "/scenarios/airport.png",
      },
      {
        title: "Tourist Information",
        description:
          "Ask for directions to landmarks and recommendations for local attractions at a tourist center.",
        category: "Travel",
        subcategory: "Tourist Sites",
        difficulty: "A2",
        goal: "Plan a day of sightseeing",
        context:
          "You are at a visitor center asking for a map and recommendations.",
        image: "/scenarios/tourist.png",
      },

      // === SOCIAL SITUATIONS ===
      {
        title: "Party Introduction",
        description:
          "Introduce yourself to new people at a social gathering and start engaging conversations.",
        category: "Social Situations",
        subcategory: "Parties",
        difficulty: "B1",
        goal: "Make new connections",
        context: "You are at a house party and want to meet new people.",
        image: "/scenarios/party.png",
      },
      {
        title: "Making Small Talk",
        description:
          "Discuss the weather, current events, and hobbies to break the ice with an acquaintance.",
        category: "Social Situations",
        subcategory: "Small Talk",
        difficulty: "B1",
        goal: "Maintain a casual conversation",
        context:
          "You are waiting for a bus next to a neighbor you barely know.",
        image: "/scenarios/small-talk.png",
      },
    ],
  });

  console.log('✅ Created 3 speaking scenarios\n')

  /*
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
  */

  /*
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
  */

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
