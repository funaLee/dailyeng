import ProfilePageClient from "@/components/page/ProfilePageClient";

interface ProfileFormData {
  fullName: string;
  email: string;
  dob: string;
  phone: string;
  sex: string;
  address: string;
  level: string;
}

export default async function ProfilePage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  const initialFormData: ProfileFormData = {
    fullName: "Le Thi Thanh Truc",
    email: "tructt@gmail.com",
    dob: "12-03-2005",
    phone: "0123456789",
    sex: "Female",
    address: "ABC Street",
    level: "A1-A2 beginners",
  };

  return <ProfilePageClient initialFormData={initialFormData} />;
}
