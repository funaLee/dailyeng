"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BookOpen, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface TopicHeaderProps {
  title: string
  description: string
  wordCount?: number
  duration?: string
  levels?: string[]
  backUrl?: string
  backLabel?: string
}

export function TopicHeader({
  title,
  description,
  wordCount,
  duration = "30 mins",
  levels = ["A1", "A2"],
  backUrl,
  backLabel = "Back to Topic",
}: TopicHeaderProps) {
  const router = useRouter()

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="gap-2 mb-4 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full px-4 shadow-sm"
        onClick={() => (backUrl ? router.push(backUrl) : router.back())}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Button>

      <Card className="p-6 rounded-3xl border-[1.4px] border-primary-200 bg-gradient-to-br from-card via-card to-primary-50/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-200/20 to-primary-200/20 rounded-full" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 border border-primary-100">
              {wordCount && (
                <>
                  <div className="flex items-center gap-1.5 text-primary-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-semibold">{wordCount} words</span>
                  </div>
                  <span className="text-muted-foreground">-</span>
                </>
              )}
              <div className="flex items-center gap-1.5 text-primary-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold">{duration}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {levels.map((level, index) => (
                <span
                  key={level}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                    index === 0
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                      : "bg-white text-foreground border-2 border-primary-200"
                  }`}
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
