"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

interface LevelsSidebarProps {
  selectedLevels: string[]
  onLevelToggle: (level: string) => void
  levels?: string[]
  title?: string
  badgeLabel?: string
}

export function LevelsSidebar({
  selectedLevels,
  onLevelToggle,
  levels = CEFR_LEVELS,
  title = "Levels",
  badgeLabel = "CEFR",
}: LevelsSidebarProps) {
  return (
    <Card className="p-5 bg-primary-50 rounded-3xl border-[1.4px] border-primary-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-primary-900">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {badgeLabel}
        </Badge>
      </div>
      <div className="space-y-2.5">
        {levels.map((level) => (
          <label
            key={level}
            className="flex items-center gap-3 cursor-pointer group hover:bg-primary-100 p-1.5 rounded-md text-sm transition-colors -mx-1.5"
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => onLevelToggle(level)}
                className="peer h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-800">{level} CEFR</span>
          </label>
        ))}
      </div>
    </Card>
  )
}
