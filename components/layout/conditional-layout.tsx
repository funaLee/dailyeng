"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

// Routes that should NOT show navbar and footer
const noNavRoutes = ["/placement-test", "/speaking/session", "/vocab/", "/grammar/"]

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current route should hide navbar/footer
  const shouldHideNav = noNavRoutes.some((route) => pathname.startsWith(route))

  if (shouldHideNav) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
