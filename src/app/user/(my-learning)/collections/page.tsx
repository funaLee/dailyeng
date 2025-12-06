import CollectionsPageClient from "@/components/page/CollectionsPageClient";

// Types for collection cards
interface DailyCard {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythical" | "ssr";
  theme: string;
  obtainedDate?: string;
  isLocked: boolean;
}

interface GadgetCard {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythical" | "ssr";
  gadgetName: string;
  ability: string;
  obtainedDate?: string;
  isLocked: boolean;
}

interface MovieCharacterCard {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythical" | "ssr";
  movieName: string;
  characterRole: string;
  obtainedDate?: string;
  isLocked: boolean;
}

interface MoviePosterCard {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythical" | "ssr";
  movieTitle: string;
  releaseYear: string;
  obtainedDate?: string;
  isLocked: boolean;
}

interface SSRCollabCard {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythical" | "ssr";
  collabName: string;
  eventPeriod: string;
  setProgress: number;
  setTotal: number;
  obtainedDate?: string;
  isLocked: boolean;
}

export default async function CollectionsPage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  const dailyCards: DailyCard[] = [
    {
      id: "d1",
      name: "Morning Study",
      image: "/learning.png",
      rarity: "common",
      theme: "Morning",
      obtainedDate: "2024-01-15",
      isLocked: false,
    },
    {
      id: "d2",
      name: "Afternoon Practice",
      image: "/learning.png",
      rarity: "common",
      theme: "Afternoon",
      obtainedDate: "2024-01-16",
      isLocked: false,
    },
    {
      id: "d3",
      name: "Evening Review",
      image: "/learning.png",
      rarity: "common",
      theme: "Evening",
      obtainedDate: "2024-01-17",
      isLocked: false,
    },
    {
      id: "d4",
      name: "Weekend Fun",
      image: "/learning.png",
      rarity: "common",
      theme: "Weekend",
      obtainedDate: "2024-01-18",
      isLocked: false,
    },
    {
      id: "d5",
      name: "Rainy Day Study",
      image: "/learning.png",
      rarity: "common",
      theme: "Weather",
      isLocked: true,
    },
    {
      id: "d6",
      name: "Sunny Learning",
      image: "/learning.png",
      rarity: "common",
      theme: "Weather",
      isLocked: true,
    },
    {
      id: "d7",
      name: "Spring Blossom",
      image: "/learning.png",
      rarity: "common",
      theme: "Season",
      obtainedDate: "2024-01-20",
      isLocked: false,
    },
    {
      id: "d8",
      name: "Summer Adventure",
      image: "/learning.png",
      rarity: "common",
      theme: "Season",
      isLocked: true,
    },
    {
      id: "d9",
      name: "Autumn Leaves",
      image: "/learning.png",
      rarity: "common",
      theme: "Season",
      isLocked: true,
    },
    {
      id: "d10",
      name: "Winter Wonder",
      image: "/learning.png",
      rarity: "common",
      theme: "Season",
      isLocked: true,
    },
    {
      id: "d11",
      name: "Birthday Celebration",
      image: "/learning.png",
      rarity: "common",
      theme: "Special",
      obtainedDate: "2024-01-22",
      isLocked: false,
    },
    {
      id: "d12",
      name: "New Year Joy",
      image: "/learning.png",
      rarity: "common",
      theme: "Special",
      obtainedDate: "2024-01-01",
      isLocked: false,
    },
  ];

  const gadgetCards: GadgetCard[] = [
    {
      id: "g1",
      name: "Memory Bread",
      image: "/learning.png",
      rarity: "rare",
      gadgetName: "Memory Bread",
      ability: "Memorize anything instantly",
      obtainedDate: "2024-01-10",
      isLocked: false,
    },
    {
      id: "g2",
      name: "Take-copter",
      image: "/learning.png",
      rarity: "rare",
      gadgetName: "Take-copter",
      ability: "Fly anywhere freely",
      obtainedDate: "2024-01-12",
      isLocked: false,
    },
    {
      id: "g3",
      name: "Anywhere Door",
      image: "/learning.png",
      rarity: "epic",
      gadgetName: "Anywhere Door",
      ability: "Teleport to any location",
      obtainedDate: "2024-01-14",
      isLocked: false,
    },
    {
      id: "g4",
      name: "Time Cloth",
      image: "/learning.png",
      rarity: "epic",
      gadgetName: "Time Cloth",
      ability: "Reverse time on objects",
      isLocked: true,
    },
    {
      id: "g5",
      name: "Translation Konjac",
      image: "/learning.png",
      rarity: "rare",
      gadgetName: "Translation Konjac",
      ability: "Understand any language",
      obtainedDate: "2024-01-08",
      isLocked: false,
    },
    {
      id: "g6",
      name: "Small Light",
      image: "/learning.png",
      rarity: "epic",
      gadgetName: "Small Light",
      ability: "Shrink anything",
      isLocked: true,
    },
    {
      id: "g7",
      name: "Big Light",
      image: "/learning.png",
      rarity: "epic",
      gadgetName: "Big Light",
      ability: "Enlarge anything",
      isLocked: true,
    },
    {
      id: "g8",
      name: "Time Machine",
      image: "/learning.png",
      rarity: "epic",
      gadgetName: "Time Machine",
      ability: "Travel through time",
      isLocked: true,
    },
  ];

  const movieCharacterCards: MovieCharacterCard[] = [
    {
      id: "m1",
      name: "Riruru",
      image: "/learning.png",
      rarity: "legendary",
      movieName: "Steel Troops",
      characterRole: "Robot Princess",
      obtainedDate: "2024-01-05",
      isLocked: false,
    },
    {
      id: "m2",
      name: "Piina",
      image: "/learning.png",
      rarity: "legendary",
      movieName: "Winged Braves",
      characterRole: "Bird Kingdom Princess",
      isLocked: true,
    },
    {
      id: "m3",
      name: "Sofia",
      image: "/learning.png",
      rarity: "legendary",
      movieName: "Great Adventure in South Seas",
      characterRole: "Mermaid Princess",
      isLocked: true,
    },
    {
      id: "m4",
      name: "Kuntakku",
      image: "/learning.png",
      rarity: "legendary",
      movieName: "Animal Planet",
      characterRole: "Dog Soldier",
      obtainedDate: "2024-02-01",
      isLocked: false,
    },
    {
      id: "m5",
      name: "Luca",
      image: "/learning.png",
      rarity: "legendary",
      movieName: "Birth of Japan",
      characterRole: "Primitive Boy",
      isLocked: true,
    },
    {
      id: "m6",
      name: "Miyoko",
      image: "/learning.png",
      rarity: "legendary",
      movieName: "Parallel Planet",
      characterRole: "Parallel World Girl",
      isLocked: true,
    },
  ];

  const moviePosterCards: MoviePosterCard[] = [
    {
      id: "p1",
      name: "Stand By Me",
      image: "/learning.png",
      rarity: "mythical",
      movieTitle: "Stand By Me Doraemon",
      releaseYear: "2014",
      obtainedDate: "2024-01-30",
      isLocked: false,
    },
    {
      id: "p2",
      name: "Nobita's Dinosaur",
      image: "/learning.png",
      rarity: "mythical",
      movieTitle: "Nobita's Dinosaur 2006",
      releaseYear: "2006",
      isLocked: true,
    },
    {
      id: "p3",
      name: "Steel Troops",
      image: "/learning.png",
      rarity: "mythical",
      movieTitle: "Nobita and the Steel Troops",
      releaseYear: "2011",
      isLocked: true,
    },
    {
      id: "p4",
      name: "Space Heroes",
      image: "/learning.png",
      rarity: "mythical",
      movieTitle: "Nobita's Space Heroes",
      releaseYear: "2015",
      isLocked: true,
    },
  ];

  const ssrCollabCards: SSRCollabCard[] = [
    {
      id: "s1",
      name: "Sailor Doraemon",
      image: "/learning.png",
      rarity: "ssr",
      collabName: "Sailor Moon × Doraemon",
      eventPeriod: "Jan 1 - Jan 21, 2024",
      setProgress: 8,
      setTotal: 14,
      obtainedDate: "2024-01-15",
      isLocked: false,
    },
    {
      id: "s2",
      name: "Detective Nobita",
      image: "/learning.png",
      rarity: "ssr",
      collabName: "Conan × Doraemon",
      eventPeriod: "Mar 1 - Mar 21, 2024",
      setProgress: 0,
      setTotal: 14,
      isLocked: true,
    },
    {
      id: "s3",
      name: "Spy Shizuka",
      image: "/learning.png",
      rarity: "ssr",
      collabName: "Spy × Family × Doraemon",
      eventPeriod: "Coming Soon",
      setProgress: 0,
      setTotal: 21,
      isLocked: true,
    },
  ];

  return (
    <CollectionsPageClient
      dailyCards={dailyCards}
      gadgetCards={gadgetCards}
      movieCharacterCards={movieCharacterCards}
      moviePosterCards={moviePosterCards}
      ssrCollabCards={ssrCollabCards}
    />
  );
}
