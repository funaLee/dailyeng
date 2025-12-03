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
              ? "bg-primary-400 text-white border-primary-400 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50"
          }`}
        >
          {subcat}
        </button>
      ))}
    </div>
  )
}
