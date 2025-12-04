"use client";

import { Card } from "@/components/ui/card";
import { LessonCard } from "./lesson-card";

interface Lesson {
  id: string;
  title: string;
  duration?: string;
  status: "not_started" | "in_progress" | "completed";
  progress?: number;
  score?: number;
}

interface LessonGroupProps {
  title: string;
  lessons: Lesson[];
  onLessonClick?: (lessonId: string) => void;
}

export function LessonGroup({
  title,
  lessons,
  onLessonClick,
}: LessonGroupProps) {
  // Find first not_started lesson to show "Get started" button
  const firstNotStartedIndex = lessons.findIndex(
    (l) => l.status === "not_started"
  );

  return (
    <Card className="rounded-3xl border-2 border-primary-100 bg-card overflow-hidden">
      <div className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
        <div className="border-t-2 border-secondary-300 mb-4" />
        <div className="space-y-0">
          {lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              {...lesson}
              onClick={() => onLessonClick?.(lesson.id)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
