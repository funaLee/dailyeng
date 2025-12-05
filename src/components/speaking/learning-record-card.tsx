"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface LearningRecordCardProps {
  overallScore: number
  completedTurns: number
  totalTurns: number
  date: Date
  previousScore?: number
  onClick: () => void
}

export function LearningRecordCard({
  overallScore,
  completedTurns,
  totalTurns,
  date,
  previousScore,
  onClick,
}: LearningRecordCardProps) {
  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getTimeAgo = (d: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)

    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success-500 to-success-400"
    if (score >= 60) return "from-primary-500 to-primary-400"
    if (score >= 40) return "from-warning-500 to-warning-400"
    return "from-error-500 to-error-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Work"
  }

  const getTrend = () => {
    if (previousScore === undefined) return null
    const diff = overallScore - previousScore
    if (diff > 0) return { icon: TrendingUp, color: "text-success-500", label: `+${diff}` }
    if (diff < 0) return { icon: TrendingDown, color: "text-error-500", label: `${diff}` }
    return { icon: Minus, color: "text-muted-foreground", label: "0" }
  }

  const trend = getTrend()
  const completionPercent = (completedTurns / totalTurns) * 100

  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
    >
      <Card className="p-0 border-[1.4px] border-primary-200 overflow-hidden bg-card">
        <div className="flex">
          {/* Score Section */}
          <div
            className={`w-28 bg-gradient-to-b ${getScoreGradient(overallScore)} p-4 flex flex-col items-center justify-center text-white`}
          >
            <span className="text-4xl font-bold">{overallScore}</span>
            <span className="text-xs opacity-90 font-medium">{getScoreLabel(overallScore)}</span>
            {trend && (
              <div className={`flex items-center gap-0.5 mt-1 px-2 py-0.5 rounded-full bg-white/20 text-xs`}>
                <trend.icon className="h-3 w-3" />
                <span>{trend.label}</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-3">
              {/* Completion Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {completedTurns}/{totalTurns} Turns
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-sm font-medium text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(date)}
                </div>
                <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(date)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{Math.round(completionPercent)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(overallScore)} rounded-full transition-all`}
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            {/* Time Ago Badge */}
            <div className="mt-3 flex justify-end">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{getTimeAgo(date)}</span>
            </div>
          </div>
        </div>
      </Card>
    </button>
  )
}
