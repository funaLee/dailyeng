// Server Component - No "use client" directive
// Data fetching happens here on the server

import PlacementTestClient from "@/components/page/PlacementTestClient";
import type {
  TestStep,
  Question,
  ReadingPassage,
} from "@/components/page/PlacementTestClient";

// Mock data - In the future, this can be replaced with actual data fetching

// Test steps in order (without icons - icons are rendered in client based on id)
const testSteps: TestStep[] = [
  {
    id: "vocabulary",
    label: "Vocabulary",
    color: "accent",
    description: "Test your word knowledge",
  },
  {
    id: "grammar",
    label: "Grammar",
    color: "primary",
    description: "Assess grammar understanding",
  },
  {
    id: "reading",
    label: "Reading",
    color: "warning",
    description: "Reading comprehension",
  },
  {
    id: "listening",
    label: "Listening",
    color: "info",
    description: "Test listening skills",
  },
  {
    id: "speaking",
    label: "Speaking",
    color: "secondary",
    description: "Assess speaking ability",
  },
  {
    id: "writing",
    label: "Writing",
    color: "primary",
    description: "Evaluate writing skills",
  },
];

// Mock questions for each test
const mockQuestions: Record<string, Question[]> = {
  vocabulary: [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the synonym of 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Choose the correct word: 'The weather is ___ today.'",
      options: ["beauty", "beautiful", "beautifully", "beautify"],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "What does 'ubiquitous' mean?",
      options: ["Rare", "Present everywhere", "Ancient", "Modern"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "multiple-choice",
      question: "Select the antonym of 'generous':",
      options: ["Kind", "Selfish", "Wealthy", "Poor"],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "Which word means 'to make something better'?",
      options: ["Worsen", "Improve", "Destroy", "Ignore"],
      correctAnswer: 1,
    },
    {
      id: 6,
      type: "fill-blank",
      question: "Complete: 'She has a great ___ for music.'",
      correctAnswer: "talent",
    },
    {
      id: 7,
      type: "multiple-choice",
      question: "What is the meaning of 'inevitable'?",
      options: ["Avoidable", "Certain to happen", "Unlikely", "Impossible"],
      correctAnswer: 1,
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Choose the correct definition of 'pragmatic':",
      options: ["Idealistic", "Practical", "Romantic", "Theoretical"],
      correctAnswer: 1,
    },
  ],
  grammar: [
    {
      id: 1,
      type: "multiple-choice",
      question: "Choose the correct form: 'She ___ to school every day.'",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Select the correct sentence:",
      options: [
        "He don't like coffee",
        "He doesn't likes coffee",
        "He doesn't like coffee",
        "He not like coffee",
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "Which is correct? 'I have been waiting ___ two hours.'",
      options: ["since", "for", "from", "during"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "multiple-choice",
      question:
        "Choose the correct past tense: 'Yesterday, I ___ a great movie.'",
      options: ["watch", "watched", "watching", "watches"],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "multiple-choice",
      question:
        "Select the correct conditional: 'If I ___ rich, I would travel.'",
      options: ["am", "was", "were", "be"],
      correctAnswer: 2,
    },
    {
      id: 6,
      type: "multiple-choice",
      question: "Which uses present perfect correctly?",
      options: [
        "I have see that",
        "I have saw that",
        "I have seen that",
        "I seen that",
      ],
      correctAnswer: 2,
    },
    {
      id: 7,
      type: "multiple-choice",
      question:
        "Choose the correct article: '___ apple a day keeps the doctor away.'",
      options: ["A", "An", "The", "No article"],
      correctAnswer: 1,
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Select the correct passive: 'The cake ___ by my mother.'",
      options: ["baked", "was baked", "is bake", "baking"],
      correctAnswer: 1,
    },
  ],
  reading: [
    {
      id: 1,
      type: "reading",
      passage:
        "Climate change is one of the most pressing issues of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary cause.",
      question:
        "What is the main cause of climate change according to the passage?",
      options: [
        "Natural cycles",
        "Human activities",
        "Solar radiation",
        "Volcanic eruptions",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "reading",
      passage:
        "The invention of the printing press by Gutenberg in the 15th century revolutionized information spread. Before this, books were copied by hand, making them expensive and rare. The press made books cheaper and more accessible, increasing literacy rates.",
      question: "What was the main effect of the printing press?",
      options: [
        "Books became expensive",
        "Literacy rates increased",
        "Books were for wealthy",
        "Information spread slowly",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "reading",
      passage:
        "Sleep is essential for good health. During sleep, the body repairs tissues, consolidates memories, and releases growth hormones. Adults typically need 7-9 hours per night. Lack of sleep can lead to obesity, heart disease, and decreased cognitive function.",
      question: "How many hours of sleep do adults typically need?",
      options: ["5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "reading",
      passage:
        "The Great Barrier Reef, off Australia's coast, is the world's largest coral reef system stretching over 2,300 kilometers. It's home to thousands of marine species but is threatened by climate change, pollution, and overfishing.",
      question: "Where is the Great Barrier Reef located?",
      options: [
        "Caribbean Sea",
        "Mediterranean",
        "Off Australia",
        "Pacific Islands",
      ],
      correctAnswer: 2,
    },
  ],
  listening: [
    {
      id: 1,
      type: "listening",
      question: "What time does the train depart?",
      options: ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "listening",
      question: "Where is the meeting being held?",
      options: [
        "Conference Room A",
        "Conference Room B",
        "Main Hall",
        "Office 201",
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      type: "listening",
      question: "What does the speaker recommend?",
      options: [
        "Taking a break",
        "Working harder",
        "Changing jobs",
        "Getting more sleep",
      ],
      correctAnswer: 3,
    },
    {
      id: 4,
      type: "listening",
      question: "How much does the item cost?",
      options: ["$15", "$25", "$35", "$45"],
      correctAnswer: 2,
    },
  ],
  speaking: [
    {
      id: 1,
      type: "speaking",
      prompt: "Introduce yourself and talk about your hobbies.",
      question: "Record your response (1-2 minutes)",
    },
    {
      id: 2,
      type: "speaking",
      prompt: "Describe your favorite place to visit and explain why.",
      question: "Record your response (1-2 minutes)",
    },
    {
      id: 3,
      type: "speaking",
      prompt: "Discuss the advantages and disadvantages of social media.",
      question: "Record your response (2-3 minutes)",
    },
  ],
  writing: [
    {
      id: 1,
      type: "writing",
      prompt:
        "Write a short paragraph (50-100 words) about your daily routine.",
      question: "Describe your typical day from morning to evening.",
    },
    {
      id: 2,
      type: "writing",
      prompt:
        "Write an email (100-150 words) inviting a friend to your birthday party.",
      question: "Include date, time, location, and special instructions.",
    },
    {
      id: 3,
      type: "writing",
      prompt:
        "Write a short essay (150-200 words) about learning a foreign language.",
      question: "Discuss at least two benefits of being bilingual.",
    },
  ],
};

const readingPassage: ReadingPassage = {
  title: "The Future of Renewable Energy",
  content: `The global transition to renewable energy sources has accelerated dramatically in recent years. Solar and wind power have become increasingly cost-competitive with traditional fossil fuels, leading many countries to revise their energy policies.

In 2023, renewable energy accounted for nearly 30% of global electricity generation, a significant increase from just 20% a decade earlier. This growth has been driven by technological improvements, government incentives, and growing public awareness of climate change.

Solar energy, in particular, has seen remarkable advances. The efficiency of photovoltaic cells has improved substantially, while manufacturing costs have decreased by over 80% since 2010. Many experts predict that solar power will become the cheapest source of electricity in most countries within the next decade.

Wind power has also experienced significant growth. Offshore wind farms, which can generate electricity more consistently due to stronger and more reliable winds at sea, have become increasingly popular in Europe and Asia. The United Kingdom, for example, now generates over 10% of its electricity from offshore wind.

However, the transition to renewable energy is not without challenges. The intermittent nature of solar and wind power requires significant investment in energy storage solutions. Battery technology has improved, but large-scale storage remains expensive. Grid infrastructure also needs substantial upgrades to handle the variable output of renewable sources.

Despite these challenges, the momentum toward renewable energy appears unstoppable. Major corporations, cities, and even entire nations have committed to achieving carbon neutrality by 2050 or earlier. This shift represents not just an environmental imperative but also an economic opportunity, with millions of jobs being created in the renewable energy sector worldwide.`,
  questions: [
    {
      question:
        "According to the passage, what percentage of global electricity was generated by renewable energy in 2023?",
      options: ["20%", "25%", "Nearly 30%", "35%"],
      correctAnswer: 2,
      explanation:
        "The passage states that 'In 2023, renewable energy accounted for nearly 30% of global electricity generation.'",
    },
    {
      question: "What has contributed to the decrease in solar energy costs?",
      options: [
        "Government regulations",
        "Improved efficiency and reduced manufacturing costs",
        "Increased fossil fuel prices",
        "International trade agreements",
      ],
      correctAnswer: 1,
      explanation:
        "The passage mentions that 'The efficiency of photovoltaic cells has improved substantially, while manufacturing costs have decreased by over 80% since 2010.'",
    },
    {
      question: "Why have offshore wind farms become popular?",
      options: [
        "They are cheaper to build",
        "They generate electricity more consistently",
        "They require less maintenance",
        "They are closer to cities",
      ],
      correctAnswer: 1,
      explanation:
        "The passage explains that offshore wind farms 'can generate electricity more consistently due to stronger and more reliable winds at sea.'",
    },
    {
      question: "What is mentioned as a major challenge for renewable energy?",
      options: [
        "Lack of public support",
        "High cost of solar panels",
        "The intermittent nature of solar and wind power",
        "Shortage of skilled workers",
      ],
      correctAnswer: 2,
      explanation:
        "The passage states that 'The intermittent nature of solar and wind power requires significant investment in energy storage solutions.'",
    },
    {
      question:
        "What does the passage suggest about the future of renewable energy?",
      options: [
        "It will likely fail due to high costs",
        "Only developed countries will adopt it",
        "The momentum toward it appears unstoppable",
        "It will remain a minor energy source",
      ],
      correctAnswer: 2,
      explanation:
        "The passage concludes that 'the momentum toward renewable energy appears unstoppable' with many commitments to carbon neutrality.",
    },
  ],
};

export default async function PlacementTestPage() {
  // In the future, you can fetch data from DB, API, or File System here
  // const testSteps = await fetchTestSteps()
  // const mockQuestions = await fetchQuestions()

  return (
    <PlacementTestClient
      testSteps={testSteps}
      mockQuestions={mockQuestions}
      readingPassage={readingPassage}
    />
  );
}
