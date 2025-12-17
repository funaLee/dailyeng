"use client"

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, BookOpen, Flame, TrendingUp, Quote } from "lucide-react";
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface ProfilePageClientProps {
  activityData: Record<string, number>;
  userName?: string;
  userLevel?: string;
  currentStreak?: number;
  quote?: { text: string; author: string } | null;
}

export default function ProfilePageClient({
  activityData,
  userName = "User",
  userLevel = "A1",
  currentStreak = 0,
  quote,
}: ProfilePageClientProps) {
  // Get avatar from profile context
  const { profile } = useUserProfile();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
            <UserProfileSidebar
              activePage="profile"
              userName={profile?.name || userName}
              userImage={profile?.image}
            />
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="md:col-span-9 lg:col-span-9 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-50 to-secondary-50 p-6 text-white shadow-sm border-2 border-border">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary-600 text-sm font-medium">
                      {getGreeting()} ✨
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-primary-800">
                    Welcome back, {profile?.name || userName}!
                  </h1>
                  <p className="text-primary-600 text-sm">
                    {currentStreak > 0
                      ? `You're on a ${currentStreak}-day streak! Keep up the great work and complete today's missions.`
                      : "Start your learning journey today and build your streak!"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                    <p className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                      Current Level
                    </p>
                    <div className="text-3xl font-black mt-1 text-secondary-500">
                      {userLevel}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total Study Time"
                value="48h 30m"
                icon={<Clock className="text-yellow-500" size={20} />}
                trend="+1h 20m today"
                trendUp={true}
                bgColor="bg-gradient-to-br from-yellow-50 to-orange-50"
                iconBg="bg-yellow-100"
              />
              <StatCard
                label="Day Streak"
                value={
                  currentStreak === 0
                    ? "0 Days"
                    : `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`
                }
                icon={<Flame className="text-orange-500" size={20} />}
                trend={currentStreak > 0 ? "Keep going!" : "Start today!"}
                trendUp={currentStreak > 0}
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
            <Card className="border-2 border-border shadow-md bg-white p-6">
              <ActivityHeatmap data={activityData} />
            </Card>

            {/* Daily Quote */}
            {quote && (
              <Card className="border-2 border-border shadow-md bg-white p-8">
                <div className="flex flex-col items-center text-center">
                  <Quote className="w-10 h-10 text-primary-300 mb-4 rotate-180" />
                  <blockquote className="text-lg md:text-xl font-medium text-slate-700 italic leading-relaxed max-w-2xl">
                    "{quote.text}"
                  </blockquote>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-primary-300"></div>
                    <cite className="text-sm font-semibold text-primary-600 not-italic">
                      {quote.author}
                    </cite>
                    <div className="w-8 h-[2px] bg-primary-300"></div>
                  </div>
                </div>
              </Card>
            )}
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
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    date: string;
    count: number;
  } | null>(null);

  // Calculate stats from data
  const totalLessons = Object.values(data).reduce(
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

  // GitHub-style green color scale - every 3 lessons changes color
  const getColor = (count: number) => {
    if (count === -1) return "bg-transparent"; // Future days
    if (count === 0) return "bg-[#ebedf0]"; // No activity - GitHub gray
    if (count <= 3) return "bg-[#9be9a8]"; // 1-3 lessons - Level 1 lightest green
    if (count <= 6) return "bg-[#40c463]"; // 4-6 lessons - Level 2
    if (count <= 9) return "bg-[#30a14e]"; // 7-9 lessons - Level 3
    return "bg-[#216e39]"; // 10+ lessons - Level 4 (max) - darkest green
  };

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: { date: string; count: number }
  ) => {
    if (!day.date) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      date: day.date,
      count: day.count,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="w-full">
      {/* Stats Header - LeetCode style */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {totalLessons}
          </span>
          <span className="text-slate-600 text-sm">
            lessons in the past year
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Active days:</span>
            <span className="font-semibold text-slate-700">{activeDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Max streak:</span>
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
            <div className="flex flex-col gap-[3px] pr-2 w-8">
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
                    className={`w-[11px] h-[11px] rounded-[3px] ${getColor(
                      day.count
                    )} 
                      ${
                        day.isToday
                          ? "ring-1 ring-emerald-600 ring-offset-1"
                          : ""
                      }
                      ${day.date ? "cursor-pointer" : ""}`}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
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

      {/* Legend - centered */}
      <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-400">
        <span>Less</span>
        <div className="flex gap-[2px]">
          <div className="w-[11px] h-[11px] rounded-[3px] bg-[#ebedf0]"></div>
          <div className="w-[11px] h-[11px] rounded-[3px] bg-[#9be9a8]"></div>
          <div className="w-[11px] h-[11px] rounded-[3px] bg-[#40c463]"></div>
          <div className="w-[11px] h-[11px] rounded-[3px] bg-[#30a14e]"></div>
          <div className="w-[11px] h-[11px] rounded-[3px] bg-[#216e39]"></div>
        </div>
        <span>More</span>
      </div>

      {/* Custom Tooltip */}
      {tooltip && tooltip.show && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <div className="font-semibold text-emerald-400">
              {tooltip.count} {tooltip.count === 1 ? "lesson" : "lessons"}
            </div>
            <div className="text-slate-300 text-[10px] mt-0.5">
              {formatDate(tooltip.date)}
            </div>
          </div>
          <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}

