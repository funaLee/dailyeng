import {
  PrismaClient,
  Level,
  PartOfSpeech,
  QuizType,
  Role,
  StudyGoal,
  TaskType,
  NotificationType,
  ShopItemCategory,
  CollectionRarity,
  CollectionType,
  LessonType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.speakingTurnError.deleteMany();
  await prisma.speakingTurn.deleteMany();
  await prisma.speakingSession.deleteMany();
  await prisma.speakingBookmark.deleteMany();
  await prisma.speakingScenario.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.userDailyMission.deleteMany();
  await prisma.dailyMission.deleteMany();
  await prisma.userActivity.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.userCollection.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.userInventory.deleteMany();
  await prisma.shopItem.deleteMany();
  await prisma.placementTestResult.deleteMany();
  await prisma.studyTask.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.notebookItem.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.quizItem.deleteMany();
  await prisma.listeningTask.deleteMany();
  await prisma.readingPassage.deleteMany();
  await prisma.grammarNote.deleteMany();
  await prisma.vocabItem.deleteMany();
  await prisma.userTopicProgress.deleteMany();
  await prisma.courseRegistration.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.course.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.profileStats.deleteMany();
  await prisma.user.deleteMany();

  // ==================== USERS ====================
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Nguyễn Văn An",
        email: "an.nguyen@email.com",
        password: "$2a$10$hashedpassword1",
        phoneNumber: "0901234567",
        dateOfBirth: new Date("1998-05-15"),
        gender: "male",
        level: Level.B1,
      },
    }),
    prisma.user.create({
      data: {
        name: "Trần Thị Bình",
        email: "binh.tran@email.com",
        password: "$2a$10$hashedpassword2",
        phoneNumber: "0912345678",
        dateOfBirth: new Date("2000-08-22"),
        gender: "female",
        level: Level.A2,
      },
    }),
    prisma.user.create({
      data: {
        name: "Lê Minh Châu",
        email: "chau.le@email.com",
        password: "$2a$10$hashedpassword3",
        phoneNumber: "0923456789",
        dateOfBirth: new Date("1995-12-01"),
        gender: "female",
        level: Level.B2,
      },
    }),
    prisma.user.create({
      data: {
        name: "Phạm Đức Dũng",
        email: "dung.pham@email.com",
        password: "$2a$10$hashedpassword4",
        phoneNumber: "0934567890",
        dateOfBirth: new Date("2002-03-10"),
        gender: "male",
        level: Level.A1,
      },
    }),
    prisma.user.create({
      data: {
        name: "Hoàng Mai Linh",
        email: "linh.hoang@email.com",
        password: "$2a$10$hashedpassword5",
        phoneNumber: "0945678901",
        dateOfBirth: new Date("1997-07-28"),
        gender: "female",
        level: Level.C1,
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ==================== PROFILE STATS ====================
  const profileStats = await Promise.all(
    users.map((user, i) =>
      prisma.profileStats.create({
        data: {
          userId: user.id,
          xp: [1250, 580, 3200, 120, 5800][i],
          streak: [15, 7, 45, 3, 120][i],
          totalLearningMinutes: [450, 180, 1200, 45, 2800][i],
          badges: [
            ["first_lesson", "week_streak"],
            ["first_lesson"],
            ["vocab_master", "month_streak", "grammar_pro"],
            ["newbie"],
            ["legend", "polyglot", "teacher"],
          ][i],
          coins: [500, 200, 1500, 50, 3000][i],
          vocabScore: [75, 45, 90, 20, 95][i],
          grammarScore: [70, 50, 85, 15, 92][i],
          speakingScore: [65, 40, 80, 10, 88][i],
          listeningScore: [72, 48, 88, 18, 90][i],
          readingScore: [78, 52, 92, 22, 94][i],
          writingScore: [68, 42, 82, 12, 86][i],
          lastStreakDate: new Date(),
        },
      })
    )
  );
  console.log(`✅ Created ${profileStats.length} profile stats`);

  // ==================== COURSES ====================
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        name: "English for Beginners",
        description: "Khóa học tiếng Anh cơ bản dành cho người mới bắt đầu",
        estimatedCompletion: "3 tháng",
        category: "General",
        order: 1,
      },
    }),
    prisma.course.create({
      data: {
        name: "IELTS Preparation",
        description: "Luyện thi IELTS từ 5.0 đến 7.0",
        estimatedCompletion: "6 tháng",
        category: "IELTS",
        order: 2,
      },
    }),
    prisma.course.create({
      data: {
        name: "Business English",
        description: "Tiếng Anh thương mại và giao tiếp công sở",
        estimatedCompletion: "4 tháng",
        category: "Business",
        order: 3,
      },
    }),
    prisma.course.create({
      data: {
        name: "TOEIC 700+",
        description: "Chinh phục TOEIC với mục tiêu 700+",
        estimatedCompletion: "5 tháng",
        category: "TOEIC",
        order: 4,
      },
    }),
    prisma.course.create({
      data: {
        name: "Daily Conversation",
        description: "Giao tiếp hàng ngày tự tin",
        estimatedCompletion: "2 tháng",
        category: "Speaking",
        order: 5,
      },
    }),
  ]);
  console.log(`✅ Created ${courses.length} courses`);

  // ==================== TOPICS ====================
  const topics = await Promise.all([
    prisma.topic.create({
      data: {
        title: "Present Simple Tense",
        subtitle: "Thì hiện tại đơn",
        description: "Học cách sử dụng thì hiện tại đơn trong tiếng Anh",
        level: Level.A1,
        wordCount: 20,
        estimatedTime: 30,
        category: "Tenses",
        courseId: courses[0].id,
        order: 1,
      },
    }),
    prisma.topic.create({
      data: {
        title: "Food & Cooking",
        subtitle: "Ẩm thực",
        description: "Từ vựng về đồ ăn và nấu nướng",
        level: Level.A2,
        wordCount: 35,
        estimatedTime: 45,
        category: "Vocabulary",
        courseId: courses[0].id,
        order: 2,
      },
    }),
    prisma.topic.create({
      data: {
        title: "IELTS Writing Task 1",
        subtitle: "Mô tả biểu đồ",
        description: "Kỹ năng viết mô tả biểu đồ",
        level: Level.B1,
        wordCount: 50,
        estimatedTime: 60,
        category: "Writing",
        courseId: courses[1].id,
        order: 1,
      },
    }),
    prisma.topic.create({
      data: {
        title: "Business Meeting",
        subtitle: "Họp công việc",
        description: "Từ vựng và cấu trúc cho cuộc họp",
        level: Level.B2,
        wordCount: 40,
        estimatedTime: 50,
        category: "Business",
        courseId: courses[2].id,
        order: 1,
      },
    }),
    prisma.topic.create({
      data: {
        title: "Travel & Tourism",
        subtitle: "Du lịch",
        description: "Giao tiếp khi đi du lịch",
        level: Level.A2,
        wordCount: 30,
        estimatedTime: 40,
        category: "Speaking",
        courseId: courses[4].id,
        order: 1,
      },
    }),
    prisma.topic.create({
      data: {
        title: "Past Tenses",
        subtitle: "Các thì quá khứ",
        description: "Past Simple, Past Continuous, Past Perfect",
        level: Level.B1,
        wordCount: 25,
        estimatedTime: 45,
        category: "Tenses",
        courseId: courses[0].id,
        order: 3,
      },
    }),
  ]);
  console.log(`✅ Created ${topics.length} topics`);

  // ==================== VOCAB ITEMS ====================
  const vocabItems = await Promise.all([
    prisma.vocabItem.create({
      data: {
        topicId: topics[1].id,
        word: "delicious",
        pronunciation: "/dɪˈlɪʃəs/",
        meaning: "very pleasant to taste",
        vietnameseMeaning: "ngon, thơm ngon",
        partOfSpeech: PartOfSpeech.adjective,
        collocations: ["delicious food", "absolutely delicious"],
        exampleSentence: "This cake is absolutely delicious!",
        exampleTranslation: "Chiếc bánh này thực sự rất ngon!",
      },
    }),
    prisma.vocabItem.create({
      data: {
        topicId: topics[1].id,
        word: "recipe",
        pronunciation: "/ˈresɪpi/",
        meaning: "instructions for cooking",
        vietnameseMeaning: "công thức nấu ăn",
        partOfSpeech: PartOfSpeech.noun,
        collocations: ["follow a recipe", "family recipe"],
        exampleSentence: "I found a great recipe online.",
        exampleTranslation: "Tôi tìm được một công thức tuyệt vời trên mạng.",
      },
    }),
    prisma.vocabItem.create({
      data: {
        topicId: topics[1].id,
        word: "ingredient",
        pronunciation: "/ɪnˈɡriːdiənt/",
        meaning: "component of a dish",
        vietnameseMeaning: "nguyên liệu",
        partOfSpeech: PartOfSpeech.noun,
        collocations: ["main ingredient", "fresh ingredients"],
        exampleSentence: "Fresh ingredients make all the difference.",
        exampleTranslation: "Nguyên liệu tươi tạo ra sự khác biệt.",
      },
    }),
    prisma.vocabItem.create({
      data: {
        topicId: topics[3].id,
        word: "agenda",
        pronunciation: "/əˈdʒendə/",
        meaning: "list of items for a meeting",
        vietnameseMeaning: "chương trình nghị sự",
        partOfSpeech: PartOfSpeech.noun,
        collocations: ["meeting agenda", "on the agenda"],
        exampleSentence: "Let me share the agenda for today.",
        exampleTranslation: "Để tôi chia sẻ chương trình họp hôm nay.",
      },
    }),
    prisma.vocabItem.create({
      data: {
        topicId: topics[3].id,
        word: "deadline",
        pronunciation: "/ˈdedlaɪn/",
        meaning: "time limit",
        vietnameseMeaning: "hạn chót",
        partOfSpeech: PartOfSpeech.noun,
        collocations: ["meet the deadline", "tight deadline"],
        exampleSentence: "We need to meet the deadline.",
        exampleTranslation: "Chúng ta cần hoàn thành đúng hạn.",
      },
    }),
    prisma.vocabItem.create({
      data: {
        topicId: topics[4].id,
        word: "reservation",
        pronunciation: "/ˌrezərˈveɪʃn/",
        meaning: "booking in advance",
        vietnameseMeaning: "đặt chỗ trước",
        partOfSpeech: PartOfSpeech.noun,
        collocations: ["make a reservation", "hotel reservation"],
        exampleSentence: "I have a reservation for two.",
        exampleTranslation: "Tôi đã đặt bàn cho hai người.",
      },
    }),
    prisma.vocabItem.create({
      data: {
        topicId: topics[4].id,
        word: "itinerary",
        pronunciation: "/aɪˈtɪnəreri/",
        meaning: "travel plan",
        vietnameseMeaning: "lịch trình",
        partOfSpeech: PartOfSpeech.noun,
        collocations: ["travel itinerary", "detailed itinerary"],
        exampleSentence: "Our itinerary includes three cities.",
        exampleTranslation: "Lịch trình của chúng tôi bao gồm ba thành phố.",
      },
    }),
  ]);
  console.log(`✅ Created ${vocabItems.length} vocab items`);

  // ==================== GRAMMAR NOTES ====================
  const grammarNotes = await Promise.all([
    prisma.grammarNote.create({
      data: {
        topicId: topics[0].id,
        title: "Cấu trúc cơ bản",
        explanation: "S + V(s/es) + O. Thêm -s/-es với chủ ngữ ngôi 3 số ít",
        examples: [
          { en: "She works every day.", vi: "Cô ấy làm việc mỗi ngày." },
        ],
      },
    }),
    prisma.grammarNote.create({
      data: {
        topicId: topics[0].id,
        title: "Câu phủ định",
        explanation: "S + do/does + not + V + O",
        examples: [
          { en: "He doesn't like coffee.", vi: "Anh ấy không thích cà phê." },
        ],
      },
    }),
    prisma.grammarNote.create({
      data: {
        topicId: topics[5].id,
        title: "Past Simple",
        explanation:
          "S + V-ed/V2 + O. Dùng cho hành động đã hoàn thành trong quá khứ",
        examples: [
          {
            en: "I visited Paris last year.",
            vi: "Tôi đã thăm Paris năm ngoái.",
          },
        ],
      },
    }),
    prisma.grammarNote.create({
      data: {
        topicId: topics[5].id,
        title: "Past Continuous",
        explanation:
          "S + was/were + V-ing + O. Dùng cho hành động đang xảy ra tại một thời điểm trong quá khứ",
        examples: [
          {
            en: "I was studying when she called.",
            vi: "Tôi đang học khi cô ấy gọi.",
          },
        ],
      },
    }),
    prisma.grammarNote.create({
      data: {
        topicId: topics[2].id,
        title: "Mở đầu Task 1",
        explanation: "Paraphrase đề bài, không copy nguyên văn",
        examples: [
          { en: "The chart illustrates...", vi: "Biểu đồ minh họa..." },
        ],
      },
    }),
  ]);
  console.log(`✅ Created ${grammarNotes.length} grammar notes`);

  // ==================== QUIZ ITEMS ====================
  const quizItems = await Promise.all([
    prisma.quizItem.create({
      data: {
        topicId: topics[0].id,
        question: "She ___ to school every day.",
        type: QuizType.fill_blank,
        options: ["go", "goes", "going", "went"],
        correctAnswer: "goes",
        explanation: "Chủ ngữ ngôi 3 số ít cần động từ thêm -s/-es",
      },
    }),
    prisma.quizItem.create({
      data: {
        topicId: topics[0].id,
        question: "Which sentence is correct?",
        type: QuizType.multiple_choice,
        options: [
          "He don't like it",
          "He doesn't likes it",
          "He doesn't like it",
          "He not like it",
        ],
        correctAnswer: "He doesn't like it",
        explanation: "Câu phủ định: S + doesn't + V nguyên mẫu",
      },
    }),
    prisma.quizItem.create({
      data: {
        topicId: topics[1].id,
        question: "Match the cooking methods",
        type: QuizType.matching,
        options: ["boil - luộc", "fry - chiên", "bake - nướng", "steam - hấp"],
        correctAnswer: "boil - luộc",
        explanation: "Các phương pháp nấu ăn cơ bản",
      },
    }),
    prisma.quizItem.create({
      data: {
        topicId: topics[3].id,
        question: "The meeting will ___ at 3 PM.",
        type: QuizType.fill_blank,
        options: ["start", "starts", "starting", "started"],
        correctAnswer: "start",
        explanation: "Sau will là động từ nguyên mẫu",
      },
    }),
    prisma.quizItem.create({
      data: {
        topicId: topics[5].id,
        question: "I ___ TV when the phone rang.",
        type: QuizType.fill_blank,
        options: ["watch", "watched", "was watching", "am watching"],
        correctAnswer: "was watching",
        explanation:
          "Past Continuous cho hành động đang xảy ra thì bị gián đoạn",
      },
    }),
  ]);
  console.log(`✅ Created ${quizItems.length} quiz items`);

  // ==================== SPEAKING SCENARIOS ====================
  const speakingScenarios = await Promise.all([
    prisma.speakingScenario.create({
      data: {
        topicId: topics[4].id,
        title: "At the Airport",
        description: "Thực hành giao tiếp tại sân bay",
        goal: "Hoàn thành thủ tục check-in",
        difficulty: Level.A2,
        context: "Bạn đang ở quầy check-in sân bay",
        category: "Travel",
        duration: 10,
      },
    }),
    prisma.speakingScenario.create({
      data: {
        topicId: topics[4].id,
        title: "Ordering Food",
        description: "Gọi món ở nhà hàng",
        goal: "Gọi món và thanh toán thành công",
        difficulty: Level.A2,
        context: "Bạn đang ở một nhà hàng",
        category: "Daily Life",
        duration: 8,
      },
    }),
    prisma.speakingScenario.create({
      data: {
        topicId: topics[3].id,
        title: "Job Interview",
        description: "Phỏng vấn xin việc",
        goal: "Trả lời các câu hỏi phỏng vấn",
        difficulty: Level.B2,
        context: "Bạn đang phỏng vấn cho vị trí Marketing",
        category: "Professional",
        duration: 15,
      },
    }),
    prisma.speakingScenario.create({
      data: {
        title: "Making Friends",
        description: "Làm quen bạn mới",
        goal: "Tự giới thiệu và hỏi thông tin cơ bản",
        difficulty: Level.A1,
        context: "Bạn gặp người mới tại một bữa tiệc",
        category: "Daily Life",
        duration: 10,
      },
    }),
    prisma.speakingScenario.create({
      data: {
        title: "Doctor Appointment",
        description: "Khám bệnh",
        goal: "Mô tả triệu chứng và hiểu hướng dẫn",
        difficulty: Level.B1,
        context: "Bạn đang ở phòng khám bác sĩ",
        category: "Health",
        duration: 12,
      },
    }),
  ]);
  console.log(`✅ Created ${speakingScenarios.length} speaking scenarios`);

  // ==================== LESSONS ====================
  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        topicId: topics[0].id,
        title: "Introduction to Present Simple",
        description: "Giới thiệu thì hiện tại đơn",
        duration: "10 min",
        type: LessonType.vocabulary,
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        topicId: topics[0].id,
        title: "Practice Exercises",
        description: "Bài tập thực hành",
        duration: "15 min",
        type: LessonType.quiz,
        order: 2,
      },
    }),
    prisma.lesson.create({
      data: {
        topicId: topics[1].id,
        title: "Food Vocabulary",
        description: "Từ vựng về đồ ăn",
        duration: "20 min",
        type: LessonType.vocabulary,
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        topicId: topics[1].id,
        title: "Cooking Methods",
        description: "Phương pháp nấu ăn",
        duration: "15 min",
        type: LessonType.vocabulary,
        order: 2,
      },
    }),
    prisma.lesson.create({
      data: {
        topicId: topics[2].id,
        title: "IELTS Task 1 Overview",
        description: "Tổng quan Task 1",
        duration: "25 min",
        type: LessonType.writing,
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        topicId: topics[3].id,
        title: "Meeting Vocabulary",
        description: "Từ vựng cuộc họp",
        duration: "20 min",
        type: LessonType.vocabulary,
        order: 1,
      },
    }),
  ]);
  console.log(`✅ Created ${lessons.length} lessons`);

  // ==================== STUDY PLANS ====================
  const studyPlans = await Promise.all([
    prisma.studyPlan.create({
      data: {
        userId: users[0].id,
        goal: StudyGoal.work,
        level: Level.B1,
        minutesPerDay: 30,
        wordsPerDay: 15,
        interests: ["business", "technology"],
      },
    }),
    prisma.studyPlan.create({
      data: {
        userId: users[1].id,
        goal: StudyGoal.travel,
        level: Level.A2,
        minutesPerDay: 20,
        wordsPerDay: 10,
        interests: ["travel", "food"],
      },
    }),
    prisma.studyPlan.create({
      data: {
        userId: users[2].id,
        goal: StudyGoal.exam,
        level: Level.B2,
        minutesPerDay: 60,
        wordsPerDay: 25,
        interests: ["ielts", "academic"],
      },
    }),
  ]);
  console.log(`✅ Created ${studyPlans.length} study plans`);

  // ==================== NOTIFICATIONS ====================
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        title: "Streak reminder",
        message: "Đừng quên học hôm nay để giữ streak!",
        type: NotificationType.system,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[0].id,
        title: "New vocabulary",
        message: "Bạn có 10 từ vựng mới cần ôn tập",
        type: NotificationType.vocabulary,
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        title: "Achievement unlocked",
        message: 'Chúc mừng! Bạn đã đạt huy hiệu "First Week"',
        type: NotificationType.achievement,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[2].id,
        title: "Speaking practice",
        message: "Đã đến lúc luyện nói!",
        type: NotificationType.speaking,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[3].id,
        title: "Welcome!",
        message: "Chào mừng bạn đến với DailyEng!",
        type: NotificationType.system,
        isRead: true,
      },
    }),
  ]);
  console.log(`✅ Created ${notifications.length} notifications`);

  // ==================== SHOP ITEMS ====================
  const shopItems = await Promise.all([
    prisma.shopItem.create({
      data: {
        name: "Double XP (24h)",
        description: "Nhân đôi XP trong 24 giờ",
        category: ShopItemCategory.boost,
        price: 100,
        icon: "⚡",
        status: "available",
      },
    }),
    prisma.shopItem.create({
      data: {
        name: "Streak Freeze",
        description: "Bảo vệ streak khi bạn bỏ lỡ 1 ngày",
        category: ShopItemCategory.power_up,
        price: 200,
        icon: "🛡️",
        status: "available",
      },
    }),
    prisma.shopItem.create({
      data: {
        name: "Premium Theme",
        description: "Giao diện Dark Pro",
        category: ShopItemCategory.cosmetic,
        price: 500,
        icon: "🎨",
        status: "available",
      },
    }),
    prisma.shopItem.create({
      data: {
        name: "Unlimited Hearts",
        description: "Tim không giới hạn trong 1 tuần",
        category: ShopItemCategory.access,
        price: 300,
        icon: "❤️",
        status: "available",
      },
    }),
    prisma.shopItem.create({
      data: {
        name: "AI Tutor Session",
        description: "1 buổi học với AI Tutor",
        category: ShopItemCategory.learning,
        price: 150,
        icon: "🤖",
        status: "available",
      },
    }),
  ]);
  console.log(`✅ Created ${shopItems.length} shop items`);

  // ==================== COLLECTION ITEMS ====================
  const collectionItems = await Promise.all([
    prisma.collectionItem.create({
      data: {
        name: "Golden Trophy",
        type: CollectionType.daily,
        rarity: CollectionRarity.rare,
        image: "/collections/trophy.png",
        metadata: { description: "Hoàn thành 7 ngày liên tiếp" },
      },
    }),
    prisma.collectionItem.create({
      data: {
        name: "Vocab Master Badge",
        type: CollectionType.gadget,
        rarity: CollectionRarity.epic,
        image: "/collections/vocab-badge.png",
        metadata: { ability: "Hiển thị số từ đã học" },
      },
    }),
    prisma.collectionItem.create({
      data: {
        name: "Professor Avatar",
        type: CollectionType.character,
        rarity: CollectionRarity.legendary,
        image: "/collections/professor.png",
        metadata: { unlockCondition: "Đạt 10000 XP" },
      },
    }),
    prisma.collectionItem.create({
      data: {
        name: "Galaxy Poster",
        type: CollectionType.poster,
        rarity: CollectionRarity.mythical,
        image: "/collections/galaxy.png",
        metadata: { event: "Space Week 2024" },
      },
    }),
    prisma.collectionItem.create({
      data: {
        name: "Starter Pack",
        type: CollectionType.daily,
        rarity: CollectionRarity.common,
        image: "/collections/starter.png",
        metadata: { description: "Vật phẩm khởi đầu" },
      },
    }),
  ]);
  console.log(`✅ Created ${collectionItems.length} collection items`);

  // ==================== DAILY MISSIONS ====================
  const dailyMissions = await Promise.all([
    prisma.dailyMission.create({
      data: {
        title: "Đăng nhập hằng ngày",
        description: "Đăng nhập vào ứng dụng",
        points: 10,
        type: "login",
        requirement: 1,
      },
    }),
    prisma.dailyMission.create({
      data: {
        title: "Học 10 từ vựng",
        description: "Hoàn thành 10 từ vựng mới",
        points: 50,
        type: "vocab",
        requirement: 10,
      },
    }),
    prisma.dailyMission.create({
      data: {
        title: "Luyện nói 5 phút",
        description: "Thực hành nói với AI",
        points: 30,
        type: "speaking",
        requirement: 5,
      },
    }),
    prisma.dailyMission.create({
      data: {
        title: "Hoàn thành 1 bài quiz",
        description: "Làm xong một bài kiểm tra",
        points: 25,
        type: "study",
        requirement: 1,
      },
    }),
    prisma.dailyMission.create({
      data: {
        title: "Học 30 phút",
        description: "Tích lũy 30 phút học tập",
        points: 40,
        type: "study",
        requirement: 30,
      },
    }),
  ]);
  console.log(`✅ Created ${dailyMissions.length} daily missions`);

  // ==================== COURSE REGISTRATIONS ====================
  await Promise.all([
    prisma.courseRegistration.create({
      data: {
        userId: users[0].id,
        courseId: courses[0].id,
        progress: 45,
        status: "active",
      },
    }),
    prisma.courseRegistration.create({
      data: {
        userId: users[0].id,
        courseId: courses[2].id,
        progress: 20,
        status: "active",
      },
    }),
    prisma.courseRegistration.create({
      data: {
        userId: users[1].id,
        courseId: courses[0].id,
        progress: 30,
        status: "active",
      },
    }),
    prisma.courseRegistration.create({
      data: {
        userId: users[2].id,
        courseId: courses[1].id,
        progress: 65,
        status: "active",
      },
    }),
    prisma.courseRegistration.create({
      data: {
        userId: users[4].id,
        courseId: courses[1].id,
        progress: 100,
        status: "completed",
        completedAt: new Date(),
      },
    }),
  ]);
  console.log(`✅ Created course registrations`);

  // ==================== FLASHCARDS ====================
  await Promise.all([
    prisma.flashcard.create({
      data: {
        userId: users[0].id,
        front: "delicious",
        back: "ngon, thơm ngon",
        interval: 3,
        easeFactor: 2.6,
        repetitions: 2,
      },
    }),
    prisma.flashcard.create({
      data: {
        userId: users[0].id,
        front: "deadline",
        back: "hạn chót",
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
      },
    }),
    prisma.flashcard.create({
      data: {
        userId: users[1].id,
        front: "reservation",
        back: "đặt chỗ trước",
        interval: 5,
        easeFactor: 2.7,
        repetitions: 3,
      },
    }),
    prisma.flashcard.create({
      data: {
        userId: users[2].id,
        front: "itinerary",
        back: "lịch trình",
        interval: 7,
        easeFactor: 2.8,
        repetitions: 5,
      },
    }),
  ]);
  console.log(`✅ Created flashcards`);

  // ==================== USER ACTIVITIES ====================
  const today = new Date();
  await Promise.all([
    prisma.userActivity.create({
      data: {
        userId: users[0].id,
        date: today,
        lessonsCount: 3,
        minutesSpent: 45,
        wordsLearned: 12,
        xpEarned: 150,
      },
    }),
    prisma.userActivity.create({
      data: {
        userId: users[1].id,
        date: today,
        lessonsCount: 2,
        minutesSpent: 25,
        wordsLearned: 8,
        xpEarned: 80,
      },
    }),
    prisma.userActivity.create({
      data: {
        userId: users[2].id,
        date: today,
        lessonsCount: 5,
        minutesSpent: 90,
        wordsLearned: 25,
        xpEarned: 300,
      },
    }),
  ]);
  console.log(`✅ Created user activities`);

  // ==================== LEADERBOARD ENTRIES ====================
  await Promise.all([
    prisma.leaderboardEntry.create({
      data: {
        userId: users[4].id,
        period: "2025-W49",
        type: "weekly",
        xp: 1200,
        rank: 1,
      },
    }),
    prisma.leaderboardEntry.create({
      data: {
        userId: users[2].id,
        period: "2025-W49",
        type: "weekly",
        xp: 950,
        rank: 2,
      },
    }),
    prisma.leaderboardEntry.create({
      data: {
        userId: users[0].id,
        period: "2025-W49",
        type: "weekly",
        xp: 720,
        rank: 3,
      },
    }),
    prisma.leaderboardEntry.create({
      data: {
        userId: users[1].id,
        period: "2025-W49",
        type: "weekly",
        xp: 380,
        rank: 4,
      },
    }),
    prisma.leaderboardEntry.create({
      data: {
        userId: users[3].id,
        period: "2025-W49",
        type: "weekly",
        xp: 120,
        rank: 5,
      },
    }),
  ]);
  console.log(`✅ Created leaderboard entries`);

  // ==================== USER TOPIC PROGRESS ====================
  await Promise.all([
    prisma.userTopicProgress.create({
      data: {
        userId: users[0].id,
        topicId: topics[0].id,
        progress: 80,
      },
    }),
    prisma.userTopicProgress.create({
      data: {
        userId: users[0].id,
        topicId: topics[1].id,
        progress: 45,
      },
    }),
    prisma.userTopicProgress.create({
      data: {
        userId: users[1].id,
        topicId: topics[0].id,
        progress: 30,
      },
    }),
    prisma.userTopicProgress.create({
      data: {
        userId: users[2].id,
        topicId: topics[2].id,
        progress: 100,
      },
    }),
    prisma.userTopicProgress.create({
      data: {
        userId: users[4].id,
        topicId: topics[3].id,
        progress: 90,
      },
    }),
  ]);
  console.log(`✅ Created user topic progress`);

  // ==================== NOTEBOOK ITEMS ====================
  await Promise.all([
    prisma.notebookItem.create({
      data: {
        userId: users[0].id,
        word: "serendipity",
        pronunciation: "/ˌserənˈdɪpɪti/",
        meaning: ["the occurrence of events by chance in a happy way"],
        vietnamese: ["sự tình cờ may mắn"],
        examples: [
          {
            en: "Finding this job was pure serendipity.",
            vi: "Tìm được công việc này hoàn toàn là tình cờ may mắn.",
          },
        ],
        partOfSpeech: "noun",
        level: "C1",
        note: "Từ hay dùng trong văn viết",
        tags: ["advanced", "literature"],
        collectionId: "vocabulary",
        masteryLevel: 3,
        isStarred: true,
      },
    }),
    prisma.notebookItem.create({
      data: {
        userId: users[0].id,
        word: "resilient",
        pronunciation: "/rɪˈzɪliənt/",
        meaning: ["able to recover quickly from difficulties"],
        vietnamese: ["kiên cường", "dẻo dai"],
        examples: [
          {
            en: "She is a resilient person.",
            vi: "Cô ấy là người kiên cường.",
          },
        ],
        partOfSpeech: "adjective",
        level: "B2",
        tags: ["personality", "positive"],
        collectionId: "vocabulary",
        masteryLevel: 2,
        isStarred: false,
      },
    }),
    prisma.notebookItem.create({
      data: {
        userId: users[1].id,
        word: "moreover",
        pronunciation: "/mɔːrˈoʊvər/",
        meaning: ["in addition", "furthermore"],
        vietnamese: ["hơn nữa", "ngoài ra"],
        examples: [
          {
            en: "Moreover, we need to consider the cost.",
            vi: "Hơn nữa, chúng ta cần xem xét chi phí.",
          },
        ],
        partOfSpeech: "adverb",
        level: "B1",
        tags: ["linking words", "writing"],
        collectionId: "grammar",
        masteryLevel: 4,
        isStarred: true,
      },
    }),
    prisma.notebookItem.create({
      data: {
        userId: users[2].id,
        word: "albeit",
        pronunciation: "/ɔːlˈbiːɪt/",
        meaning: ["although", "even though"],
        vietnamese: ["mặc dù"],
        examples: [
          {
            en: "He accepted the job, albeit reluctantly.",
            vi: "Anh ấy chấp nhận công việc, mặc dù miễn cưỡng.",
          },
        ],
        partOfSpeech: "conjunction",
        level: "C1",
        note: "Formal word, common in IELTS",
        tags: ["ielts", "formal"],
        collectionId: "grammar",
        masteryLevel: 5,
        isStarred: true,
      },
    }),
    prisma.notebookItem.create({
      data: {
        userId: users[3].id,
        word: "apple",
        pronunciation: "/ˈæpl/",
        meaning: ["a round fruit with red or green skin"],
        vietnamese: ["quả táo"],
        examples: [
          {
            en: "I eat an apple every day.",
            vi: "Tôi ăn một quả táo mỗi ngày.",
          },
        ],
        partOfSpeech: "noun",
        level: "A1",
        tags: ["food", "basic"],
        collectionId: "vocabulary",
        masteryLevel: 5,
        isStarred: false,
      },
    }),
  ]);
  console.log(`✅ Created notebook items`);

  // ==================== LISTENING TASKS ====================
  await Promise.all([
    prisma.listeningTask.create({
      data: {
        topicId: topics[0].id,
        type: "mcq",
        question: "What does the speaker do every morning?",
        audioUrl: "/audio/listening-1.mp3",
        transcript:
          "I wake up at 7 AM every day. Then I take a shower and have breakfast.",
        options: [
          "Sleeps late",
          "Takes a shower",
          "Goes to work",
          "Watches TV",
        ],
        correctAnswer: "Takes a shower",
      },
    }),
    prisma.listeningTask.create({
      data: {
        topicId: topics[0].id,
        type: "dictation",
        question: "Write what you hear",
        audioUrl: "/audio/listening-2.mp3",
        transcript: "She works at a hospital.",
        options: [],
        correctAnswer: "She works at a hospital.",
      },
    }),
    prisma.listeningTask.create({
      data: {
        topicId: topics[1].id,
        type: "mcq",
        question: "What is the main ingredient in this recipe?",
        audioUrl: "/audio/listening-3.mp3",
        transcript:
          "For this dish, you'll need chicken, onions, and garlic. The chicken is the main ingredient.",
        options: ["Onions", "Garlic", "Chicken", "Rice"],
        correctAnswer: "Chicken",
      },
    }),
    prisma.listeningTask.create({
      data: {
        topicId: topics[3].id,
        type: "mcq",
        question: "When is the meeting scheduled?",
        audioUrl: "/audio/listening-4.mp3",
        transcript: "The meeting has been rescheduled to 3 PM on Friday.",
        options: ["Monday 3 PM", "Friday 3 PM", "Friday 5 PM", "Thursday 3 PM"],
        correctAnswer: "Friday 3 PM",
      },
    }),
    prisma.listeningTask.create({
      data: {
        topicId: topics[4].id,
        type: "fill_blank",
        question: "Complete: I'd like to make a _____ for two people.",
        audioUrl: "/audio/listening-5.mp3",
        transcript:
          "Good evening! I'd like to make a reservation for two people, please.",
        options: ["reservation", "booking", "order", "request"],
        correctAnswer: "reservation",
      },
    }),
  ]);
  console.log(`✅ Created listening tasks`);

  // ==================== READING PASSAGES ====================
  await Promise.all([
    prisma.readingPassage.create({
      data: {
        topicId: topics[2].id,
        title: "The Rise of Remote Work",
        content:
          "Remote work has become increasingly popular in recent years. Many companies have adopted flexible working policies, allowing employees to work from home. This trend has been accelerated by technological advances and changing attitudes towards work-life balance. Studies show that remote workers often report higher job satisfaction and productivity. However, there are challenges such as maintaining team cohesion and separating work from personal life.",
        glossary: [
          { word: "accelerated", meaning: "made faster or quicker" },
          { word: "cohesion", meaning: "the action of forming a united whole" },
          { word: "flexible", meaning: "able to be easily modified" },
        ],
        questions: [
          {
            question: "What has accelerated the trend of remote work?",
            options: [
              "Lower salaries",
              "Technological advances",
              "Government policies",
              "Economic crisis",
            ],
            answer: "Technological advances",
          },
          {
            question: "What do remote workers often report?",
            options: [
              "Lower pay",
              "Higher job satisfaction",
              "More meetings",
              "Less flexibility",
            ],
            answer: "Higher job satisfaction",
          },
        ],
      },
    }),
    prisma.readingPassage.create({
      data: {
        topicId: topics[3].id,
        title: "Effective Business Communication",
        content:
          "Clear communication is essential in the workplace. Whether you're writing emails, leading meetings, or giving presentations, the ability to convey your ideas effectively can make or break your professional success. Key elements include being concise, using appropriate tone, and actively listening to others. In multinational companies, cultural awareness also plays a crucial role.",
        glossary: [
          { word: "convey", meaning: "to communicate or express" },
          { word: "concise", meaning: "brief and to the point" },
          { word: "crucial", meaning: "extremely important" },
        ],
        questions: [
          {
            question:
              "What is essential in the workplace according to the passage?",
            options: [
              "Long emails",
              "Clear communication",
              "Frequent meetings",
              "Working overtime",
            ],
            answer: "Clear communication",
          },
          {
            question: "What plays a crucial role in multinational companies?",
            options: [
              "Cultural awareness",
              "Long hours",
              "Technical skills",
              "Age",
            ],
            answer: "Cultural awareness",
          },
        ],
      },
    }),
    prisma.readingPassage.create({
      data: {
        topicId: topics[4].id,
        title: "Travel Tips for First-Time Visitors",
        content:
          "Traveling to a new country can be exciting but also challenging. Here are some tips for first-time travelers: First, research your destination thoroughly before departure. Learn about local customs, weather, and currency. Second, always have copies of important documents like your passport. Third, learn a few basic phrases in the local language - locals appreciate the effort. Finally, stay open-minded and embrace new experiences.",
        glossary: [
          { word: "departure", meaning: "the action of leaving" },
          { word: "thoroughly", meaning: "completely and carefully" },
          { word: "embrace", meaning: "to accept willingly" },
        ],
        questions: [
          {
            question: "What should you do before departure?",
            options: [
              "Sleep more",
              "Research your destination",
              "Buy expensive luggage",
              "Quit your job",
            ],
            answer: "Research your destination",
          },
          {
            question: "What do locals appreciate?",
            options: [
              "Expensive gifts",
              "Learning local phrases",
              "Speaking loudly",
              "Ignoring customs",
            ],
            answer: "Learning local phrases",
          },
        ],
      },
    }),
    prisma.readingPassage.create({
      data: {
        topicId: topics[1].id,
        title: "The Art of Cooking",
        content:
          "Cooking is both an art and a science. While following recipes is important for beginners, experienced cooks often experiment with ingredients and techniques. The key to good cooking lies in using fresh, quality ingredients and understanding how flavors work together. Seasoning is crucial - salt enhances flavors, while herbs and spices add complexity. Temperature control is equally important, as cooking times can dramatically affect the texture and taste of food.",
        glossary: [
          { word: "complexity", meaning: "the state of having many parts" },
          {
            word: "seasoning",
            meaning: "salt, herbs, or spices added to food",
          },
          { word: "dramatically", meaning: "to a great extent" },
        ],
        questions: [
          {
            question: "What enhances flavors in cooking?",
            options: ["Sugar", "Salt", "Water", "Oil"],
            answer: "Salt",
          },
          {
            question: "What is equally important as seasoning?",
            options: [
              "Presentation",
              "Temperature control",
              "Expensive ingredients",
              "Fast cooking",
            ],
            answer: "Temperature control",
          },
        ],
      },
    }),
  ]);
  console.log(`✅ Created reading passages`);

  // ==================== SPEAKING BOOKMARKS ====================
  await Promise.all([
    prisma.speakingBookmark.create({
      data: {
        userId: users[0].id,
        scenarioId: speakingScenarios[0].id,
      },
    }),
    prisma.speakingBookmark.create({
      data: {
        userId: users[0].id,
        scenarioId: speakingScenarios[2].id,
      },
    }),
    prisma.speakingBookmark.create({
      data: {
        userId: users[1].id,
        scenarioId: speakingScenarios[1].id,
      },
    }),
    prisma.speakingBookmark.create({
      data: {
        userId: users[2].id,
        scenarioId: speakingScenarios[2].id,
      },
    }),
    prisma.speakingBookmark.create({
      data: {
        userId: users[4].id,
        scenarioId: speakingScenarios[4].id,
      },
    }),
  ]);
  console.log(`✅ Created speaking bookmarks`);

  // ==================== STUDY TASKS ====================
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  await Promise.all([
    prisma.studyTask.create({
      data: {
        planId: studyPlans[0].id,
        date: today,
        type: TaskType.vocab,
        completed: true,
      },
    }),
    prisma.studyTask.create({
      data: {
        planId: studyPlans[0].id,
        date: today,
        type: TaskType.grammar,
        completed: false,
      },
    }),
    prisma.studyTask.create({
      data: {
        planId: studyPlans[0].id,
        date: tomorrow,
        type: TaskType.speaking,
        completed: false,
      },
    }),
    prisma.studyTask.create({
      data: {
        planId: studyPlans[1].id,
        date: today,
        type: TaskType.vocab,
        completed: true,
      },
    }),
    prisma.studyTask.create({
      data: {
        planId: studyPlans[2].id,
        date: today,
        type: TaskType.listening,
        completed: false,
      },
    }),
    prisma.studyTask.create({
      data: {
        planId: studyPlans[2].id,
        date: dayAfter,
        type: TaskType.grammar,
        completed: false,
      },
    }),
  ]);
  console.log(`✅ Created study tasks`);

  // ==================== PLACEMENT TEST RESULTS ====================
  await Promise.all([
    prisma.placementTestResult.create({
      data: {
        userId: users[0].id,
        score: 65,
        level: Level.B1,
        breakdown: {
          vocabulary: 70,
          grammar: 65,
          reading: 68,
          listening: 58,
        },
      },
    }),
    prisma.placementTestResult.create({
      data: {
        userId: users[1].id,
        score: 42,
        level: Level.A2,
        breakdown: {
          vocabulary: 45,
          grammar: 40,
          reading: 48,
          listening: 35,
        },
      },
    }),
    prisma.placementTestResult.create({
      data: {
        userId: users[2].id,
        score: 78,
        level: Level.B2,
        breakdown: {
          vocabulary: 82,
          grammar: 75,
          reading: 80,
          listening: 75,
        },
      },
    }),
    prisma.placementTestResult.create({
      data: {
        userId: users[3].id,
        score: 25,
        level: Level.A1,
        breakdown: {
          vocabulary: 28,
          grammar: 22,
          reading: 30,
          listening: 20,
        },
      },
    }),
    prisma.placementTestResult.create({
      data: {
        userId: users[4].id,
        score: 88,
        level: Level.C1,
        breakdown: {
          vocabulary: 92,
          grammar: 85,
          reading: 90,
          listening: 85,
        },
      },
    }),
  ]);
  console.log(`✅ Created placement test results`);

  // ==================== USER LESSON PROGRESS ====================
  await Promise.all([
    prisma.userLessonProgress.create({
      data: {
        userId: users[0].id,
        lessonId: lessons[0].id,
        status: "completed",
        progress: 100,
        score: 85,
        completedAt: new Date(),
      },
    }),
    prisma.userLessonProgress.create({
      data: {
        userId: users[0].id,
        lessonId: lessons[1].id,
        status: "in_progress",
        progress: 60,
      },
    }),
    prisma.userLessonProgress.create({
      data: {
        userId: users[1].id,
        lessonId: lessons[2].id,
        status: "in_progress",
        progress: 30,
      },
    }),
    prisma.userLessonProgress.create({
      data: {
        userId: users[2].id,
        lessonId: lessons[4].id,
        status: "completed",
        progress: 100,
        score: 92,
        completedAt: new Date(),
      },
    }),
    prisma.userLessonProgress.create({
      data: {
        userId: users[4].id,
        lessonId: lessons[5].id,
        status: "completed",
        progress: 100,
        score: 98,
        completedAt: new Date(),
      },
    }),
  ]);
  console.log(`✅ Created user lesson progress`);

  // ==================== USER INVENTORY ====================
  await Promise.all([
    prisma.userInventory.create({
      data: {
        userId: users[0].id,
        itemId: shopItems[0].id,
        status: "active",
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    }),
    prisma.userInventory.create({
      data: {
        userId: users[0].id,
        itemId: shopItems[1].id,
        status: "active",
      },
    }),
    prisma.userInventory.create({
      data: {
        userId: users[2].id,
        itemId: shopItems[2].id,
        status: "active",
      },
    }),
    prisma.userInventory.create({
      data: {
        userId: users[2].id,
        itemId: shopItems[4].id,
        status: "used",
      },
    }),
    prisma.userInventory.create({
      data: {
        userId: users[4].id,
        itemId: shopItems[3].id,
        status: "active",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
  ]);
  console.log(`✅ Created user inventory`);

  // ==================== USER COLLECTION ====================
  await Promise.all([
    prisma.userCollection.create({
      data: {
        userId: users[0].id,
        itemId: collectionItems[0].id,
      },
    }),
    prisma.userCollection.create({
      data: {
        userId: users[0].id,
        itemId: collectionItems[4].id,
      },
    }),
    prisma.userCollection.create({
      data: {
        userId: users[2].id,
        itemId: collectionItems[1].id,
      },
    }),
    prisma.userCollection.create({
      data: {
        userId: users[2].id,
        itemId: collectionItems[2].id,
      },
    }),
    prisma.userCollection.create({
      data: {
        userId: users[4].id,
        itemId: collectionItems[2].id,
      },
    }),
    prisma.userCollection.create({
      data: {
        userId: users[4].id,
        itemId: collectionItems[3].id,
      },
    }),
  ]);
  console.log(`✅ Created user collections`);

  // ==================== USER DAILY MISSIONS ====================
  await Promise.all([
    prisma.userDailyMission.create({
      data: {
        userId: users[0].id,
        missionId: dailyMissions[0].id,
        progress: 1,
        completed: true,
        completedAt: new Date(),
        date: today,
      },
    }),
    prisma.userDailyMission.create({
      data: {
        userId: users[0].id,
        missionId: dailyMissions[1].id,
        progress: 7,
        completed: false,
        date: today,
      },
    }),
    prisma.userDailyMission.create({
      data: {
        userId: users[1].id,
        missionId: dailyMissions[0].id,
        progress: 1,
        completed: true,
        completedAt: new Date(),
        date: today,
      },
    }),
    prisma.userDailyMission.create({
      data: {
        userId: users[2].id,
        missionId: dailyMissions[4].id,
        progress: 30,
        completed: true,
        completedAt: new Date(),
        date: today,
      },
    }),
    prisma.userDailyMission.create({
      data: {
        userId: users[4].id,
        missionId: dailyMissions[1].id,
        progress: 10,
        completed: true,
        completedAt: new Date(),
        date: today,
      },
    }),
    prisma.userDailyMission.create({
      data: {
        userId: users[4].id,
        missionId: dailyMissions[2].id,
        progress: 5,
        completed: true,
        completedAt: new Date(),
        date: today,
      },
    }),
  ]);
  console.log(`✅ Created user daily missions`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
