import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

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

// Skeleton for notification card
function NotificationCardSkeleton() {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-40 bg-gray-200" />
              <Skeleton className="h-5 w-20 rounded-full bg-gray-100" />
            </div>
            <Skeleton className="h-4 w-full mb-1 bg-gray-100" />
            <Skeleton className="h-4 w-3/4 bg-gray-100" />
          </div>
          <div className="text-right flex flex-col items-end gap-1 shrink-0">
            <Skeleton className="h-3 w-16 bg-gray-100" />
            <Skeleton className="h-3 w-12 bg-gray-200" />
            <Skeleton className="h-3 w-20 bg-gray-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          <SidebarSkeleton />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header Card */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-48 bg-gray-200" />
                <Skeleton className="h-6 w-20 rounded-full bg-primary/20" />
              </div>
            </CardContent>
          </Card>

          {/* Notifications List Container */}
          <div className="space-y-4 bg-white p-10 border-border border-2 shadow-sm rounded-2xl">
            {/* Title */}
            <Skeleton className="h-6 w-44 bg-gray-200" />

            {/* Search and Sort Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Skeleton className="h-10 w-full rounded-md bg-gray-100" />
              </div>
              <Skeleton className="h-10 w-28 rounded-md bg-gray-100" />
            </div>

            {/* Notification Cards */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationCardSkeleton key={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Skeleton className="h-9 w-9 rounded-md bg-gray-100" />
              <Skeleton className="h-9 w-9 rounded-md bg-primary/30" />
              <Skeleton className="h-9 w-9 rounded-md bg-gray-100" />
              <Skeleton className="h-9 w-9 rounded-md bg-gray-100" />
              <Skeleton className="h-9 w-9 rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
