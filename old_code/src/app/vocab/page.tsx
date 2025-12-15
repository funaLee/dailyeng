import VocabPageClient from "@/components/page/VocabPageClient";
import { mockTopics, mockVocab } from "@/lib/mock-data";
import type { Course } from "@/components/hub";

const COURSES: Course[] = [
  {
    id: "ielts-7",
    name: "IELTS 7.0",
    description:
      "Comprehensive IELTS vocabulary preparation for band 7.0 and above. Focus on academic and general training modules.",
    estimatedCompletion: "12/12/2025",
    progress: 12,
  },
  {
    id: "business",
    name: "Business English",
    description:
      "Professional vocabulary for workplace communication, meetings, presentations, and business correspondence.",
    estimatedCompletion: "15/01/2026",
    progress: 0,
  },
  {
    id: "toeic",
    name: "TOEIC Preparation",
    description:
      "Essential vocabulary for TOEIC test success covering business and everyday English contexts.",
    estimatedCompletion: "20/02/2026",
    progress: 0,
  },
];

const CURRENT_TOPIC = {
  id: "animal-behaviours",
  title: "Animal Behaviours",
  subtitle: "Reading Practice 1",
  progress: 40,
};

const dictionaryWords = [
  {
    id: "1",
    word: "Abandon",
    pronunciation: "/əˈbændən/",
    meaning: "To leave behind or give up completely",
    partOfSpeech: "Verb",
    level: "B1",
    category: "Action",
    masteryLevel: 45,
  },
  {
    id: "2",
    word: "Accomplish",
    pronunciation: "/əˈkʌmplɪʃ/",
    meaning: "To complete or achieve something successfully",
    partOfSpeech: "Verb",
    level: "B1",
    category: "Action",
    masteryLevel: 65,
  },
  {
    id: "3",
    word: "Benefit",
    pronunciation: "/ˈbenɪfɪt/",
    meaning: "An advantage or profit gained from something",
    partOfSpeech: "Noun",
    level: "A2",
    category: "General",
    masteryLevel: 80,
  },
  {
    id: "4",
    word: "Collaborate",
    pronunciation: "/kəˈlæbəreɪt/",
    meaning: "To work together with others on a project",
    partOfSpeech: "Verb",
    level: "B2",
    category: "Workplace",
    masteryLevel: 70,
  },
  {
    id: "5",
    word: "Determine",
    pronunciation: "/dɪˈtɜːmɪn/",
    meaning: "To decide or establish something precisely",
    partOfSpeech: "Verb",
    level: "B1",
    category: "Action",
    masteryLevel: 55,
  },
  {
    id: "6",
    word: "Efficient",
    pronunciation: "/ɪˈfɪʃnt/",
    meaning: "Working in a well-organized and competent way",
    partOfSpeech: "Adjective",
    level: "B2",
    category: "Quality",
    masteryLevel: 60,
  },
  {
    id: "7",
    word: "Family",
    pronunciation: "/ˈfæmɪli/",
    meaning: "A group of people related by blood or marriage",
    partOfSpeech: "Noun",
    level: "A1",
    category: "Family",
    masteryLevel: 95,
  },
  {
    id: "8",
    word: "Generate",
    pronunciation: "/ˈdʒenəreɪt/",
    meaning: "To produce or create something",
    partOfSpeech: "Verb",
    level: "B2",
    category: "Action",
    masteryLevel: 50,
  },
  {
    id: "9",
    word: "Hypothesis",
    pronunciation: "/haɪˈpɒθəsɪs/",
    meaning: "A proposed explanation for a phenomenon",
    partOfSpeech: "Noun",
    level: "C1",
    category: "Academic",
    masteryLevel: 30,
  },
  {
    id: "10",
    word: "Implement",
    pronunciation: "/ˈɪmplɪment/",
    meaning: "To put a plan or decision into effect",
    partOfSpeech: "Verb",
    level: "B2",
    category: "Business",
    masteryLevel: 40,
  },
  {
    id: "11",
    word: "Journey",
    pronunciation: "/ˈdʒɜːni/",
    meaning: "An act of traveling from one place to another",
    partOfSpeech: "Noun",
    level: "A2",
    category: "Travel",
    masteryLevel: 85,
  },
  {
    id: "12",
    word: "Knowledge",
    pronunciation: "/ˈnɒlɪdʒ/",
    meaning: "Facts, information, and skills acquired through experience",
    partOfSpeech: "Noun",
    level: "A2",
    category: "Education",
    masteryLevel: 90,
  },
  {
    id: "13",
    word: "Language",
    pronunciation: "/ˈlæŋɡwɪdʒ/",
    meaning: "A system of communication used by a country or community",
    partOfSpeech: "Noun",
    level: "A1",
    category: "Education",
    masteryLevel: 95,
  },
  {
    id: "14",
    word: "Magnificent",
    pronunciation: "/mæɡˈnɪfɪsnt/",
    meaning: "Extremely beautiful, elaborate, or impressive",
    partOfSpeech: "Adjective",
    level: "B2",
    category: "Quality",
    masteryLevel: 35,
  },
  {
    id: "15",
    word: "Negotiate",
    pronunciation: "/nɪˈɡəʊʃieɪt/",
    meaning: "To discuss something in order to reach an agreement",
    partOfSpeech: "Verb",
    level: "B2",
    category: "Business",
    masteryLevel: 45,
  },
  {
    id: "16",
    word: "Opportunity",
    pronunciation: "/ˌɒpəˈtjuːnɪti/",
    meaning:
      "A time or set of circumstances that makes it possible to do something",
    partOfSpeech: "Noun",
    level: "B1",
    category: "General",
    masteryLevel: 75,
  },
  {
    id: "17",
    word: "Parent",
    pronunciation: "/ˈpeərənt/",
    meaning: "A father or mother of a person or an animal",
    partOfSpeech: "Noun",
    level: "A1",
    category: "Family",
    masteryLevel: 98,
  },
  {
    id: "18",
    word: "Qualify",
    pronunciation: "/ˈkwɒlɪfaɪ/",
    meaning: "To be entitled to a particular benefit or privilege",
    partOfSpeech: "Verb",
    level: "B1",
    category: "General",
    masteryLevel: 55,
  },
  {
    id: "19",
    word: "Recommend",
    pronunciation: "/ˌrekəˈmend/",
    meaning:
      "To suggest that someone or something would be good for a particular purpose",
    partOfSpeech: "Verb",
    level: "B1",
    category: "Action",
    masteryLevel: 70,
  },
  {
    id: "20",
    word: "Significant",
    pronunciation: "/sɪɡˈnɪfɪkənt/",
    meaning: "Sufficiently great or important to be worthy of attention",
    partOfSpeech: "Adjective",
    level: "B2",
    category: "Quality",
    masteryLevel: 60,
  },
  {
    id: "21",
    word: "Transform",
    pronunciation: "/trænsˈfɔːm/",
    meaning: "To make a thorough or dramatic change in form or appearance",
    partOfSpeech: "Verb",
    level: "B2",
    category: "Action",
    masteryLevel: 50,
  },
  {
    id: "22",
    word: "Understand",
    pronunciation: "/ˌʌndəˈstænd/",
    meaning: "To perceive the intended meaning of words or a speaker",
    partOfSpeech: "Verb",
    level: "A1",
    category: "General",
    masteryLevel: 95,
  },
  {
    id: "23",
    word: "Vocabulary",
    pronunciation: "/vəˈkæbjʊləri/",
    meaning: "The body of words used in a particular language",
    partOfSpeech: "Noun",
    level: "A2",
    category: "Education",
    masteryLevel: 85,
  },
  {
    id: "24",
    word: "Widespread",
    pronunciation: "/ˈwaɪdspred/",
    meaning: "Found or distributed over a large area or number of people",
    partOfSpeech: "Adjective",
    level: "B2",
    category: "Quality",
    masteryLevel: 40,
  },
  {
    id: "25",
    word: "Xenophobia",
    pronunciation: "/ˌzenəˈfəʊbiə/",
    meaning: "Dislike of or prejudice against people from other countries",
    partOfSpeech: "Noun",
    level: "C1",
    category: "Social",
    masteryLevel: 20,
  },
  {
    id: "26",
    word: "Yield",
    pronunciation: "/jiːld/",
    meaning:
      "To produce or provide a natural, agricultural, or industrial product",
    partOfSpeech: "Verb",
    level: "B2",
    category: "General",
    masteryLevel: 35,
  },
  {
    id: "27",
    word: "Zealous",
    pronunciation: "/ˈzeləs/",
    meaning: "Having or showing great energy or enthusiasm",
    partOfSpeech: "Adjective",
    level: "C1",
    category: "Quality",
    masteryLevel: 25,
  },
];

const mindmapData = [
  {
    id: "daily-life",
    name: "Daily Life",
    color: "primary" as const,
    topics: [
      {
        id: "1",
        title: "Travel",
        words: mockVocab["1"] || [],
      },
      {
        id: "2",
        title: "Food & Dining",
        words: mockVocab["2"] || [],
      },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    color: "secondary" as const,
    topics: [
      {
        id: "3",
        title: "Job Interview",
        words: mockVocab["3"] || [],
      },
    ],
  },
  {
    id: "academic",
    name: "Academic",
    color: "accent" as const,
    topics: [
      {
        id: "academic-1",
        title: "Science",
        words: mockVocab["1"]?.slice(0, 3) || [],
      },
    ],
  },
];

export default async function VocabPage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  const topics = mockTopics;

  return (
    <VocabPageClient
      courses={COURSES}
      topics={topics}
      currentTopic={CURRENT_TOPIC}
      dictionaryWords={dictionaryWords}
      mindmapData={mindmapData}
    />
  );
}
