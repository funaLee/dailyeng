"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TopicHeader,
  CourseOutlineSidebar,
  LessonsContentView,
  GradesView,
  CourseInfoView,
} from "@/components/hub";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  progress?: number;
}

interface LessonGroupData {
  id: string;
  title: string;
  type:
    | "vocabulary"
    | "translate"
    | "listening"
    | "reading"
    | "writing"
    | "quiz";
  lessons: Lesson[];
}

interface CourseTopic {
  id: string;
  title: string;
  isExpanded?: boolean;
  colorVariant?: "pink" | "blue" | "teal";
  subTopics: { id: string; title: string }[];
}

interface LessonGrade {
  id: string;
  title: string;
  type: string;
  score: number | null;
  status: "not_started" | "in_progress" | "completed";
}

interface SkillScore {
  skill: string;
  score: number;
  fullMark: number;
}

interface CourseInfoTopic {
  id: string;
  title: string;
  description: string;
  subTopics: {
    id: string;
    title: string;
    description: string;
    lessons: {
      id: string;
      title: string;
      description: string;
      duration: string;
      type: string;
    }[];
  }[];
}

interface CourseInfo {
  courseName: string;
  courseDescription: string;
  totalHours: string;
  totalLessons: number;
  totalTopics: number;
  totalSubTopics: number;
  level: string;
  targetAudience: string;
  objectives: string[];
  topics: CourseInfoTopic[];
}

interface TopicData {
  id: string;
  title: string;
  description: string;
  level: string;
  thumbnail?: string;
}

interface VocabTopicPageClientProps {
  topicId: string;
  topic: TopicData;
  vocab: any[];
  courseData: {
    courseName: string;
    topics: CourseTopic[];
  };
  subTopicLessons: Record<string, LessonGroupData[]>;
  lessonGrades: LessonGrade[];
  skillScores: SkillScore[];
  courseInfo: CourseInfo;
}

export default function VocabTopicPageClient({
  topicId,
  topic,
  vocab,
  courseData,
  subTopicLessons,
  lessonGrades,
  skillScores,
  courseInfo,
}: VocabTopicPageClientProps) {
  const router = useRouter();
  const [activeSubTopic, setActiveSubTopic] = useState<string>("dogs");
  const [activeView, setActiveView] = useState<"outline" | "grades" | "info">(
    "outline"
  );

  const handleSubTopicSelect = (subTopicId: string) => {
    setActiveSubTopic(subTopicId);
    setActiveView("outline");
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/vocab/${topicId}/lesson/${lessonId}`);
  };

  const handleViewChange = (view: "outline" | "grades" | "info") => {
    setActiveView(view);
  };

  const getCurrentSubTopicTitle = () => {
    for (const topic of courseData.topics) {
      const subTopic = topic.subTopics.find((st) => st.id === activeSubTopic);
      if (subTopic) return subTopic.title;
    }
    return "Lessons";
  };

  const getCurrentLessonGroups = () => {
    return subTopicLessons[activeSubTopic] || [];
  };

  if (!topic) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-96 bg-muted animate-pulse rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  const wordCount = vocab.length || 12;

  const renderRightContent = () => {
    switch (activeView) {
      case "grades":
        return (
          <GradesView
            lessonGrades={lessonGrades}
            skillScores={skillScores}
            overallProgress={12}
            averageScore={85}
          />
        );
      case "info":
        return (
          <CourseInfoView
            courseName={courseInfo.courseName}
            courseDescription={courseInfo.courseDescription}
            totalHours={courseInfo.totalHours}
            totalLessons={courseInfo.totalLessons}
            totalTopics={courseInfo.totalTopics}
            totalSubTopics={courseInfo.totalSubTopics}
            level={courseInfo.level}
            targetAudience={courseInfo.targetAudience}
            objectives={courseInfo.objectives}
            topics={courseInfo.topics}
          />
        );
      case "outline":
      default:
        return (
          <LessonsContentView
            subTopicTitle={getCurrentSubTopicTitle()}
            lessonGroups={getCurrentLessonGroups()}
            onLessonClick={handleStartLesson}
          />
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Header */}
        <TopicHeader
          title={topic.title}
          description={topic.description}
          wordCount={wordCount}
          duration="30 mins"
          levels={topic.level === "A2" ? ["A2"] : [topic.level, "A2"]}
          backUrl="/vocab"
          backLabel="Back to Topic"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar - Course Outline (only topics and sub-topics) */}
          <div className="lg:col-span-1">
            <CourseOutlineSidebar
              courseName={courseData.courseName}
              topics={courseData.topics}
              activeSubTopic={activeSubTopic}
              onSubTopicSelect={handleSubTopicSelect}
              showGrades={true}
              showInfo={true}
              activeView={activeView}
              onViewChange={handleViewChange}
            />
          </div>

          {/* Right Content - Dynamic based on activeView */}
          <div className="lg:col-span-3">{renderRightContent()}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
