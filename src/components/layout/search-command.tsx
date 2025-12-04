"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function SearchCommand() {
  const pathname = usePathname()
  const { searchOpen, setSearchOpen } = useAppStore()
  const [query, setQuery] = useState("")

  const isImmersivePage =
    pathname?.startsWith("/speaking/session/") ||
    (pathname?.startsWith("/vocab/") && pathname !== "/vocab") ||
    (pathname?.startsWith("/grammar/") && pathname !== "/grammar")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (!isImmersivePage) {
          setSearchOpen(!searchOpen)
        }
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen, setSearchOpen, isImmersivePage])

  if (isImmersivePage) {
    return null
  }

  if (!searchOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSearchOpen(false)} />

      {/* Command Palette */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl bg-background border border-border shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, vocabulary, help..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 hover:bg-secondary rounded"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-2 max-h-64 overflow-y-auto">
            {query ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                Search results for "{query}" would appear here
              </div>
            ) : (
              <div className="text-xs text-muted-foreground p-4 space-y-2">
                <p className="font-semibold">Quick Links</p>
                <ul className="space-y-1">
                  <li>• Vocabulary Hub</li>
                  <li>• Speaking Room</li>
                  <li>• Study Plan</li>
                  <li>• Your Notebook</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
