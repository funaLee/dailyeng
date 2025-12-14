"use client"

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Check,
  Sparkles,
  Target,
  BookOpen,
  Flame,
  Clock,
  TrendingUp,
} from "lucide-react";
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";

interface Mission {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

interface ProfilePageClientProps {
  missions: Mission[];
  activityData: Record<string, number>;
  userName?: string;
}

export default function ProfilePageClient({
  missions,
  activityData,
  userName = "User",
}: ProfilePageClientProps) {
  // Auth is handled by ProtectedRoute wrapper - no need for Zustand auth state
  const [activeMissionTab, setActiveMissionTab] = useState<
    "today" | "weekly" | "monthly"
  >("today");
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [animatingMission, setAnimatingMission] = useState<string | null>(null);

  const toggleMission = (id: string) => {
    setAnimatingMission(id);
    setTimeout(() => {
      setCompletedMissions((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
      setAnimatingMission(null);
    }, 300);
  };

  return (
    <ProtectedRoute
      pageName="Profile"
      pageDescription="Track your learning progress, complete daily missions, and view your achievements."
      pageIcon={PageIcons.profile}
    >
      <div className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="md:col-span-3 lg:col-span-3 space-y-6">
            <UserProfileSidebar activePage="profile" userName={userName} />
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

            <div className="grid grid-cols-3 gap-4">
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
                label="Words Learned"
                value="342"
                icon={<BookOpen className="text-accent-500" size={20} />}
                trend="+15 new"
                trendUp={true}
                bgColor="bg-gradient-to-br from-accent-50 to-emerald-50"
                iconBg="bg-accent-100"
              />
            </div>

            {/* Study Heat Map */}
            <Card className="border-2 border-border shadow-md bg-white p-6 hover:shadow-xl transition-all duration-300">
              <ActivityHeatmap data={activityData} />
            </Card>

            {/* Daily Missions */}
            <Card className="shadow-md overflow-hidden flex flex-col bg-white border-2 border-border">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-primary-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <Target className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">Daily Missions</h2>
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
          </div>
        </div>
      </div>
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
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  bgColor?: string;
  iconBg?: string;
}) {
  return (
    <Card
      className={`p-4 border-none shadow-md ${bgColor} hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 ${iconBg} rounded-xl group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
          <p className="text-xl font-bold text-slate-800 truncate">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                trendUp ? "text-accent-600" : "text-slate-500"
              }`}
            >
              {trendUp && <TrendingUp size={10} />}
              {trend}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ActivityHeatmap({ data }: { data: Record<string, number> }) {
  const today = new Date();

  // Calculate stats from data
  const totalSessions = Object.values(data).reduce(
    (sum, count) => sum + count,
    0
  );
  const activeDays = Object.values(data).filter((count) => count > 0).length;

  // Calculate max streak
  const sortedDates = Object.keys(data).sort();
  let maxStreak = 0;
  let currentStreak = 0;

  sortedDates.forEach((date) => {
    if (data[date] > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Generate last 52 weeks of data (364 days) - like LeetCode
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 363);

  // Align to start of week (Sunday)
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  // Generate weeks array
  const weeks: Array<
    Array<{ date: string; count: number; isToday?: boolean }>
  > = [];
  const monthPositions: Array<{ month: string; weekIndex: number }> = [];
  let lastMonth = -1;

  for (let week = 0; week < 53; week++) {
    const weekDays: Array<{ date: string; count: number; isToday?: boolean }> =
      [];

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);
      const dateStr = currentDate.toISOString().split("T")[0];
      const isToday = dateStr === today.toISOString().split("T")[0];
      const isFuture = currentDate > today;

      // Track month changes (on first day of week)
      if (day === 0) {
        const month = currentDate.getMonth();
        if (month !== lastMonth && !isFuture) {
          monthPositions.push({
            month: currentDate.toLocaleDateString("vi-VN", { month: "short" }),
            weekIndex: week,
          });
          lastMonth = month;
        }
      }

      weekDays.push({
        date: isFuture ? "" : dateStr,
        count: isFuture ? -1 : data[dateStr] || 0,
        isToday,
      });
    }
    weeks.push(weekDays);
  }

  const getColor = (count: number) => {
    if (count === -1) return "bg-transparent";
    if (count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (count === 1) return "bg-primary-200";
    if (count === 2) return "bg-primary-300";
    if (count === 3) return "bg-primary-400";
    return "bg-primary-500";
  };

  const dayLabels = ["", "T2", "", "T4", "", "T6", ""];

  return (
    <div className="w-full">
      {/* Stats Header - LeetCode style */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {totalSessions}
          </span>
          <span className="text-slate-600 text-sm">
            phiên học trong năm qua
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Ngày hoạt động:</span>
            <span className="font-semibold text-slate-700">{activeDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Chuỗi dài nhất:</span>
            <span className="font-semibold text-slate-700">{maxStreak}</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1 min-w-full">
          {/* Grid with day labels */}
          <div className="flex gap-[3px]">
            {/* Day labels column */}
            <div className="flex flex-col gap-[3px] pr-2 w-6">
              {dayLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="h-[11px] text-[10px] text-slate-400 flex items-center justify-end"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {week.map((day, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`w-[11px] h-[11px] rounded-sm ${getColor(
                      day.count
                    )} 
                      ${
                        day.isToday
                          ? "ring-1 ring-primary-500 ring-offset-1"
                          : ""
                      }
                      ${
                        day.count >= 0
                          ? "hover:ring-1 hover:ring-slate-400 cursor-pointer"
                          : ""
                      }
                      transition-all`}
                    title={
                      day.date ? `${day.date}: ${day.count} phiên học` : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="flex gap-[3px] pl-8">
            {monthPositions.map((pos, idx) => {
              const nextPos = monthPositions[idx + 1]?.weekIndex || 53;
              const width = (nextPos - pos.weekIndex) * 14; // 11px cell + 3px gap
              return (
                <div
                  key={idx}
                  className="text-[10px] text-slate-400 capitalize"
                  style={{ width: `${width}px`, minWidth: `${width}px` }}
                >
                  {pos.month}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-slate-400">
        <span>Ít</span>
        <div className="flex gap-[2px]">
          <div className="w-[11px] h-[11px] rounded-sm bg-slate-100"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary-200"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary-300"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary-400"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary-500"></div>
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
}

