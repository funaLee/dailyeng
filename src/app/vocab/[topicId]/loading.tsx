import { ProtectedRoute } from "@/components/auth/protected-route";

export default function Loading() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    </ProtectedRoute>
  );
}
