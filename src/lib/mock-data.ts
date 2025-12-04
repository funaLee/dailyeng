import type {
  Topic,
  VocabItem,
  GrammarNote,
  QuizItem,
  SpeakingScenario,
} from "@/types";
import {
  Coffee,
  ShoppingBag,
  Users,
  TrendingUp,
  Plane,
  MessageCircle,
} from "lucide-react";

export const mockTopics: Topic[] = [
  {
    id: "1",
    title: "Travel",
    description: "Essential vocabulary for traveling abroad",
    level: "A2",
    progress: 12,
    wordCount: 25,
    estimatedTime: 45,
    thumbnail: "/diverse-travelers-world-map.png",
  },
  {
    id: "2",
    title: "Food & Dining",
    description: "Learn food names, cooking methods, and restaurant phrases",
    level: "A2",
    progress: 0,
    wordCount: 28,
    estimatedTime: 50,
    thumbnail: "/diverse-food-spread.png",
  },
  {
    id: "3",
    title: "Job Interview",
    description: "Professional vocabulary and interview techniques",
    level: "B1",
    progress: 55,
    wordCount: 30,
    estimatedTime: 60,
    thumbnail: "/abstract-job-concept.png",
  },
];

export const mockVocab: Record<string, VocabItem[]> = {
  "1": [
    {
      id: "v1",
      word: "passport",
      pronunciation: "/ˈpæspɔːrt/",
      meaning: "An official document for international travel",
      vietnameseMeaning: "Hộ chiếu",
      partOfSpeech: "noun",
      collocations: ["renew a passport", "check your passport"],
      exampleSentence: "I need to renew my passport before the trip.",
      exampleTranslation: "Tôi cần gia hạn hộ chiếu trước chuyến đi.",
    },
    {
      id: "v2",
      word: "luggage",
      pronunciation: "/ˈlʌɡɪdʒ/",
      meaning: "Bags and suitcases for carrying belongings",
      vietnameseMeaning: "Hành lý",
      partOfSpeech: "noun",
      collocations: ["pack luggage", "check luggage"],
      exampleSentence: "Please put your luggage on the conveyor belt.",
      exampleTranslation: "Vui lòng đặt hành lý của bạn lên băng chuyền.",
    },
    {
      id: "v3",
      word: "accommodation",
      pronunciation: "/əˌkɒməˈdeɪʃən/",
      meaning: "A place to stay during travel",
      vietnameseMeaning: "Chỗ ở",
      partOfSpeech: "noun",
      collocations: ["book accommodation", "find accommodation"],
      exampleSentence: "We booked accommodation near the beach.",
      exampleTranslation: "Chúng tôi đã đặt chỗ ở gần bãi biển.",
    },
    {
      id: "v4",
      word: "itinerary",
      pronunciation: "/aɪˈtɪnəreri/",
      meaning: "A planned route or journey",
      vietnameseMeaning: "Lịch trình",
      partOfSpeech: "noun",
      collocations: ["plan an itinerary", "follow an itinerary"],
      exampleSentence: "Our itinerary includes visits to three countries.",
      exampleTranslation: "Lịch trình của chúng tôi bao gồm thăm ba quốc gia.",
    },
    {
      id: "v5",
      word: "souvenir",
      pronunciation: "/ˌsuːvəˈnɪr/",
      meaning: "A memento or gift from a place visited",
      vietnameseMeaning: "Quà lưu niệm",
      partOfSpeech: "noun",
      collocations: ["buy souvenirs", "collect souvenirs"],
      exampleSentence: "I bought some souvenirs from the local market.",
      exampleTranslation: "Tôi đã mua một số quà lưu niệm từ chợ địa phương.",
    },
  ],
  "2": [
    {
      id: "v6",
      word: "appetizer",
      pronunciation: "/ˈæpɪtaɪzər/",
      meaning: "A small dish served before the main course",
      vietnameseMeaning: "Món khai vị",
      partOfSpeech: "noun",
      collocations: ["order appetizers", "serve appetizers"],
      exampleSentence: "We ordered shrimp appetizers to start.",
      exampleTranslation: "Chúng tôi đã gọi món khai vị tôm để bắt đầu.",
    },
    {
      id: "v7",
      word: "recipe",
      pronunciation: "/ˈresəpi/",
      meaning: "Instructions for preparing a dish",
      vietnameseMeaning: "Công thức nấu ăn",
      partOfSpeech: "noun",
      collocations: ["follow a recipe", "share a recipe"],
      exampleSentence: "This recipe is easy to follow.",
      exampleTranslation: "Công thức này dễ theo dõi.",
    },
    {
      id: "v8",
      word: "ingredient",
      pronunciation: "/ɪnˈɡriːdiənt/",
      meaning: "A component of a mixture or dish",
      vietnameseMeaning: "Nguyên liệu",
      partOfSpeech: "noun",
      collocations: ["mix ingredients", "list ingredients"],
      exampleSentence: "The main ingredient is fresh tomatoes.",
      exampleTranslation: "Nguyên liệu chính là cà chua tươi.",
    },
    {
      id: "v9",
      word: "cuisine",
      pronunciation: "/kwɪˈziːn/",
      meaning: "A style of cooking or food",
      vietnameseMeaning: "Ẩm thực",
      partOfSpeech: "noun",
      collocations: ["Italian cuisine", "local cuisine"],
      exampleSentence: "Vietnamese cuisine is known for its fresh flavors.",
      exampleTranslation: "Ẩm thực Việt Nam nổi tiếng với hương vị tươi mới.",
    },
    {
      id: "v10",
      word: "dessert",
      pronunciation: "/dɪˈzɜːrt/",
      meaning: "A sweet course at the end of a meal",
      vietnameseMeaning: "Tráng miệng",
      partOfSpeech: "noun",
      collocations: ["order dessert", "make dessert"],
      exampleSentence: "What dessert would you like?",
      exampleTranslation: "Bạn muốn tráng miệng gì?",
    },
  ],
  "3": [
    {
      id: "v11",
      word: "resume",
      pronunciation: "/ˈrezəmeɪ/",
      meaning: "A document listing qualifications and experience",
      vietnameseMeaning: "Sơ yếu lý lịch",
      partOfSpeech: "noun",
      collocations: ["submit a resume", "update your resume"],
      exampleSentence: "Please submit your resume before the deadline.",
      exampleTranslation: "Vui lòng gửi sơ yếu lý lịch của bạn trước hạn chót.",
    },
    {
      id: "v12",
      word: "interview",
      pronunciation: "/ˈɪntərvjuː/",
      meaning: "A formal meeting to assess suitability for a job",
      vietnameseMeaning: "Cuộc phỏng vấn",
      partOfSpeech: "noun",
      collocations: ["attend an interview", "conduct an interview"],
      exampleSentence: "I have an interview next Monday.",
      exampleTranslation: "Tôi có cuộc phỏng vấn vào thứ Hai tuần tới.",
    },
    {
      id: "v13",
      word: "qualification",
      pronunciation: "/ˌkwɒlɪfɪˈkeɪʃən/",
      meaning: "An achievement or skill that makes someone suitable",
      vietnameseMeaning: "Trình độ, chứng chỉ",
      partOfSpeech: "noun",
      collocations: ["meet qualifications", "list qualifications"],
      exampleSentence: "She has excellent qualifications for the position.",
      exampleTranslation: "Cô ấy có trình độ xuất sắc cho vị trí này.",
    },
    {
      id: "v14",
      word: "deadline",
      pronunciation: "/ˈdedlaɪn/",
      meaning: "The latest time for completing something",
      vietnameseMeaning: "Hạn chót",
      partOfSpeech: "noun",
      collocations: ["meet a deadline", "miss a deadline"],
      exampleSentence: "The deadline for applications is Friday.",
      exampleTranslation: "Hạn chót nộp đơn là thứ Sáu.",
    },
    {
      id: "v15",
      word: "professional",
      pronunciation: "/prəˈfeʃənəl/",
      meaning: "Relating to a job or career",
      vietnameseMeaning: "Chuyên nghiệp",
      partOfSpeech: "adjective",
      collocations: ["professional experience", "professional development"],
      exampleSentence: "She has 10 years of professional experience.",
      exampleTranslation: "Cô ấy có 10 năm kinh nghiệm chuyên nghiệp.",
    },
  ],
};

export const mockGrammar: Record<string, GrammarNote[]> = {
  "1": [
    {
      id: "g1",
      title: "Present Perfect for Recent Experiences",
      explanation:
        "Use present perfect to talk about experiences you have had. Form: have/has + past participle",
      examples: [
        {
          en: "I have traveled to five countries.",
          vi: "Tôi đã du lịch đến năm quốc gia.",
        },
        {
          en: "She has visited Paris twice.",
          vi: "Cô ấy đã thăm Paris hai lần.",
        },
      ],
    },
    {
      id: "g2",
      title: "Conditional Sentences (Type 1)",
      explanation:
        "Use for real or possible situations. Form: If + present simple, will + base verb",
      examples: [
        {
          en: "If you book early, you will get a discount.",
          vi: "Nếu bạn đặt sớm, bạn sẽ được giảm giá.",
        },
        {
          en: "If the weather is good, we will go hiking.",
          vi: "Nếu thời tiết tốt, chúng ta sẽ đi bộ đường dài.",
        },
      ],
    },
  ],
  "2": [
    {
      id: "g3",
      title: "Countable vs Uncountable Nouns",
      explanation:
        "Countable nouns can be counted (apple, plate). Uncountable nouns cannot (water, rice). Use 'some' or 'any' with both.",
      examples: [
        {
          en: "I need some apples and some water.",
          vi: "Tôi cần một số quả táo và một số nước.",
        },
        {
          en: "Do you have any rice?",
          vi: "Bạn có gạo không?",
        },
      ],
    },
  ],
  "3": [
    {
      id: "g4",
      title: "Reported Speech",
      explanation:
        "Change direct speech to reported speech. Shift tenses back one level and change pronouns.",
      examples: [
        {
          en: 'Direct: "I am interested in this position." Reported: He said he was interested in that position.',
          vi: 'Trực tiếp: "Tôi quan tâm đến vị trí này." Gián tiếp: Anh ấy nói rằng anh ấy quan tâm đến vị trí đó.',
        },
      ],
    },
  ],
};

export const mockQuizzes: Record<string, QuizItem[]> = {
  "1": [
    {
      id: "q1",
      question: "What is the correct pronunciation of 'passport'?",
      type: "multiple-choice",
      options: ["/pæsˈpɔːrt/", "/ˈpæspɔːrt/", "/pæsˈpɔrt/", "/ˈpæspɔrt/"],
      correctAnswer: "/ˈpæspɔːrt/",
      explanation: "The stress is on the first syllable: PASS-port",
    },
    {
      id: "q2",
      question: "Which word means 'a planned route or journey'?",
      type: "multiple-choice",
      options: ["luggage", "itinerary", "accommodation", "souvenir"],
      correctAnswer: "itinerary",
      explanation: "An itinerary is a detailed plan of a journey.",
    },
    {
      id: "q3",
      question: "Complete: 'I need to ___ my passport before the trip.'",
      type: "fill-blank",
      options: ["renew", "check", "book", "pack"],
      correctAnswer: "renew",
      explanation: "To renew means to extend the validity of a document.",
    },
    {
      id: "q4",
      question: "Match: accommodation",
      type: "matching",
      options: [
        "A place to stay",
        "Bags for travel",
        "A travel plan",
        "A souvenir",
      ],
      correctAnswer: "A place to stay",
      explanation: "Accommodation refers to lodging or a place to stay.",
    },
  ],
  "2": [
    {
      id: "q5",
      question: "What is an appetizer?",
      type: "multiple-choice",
      options: [
        "The main course",
        "A small dish served before the main course",
        "A sweet course at the end",
        "A type of restaurant",
      ],
      correctAnswer: "A small dish served before the main course",
      explanation: "Appetizers are served at the beginning of a meal.",
    },
    {
      id: "q6",
      question: "Complete: 'The main ___ is fresh tomatoes.'",
      type: "fill-blank",
      options: ["ingredient", "recipe", "cuisine", "dish"],
      correctAnswer: "ingredient",
      explanation: "An ingredient is a component of a mixture or dish.",
    },
  ],
  "3": [
    {
      id: "q7",
      question: "What should you include in a resume?",
      type: "multiple-choice",
      options: [
        "Only your name",
        "Your qualifications and experience",
        "Your personal opinions",
        "Your favorite hobbies",
      ],
      correctAnswer: "Your qualifications and experience",
      explanation:
        "A resume should highlight your skills and professional background.",
    },
    {
      id: "q8",
      question: "Match: professional",
      type: "matching",
      options: [
        "Relating to a job or career",
        "A type of food",
        "A travel destination",
        "A learning method",
      ],
      correctAnswer: "Relating to a job or career",
      explanation:
        "Professional refers to work-related or career-related matters.",
    },
  ],
};

export const mockListeningTasks: Record<string, any[]> = {
  "1": [
    {
      id: "l1",
      type: "dictation",
      question: "Listen to the sentence and type what you hear.",
      audio: "/audio/travel-1.mp3",
      transcript: "I need to renew my passport before the trip.",
      correctAnswer: "I need to renew my passport before the trip.",
    },
    {
      id: "l2",
      type: "mcq",
      question: "What is the main topic of the conversation?",
      audio: "/audio/travel-2.mp3",
      transcript:
        "A: Where are you going for vacation? B: I'm planning to visit Thailand next month.",
      options: [
        "Planning a vacation",
        "Discussing work",
        "Talking about weather",
        "Booking a hotel",
      ],
      correctAnswer: "Planning a vacation",
    },
    {
      id: "l3",
      type: "dictation",
      question: "Listen and complete the sentence.",
      audio: "/audio/travel-3.mp3",
      transcript: "Please put your luggage on the conveyor belt.",
      correctAnswer: "Please put your luggage on the conveyor belt.",
    },
  ],
  "2": [
    {
      id: "l4",
      type: "mcq",
      question: "What does the customer order?",
      audio: "/audio/food-1.mp3",
      transcript:
        "Waiter: What would you like? Customer: I'll have the pasta with garlic sauce.",
      options: ["Pizza", "Pasta with garlic sauce", "Salad", "Soup"],
      correctAnswer: "Pasta with garlic sauce",
    },
    {
      id: "l5",
      type: "dictation",
      question: "Listen and type the ingredient mentioned.",
      audio: "/audio/food-2.mp3",
      transcript: "The main ingredient is fresh tomatoes.",
      correctAnswer: "fresh tomatoes",
    },
  ],
  "3": [
    {
      id: "l6",
      type: "mcq",
      question: "What is the interviewer asking about?",
      audio: "/audio/interview-1.mp3",
      transcript:
        "Interviewer: Can you tell me about your professional experience?",
      options: [
        "Education",
        "Professional experience",
        "Hobbies",
        "Family background",
      ],
      correctAnswer: "Professional experience",
    },
  ],
};

export const mockReadingPassages: Record<string, any> = {
  "1": {
    id: "r1",
    title: "Travel Tips for First-Time Visitors",
    content: `Traveling to a new country can be an exciting and rewarding experience. However, it requires careful planning and preparation. First, make sure your passport is valid for at least six months beyond your travel dates. Second, research the visa requirements for your destination country. Third, book your accommodation well in advance to get better rates and ensure availability.

When packing, remember to bring essential documents like your passport, travel insurance, and booking confirmations. Pack light and bring only what you need. Consider the climate of your destination and pack appropriate clothing. Don't forget to bring a universal power adapter for your electronic devices.

During your trip, try to immerse yourself in the local culture. Eat local food, visit local markets, and interact with local people. Learn a few basic phrases in the local language. This will help you communicate better and show respect to the locals. Finally, always keep your valuables secure and be aware of your surroundings.`,
    glossary: [
      {
        word: "rewarding",
        definition: "giving satisfaction or benefit",
        vietnamese: "đáng giá, bổ ích",
      },
      {
        word: "accommodation",
        definition: "a place to stay",
        vietnamese: "chỗ ở",
      },
      {
        word: "immerse",
        definition: "to involve oneself deeply",
        vietnamese: "đắm chìm, hòa mình",
      },
      {
        word: "valuables",
        definition: "items of worth or importance",
        vietnamese: "đồ vật quý giá",
      },
    ],
    questions: [
      {
        id: "q1",
        question: "What is the main idea of the passage?",
        type: "multiple-choice",
        options: [
          "How to pack for a trip",
          "Tips for traveling to a new country",
          "How to book accommodation",
          "The importance of travel insurance",
        ],
        correctAnswer: "Tips for traveling to a new country",
        explanation:
          "The passage provides various tips for first-time travelers, including passport validity, visa requirements, accommodation booking, packing, and cultural immersion.",
      },
      {
        id: "q2",
        question: "How long should your passport be valid?",
        type: "multiple-choice",
        options: [
          "At least 3 months",
          "At least 6 months",
          "At least 1 year",
          "At least 2 years",
        ],
        correctAnswer: "At least 6 months",
        explanation:
          "According to the passage, your passport should be valid for at least six months beyond your travel dates.",
      },
      {
        id: "q3",
        question: "What does 'immerse' mean in the context of the passage?",
        type: "multiple-choice",
        options: [
          "To swim in water",
          "To involve oneself deeply",
          "To travel quickly",
          "To stay in a hotel",
        ],
        correctAnswer: "To involve oneself deeply",
        explanation:
          "'Immerse' means to involve oneself deeply in something, in this case, the local culture.",
      },
      {
        id: "q4",
        question: "Why should you learn basic phrases in the local language?",
        type: "multiple-choice",
        options: [
          "To impress other tourists",
          "To become fluent in the language",
          "To communicate better and show respect",
          "To get discounts at restaurants",
        ],
        correctAnswer: "To communicate better and show respect",
        explanation:
          "The passage states that learning basic phrases helps you communicate better and shows respect to the locals.",
      },
      {
        id: "q5",
        question:
          "What should you bring when traveling? (List at least 2 items)",
        type: "short-answer",
        correctAnswer: "passport, travel insurance, booking confirmations",
        explanation:
          "The passage mentions bringing essential documents like passport, travel insurance, and booking confirmations.",
      },
    ],
  },
  "2": {
    id: "r2",
    title: "The Art of Cooking",
    content: `Cooking is both an art and a science. It requires creativity, precision, and practice. Whether you're a beginner or an experienced chef, understanding the fundamentals of cooking is essential. The first step is to gather all your ingredients and prepare them properly. This process is called mise en place, a French term meaning "everything in its place."

Different cooking methods produce different results. Baking requires precise measurements and timing. Grilling adds a smoky flavor to food. Steaming preserves nutrients and keeps food healthy. Sautéing creates a golden crust on vegetables and meat. Each method has its own advantages and disadvantages.

Seasoning is crucial to making delicious food. Salt enhances flavors, while spices add complexity and depth. However, it's important not to over-season your dishes. Taste as you cook and adjust seasonings gradually. Fresh herbs like basil, cilantro, and parsley can elevate simple dishes to gourmet level.

Finally, presentation matters. A well-plated dish is more enjoyable to eat. Use contrasting colors, arrange food thoughtfully, and garnish with fresh herbs. Remember, we eat with our eyes first.`,
    glossary: [
      {
        word: "mise en place",
        definition: "preparation of ingredients before cooking",
        vietnamese: "chuẩn bị nguyên liệu",
      },
      {
        word: "sautéing",
        definition: "cooking quickly in a small amount of fat",
        vietnamese: "xào nhanh",
      },
      {
        word: "garnish",
        definition: "to decorate a dish with small items",
        vietnamese: "trang trí",
      },
      {
        word: "gourmet",
        definition: "of high quality and expensive",
        vietnamese: "cao cấp, tinh tế",
      },
    ],
    questions: [
      {
        id: "q6",
        question: "What does 'mise en place' mean?",
        type: "multiple-choice",
        options: [
          "A type of cooking method",
          "Preparation of ingredients before cooking",
          "A French restaurant",
          "A cooking utensil",
        ],
        correctAnswer: "Preparation of ingredients before cooking",
        explanation:
          "'Mise en place' is a French term meaning 'everything in its place,' referring to the preparation of ingredients before cooking.",
      },
      {
        id: "q7",
        question: "Which cooking method preserves nutrients?",
        type: "multiple-choice",
        options: ["Baking", "Grilling", "Steaming", "Sautéing"],
        correctAnswer: "Steaming",
        explanation:
          "According to the passage, steaming preserves nutrients and keeps food healthy.",
      },
      {
        id: "q8",
        question: "Why is presentation important in cooking?",
        type: "multiple-choice",
        options: [
          "It makes the kitchen look nice",
          "It saves time",
          "We eat with our eyes first",
          "It reduces cooking time",
        ],
        correctAnswer: "We eat with our eyes first",
        explanation:
          "The passage states that presentation matters because we eat with our eyes first.",
      },
    ],
  },
  "3": {
    id: "r3",
    title: "Professional Development in the Workplace",
    content: `Professional development is essential for career growth and success. It involves continuous learning and skill improvement. Many companies offer training programs, workshops, and mentorship opportunities to help employees develop their skills. Taking advantage of these opportunities can lead to promotions, salary increases, and greater job satisfaction.

One effective way to develop professionally is to seek feedback from colleagues and supervisors. Constructive criticism helps you identify areas for improvement and strengths to build upon. Another important aspect is networking. Building relationships with professionals in your field can open doors to new opportunities and provide valuable insights.

Reading industry publications, attending conferences, and taking online courses are excellent ways to stay updated with the latest trends and technologies. Setting clear career goals and creating an action plan to achieve them is also crucial. Review your progress regularly and adjust your goals as needed.

Finally, don't underestimate the value of soft skills such as communication, leadership, and teamwork. These skills are highly valued by employers and can significantly impact your career trajectory. Invest in your professional development today for a better tomorrow.`,
    glossary: [
      {
        word: "trajectory",
        definition: "the path or direction of development",
        vietnamese: "quỹ đạo, hướng phát triển",
      },
      {
        word: "constructive",
        definition: "serving a useful purpose",
        vietnamese: "xây dựng, có ích",
      },
      {
        word: "networking",
        definition: "building professional relationships",
        vietnamese: "xây dựng mạng lưới",
      },
      {
        word: "soft skills",
        definition: "personal attributes and interpersonal skills",
        vietnamese: "kỹ năng mềm",
      },
    ],
    questions: [
      {
        id: "q9",
        question: "What is the main topic of the passage?",
        type: "multiple-choice",
        options: [
          "How to get a promotion",
          "Professional development in the workplace",
          "How to start a business",
          "The importance of salary increases",
        ],
        correctAnswer: "Professional development in the workplace",
        explanation:
          "The passage focuses on the importance of professional development and various ways to achieve it.",
      },
      {
        id: "q10",
        question: "What are soft skills?",
        type: "multiple-choice",
        options: [
          "Technical skills like programming",
          "Personal attributes and interpersonal skills",
          "Skills learned in school",
          "Skills used in manufacturing",
        ],
        correctAnswer: "Personal attributes and interpersonal skills",
        explanation:
          "Soft skills include communication, leadership, and teamwork, which are personal attributes and interpersonal skills.",
      },
    ],
  },
};

export const mockSpeakingScenarios: Record<string, SpeakingScenario[]> = {
  daily: [
    {
      id: "cafe-order",
      title: "Ordering at a Café",
      description: "Practice ordering coffee and food at a local café",
      goal: "Learn to order confidently and handle common café interactions",
      difficulty: "A2",
      icon: "Coffee",
      context: "You are at a café counter. The barista will take your order.",
    },
    {
      id: "shopping",
      title: "Shopping for Clothes",
      description: "Navigate a clothing store and ask for sizes and colors",
      goal: "Master retail vocabulary and polite requests",
      difficulty: "B1",
      icon: "ShoppingBag",
      context: "You are in a clothing store looking for specific items.",
    },
  ],
  work: [
    {
      id: "meeting",
      title: "Team Meeting",
      description: "Participate in a professional team discussion",
      goal: "Practice business vocabulary and professional communication",
      difficulty: "B2",
      icon: "Users",
      context: "You are in a team meeting discussing project updates.",
    },
    {
      id: "presentation",
      title: "Product Presentation",
      description: "Present a new product to potential clients",
      goal: "Develop presentation skills and persuasive language",
      difficulty: "C1",
      icon: "TrendingUp",
      context: "You are presenting a new product to potential clients.",
    },
  ],
  travel: [
    {
      id: "hotel",
      title: "Hotel Check-in",
      description: "Check into a hotel and ask about amenities",
      goal: "Learn travel-related vocabulary and polite inquiries",
      difficulty: "A2",
      icon: "Plane",
      context: "You are checking in at a hotel reception.",
    },
  ],
  social: [
    {
      id: "small-talk",
      title: "Making Small Talk",
      description: "Have casual conversations with new acquaintances",
      goal: "Build confidence in informal social situations",
      difficulty: "B1",
      icon: "MessageCircle",
      context: "You are at a social event meeting new people.",
    },
  ],
};

export const mockCustomScenarios: any[] = [];

export const mockSpeakingTurns = {
  session1: [
    {
      id: "t1",
      sessionId: "session1",
      role: "tutor" as const,
      text: "Good morning! Welcome to the airport. I'm here to help you check in. May I have your passport and booking reference, please?",
      timestamp: new Date(Date.now() - 5000),
      scores: {
        pronunciation: 9,
        fluency: 9,
        grammar: 9,
        content: 9,
      },
    },
    {
      id: "t2",
      sessionId: "session1",
      role: "user" as const,
      text: "Good morning. Here is my passport and booking reference. I have two suitcases to check in.",
      timestamp: new Date(Date.now() - 3000),
      scores: {
        pronunciation: 8,
        fluency: 7.5,
        grammar: 8,
        content: 8,
      },
    },
    {
      id: "t3",
      sessionId: "session1",
      role: "tutor" as const,
      text: "Perfect! I see you're traveling to Bangkok. Do you have any special requests for your seats?",
      timestamp: new Date(Date.now() - 1000),
      scores: {
        pronunciation: 9,
        fluency: 9,
        grammar: 9,
        content: 9,
      },
    },
  ],
};

export const mockSpeakingTurnsExtended = {
  session1: [
    {
      id: "t1",
      sessionId: "session1",
      role: "tutor" as const,
      text: "Good morning! Welcome to the airport. I'm here to help you check in. May I have your passport and booking reference, please?",
      timestamp: new Date(Date.now() - 5000),
      scores: {
        pronunciation: 9,
        fluency: 9,
        grammar: 9,
        content: 9,
      },
    },
    {
      id: "t2",
      sessionId: "session1",
      role: "user" as const,
      text: "Good morning. Here is my passport and booking reference. I have two suitcases to check in.",
      timestamp: new Date(Date.now() - 3000),
      scores: {
        pronunciation: 8,
        fluency: 7.5,
        grammar: 8,
        content: 8,
      },
    },
    {
      id: "t3",
      sessionId: "session1",
      role: "tutor" as const,
      text: "Perfect! I see you're traveling to Bangkok. Do you have any special requests for your seats?",
      timestamp: new Date(Date.now() - 1000),
      scores: {
        pronunciation: 9,
        fluency: 9,
        grammar: 9,
        content: 9,
      },
    },
  ],
};

export const mockCourseData = {
  courseName: "IELTS 7.0 Academic",
  topics: [
    {
      id: "animal-behaviour",
      title: "Animal Behaviour",
      isExpanded: true,
      colorVariant: "pink" as const,
      subTopics: [
        { id: "dogs", title: "Dogs" },
        { id: "cats", title: "Cats" },
        { id: "birds", title: "Birds" },
        { id: "dogs2", title: "Dogs" },
        { id: "cats2", title: "Cats" },
        { id: "birds2", title: "Birds" },
        { id: "dogs3", title: "Dogs" },
        { id: "cats3", title: "Cats" },
        { id: "birds3", title: "Birds" },
      ],
    },
    {
      id: "humanity",
      title: "Humanity",
      isExpanded: false,
      colorVariant: "blue" as const,
      subTopics: [
        { id: "culture", title: "Culture" },
        { id: "history", title: "History" },
      ],
    },
    {
      id: "environment",
      title: "Environment",
      isExpanded: false,
      colorVariant: "teal" as const,
      subTopics: [{ id: "climate", title: "Climate Change" }],
    },
  ],
};

export const subTopicLessons: Record<
  string,
  Array<{
    id: string;
    title: string;
    type:
      | "vocabulary"
      | "translate"
      | "listening"
      | "reading"
      | "writing"
      | "quiz";
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      status: "not_started" | "in_progress" | "completed";
      progress?: number;
      score?: number;
    }>;
  }>
> = {
  dogs: [
    {
      id: "vocab-learning",
      title: "Vocabulary Learning",
      type: "vocabulary",
      lessons: [
        {
          id: "dogs-vocab-1",
          title: "Vocab Pack 1",
          duration: "30 min",
          status: "completed",
          score: 85,
        },
        {
          id: "dogs-vocab-2",
          title: "Vocab Pack 2",
          duration: "30 min",
          status: "in_progress",
          progress: 45,
        },
        {
          id: "dogs-vocab-3",
          title: "Flashcard Vocab",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "translate-practice",
      title: "Translate Practice",
      type: "translate",
      lessons: [
        {
          id: "dogs-translate-1",
          title: "Translate Practice 1",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "dogs-translate-2",
          title: "Translate Practice 2",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "dogs-translate-3",
          title: "Translate Practice 3",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "listening-practice",
      title: "Listening Practice",
      type: "listening",
      lessons: [
        {
          id: "dogs-listening-1",
          title: "Listening Practice 1",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "dogs-listening-2",
          title: "Listening Practice 2",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "reading-practice",
      title: "Reading Practice",
      type: "reading",
      lessons: [
        {
          id: "dogs-reading-1",
          title: "Reading Practice 1",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "dogs-reading-2",
          title: "Reading Practice 2",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "writing-practice",
      title: "Writing Practice",
      type: "writing",
      lessons: [
        {
          id: "dogs-writing-1",
          title: "Writing Practice 1",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "dogs-writing-2",
          title: "Writing Practice 2",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "quiz-practice",
      title: "Quiz Practice",
      type: "quiz",
      lessons: [
        {
          id: "dogs-quiz-1",
          title: "Quiz Practice 1",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "dogs-quiz-2",
          title: "Quiz Practice 2",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
  ],
  cats: [
    {
      id: "vocab-learning",
      title: "Vocabulary Learning",
      type: "vocabulary",
      lessons: [
        {
          id: "cats-vocab-1",
          title: "Vocab Pack 1",
          duration: "30 min",
          status: "not_started",
        },
        {
          id: "cats-vocab-2",
          title: "Vocab Pack 2",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "translate-practice",
      title: "Translate Practice",
      type: "translate",
      lessons: [
        {
          id: "cats-translate-1",
          title: "Translate Practice 1",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
  ],
  birds: [
    {
      id: "vocab-learning",
      title: "Vocabulary Learning",
      type: "vocabulary",
      lessons: [
        {
          id: "birds-vocab-1",
          title: "Vocab Pack 1",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
  ],
  culture: [
    {
      id: "vocab-learning",
      title: "Vocabulary Learning",
      type: "vocabulary",
      lessons: [
        {
          id: "culture-vocab-1",
          title: "Vocab Pack 1",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
    {
      id: "reading-practice",
      title: "Reading Practice",
      type: "reading",
      lessons: [
        {
          id: "culture-reading-1",
          title: "Cultural Essays",
          duration: "40 min",
          status: "not_started",
        },
      ],
    },
  ],
  history: [
    {
      id: "vocab-learning",
      title: "Vocabulary Learning",
      type: "vocabulary",
      lessons: [
        {
          id: "history-vocab-1",
          title: "Historical Terms",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
  ],
  climate: [
    {
      id: "vocab-learning",
      title: "Vocabulary Learning",
      type: "vocabulary",
      lessons: [
        {
          id: "climate-vocab-1",
          title: "Climate Vocabulary",
          duration: "30 min",
          status: "not_started",
        },
      ],
    },
  ],
};

export const mockLessonGrades = [
  {
    id: "vocab-1",
    title: "Vocab Pack 1",
    type: "vocabulary",
    score: 85,
    status: "completed" as const,
  },
  {
    id: "vocab-2",
    title: "Vocab Pack 2",
    type: "vocabulary",
    score: null,
    status: "in_progress" as const,
  },
  {
    id: "vocab-3",
    title: "Flashcard Vocab",
    type: "vocabulary",
    score: null,
    status: "not_started" as const,
  },
  {
    id: "translate-1",
    title: "Translate Practice 1",
    type: "translate",
    score: null,
    status: "not_started" as const,
  },
  {
    id: "translate-2",
    title: "Translate Practice 2",
    type: "translate",
    score: null,
    status: "not_started" as const,
  },
  {
    id: "listening-1",
    title: "Listening Practice 1",
    type: "listening",
    score: null,
    status: "not_started" as const,
  },
  {
    id: "reading-1",
    title: "Reading Practice 1",
    type: "reading",
    score: null,
    status: "not_started" as const,
  },
  {
    id: "writing-1",
    title: "Writing Practice 1",
    type: "writing",
    score: null,
    status: "not_started" as const,
  },
  {
    id: "quiz-1",
    title: "Quiz Practice 1",
    type: "quiz",
    score: null,
    status: "not_started" as const,
  },
];

export const mockSkillScores = [
  { skill: "Vocabulary", score: 85, fullMark: 100 },
  { skill: "Translate", score: 0, fullMark: 100 },
  { skill: "Listening", score: 0, fullMark: 100 },
  { skill: "Reading", score: 0, fullMark: 100 },
  { skill: "Writing", score: 0, fullMark: 100 },
  { skill: "Quiz", score: 0, fullMark: 100 },
];

export const mockCourseInfo = {
  courseName: "IELTS 7.0 Academic",
  courseDescription:
    "Comprehensive IELTS vocabulary preparation for band 7.0 and above. This course covers academic and general training modules with extensive vocabulary building exercises across multiple topics.",
  totalHours: "25 hours",
  totalLessons: 42,
  totalTopics: 3,
  totalSubTopics: 6,
  level: "B2-C1",
  targetAudience: "IELTS Candidates",
  objectives: [
    "Master 2000+ academic vocabulary words essential for IELTS",
    "Understand and use idiomatic expressions in academic contexts",
    "Improve listening comprehension through authentic IELTS audio",
    "Develop reading skills with academic passages and question types",
    "Practice writing Task 1 and Task 2 with vocabulary focus",
    "Build confidence for the speaking module with topic-specific vocabulary",
  ],
  topics: [
    {
      id: "animal-behaviour",
      title: "Animal Behaviour",
      description:
        "Explore vocabulary related to animal behaviours, habitats, and wildlife conservation.",
      subTopics: [
        {
          id: "dogs",
          title: "Dogs",
          description:
            "Learn vocabulary about domestic dogs, breeds, and canine behaviour.",
          lessons: [
            {
              id: "dogs-vocab-1",
              title: "Dog Breeds Vocabulary",
              description: "Common dog breeds and their characteristics",
              duration: "30 min",
              type: "vocabulary",
            },
            {
              id: "dogs-vocab-2",
              title: "Canine Behaviour Terms",
              description: "Terms describing dog behaviour and training",
              duration: "30 min",
              type: "vocabulary",
            },
            {
              id: "dogs-translate",
              title: "Translation Practice",
              description: "Translate sentences about dogs",
              duration: "25 min",
              type: "translate",
            },
            {
              id: "dogs-listening",
              title: "Listening: Dog Documentary",
              description: "Listen to a documentary about working dogs",
              duration: "35 min",
              type: "listening",
            },
          ],
        },
        {
          id: "cats",
          title: "Cats",
          description: "Vocabulary about felines, cat behaviour, and pet care.",
          lessons: [
            {
              id: "cats-vocab",
              title: "Cat Vocabulary",
              description: "Essential cat-related vocabulary",
              duration: "30 min",
              type: "vocabulary",
            },
            {
              id: "cats-translate",
              title: "Translation Practice",
              description: "Translate cat-related content",
              duration: "25 min",
              type: "translate",
            },
          ],
        },
        {
          id: "birds",
          title: "Birds",
          description:
            "Learn about bird species, migration, and ornithology vocabulary.",
          lessons: [
            {
              id: "birds-vocab",
              title: "Bird Species Vocabulary",
              description: "Common bird names and characteristics",
              duration: "30 min",
              type: "vocabulary",
            },
          ],
        },
      ],
    },
    {
      id: "humanity",
      title: "Humanity",
      description:
        "Vocabulary covering human culture, society, and historical developments.",
      subTopics: [
        {
          id: "culture",
          title: "Culture",
          description:
            "Cultural vocabulary including traditions, arts, and social customs.",
          lessons: [
            {
              id: "culture-vocab",
              title: "Cultural Terms",
              description: "Vocabulary for discussing culture",
              duration: "30 min",
              type: "vocabulary",
            },
            {
              id: "culture-reading",
              title: "Reading: Cultural Essays",
              description: "Read and analyze cultural essays",
              duration: "40 min",
              type: "reading",
            },
          ],
        },
        {
          id: "history",
          title: "History",
          description:
            "Historical vocabulary and terms for discussing past events.",
          lessons: [
            {
              id: "history-vocab",
              title: "Historical Vocabulary",
              description: "Terms for historical discussion",
              duration: "30 min",
              type: "vocabulary",
            },
          ],
        },
      ],
    },
    {
      id: "environment",
      title: "Environment",
      description:
        "Environmental vocabulary including climate change, ecology, and sustainability.",
      subTopics: [
        {
          id: "climate",
          title: "Climate Change",
          description:
            "Vocabulary for discussing climate change and environmental issues.",
          lessons: [
            {
              id: "climate-vocab",
              title: "Climate Vocabulary",
              description: "Essential climate change terminology",
              duration: "30 min",
              type: "vocabulary",
            },
          ],
        },
      ],
    },
  ],
};

export const DEMO_TOPICS = [
  { title: "Space", score: 95 },
  { title: "Magic", score: 92 },
  { title: "Future Tech", score: 93 },
  { title: "Shopping", score: 85 },
  { title: "Travel", score: 83 },
  { title: "Business", score: 88 },
  { title: "Healthcare", score: 72 },
  { title: "Education", score: 68 },
  { title: "Sports", score: 75 },
  { title: "Interviews", score: 52 },
  { title: "Presentations", score: 48 },
  { title: "Negotiations", score: 55 },
];

export const HISTORY_GRAPH_DATA = Array.from({ length: 50 }, (_, i) => ({
  session: i + 1,
  score: Math.floor(Math.random() * 40) + 60 + (i % 5) * 2,
}));

export const HISTORY_TOPICS_DATA = [
  {
    id: 1,
    title: "Space Exploration",
    description:
      "Learn vocabulary used in space travel, astronomy, and scientific discovery.",
    score: 95,
    date: "2024-03-10",
    tags: ["Science", "B2"],
    image: "/learning.png",
  },
  {
    id: 2,
    title: "Magic & Fantasy",
    description:
      "Discuss magical worlds, spells, and fantasy creatures in descriptive English.",
    score: 92,
    date: "2024-03-09",
    tags: ["Fiction", "C1"],
    image: "/learning.png",
  },
  {
    id: 3,
    title: "Future Technology",
    description:
      "Debate the implications of AI, robotics, and future tech trends.",
    score: 94,
    date: "2024-03-08",
    tags: ["Tech", "C1"],
    image: "/learning.png",
  },
  {
    id: 4,
    title: "Sustainable Living",
    description: "Talk about eco-friendly habits and saving the planet.",
    score: 91,
    date: "2024-03-05",
    tags: ["Environment", "B2"],
    image: "/learning.png",
  },
  {
    id: 5,
    title: "Job Interview",
    description:
      "Practice answering common interview questions professionally.",
    score: 85,
    date: "2024-03-04",
    tags: ["Business", "B2"],
    image: "/learning.png",
  },
  {
    id: 6,
    title: "Coffee Culture",
    description: "Describe different types of coffee and café experiences.",
    score: 88,
    date: "2024-03-03",
    tags: ["Daily Life", "A2"],
    image: "/learning.png",
  },
  {
    id: 7,
    title: "Travel Planning",
    description: "Plan a trip, book hotels, and discuss itineraries.",
    score: 82,
    date: "2024-03-01",
    tags: ["Travel", "B1"],
    image: "/learning.png",
  },
  {
    id: 8,
    title: "Movie Reviews",
    description: "Share your opinions on recent movies and actors.",
    score: 89,
    date: "2024-02-28",
    tags: ["Entertainment", "B1"],
    image: "/learning.png",
  },
];
