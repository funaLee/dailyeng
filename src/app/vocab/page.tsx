import VocabPageClient from "@/components/page/VocabPageClient";
import { auth } from "@/lib/auth";

export default async function VocabPage() {
  // Get user from auth session
  const session = await auth();
  const userId = session?.user?.id;

  // Client handles all data fetching with skeleton loading
  // Unauthenticated users will see block UI from ProtectedRoute
  return <VocabPageClient userId={userId || ""} />;
}

