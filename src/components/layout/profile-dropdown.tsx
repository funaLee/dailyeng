"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User, Settings, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/contexts/UserProfileContext";

export function ProfileDropdown() {
  const { data: session } = useSession();
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    // Clear Dorara chat history from localStorage to prevent seeing old messages
    if (typeof window !== "undefined") {
      localStorage.removeItem("dorara-chat-history");
    }
    await signOut({ callbackUrl: "/" });
  };

  // Use profile data if available, fallback to session
  const userName = profile?.name || session?.user?.name || "Guest User";
  const userImage = profile?.image || session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Profile">
          {userImage ? (
            <img
              src={userImage}
              alt="Profile"
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white border-gray-200 shadow-lg p-2"
      >
        {/* Avatar + Username */}
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
            {userImage ? (
              <img
                src={userImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <span className="text-gray-800 font-medium text-sm truncate">
            {userName}
          </span>
        </div>

        <DropdownMenuSeparator className="bg-gray-200" />

        {/* Menu Items */}
        {/* Profile */}
        <DropdownMenuItem
          asChild
          className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
        >
          <Link href="/user/profile" className="flex items-center gap-3 py-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem
          asChild
          className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
        >
          <Link href="/user/settings" className="flex items-center gap-3 py-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        {/* Helps */}
        <DropdownMenuItem
          asChild
          className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
        >
          <Link href="/helps" className="flex items-center gap-3 py-2">
            <HelpCircle className="h-4 w-4" />
            <span>Helps</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-200" />

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 py-2 group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4 group-hover:text-red-600" />
            <span>Sign Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
