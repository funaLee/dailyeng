"use client"

import { Button } from "@/components/ui/button"

interface SubcategoryPillsProps {
  subcategories: string[]
  selectedSubcategory: string
  onSubcategoryChange: (subcategory: string) => void
}

export function SubcategoryPills({ subcategories, selectedSubcategory, onSubcategoryChange }: SubcategoryPillsProps) {
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
  )
}
