// Server Component - Flashcard Review Page
import FlashcardReviewClient from "@/components/page/FlashcardReviewClient"
import type { NotebookItem } from "@/components/page/NotebookPageClient"

// Mock data - In the future, this can be replaced with actual data fetching
const notebookItems: NotebookItem[] = [
  {
    id: "1",
    word: "Accomplish",
    pronunciation: "/əˈkʌmplɪʃ/",
    meaning: ["To complete or achieve something successfully"],
    vietnamese: ["Hoàn thành, đạt được"],
    examples: [
      {
        en: "She was able to accomplish all her goals this year.",
        vi: "Cô ấy đã có thể hoàn thành tất cả mục tiêu của mình trong năm nay.",
      },
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
    id: "2",
    word: "Collaborate",
    pronunciation: "/kəˈlæbəreɪt/",
    meaning: ["To work together with others on a project or task"],
    vietnamese: ["Cộng tác, làm việc cùng nhau"],
    examples: [
      {
        en: "The teams will collaborate to develop the new software.",
        vi: "Các nhóm sẽ cộng tác để phát triển phần mềm mới.",
      },
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
    id: "3",
    word: "behaviour",
    pronunciation: "/bɪˈheɪvjə(r)/",
    meaning: [
      "the way that somebody behaves, especially towards other people",
      "the way a person, an animal, a plant, a chemical, etc. behaves or functions in a particular situation",
    ],
    vietnamese: [
      "Hành vi / cách cư xử (đối với người khác)",
      "Cách hoạt động / phản ứng (trong một tình huống cụ thể)",
    ],
    examples: [
      {
        en: "It is hard to change old patterns of behaviour.",
        vi: "Thật khó để thay đổi những hành vi cũ.",
      },
      {
        en: "Animals in zoos often display disturbed behaviour.",
        vi: "Động vật trong vườn thú thường thể hiện hành vi bất thường.",
      },
    ],
    partOfSpeech: "noun",
    level: "A2",
    tags: [],
    collectionId: "vocabulary",
    masteryLevel: 80,
    lastReviewed: "Today",
  },
]

export default async function FlashcardReviewPage() {
  // In the future, you can fetch selected items from URL params or session
  // const searchParams = useSearchParams()
  // const selectedIds = searchParams.get('items')?.split(',') || []
  
  return <FlashcardReviewClient notebookItems={notebookItems} />
}
