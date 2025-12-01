"use client"

interface SubcategoryPillsProps {
  subcategories: string[]
  selectedSubcategory: string
  onSubcategoryChange: (subcategory: string) => void
}

export function SubcategoryPills({ subcategories, selectedSubcategory, onSubcategoryChange }: SubcategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {subcategories.map((subcat) => (
        <button
          key={subcat}
          onClick={() => onSubcategoryChange(subcat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
            selectedSubcategory === subcat
              ? "bg-blue-400 text-white border-blue-400 shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          }`}
        >
          {subcat}
        </button>
      ))}
    </div>
  )
}
