"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface HubHeroProps {
  title: string
  description: string
  primaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  notification?: {
    text: string
    actionLabel: string
    onClick?: () => void
  }
  decorativeWords?: string[]
  children?: ReactNode
}

export function HubHero({
  title,
  description,
  primaryAction,
  secondaryAction,
  notification,
  decorativeWords = ["vocabulary", "learning", "mastery"],
}: HubHeroProps) {
  return (
    <Card className="p-8 mb-8 relative overflow-hidden rounded-3xl border-2 border-blue-100 dark:border-blue-900/50">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {primaryAction && <Button className="gap-2 cursor-pointer">{primaryAction.label}</Button>}
          {secondaryAction && (
            <Button variant="outline" className="gap-2 bg-transparent cursor-pointer">
              {secondaryAction.label}
            </Button>
          )}
        </div>
        {notification && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{notification.text}</span>
            <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
              {notification.actionLabel}
            </Button>
          </div>
        )}
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-blue-200/50 to-blue-400/30 rounded-lg pointer-events-none">
        {decorativeWords[0] && (
          <div className="absolute right-12 top-12 text-blue-600/20 text-6xl font-bold rotate-12">
            {decorativeWords[0]}
          </div>
        )}
        {decorativeWords[1] && (
          <div className="absolute right-24 top-32 text-blue-600/20 text-5xl font-bold -rotate-6">
            {decorativeWords[1]}
          </div>
        )}
        {decorativeWords[2] && (
          <div className="absolute right-8 top-52 text-blue-600/20 text-4xl font-bold rotate-3">
            {decorativeWords[2]}
          </div>
        )}
      </div>
    </Card>
  )
}
