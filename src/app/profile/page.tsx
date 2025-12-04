"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar";
import {
  Upload,
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Users,
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

type TabType = "personal" | "password" | "link";

export default function ProfileNewPage() {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [formData, setFormData] = useState({
    fullName: "Le Thi Thanh Truc",
    email: "tructt@gmail.com",
    dob: "12-03-2005",
    phone: "0123456789",
    sex: "Female",
    address: "ABC Street",
    level: "A1-A2 beginners",
  });

  return (
    <ProtectedRoute
      pageName="Profile"
      pageDescription="View and manage your account settings and personal information."
      pageIcon={<UserIcon className="w-10 h-10 text-primary" />}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar activePage="profile" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header with Profile Picture */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">
                  Hello, Thanh Truc!
                </h1>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-primary/20">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center text-primary font-bold text-4xl">
                        T
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant={"default"}
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
                    >
                      <Upload className="h-5 w-5 text-primary-foreground" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs and Form */}
            <Card className="border-border shadow-sm">
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
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullName: e.target.value,
                              })
                            }
                            className="pl-10 border-input"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Email:
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="pl-10 border-input"
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Date of birth:
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            value={formData.dob}
                            onChange={(e) =>
                              setFormData({ ...formData, dob: e.target.value })
                            }
                            className="pl-10 border-input"
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Phone number:
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="pl-10 border-input"
                          />
                        </div>
                      </div>

                      {/* Sex */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Sex:
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                          <Input
                            value={formData.sex}
                            onChange={(e) =>
                              setFormData({ ...formData, sex: e.target.value })
                            }
                            className="pl-10 border-input"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Address
                        </label>
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
                            className="pl-10 border-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="max-w-md">
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Level:
                      </label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) =>
                          setFormData({ ...formData, level: value })
                        }
                      >
                        <SelectTrigger className="border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1-A2 beginners">
                            A1-A2 beginners
                          </SelectItem>
                          <SelectItem value="B1-B2 intermediate">
                            B1-B2 intermediate
                          </SelectItem>
                          <SelectItem value="C1-C2 advanced">
                            C1-C2 advanced
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                        Save details
                      </Button>
                      <Button
                        variant="outline"
                        className="border-input px-8 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Change Password Tab */}
                {activeTab === "password" && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Change password functionality coming soon...
                    </p>
                  </div>
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
