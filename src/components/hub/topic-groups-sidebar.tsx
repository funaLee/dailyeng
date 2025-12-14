"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";

export interface TopicGroup {
  name: string;
  subcategories: string[];
}

interface TopicGroupsSidebarProps {
  groups: TopicGroup[];
  selectedGroup: string;
  onGroupChange: (groupName: string, firstSubcategory: string) => void;
  title?: string;
  showViewMore?: boolean;
  isLoading?: boolean;
}

export function TopicGroupsSidebar({
  groups,
  selectedGroup,
  onGroupChange,
  title = "Topic Groups",
  showViewMore = true,
  isLoading = false,
}: TopicGroupsSidebarProps) {
  return (
    <Card className="p-6 bg-primary-100 rounded-3xl border-2 border-primary-300 shadow-md">
      <h3 className="font-bold text-lg mb-0 text-primary-900">{title}</h3>
      <div className="space-y-1.5">
        {isLoading ? (
          // Skeleton loading state
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-full px-3 py-2 rounded-lg flex items-center gap-2 bg-white border border-primary-200"
              >
                <Skeleton className="h-2 w-2 rounded-full flex-shrink-0" />
                <Skeleton
                  className="h-4 flex-1"
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
              </div>
            ))}
          </>
        ) : (
          groups.map((group) => (
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
          ))
        )}
        {showViewMore && !isLoading && (
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
  );
}
