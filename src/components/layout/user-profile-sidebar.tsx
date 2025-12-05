"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
// Loại bỏ usePathname để tránh xung đột logic với prop active
import { LayoutDashboard, BookOpen, Target, UserIcon, Bell, Settings, HeartHandshake, LogOut, ShoppingBasket } from "lucide-react"

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  href?: string
  active?: boolean
  badge?: string
  variant?: "default" | "danger"
}

function NavButton({ icon, label, href = "#", active, badge, variant = "default" }: NavButtonProps) {
  // Logic CŨ (Gây lỗi): const isActive = active || pathname === href
  
  // Logic MỚI: Chỉ phụ thuộc vào prop 'active' được truyền vào.
  // Nếu active không được truyền (undefined), mặc định là false.
  const isActive = active ?? false

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-primary-100 text-primary-900 font-semibold"
          : variant === "danger"
            ? "text-red-600 hover:bg-red-50"
            : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
          {badge}
        </span>
      )}
    </Link>
  )
}

interface UserProfileSidebarProps {
  activePage?:
    | "dashboard"
    | "shop"
    | "collections"
    | "plan"
    | "profile"
    | "notifications"
    | "settings"
    | "supports"
    | "courses"
}

export function UserProfileSidebar({ activePage = "dashboard" }: UserProfileSidebarProps) {
  return (
    <Card className="border-border border-2 shadow-sm bg-white overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-primary-200 bg-primary-200 overflow-hidden shadow-sm mb-3">
            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-2xl">
              T
            </div>
          </div>
          <h3 className="font-semibold text-base text-primary-900 text-center">
            Le Thi Thanh Truc
          </h3>
        </div>

        <div className="border-t border-primary-200 mb-4" />

        <div className="space-y-1">
          <h3 className="font-bold text-xs uppercase text-primary-900 mb-2 px-2">
            Learning
          </h3>
          <NavButton
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            href="/user/dashboard"
            active={activePage === "dashboard"}
          />
          <NavButton
            icon={<BookOpen size={16} />}
            label="Collections"
            href="/user/collections"
            active={activePage === "collections"}
          />
          <NavButton
            icon={<ShoppingBasket size={16} />}
            label="Items Shop"
            href="/user/shop"
            active={activePage === "shop"}
          />
          <NavButton
            icon={<Target size={16} />}
            label="Registered Courses"
            href="/user/courses"
            active={activePage === "courses"}
          />

          <div className="my-3 border-t border-primary-200" />

          <h3 className="font-bold text-xs uppercase text-primary-900 mb-2 px-2">
            Account
          </h3>
          <NavButton
            icon={<UserIcon size={16} />}
            label="Profile"
            href="/user/profile"
            active={activePage === "profile"}
          />
          <NavButton
            icon={<Bell size={16} />}
            label="Notification"
            href="/user/notifications"
            active={activePage === "notifications"}
          />
          <NavButton
            icon={<Settings size={16} />}
            label="Settings"
            href="/user/settings"
            active={activePage === "settings"}
          />
          <NavButton
            icon={<HeartHandshake size={16} />}
            label="Support"
            href="/user/support"
            active={activePage === "supports"}
          />

          <div className="my-3 border-t border-slate-200" />

          <NavButton
            icon={<LogOut size={16} />}
            label="Sign Out"
            href="/logout"
            variant="danger"
          />
        </div>
      </div>
    </Card>
  );
}