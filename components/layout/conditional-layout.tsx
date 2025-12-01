"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const noNavRoutes = ["/placement-test", "/speaking/session", "/vocab/", "/grammar/", "/build-plan", "/auth"]

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
