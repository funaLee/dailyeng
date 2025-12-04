import { describe, it, expect } from "vitest"
import { TopicSchema, VocabItemSchema, FlashcardSchema, ProfileStatsSchema } from "@/types"

describe("Zod Schemas", () => {
  describe("TopicSchema", () => {
    it("should validate a valid topic", () => {
      const validTopic = {
        id: "1",
        title: "Travel",
        description: "Travel vocabulary",
        level: "A2",
        wordCount: 25,
        estimatedTime: 45,
      }
      expect(() => TopicSchema.parse(validTopic)).not.toThrow()
    })

    it("should reject invalid level", () => {
      const invalidTopic = {
        id: "1",
        title: "Travel",
        description: "Travel vocabulary",
        level: "C3",
        wordCount: 25,
        estimatedTime: 45,
      }
      expect(() => TopicSchema.parse(invalidTopic)).toThrow()
    })
  })

  describe("VocabItemSchema", () => {
    it("should validate a valid vocab item", () => {
      const validVocab = {
        id: "v1",
        word: "passport",
        pronunciation: "/ˈpæspɔːrt/",
        meaning: "An official document",
        vietnameseMeaning: "Hộ chiếu",
        partOfSpeech: "noun",
        collocations: ["renew a passport"],
        exampleSentence: "I need a passport.",
        exampleTranslation: "Tôi cần hộ chiếu.",
      }
      expect(() => VocabItemSchema.parse(validVocab)).not.toThrow()
    })

    it("should reject invalid part of speech", () => {
      const invalidVocab = {
        id: "v1",
        word: "passport",
        pronunciation: "/ˈpæspɔːrt/",
        meaning: "An official document",
        vietnameseMeaning: "Hộ chiếu",
        partOfSpeech: "invalid",
        collocations: ["renew a passport"],
        exampleSentence: "I need a passport.",
        exampleTranslation: "Tôi cần hộ chiếu.",
      }
      expect(() => VocabItemSchema.parse(invalidVocab)).toThrow()
    })
  })

  describe("FlashcardSchema", () => {
    it("should validate a valid flashcard", () => {
      const validCard = {
        id: "f1",
        topicId: "1",
        front: "passport",
        back: "hộ chiếu",
        createdAt: new Date(),
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
      }
      expect(() => FlashcardSchema.parse(validCard)).not.toThrow()
    })
  })

  describe("ProfileStatsSchema", () => {
    it("should validate a valid profile stats", () => {
      const validStats = {
        userId: "1",
        xp: 100,
        streak: 5,
        totalLearningMinutes: 120,
        badges: ["first-lesson"],
        skillScores: {
          vocabulary: 75,
          grammar: 80,
          speaking: 70,
          listening: 65,
          reading: 85,
        },
      }
      expect(() => ProfileStatsSchema.parse(validStats)).not.toThrow()
    })

    it("should reject skill scores outside 0-100 range", () => {
      const invalidStats = {
        userId: "1",
        xp: 100,
        streak: 5,
        totalLearningMinutes: 120,
        badges: ["first-lesson"],
        skillScores: {
          vocabulary: 150,
          grammar: 80,
          speaking: 70,
          listening: 65,
          reading: 85,
        },
      }
      expect(() => ProfileStatsSchema.parse(invalidStats)).toThrow()
    })
  })
})
