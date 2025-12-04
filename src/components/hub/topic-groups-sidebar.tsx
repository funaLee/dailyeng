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
    <Card className="p-6 bg-primary-100 rounded-3xl border-[1.4px] border-primary-200 shadow-md">
      <h3 className="font-bold text-lg mb-5 text-primary-900">{title}</h3>
      <div className="space-y-1.5">
        {groups.map((group) => (
          <button
            key={group.name}
            onClick={() => onGroupChange(group.name, group.subcategories[0])}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-all border ${
              selectedGroup === group.name
                ? "bg-primary-500 font-semibold text-white border-primary-500"
                : "bg-white text-foreground hover:bg-primary-50 hover:border-primary-400 border-primary-200"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full flex-shrink-0 ${
                selectedGroup === group.name ? "bg-white" : "bg-primary-400"
              }`}
            />
            <span className="truncate font-medium">{group.name}</span>
          </button>
        ))}
        {showViewMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-primary-600 mt-2 px-3 hover:bg-primary-200 hover:text-primary-800 cursor-pointer font-medium"
          >
            + View more groups
          </Button>
        )}
      </div>
    </Card>
  )
}
