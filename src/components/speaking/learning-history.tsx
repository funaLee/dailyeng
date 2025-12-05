"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LearningRecordCard } from "./learning-record-card"
import { History, ArrowLeft, Trophy, Target, TrendingUp, Calendar } from "lucide-react"

interface LearningRecord {
  id: string
  overallScore: number
  completedTurns: number
  totalTurns: number
  date: Date
}

interface LearningHistoryProps {
  records: LearningRecord[]
  onSelectRecord: (id: string) => void
  onBack: () => void
}

export function LearningHistory({ records, onSelectRecord, onBack }: LearningHistoryProps) {
  // Calculate statistics
  const totalSessions = records.length
  const averageScore =
    totalSessions > 0 ? Math.round(records.reduce((sum, r) => sum + r.overallScore, 0) / totalSessions) : 0
  const highestScore = totalSessions > 0 ? Math.max(...records.map((r) => r.overallScore)) : 0
  const recentTrend = records.length >= 2 ? records[0].overallScore - records[1].overallScore : 0

  const stats = [
    {
      icon: Target,
      label: "Total Sessions",
      value: totalSessions.toString(),
      color: "text-primary-500",
      bg: "bg-primary-100",
    },
    {
      icon: Trophy,
      label: "Highest Score",
      value: highestScore.toString(),
      color: "text-warning-500",
      bg: "bg-warning-100",
    },
    {
      icon: Calendar,
      label: "Average Score",
      value: averageScore.toString(),
      color: "text-secondary-500",
      bg: "bg-secondary-100",
    },
    {
      icon: TrendingUp,
      label: "Recent Trend",
      value: recentTrend >= 0 ? `+${recentTrend}` : `${recentTrend}`,
      color: recentTrend >= 0 ? "text-success-500" : "text-error-500",
      bg: recentTrend >= 0 ? "bg-success-100" : "bg-error-100",
    },
  ]

  return (
    <Card className="p-6 border-[1.4px] border-primary-200 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <History className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Learning Records</h1>
            <p className="text-sm text-muted-foreground">Track your speaking progress over time</p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Button>
      </div>

      {/* Stats Grid */}
      {totalSessions > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 rounded-xl border border-primary-100 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Session History</h2>
        <span className="text-sm text-muted-foreground">
          {totalSessions} session{totalSessions !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Records List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {records.length > 0 ? (
          records.map((record, index) => (
            <LearningRecordCard
              key={record.id}
              overallScore={record.overallScore}
              completedTurns={record.completedTurns}
              totalTurns={record.totalTurns}
              date={record.date}
              previousScore={index < records.length - 1 ? records[index + 1].overallScore : undefined}
              onClick={() => onSelectRecord(record.id)}
            />
          ))
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed border-primary-200 bg-primary-50/50">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <History className="h-8 w-8 text-primary-400" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">No learning records yet</p>
            <p className="text-sm text-muted-foreground">Complete a speaking session to see your history</p>
          </div>
        )}
      </div>
    </Card>
  )
}
