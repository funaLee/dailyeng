import { z } from "zod"

// Schemas
export const TopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  // Optional progress (0-100) representing user's progress for this topic
  progress: z.number().min(0).max(100).optional(),
  wordCount: z.number(),
  estimatedTime: z.number(), // minutes
  thumbnail: z.string().optional(),
})

export const VocabItemSchema = z.object({
  id: z.string(),
  word: z.string(),
  pronunciation: z.string(), // IPA
  meaning: z.string(),
  vietnameseMeaning: z.string(),
  partOfSpeech: z.enum(["noun", "verb", "adjective", "adverb", "preposition"]),
  collocations: z.array(z.string()),
  exampleSentence: z.string(),
  exampleTranslation: z.string(),
})

export const GrammarNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  explanation: z.string(),
  examples: z.array(
    z.object({
      en: z.string(),
      vi: z.string(),
    }),
  ),
})

export const QuizItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(["multiple-choice", "fill-blank", "matching"]),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string(),
})

export const FlashcardSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  front: z.string(),
  back: z.string(),
  createdAt: z.date(),
  lastReviewed: z.date().optional(),
  interval: z.number(), // days
  easeFactor: z.number(), // 1.3 - 2.5
  repetitions: z.number(),
})

export const SRSItemSchema = z.object({
  id: z.string(),
  flashcardId: z.string(),
  dueDate: z.date(),
  interval: z.number(),
  easeFactor: z.number(),
  repetitions: z.number(),
})

export const SpeakingScenarioSchema = z.object({
  id: z.string(),
  topicId: z.string().optional(), // Optional to match Prisma schema
  title: z.string(),
  description: z.string(),
  goal: z.string(),
  context: z.string(),
  difficulty: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
});

export const SpeakingTurnSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  role: z.enum(["user", "tutor"]),
  text: z.string(),
  audioUrl: z.string().optional(),
  timestamp: z.date(),
  scores: z
    .object({
      pronunciation: z.number().min(0).max(100).optional(),
      fluency: z.number().min(0).max(100).optional(),
      grammar: z.number().min(0).max(100).optional(),
      content: z.number().min(0).max(100).optional(),
    })
    .optional(),
})

export const StudyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  goal: z.enum(["casual", "intermediate", "fluent"]),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  minutesPerDay: z.number(),
  createdAt: z.date(),
  tasks: z.array(
    z.object({
      id: z.string(),
      date: z.date(),
      type: z.enum(["vocab", "grammar", "speaking", "listening"]),
      completed: z.boolean(),
    }),
  ),
})

export const StudyPlanDataSchema = z.object({
  goal: z.enum(["conversation", "travel", "work", "exam"]),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  interests: z.array(z.string()).min(1),
  minutesPerDay: z.number().min(10).max(60),
  wordsPerDay: z.number().int().positive(),
})

export const ProfileStatsSchema = z.object({
  userId: z.string(),
  xp: z.number(),
  streak: z.number(),
  totalLearningMinutes: z.number(),
  badges: z.array(z.string()),
  skillScores: z.object({
    vocabulary: z.number().min(0).max(100),
    grammar: z.number().min(0).max(100),
    speaking: z.number().min(0).max(100),
    listening: z.number().min(0).max(100),
    reading: z.number().min(0).max(100),
  }),
})

// Types
export type Topic = z.infer<typeof TopicSchema>
export type VocabItem = z.infer<typeof VocabItemSchema>
export type GrammarNote = z.infer<typeof GrammarNoteSchema>
export type QuizItem = z.infer<typeof QuizItemSchema>
export type Flashcard = z.infer<typeof FlashcardSchema>
export type SRSItem = z.infer<typeof SRSItemSchema>
export type SpeakingScenario = z.infer<typeof SpeakingScenarioSchema>
export type SpeakingTurn = z.infer<typeof SpeakingTurnSchema>
export type StudyPlan = z.infer<typeof StudyPlanSchema>
export type StudyPlanData = z.infer<typeof StudyPlanDataSchema>
export type ProfileStats = z.infer<typeof ProfileStatsSchema>
