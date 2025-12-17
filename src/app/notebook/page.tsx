// Server Component - Notebook Page
import NotebookPageClient from "@/components/page/NotebookPageClient";
import type { CollectionData, NotebookItem, GrammarItem } from "@/components/page/NotebookPageClient";
import { getNotebooks, getNotebookItems } from "@/actions/notebook";

// Mock vocabulary data (will be replaced with DB data later)
const vocabularyItems: NotebookItem[] = [
  {
    id: "v1", word: "Accomplish", pronunciation: "/əˈkʌmplɪʃ/",
    meaning: ["To complete or achieve something successfully"],
    vietnamese: ["Hoàn thành, đạt được"],
    examples: [
      { en: "She was able to accomplish all her goals this year.", vi: "Cô ấy đã có thể hoàn thành tất cả mục tiêu của mình trong năm nay." },
    ],
    partOfSpeech: "verb", level: "B1", tags: ["business", "achievement"],
    collectionId: "vocabulary", masteryLevel: 65, lastReviewed: "2 days ago",
    nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "v2", word: "Collaborate", pronunciation: "/kəˈlæbəreɪt/",
    meaning: ["To work together with others on a project or task"],
    vietnamese: ["Cộng tác, làm việc cùng nhau"],
    examples: [{ en: "The teams will collaborate to develop the new software.", vi: "Các nhóm sẽ cộng tác để phát triển phần mềm mới." }],
    partOfSpeech: "verb", level: "B2", tags: ["business", "teamwork"],
    collectionId: "vocabulary", masteryLevel: 40, lastReviewed: "5 days ago",
    nextReview: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "v3", word: "Behaviour", pronunciation: "/bɪˈheɪvjə(r)/",
    meaning: ["The way that somebody behaves, especially towards other people"],
    vietnamese: ["Hành vi / cách cư xử"],
    examples: [{ en: "It is hard to change old patterns of behaviour.", vi: "Thật khó để thay đổi những hành vi cũ." }],
    partOfSpeech: "noun", level: "A2", tags: ["psychology"],
    collectionId: "vocabulary", masteryLevel: 80, lastReviewed: "Today",
    nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "v4", word: "Determine", pronunciation: "/dɪˈtɜːmɪn/",
    meaning: ["To discover the facts about something", "To make something happen in a particular way"],
    vietnamese: ["Xác định, tìm ra", "Quyết định, định đoạt"],
    examples: [{ en: "The police are trying to determine the cause.", vi: "Cảnh sát đang cố gắng xác định nguyên nhân." }],
    partOfSpeech: "verb", level: "B1", tags: ["academic"],
    collectionId: "vocabulary", masteryLevel: 25, lastReviewed: "1 week ago",
    nextReview: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "v5", word: "Enthusiasm", pronunciation: "/ɪnˈθjuːziæzəm/",
    meaning: ["A strong feeling of excitement and interest"],
    vietnamese: ["Sự nhiệt tình, hăng hái"],
    examples: [{ en: "She shows great enthusiasm for her work.", vi: "Cô ấy thể hiện sự nhiệt tình lớn với công việc." }],
    partOfSpeech: "noun", level: "B1", tags: ["emotion"],
    collectionId: "vocabulary", masteryLevel: 55, lastReviewed: "3 days ago",
    nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock grammar data
const grammarItems: GrammarItem[] = [
  {
    id: "g1", title: "Present Perfect Tense", rule: "Subject + have/has + past participle",
    explanation: "Used to describe actions that happened at an unspecified time before now, or actions that started in the past and continue to the present.",
    examples: [
      { en: "I have visited Paris three times.", vi: "Tôi đã đến Paris ba lần." },
      { en: "She has lived here since 2010.", vi: "Cô ấy đã sống ở đây từ năm 2010." },
    ],
    level: "A2", category: "Tenses", collectionId: "grammar", masteryLevel: 75, lastReviewed: "1 day ago",
  },
  {
    id: "g2", title: "Conditional Type 2", rule: "If + past simple, would + base verb",
    explanation: "Used to talk about unreal or hypothetical situations in the present or future.",
    examples: [
      { en: "If I had more money, I would travel the world.", vi: "Nếu tôi có nhiều tiền hơn, tôi sẽ đi du lịch vòng quanh thế giới." },
    ],
    level: "B1", category: "Conditionals", collectionId: "grammar", masteryLevel: 45, lastReviewed: "3 days ago",
  },
  {
    id: "g3", title: "Passive Voice", rule: "Subject + be + past participle (+ by agent)",
    explanation: "Used when the focus is on the action rather than who performs it.",
    examples: [
      { en: "The book was written by J.K. Rowling.", vi: "Cuốn sách được viết bởi J.K. Rowling." },
    ],
    level: "B1", category: "Voice", collectionId: "grammar", masteryLevel: 60, lastReviewed: "5 days ago",
  },
  {
    id: "g4", title: "Relative Clauses", rule: "who/which/that/where/when + clause",
    explanation: "Used to give more information about a noun without starting a new sentence.",
    examples: [
      { en: "The man who called you is my brother.", vi: "Người đàn ông đã gọi cho bạn là anh trai tôi." },
    ],
    level: "B1", category: "Clauses", collectionId: "grammar", masteryLevel: 30, lastReviewed: "1 week ago",
  },
  {
    id: "g5", title: "Reported Speech", rule: "Reporting verb + (that) + reported clause",
    explanation: "Used to report what someone said without using their exact words.",
    examples: [
      { en: "She said that she was tired.", vi: "Cô ấy nói rằng cô ấy mệt." },
    ],
    level: "B2", category: "Speech", collectionId: "grammar", masteryLevel: 20, lastReviewed: "2 weeks ago",
  },
];

// Default sample collections (used when user has no notebooks)
const defaultCollections: CollectionData[] = [
  { id: "sample-vocab", name: "IELTS Words", count: 5, mastered: 1, color: "primary", type: "vocabulary" },
  { id: "sample-grammar", name: "Essential Tenses", count: 5, mastered: 0, color: "secondary", type: "grammar" },
];

// Sample vocab items mapped to sample collection
const sampleVocabItems = vocabularyItems.map(item => ({ ...item, collectionId: "sample-vocab" }));
const sampleGrammarItems = grammarItems.map(item => ({ ...item, collectionId: "sample-grammar" }));

export default async function NotebookPage() {
  // Fetch user's notebooks from database
  const userNotebooks = await getNotebooks();
  
  // If user has notebooks, fetch items for each vocabulary notebook
  let dbVocabItems: NotebookItem[] = [];
  if (userNotebooks.length > 0) {
    const vocabNotebooks = userNotebooks.filter(nb => nb.type === "vocabulary");
    for (const nb of vocabNotebooks) {
      const items = await getNotebookItems(nb.id);
      dbVocabItems.push(...items.map(item => ({
        id: item.id,
        word: item.word,
        pronunciation: item.pronunciation || "/.../",
        meaning: item.meaning,
        vietnamese: item.vietnamese,
        examples: item.examples,
        partOfSpeech: item.partOfSpeech || "noun",
        level: item.level || "A2",
        note: item.note || undefined,
        tags: item.tags,
        collectionId: item.notebookId,
        masteryLevel: item.masteryLevel,
        lastReviewed: item.lastReviewed || undefined,
        nextReview: item.nextReview || undefined,
      })));
    }
  }

  // Always show sample collections + user's notebooks from DB
  const userCollections: CollectionData[] = userNotebooks.map(nb => ({
    id: nb.id,
    name: nb.name,
    count: nb.count,
    mastered: nb.mastered,
    color: nb.color,
    type: nb.type as "vocabulary" | "grammar",
  }));
  
  // Combine: sample collections first, then user's notebooks
  const collections: CollectionData[] = [...defaultCollections, ...userCollections];

  // Combine sample items + DB items
  const finalVocabItems = [...sampleVocabItems, ...dbVocabItems];
  const finalGrammarItems = sampleGrammarItems; // Grammar from DB not implemented yet

  // Calculate due count
  const now = new Date();
  const dueCount = finalVocabItems.filter(item => item.nextReview && new Date(item.nextReview) <= now).length;

  return (
    <NotebookPageClient
      collections={collections}
      vocabularyItems={finalVocabItems}
      grammarItems={finalGrammarItems}
      dueCount={dueCount}
    />
  );
}
