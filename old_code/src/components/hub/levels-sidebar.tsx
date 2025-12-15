"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

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
    <Card className="p-6 bg-primary-100 rounded-3xl border-2 border-primary-300 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg text-primary-900">{title}</h3>
        <Badge className="text-xs bg-primary-500 text-white border-0 px-3 py-1">{badgeLabel}</Badge>
      </div>
      <div className="space-y-1.5">
        <button
          onClick={() => onLevelToggle("All")}
          className={`w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg text-sm transition-all border ${selectedLevels.length === levels.length
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-white text-foreground hover:bg-primary-50 hover:border-primary-400 border-primary-200"
            }`}
        >
          <div
            className={`h-4 w-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${selectedLevels.length === levels.length ? "bg-white" : "border border-primary-300 bg-transparent"
              }`}
          >
            {selectedLevels.length === levels.length && <Check className="h-3 w-3 text-primary-500" />}
          </div>
          <span className="font-medium">All Levels</span>
        </button>

        {levels.map((level) => {
          const isSelected = selectedLevels.includes(level)
          return (
            <button
              key={level}
              onClick={() => onLevelToggle(level)}
              className={`w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg text-sm transition-all border ${isSelected
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-foreground hover:bg-primary-50 hover:border-primary-400 border-primary-200"
                }`}
            >
              <div
                className={`h-4 w-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "bg-white" : "border border-primary-300 bg-transparent"
                  }`}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-500" />}
              </div>
              <span className="font-medium">{level} CEFR</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
