"use client"

import { Card } from "@/components/ui/card"

interface HeatmapDay {
  date: Date
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface StudyHeatmapProps {
  data: HeatmapDay[]
}

export function StudyHeatmap({ data }: StudyHeatmapProps) {
  // Generate last 365 days
  const today = new Date()
  const days: HeatmapDay[] = []
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const existingDay = data.find(d => 
      d.date.toDateString() === date.toDateString()
    )
    days.push(existingDay || { date, count: 0, level: 0 })
  }

  // Group by weeks
  const weeks: HeatmapDay[][] = []
  let currentWeek: HeatmapDay[] = []
  
  days.forEach((day, index) => {
    currentWeek.push(day)
    if (day.date.getDay() === 6 || index === days.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  const levelColors = {
    0: "bg-gray-100 dark:bg-gray-800",
    1: "bg-blue-200 dark:bg-blue-900",
    2: "bg-blue-400 dark:bg-blue-700",
    3: "bg-blue-600 dark:bg-blue-500",
    4: "bg-blue-800 dark:bg-blue-300",
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Study Activity</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-1 ml-8 mb-1">
            {months.map((month, i) => (
              <div key={i} className="text-xs text-muted-foreground w-12">
                {month}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 justify-around text-xs text-muted-foreground mr-1">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>
            
            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${levelColors[day.level]} transition-colors hover:ring-2 hover:ring-blue-400`}
                      title={`${day.date.toLocaleDateString()}: ${day.count} activities`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${levelColors[level as 0 | 1 | 2 | 3 | 4]}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
