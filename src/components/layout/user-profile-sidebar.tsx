"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { signOut } from "next-auth/react";
import { UserIcon, Bell, Settings, HelpCircle, LogOut } from "lucide-react";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  badge?: string;
  variant?: "default" | "danger";
}

function NavButton({
  icon,
  label,
  href = "#",
  active,
  badge,
  variant = "default",
}: NavButtonProps) {
  const isActive = active ?? false;

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
  );
}

function SignOutButton() {
  const handleSignOut = async () => {
    // Use callbackUrl to redirect to homepage after sign out
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-red-600 hover:bg-red-50 w-full text-left"
    >
      <LogOut size={16} />
      <span className="flex-1">Sign Out</span>
    </button>
  );
}

interface UserProfileSidebarProps {
  activePage?: "plan" | "profile" | "notifications" | "settings" | "help";
  userName?: string;
}

export function UserProfileSidebar({
  activePage = "profile",
  userName = "User",
}: UserProfileSidebarProps) {
  const userInitial = userName.charAt(0).toUpperCase() || "U";
  return (
    <Card className="border-border border-2 shadow-sm bg-white overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-primary-200 bg-primary-200 overflow-hidden shadow-sm mb-3">
            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-2xl">
              {userInitial}
            </div>
          </div>
          <h3 className="font-semibold text-base text-primary-900 text-center">
            {userName}
          </h3>
        </div>

        <div className="border-t border-primary-200 mb-4" />

        <div className="space-y-1">
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
            icon={<HelpCircle size={16} />}
            label="Helps"
            href="/helps"
            active={activePage === "help"}
          />

          <div className="my-3 border-t border-slate-200" />

          <SignOutButton />
        </div>
      </div>
    </Card>
  );
}
