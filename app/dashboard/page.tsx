"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Check, 
  ChevronRight, 
  Trophy, 
  Sparkles, 
  Target, 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Flame,
  Calendar as CalendarIcon,
  ShoppingBag,
  Clock,
  Gift,
  Gift as GiftIcon
} from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"
import { toast } from "sonner" // Assuming you have sonner or use-toast setup

export default function DashboardPage() {
  const { user, isAuthenticated } = useAppStore()
  const [activeMissionTab, setActiveMissionTab] = useState<"today" | "weekly" | "monthly">("today")
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [leaderboardTab, setLeaderboardTab] = useState<"friends" | "global">("friends")
  const [isGiftClaimed, setIsGiftClaimed] = useState(false)
  
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
  const completedCount = missions.filter(m => m.completed || completedMissions.includes(m.id)).length
  const completionPercentage = Math.round((completedCount / totalMissions) * 100)
  
  // Chart Data
  const pieData = [
    { name: "Completed", value: completionPercentage },
    { name: "Remaining", value: 100 - completionPercentage },
  ]

  const handleClaimGift = () => {
    if (completionPercentage < 100) return;
    setIsGiftClaimed(true);
    // Show success message
    // alert("You received 500 Gems and a 2x XP Boost!"); 
  }

  const leaderboardData = [
    { rank: 1, name: "Hoàng Nam", xp: "3,100", avatar: "bg-yellow-200" },
    { rank: 2, name: "Minh Tú", xp: "2,850", avatar: "bg-gray-200" },
    { rank: 3, name: "Lan Anh", xp: "2,720", avatar: "bg-orange-200" },
    { rank: 56, name: "Thanh Truc", xp: "1,240", avatar: "bg-blue-200", isCurrentUser: true },
  ]

  const shopItems = [
    { id: 1, name: "Streak Freeze", price: 300, icon: "❄️" },
    { id: 2, name: "Double XP", price: 500, icon: "⚡" },
    { id: 3, name: "Avatar Frame", price: 1000, icon: "🖼️" },
  ]

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p>Please sign in to view dashboard</p>
        <Button asChild className="mt-4"><Link href="/auth/signin">Sign In</Link></Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="md:col-span-3 lg:col-span-3 space-y-6">
            {/* User Profile Card */}
            <Card className="border-none shadow-md bg-white overflow-hidden">
               <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
               <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 absolute -top-10 overflow-hidden shadow-sm">
                     <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">
                        {(user?.name || "T").charAt(0)}
                     </div>
                  </div>
                  <div className="mt-12">
                     <h3 className="font-bold text-lg text-slate-900">{user?.name || "Le Thi Thanh Truc"}</h3>
                     <p className="text-sm text-slate-500">Student • Premium Member</p>
                  </div>

                  <div className="mt-6 space-y-1">
                     <NavButton icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                     <NavButton icon={<BookOpen size={18} />} label="My Collections" />
                     <NavButton icon={<Bell size={18} />} label="Notifications" badge="2" />
                     <NavButton icon={<Target size={18} />} label="My Plan" />
                     <div className="my-2 border-t border-slate-100" />
                     <NavButton icon={<UserIcon size={18} />} label="Profile Settings" />
                     <NavButton icon={<LogOut size={18} />} label="Sign Out" variant="danger" />
                  </div>
               </div>
            </Card>

            {/* Quick Stats */}
            <Card className="border-none shadow-md bg-white p-4">
                <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                    <CalendarIcon size={16} /> Activity Log
                </h4>
                <div className="flex flex-wrap gap-1 justify-center">
                    {Array.from({ length: 28 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-3 h-3 rounded-sm ${Math.random() > 0.4 ? 'bg-blue-500' : 'bg-slate-100'}`}
                        />
                    ))}
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">Keep your streak going!</p>
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
                    <div className="text-2xl font-black text-blue-600">A2 <span className="text-sm font-normal text-slate-400">/ B1</span></div>
                </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total XP" value="12,450" icon={<Sparkles className="text-yellow-500" />} />
                <StatCard label="Day Streak" value="3 Days" icon={<Flame className="text-orange-500" />} />
                <StatCard label="Rank" value="#56" icon={<Trophy className="text-blue-500" />} />
                <StatCard label="Words Learned" value="342" icon={<BookOpen className="text-green-500" />} />
             </div>

             {/* 2. The Mission Center */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mission List */}
                <Card className="lg:col-span-2 border-none shadow-md overflow-hidden flex flex-col">
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
                            {["Today", "Weekly", "Monthly"].map(tab => (
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
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                                        completedMissions.includes(mission.id) || mission.completed
                                        ? "bg-blue-500 border-blue-500 text-white" 
                                        : "border-slate-300 text-transparent group-hover:border-blue-400"
                                    }`}>
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${completedMissions.includes(mission.id) || mission.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
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

                {/* Progress & Gift - UPDATED STYLE */}
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
                                            <stop offset="0%" stopColor="#F472B6" /> {/* Pink */}
                                            <stop offset="50%" stopColor="#A78BFA" /> {/* Purple */}
                                            <stop offset="100%" stopColor="#3B82F6" /> {/* Blue */}
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
                                <span className={`text-xs font-bold uppercase tracking-wider ${isGiftClaimed ? "text-green-600" : "text-slate-500"}`}>
                                    {isGiftClaimed ? "Rewards Claimed" : "Reward Chest"}
                                </span>
                                {isGiftClaimed ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${completionPercentage >= 100 ? "bg-yellow-400 text-yellow-900 animate-pulse" : "bg-slate-200 text-slate-500"}`}>
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
                                    <div className={`text-5xl transition-transform duration-500 ${completionPercentage >= 100 ? "animate-bounce cursor-pointer" : "grayscale opacity-50"}`}>
                                        🎁
                                    </div>
                                )}
                            </div>
                            
                            {!isGiftClaimed && (
                                <p className="text-[10px] text-slate-400 mt-2">
                                    {completionPercentage >= 100 ? "Tap to claim your daily reward!" : "Complete all missions to unlock"}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
             </div>

             {/* 3. Bottom Grid: Leaderboard & Shop */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Leaderboard */}
                <Card className="lg:col-span-2 border-none shadow-md bg-white">
                    <CardHeader className="border-b border-slate-100 py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Trophy className="text-yellow-500" /> Leaderboard
                            </CardTitle>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setLeaderboardTab("friends")}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${leaderboardTab === "friends" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}
                                >
                                    Friends
                                </button>
                                <button 
                                    onClick={() => setLeaderboardTab("global")}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${leaderboardTab === "global" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}
                                >
                                    Global
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Top 3 Podium */}
                        <div className="flex justify-center items-end h-40 gap-4 pb-4 border-b border-slate-50 bg-gradient-to-b from-white to-blue-50/30 pt-6">
                            {/* Rank 2 */}
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm mb-2 z-10" />
                                <div className="w-16 h-20 bg-blue-200 rounded-t-lg relative flex justify-center items-start pt-2">
                                    <span className="text-blue-800 font-bold text-xl">2</span>
                                </div>
                                <p className="text-xs font-bold text-slate-600 mt-1">Minh Tú</p>
                            </div>
                            {/* Rank 1 */}
                            <div className="flex flex-col items-center">
                                <div className="absolute -mt-14 text-2xl">👑</div>
                                <div className="w-14 h-14 rounded-full bg-yellow-200 border-4 border-white shadow-md mb-2 z-10" />
                                <div className="w-20 h-28 bg-yellow-300 rounded-t-lg relative flex justify-center items-start pt-2 shadow-lg">
                                    <span className="text-yellow-800 font-bold text-3xl">1</span>
                                </div>
                                <p className="text-xs font-bold text-slate-600 mt-1">Hoàng Nam</p>
                            </div>
                            {/* Rank 3 */}
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-white shadow-sm mb-2 z-10" />
                                <div className="w-16 h-16 bg-orange-200 rounded-t-lg relative flex justify-center items-start pt-2">
                                    <span className="text-orange-800 font-bold text-xl">3</span>
                                </div>
                                <p className="text-xs font-bold text-slate-600 mt-1">Lan Anh</p>
                            </div>
                        </div>
                        
                        {/* List View */}
                        <div className="p-4 space-y-2">
                            <div className="text-center text-slate-400 text-xs py-1">...</div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-slate-700 w-6">56</span>
                                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">T</div>
                                    <span className="font-bold text-slate-800 text-sm">Thanh Truc (You)</span>
                                </div>
                                <div className="font-mono font-bold text-blue-600 text-sm">1,240 XP</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reward Shop Preview */}
                <Card className="border-none shadow-md bg-white flex flex-col">
                    <CardHeader className="border-b border-slate-100 py-4">
                        <div className="flex items-center justify-between">
                             <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ShoppingBag className="text-purple-500" /> Shop
                            </CardTitle>
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                4,300 Pts
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                        <div className="space-y-3">
                            {shopItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{item.name}</p>
                                            <p className="text-xs text-slate-400">Power-up</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50">
                                        {item.price}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-4 pt-0">
                        <Button variant="ghost" className="w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium">
                            Visit Shop <ChevronRight size={16} />
                        </Button>
                    </div>
                </Card>

             </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* --- Helper Components --- */

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                <p className="text-slate-900 font-bold text-lg">{value}</p>
            </div>
        </div>
    )
}

function NavButton({ icon, label, active = false, badge, variant = 'default' }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, variant?: 'default' | 'danger' }) {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left relative"
    const activeClass = "bg-blue-50 text-blue-700"
    const defaultClass = "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    const dangerClass = "text-red-500 hover:bg-red-50 hover:text-red-600"

    let className = baseClass
    if (active) className += ` ${activeClass}`
    else if (variant === 'danger') className += ` ${dangerClass}`
    else className += ` ${defaultClass}`

    return (
        <button className={className}>
            {icon}
            {label}
            {badge && (
                <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </button>
    )
}