import { notFound } from "next/navigation";
import { getVocabTopicById, getCourseData } from "@/lib/data/vocab";
import { TopicDetailDashboard } from "@/components/vocab/topic-detail-dashboard";

interface PageProps {
  params: {
    topicId: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const topic = await getVocabTopicById(params.topicId);
  if (!topic) return { title: "Topic Not Found" };

  return {
    title: `${topic.title} | Vocabulary Hub`,
    description: topic.description,
  };
}

export default async function TopicDetailPage({ params }: PageProps) {
  const topic = await getVocabTopicById(params.topicId);

  if (!topic) {
    notFound();
  }

  const { courseData, subTopicLessons, lessonGrades, skillScores, courseInfo } =
    await getCourseData(params.topicId);

  return (
    <TopicDetailDashboard
      topic={topic}
      courseData={courseData}
      subTopicLessons={subTopicLessons}
      lessonGrades={lessonGrades}
      skillScores={skillScores}
      courseInfo={courseInfo}
    />
  );
}
