"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { authService } from "@/lib/auth"
import { ArrowRight, BookOpen, Mic, Brain, Trophy } from "lucide-react"

export default function Home() {
  const { user, login, stats, setStats } = useAppStore()

  useEffect(() => {
    // Initialize from localStorage on mount
    const initializeUser = async () => {
      const storedUser = await authService.getCurrentUser()
      if (storedUser && !user) {
        login(storedUser)
        // Initialize stats
        setStats({
          userId: storedUser.id,
          xp: 1250,
          streak: 7,
          totalLearningMinutes: 450,
          badges: ["first-lesson", "week-warrior"],
          skillScores: {
            vocabulary: 72,
            grammar: 65,
            speaking: 58,
            listening: 70,
            reading: 75,
          },
        })
      }
    }

    initializeUser()
  }, [user, login, setStats])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            Master English with{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Learning
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Learn vocabulary, practice speaking, and improve grammar with personalized lessons powered by artificial
            intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
              <Link href="/vocab">
                <Button size="lg" className="gap-2">
                  Continue Learning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/help">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-2xl bg-card p-6 border border-border hover:shadow-lg transition-shadow">
            <BookOpen className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Vocabulary Hub</h3>
            <p className="text-sm text-muted-foreground">
              Learn 20-30 words per topic with pronunciation, examples, and collocations.
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 border border-border hover:shadow-lg transition-shadow">
            <Mic className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Speaking Room</h3>
            <p className="text-sm text-muted-foreground">
              Practice real conversations with AI tutors and get instant feedback.
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 border border-border hover:shadow-lg transition-shadow">
            <Brain className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart Flashcards</h3>
            <p className="text-sm text-muted-foreground">Spaced repetition system that adapts to your learning pace.</p>
          </div>
        </div>
      </section>

      {user && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* CTA Card */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 p-8 text-center flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">Ready to start learning?</h2>
              <p className="text-muted-foreground mb-6">You have a {stats?.streak || 0}-day streak! Keep it going.</p>
              <Link href="/vocab">
                <Button size="lg">Continue Learning</Button>
              </Link>
            </div>

            {/* Leaderboard Preview */}
            <Link href="/profile">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h3 className="font-semibold text-lg">This Week's Leaderboard</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: "You", xp: stats?.xp || 0, badge: "🥇" },
                      { rank: 2, name: "Alex Chen", xp: 1180, badge: "🥈" },
                      { rank: 3, name: "Maria Garcia", xp: 1050, badge: "🥉" },
                    ].map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{entry.badge}</span>
                          <span className="font-medium">{entry.name}</span>
                        </div>
                        <span className="text-muted-foreground">{entry.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">View full leaderboard →</p>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
