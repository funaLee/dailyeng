"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Bell, LayoutDashboard, BookOpen, LogOut, ChevronRight } from 'lucide-react'

type TabType = "personal" | "notification" | "dashboard" | "study-plan"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [isAuthenticated] = useState(true)

  const user = { name: "Le Thi Thanh Truc", email: "thanhtrucwy.21@gmail.com" }
  const stats = { xp: 12450, streak: 15, totalLearningMinutes: 1200, badges: [1, 2, 3, 4, 5, 6, 7, 8] }

  const studyPlans = {
    vocabulary: [
      { id: "v1", title: "IELTS Beginner", expiredDate: "2024-12-31" },
      { id: "v2", title: "Business English", expiredDate: "2025-01-15" },
      { id: "v3", title: "Travel English", expiredDate: "2025-02-28" },
    ],
    grammar: [
      { id: "g1", title: "Present Tenses", expiredDate: "2024-12-31" },
      { id: "g2", title: "Past Tenses", expiredDate: "2025-01-20" },
      { id: "g3", title: "Conditionals", expiredDate: "2025-03-10" },
    ],
  }

  const notifications = [
    { id: 1, heading: "New lesson available", content: "Your next grammar lesson is ready", date: "2024-01-15", time: "10:30 AM" },
    { id: 2, heading: "Streak reminder", content: "Keep your 15-day streak going!", date: "2024-01-14", time: "09:00 AM" },
    { id: 3, heading: "Achievement unlocked", content: "You earned the Week Warrior badge", date: "2024-01-13", time: "08:15 PM" },
    { id: 4, heading: "Study plan update", content: "Your IELTS plan is 65% complete", date: "2024-01-12", time: "03:45 PM" },
    { id: 5, heading: "New vocabulary added", content: "10 new words in your collection", date: "2024-01-11", time: "11:20 AM" },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My profile</h1>
          <p className="text-muted-foreground">Track your learning journey and achievements</p>
        </div>

        {/* 2 Column Grid Layout */}
        <div className="grid grid-cols-[300px_1fr] gap-6">
          
          {/* LEFT COLUMN - Fixed Navigation */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button
                    variant={activeTab === "personal" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("personal")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Personal Information
                  </Button>
                  
                  <Button
                    variant={activeTab === "notification" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notification")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notification
                  </Button>
                  
                  <Button
                    variant={activeTab === "dashboard" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  
                  <Button
                    variant={activeTab === "study-plan" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("study-plan")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Registered Study Plan
                  </Button>

                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Dynamic Content */}
          <div>
            
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                        L
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                        <p className="text-sm text-muted-foreground mt-2">Student</p>
                        <p className="text-sm text-muted-foreground">Ho Chi Minh City, Viet Nam</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Personal Details</h3>
                      <Button variant="outline" size="sm" className="rounded-full">Edit</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">First Name</label>
                        <Input placeholder="Le Thi" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Last Name</label>
                        <Input placeholder="Thanh Truc" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Gender</label>
                        <Input placeholder="Female" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email address</label>
                        <Input placeholder="thanhtrucwy.21@gmail.com" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone Number</label>
                        <Input placeholder="+84 123 456 789" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Date of birth</label>
                        <Input placeholder="01/21/2003" className="rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Additional Information</h3>
                      <Button variant="outline" size="sm" className="rounded-full">Edit</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Country</label>
                        <Input placeholder="Vietnam" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Job</label>
                        <Input placeholder="Student" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Company</label>
                        <Input placeholder="University" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Facebook link</label>
                        <Input placeholder="facebook.com/username" className="rounded-full" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">LinkedIn</label>
                        <Input placeholder="linkedin.com/in/username" className="rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notification Tab */}
            {activeTab === "notification" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Your notifications</h2>
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{notification.heading}</h3>
                          <p className="text-muted-foreground">{notification.content}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-sm text-muted-foreground">{notification.date}</p>
                          <p className="text-sm text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Learning Dashboard</h2>
                
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-blue-500">{stats.xp}</p>
                      <p className="text-sm text-muted-foreground mt-2">Total XP</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-red-500">{stats.streak}</p>
                      <p className="text-sm text-muted-foreground mt-2">Day Streak</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-green-500">{Math.floor(stats.totalLearningMinutes / 60)}h</p>
                      <p className="text-sm text-muted-foreground mt-2">Hours Studied</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-purple-500">{stats.badges.length}</p>
                      <p className="text-sm text-muted-foreground mt-2">Badges Earned</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Study Activity</h3>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Study heatmap visualization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Skills Overview</h3>
                    <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Skills radar chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Study Plan Tab */}
            {activeTab === "study-plan" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Vocabulary courses</h2>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {studyPlans.vocabulary.map((course) => (
                        <Card key={course.id}>
                          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-blue-500" />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold mb-1">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">Expired: {course.expiredDate}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Grammar Courses</h2>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {studyPlans.grammar.map((course) => (
                        <Card key={course.id}>
                          <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-green-500" />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold mb-1">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">Expired: {course.expiredDate}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}