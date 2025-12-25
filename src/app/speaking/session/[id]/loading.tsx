import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, MessageSquare } from "lucide-react";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-20 bg-muted rounded-lg animate-pulse flex items-center gap-2 px-3">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-4 w-8 bg-gray-200" />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Learning Goals */}
        <Card className="p-8 bg-white flex flex-col">
          {/* Learning Goals Section */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <Skeleton className="h-7 w-40 bg-gray-200" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-200" />
                  <Skeleton className="h-14 flex-1 rounded-xl bg-primary-50" />
                </div>
              ))}
            </div>
          </div>

          {/* Context Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-6 w-20 bg-gray-200" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl bg-primary-50" />
          </div>
        </Card>

        {/* Right Column - Scenario Info */}
        <Card className="p-8 bg-white flex flex-col">
          {/* Image Skeleton */}
          <Skeleton className="aspect-video w-full rounded-2xl mb-6 bg-gradient-to-br from-primary-100 to-primary-200" />

          {/* Title and Description */}
          <div className="flex-1 flex flex-col">
            <Skeleton className="h-9 w-3/4 mb-4 bg-gray-200" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full bg-gray-100" />
              <Skeleton className="h-4 w-full bg-gray-100" />
              <Skeleton className="h-4 w-2/3 bg-gray-100" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <Skeleton className="flex-1 h-14 rounded-lg bg-primary-200" />
              <Skeleton className="w-14 h-14 rounded-lg bg-gray-200" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
