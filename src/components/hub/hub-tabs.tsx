"use client"

interface Tab {
  id: string
  label: string
}

interface HubTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function HubTabs({ tabs, activeTab, onTabChange }: HubTabsProps) {
  return (
    <div className="mb-8 flex items-center border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-4 text-lg font-bold transition-colors cursor-pointer ${
            activeTab === tab.id
              ? "border-b-2 border-primary-500 text-primary-600"
              : "border-b-2 border-transparent text-muted-foreground hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
