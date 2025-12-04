import { describe, it, expect, beforeEach } from "vitest"
import { calculateNextReview, getCardsDue, getReviewStats, type SRSCard } from "@/lib/srs"

describe("SRS - SM-2 Algorithm", () => {
  let testCard: SRSCard

  beforeEach(() => {
    testCard = {
      id: "test-1",
      front: "passport",
      back: "hộ chiếu",
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: new Date(),
    }
  })

  describe("calculateNextReview", () => {
    it("should reset interval on incorrect answer (quality < 3)", () => {
      const result = calculateNextReview(testCard, 1)
      expect(result.interval).toBe(1)
      expect(result.repetitions).toBe(0)
      expect(result.easeFactor).toBeLessThan(2.5)
    })

    it("should increase interval on correct answer", () => {
      const result = calculateNextReview(testCard, 4)
      expect(result.repetitions).toBe(1)
      expect(result.interval).toBe(1)
      expect(result.easeFactor).toBeGreaterThan(2.5)
    })

    it("should set interval to 3 on second correct review", () => {
      const afterFirst = calculateNextReview(testCard, 4)
      const afterSecond = calculateNextReview(afterFirst, 4)
      expect(afterSecond.interval).toBe(3)
      expect(afterSecond.repetitions).toBe(2)
    })

    it("should maintain ease factor between 1.3 and 2.5", () => {
      let card = testCard
      for (let i = 0; i < 10; i++) {
        card = calculateNextReview(card, Math.random() > 0.5 ? 4 : 1)
        expect(card.easeFactor).toBeGreaterThanOrEqual(1.3)
        expect(card.easeFactor).toBeLessThanOrEqual(2.5)
      }
    })

    it("should set nextReviewDate correctly", () => {
      const result = calculateNextReview(testCard, 4)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + 1)

      expect(result.nextReviewDate.getDate()).toBe(expectedDate.getDate())
    })
  })

  describe("getCardsDue", () => {
    it("should return cards with nextReviewDate in the past", () => {
      const pastCard: SRSCard = {
        ...testCard,
        nextReviewDate: new Date(Date.now() - 86400000),
      }
      const futureCard: SRSCard = {
        ...testCard,
        id: "test-2",
        nextReviewDate: new Date(Date.now() + 86400000),
      }

      const due = getCardsDue([pastCard, futureCard])
      expect(due).toHaveLength(1)
      expect(due[0].id).toBe("test-1")
    })

    it("should sort cards by nextReviewDate", () => {
      const card1: SRSCard = {
        ...testCard,
        id: "test-1",
        nextReviewDate: new Date(Date.now() - 86400000),
      }
      const card2: SRSCard = {
        ...testCard,
        id: "test-2",
        nextReviewDate: new Date(Date.now() - 172800000),
      }

      const due = getCardsDue([card1, card2])
      expect(due[0].id).toBe("test-2")
      expect(due[1].id).toBe("test-1")
    })
  })

  describe("getReviewStats", () => {
    it("should calculate correct statistics", () => {
      const cards: SRSCard[] = [
        { ...testCard, id: "1", repetitions: 0 },
        { ...testCard, id: "2", repetitions: 1 },
        { ...testCard, id: "3", repetitions: 3 },
        { ...testCard, id: "4", nextReviewDate: new Date(Date.now() - 86400000) },
      ]

      const stats = getReviewStats(cards)
      expect(stats.total).toBe(4)
      expect(stats.new_cards).toBe(1)
      expect(stats.learning).toBe(1)
      expect(stats.review).toBe(1)
      expect(stats.due).toBe(1)
    })
  })
})
