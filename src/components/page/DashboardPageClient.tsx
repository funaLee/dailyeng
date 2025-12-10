"use client"

import type React from "react"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Sparkles,
  Target,
  BookOpen,
  Flame,
  CalendarIcon,
  Clock,
  ShoppingCart,
  TrendingUp,
  Award,
  Zap,
  Star,
  Gift,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";

interface Mission {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: string;
  avatar: string;
  streak: number;
  isCurrentUser?: boolean;
}

interface BadgeItem {
  id: number;
  name: string;
  description: string;
  image: string;
  earned: boolean;
}

interface ShopItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  image: string;
  description: string;
  category: string;
  status: string;
}

interface DashboardPageClientProps {
  missions: Mission[];
  leaderboardData: LeaderboardUser[];
  badges: BadgeItem[];
  shopItems: ShopItem[];
  activityData: Record<string, number>;
}

export default function DashboardPageClient({
  missions,
  leaderboardData,
  badges,
  shopItems,
  activityData,
}: DashboardPageClientProps) {
  // Auth is handled by ProtectedRoute wrapper - no need for Zustand auth state
  const [activeMissionTab, setActiveMissionTab] = useState<
    "today" | "weekly" | "monthly"
  >("today");
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState<"friends" | "global">(
    "friends"
  );
  const [isGiftClaimed, setIsGiftClaimed] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | null>(
    null
  );
  const [isShopDialogOpen, setIsShopDialogOpen] = useState(false);
  const [animatingMission, setAnimatingMission] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleMission = (id: string) => {
    setAnimatingMission(id);
    setTimeout(() => {
      setCompletedMissions((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
      setAnimatingMission(null);
    }, 300);
  };

  // Calculate Progress
  const totalMissions = missions.length;
  const completedCount = missions.filter(
    (m) => m.completed || completedMissions.includes(m.id)
  ).length;
  const completionPercentage = Math.round(
    (completedCount / totalMissions) * 100
  );

  // Chart Data
  const pieData = [
    { name: "Completed", value: completionPercentage },
    { name: "Remaining", value: 100 - completionPercentage },
  ];

  const handleClaimGift = () => {
    if (completionPercentage < 100) return;
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setIsGiftClaimed(true);
  };

  const nextBadge = () => {
    setCurrentBadgeIndex((prev) => (prev + 1) % badges.length);
  };

  const prevBadge = () => {
    setCurrentBadgeIndex((prev) => (prev - 1 + badges.length) % badges.length);
  };

  const getVisibleBadges = () => {
    const prev = (currentBadgeIndex - 1 + badges.length) % badges.length;
    const next = (currentBadgeIndex + 1) % badges.length;
    return [badges[prev], badges[currentBadgeIndex], badges[next]];
  };

  return (
    <ProtectedRoute
      pageName="Dashboard"
      pageDescription="Track your learning progress, complete daily missions, and view your achievements."
      pageIcon={PageIcons.dashboard}
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${
                  [
                    "bg-primary-400",
                    "bg-secondary-400",
                    "bg-accent-400",
                    "bg-yellow-400",
                    "bg-pink-400",
                  ][Math.floor(Math.random() * 5)]
                } rounded-sm transform rotate-45`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="md:col-span-3 lg:col-span-3 space-y-6">
            <UserProfileSidebar activePage="dashboard" />

            <Card className="border-2 border-border shadow-md bg-white p-5 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 rounded-lg">
                    <CalendarIcon size={14} className="text-primary-600" />
                  </div>
                  Study Heat Map
                </h4>
                <Badge variant="outline" className="text-xs bg-white">
                  Last 10 weeks
                </Badge>
              </div>
              <ActivityHeatmap data={activityData} />
            </Card>

            <Card className="border-2 border-border shadow-md bg-white p-5">
              <h4 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-accent-100 rounded-lg">
                  <Zap size={14} className="text-accent-600" />
                </div>
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Link href="/speaking" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11 hover:bg-primary-50 hover:border-primary-300 transition-all group bg-transparent"
                  >
                    <div className="p-1.5 bg-primary-100 rounded-md group-hover:bg-primary-200 transition-colors">
                      <BookOpen size={14} className="text-primary-600" />
                    </div>
                    <span className="text-sm">Continue Learning</span>
                    <ChevronRight
                      size={14}
                      className="ml-auto text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                    />
                  </Button>
                </Link>
                <Link href="/vocab" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11 hover:bg-secondary-50 hover:border-secondary-300 transition-all group bg-transparent"
                  >
                    <div className="p-1.5 bg-secondary-100 rounded-md group-hover:bg-secondary-200 transition-colors">
                      <Target size={14} className="text-secondary-600" />
                    </div>
                    <span className="text-sm">Practice Vocabulary</span>
                    <ChevronRight
                      size={14}
                      className="ml-auto text-slate-400 group-hover:text-secondary-500 group-hover:translate-x-1 transition-all"
                    />
                  </Button>
                </Link>
                <Link href="/notebook" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11 hover:bg-accent-50 hover:border-accent-300 transition-all group bg-transparent"
                  >
                    <div className="p-1.5 bg-accent-100 rounded-md group-hover:bg-accent-200 transition-colors">
                      <Award size={14} className="text-accent-600" />
                    </div>
                    <span className="text-sm">Review Flashcards</span>
                    <ChevronRight
                      size={14}
                      className="ml-auto text-slate-400 group-hover:text-accent-500 group-hover:translate-x-1 transition-all"
                    />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="md:col-span-9 lg:col-span-9 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-50 to-secondary-50 p-6 text-white shadow-sm border-2 border-border">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary-600 text-sm font-medium">
                      Good morning
                    </span>
                    <Sparkles
                      size={14}
                      className="text-primary-600 animate-pulse"
                    />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-primary-800">
                    Welcome back, Truc!
                  </h1>
                  <p className="text-primary-600 text-sm max-w-md">
                    You're on a 3-day streak! Keep up the great work and
                    complete today's missions.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                    <p className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                      Current Level
                    </p>
                    <div className="text-3xl font-black mt-1 text-secondary-500">
                      A2{" "}
                      <span className="text-lg font-normal text-primary-700">
                        / B1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Total XP"
                value="12,450"
                icon={<Sparkles className="text-yellow-500" size={20} />}
                trend="+250 today"
                trendUp={true}
                bgColor="bg-gradient-to-br from-yellow-50 to-orange-50"
                iconBg="bg-yellow-100"
              />
              <StatCard
                label="Day Streak"
                value="3 Days"
                icon={<Flame className="text-orange-500" size={20} />}
                trend="Keep going!"
                trendUp={true}
                bgColor="bg-gradient-to-br from-orange-50 to-red-50"
                iconBg="bg-orange-100"
              />
              <StatCard
                label="Global Rank"
                value="#56"
                icon={<Trophy className="text-primary-500" size={20} />}
                trend="+12 this week"
                trendUp={true}
                bgColor="bg-gradient-to-br from-primary-50 to-indigo-50"
                iconBg="bg-primary-100"
              />
              <StatCard
                label="Words Learned"
                value="342"
                icon={<BookOpen className="text-accent-500" size={20} />}
                trend="+15 new"
                trendUp={true}
                bgColor="bg-gradient-to-br from-accent-50 to-emerald-50"
                iconBg="bg-accent-100"
              />
            </div>

            {/* 2. Main Grid: Missions/Shop vs Leaderboard/Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN (2/3) */}
              <div className="lg:col-span-2 space-y-6 ">
                <Card className="shadow-md overflow-hidden flex flex-col bg-white border-2 border-border ">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-primary-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-xl">
                        <Target className="text-primary-600" size={20} />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800">
                          Daily Missions
                        </h2>
                        <p className="text-xs text-slate-500">
                          Complete all to claim rewards
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                      <Clock size={12} className="animate-pulse" /> 14h 59m left
                    </div>
                  </div>
                  <div className="p-0 flex-1 bg-white">
                    <div className="flex border-b border-slate-100">
                      {["Today", "Weekly", "Monthly"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() =>
                            setActiveMissionTab(tab.toLowerCase() as any)
                          }
                          className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                            activeMissionTab === tab.toLowerCase()
                              ? "border-primary-600 text-primary-600 bg-primary-50/50"
                              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="p-5 space-y-3">
                      {missions.map((mission, index) => (
                        <div
                          key={mission.id}
                          onClick={() => toggleMission(mission.id)}
                          className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer transform ${
                            animatingMission === mission.id
                              ? "scale-95 opacity-70"
                              : "scale-100"
                          } ${
                            completedMissions.includes(mission.id) ||
                            mission.completed
                              ? "bg-gradient-to-r from-primary-50 to-accent-50/30 border-primary-200"
                              : "bg-white border-slate-100 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                              completedMissions.includes(mission.id) ||
                              mission.completed
                                ? "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-500 text-white shadow-md"
                                : "border-slate-300 text-transparent group-hover:border-primary-400 group-hover:bg-primary-50"
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-semibold ${
                                completedMissions.includes(mission.id) ||
                                mission.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-700"
                              }`}
                            >
                              {mission.title}
                            </p>
                          </div>
                          <div
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                              completedMissions.includes(mission.id) ||
                              mission.completed
                                ? "bg-accent-100 text-accent-600"
                                : "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-600"
                            }`}
                          >
                            <Sparkles size={12} />+{mission.points} XP
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="shadow-md bg-white p-6 overflow-hidden relative border-2 border-border">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                        <Award className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          Rewards & Badges
                        </h3>
                        <p className="text-xs text-slate-500">
                          Collect achievements as you learn
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Points Circle */}
                      <div className="flex flex-col items-center justify-center text-center w-full md:w-1/3 border-r-0 md:border-r border-slate-100 pr-0 md:pr-8">
                        <div className="relative w-36 h-36">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-500 animate-pulse opacity-20" />
                          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-xl">
                            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-inner">
                              <div className="text-center">
                                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                                <span className="text-3xl font-black bg-gradient-to-br from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                  120
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 mt-4">
                          <span className="font-bold text-primary-600">
                            120
                          </span>{" "}
                          reward points
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 text-xs bg-transparent"
                        >
                          Redeem Points
                        </Button>
                      </div>

                      {/* Badges Carousel */}
                      <div className="flex-1 w-full">
                        <div className="relative flex items-center justify-center gap-4 h-44">
                          <button
                            onClick={prevBadge}
                            className="absolute left-0 z-10 p-2.5 rounded-full bg-white shadow-md hover:bg-slate-50 hover:shadow-xl transition-all border border-slate-100"
                          >
                            <ChevronLeft className="text-slate-600" size={18} />
                          </button>

                          <div className="flex items-end justify-center gap-3 h-36">
                            {getVisibleBadges().map((badge, index) => (
                              <div
                                key={badge.id}
                                className={`transition-all duration-500 ease-out ${
                                  index === 1
                                    ? "w-28 h-36 z-10 transform scale-110"
                                    : "w-20 h-24 opacity-50 scale-90 blur-[0.5px]"
                                }`}
                              >
                                <div
                                  className={`relative w-full h-full rounded-xl overflow-hidden shadow-xl border-2 ${
                                    index === 1
                                      ? "border-primary-300"
                                      : "border-slate-200"
                                  }`}
                                >
                                  <Image
                                    src={badge.image || "/placeholder.svg"}
                                    alt={badge.name}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                  {badge.earned && (
                                    <div className="absolute top-2 right-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full p-1.5 shadow-md">
                                      <Check size={10} className="text-white" />
                                    </div>
                                  )}
                                  {!badge.earned && (
                                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                                      <div className="text-white/80 text-xs font-medium">
                                        Locked
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={nextBadge}
                            className="absolute right-0 z-10 p-2.5 rounded-full bg-white shadow-md hover:bg-slate-50 hover:shadow-xl transition-all border border-slate-100"
                          >
                            <ChevronRight
                              className="text-slate-600"
                              size={18}
                            />
                          </button>
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-sm font-bold text-slate-800">
                            {badges[currentBadgeIndex].name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {badges[currentBadgeIndex].description}
                          </p>
                          <div className="flex justify-center gap-1 mt-3">
                            {badges.map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i === currentBadgeIndex
                                    ? "bg-primary-500 w-4"
                                    : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-md bg-white p-6 overflow-hidden relative border-2 border-border">
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary-100 to-accent-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-xl">
                          <ShoppingCart
                            className="text-secondary-600"
                            size={20}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">
                            Reward Shop
                          </h3>
                          <p className="text-xs text-slate-500">
                            Spend your points on power-ups
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
                        <Gift size={16} />
                        4,300 pts
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {shopItems.slice(0, 3).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedShopItem(item)}
                          className="flex flex-col gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-primary-300 hover:shadow-xl transition-all bg-white group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-2 left-2 text-2xl drop-shadow-md">
                              {item.icon}
                            </div>
                          </div>
                          <div className="text-left relative z-10">
                            <h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-primary-600 font-bold text-sm flex items-center gap-1">
                                <Star size={12} className="text-yellow-500" />
                                {item.price} pts
                              </span>
                              <Badge
                                variant={
                                  item.status === "active"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  item.status === "active"
                                    ? "bg-accent-500 text-white"
                                    : ""
                                }
                              >
                                {item.status === "active"
                                  ? "Active"
                                  : item.status}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Link href="/user/shop">
                      <Button
                        variant="outline"
                        className="w-full text-primary-600 border-primary-200 hover:bg-primary-50 hover:border-primary-400 font-semibold bg-white group"
                      >
                        View All Items
                        <ChevronRight
                          size={16}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN (1/3) - Leaderboard & Progress */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-2 border-border shadow-md bg-white flex flex-col overflow-hidden">
                  <div className="p-6 flex flex-col items-center justify-center flex-1 text-center">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-primary-100 rounded-lg">
                        <Target size={16} className="text-primary-600" />
                      </div>
                      <h3 className="font-bold text-slate-800">
                        Today's Progress
                      </h3>
                    </div>
                    <div className="relative w-44 h-44 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 animate-pulse opacity-30" />
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            <Cell
                              key="completed"
                              fill="url(#progressGradient)"
                            />
                            <Cell key="remaining" fill="#E2E8F0" />
                          </Pie>
                          <defs>
                            <linearGradient
                              id="progressGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="var(--primary-400)"
                              />
                              <stop
                                offset="100%"
                                stopColor="var(--primary-600)"
                              />
                            </linearGradient>
                          </defs>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black bg-gradient-to-br from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {completionPercentage}%
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Complete
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 max-w-xs">
                      {completionPercentage < 100
                        ? "Complete all missions to claim your daily gift!"
                        : "Amazing! You've completed all missions!"}
                    </p>
                    <Button
                      className={`w-full h-12 font-bold text-sm transition-all ${
                        completionPercentage >= 100 && !isGiftClaimed
                          ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white shadow-md hover:shadow-xl hover:scale-[1.02]"
                          : isGiftClaimed
                          ? "bg-gradient-to-r from-accent-400 to-accent-600 text-white"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                      disabled={completionPercentage < 100 || isGiftClaimed}
                      onClick={handleClaimGift}
                    >
                      {isGiftClaimed ? (
                        <>
                          <Check size={18} className="mr-2" />
                          Gift Claimed!
                        </>
                      ) : (
                        <>
                          <Gift size={18} className="mr-2" />
                          Claim Daily Gift
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                <Card className="shadow-md bg-white overflow-hidden border-2 border-border">
                  <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                        <Trophy className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800">
                          Leaderboard
                        </h2>
                        <p className="text-xs text-slate-500">
                          Compete with others
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-0">
                    <div className="flex border-b border-slate-100">
                      {["friends", "global"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setLeaderboardTab(tab as any)}
                          className={`flex-1 py-3 text-sm font-semibold capitalize border-b-2 transition-all ${
                            leaderboardTab === tab
                              ? "border-primary-600 text-primary-600 bg-primary-50/50"
                              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                      {leaderboardData.map((user, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer ${
                            user.isCurrentUser
                              ? "bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 shadow-sm"
                              : "hover:bg-slate-50 border-2 border-transparent"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                              user.rank === 1
                                ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900"
                                : user.rank === 2
                                ? "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700"
                                : user.rank === 3
                                ? "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-900"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {user.rank <= 3 ? <Crown size={14} /> : user.rank}
                          </div>
                          <div
                            className={`w-10 h-10 rounded-full ${user.avatar} flex items-center justify-center text-lg shadow-inner`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                user.isCurrentUser
                                  ? "text-primary-700"
                                  : "text-slate-700"
                              }`}
                            >
                              {user.name}
                              {user.isCurrentUser && (
                                <span className="ml-1 text-xs text-primary-500">
                                  (You)
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-orange-500">
                              <Flame size={10} />
                              {user.streak} day streak
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">
                              {user.xp}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase">
                              XP
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedShopItem}
        onOpenChange={() => setSelectedShopItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selectedShopItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">{selectedShopItem.icon}</span>
                  {selectedShopItem.name}
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  {selectedShopItem.description}
                </DialogDescription>
              </DialogHeader>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-200">
                <Image
                  src={selectedShopItem.image || "/placeholder.svg"}
                  alt={selectedShopItem.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">
                    Category
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {selectedShopItem.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">
                    Price
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {selectedShopItem.price} points
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-600">
                    Status
                  </span>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      selectedShopItem.status === "active"
                        ? "bg-green-100 text-green-700"
                        : selectedShopItem.status === "used"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {selectedShopItem.status.charAt(0).toUpperCase() +
                      selectedShopItem.status.slice(1)}
                  </span>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedShopItem(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={selectedShopItem.status !== "unused"}
                >
                  {selectedShopItem.status === "unused"
                    ? "Purchase"
                    : "Already Owned"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isShopDialogOpen} onOpenChange={setIsShopDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="text-primary-600" />
              Reward Shop
            </DialogTitle>
            <DialogDescription>
              Browse and purchase items with your accumulated points
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200 mb-4">
            <span className="text-sm font-medium text-slate-700">
              Your Balance
            </span>
            <span className="text-2xl font-bold text-primary-600">
              💎 4300 points
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsShopDialogOpen(false);
                  setSelectedShopItem(item);
                }}
                className="flex flex-col gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-primary-400 hover:shadow-md transition-all bg-white group"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.status === "active" && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Active
                    </span>
                  )}
                  {item.status === "used" && (
                    <span className="absolute top-2 right-2 bg-slate-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Used
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                    {item.icon} {item.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary-600">
                      {item.price}
                    </span>
                    <span className="text-xs text-slate-400">points</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </ProtectedRoute>
  );
}

/* --- Helper Components --- */

function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  bgColor = "bg-white",
  iconBg = "bg-slate-50",
}: {
  label: string
  value: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  bgColor?: string
  iconBg?: string
}) {
  return (
    <Card
      className={`p-4 border-none shadow-md ${bgColor} hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 ${iconBg} rounded-xl group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
          <p className="text-xl font-bold text-slate-800 truncate">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-1 text-xs font-medium ${trendUp ? "text-accent-600" : "text-slate-500"}`}
            >
              {trendUp && <TrendingUp size={10} />}
              {trend}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function NavButton({
  icon,
  label,
  active = false,
  badge,
  variant = "default",
  href,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
  variant?: "default" | "danger"
  href?: string
}) {
  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left relative"
  const activeClass = "bg-blue-50 text-blue-700"
  const defaultClass = "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  const dangerClass = "text-red-500 hover:bg-red-50 hover:text-red-600"

  let className = baseClass
  if (active) className += ` ${activeClass}`
  else if (variant === "danger") className += ` ${dangerClass}`
  else className += ` ${defaultClass}`

  return (
    <Link href={href || "#"} className={className}>
      {icon}
      {label}
      {badge && (
        <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}

function ActivityHeatmap({ data }: { data: Record<string, number> }) {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 69) // 10 weeks = 70 days

  // Get the first day of week offset (to align with correct weekday)
  const firstDayOfWeek = startDate.getDay()

  // Generate all cells
  const cells: Array<{ date: string; count: number; month?: string }> = []

  for (let i = 0; i < 70; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]

    cells.push({
      date: dateStr,
      count: data[dateStr] || 0,
      month: i % 7 === 0 && date.getDate() <= 7 ? date.toLocaleDateString("en", { month: "short" }) : undefined,
    })
  }

  // Group by weeks
  const weeks: Array<Array<{ date: string; count: number }>> = []
  let currentWeek: Array<{ date: string; count: number }> = []

  // Add empty cells for alignment
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: "", count: -1 })
  }

  cells.forEach((cell, i) => {
    currentWeek.push({ date: cell.date, count: cell.count })
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: -1 })
    }
    weeks.push(currentWeek)
  }

  // Get month labels
  const monthLabels: Array<{ label: string; offset: number }> = []
  let lastMonth = ""
  cells.forEach((cell, i) => {
    if (cell.month && cell.month !== lastMonth) {
      monthLabels.push({ label: cell.month, offset: Math.floor(i / 7) })
      lastMonth = cell.month
    }
  })

  const getColor = (count: number) => {
    if (count === -1) return "bg-transparent"
    if (count === 0) return "bg-slate-100"
    if (count === 1) return "bg-primary-200"
    if (count === 2) return "bg-primary-300"
    if (count === 3) return "bg-primary-400"
    return "bg-primary-500"
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="flex gap-1 mb-2 pl-12">
          {monthLabels.map((month, i) => (
            <div
              key={i}
              className="text-xs text-slate-500 font-medium"
              style={{
                marginLeft: i === 0 ? 0 : `${(month.offset - (monthLabels[i - 1]?.offset || 0)) * 17}px`,
              }}
            >
              {month.label}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 justify-around pr-2">
            <div className="h-[14px]"></div>
            <div className="text-xs text-slate-500 h-[14px] flex items-center">Tue</div>
            <div className="h-[14px]"></div>
            <div className="text-xs text-slate-500 h-[14px] flex items-center">Thu</div>
            <div className="h-[14px]"></div>
            <div className="text-xs text-slate-500 h-[14px] flex items-center">Sat</div>
            <div className="h-[14px]"></div>
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`w-[14px] h-[14px] rounded-sm ${getColor(
                    day.count,
                  )} transition-all hover:ring-2 hover:ring-slate-400 hover:scale-110 cursor-pointer`}
                  title={day.date ? `${day.date}: ${day.count} activities` : ""}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <span>Đông</span>
          <div className="flex items-center gap-1">
            <div className="w-[14px] h-[14px] rounded-sm bg-slate-100"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-primary-200"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-primary-300"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-primary-400"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-primary-500"></div>
          </div>
          <span>Nhiều</span>
        </div>
      </div>
    </div>
  )
}
