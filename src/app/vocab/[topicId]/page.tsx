import VocabTopicPageClient from "@/components/page/VocabTopicPageClient";
import { mockTopics, mockVocab } from "@/lib/mock-data";

const mockCourseData = {
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

const subTopicLessons: Record<
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

const mockLessonGrades = [
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

const mockSkillScores = [
  { skill: "Vocabulary", score: 85, fullMark: 100 },
  { skill: "Translate", score: 0, fullMark: 100 },
  { skill: "Listening", score: 0, fullMark: 100 },
  { skill: "Reading", score: 0, fullMark: 100 },
  { skill: "Writing", score: 0, fullMark: 100 },
  { skill: "Quiz", score: 0, fullMark: 100 },
];

const mockCourseInfo = {
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

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { topicId } = await params;

  // Mock data - will be replaced with actual data fetching from DB/API later
  const foundTopic = mockTopics.find((t) => t.id === topicId);
  const topic = foundTopic
    ? {
      id: foundTopic.id,
      title: foundTopic.title,
      description: foundTopic.description,
      level: foundTopic.level,
      thumbnail: foundTopic.thumbnail,
    }
    : {
      id: topicId,
      title: "Topic",
      description: "Topic description",
      level: "A2",
    };

  const vocab = mockVocab[topicId] || [];

  return (
    <VocabTopicPageClient
      topicId={topicId}
      topic={topic}
      vocab={vocab}
    />
  );
}
