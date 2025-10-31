"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlashcardReview } from "@/components/flashcard/flashcard-review"
import { BookOpen, BarChart3, Zap, Search, X } from "lucide-react"
import type { SRSCard } from "@/lib/srs"
import { getCardsDue, getReviewStats } from "@/lib/srs"

export default function NotebookPage() {
  const [cards, setCards] = useState<SRSCard[]>([])
  const [dueCards, setDueCards] = useState<SRSCard[]>([])
  const [stats, setStats] = useState({ due: 0, new_cards: 0, learning: 0, review: 0, total: 0 })
  const [isReviewing, setIsReviewing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Initialize with mock flashcards
    const mockCards: SRSCard[] = [
      {
        id: "fc1",
        front: "passport",
        back: "An official document for international travel",
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
      {
        id: "fc2",
        front: "luggage",
        back: "Bags and suitcases for carrying belongings",
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
      {
        id: "fc3",
        front: "accommodation",
        back: "A place to stay during travel",
        interval: 3,
        easeFactor: 2.3,
        repetitions: 1,
        nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "fc4",
        front: "itinerary",
        back: "A planned route or journey",
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
      {
        id: "fc5",
        front: "souvenir",
        back: "A memento or gift from a place visited",
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
    ]

    setCards(mockCards)
    const due = getCardsDue(mockCards)
    setDueCards(due)
    setStats(getReviewStats(mockCards))
  }, [])

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleReviewComplete = (updatedCards: SRSCard[]) => {
    setCards(updatedCards)
    setIsReviewing(false)
    setStats(getReviewStats(updatedCards))
    setDueCards(getCardsDue(updatedCards))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <BookOpen className="h-8 w-8 text-blue-500" />
          Personal Notebook
        </h1>
        <p className="text-muted-foreground">
          Review your saved flashcards using spaced repetition to maximize retention.
        </p>
      </div>

      {isReviewing ? (
        <div className="max-w-2xl mx-auto">
          <Button variant="outline" className="mb-6 bg-transparent" onClick={() => setIsReviewing(false)}>
            Back to Notebook
          </Button>
          <FlashcardReview cards={dueCards} onComplete={handleReviewComplete} />
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all">All Cards</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-red-500">{stats.due}</p>
                <p className="text-sm text-muted-foreground mt-2">Due Today</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-blue-500">{stats.new_cards}</p>
                <p className="text-sm text-muted-foreground mt-2">New Cards</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-yellow-500">{stats.learning}</p>
                <p className="text-sm text-muted-foreground mt-2">Learning</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-green-500">{stats.review}</p>
                <p className="text-sm text-muted-foreground mt-2">Review</p>
              </Card>
            </div>

            <Card className="p-8 text-center">
              {stats.due > 0 ? (
                <>
                  <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Review</h3>
                  <p className="text-muted-foreground mb-6">You have {stats.due} cards due for review today.</p>
                  <Button size="lg" onClick={() => setIsReviewing(true)}>
                    Start Review Session
                  </Button>
                </>
              ) : (
                <>
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">No cards due for review today. Great job!</p>
                </>
              )}
            </Card>
          </TabsContent>

          {/* All Cards Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                />
              </div>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {filteredCards.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? "No cards found matching your search." : "No cards yet. Start adding!"}
                </p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredCards.map((card) => (
                  <Card key={card.id} className="p-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Front</p>
                        <p className="font-medium">{card.front}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Back</p>
                        <p className="text-sm text-muted-foreground">{card.back}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Reps: {card.repetitions}</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Interval: {card.interval}d</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">EF: {card.easeFactor.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Card Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">New</span>
                      <span className="text-sm font-medium">{stats.new_cards}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stats.new_cards / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Learning</span>
                      <span className="text-sm font-medium">{stats.learning}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(stats.learning / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Review</span>
                      <span className="text-sm font-medium">{stats.review}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(stats.review / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Review Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cards</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Today</span>
                    <span className="font-medium">{stats.due}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Ease</span>
                    <span className="font-medium">
                      {cards.length > 0
                        ? (cards.reduce((sum, c) => sum + c.easeFactor, 0) / cards.length).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Reviews</span>
                    <span className="font-medium">{cards.reduce((sum, c) => sum + c.repetitions, 0)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
