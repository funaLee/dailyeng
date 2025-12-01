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
    <Card className="group relative overflow-hidden rounded-3xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-950 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 flex flex-col">
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
          <Badge className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-medium">
            {level}
          </Badge>
          <Badge className="text-[10px] px-2 py-0.5 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 font-medium">
            {getCountLabel()}
          </Badge>
        </div>

        <h4 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          <Button
            className={`flex-1 h-9 rounded-full font-semibold text-xs cursor-pointer transition-all ${
              isCompleted
                ? "bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-400"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400"
            }`}
          >
            {getButtonLabel()}
          </Button>
          {onNotYet && (
            <Button
              variant="outline"
              className="h-9 px-3 rounded-full font-semibold text-xs cursor-pointer border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all bg-transparent"
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
