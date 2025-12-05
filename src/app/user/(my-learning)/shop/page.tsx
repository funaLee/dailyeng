"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Search, Coins, Clock, Check } from "lucide-react"
import Image from "next/image"
import { UserProfileSidebar } from "@/components/layout/user-profile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

const shopItems = [
  {
    id: 1,
    name: "Streak Freeze",
    category: "Power-up",
    description: "Protect your streak! One free missed day won't break your progress.",
    price: 500,
    icon: "🧊",
    image: "/learning.jpg",
    status: "available",
    details: "Valid for 7 days after purchase. Can be stacked up to 3 times.",
  },
  {
    id: 2,
    name: "Double XP",
    category: "Boost",
    description: "Earn 2x experience points for 24 hours on all activities.",
    price: 800,
    icon: "⚡",
    image: "/learning.jpg",
    status: "active",
    details: "Activates immediately upon purchase. Cannot be paused once started.",
  },
  {
    id: 3,
    name: "Premium Avatar",
    category: "Cosmetic",
    description: "Unlock exclusive avatar frames and badges for your profile.",
    price: 1200,
    icon: "👑",
    image: "/learning.jpg",
    status: "available",
  },
  {
    id: 4,
    name: "Skip Challenge",
    category: "Power-up",
    description: "Skip one difficult challenge or test without penalty.",
    price: 600,
    icon: "🎯",
    image: "/learning.jpg",
    status: "available",
  },
  {
    id: 5,
    name: "Unlimited Hearts",
    category: "Boost",
    description: "No more heart limits for 7 days. Practice as much as you want!",
    price: 1500,
    icon: "❤️",
    image: "/learning.jpg",
    status: "used",
  },
  {
    id: 6,
    name: "Lesson Unlock",
    category: "Access",
    description: "Unlock any locked lesson or topic immediately.",
    price: 400,
    icon: "🔓",
    image: "/learning.jpg",
    status: "available",
  },
  {
    id: 7,
    name: "AI Tutor Session",
    category: "Learning",
    description: "Get 30 minutes of personalized 1-on-1 AI tutoring.",
    price: 2000,
    icon: "🤖",
    image: "/learning.jpg",
    status: "available",
  },
  {
    id: 8,
    name: "Progress Report",
    category: "Analytics",
    description: "Detailed analytics of your learning progress and insights.",
    price: 300,
    icon: "📊",
    image: "/learning.jpg",
    status: "available",
  },
]

export default function ShopPage() {
  const [selectedItem, setSelectedItem] = useState<(typeof shopItems)[0] | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [userPoints] = useState(4300)

  const filteredItems = shopItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || item.category.toLowerCase() === activeFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const categories = ["all", ...Array.from(new Set(shopItems.map((item) => item.category.toLowerCase())))]

  return (
    <ProtectedRoute
      pageName="Reward Shop"
      pageDescription="Exchange your earned points for amazing rewards and power-ups."
      pageIcon={<ShoppingCart className="w-10 h-10 text-primary" />}
    >
      <div className="min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3 lg:col-span-3 space-y-6">
              <UserProfileSidebar activePage="shop" />
            </div>

            
            <div className="md:col-span-9 lg:col-span-9">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                      <ShoppingCart className="text-primary" size={32} />
                      Reward Shop
                    </h1>
                    <p className="text-muted-foreground mt-2">Exchange your earned points for amazing rewards</p>
                  </div>
                  <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-lg px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Coins size={28} className="text-yellow-300" />
                      <div>
                        <p className="text-xs text-primary-foreground/80">Your Balance</p>
                        <p className="text-2xl font-bold">{userPoints.toLocaleString()} pts</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Search for items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-input focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        variant={activeFilter === category ? "default" : "outline"}
                        className={`whitespace-nowrap ${
                          activeFilter === category
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="used">Used</TabsTrigger>
                </TabsList>

                <TabsContent value="available">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems
                      .filter((item) => item.status === "available")
                      .map((item) => (
                        <ShopItemCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedItem(item)}
                          userPoints={userPoints}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="active">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems
                      .filter((item) => item.status === "active")
                      .map((item) => (
                        <ShopItemCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedItem(item)}
                          userPoints={userPoints}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="used">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems
                      .filter((item) => item.status === "used")
                      .map((item) => (
                        <ShopItemCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedItem(item)}
                          userPoints={userPoints}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>

              {filteredItems.length === 0 && (
                <div className="text-center py-16">
                  <ShoppingCart size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function ShopItemCard({
  item,
  onClick,
  userPoints,
}: {
  item: (typeof shopItems)[0]
  onClick: () => void
  userPoints: number
}) {
  const canAfford = userPoints >= item.price

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 bg-card"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          {item.status === "active" && (
            <Badge className="bg-green-500 text-white shadow-md">
              <Check size={12} className="mr-1" />
              Active
            </Badge>
          )}
          {item.status === "used" && (
            <Badge className="bg-muted-foreground text-background shadow-md">
              <Clock size={12} className="mr-1" />
              Used
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 left-2 text-4xl bg-background/90 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          {item.icon}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Coins size={18} className="text-yellow-500" />
            <span className="text-lg font-bold text-primary">{item.price}</span>
          </div>
          {item.status === "available" && (
            <Badge
              variant={canAfford ? "default" : "outline"}
              className={canAfford ? "bg-primary" : "text-muted-foreground"}
            >
              {canAfford ? "Affordable" : "Save more"}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
