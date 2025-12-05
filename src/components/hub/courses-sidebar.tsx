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
    <Card className="p-6 bg-primary-100 rounded-3xl border-2 border-primary-300 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-primary-900">{title}</h3>
      <div className="space-y-2">
        {courses.map((course) => (
          <Button
            key={course.id}
            variant="ghost"
            onClick={() => onCourseChange(course.id)}
            className={`w-full justify-start py-2 px-3 text-sm font-medium rounded-xl cursor-pointer transition-all ${
              selectedCourse === course.id
                ? "bg-primary-500 text-white border-[1.4px] border-primary-500 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.3)]"
                : "bg-white text-slate-700 border-[1.4px] border-primary-200 hover:border-primary-400 hover:text-primary-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-3 transition-colors ${
                selectedCourse === course.id ? "bg-white" : "bg-primary-300"
              }`}
            />
            {course.name}
          </Button>
        ))}
      </div>
      {onAddCourse && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 text-xs cursor-pointer"
          onClick={onAddCourse}
        >
          Add Course
        </Button>
      )}
    </Card>
  )
}
