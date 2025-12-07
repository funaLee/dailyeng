// Type-safe API fetchers with mock implementations
import type {
  Topic,
  VocabItem,
  QuizItem,
  Flashcard,
  SpeakingScenario,
  StudyPlan,
  ProfileStats,
} from "@/types";
import {
  mockTopics,
  mockVocab,
  mockQuizzes,
  mockSpeakingScenarios,
} from "@/lib/mock-data";

// Topics
export const topicsApi = {
  async getAll(): Promise<Topic[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTopics;
  },

  async getById(id: string): Promise<Topic | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockTopics.find((t) => t.id === id) || null;
  },

  async create(data: Omit<Topic, "id">): Promise<Topic> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTopic: Topic = {
      ...data,
      id: Date.now().toString(),
    };
    return newTopic;
  },
};

// Vocabulary
export const vocabApi = {
  async getByTopic(topicId: string): Promise<VocabItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockVocab[topicId] || [];
  },

  async getById(id: string): Promise<VocabItem | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    for (const items of Object.values(mockVocab)) {
      const item = items.find((v) => v.id === id);
      if (item) return item;
    }
    return null;
  },
};

// Quizzes
export const quizzesApi = {
  async getByTopic(topicId: string): Promise<QuizItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockQuizzes[topicId] || [];
  },

  async submitAnswers(
    topicId: string,
    answers: Record<string, string>
  ): Promise<{ score: number; xp: number; feedback: Record<string, boolean> }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const questions = mockQuizzes[topicId] || [];
    let correct = 0;

    const feedback: Record<string, boolean> = {};
    for (const q of questions) {
      const isCorrect = answers[q.id] === q.correctAnswer;
      feedback[q.id] = isCorrect;
      if (isCorrect) correct++;
    }

    const score = Math.round((correct / questions.length) * 100);
    const xp = correct * 10;

    return { score, xp, feedback };
  },
};

// Flashcards
export const flashcardsApi = {
  async getAll(): Promise<Flashcard[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },

  async create(data: Omit<Flashcard, "id" | "createdAt">): Promise<Flashcard> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
  },

  async update(id: string, data: Partial<Flashcard>): Promise<Flashcard> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      id,
      topicId: "",
      front: "",
      back: "",
      createdAt: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      ...data,
    };
  },

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  },
};

// SRS
export const srsApi = {
  async getQueue(): Promise<Flashcard[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },

  async submitReview(
    cardId: string,
    quality: number
  ): Promise<{ nextReviewDate: Date; interval: number; easeFactor: number }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      nextReviewDate: new Date(),
      interval: 1,
      easeFactor: 2.5,
    };
  },
};

// Speaking
export const speakingApi = {
  async getScenarios(): Promise<SpeakingScenario[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Object.values(mockSpeakingScenarios).flat();
  },

  async getScenarioById(id: string): Promise<SpeakingScenario | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    for (const scenarios of Object.values(mockSpeakingScenarios)) {
      const scenario = scenarios.find((s) => s.id === id);
      if (scenario) return scenario;
    }
    return null;
  },

  async createScenario(
    data: Omit<SpeakingScenario, "id">
  ): Promise<SpeakingScenario> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...data,
      id: Date.now().toString(),
    };
  },

  async submitTurn(
    sessionId: string,
    text: string
  ): Promise<{ response: string; scores: Record<string, number> }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const responses = [
      "That's great! Can you tell me more about that?",
      "I understand. What else would you like to share?",
      "Excellent pronunciation! Let's continue.",
      "Good effort! Remember to speak more slowly.",
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      scores: {
        pronunciation: Math.floor(Math.random() * 40) + 60,
        fluency: Math.floor(Math.random() * 40) + 60,
        grammar: Math.floor(Math.random() * 40) + 60,
        content: Math.floor(Math.random() * 40) + 60,
      },
    };
  },
};

// Study Plan
export const planApi = {
  async getOrCreate(): Promise<StudyPlan | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return null;
  },

  async create(data: Omit<StudyPlan, "id" | "createdAt">): Promise<StudyPlan> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
  },
};

// Profile
export const profileApi = {
  async getStats(): Promise<ProfileStats> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      userId: "1",
      xp: 0,
      streak: 0,
      totalLearningMinutes: 0,
      badges: [],
      skillScores: {
        vocabulary: 0,
        grammar: 0,
        speaking: 0,
        listening: 0,
        reading: 0,
      },
    };
  },

  async updateStats(stats: Partial<ProfileStats>): Promise<ProfileStats> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      userId: "1",
      xp: 0,
      streak: 0,
      totalLearningMinutes: 0,
      badges: [],
      skillScores: {
        vocabulary: 0,
        grammar: 0,
        speaking: 0,
        listening: 0,
        reading: 0,
      },
      ...stats,
    };
  },
};

// AI endpoints
export const aiApi = {
  async translate(
    text: string,
    targetLang: "en" | "vi"
  ): Promise<{
    translation: string;
    feedback: { meaning: string; grammar: string; style: string };
  }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      translation: `Translated to ${targetLang}`,
      feedback: {
        meaning: "Accurate translation",
        grammar: "Correct grammar",
        style: "Natural phrasing",
      },
    };
  },

  async getFeedback(
    text: string,
    type: "speaking" | "writing"
  ): Promise<{
    pronunciation?: number;
    fluency?: number;
    grammar: number;
    content: number;
    suggestions: string[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      pronunciation:
        type === "speaking" ? Math.floor(Math.random() * 40) + 60 : undefined,
      fluency:
        type === "speaking" ? Math.floor(Math.random() * 40) + 60 : undefined,
      grammar: Math.floor(Math.random() * 40) + 60,
      content: Math.floor(Math.random() * 40) + 60,
      suggestions: ["Try to speak more clearly", "Good vocabulary usage"],
    };
  },

  async createTopic(prompt: string): Promise<SpeakingScenario> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      id: Date.now().toString(),
      topicId: "custom",
      title: "Custom Scenario",
      description: prompt,
      goal: "Practice conversation",
      context: "Generated from your prompt",
    };
  },
};
