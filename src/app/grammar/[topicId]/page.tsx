import GrammarTopicPageClient from "@/components/page/GrammarTopicPageClient";
import { getGrammarTopicById } from "@/actions/grammar";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function GrammarTopicPage({ params }: PageProps) {
  const { topicId } = await params;

  // Fetch topic from database with caching
  const topic = await getGrammarTopicById(topicId);

  // Return 404 if topic not found
  if (!topic) {
    notFound();
  }

  return (
    <GrammarTopicPageClient
      topicId={topicId}
      topic={{
        id: topic.id,
        title: topic.title,
        description: topic.description,
        level: topic.level,
      }}
      grammarNotes={topic.grammarNotes}
    />
  );
}
