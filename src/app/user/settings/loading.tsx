import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Skeleton for UserProfileSidebar with upload button indicator
function SidebarSkeleton() {
  return (
    <Card className="border-border border-2 shadow-sm bg-white overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex flex-col items-center mb-6">
          {/* Avatar skeleton with upload button */}
          <div className="relative">
            <Skeleton className="w-24 h-24 rounded-full mb-3 bg-gray-200" />
            <Skeleton className="absolute bottom-2 right-0 w-8 h-8 rounded-full bg-primary/30" />
          </div>
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

// Skeleton for form input field
function FormFieldSkeleton({ hasIcon = true }: { hasIcon?: boolean }) {
  return (
    <div>
      <Skeleton className="h-4 w-24 mb-2 bg-gray-200" />
      <div className="relative">
        {hasIcon && (
          <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded bg-gray-200" />
        )}
        <Skeleton
          className={`h-10 w-full rounded-md bg-gray-100 ${
            hasIcon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
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
          <Card className="border-border shadow-sm bg-white">
            <CardContent className="p-8">
              {/* Tabs */}
              <div className="flex gap-8 mb-8 border-b border-border">
                <Skeleton className="h-6 w-40 mb-3 bg-gray-200" />
                <Skeleton className="h-6 w-36 mb-3 bg-gray-100" />
              </div>

              {/* Form Fields - 2 column grid */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <FormFieldSkeleton />
                  {/* Email */}
                  <FormFieldSkeleton />
                  {/* Date of Birth */}
                  <FormFieldSkeleton />
                  {/* Phone Number */}
                  <FormFieldSkeleton />
                  {/* Gender */}
                  <div>
                    <Skeleton className="h-4 w-12 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 w-[180px] rounded-md bg-gray-100" />
                  </div>
                  {/* Level */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 w-[200px] rounded-md bg-gray-100" />
                  </div>
                </div>

                {/* Address - full width */}
                <div>
                  <Skeleton className="h-4 w-16 mb-2 bg-gray-200" />
                  <Skeleton className="h-10 w-full rounded-md bg-gray-100" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Skeleton className="h-10 w-32 rounded-md bg-primary/30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
