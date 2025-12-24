import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Skeleton */}
        <Card className="relative mb-8 overflow-hidden rounded-3xl border-[1.4px] border-primary-200 bg-white p-8">
          <div className="relative z-10 flex h-full max-w-full flex-col justify-center md:max-w-[60%]">
            <Skeleton className="h-10 w-64 mb-4 bg-gray-200" />
            <Skeleton className="h-5 w-full max-w-md mb-2 bg-gray-100" />
            <Skeleton className="h-5 w-3/4 max-w-sm mb-6 bg-gray-100" />
            <div className="flex gap-3 mb-4">
              <Skeleton className="h-10 w-32 rounded-md bg-gray-200" />
              <Skeleton className="h-10 w-32 rounded-md bg-gray-200" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-40 bg-gray-100" />
              <Skeleton className="h-8 w-20 rounded-md bg-gray-200" />
            </div>
          </div>
          {/* Hero image placeholder */}
          <div className="absolute bottom-0 right-0 top-0 w-1/2 md:w-[55%]">
            <Skeleton className="h-full w-full bg-gray-100" />
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-gray-200 pb-0">
          <div className="flex gap-8 overflow-x-auto pb-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-28 mb-3 bg-gray-200" />
            ))}
          </div>
          <div className="flex-1" />
          <Skeleton className="h-9 w-64 rounded-full bg-gray-200" />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Skeletons */}
          <div className="lg:col-span-1 space-y-6">
            {/* Topic Groups Sidebar Skeleton */}
            <Card className="p-6 bg-primary-100 rounded-3xl border-2 border-primary-300 shadow-md">
              <Skeleton className="h-5 w-28 mb-4 bg-gray-300" />
              <div className="space-y-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full px-3 py-2 rounded-lg flex items-center gap-2 bg-white border border-primary-200"
                  >
                    <Skeleton className="h-2 w-2 rounded-full flex-shrink-0 bg-gray-200" />
                    <Skeleton
                      className="h-4 flex-1 bg-gray-200"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Levels Sidebar Skeleton */}
            <Card className="p-6 bg-white rounded-3xl border-2 border-gray-200 shadow-md">
              <Skeleton className="h-5 w-16 mb-4 bg-gray-200" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded bg-gray-200" />
                    <Skeleton className="h-4 w-12 bg-gray-200" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Subcategory Pills Skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 rounded-full bg-gray-200 flex-shrink-0"
                  style={{ width: `${60 + Math.random() * 40}px` }}
                />
              ))}
            </div>

            {/* Topic Cards Grid Skeleton */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <Skeleton className="h-32 w-full rounded-xl mb-4 bg-gray-200" />
                  <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-full mb-1 bg-gray-100" />
                  <Skeleton className="h-4 w-2/3 mb-4 bg-gray-100" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-12 rounded-full bg-gray-200" />
                    <Skeleton className="h-8 w-24 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
