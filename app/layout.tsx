import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { KittyTutor } from "@/components/layout/kitty-tutor"
import { SearchCommand } from "@/components/layout/search-command"
import "@/app/globals.css"
import { Suspense } from "react"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EnglishFlow - Learn English with AI",
  description: "Master English with AI-powered vocabulary, speaking, and grammar lessons.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (typeof window !== "undefined") {
    import("@/mocks/browser").then(({ worker }) => {
      worker.start()
    })
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <main className="min-h-screen">{children}</main>
          <KittyTutor />
          <SearchCommand />
        </Suspense>
        <footer className="border-t border-border bg-background/50 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">EnglishFlow</h3>
                <p className="text-sm text-muted-foreground">Learn English with AI-powered lessons</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="/vocab" className="hover:text-foreground">
                      Vocabulary
                    </a>
                  </li>
                  <li>
                    <a href="/speaking" className="hover:text-foreground">
                      Speaking
                    </a>
                  </li>
                  <li>
                    <a href="/notebook" className="hover:text-foreground">
                      Notebook
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="/help" className="hover:text-foreground">
                      Help
                    </a>
                  </li>
                  <li>
                    <a href="/plan" className="hover:text-foreground">
                      Study Plan
                    </a>
                  </li>
                  <li>
                    <a href="/profile" className="hover:text-foreground">
                      Profile
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 EnglishFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
