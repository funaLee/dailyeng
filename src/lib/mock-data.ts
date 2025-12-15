import type { Topic, VocabItem, GrammarNote, QuizItem } from "@/types";
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
      phon_br: "ˈpɑːspɔːt",
      phon_n_am: "ˈpæspɔːrt",
      meaning: "An official document for international travel",
      vietnameseMeaning: "Hộ chiếu",
      partOfSpeech: "noun",
      collocations: ["renew a passport", "valid passport", "passport control"],
      definitions: [
        {
          definition_en: "An official document issued by a government, certifying the holder's identity and citizenship and entitling them to travel under its protection to and from foreign countries.",
          definition_vi: "Tài liệu chính thức do chính phủ cấp, chứng nhận danh tính và quốc tịch của người giữ và cho phép họ đi du lịch dưới sự bảo vệ của chính phủ đến và đi từ các quốc gia nước ngoài.",
          examples: [
            { en: "I need to renew my passport before the trip.", vi: "Tôi cần gia hạn hộ chiếu trước chuyến đi." },
            { en: "Please show your passport at the border.", vi: "Vui lòng xuất trình hộ chiếu tại biên giới." }
          ]
        }
      ],
      synonyms: ["travel document", "identification"],
      exampleSentence: "I need to renew my passport before the trip.",
      exampleTranslation: "Tôi cần gia hạn hộ chiếu trước chuyến đi.",
    },
    {
      id: "v2",
      word: "itinerary",
      pronunciation: "/aɪˈtɪnəreri/",
      phon_br: "aɪˈtɪnərəri",
      phon_n_am: "aɪˈtɪnəreri",
      meaning: "A planned route or journey",
      vietnameseMeaning: "Lịch trình",
      partOfSpeech: "noun",
      collocations: ["detailed itinerary", "plan an itinerary", "travel itinerary"],
      definitions: [
        {
          definition_en: "A planned route or journey.",
          definition_vi: "Lộ trình hoặc hành trình đã lên kế hoạch.",
          examples: [
            { en: "We planned a detailed itinerary for our trip to Japan.", vi: "Chúng tôi đã lên một lịch trình chi tiết cho chuyến đi Nhật Bản." }
          ]
        },
        {
          definition_en: "A document recording a route or journey.",
          definition_vi: "Tài liệu ghi lại lộ trình hoặc hành trình.",
          examples: [
            { en: "Send me your itinerary so I know when to pick you up.", vi: "Gửi tôi lịch trình của bạn để tôi biết khi nào đón." }
          ]
        }
      ],
      synonyms: ["schedule", "program", "route", "plan"],
      exampleSentence: "Our itinerary includes visits to three countries.",
      exampleTranslation: "Lịch trình của chúng tôi bao gồm thăm ba quốc gia.",
    },
    {
      id: "v3",
      word: "accommodation",
      pronunciation: "/əˌkɒməˈdeɪʃən/",
      phon_br: "əˌkɒməˈdeɪʃn",
      phon_n_am: "əˌkɑːməˈdeɪʃn",
      meaning: "A place to stay during travel",
      vietnameseMeaning: "Chỗ ở",
      partOfSpeech: "noun",
      collocations: ["book accommodation", "luxury accommodation", "student accommodation"],
      definitions: [
        {
          definition_en: "A room, group of rooms, or building in which someone may live or stay.",
          definition_vi: "Phòng, nhóm phòng hoặc tòa nhà nơi ai đó có thể sống hoặc ở lại.",
          examples: [
            { en: "The price includes flights and accommodation.", vi: "Giá bao gồm vé máy bay và chỗ ở." }
          ]
        }
      ],
      synonyms: ["housing", "lodging", "quarters"],
      exampleSentence: "We booked accommodation near the beach.",
      exampleTranslation: "Chúng tôi đã đặt chỗ ở gần bãi biển.",
    },
    {
      id: "v4",
      word: "destination",
      pronunciation: "/ˌdestɪˈneɪʃn/",
      phon_br: "ˌdestɪˈneɪʃn",
      phon_n_am: "ˌdestɪˈneɪʃn",
      meaning: "The place to which someone or something is going or being sent.",
      vietnameseMeaning: "Điểm đến",
      partOfSpeech: "noun",
      collocations: ["final destination", "holiday destination", "tourist destination"],
      definitions: [
        {
          definition_en: "The place to which someone or something is going or being sent.",
          definition_vi: "Nơi ai đó hoặc cái gì đó đang đi tới.",
          examples: [
            { en: "Paris is a popular tourist destination.", vi: "Paris là một điểm đến du lịch phổ biến." }
          ]
        }
      ],
      synonyms: ["stop", "terminus", "goal"],
      exampleSentence: "We reached our destination after a long drive.",
      exampleTranslation: "Chúng tôi đã đến điểm đến sau một chặng đường dài.",
    },
    {
      id: "v5",
      word: "excursion",
      pronunciation: "/ɪkˈskɜːrʒn/",
      phon_br: "ɪkˈskɜːʃn",
      phon_n_am: "ɪkˈskɜːrʒn",
      meaning: "A short journey or trip, especially one engaged in as a leisure activity.",
      vietnameseMeaning: "Chuyến tham quan, dã ngoại",
      partOfSpeech: "noun",
      collocations: ["go on an excursion", "day excursion", "school excursion"],
      definitions: [
        {
          definition_en: "A short journey or trip, especially one engaged in as a leisure activity.",
          definition_vi: "Một chuyến đi ngắn, đặc biệt là để giải trí.",
          examples: [
            { en: "We went on a day excursion to the mountains.", vi: "Chúng tôi đã đi dã ngoại trong ngày đến vùng núi." }
          ]
        }
      ],
      synonyms: ["trip", "tour", "outing", "expedition"],
      antonyms: ["stay"],
      exampleSentence: "The cruise includes several shore excursions.",
      exampleTranslation: "Chuyến du thuyền bao gồm một vài chuyến tham quan trên bờ.",
    },
    {
      id: "v6",
      word: "sightseeing",
      pronunciation: "/ˈsaɪtsiːɪŋ/",
      phon_br: "ˈsaɪtsiːɪŋ",
      phon_n_am: "ˈsaɪtsiːɪŋ",
      meaning: "The activity of visiting places of interest in a particular location.",
      vietnameseMeaning: "Tham quan, ngắm cảnh",
      partOfSpeech: "noun",
      collocations: ["go sightseeing", "sightseeing tour", "sightseeing bus"],
      definitions: [
        {
          definition_en: "The activity of visiting places of interest in a particular location.",
          definition_vi: "Hoạt động thăm quan các địa điểm thú vị tại một địa điểm cụ thể.",
          examples: [
            { en: "We did a lot of sightseeing in Rome.", vi: "Chúng tôi đã đi tham quan rất nhiều ở Rome." }
          ]
        }
      ],
      synonyms: ["tourism", "viewing"],
      exampleSentence: "I love going sightseeing when I visit new cities.",
      exampleTranslation: "Tôi thích đi ngắm cảnh khi đến thăm các thành phố mới.",
    }
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

export const mockSpeakingScenarios = {
  daily: [
    {
      id: "cafe-order",
      title: "Ordering at a Café",
      description: "Practice ordering coffee and food at a local café",
      goal: "Learn to order confidently and handle common café interactions",
      difficulty: "A2",
      icon: Coffee,
      context: "You are at a café counter. The barista will take your order.",
    },
    {
      id: "shopping",
      title: "Shopping for Clothes",
      description: "Navigate a clothing store and ask for sizes and colors",
      goal: "Master retail vocabulary and polite requests",
      difficulty: "B1",
      icon: ShoppingBag,
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
      icon: Users,
      context: "You are in a team meeting discussing project updates.",
    },
    {
      id: "presentation",
      title: "Product Presentation",
      description: "Present a new product to potential clients",
      goal: "Develop presentation skills and persuasive language",
      difficulty: "C1",
      icon: TrendingUp,
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
      icon: Plane,
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
      icon: MessageCircle,
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
