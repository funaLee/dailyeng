"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { Search, Filter, ArrowUpDown, Star, GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface Course {
  id: string
  title: string
  subtitle: string
  image: string
  category: "vocabulary" | "grammar"
  status: "sold-out" | "active" | "available"
  rating: number
  registrations: number
  expiredDate: string
}

export default function RegisteredCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSkill, setFilterSkill] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const courses: Course[] = [
    {
      id: "v1",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "vocabulary",
      status: "sold-out",
      rating: 3,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "v2",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "vocabulary",
      status: "sold-out",
      rating: 3,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "v3",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "vocabulary",
      status: "sold-out",
      rating: 3,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "g1",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "grammar",
      status: "sold-out",
      rating: 2,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "g2",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "grammar",
      status: "sold-out",
      rating: 2,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
    {
      id: "g3",
      title: "AI and technology",
      subtitle: "You'll lose, kkk",
      image: "/learning.jpg",
      category: "grammar",
      status: "sold-out",
      rating: 2,
      registrations: 2190,
      expiredDate: "21-10-2022",
    },
  ]

  const vocabularyCourses = courses.filter((c) => c.category === "vocabulary")
  const grammarCourses = courses.filter((c) => c.category === "grammar")

  return (
    <ProtectedRoute
      pageName="Registered Courses"
      pageDescription="View and manage your enrolled courses and track your learning progress."
      pageIcon={<GraduationCap className="w-10 h-10 text-primary" />}
    >
      <div className="container mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <UserProfileSidebar activePage="collections" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Hello, Thanh Truc!</h1>
              </CardContent>
            </Card>

            {/* Search and Filter Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-input focus:border-primary focus:ring-primary"
                />
              </div>

              <Select value={filterSkill} onValueChange={setFilterSkill}>
                <SelectTrigger className="w-[200px] border-input">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="By skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="border-input"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Newest
              </Button>
            </div>

            {/* Vocabulary Section */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Vocabulary</h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {vocabularyCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="border-border shadow-sm overflow-hidden group hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-muted-foreground text-background border-none">
                          Sold out
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-bold text-base text-foreground">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">{course.subtitle}</p>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-1">
                            {Array.from({ length: course.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {course.registrations.toLocaleString()} registers
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground/70 italic">Expired {course.expiredDate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grammar Section */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Grammar</h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {grammarCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="border-border shadow-sm overflow-hidden group hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-muted-foreground text-background border-none">
                          Sold out
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-bold text-base text-foreground">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">{course.subtitle}</p>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-1">
                            {Array.from({ length: course.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {course.registrations.toLocaleString()} registers
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground/70 italic">Expired {course.expiredDate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
