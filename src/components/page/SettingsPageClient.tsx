"use client";

import {
  useState,
  useTransition,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar";
import {
  User,
  Mail,
  Calendar as CalendarIcon,
  Phone,
  MapPin,
  Users,
  RotateCcw,
  Pencil,
  Save,
  X,
  Lock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ShieldX,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateUserProfile } from "@/actions/user";
import { changePassword } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { Level } from "@prisma/client";
import { useUserProfile } from "@/contexts/UserProfileContext";

type TabType = "personal" | "password" | "link";

interface SettingsFormData {
  name: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  address: string;
  level: string;
}

interface SettingsPageClientProps {
  initialFormData: SettingsFormData;
  isGoogleUser: boolean;
  userImage: string | null;
  showSuccessToast?: boolean;
}

// Level display mapping
const levelDisplayMap: Record<string, string> = {
  A1: "A1 - Beginner",
  A2: "A2 - Beginner",
  B1: "B1 - Intermediate",
  B2: "B2 - Intermediate",
  C1: "C1 - Advanced",
  C2: "C2 - Advanced",
};

// Parse DD/MM/YYYY to Date object
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

// Format Date to DD/MM/YYYY
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Change Password Section Component
function ChangePasswordSection({ isGoogleUser }: { isGoogleUser: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Hide success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to change password");
      }
    });
  };

  // Google users cannot change password
  if (isGoogleUser) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShieldX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Password Change Not Available
          </h3>
          <p className="text-muted-foreground max-w-sm">
            You signed in with Google, so you can only use Google to access your
            account. Password management is handled by Google.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success message */}
      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Password changed successfully!
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Current Password<span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="pl-10 pr-10 border-input"
              required
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            New Password<span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="pl-10 pr-10 border-input"
              required
              disabled={isPending}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters
          </p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Confirm New Password<span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="pl-10 pr-10 border-input"
              required
              disabled={isPending}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Toast Reader Component (handles URL params)
function ToastReader({
  onToast,
}: {
  onToast: (type: "success" | "error", message: string) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      onToast("success", "Profile updated successfully!");
      router.replace("/user/settings", { scroll: false });
    } else if (status === "error") {
      const errorMsg =
        searchParams.get("message") || "Failed to update profile";
      onToast("error", errorMsg);
      router.replace("/user/settings", { scroll: false });
    }
  }, [searchParams, router, onToast]);

  return null;
}

export default function SettingsPageClient({
  initialFormData,
  isGoogleUser,
  userImage,
}: SettingsPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);
  const [originalData] = useState<SettingsFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Avatar upload states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userImage);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // User profile context for refreshing
  const { refreshProfile } = useUserProfile();

  // Use originalData for display name (not affected by form edits)
  const displayName = originalData.name || "User";
  const userInitial = displayName.charAt(0).toUpperCase() || "U";

  // Handle toast from URL params
  const handleToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ show: true, type, message });
    },
    []
  );

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Check if a field has changed
  const hasFieldChanged = (field: keyof SettingsFormData) => {
    return formData[field] !== originalData[field];
  };

  // Reset a single field
  const resetField = (field: keyof SettingsFormData) => {
    setFormData({ ...formData, [field]: originalData[field] });
  };

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrorMessage("");
  };

  // Handle save
  const handleSave = () => {
    startTransition(async () => {
      // Email validation for non-Google users
      if (!isGoogleUser && formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setErrorMessage("Invalid email format");
          return;
        }
      }

      // Parse date for API
      const dateOfBirth = parseDate(formData.dateOfBirth);

      const result = await updateUserProfile({
        name: formData.name || undefined,
        email: isGoogleUser ? undefined : formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        dateOfBirth: dateOfBirth,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        level: (formData.level as Level) || undefined,
      });

      if (result.success) {
        // Redirect with success status to trigger toast after reload
        window.location.href = "/user/settings?status=success";
      } else {
        setErrorMessage(result.error || "Failed to update profile");
      }
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, dateOfBirth: formatDate(date) });
      setDatePickerOpen(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setToast({
        show: true,
        type: "error",
        message: "Invalid file type. Please use JPG, PNG, WebP or GIF.",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        show: true,
        type: "error",
        message: "File too large. Maximum size is 5MB.",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];

        const response = await fetch("/api/upload/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            mimeType: file.type,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setAvatarUrl(data.url);
          // Refresh profile context to update navbar and other components
          await refreshProfile();
          setToast({
            show: true,
            type: "success",
            message: "Avatar updated successfully!",
          });
        } else {
          setToast({
            show: true,
            type: "error",
            message: data.error || "Failed to upload avatar",
          });
        }

        setIsUploadingAvatar(false);
      };

      reader.onerror = () => {
        setToast({
          show: true,
          type: "error",
          message: "Failed to read file",
        });
        setIsUploadingAvatar(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to upload avatar",
      });
      setIsUploadingAvatar(false);
    }
  };

  return (
    <ProtectedRoute
      pageName="Settings"
      pageDescription="View and manage your account settings and personal information."
      pageIcon={<UserIcon className="w-10 h-10 text-primary" />}
    >
      {/* Toast Reader - wrapped in Suspense to prevent re-renders */}
      <Suspense fallback={null}>
        <ToastReader onToast={handleToast} />
      </Suspense>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300",
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar
              activePage="settings"
              userName={displayName}
              userImage={avatarUrl}
              onAvatarUpload={handleAvatarUpload}
              isUploadingAvatar={isUploadingAvatar}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Tabs and Form */}
            <Card className="border-border shadow-sm bg-white">
              <CardContent className="p-8">
                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-border">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`pb-3 px-2 text-base font-bold transition-colors border-b-2 ${
                      activeTab === "personal"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Personal information
                  </button>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`pb-3 px-2 text-base font-bold transition-colors border-b-2 ${
                      activeTab === "password"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setActiveTab("link")}
                    className={`pb-3 px-2 text-base font-bold transition-colors border-b-2 ${
                      activeTab === "link"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Link Account
                  </button>
                </div>

                {/* Personal Information Form */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Full name:<span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="Enter your full name"
                              className={cn(
                                "pl-10 border-input",
                                !isEditing &&
                                  "disabled:opacity-100 disabled:text-foreground disabled:cursor-default",
                                hasFieldChanged("name") && isEditing && "pr-10"
                              )}
                            />
                          </div>
                          {isEditing && hasFieldChanged("name") && (
                            <button
                              type="button"
                              onClick={() => resetField("name")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              title="Reset to original"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Email:<span className="text-destructive">*</span>
                          {isGoogleUser && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">
                              (Google account)
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <div className="relative">
                            {isGoogleUser ? (
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            )}
                            <Input
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              disabled={!isEditing || isGoogleUser}
                              placeholder="Enter your email"
                              className={cn(
                                "pl-10 border-input",
                                !isEditing &&
                                  "disabled:opacity-100 disabled:text-foreground disabled:cursor-default",
                                isGoogleUser && "bg-muted cursor-not-allowed",
                                hasFieldChanged("email") &&
                                  isEditing &&
                                  !isGoogleUser &&
                                  "pr-10"
                              )}
                            />
                          </div>
                          {isEditing &&
                            hasFieldChanged("email") &&
                            !isGoogleUser && (
                              <button
                                type="button"
                                onClick={() => resetField("email")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                title="Reset to original"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Date of birth:
                        </label>
                        <div className="relative">
                          <Popover
                            open={datePickerOpen && isEditing}
                            onOpenChange={setDatePickerOpen}
                          >
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  value={formData.dateOfBirth}
                                  readOnly
                                  disabled={!isEditing}
                                  placeholder="DD/MM/YYYY"
                                  className={cn(
                                    "pl-10 border-input cursor-pointer",
                                    !isEditing &&
                                      "disabled:opacity-100 disabled:text-foreground disabled:cursor-default",
                                    hasFieldChanged("dateOfBirth") &&
                                      isEditing &&
                                      "pr-10"
                                  )}
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  parseDate(formData.dateOfBirth) || undefined
                                }
                                onSelect={handleDateSelect}
                                defaultMonth={
                                  parseDate(formData.dateOfBirth) ||
                                  new Date(2000, 0, 1)
                                }
                                captionLayout="dropdown"
                                fromYear={1950}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                          {isEditing && hasFieldChanged("dateOfBirth") && (
                            <button
                              type="button"
                              onClick={() => resetField("dateOfBirth")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              title="Reset to original"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Phone number:
                        </label>
                        <div className="relative">
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phoneNumber: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="Enter your phone number"
                              className={cn(
                                "pl-10 border-input",
                                !isEditing &&
                                  "disabled:opacity-100 disabled:text-foreground disabled:cursor-default",
                                hasFieldChanged("phoneNumber") &&
                                  isEditing &&
                                  "pr-10"
                              )}
                            />
                          </div>
                          {isEditing && hasFieldChanged("phoneNumber") && (
                            <button
                              type="button"
                              onClick={() => resetField("phoneNumber")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              title="Reset to original"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sex - External reset button */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Sex:
                        </label>
                        <div className="flex items-center">
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                            <Select
                              value={formData.gender}
                              onValueChange={(value) =>
                                setFormData({ ...formData, gender: value })
                              }
                              disabled={!isEditing}
                            >
                              <SelectTrigger
                                className={cn(
                                  "pl-10 border-input w-[180px]",
                                  !isEditing &&
                                    "disabled:opacity-100 disabled:text-foreground disabled:cursor-default"
                                )}
                              >
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {isEditing && hasFieldChanged("gender") && (
                            <button
                              type="button"
                              onClick={() => resetField("gender")}
                              className="ml-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                              title="Reset to original"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Address:
                        </label>
                        <div className="relative">
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              value={formData.address}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  address: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="Enter your address"
                              className={cn(
                                "pl-10 border-input",
                                !isEditing &&
                                  "disabled:opacity-100 disabled:text-foreground disabled:cursor-default",
                                hasFieldChanged("address") &&
                                  isEditing &&
                                  "pr-10"
                              )}
                            />
                          </div>
                          {isEditing && hasFieldChanged("address") && (
                            <button
                              type="button"
                              onClick={() => resetField("address")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              title="Reset to original"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Level - External reset button */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Level:
                      </label>
                      <div className="flex items-center">
                        <div>
                          <Select
                            value={formData.level}
                            onValueChange={(value) =>
                              setFormData({ ...formData, level: value })
                            }
                            disabled={!isEditing}
                          >
                            <SelectTrigger
                              className={cn(
                                "border-input w-[200px]",
                                !isEditing &&
                                  "disabled:opacity-100 disabled:text-foreground disabled:cursor-default"
                              )}
                            >
                              <SelectValue placeholder="Select your level">
                                {formData.level
                                  ? levelDisplayMap[formData.level] ||
                                    formData.level
                                  : "Select your level"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1 - Beginner</SelectItem>
                              <SelectItem value="A2">A2 - Beginner</SelectItem>
                              <SelectItem value="B1">
                                B1 - Intermediate
                              </SelectItem>
                              <SelectItem value="B2">
                                B2 - Intermediate
                              </SelectItem>
                              <SelectItem value="C1">C1 - Advanced</SelectItem>
                              <SelectItem value="C2">C2 - Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {isEditing && hasFieldChanged("level") && (
                          <button
                            type="button"
                            onClick={() => resetField("level")}
                            className="ml-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                            title="Reset to original"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4">
                      <div className="flex gap-4">
                        {!isEditing ? (
                          <Button
                            onClick={handleEditClick}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={handleSave}
                              disabled={isPending}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancel}
                              disabled={isPending}
                              className="border-input px-8 bg-transparent"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Error Message (inline, not toast) */}
                      {errorMessage && (
                        <p className="text-sm font-medium text-red-600">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Change Password Tab */}
                {activeTab === "password" && (
                  <ChangePasswordSection isGoogleUser={isGoogleUser} />
                )}

                {/* Link Account Tab */}
                {activeTab === "link" && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Link account functionality coming soon...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
