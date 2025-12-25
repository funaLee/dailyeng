import { Suspense } from "react";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";
import { HubHero } from "@/components/hub";
import { auth } from "@/lib/auth";
import { GrammarContent, GrammarContentSkeleton } from "./grammar-content";

export default async function GrammarPage() {
  // Get user session first (fast operation)
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <ProtectedRoute
      pageName="Grammar Hub"
      pageDescription="Master English grammar with structured lessons and practice exercises."
      pageIcon={PageIcons.grammar}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Static Hero - renders immediately */}
        <HubHero
          title="GRAMMAR HUB"
          description="Master English grammar with structured lessons."
          imageSrc="/hero-grammar.jpg"
          primaryAction={{ label: "Build Study Plan" }}
          secondaryAction={{ label: "Choose Learning Topic" }}
          notification={{
            text: "Today's lessons: 5 lessons",
            actionLabel: "Review now",
          }}
          decorativeWords={["grammar", "structure", "syntax"]}
        />

        {/* Dynamic Content - streamed with Suspense */}
        <Suspense fallback={<GrammarContentSkeleton />}>
          <GrammarContent userId={userId} />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
