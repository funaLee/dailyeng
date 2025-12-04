// Spaced Repetition System (SM-2 Algorithm)
export interface SRSCard {
  id: string
  front: string
  back: string
  interval: number // days
  easeFactor: number // 1.3 - 2.5
  repetitions: number
  nextReviewDate: Date
  lastReviewDate?: Date
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

// SM-2 Algorithm implementation
export function calculateNextReview(card: SRSCard, quality: ReviewQuality): SRSCard {
  let { interval, easeFactor, repetitions } = card

  // Quality: 0-2 = incorrect, 3-5 = correct
  if (quality < 3) {
    // Incorrect - reset
    interval = 1
    repetitions = 0
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else {
    // Correct
    repetitions += 1

    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 3
    } else {
      interval = Math.round(interval * easeFactor)
    }

    // Adjust ease factor
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  }

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    ...card,
    interval,
    easeFactor: Math.min(2.5, easeFactor),
    repetitions,
    nextReviewDate,
    lastReviewDate: new Date(),
  }
}

// Get cards due for review
export function getCardsDue(cards: SRSCard[]): SRSCard[] {
  const now = new Date()
  return cards
    .filter((card) => card.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime())
}

// Get review statistics
export function getReviewStats(cards: SRSCard[]) {
  const now = new Date()
  const due = cards.filter((c) => c.nextReviewDate <= now).length
  const new_cards = cards.filter((c) => c.repetitions === 0).length
  const learning = cards.filter((c) => c.repetitions > 0 && c.repetitions < 3).length
  const review = cards.filter((c) => c.repetitions >= 3).length

  return { due, new_cards, learning, review, total: cards.length }
}
