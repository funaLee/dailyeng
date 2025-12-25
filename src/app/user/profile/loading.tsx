import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Skeleton for UserProfileSidebar
function SidebarSkeleton() {
  return (
    <Card className="border-border border-2 shadow-sm bg-white overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex flex-col items-center mb-6">
          {/* Avatar skeleton */}
          <Skeleton className="w-24 h-24 rounded-full mb-3 bg-gray-200" />
          {/* Name skeleton */}
          <Skeleton className="h-5 w-24 bg-gray-200" />
        </div>

        <div className="border-t border-primary-200 mb-4" />

        <div className="space-y-1">
          {/* Account heading */}
          <Skeleton className="h-3 w-16 mb-2 ml-2 bg-gray-200" />
          {/* Nav items */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <Skeleton className="h-4 w-4 rounded bg-gray-200" />
              <Skeleton className="h-4 flex-1 bg-gray-200" />
            </div>
          ))}
          <div className="my-3 border-t border-slate-200" />
          {/* Sign out */}
          <div className="flex items-center gap-3 px-4 py-2.5">
            <Skeleton className="h-4 w-4 rounded bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Skeleton for StatCard
function StatCardSkeleton({ bgColor = "bg-white" }: { bgColor?: string }) {
  return (
    <Card className={`p-4 border-none shadow-md ${bgColor}`}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 w-20 mb-2 bg-gray-200" />
          <Skeleton className="h-6 w-16 mb-1 bg-gray-300" />
          <Skeleton className="h-3 w-24 bg-gray-100" />
        </div>
      </div>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="md:col-span-3 lg:col-span-3 space-y-6">
          <SidebarSkeleton />
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="md:col-span-9 lg:col-span-9 space-y-6">
          {/* Greeting Banner Skeleton */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-50 to-secondary-50 p-6 shadow-sm border-2 border-border">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                {/* Greeting */}
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-4 w-28 bg-gray-200" />
                </div>
                {/* Welcome text */}
                <Skeleton className="h-8 w-64 mb-2 bg-gray-300" />
                {/* Subtitle */}
                <Skeleton className="h-4 w-80 bg-gray-200" />
              </div>
              {/* Level badge */}
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <Skeleton className="h-3 w-20 mb-2 mx-auto bg-gray-200" />
                <Skeleton className="h-9 w-10 mx-auto bg-gray-300" />
              </div>
            </div>
          </div>

          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-3 gap-4">
            <StatCardSkeleton bgColor="bg-gradient-to-br from-yellow-50 to-orange-50" />
            <StatCardSkeleton bgColor="bg-gradient-to-br from-orange-50 to-red-50" />
            <StatCardSkeleton bgColor="bg-gradient-to-br from-accent-50 to-emerald-50" />
          </div>

          {/* Heatmap Skeleton */}
          <Card className="border-2 border-border shadow-md bg-white p-6">
            <div className="w-full">
              {/* Stats Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-12 bg-gray-300" />
                  <Skeleton className="h-4 w-36 bg-gray-200" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20 bg-gray-100" />
                    <Skeleton className="h-4 w-8 bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 bg-gray-100" />
                    <Skeleton className="h-4 w-6 bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-flex flex-col gap-1 min-w-full">
                  {/* Grid placeholder */}
                  <div className="flex gap-[3px]">
                    <div className="pr-2 w-8" />
                    {Array.from({ length: 53 }).map((_, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-[3px]">
                        {Array.from({ length: 7 }).map((_, dayIdx) => (
                          <Skeleton
                            key={`${weekIdx}-${dayIdx}`}
                            className="w-[11px] h-[11px] rounded-[3px] bg-[#ebedf0]"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <Skeleton className="h-3 w-8 bg-gray-100" />
                <div className="flex gap-[2px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[11px] h-[11px] rounded-[3px] bg-[#ebedf0]"
                    />
                  ))}
                </div>
                <Skeleton className="h-3 w-8 bg-gray-100" />
              </div>
            </div>
          </Card>

          {/* Quote Skeleton */}
          <Card className="border-2 border-border shadow-md bg-white p-8">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="w-10 h-10 rounded-full mb-4 bg-gray-200" />
              <Skeleton className="h-5 w-full max-w-lg mb-2 bg-gray-200" />
              <Skeleton className="h-5 w-3/4 max-w-md mb-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-[2px] bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-300" />
                <Skeleton className="w-8 h-[2px] bg-gray-200" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
