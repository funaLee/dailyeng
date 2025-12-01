"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface TopicGroup {
  name: string
  subcategories: string[]
}

interface TopicGroupsSidebarProps {
  groups: TopicGroup[]
  selectedGroup: string
  onGroupChange: (groupName: string, firstSubcategory: string) => void
  title?: string
  showViewMore?: boolean
}

export function TopicGroupsSidebar({
  groups,
  selectedGroup,
  onGroupChange,
  title = "Topic Groups",
  showViewMore = true,
}: TopicGroupsSidebarProps) {
  return (
    <Card className="p-5 bg-primary-50 dark:bg-slate-900 rounded-3xl border-2 border-primary-200 dark:border-primary-800 shadow-sm">
      <h3 className="font-bold text-base mb-4 text-primary-900 dark:text-primary-100">{title}</h3>
      <div className="space-y-1">
        {groups.map((group) => (
          <button
            key={group.name}
            onClick={() => onGroupChange(group.name, group.subcategories[0])}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-3 cursor-pointer ${
              selectedGroup === group.name
                ? "bg-white dark:bg-slate-800 font-semibold text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200 dark:border-primary-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-slate-800 hover:text-primary-700 dark:hover:text-primary-300"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full flex-shrink-0 ${
                selectedGroup === group.name ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
            <span className="truncate">{group.name}</span>
          </button>
        ))}
        {showViewMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground mt-2 px-2 hover:bg-transparent hover:text-primary cursor-pointer"
          >
            + View more groups
          </Button>
        )}
      </div>
    </Card>
  )
}
