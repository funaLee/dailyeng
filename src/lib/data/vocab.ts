import type { Topic } from "@/types";
import {
  mockTopics,
  mockCourseData,
  subTopicLessons,
  mockLessonGrades,
  mockSkillScores,
  mockCourseInfo,
} from "@/lib/mock-data";

export async function getVocabTopics(filters?: {
  level?: string;
  category?: string;
}): Promise<Topic[]> {
  // Using mock data instead of database
  let topics = mockTopics;

  if (filters?.level) {
    topics = topics.filter((t) => t.level === filters.level);
  }

  return topics;
}

export async function getVocabTopicById(id: string): Promise<Topic | null> {
  // Using mock data instead of database
  const topic = mockTopics.find((t) => t.id === id);
  return topic || null;
}

export async function getCourseData(topicId: string) {
  return {
    courseData: mockCourseData,
    subTopicLessons: subTopicLessons,
    lessonGrades: mockLessonGrades,
    skillScores: mockSkillScores,
    courseInfo: mockCourseInfo,
  };
}
