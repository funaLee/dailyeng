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
    <Card className="p-5 bg-primary-50 rounded-3xl border-[1.4px] border-primary-200 shadow-sm">
      <h3 className="font-bold text-base mb-4 text-primary-900">{title}</h3>
      <div className="space-y-1">
        {groups.map((group) => (
          <button
            key={group.name}
            onClick={() => onGroupChange(group.name, group.subcategories[0])}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-3 cursor-pointer ${
              selectedGroup === group.name
                ? "bg-white font-semibold text-primary-700 shadow-sm border border-primary-200"
                : "text-slate-600 hover:bg-primary-100 hover:text-primary-700"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full flex-shrink-0 ${
                selectedGroup === group.name ? "bg-primary-500" : "bg-slate-300"
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
