"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Course {
  id: string
  name: string
  description: string
  estimatedCompletion?: string
  progress?: number
}

interface CoursesSidebarProps {
  courses: Course[]
  selectedCourse: string
  onCourseChange: (courseId: string) => void
  onAddCourse?: () => void
  title?: string
}

export function CoursesSidebar({
  courses,
  selectedCourse,
  onCourseChange,
  onAddCourse,
  title = "Courses",
}: CoursesSidebarProps) {
  return (
    <Card className="p-5 bg-[#F0F9FF] dark:bg-slate-900 rounded-3xl border-2 border-blue-100 dark:border-blue-900/50 shadow-sm">
      <h3 className="font-bold text-base mb-4 text-blue-900 dark:text-blue-100">{title}</h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <label key={course.id} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="radio"
                name="course"
                checked={selectedCourse === course.id}
                onChange={() => onCourseChange(course.id)}
                className="peer h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                selectedCourse === course.id
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-slate-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
              }`}
            >
              {course.name}
            </span>
          </label>
        ))}
      </div>
      {onAddCourse && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 text-xs cursor-pointer bg-transparent"
          onClick={onAddCourse}
        >
          Add Course
        </Button>
      )}
    </Card>
  )
}
