import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { KittyTutor } from "@/components/layout/kitty-tutor"
import { SearchCommand } from "@/components/layout/search-command"
import "@/app/globals.css"
import { Suspense } from "react"

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   variable: "--font-montserrat",
// })

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "EnglishFlow - Learn English with AI",
  description: "Master English with AI-powered vocabulary, speaking, and grammar lessons.",
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
      <body className={`${nunito.className} bg-background text-foreground`}>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <main className="min-h-screen">{children}</main>
          <KittyTutor />
          <SearchCommand />
        </Suspense>
        <Footer />
      </body>
    </html>
  )
}
