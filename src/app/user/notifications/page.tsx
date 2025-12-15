import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotifications } from "@/actions/notification";
import NotificationsPageClient from "@/components/page/NotificationsPageClient";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Fetch initial notifications from database
  const result = await getNotifications(session.user.id, {
    page: 1,
    limit: 10,
    sortOrder: "newest",
  });

  return (
    <NotificationsPageClient
      notifications={result.notifications}
      totalPages={result.totalPages}
      currentPage={result.currentPage}
      unreadCount={result.unreadCount}
      userName={session.user.name || "User"}
      userId={session.user.id}
    />
  );
}
