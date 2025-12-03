"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Tag } from "@/components/ui/tag"

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
    <Card className="group relative overflow-hidden rounded-3xl border-[1.4px] border-primary-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-primary-300 flex flex-col min-w-[280px] h-[420px]">
      <div className="p-4 pt-0 pb-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="p-5 pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="text-xs px-2.5 py-1 bg-primary-100 text-primary-600 border border-primary-200 font-medium">
            {level}
          </Badge>
          <Badge className="text-xs px-2.5 py-1 bg-secondary-100 text-secondary-600 border border-secondary-200 font-medium">
            {getCountLabel()}
          </Badge>

          {onNotYet && (
            <Tag
              variant="notYet"
              size="md"
              className="ml-auto cursor-pointer hover:bg-error-100 transition-all"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onNotYet()
              }}
            />
          )}
        </div>

        <h4 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
          {title}
        </h4>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed min-h-[2.75rem]">{description}</p>

        <div className="flex items-center gap-3 mt-auto">
          <Button
            className={`flex-1 h-10 rounded-full font-semibold text-sm cursor-pointer transition-all ${
              isCompleted
                ? "bg-secondary-100 hover:bg-secondary-200 text-secondary-700"
                : "bg-primary-100 hover:bg-primary-200 text-primary-700"
            }`}
          >
            {getButtonLabel()}
          </Button>
        </div>
      </div>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="active:translate-y-0.5 active:shadow-sm">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
