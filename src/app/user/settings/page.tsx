import { getUserProfile } from "@/actions/user";
import SettingsPageClient from "@/components/page/SettingsPageClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { user, isGoogleUser, error } = await getUserProfile();

  if (error || !user) {
    redirect("/auth/signin");
  }

  // Format date for display (DD/MM/YYYY)
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const initialFormData = {
    name: user.name || "",
    email: user.email,
    dateOfBirth: formatDate(user.dateOfBirth),
    phoneNumber: user.phoneNumber || "",
    gender: user.gender || "",
    address: user.address || "",
    level: user.level || "",
  };

  return (
    <SettingsPageClient
      initialFormData={initialFormData}
      isGoogleUser={isGoogleUser}
      userImage={user.image}
    />
  );
}
