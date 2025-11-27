"use client"

import type React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
} from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAppStore()
  const [activeMissionTab, setActiveMissionTab] = useState<"today" | "weekly" | "monthly">("today")
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [leaderboardTab, setLeaderboardTab] = useState<"friends" | "global">("friends")
  const [isGiftClaimed, setIsGiftClaimed] = useState(false)
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)
  const [selectedShopItem, setSelectedShopItem] = useState<any>(null)
  const [isShopDialogOpen, setIsShopDialogOpen] = useState(false)

  // Generate realistic activity data based on completed lessons
  const [activityData] = useState(() => {
    const today = new Date()
    const data: Record<string, number> = {}

    // Generate last 10 weeks of data (70 days)
    for (let i = 69; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Realistic activity pattern: higher on weekdays, lower on weekends
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // Random activity with weighted probability
      const rand = Math.random()
      if (isWeekend) {
        data[dateStr] = rand > 0.6 ? Math.floor(rand * 3) : 0
      } else {
        data[dateStr] = rand > 0.3 ? Math.floor(rand * 5) : 0
      }
    }

    return data
  })

  // Mock Data
  const missions = [
    { id: "m1", title: "Đăng nhập hôm nay", points: 5, completed: true },
    { id: "m2", title: "Học 30 phút", points: 10, completed: false },
    { id: "m3", title: "Học 10 từ vựng mới", points: 10, completed: false },
    { id: "m4", title: "Hoàn thành bài học hôm nay", points: 40, completed: false },
    { id: "m5", title: "Luyện nói 1 lần", points: 30, completed: false },
  ]

  const toggleMission = (id: string) => {
    setCompletedMissions((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  // Calculate Progress
  // For demo purposes, let's calculate percentage based on checked items
  const totalMissions = missions.length
  const completedCount = missions.filter((m) => m.completed || completedMissions.includes(m.id)).length
  const completionPercentage = Math.round((completedCount / totalMissions) * 100)

  // Chart Data
  const pieData = [
    { name: "Completed", value: completionPercentage },
    { name: "Remaining", value: 100 - completionPercentage },
  ]

  const handleClaimGift = () => {
    if (completionPercentage < 100) return
    setIsGiftClaimed(true)
    // Show success message
    // alert("You received 500 Gems and a 2x XP Boost!");
  }

  const leaderboardData = [
    { rank: 1, name: "Hoàng Nam", xp: "3,100", avatar: "bg-yellow-200", streak: 45 },
    { rank: 2, name: "Minh Tú", xp: "2,850", avatar: "bg-gray-200", streak: 38 },
    { rank: 3, name: "Lan Anh", xp: "2,720", avatar: "bg-orange-200", streak: 32 },
    { rank: 4, name: "Quang Đạt", xp: "2,500", avatar: "bg-green-200", streak: 28 },
    { rank: 5, name: "Hương Giang", xp: "2,380", avatar: "bg-blue-200", streak: 25 },
    { rank: 6, name: "Tuấn Anh", xp: "2,210", avatar: "bg-pink-200", streak: 22 },
    { rank: 7, name: "Mai Linh", xp: "2,050", avatar: "bg-purple-200", streak: 18 },
    { rank: 56, name: "Thanh Truc", xp: "1,240", avatar: "bg-blue-200", isCurrentUser: true, streak: 3 },
  ]

  const badges = [
    {
      id: 1,
      name: "Excellent Learner",
      description: "Complete 30 lessons in a row",
      image: "/learning.png",
      earned: true,
    },
    {
      id: 2,
      name: "Vocabulary Master",
      description: "Learn 500 new words",
      image: "/learning.png",
      earned: true,
    },
    {
      id: 3,
      name: "Speaking Champion",
      description: "Complete 50 speaking sessions",
      image: "/learning.png",
      earned: false,
    },
    {
      id: 4,
      name: "Grammar Expert",
      description: "Master 20 grammar topics",
      image: "/learning.png",
      earned: false,
    },
  ]

  const shopItems = [
    {
      id: 1,
      name: "Streak Freeze",
      price: 300,
      icon: "❄️",
      image: "/learning.png",
      description: "Protect your streak for one day if you miss your daily goal",
      category: "Power-up",
      status: "unused",
    },
    {
      id: 2,
      name: "Double XP Boost",
      price: 500,
      icon: "⚡",
      image: "/learning.png",
      description: "Earn 2x XP on all activities for 24 hours",
      category: "Boost",
      status: "active",
    },
    {
      id: 3,
      name: "Premium Avatar Frame",
      price: 1000,
      icon: "🖼️",
      image: "/learning.png",
      description: "Unlock an exclusive golden avatar frame",
      category: "Cosmetic",
      status: "used",
    },
    {
      id: 4,
      name: "Lesson Skip",
      price: 200,
      icon: "⏭️",
      image: "/learning.png",
      description: "Skip one difficult lesson without losing progress",
      category: "Power-up",
      status: "unused",
    },
    {
      id: 5,
      name: "Hint Pack",
      price: 150,
      icon: "💡",
      image: "/learning.png",
      description: "Get 10 hints to use during quizzes",
      category: "Helper",
      status: "unused",
    },
    {
      id: 6,
      name: "Time Extender",
      price: 250,
      icon: "⏰",
      image: "/learning.png",
      description: "Add 50% more time to timed exercises",
      category: "Power-up",
      status: "unused",
    },
  ]

  const nextBadge = () => {
    setCurrentBadgeIndex((prev) => (prev + 1) % badges.length)
  }

  const prevBadge = () => {
    setCurrentBadgeIndex((prev) => (prev - 1 + badges.length) % badges.length)
  }

  const getVisibleBadges = () => {
    const prev = (currentBadgeIndex - 1 + badges.length) % badges.length
    const next = (currentBadgeIndex + 1) % badges.length
    return [badges[prev], badges[currentBadgeIndex], badges[next]]
  }

  return (
    <ProtectedRoute
      pageName="Dashboard"
      pageDescription="Track your learning progress, complete daily missions, and view your achievements."
      pageIcon={PageIcons.dashboard}
    >
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="md:col-span-3 lg:col-span-3 space-y-6">
            <UserProfileSidebar activePage="dashboard" />

            {/* GitHub-style Activity Heatmap moved to left column */}
            <Card className="border-none shadow-md bg-white p-4">
              <h4 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                <CalendarIcon size={16} /> Study heat map
              </h4>
              <ActivityHeatmap data={activityData} />
            </Card>
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="md:col-span-9 lg:col-span-9 space-y-6">
            {/* 1. Welcome & Top Stats Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, Truc! 👋</h1>
                <p className="text-slate-500 text-sm">You're making great progress today.</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-400 uppercase">Current Level</p>
                <div className="text-2xl font-black text-blue-600">
                  A2 <span className="text-sm font-normal text-slate-400">/ B1</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total XP" value="12,450" icon={<Sparkles className="text-yellow-500" />} />
              <StatCard label="Day Streak" value="3 Days" icon={<Flame className="text-orange-500" />} />
              <StatCard label="Rank" value="#56" icon={<Trophy className="text-blue-500" />} />
              <StatCard label="Words Learned" value="342" icon={<BookOpen className="text-green-500" />} />
            </div>

            {/* 2. Main Grid: Missions/Shop vs Leaderboard/Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mission List */}
                <Card className="border-none shadow-md overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-2">
                      <Target className="text-blue-600" size={20} />
                      <h2 className="font-bold text-slate-800">Daily Missions</h2>
                    </div>
                    <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock size={12} /> Ends in 14h 59m
                    </div>
                  </div>
                  <div className="p-0 flex-1 bg-white">
                    <div className="flex border-b border-slate-100">
                      {["Today", "Weekly", "Monthly"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveMissionTab(tab.toLowerCase() as any)}
                          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeMissionTab === tab.toLowerCase()
                              ? "border-blue-600 text-blue-600 bg-blue-50/50"
                              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 space-y-3">
                      {missions.map((mission) => (
                        <div
                          key={mission.id}
                          onClick={() => toggleMission(mission.id)}
                          className={`group flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                            completedMissions.includes(mission.id) || mission.completed
                              ? "bg-blue-50/30 border-blue-100"
                              : "bg-white border-slate-100 hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                              completedMissions.includes(mission.id) || mission.completed
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "border-slate-300 text-transparent group-hover:border-blue-400"
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${completedMissions.includes(mission.id) || mission.completed ? "text-slate-400 line-through" : "text-slate-700"}`}
                            >
                              {mission.title}
                            </p>
                          </div>
                          <div className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                            +{mission.points} XP
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Rewards / Badges Card */}
                <Card className="border-none shadow-md bg-white p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Rewards / Badges</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Points Circle */}
                    <div className="flex flex-col items-center justify-center text-center w-full md:w-1/3 border-r-0 md:border-r border-slate-100 pr-0 md:pr-8">
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                        <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl font-bold text-blue-600">120</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-600">
                        You currently have <span className="font-bold text-blue-600">120</span>
                        <br /> reward points
                      </p>
                    </div>

                    {/* Badges Carousel */}
                    <div className="flex-1 w-full">
                      <div className="relative flex items-center justify-center gap-4 h-40">
                        {/* Left chevron */}
                        <button
                          onClick={prevBadge}
                          className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors"
                        >
                          <ChevronLeft className="text-slate-600" size={20} />
                        </button>

                        {/* Badge display */}
                        <div className="flex items-end justify-center gap-4 h-32">
                          {getVisibleBadges().map((badge, index) => (
                            <div
                              key={badge.id}
                              className={`transition-all duration-300 ${
                                index === 1 ? "w-28 h-36 z-10" : "w-20 h-24 opacity-60 scale-90"
                              }`}
                            >
                              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-slate-200">
                                <Image
                                  src={badge.image || "/placeholder.svg"}
                                  alt={badge.name}
                                  fill
                                  className="object-cover"
                                />
                                {badge.earned && (
                                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                                    <Check size={12} className="text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Right chevron */}
                        <button
                          onClick={nextBadge}
                          className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors"
                        >
                          <ChevronRight className="text-slate-600" size={20} />
                        </button>
                      </div>
                      <p className="text-center mt-4 text-sm font-bold text-slate-700">
                        {badges[currentBadgeIndex].name}
                      </p>
                      <p className="text-center text-xs text-slate-500 mt-1">{badges[currentBadgeIndex].description}</p>
                    </div>
                  </div>
                </Card>

                {/* Reward Shop Card */}
                <Card className="border-none shadow-md bg-white p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-slate-800">Reward Shop</h3>
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-bold border border-blue-200">
                      💎 Accumulated Points: 4300
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {shopItems.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedShopItem(item)}
                        className="flex flex-col gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white group"
                      >
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-2 left-2 text-2xl">{item.icon}</div>
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-sm text-slate-800 mb-1">{item.name}</h4>
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-bold text-sm">{item.price} pts</span>
                            <Badge
                              variant={item.status === "active" ? "default" : "outline"}
                              className={item.status === "active" ? "bg-green-500" : ""}
                            >
                              {item.status === "active" ? "Active" : item.status}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Link href="/shop">
                    <Button
                      variant="outline"
                      className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 font-semibold bg-transparent"
                    >
                      Go to reward shop
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* RIGHT COLUMN (1/3) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Daily Progress */}
                <Card className="border-none shadow-md bg-white flex flex-col overflow-hidden">
                  <div className="p-6 flex flex-col items-center justify-center flex-1 text-center">
                    <h3 className="font-bold text-slate-800 mb-6 text-lg">Daily Progress</h3>

                    {/* Custom Ring Chart Visual */}
                    <div className="relative w-48 h-48 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {/* Definitions for gradients */}
                          <defs>
                            <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#60A5FA" /> {/* Blue-400 */}
                              <stop offset="100%" stopColor="#2563EB" /> {/* Blue-600 */}
                            </linearGradient>
                          </defs>
                          <Pie
                            data={pieData}
                            innerRadius={65}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            cornerRadius={10}
                            stroke="none"
                          >
                            {/* Segment 1: Completed (Gradient) */}
                            <Cell fill="url(#progressGradient)" />
                            {/* Segment 2: Remaining (Gray) */}
                            <Cell fill="#f3f4f6" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-800 tracking-tight">
                          {completionPercentage}%
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                          Complete
                        </span>
                      </div>
                    </div>

                    {/* Gift Box Logic */}
                    <div
                      className={`w-full rounded-xl p-4 border transition-all duration-300 ${
                        isGiftClaimed
                          ? "bg-green-50 border-green-200"
                          : completionPercentage >= 100
                            ? "bg-blue-50 border-blue-200 cursor-pointer hover:shadow-md hover:scale-105"
                            : "bg-slate-50 border-slate-100 opacity-80"
                      }`}
                      onClick={handleClaimGift}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${isGiftClaimed ? "text-green-600" : "text-slate-500"}`}
                        >
                          {isGiftClaimed ? "Rewards Claimed" : "Reward Chest"}
                        </span>
                        {isGiftClaimed ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${completionPercentage >= 100 ? "bg-yellow-400 text-yellow-900 animate-pulse" : "bg-slate-200 text-slate-500"}`}
                          >
                            {completionPercentage >= 100 ? "OPEN ME!" : "LOCKED"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-center py-2">
                        {isGiftClaimed ? (
                          <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="text-4xl mb-1">👐</div>
                            <p className="text-xs font-bold text-green-600">+500 Gems Received!</p>
                          </div>
                        ) : (
                          <div
                            className={`text-5xl transition-transform duration-500 ${completionPercentage >= 100 ? "animate-bounce cursor-pointer" : "grayscale opacity-50"}`}
                          >
                            🎁
                          </div>
                        )}
                      </div>

                      {!isGiftClaimed && (
                        <p className="text-[10px] text-slate-400 mt-2">
                          {completionPercentage >= 100
                            ? "Tap to claim your daily reward!"
                            : "Complete all missions to unlock"}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Leaderboard - Enhanced with interactivity */}
                <Card className="border-none shadow-md bg-white overflow-hidden h-fit">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-3">Leaderboard</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setLeaderboardTab("friends")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          leaderboardTab === "friends"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Friends
                      </button>
                      <button
                        onClick={() => setLeaderboardTab("global")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          leaderboardTab === "global"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Global
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white pb-6">
                    <div className="flex justify-center items-end gap-3 mb-6 h-36">
                      {/* Rank 2 */}
                      <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 mb-2 flex items-center justify-center text-white font-bold shadow-md">
                          2
                        </div>
                        <span className="text-xs font-bold text-slate-700 mb-1">
                          {leaderboardData[1].name.split(" ")[1]}
                        </span>
                        <div className="w-14 h-20 bg-gradient-to-t from-slate-300 to-slate-400 rounded-t-xl shadow-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{leaderboardData[1].xp}</span>
                        </div>
                      </div>
                      {/* Rank 1 */}
                      <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <Trophy className="text-yellow-500 mb-1" size={20} />
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-2 flex items-center justify-center text-white font-bold shadow-lg border-2 border-yellow-300">
                          1
                        </div>
                        <span className="text-xs font-bold text-slate-700 mb-1">
                          {leaderboardData[0].name.split(" ")[1]}
                        </span>
                        <div className="w-16 h-28 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-xl shadow-xl flex items-center justify-center border-2 border-yellow-300">
                          <span className="text-white font-bold text-sm">{leaderboardData[0].xp}</span>
                        </div>
                      </div>
                      {/* Rank 3 */}
                      <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 mb-2 flex items-center justify-center text-white font-bold shadow-md">
                          3
                        </div>
                        <span className="text-xs font-bold text-slate-700 mb-1">
                          {leaderboardData[2].name.split(" ")[1]}
                        </span>
                        <div className="w-14 h-14 bg-gradient-to-t from-orange-300 to-orange-500 rounded-t-xl shadow-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{leaderboardData[2].xp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {leaderboardData.slice(3, 7).map((user) => (
                        <div
                          key={user.rank}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-white cursor-pointer group"
                        >
                          <span className="font-bold text-slate-800 w-6 text-center text-sm">{user.rank}</span>
                          <div
                            className={`w-9 h-9 rounded-full ${user.avatar} flex items-center justify-center font-bold text-slate-700 text-xs shadow-sm group-hover:scale-110 transition-transform`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                              {user.name}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <Flame size={12} className="text-orange-500" />
                              <span>{user.streak} days</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-blue-600">{user.xp}</span>
                            <p className="text-xs text-slate-400">XP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t-2 border-blue-100 bg-blue-50/30">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-blue-500 shadow-md">
                      <span className="font-bold text-blue-600 w-6 text-center text-sm">{leaderboardData[7].rank}</span>
                      <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                        {leaderboardData[7].name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-slate-800">{leaderboardData[7].name}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <Flame size={12} className="text-orange-500" />
                          <span>{leaderboardData[7].streak} days</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-600">{leaderboardData[7].xp}</span>
                        <p className="text-xs text-slate-400">XP</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            {/* End of Main Grid */}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedShopItem} onOpenChange={() => setSelectedShopItem(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedShopItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">{selectedShopItem.icon}</span>
                  {selectedShopItem.name}
                </DialogTitle>
                <DialogDescription className="text-slate-600">{selectedShopItem.description}</DialogDescription>
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
                  <span className="text-sm font-medium text-slate-600">Category</span>
                  <span className="text-sm font-bold text-slate-800">{selectedShopItem.category}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Price</span>
                  <span className="text-lg font-bold text-blue-600">{selectedShopItem.price} points</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-600">Status</span>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      selectedShopItem.status === "active"
                        ? "bg-green-100 text-green-700"
                        : selectedShopItem.status === "used"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {selectedShopItem.status.charAt(0).toUpperCase() + selectedShopItem.status.slice(1)}
                  </span>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedShopItem(null)} className="flex-1">
                  Close
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={selectedShopItem.status !== "unused"}
                >
                  {selectedShopItem.status === "unused" ? "Purchase" : "Already Owned"}
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
              <ShoppingCart className="text-blue-600" />
              Reward Shop
            </DialogTitle>
            <DialogDescription>Browse and purchase items with your accumulated points</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <span className="text-sm font-medium text-slate-700">Your Balance</span>
            <span className="text-2xl font-bold text-blue-600">💎 4300 points</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsShopDialogOpen(false)
                  setSelectedShopItem(item)
                }}
                className="flex flex-col gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white group"
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
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.icon} {item.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-blue-600">{item.price}</span>
                    <span className="text-xs text-slate-400">points</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}

/* --- Helper Components --- */

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl">{icon}</div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-slate-900 font-bold text-lg">{value}</p>
      </div>
    </div>
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

  const getColorClass = (count: number) => {
    if (count === -1) return "bg-transparent"
    if (count === 0) return "bg-slate-100"
    if (count === 1) return "bg-green-200"
    if (count === 2) return "bg-green-400"
    if (count === 3) return "bg-blue-400"
    if (count >= 4) return "bg-blue-600"
    return "bg-slate-100"
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
              style={{ marginLeft: i === 0 ? 0 : `${(month.offset - (monthLabels[i - 1]?.offset || 0)) * 17}px` }}
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
                  className={`w-[14px] h-[14px] rounded-sm ${getColorClass(day.count)} transition-all hover:ring-2 hover:ring-slate-400 hover:scale-110 cursor-pointer`}
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
            <div className="w-[14px] h-[14px] rounded-sm bg-green-200"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-green-400"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-blue-400"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-blue-600"></div>
          </div>
          <span>Nhiều</span>
        </div>
      </div>
    </div>
  )
}
