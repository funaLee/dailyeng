import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6 min-h-[calc(100vh-200px)]">
        {/* Sidebar Skeleton */}
        <aside className="w-72 flex-shrink-0">
          <Card className="p-5 sticky top-20 rounded-2xl border-2 border-primary-100 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-24 bg-gray-200" />
              <Skeleton className="h-5 w-6 rounded-full bg-gray-100" />
            </div>

            {/* Type Filter */}
            <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
              <Skeleton className="flex-1 h-9 rounded-md bg-white" />
              <Skeleton className="flex-1 h-9 rounded-md bg-gray-200" />
            </div>

            {/* Notebook Items */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 border-2 border-transparent"
                >
                  <Skeleton className="h-10 w-10 rounded-lg bg-gray-100" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1 bg-gray-200" />
                    <div className="flex items-center gap-2 mt-0.5">
                      <Skeleton className="h-3 w-14 bg-gray-100" />
                      <Skeleton className="h-3 w-16 bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Notebook Button */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Skeleton className="w-full h-11 rounded-xl bg-gray-100" />
            </div>

            {/* Quick Stats */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Skeleton className="h-4 w-20 mb-3 bg-gray-200" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded bg-gray-100" />
                      <Skeleton className="h-3 w-16 bg-gray-100" />
                    </div>
                    <Skeleton className="h-3 w-8 bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex gap-8 border-b border-gray-200 pb-0">
              <Skeleton className="h-6 w-20 mb-3 bg-gray-200" />
              <Skeleton className="h-6 w-24 mb-3 bg-gray-100" />
              <Skeleton className="h-6 w-20 mb-3 bg-gray-100" />
            </div>
          </div>

          {/* Main Content Area */}
          <Card className="p-6 rounded-2xl border-2 border-primary-100 bg-white flex-1">
            {/* Header Controls */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-48 rounded-full bg-gray-100" />
                <Skeleton className="h-9 w-9 rounded-full bg-gray-100" />
              </div>
            </div>

            {/* Table Header */}
            <div className="border-b-2 border-gray-100 py-3">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-4 bg-gray-100" />
                <Skeleton className="flex-1 h-4 bg-gray-100" />
                <Skeleton className="flex-1 h-4 bg-gray-100" />
                <Skeleton className="w-16 h-4 bg-gray-100" />
                <Skeleton className="w-24 h-4 bg-gray-100" />
                <Skeleton className="w-24 h-4 bg-gray-100" />
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b border-gray-50"
                >
                  <Skeleton className="w-5 h-5 rounded bg-gray-100" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1 bg-gray-200" />
                    <Skeleton className="h-3 w-16 bg-gray-100" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full max-w-48 bg-gray-100" />
                    <Skeleton className="h-3 w-3/4 max-w-36 bg-gray-100" />
                  </div>
                  <Skeleton className="w-10 h-5 rounded bg-gray-100" />
                  <Skeleton className="w-12 h-6 rounded bg-gray-100" />
                  <div className="w-24 flex items-center gap-1 justify-end">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Word Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Skeleton className="w-full h-11 rounded-xl bg-gray-100" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
