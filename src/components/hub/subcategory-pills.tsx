"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";

interface SubcategoryPillsProps {
  subcategories: string[];
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
  isLoading?: boolean;
}

export function SubcategoryPills({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  isLoading = false,
}: SubcategoryPillsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Skeleton pills */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-10 rounded-full bg-gray-200"
            style={{ width: `${60 + Math.random() * 40}px` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* All option */}
      <Button
        variant={selectedSubcategory === "All" ? "default" : "outline"}
        size="default"
        onClick={() => onSubcategoryChange("All")}
        className="rounded-full"
      >
        All
      </Button>
      {subcategories.map((subcat) => (
        <Button
          key={subcat}
          variant={selectedSubcategory === subcat ? "default" : "outline"}
          size="default"
          onClick={() => onSubcategoryChange(subcat)}
          className="rounded-full"
        >
          {subcat}
        </Button>
      ))}
    </div>
  );
}
