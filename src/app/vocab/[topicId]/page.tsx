
import { auth } from "@/lib/auth";
import VocabTopicPageClient from "@/components/page/VocabTopicPageClient";
import { getVocabTopicById } from "@/actions/vocab";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { topicId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const data = await getVocabTopicById(topicId, userId);

  if (!data) {
    notFound();
  }

  const { vocab, ...topic } = data;

  return (
    <VocabTopicPageClient
      topicId={topicId}
      topic={topic}
      vocab={vocab}
    />
  );
}
