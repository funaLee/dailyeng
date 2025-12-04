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
import type { Topic } from "@/types";
import { mockVocab } from "@/lib/mock-data";

interface TopicDetailDashboardProps {
  topic: Topic;
  courseData: any;
  subTopicLessons: any;
  lessonGrades: any;
  skillScores: any;
  courseInfo: any;
}

export function TopicDetailDashboard({
  topic,
  courseData,
  subTopicLessons,
  lessonGrades,
  skillScores,
  courseInfo,
}: TopicDetailDashboardProps) {
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
    router.push(`/vocab/${topic.id}/lesson/${lessonId}`);
  };

  const handleViewChange = (view: "outline" | "grades" | "info") => {
    setActiveView(view);
  };

  const getCurrentSubTopicTitle = () => {
    for (const t of courseData.topics) {
      const subTopic = t.subTopics.find(
        (st: any) => st.id === activeSubTopic
      );
      if (subTopic) return subTopic.title;
    }
    return "Lessons";
  };

  const getCurrentLessonGroups = () => {
    return subTopicLessons[activeSubTopic] || [];
  };

  const vocab = mockVocab[topic.id] || [];
  const wordCount = vocab.length || topic.wordCount || 12;

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
          duration={`${topic.estimatedTime} mins`}
          levels={[topic.level, "A2"]}
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
