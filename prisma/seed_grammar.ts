/**
 * Seed Script: Populate Grammar Topics, GrammarNotes, and Lessons
 *
 * This script:
 * 1. Creates TopicGroup entries for Grammar hub (if not exist)
 * 2. Creates Topics for grammar lessons
 * 3. Creates GrammarNote entries for each topic
 * 4. Creates Lesson entries for each topic
 * 5. Uses Pexels API to fetch random images from UK cities for thumbnails
 *
 * Key Features:
 * - Only affects grammar-related data (hubType: 'grammar')
 * - Does NOT modify existing vocab, speaking, or user data
 * - Uses upsert to avoid duplicates
 * - Fetches images from UK cities via Pexels API
 *
 * Run with: npx tsx prisma/seed_grammar.ts
 *
 * Required env vars:
 * - PEXELS_API_KEY: Your Pexels API key
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient, Level, LessonType } from "@prisma/client";

const prisma = new PrismaClient();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("❌ Missing PEXELS_API_KEY in environment variables");
  process.exit(1);
}

// UK cities for random image search
const UK_CITIES = [
  "London",
  "Edinburgh",
  "Manchester",
  "Birmingham",
  "Liverpool",
  "Oxford",
  "Cambridge",
  "Bristol",
  "Glasgow",
  "York",
  "Bath",
  "Brighton",
  "Leeds",
  "Cardiff",
  "Belfast",
];

// Helper: Delay to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Pexels types
interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
  };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

/**
 * Search Pexels for images using UK city as keyword
 */
async function fetchRandomUKCityImage(): Promise<string | null> {
  const city = getRandomItem(UK_CITIES);
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(city)}&per_page=15&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      console.error(`   ❌ Pexels API error: ${response.status}`);
      return null;
    }

    const data: PexelsResponse = await response.json();
    if (data.photos.length === 0) {
      return null;
    }

    const randomPhoto = getRandomItem(data.photos);
    return randomPhoto.src.medium;
  } catch (error) {
    console.error(`   ❌ Pexels fetch error for "${city}":`, error);
    return null;
  }
}

// ============================================================
// Grammar Topic Groups Configuration
// ============================================================
const GRAMMAR_TOPIC_GROUPS = [
  {
    name: "Tenses",
    subcategories: ["Present Simple", "Past Simple", "Future Simple", "Present Perfect", "Past Perfect"],
  },
  {
    name: "Sentence Structure",
    subcategories: ["Basic Sentences", "Compound Sentences", "Complex Sentences", "Word Order"],
  },
  {
    name: "Modals",
    subcategories: ["Can/Could", "May/Might", "Must/Have to", "Should/Ought to", "Will/Would"],
  },
  {
    name: "Conditionals",
    subcategories: ["Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"],
  },
  {
    name: "Passive Voice",
    subcategories: ["Present Passive", "Past Passive", "Future Passive", "Modal Passive"],
  },
  {
    name: "Reported Speech",
    subcategories: ["Statements", "Questions", "Commands", "Time Changes"],
  },
  {
    name: "Articles",
    subcategories: ["A/An", "The", "Zero Article", "Article Rules"],
  },
  {
    name: "Prepositions",
    subcategories: ["Time Prepositions", "Place Prepositions", "Movement", "Common Phrases"],
  },
];

// ============================================================
// Grammar Topics Data (from mock + additional Passive Voice & Reported Speech)
// ============================================================
interface GrammarTopicData {
  title: string;
  description: string;
  level: Level;
  category: string;
  subcategory: string;
  wordCount: number;
  estimatedTime: number;
  grammarNotes: {
    title: string;
    explanation: string;
    examples: { en: string; vi: string }[];
  }[];
}

const GRAMMAR_TOPICS_DATA: GrammarTopicData[] = [
  // ========== Tenses > Present Simple ==========
  {
    title: "Present Simple Basics",
    description: "Learn how to use present simple tense for habits, facts, and routines",
    level: "A1",
    category: "Tenses",
    subcategory: "Present Simple",
    wordCount: 20,
    estimatedTime: 30,
    grammarNotes: [
      {
        title: "Form of Present Simple",
        explanation: "Use base form of verb (add -s/-es for he/she/it). Used for habits, facts, and routines.",
        examples: [
          { en: "I work every day.", vi: "Tôi làm việc mỗi ngày." },
          { en: "She works at a bank.", vi: "Cô ấy làm việc ở ngân hàng." },
          { en: "The sun rises in the east.", vi: "Mặt trời mọc ở phía đông." },
        ],
      },
      {
        title: "Time Expressions with Present Simple",
        explanation: "Common time expressions: always, usually, often, sometimes, rarely, never, every day/week/month",
        examples: [
          { en: "I always eat breakfast at 7 AM.", vi: "Tôi luôn ăn sáng lúc 7 giờ sáng." },
          { en: "They usually go to the gym on Mondays.", vi: "Họ thường đi tập gym vào thứ Hai." },
        ],
      },
    ],
  },
  {
    title: "Present Simple: Negative & Questions",
    description: "Master negative sentences and questions in present simple",
    level: "A1",
    category: "Tenses",
    subcategory: "Present Simple",
    wordCount: 18,
    estimatedTime: 25,
    grammarNotes: [
      {
        title: "Negative Form",
        explanation: "Use 'do not (don't)' or 'does not (doesn't)' + base verb",
        examples: [
          { en: "I don't like coffee.", vi: "Tôi không thích cà phê." },
          { en: "She doesn't work on weekends.", vi: "Cô ấy không làm việc vào cuối tuần." },
        ],
      },
      {
        title: "Question Form",
        explanation: "Use 'Do/Does' + subject + base verb?",
        examples: [
          { en: "Do you speak English?", vi: "Bạn có nói tiếng Anh không?" },
          { en: "Does he live in London?", vi: "Anh ấy có sống ở London không?" },
        ],
      },
    ],
  },

  // ========== Tenses > Past Simple ==========
  {
    title: "Past Simple Regular Verbs",
    description: "Learn past simple with regular verbs",
    level: "A2",
    category: "Tenses",
    subcategory: "Past Simple",
    wordCount: 25,
    estimatedTime: 40,
    grammarNotes: [
      {
        title: "Regular Verbs in Past Simple",
        explanation: "Add -ed to the base verb. Used for completed actions in the past.",
        examples: [
          { en: "I worked yesterday.", vi: "Tôi đã làm việc hôm qua." },
          { en: "They visited Paris last summer.", vi: "Họ đã thăm Paris mùa hè trước." },
        ],
      },
      {
        title: "Spelling Rules for -ed",
        explanation: "Verbs ending in -e: add -d. Consonant + y: change y to i + ed. Short vowel + consonant: double the consonant + ed.",
        examples: [
          { en: "live → lived", vi: "sống → đã sống" },
          { en: "study → studied", vi: "học → đã học" },
          { en: "stop → stopped", vi: "dừng → đã dừng" },
        ],
      },
    ],
  },
  {
    title: "Past Simple Irregular Verbs",
    description: "Master irregular verbs in past tense",
    level: "A2",
    category: "Tenses",
    subcategory: "Past Simple",
    wordCount: 30,
    estimatedTime: 50,
    grammarNotes: [
      {
        title: "Common Irregular Verbs",
        explanation: "Irregular verbs have unique past forms that must be memorized.",
        examples: [
          { en: "go → went: I went to school.", vi: "đi → đã đi: Tôi đã đi học." },
          { en: "eat → ate: She ate breakfast.", vi: "ăn → đã ăn: Cô ấy đã ăn sáng." },
          { en: "see → saw: We saw a movie.", vi: "xem → đã xem: Chúng tôi đã xem phim." },
        ],
      },
    ],
  },

  // ========== Tenses > Future Simple ==========
  {
    title: "Future with Will",
    description: "Learn future tense using will",
    level: "A2",
    category: "Tenses",
    subcategory: "Future Simple",
    wordCount: 20,
    estimatedTime: 35,
    grammarNotes: [
      {
        title: "Will for Future",
        explanation: "Use 'will' + base verb for predictions, spontaneous decisions, and promises.",
        examples: [
          { en: "I will call you tomorrow.", vi: "Tôi sẽ gọi bạn ngày mai." },
          { en: "It will rain later.", vi: "Trời sẽ mưa sau." },
        ],
      },
    ],
  },
  {
    title: "Future with Going To",
    description: "Express plans and intentions with going to",
    level: "A2",
    category: "Tenses",
    subcategory: "Future Simple",
    wordCount: 18,
    estimatedTime: 30,
    grammarNotes: [
      {
        title: "Going To for Plans",
        explanation: "Use 'be going to' + base verb for plans and intentions.",
        examples: [
          { en: "I am going to study tonight.", vi: "Tôi sẽ học tối nay." },
          { en: "They are going to buy a new car.", vi: "Họ sẽ mua xe mới." },
        ],
      },
    ],
  },

  // ========== Tenses > Present Perfect ==========
  {
    title: "Present Perfect Introduction",
    description: "Connect past events to the present using present perfect",
    level: "B1",
    category: "Tenses",
    subcategory: "Present Perfect",
    wordCount: 25,
    estimatedTime: 45,
    grammarNotes: [
      {
        title: "Present Perfect for Experiences",
        explanation: "Use have/has + past participle to talk about experiences.",
        examples: [
          { en: "I have traveled to five countries.", vi: "Tôi đã du lịch đến năm quốc gia." },
          { en: "She has visited Paris twice.", vi: "Cô ấy đã thăm Paris hai lần." },
        ],
      },
    ],
  },
  {
    title: "Present Perfect vs Past Simple",
    description: "Understand the difference between these two tenses",
    level: "B1",
    category: "Tenses",
    subcategory: "Present Perfect",
    wordCount: 22,
    estimatedTime: 40,
    grammarNotes: [
      {
        title: "Key Differences",
        explanation: "Present Perfect: unspecified time, still relevant. Past Simple: specific time, completed.",
        examples: [
          { en: "I have been to Japan. (experience, unspecified)", vi: "Tôi đã đến Nhật. (trải nghiệm, không xác định thời gian)" },
          { en: "I went to Japan last year. (specific time)", vi: "Tôi đã đến Nhật năm ngoái. (thời gian cụ thể)" },
        ],
      },
    ],
  },

  // ========== Modals > Can/Could ==========
  {
    title: "Can for Ability",
    description: "Use can to express ability and possibility",
    level: "A1",
    category: "Modals",
    subcategory: "Can/Could",
    wordCount: 15,
    estimatedTime: 25,
    grammarNotes: [
      {
        title: "Can for Ability",
        explanation: "Use 'can' + base verb to express ability.",
        examples: [
          { en: "I can swim.", vi: "Tôi có thể bơi." },
          { en: "She can speak three languages.", vi: "Cô ấy có thể nói ba ngôn ngữ." },
        ],
      },
    ],
  },
  {
    title: "Could for Past & Polite Requests",
    description: "Master could in different contexts",
    level: "A2",
    category: "Modals",
    subcategory: "Can/Could",
    wordCount: 18,
    estimatedTime: 30,
    grammarNotes: [
      {
        title: "Could for Past Ability",
        explanation: "Use 'could' for past ability or polite requests.",
        examples: [
          { en: "I could run fast when I was young.", vi: "Tôi có thể chạy nhanh khi còn trẻ." },
          { en: "Could you help me, please?", vi: "Bạn có thể giúp tôi được không?" },
        ],
      },
    ],
  },

  // ========== Modals > Must/Have to ==========
  {
    title: "Must for Obligation",
    description: "Express strong obligation with must",
    level: "B1",
    category: "Modals",
    subcategory: "Must/Have to",
    wordCount: 20,
    estimatedTime: 35,
    grammarNotes: [
      {
        title: "Must vs Have to",
        explanation: "Must: personal/internal obligation. Have to: external rules/requirements.",
        examples: [
          { en: "I must finish this project. (personal)", vi: "Tôi phải hoàn thành dự án này. (cá nhân)" },
          { en: "You have to wear a uniform. (rule)", vi: "Bạn phải mặc đồng phục. (quy định)" },
        ],
      },
    ],
  },

  // ========== Conditionals ==========
  {
    title: "First Conditional",
    description: "Real possibilities with if-clauses",
    level: "B1",
    category: "Conditionals",
    subcategory: "First Conditional",
    wordCount: 22,
    estimatedTime: 45,
    grammarNotes: [
      {
        title: "First Conditional Structure",
        explanation: "If + present simple, will + base verb. For real possibilities.",
        examples: [
          { en: "If you book early, you will get a discount.", vi: "Nếu bạn đặt sớm, bạn sẽ được giảm giá." },
          { en: "If the weather is good, we will go hiking.", vi: "Nếu thời tiết tốt, chúng ta sẽ đi bộ đường dài." },
        ],
      },
    ],
  },
  {
    title: "Second Conditional",
    description: "Hypothetical situations and imaginary conditions",
    level: "B2",
    category: "Conditionals",
    subcategory: "Second Conditional",
    wordCount: 25,
    estimatedTime: 55,
    grammarNotes: [
      {
        title: "Second Conditional Structure",
        explanation: "If + past simple, would + base verb. For unreal/hypothetical situations.",
        examples: [
          { en: "If I won the lottery, I would travel the world.", vi: "Nếu tôi trúng số, tôi sẽ đi du lịch vòng quanh thế giới." },
          { en: "If I were you, I would accept the offer.", vi: "Nếu tôi là bạn, tôi sẽ chấp nhận đề nghị." },
        ],
      },
    ],
  },

  // ========== Sentence Structure ==========
  {
    title: "Subject-Verb-Object",
    description: "Learn the basic sentence structure in English",
    level: "A1",
    category: "Sentence Structure",
    subcategory: "Basic Sentences",
    wordCount: 12,
    estimatedTime: 20,
    grammarNotes: [
      {
        title: "Basic SVO Structure",
        explanation: "English follows Subject + Verb + Object order.",
        examples: [
          { en: "I (S) eat (V) breakfast (O).", vi: "Tôi (S) ăn (V) bữa sáng (O)." },
          { en: "She (S) plays (V) piano (O).", vi: "Cô ấy (S) chơi (V) piano (O)." },
        ],
      },
    ],
  },

  // ========== Articles ==========
  {
    title: "A vs An",
    description: "Master when to use a and an",
    level: "A1",
    category: "Articles",
    subcategory: "A/An",
    wordCount: 10,
    estimatedTime: 15,
    grammarNotes: [
      {
        title: "A vs An Usage",
        explanation: "Use 'a' before consonant sounds, 'an' before vowel sounds.",
        examples: [
          { en: "a book, a university (starts with 'yu' sound)", vi: "một cuốn sách, một trường đại học" },
          { en: "an apple, an hour (h is silent)", vi: "một quả táo, một giờ" },
        ],
      },
    ],
  },
  {
    title: "The Definite Article",
    description: "Learn when to use 'the'",
    level: "A2",
    category: "Articles",
    subcategory: "The",
    wordCount: 15,
    estimatedTime: 25,
    grammarNotes: [
      {
        title: "When to Use 'The'",
        explanation: "Use 'the' for specific/known things, unique items, superlatives.",
        examples: [
          { en: "The book on the table is mine.", vi: "Cuốn sách trên bàn là của tôi." },
          { en: "The sun is bright today.", vi: "Mặt trời hôm nay sáng." },
        ],
      },
    ],
  },

  // ========== Prepositions ==========
  {
    title: "Prepositions of Time",
    description: "In, on, at for time expressions",
    level: "A1",
    category: "Prepositions",
    subcategory: "Time Prepositions",
    wordCount: 15,
    estimatedTime: 25,
    grammarNotes: [
      {
        title: "In, On, At for Time",
        explanation: "In: months, years, seasons. On: days, dates. At: specific times.",
        examples: [
          { en: "in January, in 2024, in summer", vi: "vào tháng 1, năm 2024, mùa hè" },
          { en: "on Monday, on December 25th", vi: "vào thứ Hai, ngày 25 tháng 12" },
          { en: "at 3 PM, at noon, at midnight", vi: "lúc 3 giờ chiều, buổi trưa, nửa đêm" },
        ],
      },
    ],
  },
  {
    title: "Prepositions of Place",
    description: "In, on, at for locations",
    level: "A2",
    category: "Prepositions",
    subcategory: "Place Prepositions",
    wordCount: 18,
    estimatedTime: 30,
    grammarNotes: [
      {
        title: "In, On, At for Place",
        explanation: "In: enclosed spaces, cities, countries. On: surfaces. At: specific points.",
        examples: [
          { en: "in the room, in London, in Vietnam", vi: "trong phòng, ở London, ở Việt Nam" },
          { en: "on the table, on the wall", vi: "trên bàn, trên tường" },
          { en: "at the bus stop, at home", vi: "ở trạm xe buýt, ở nhà" },
        ],
      },
    ],
  },

  // ========== PASSIVE VOICE (NEW) ==========
  {
    title: "Present Passive Voice",
    description: "Learn how to form passive sentences in present tense",
    level: "B1",
    category: "Passive Voice",
    subcategory: "Present Passive",
    wordCount: 22,
    estimatedTime: 40,
    grammarNotes: [
      {
        title: "Present Passive Structure",
        explanation: "Form: am/is/are + past participle. Focus on the action, not the doer.",
        examples: [
          { en: "English is spoken worldwide.", vi: "Tiếng Anh được nói trên toàn thế giới." },
          { en: "The letters are delivered every morning.", vi: "Thư được giao mỗi sáng." },
          { en: "This car is made in Germany.", vi: "Chiếc xe này được sản xuất tại Đức." },
        ],
      },
      {
        title: "When to Use Present Passive",
        explanation: "Use when: the doer is unknown, unimportant, or obvious from context.",
        examples: [
          { en: "Rice is grown in Vietnam. (focus on rice)", vi: "Lúa được trồng ở Việt Nam. (tập trung vào lúa)" },
          { en: "The museum is visited by thousands daily.", vi: "Bảo tàng được hàng nghìn người thăm mỗi ngày." },
        ],
      },
    ],
  },
  {
    title: "Past Passive Voice",
    description: "Master passive sentences in past tense",
    level: "B1",
    category: "Passive Voice",
    subcategory: "Past Passive",
    wordCount: 24,
    estimatedTime: 45,
    grammarNotes: [
      {
        title: "Past Passive Structure",
        explanation: "Form: was/were + past participle. Describes completed actions.",
        examples: [
          { en: "The Eiffel Tower was built in 1889.", vi: "Tháp Eiffel được xây dựng vào năm 1889." },
          { en: "The letters were sent yesterday.", vi: "Những lá thư đã được gửi hôm qua." },
          { en: "The window was broken by the storm.", vi: "Cửa sổ đã bị vỡ do bão." },
        ],
      },
      {
        title: "Active to Passive Conversion",
        explanation: "Move the object to subject position. Change verb to was/were + past participle.",
        examples: [
          { en: "Active: Shakespeare wrote Hamlet. → Passive: Hamlet was written by Shakespeare.", vi: "Chủ động: Shakespeare viết Hamlet. → Bị động: Hamlet được viết bởi Shakespeare." },
        ],
      },
    ],
  },
  {
    title: "Future Passive Voice",
    description: "Express future events in passive form",
    level: "B2",
    category: "Passive Voice",
    subcategory: "Future Passive",
    wordCount: 20,
    estimatedTime: 40,
    grammarNotes: [
      {
        title: "Future Passive Structure",
        explanation: "Form: will be + past participle. For future events focusing on the action.",
        examples: [
          { en: "The project will be completed next month.", vi: "Dự án sẽ được hoàn thành vào tháng tới." },
          { en: "The results will be announced tomorrow.", vi: "Kết quả sẽ được công bố ngày mai." },
          { en: "A new bridge will be built here.", vi: "Một cây cầu mới sẽ được xây ở đây." },
        ],
      },
    ],
  },
  {
    title: "Modal Passive Voice",
    description: "Combine modal verbs with passive voice",
    level: "B2",
    category: "Passive Voice",
    subcategory: "Modal Passive",
    wordCount: 25,
    estimatedTime: 50,
    grammarNotes: [
      {
        title: "Modal Passive Structure",
        explanation: "Form: modal (can/must/should/may) + be + past participle.",
        examples: [
          { en: "This task can be done easily.", vi: "Nhiệm vụ này có thể được thực hiện dễ dàng." },
          { en: "The report must be submitted by Friday.", vi: "Báo cáo phải được nộp trước thứ Sáu." },
          { en: "Mistakes should be corrected immediately.", vi: "Lỗi nên được sửa ngay lập tức." },
        ],
      },
      {
        title: "Common Modal Passives",
        explanation: "Can be done, must be finished, should be checked, might be delayed, has to be approved.",
        examples: [
          { en: "The order may be delayed due to weather.", vi: "Đơn hàng có thể bị trì hoãn do thời tiết." },
          { en: "This form has to be signed by a manager.", vi: "Mẫu này phải được ký bởi quản lý." },
        ],
      },
    ],
  },

  // ========== REPORTED SPEECH (NEW) ==========
  {
    title: "Reported Speech: Statements",
    description: "Learn how to report what someone said",
    level: "B1",
    category: "Reported Speech",
    subcategory: "Statements",
    wordCount: 25,
    estimatedTime: 45,
    grammarNotes: [
      {
        title: "Basic Reported Statements",
        explanation: "Change pronouns and shift tense back. Use 'said (that)' or 'told'.",
        examples: [
          { en: "Direct: \"I am tired.\" → Reported: She said (that) she was tired.", vi: "Trực tiếp: \"Tôi mệt.\" → Gián tiếp: Cô ấy nói rằng cô ấy mệt." },
          { en: "Direct: \"I will help you.\" → Reported: He said he would help me.", vi: "Trực tiếp: \"Tôi sẽ giúp bạn.\" → Gián tiếp: Anh ấy nói anh ấy sẽ giúp tôi." },
        ],
      },
      {
        title: "Tense Shifts in Reported Speech",
        explanation: "Present → Past, Will → Would, Can → Could, Present Perfect → Past Perfect",
        examples: [
          { en: "\"I work here\" → He said he worked there.", vi: "\"Tôi làm việc ở đây\" → Anh ấy nói anh ấy làm việc ở đó." },
          { en: "\"I have finished\" → She said she had finished.", vi: "\"Tôi đã hoàn thành\" → Cô ấy nói cô ấy đã hoàn thành." },
        ],
      },
    ],
  },
  {
    title: "Reported Speech: Questions",
    description: "Report questions using reported speech",
    level: "B1",
    category: "Reported Speech",
    subcategory: "Questions",
    wordCount: 22,
    estimatedTime: 40,
    grammarNotes: [
      {
        title: "Reporting Yes/No Questions",
        explanation: "Use 'asked if/whether' + statement word order (no question mark).",
        examples: [
          { en: "Direct: \"Are you coming?\" → Reported: She asked if I was coming.", vi: "Trực tiếp: \"Bạn có đến không?\" → Gián tiếp: Cô ấy hỏi liệu tôi có đến không." },
          { en: "Direct: \"Do you like coffee?\" → Reported: He asked whether I liked coffee.", vi: "Trực tiếp: \"Bạn có thích cà phê không?\" → Gián tiếp: Anh ấy hỏi liệu tôi có thích cà phê không." },
        ],
      },
      {
        title: "Reporting Wh-Questions",
        explanation: "Use 'asked' + question word + statement word order.",
        examples: [
          { en: "Direct: \"Where do you live?\" → Reported: She asked where I lived.", vi: "Trực tiếp: \"Bạn sống ở đâu?\" → Gián tiếp: Cô ấy hỏi tôi sống ở đâu." },
          { en: "Direct: \"What time is it?\" → Reported: He asked what time it was.", vi: "Trực tiếp: \"Mấy giờ rồi?\" → Gián tiếp: Anh ấy hỏi mấy giờ rồi." },
        ],
      },
    ],
  },
  {
    title: "Reported Speech: Commands",
    description: "Report commands and requests",
    level: "B2",
    category: "Reported Speech",
    subcategory: "Commands",
    wordCount: 20,
    estimatedTime: 35,
    grammarNotes: [
      {
        title: "Reporting Commands",
        explanation: "Use 'told/ordered/asked + object + (not) to + infinitive'.",
        examples: [
          { en: "Direct: \"Close the door.\" → Reported: She told me to close the door.", vi: "Trực tiếp: \"Đóng cửa lại.\" → Gián tiếp: Cô ấy bảo tôi đóng cửa lại." },
          { en: "Direct: \"Don't be late.\" → Reported: He told us not to be late.", vi: "Trực tiếp: \"Đừng trễ.\" → Gián tiếp: Anh ấy bảo chúng tôi đừng trễ." },
        ],
      },
      {
        title: "Reporting Requests",
        explanation: "Use 'asked + object + to + infinitive' for polite requests.",
        examples: [
          { en: "Direct: \"Please help me.\" → Reported: She asked me to help her.", vi: "Trực tiếp: \"Làm ơn giúp tôi.\" → Gián tiếp: Cô ấy nhờ tôi giúp cô ấy." },
          { en: "Direct: \"Could you wait?\" → Reported: He asked me to wait.", vi: "Trực tiếp: \"Bạn có thể đợi không?\" → Gián tiếp: Anh ấy nhờ tôi đợi." },
        ],
      },
    ],
  },
  {
    title: "Reported Speech: Time Changes",
    description: "Master time and place changes in reported speech",
    level: "B2",
    category: "Reported Speech",
    subcategory: "Time Changes",
    wordCount: 18,
    estimatedTime: 35,
    grammarNotes: [
      {
        title: "Time Expression Changes",
        explanation: "now → then, today → that day, tomorrow → the next day, yesterday → the day before, this → that",
        examples: [
          { en: "\"I'll do it now\" → He said he would do it then.", vi: "\"Tôi sẽ làm ngay\" → Anh ấy nói anh ấy sẽ làm lúc đó." },
          { en: "\"I saw her yesterday\" → She said she had seen her the day before.", vi: "\"Tôi gặp cô ấy hôm qua\" → Cô ấy nói cô ấy đã gặp cô ấy hôm trước." },
        ],
      },
      {
        title: "Place Changes",
        explanation: "here → there, this place → that place",
        examples: [
          { en: "\"I live here\" → He said he lived there.", vi: "\"Tôi sống ở đây\" → Anh ấy nói anh ấy sống ở đó." },
          { en: "\"Come to this office\" → She told me to go to that office.", vi: "\"Đến văn phòng này\" → Cô ấy bảo tôi đến văn phòng đó." },
        ],
      },
    ],
  },
];

// ============================================================
// Main Seed Function
// ============================================================
async function main() {
  console.log("🚀 Starting Grammar Seed Process...\n");
  console.log("=".repeat(60));
  console.log("📌 This script ONLY creates/updates grammar-related data");
  console.log("📌 Existing vocabulary, speaking, and user data will NOT be affected");
  console.log("=".repeat(60) + "\n");

  try {
    // Step 1: Upsert TopicGroups for Grammar
    console.log("📦 Step 1: Creating Grammar TopicGroups...");
    const topicGroupMap = new Map<string, string>();

    for (const group of GRAMMAR_TOPIC_GROUPS) {
      const created = await prisma.topicGroup.upsert({
        where: {
          name_hubType: {
            name: group.name,
            hubType: "grammar",
          },
        },
        update: {
          subcategories: group.subcategories,
        },
        create: {
          name: group.name,
          hubType: "grammar",
          subcategories: group.subcategories,
          order: GRAMMAR_TOPIC_GROUPS.indexOf(group),
        },
      });
      topicGroupMap.set(group.name, created.id);
      console.log(`   ✅ TopicGroup: "${group.name}"`);
    }

    // Step 2: Create Topics with GrammarNotes
    console.log("\n📚 Step 2: Creating Grammar Topics and Notes...");
    let topicOrder = 0;
    let imageCount = 0;

    for (const topicData of GRAMMAR_TOPICS_DATA) {
      const topicGroupId = topicGroupMap.get(topicData.category);
      if (!topicGroupId) {
        console.error(`   ❌ TopicGroup not found for category: ${topicData.category}`);
        continue;
      }

      // Fetch random UK city image
      console.log(`   🖼️  Fetching image for "${topicData.title}"...`);
      const thumbnail = await fetchRandomUKCityImage();
      imageCount++;
      await delay(400); // Rate limiting

      // Create or update Topic
      const topic = await prisma.topic.upsert({
        where: {
          id: `grammar-${topicData.category.toLowerCase().replace(/\s+/g, "-")}-${topicData.subcategory.toLowerCase().replace(/[\/\s]+/g, "-")}-${topicOrder}`,
        },
        update: {
          title: topicData.title,
          description: topicData.description,
          level: topicData.level,
          category: topicData.category,
          subcategory: topicData.subcategory,
          wordCount: topicData.wordCount,
          estimatedTime: topicData.estimatedTime,
          thumbnail: thumbnail || undefined,
          topicGroupId,
        },
        create: {
          id: `grammar-${topicData.category.toLowerCase().replace(/\s+/g, "-")}-${topicData.subcategory.toLowerCase().replace(/[\/\s]+/g, "-")}-${topicOrder}`,
          title: topicData.title,
          description: topicData.description,
          level: topicData.level,
          category: topicData.category,
          subcategory: topicData.subcategory,
          wordCount: topicData.wordCount,
          estimatedTime: topicData.estimatedTime,
          thumbnail: thumbnail || undefined,
          topicGroupId,
          order: topicOrder,
        },
      });

      console.log(`   ✅ Topic: "${topicData.title}" (Level: ${topicData.level})`);

      // Delete existing grammar notes for this topic (to avoid duplicates)
      await prisma.grammarNote.deleteMany({
        where: { topicId: topic.id },
      });

      // Create GrammarNotes
      for (let i = 0; i < topicData.grammarNotes.length; i++) {
        const note = topicData.grammarNotes[i];
        await prisma.grammarNote.create({
          data: {
            topicId: topic.id,
            title: note.title,
            explanation: note.explanation,
            examples: note.examples,
          },
        });
        console.log(`      📝 GrammarNote: "${note.title}"`);
      }

      // Create Lessons for each topic
      const lessonTypes: { title: string; type: LessonType; duration: string }[] = [
        { title: "Grammar Learning", type: "vocabulary", duration: "15 min" },
        { title: "Practice Exercises", type: "quiz", duration: "20 min" },
        { title: "Listening Practice", type: "listening", duration: "15 min" },
      ];

      // Delete existing lessons for this topic
      await prisma.lesson.deleteMany({
        where: { topicId: topic.id },
      });

      for (let i = 0; i < lessonTypes.length; i++) {
        const lesson = lessonTypes[i];
        await prisma.lesson.create({
          data: {
            topicId: topic.id,
            title: `${lesson.title} - ${topicData.title}`,
            description: `Learn ${topicData.subcategory} through ${lesson.title.toLowerCase()}`,
            duration: lesson.duration,
            type: lesson.type,
            order: i,
          },
        });
      }
      console.log(`      📖 Created ${lessonTypes.length} lessons`);

      topicOrder++;
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✨ GRAMMAR SEED COMPLETE");
    console.log("=".repeat(60));
    console.log(`   ✅ TopicGroups created: ${GRAMMAR_TOPIC_GROUPS.length}`);
    console.log(`   ✅ Topics created: ${GRAMMAR_TOPICS_DATA.length}`);
    console.log(`   ✅ Images fetched: ${imageCount}`);
    console.log(`   ✅ GrammarNotes created: ${GRAMMAR_TOPICS_DATA.reduce((acc, t) => acc + t.grammarNotes.length, 0)}`);
    console.log(`   ✅ Lessons created: ${GRAMMAR_TOPICS_DATA.length * 3}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
