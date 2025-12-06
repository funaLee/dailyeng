import CoursesPageClient from "@/components/page/CoursesPageClient";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: "vocabulary" | "grammar";
  status: "sold-out" | "active" | "available";
  rating: number;
  registrations: number;
  expiredDate: string;
}

export default async function RegisteredCoursesPage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  const courses: Course[] = [
    {
      id: "v1",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "vocabulary",
      status: "sold-out",
      rating: 3,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "v2",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "vocabulary",
      status: "sold-out",
      rating: 3,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "v3",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "vocabulary",
      status: "sold-out",
      rating: 3,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "g1",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "grammar",
      status: "sold-out",
      rating: 2,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "g2",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "grammar",
      status: "sold-out",
      rating: 2,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "g3",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "grammar",
      status: "sold-out",
      rating: 2,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
  ];

  return <CoursesPageClient courses={courses} />;
}
