"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import {
  Sparkles,
  Star,
  Crown,
  Gem,
  Zap,
  Lock,
  Calendar,
  Trophy,
  Gift,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FolderOpen,
} from "lucide-react"
import Image from "next/image"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Types for collection cards
type Rarity = "common" | "rare" | "epic" | "legendary" | "mythical" | "ssr"

interface CollectionCard {
  id: string
  name: string
  image: string
  rarity: Rarity
  obtainedDate?: string
  isLocked: boolean
  description?: string
}

interface DailyCard extends CollectionCard {
  theme: string
}

interface GadgetCard extends CollectionCard {
  gadgetName: string
  ability: string
}

interface MovieCharacterCard extends CollectionCard {
  movieName: string
  characterRole: string
}

interface MoviePosterCard extends CollectionCard {
  movieTitle: string
  releaseYear: string
}

interface SSRCollabCard extends CollectionCard {
  collabName: string
  eventPeriod: string
  setProgress: number
  setTotal: number
}

// Mock Data
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
  { id: "d5", name: "Rainy Day Study", image: "/learning.png", rarity: "common", theme: "Weather", isLocked: true },
  { id: "d6", name: "Sunny Learning", image: "/learning.png", rarity: "common", theme: "Weather", isLocked: true },
  {
    id: "d7",
    name: "Spring Blossom",
    image: "/learning.png",
    rarity: "common",
    theme: "Season",
    obtainedDate: "2024-01-20",
    isLocked: false,
  },
  { id: "d8", name: "Summer Adventure", image: "/learning.png", rarity: "common", theme: "Season", isLocked: true },
  { id: "d9", name: "Autumn Leaves", image: "/learning.png", rarity: "common", theme: "Season", isLocked: true },
  { id: "d10", name: "Winter Wonder", image: "/learning.png", rarity: "common", theme: "Season", isLocked: true },
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
]

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
]

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
]

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
]

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
]

// Rarity configurations
const rarityConfig: Record<
  Rarity,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode; glow: string }
> = {
  common: {
    label: "Common",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    icon: <Star className="w-3 h-3" />,
    glow: "",
  },
  rare: {
    label: "Rare",
    color: "text-primary-600",
    bgColor: "bg-primary-100",
    borderColor: "border-primary-300",
    icon: <Sparkles className="w-3 h-3" />,
    glow: "shadow-[0_0_15px_rgba(124,93,250,0.3)]",
  },
  epic: {
    label: "Epic",
    color: "text-secondary-600",
    bgColor: "bg-secondary-100",
    borderColor: "border-secondary-300",
    icon: <Zap className="w-3 h-3" />,
    glow: "shadow-[0_0_20px_rgba(244,114,182,0.4)]",
  },
  legendary: {
    label: "Legendary",
    color: "text-warning-600",
    bgColor: "bg-warning-100",
    borderColor: "border-warning-300",
    icon: <Crown className="w-3 h-3" />,
    glow: "shadow-[0_0_25px_rgba(234,179,8,0.5)]",
  },
  mythical: {
    label: "Mythical",
    color: "text-accent-600",
    bgColor: "bg-accent-100",
    borderColor: "border-accent-300",
    icon: <Gem className="w-3 h-3" />,
    glow: "shadow-[0_0_30px_rgba(45,212,191,0.5)]",
  },
  ssr: {
    label: "SSR",
    color: "text-error-600",
    bgColor: "bg-gradient-to-r from-error-100 via-secondary-100 to-primary-100",
    borderColor: "border-error-300",
    icon: <Trophy className="w-3 h-3" />,
    glow: "shadow-[0_0_35px_rgba(239,68,68,0.6)] animate-pulse",
  },
}

type TabType = "daily" | "gadgets" | "characters" | "posters" | "ssr"

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("daily")
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [posterIndex, setPosterIndex] = useState(0)

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count: string }[] = [
    {
      id: "daily",
      label: "Daily Cards",
      icon: <Calendar className="w-4 h-4" />,
      count: `${dailyCards.filter((c) => !c.isLocked).length}/${dailyCards.length}`,
    },
    {
      id: "gadgets",
      label: "Gadgets",
      icon: <Sparkles className="w-4 h-4" />,
      count: `${gadgetCards.filter((c) => !c.isLocked).length}/${gadgetCards.length}`,
    },
    {
      id: "characters",
      label: "Movie Characters",
      icon: <Crown className="w-4 h-4" />,
      count: `${movieCharacterCards.filter((c) => !c.isLocked).length}/${movieCharacterCards.length}`,
    },
    {
      id: "posters",
      label: "Movie Posters",
      icon: <Gem className="w-4 h-4" />,
      count: `${moviePosterCards.filter((c) => !c.isLocked).length}/${moviePosterCards.length}`,
    },
    {
      id: "ssr",
      label: "SSR Collab",
      icon: <Trophy className="w-4 h-4" />,
      count: `${ssrCollabCards.filter((c) => !c.isLocked).length}/${ssrCollabCards.length}`,
    },
  ]

  // Card Component
  const CollectionCardItem = ({ card, size = "normal" }: { card: CollectionCard; size?: "normal" | "large" }) => {
    const config = rarityConfig[card.rarity]
    const isLarge = size === "large"

    return (
      <div
        onClick={() => !card.isLocked && setSelectedCard(card)}
        className={`
          relative cursor-pointer transition-all duration-300 group
          ${isLarge ? "w-full aspect-[3/4]" : "aspect-[3/4]"}
          ${card.isLocked ? "opacity-60 grayscale" : "hover:-translate-y-2"}
          ${!card.isLocked && config.glow}
        `}
      >
        {/* Card Frame */}
        <div
          className={`
          absolute inset-0 rounded-2xl border-[3px] ${config.borderColor} overflow-hidden
          ${config.bgColor}
        `}
        >
          {/* Image */}
          <div className="relative w-full h-[65%] overflow-hidden">
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
            {card.isLocked && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Card Info */}
          <div className="p-3 space-y-2">
            {/* Rarity Badge */}
            <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor} text-xs font-bold`}>
              {config.icon}
              <span className="ml-1">{config.label}</span>
            </Badge>

            {/* Card Name */}
            <h4
              className={`font-bold text-sm ${card.isLocked ? "text-muted-foreground" : "text-foreground"} line-clamp-1`}
            >
              {card.name}
            </h4>

            {/* Obtained Date */}
            {card.obtainedDate && !card.isLocked && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-success-500" />
                {card.obtainedDate}
              </p>
            )}
          </div>
        </div>

        {/* Holographic Effect for SSR */}
        {card.rarity === "ssr" && !card.isLocked && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </div>
    )
  }

  // Card Detail Modal
  const CardDetailModal = () => {
    if (!selectedCard) return null
    const config = rarityConfig[selectedCard.rarity]

    return (
      <div
        className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedCard(null)}
      >
        <div
          className={`bg-card rounded-3xl p-6 max-w-sm w-full ${config.glow} border-[3px] ${config.borderColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
            <Image
              src={selectedCard.image || "/placeholder.svg"}
              alt={selectedCard.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Card Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor} font-bold`}>
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Badge>
              {selectedCard.obtainedDate && (
                <span className="text-xs text-muted-foreground">{selectedCard.obtainedDate}</span>
              )}
            </div>

            <h3 className="text-xl font-bold text-foreground">{selectedCard.name}</h3>

            {/* Type-specific info */}
            {"gadgetName" in selectedCard && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Gadget:</span>{" "}
                  {(selectedCard as GadgetCard).gadgetName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Ability:</span> {(selectedCard as GadgetCard).ability}
                </p>
              </div>
            )}

            {"movieName" in selectedCard && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Movie:</span>{" "}
                  {(selectedCard as MovieCharacterCard).movieName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Role:</span>{" "}
                  {(selectedCard as MovieCharacterCard).characterRole}
                </p>
              </div>
            )}

            {"movieTitle" in selectedCard && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Movie:</span>{" "}
                  {(selectedCard as MoviePosterCard).movieTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Year:</span>{" "}
                  {(selectedCard as MoviePosterCard).releaseYear}
                </p>
              </div>
            )}

            {"collabName" in selectedCard && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Collab:</span>{" "}
                  {(selectedCard as SSRCollabCard).collabName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Event:</span>{" "}
                  {(selectedCard as SSRCollabCard).eventPeriod}
                </p>
              </div>
            )}
          </div>

          <Button className="w-full mt-4 bg-transparent" variant="outline" onClick={() => setSelectedCard(null)}>
            Close
          </Button>
        </div>
      </div>
    )
  }

  // Tab Content Renderers
  const renderDailyCards = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Collect daily cards by completing all Today Missions</p>
        <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200">
          <Gift className="w-3 h-3 mr-1" />
          {dailyCards.filter((c) => !c.isLocked).length} / {dailyCards.length} collected
        </Badge>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {dailyCards.map((card) => (
          <CollectionCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  )

  const renderGadgetCards = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Earn gadgets through Weekly Missions or purchase with Dorayaki points
        </p>
        <Badge variant="outline" className="bg-secondary-50 text-secondary-600 border-secondary-200">
          <Sparkles className="w-3 h-3 mr-1" />
          {gadgetCards.filter((c) => !c.isLocked).length} / {gadgetCards.length} collected
        </Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {gadgetCards.map((card) => (
          <CollectionCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  )

  const renderMovieCharacters = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Legendary characters from Doraemon movies - obtainable on special Legendary Days
        </p>
        <Badge variant="outline" className="bg-warning-50 text-warning-600 border-warning-200">
          <Crown className="w-3 h-3 mr-1" />
          {movieCharacterCards.filter((c) => !c.isLocked).length} / {movieCharacterCards.length} collected
        </Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {movieCharacterCards.map((card) => (
          <CollectionCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  )

  const renderMoviePosters = () => {
    const unlockedPosters = moviePosterCards.filter((c) => !c.isLocked)
    const currentPoster = unlockedPosters[posterIndex] || moviePosterCards[0]

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mythical movie posters - earned through Monthly Mission completion
          </p>
          <Badge variant="outline" className="bg-accent-50 text-accent-600 border-accent-200">
            <Gem className="w-3 h-3 mr-1" />
            {moviePosterCards.filter((c) => !c.isLocked).length} / {moviePosterCards.length} collected
          </Badge>
        </div>

        {/* Slideshow View */}
        <Card className="border-[3px] border-accent-300 bg-accent-50 p-6">
          <div className="flex items-center gap-6">
            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPosterIndex((prev) => Math.max(0, prev - 1))}
              disabled={posterIndex === 0 || unlockedPosters.length === 0}
              className="shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Main Poster Display */}
            <div className="flex-1 relative aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.5)]">
              <Image
                src={currentPoster.image || "/placeholder.svg"}
                alt={currentPoster.name}
                fill
                className={`object-cover ${currentPoster.isLocked ? "grayscale opacity-50" : ""}`}
              />
              {currentPoster.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                  <Lock className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
                <Badge className="bg-accent-100 text-accent-700 border-accent-300 mb-2">
                  <Gem className="w-3 h-3 mr-1" />
                  Mythical
                </Badge>
                <h3 className="text-xl font-bold text-white">{(currentPoster as MoviePosterCard).movieTitle}</h3>
                <p className="text-white/70 text-sm">{(currentPoster as MoviePosterCard).releaseYear}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPosterIndex((prev) => Math.min(unlockedPosters.length - 1, prev + 1))}
              disabled={posterIndex >= unlockedPosters.length - 1 || unlockedPosters.length === 0}
              className="shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {moviePosterCards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() =>
                  !card.isLocked && setPosterIndex(moviePosterCards.filter((c) => !c.isLocked).indexOf(card))
                }
                className={`
                  relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all
                  ${!card.isLocked && moviePosterCards.filter((c) => !c.isLocked).indexOf(card) === posterIndex ? "ring-2 ring-accent-500" : ""}
                  ${card.isLocked ? "opacity-50 grayscale" : "hover:scale-105"}
                `}
              >
                <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                {card.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  const renderSSRCollab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Ultra-rare collaboration cards - available only during special events
        </p>
        <Badge variant="outline" className="bg-error-50 text-error-600 border-error-200 animate-pulse">
          <Trophy className="w-3 h-3 mr-1" />
          {ssrCollabCards.filter((c) => !c.isLocked).length} / {ssrCollabCards.length} collected
        </Badge>
      </div>

      <div className="space-y-6">
        {ssrCollabCards.map((card) => (
          <Card
            key={card.id}
            className={`
              border-[3px] overflow-hidden
              ${card.isLocked ? "border-gray-300 bg-gray-50" : "border-error-300 bg-gradient-to-r from-error-50 via-secondary-50 to-primary-50"}
              ${!card.isLocked && "shadow-[0_0_35px_rgba(239,68,68,0.3)]"}
            `}
          >
            <div className="flex flex-col md:flex-row">
              {/* Card Image */}
              <div
                className={`relative w-full md:w-48 aspect-[4/3] md:aspect-square ${card.isLocked ? "grayscale opacity-60" : ""}`}
              >
                <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                {card.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="flex-1 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge
                      className={`
                      ${card.isLocked ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-gradient-to-r from-error-100 via-secondary-100 to-primary-100 text-error-600 border-error-300"}
                      font-bold
                    `}
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      SSR
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground mt-2">{card.name}</h3>
                    <p className="text-sm text-primary-600 font-semibold">{card.collabName}</p>
                  </div>
                  {!card.isLocked && card.obtainedDate && (
                    <Badge variant="outline" className="bg-success-50 text-success-600 border-success-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Obtained
                    </Badge>
                  )}
                </div>

                {/* Event Period */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{card.eventPeriod}</span>
                </div>

                {/* Set Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Set Progress</span>
                    <span className={`font-bold ${card.isLocked ? "text-gray-500" : "text-error-600"}`}>
                      {card.setProgress} / {card.setTotal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${card.isLocked ? "bg-gray-400" : "bg-gradient-to-r from-error-500 via-secondary-500 to-primary-500"}`}
                      style={{ width: `${(card.setProgress / card.setTotal) * 100}%` }}
                    />
                  </div>
                </div>

                {card.isLocked ? (
                  <p className="text-xs text-muted-foreground italic">
                    Complete daily missions during the event to unlock this card
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    className="border-error-300 text-error-600 hover:bg-error-50 bg-transparent"
                    onClick={() => setSelectedCard(card)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <ProtectedRoute
      pageName="Collections"
      pageDescription="Collect beautiful cards by completing missions and achievements."
      pageIcon={<FolderOpen className="w-10 h-10 text-primary" />}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar activePage="collections" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header */}
            <Card className="border-[1.4px] border-primary-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">My Collections</h1>
                    <p className="text-sm text-muted-foreground">
                      Collect cards by completing daily missions and achievements
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-2xl font-bold text-gray-600">{dailyCards.filter((c) => !c.isLocked).length}</p>
                    <p className="text-xs text-muted-foreground">Daily</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-primary-50 border border-primary-200">
                    <p className="text-2xl font-bold text-primary-600">
                      {gadgetCards.filter((c) => !c.isLocked).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Gadgets</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-warning-50 border border-warning-200">
                    <p className="text-2xl font-bold text-warning-600">
                      {movieCharacterCards.filter((c) => !c.isLocked).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Legendary</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-accent-50 border border-accent-200">
                    <p className="text-2xl font-bold text-accent-600">
                      {moviePosterCards.filter((c) => !c.isLocked).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Mythical</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-error-50 border border-error-200">
                    <p className="text-2xl font-bold text-error-600">
                      {ssrCollabCards.filter((c) => !c.isLocked).length}
                    </p>
                    <p className="text-xs text-muted-foreground">SSR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 ${activeTab === tab.id ? "" : "bg-card hover:bg-muted"}`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tab.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <Card className="border-[1.4px] border-primary-200">
              <CardContent className="p-6">
                {activeTab === "daily" && renderDailyCards()}
                {activeTab === "gadgets" && renderGadgetCards()}
                {activeTab === "characters" && renderMovieCharacters()}
                {activeTab === "posters" && renderMoviePosters()}
                {activeTab === "ssr" && renderSSRCollab()}
              </CardContent>
            </Card>
          </div>
        </div> 
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal />
    </ProtectedRoute>
  )
}
