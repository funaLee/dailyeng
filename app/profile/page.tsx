"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkillRadar } from "@/components/profile/skill-radar"
import { User, Zap, Flame, Clock, Award, BookOpen } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, stats, logout } = useAppStore()

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <User className="h-8 w-8 text-blue-500" />
          Learning Profile
        </h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </div>

      {/* Profile Card */}
      <Card className="p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold">{stats?.xp || 0}</p>
          <p className="text-sm text-muted-foreground mt-2">Total XP</p>
        </Card>

        <Card className="p-6 text-center">
          <Flame className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-3xl font-bold">{stats?.streak || 0}</p>
          <p className="text-sm text-muted-foreground mt-2">Day Streak</p>
        </Card>

        <Card className="p-6 text-center">
          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <p className="text-3xl font-bold">{stats?.totalLearningMinutes || 0}</p>
          <p className="text-sm text-muted-foreground mt-2">Learning Minutes</p>
        </Card>

        <Card className="p-6 text-center">
          <Award className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <p className="text-3xl font-bold">{stats?.badges.length || 0}</p>
          <p className="text-sm text-muted-foreground mt-2">Badges Earned</p>
        </Card>
      </div>

      {/* Skills and Badges */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Skill Radar */}
        {stats && <SkillRadar skills={stats.skillScores} />}

        {/* Badges */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Achievements</h3>
          <div className="space-y-3">
            {stats?.badges.map((badge) => {
              const badgeInfo: Record<string, { icon: string; title: string; description: string }> = {
                "first-lesson": {
                  icon: "🎓",
                  title: "First Lesson",
                  description: "Completed your first lesson",
                },
                "week-warrior": {
                  icon: "⚔️",
                  title: "Week Warrior",
                  description: "Maintained a 7-day streak",
                },
                "vocabulary-master": {
                  icon: "📚",
                  title: "Vocabulary Master",
                  description: "Learned 100 new words",
                },
                "speaking-star": {
                  icon: "⭐",
                  title: "Speaking Star",
                  description: "Completed 10 speaking sessions",
                },
              }

              const info = badgeInfo[badge] || { icon: "🏆", title: badge, description: "Achievement unlocked" }

              return (
                <div key={badge} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{info.title}</p>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              )
            })}
            {(!stats?.badges || stats.badges.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">Complete lessons to earn badges!</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Learning Journal
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm font-medium mb-1">Saved Sentences</p>
            <p className="text-xs text-muted-foreground">
              Sentences you've saved from speaking sessions and writing practice
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm font-medium mb-1">Session Summaries</p>
            <p className="text-xs text-muted-foreground">Transcripts and feedback from your speaking room sessions</p>
          </div>
          <p className="text-sm text-muted-foreground text-center py-4">
            Your journal entries will appear here as you complete lessons
          </p>
        </div>
      </Card>
    </div>
  )
}
