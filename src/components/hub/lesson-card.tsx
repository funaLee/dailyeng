"use client"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, Loader2 } from "lucide-react"

interface LessonCardProps {
  id: string
  title: string
  duration?: string
  status: "not_started" | "in_progress" | "completed"
  progress?: number
  score?: number
  isGlobalFirstNotStarted?: boolean
  onClick?: () => void
}

export function LessonCard({
  id,
  title,
  duration = "30 min",
  status,
  progress = 0,
  score,
  isGlobalFirstNotStarted = false,
  onClick,
}: LessonCardProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <span className="text-success-600 font-medium text-sm">Completed</span>
            {score !== undefined && <span className="text-success-600 font-bold text-sm">{score}%</span>}
            <CheckCircle2 className="h-5 w-5 text-success-500" />
          </div>
        )
      case "in_progress":
        return (
          <div className="flex items-center gap-2">
            <span className="text-warning-600 font-medium text-sm">In progress</span>
            <span className="text-warning-600 font-bold text-sm">{progress}%</span>
            <Loader2 className="h-5 w-5 text-warning-500 animate-spin" />
          </div>
        )
      case "not_started":
      default:
        return isGlobalFirstNotStarted ? (
          <Button
            onClick={onClick}
            variant="outline"
            className="rounded-full border-primary-300 text-primary-700 hover:bg-primary-50 bg-transparent"
          >
            Get started
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">Learning</span>
        )
    }
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium text-foreground mb-1">{title}</h4>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock className="h-3 w-3" />
          <span>{duration}</span>
          {status === "not_started" && !isGlobalFirstNotStarted && <span>Learning</span>}
        </div>
      </div>
      <div>{getStatusDisplay()}</div>
    </div>
  )
}
