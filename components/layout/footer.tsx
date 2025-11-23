"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  const isImmersivePage =
    pathname?.startsWith("/speaking/session/") ||
    (pathname?.startsWith("/vocab/") && pathname !== "/vocab") ||
    (pathname?.startsWith("/grammar/") && pathname !== "/grammar")

  if (isImmersivePage) {
    return null
  }

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-4 text-lg">DailyEng</h3>
            <p className="text-sm text-muted-foreground">Learn English the Smart & Fun Way!</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/vocab" className="hover:text-foreground transition-colors">
                  Vocabulary Hub
                </Link>
              </li>
              <li>
                <Link href="/grammar" className="hover:text-foreground transition-colors">
                  Grammar Hub
                </Link>
              </li>
              <li>
                <Link href="/speaking" className="hover:text-foreground transition-colors">
                  Speaking Room
                </Link>
              </li>
              <li>
                <Link href="/notebook" className="hover:text-foreground transition-colors">
                  Notebook
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/plan" className="hover:text-foreground transition-colors">
                  Study Plan
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Help & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DailyEng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
