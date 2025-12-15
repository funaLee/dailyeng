import ResetPasswordPageClient from "@/components/page/ResetPasswordPageClient";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token || "";

  return <ResetPasswordPageClient token={token} />;
}
