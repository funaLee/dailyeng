"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface TopicCardProps {
  id: string
  title: string
  description: string
  level: string
  wordCount?: number
  thumbnail?: string
  progress?: number
  href?: string
  onNotYet?: () => void
  type?: "vocabulary" | "grammar" | "speaking"
}

export function TopicCard({
  id,
  title,
  description,
  level,
  wordCount = 25,
  thumbnail = "/learning.png",
  progress = 0,
  href,
  onNotYet,
  type = "vocabulary",
}: TopicCardProps) {
  const isCompleted = progress === 100
  const isInProgress = progress > 0 && progress < 100

  const getButtonLabel = () => {
    if (isCompleted) return "Review"
    if (isInProgress) return "Continue"
    return "Start Learning"
  }

  const getCountLabel = () => {
    switch (type) {
      case "vocabulary":
        return `${wordCount} words`
      case "grammar":
        return `${wordCount} lessons`
      case "speaking":
        return `${wordCount} min`
      default:
        return `${wordCount} words`
    }
  }

  const cardContent = (
    <Card className="group relative overflow-hidden rounded-3xl border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-950 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 flex flex-col">
      <div className="p-3 pb-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="p-4 pt-3 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Badge className="text-[10px] px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 font-medium">
            {level}
          </Badge>
          <Badge className="text-[10px] px-2 py-0.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-800 font-medium">
            {getCountLabel()}
          </Badge>
        </div>

        <h4 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          <Button
            className={`flex-1 h-9 rounded-full font-semibold text-xs cursor-pointer transition-all ${
              isCompleted
                ? "bg-secondary-100 hover:bg-secondary-200 text-secondary-700 dark:bg-secondary-900/30 dark:hover:bg-secondary-900/50 dark:text-secondary-400"
                : "bg-primary-100 hover:bg-primary-200 text-primary-700 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 dark:text-primary-400"
            }`}
          >
            {getButtonLabel()}
          </Button>
          {onNotYet && (
            <Button
              variant="outline"
              className="h-9 px-3 rounded-full font-semibold text-xs cursor-pointer border-error-200 dark:border-error-800 text-error-500 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 hover:border-error-300 dark:hover:border-error-700 transition-all bg-transparent"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onNotYet()
              }}
            >
              Not yet
            </Button>
          )}
        </div>
      </div>
    </Card>
  )

  if (href) {
    return <Link href={href}>{cardContent}</Link>
  }

  return cardContent
}
