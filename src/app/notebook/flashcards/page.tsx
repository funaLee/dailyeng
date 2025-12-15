// Server Component - Flashcard Review Page
import FlashcardReviewClient from "@/components/page/FlashcardReviewClient"
import type { NotebookItem } from "@/components/page/NotebookPageClient"

// Mock data - same as notebook page
const notebookItems: NotebookItem[] = [
  {
    id: "v1",
    word: "Accomplish",
    pronunciation: "/əˈkʌmplɪʃ/",
    meaning: ["To complete or achieve something successfully"],
    vietnamese: ["Hoàn thành, đạt được"],
    examples: [
      { en: "She was able to accomplish all her goals this year.", vi: "Cô ấy đã có thể hoàn thành tất cả mục tiêu của mình trong năm nay." },
      { en: "We accomplished the task ahead of schedule.", vi: "Chúng tôi đã hoàn thành nhiệm vụ trước thời hạn." },
    ],
    partOfSpeech: "verb",
    level: "B1",
    note: "Often used in professional contexts",
    tags: ["business", "achievement"],
    collectionId: "vocabulary",
    masteryLevel: 65,
    lastReviewed: "2 days ago",
  },
  {
    id: "v2",
    word: "Collaborate",
    pronunciation: "/kəˈlæbəreɪt/",
    meaning: ["To work together with others on a project or task"],
    vietnamese: ["Cộng tác, làm việc cùng nhau"],
    examples: [
      { en: "The teams will collaborate to develop the new software.", vi: "Các nhóm sẽ cộng tác để phát triển phần mềm mới." },
    ],
    partOfSpeech: "verb",
    level: "B2",
    note: "Very common in workplace English",
    tags: ["business", "teamwork"],
    collectionId: "vocabulary",
    masteryLevel: 40,
    lastReviewed: "5 days ago",
  },
  {
    id: "v3",
    word: "Behaviour",
    pronunciation: "/bɪˈheɪvjə(r)/",
    meaning: [
      "The way that somebody behaves, especially towards other people",
      "The way a person, an animal, a plant, a chemical, etc. behaves or functions in a particular situation",
    ],
    vietnamese: [
      "Hành vi / cách cư xử (đối với người khác)",
      "Cách hoạt động / phản ứng (trong một tình huống cụ thể)",
    ],
    examples: [
      { en: "It is hard to change old patterns of behaviour.", vi: "Thật khó để thay đổi những hành vi cũ." },
      { en: "Animals in zoos often display disturbed behaviour.", vi: "Động vật trong vườn thú thường thể hiện hành vi bất thường." },
    ],
    partOfSpeech: "noun",
    level: "A2",
    tags: ["psychology", "daily"],
    collectionId: "vocabulary",
    masteryLevel: 80,
    lastReviewed: "Today",
  },
  {
    id: "v4",
    word: "Determine",
    pronunciation: "/dɪˈtɜːmɪn/",
    meaning: ["To discover the facts about something", "To make something happen in a particular way"],
    vietnamese: ["Xác định, tìm ra", "Quyết định, định đoạt"],
    examples: [
      { en: "The police are trying to determine the cause of the accident.", vi: "Cảnh sát đang cố gắng xác định nguyên nhân vụ tai nạn." },
    ],
    partOfSpeech: "verb",
    level: "B1",
    tags: ["academic", "formal"],
    collectionId: "vocabulary",
    masteryLevel: 25,
    lastReviewed: "1 week ago",
  },
  {
    id: "v5",
    word: "Enthusiasm",
    pronunciation: "/ɪnˈθjuːziæzəm/",
    meaning: ["A strong feeling of excitement and interest in something"],
    vietnamese: ["Sự nhiệt tình, hăng hái"],
    examples: [
      { en: "She shows great enthusiasm for her work.", vi: "Cô ấy thể hiện sự nhiệt tình lớn với công việc." },
    ],
    partOfSpeech: "noun",
    level: "B1",
    tags: ["emotion", "positive"],
    collectionId: "vocabulary",
    masteryLevel: 55,
    lastReviewed: "3 days ago",
  },
]

export default async function FlashcardReviewPage() {
  return <FlashcardReviewClient notebookItems={notebookItems} />
}
