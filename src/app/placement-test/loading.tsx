import { Skeleton } from "@/components/ui/skeleton"

export default function PlacementTestLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  )
}
