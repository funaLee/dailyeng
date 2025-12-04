"use client"

import { useState, useEffect } from "react"

interface InteractiveGridBackgroundProps {
  rows?: number
  cols?: number
  className?: string
}

// hàm generate chung
// function generateHighlightedCells(rows: number, cols: number) {
//   const set = new Set<string>()
//   const highlightCount = Math.floor((rows * cols) / 8)

//   for (let i = 0; i < highlightCount; i++) {
//     const randomRow = Math.floor(Math.random() * rows)
//     const randomCol = Math.floor(Math.random() * cols)
//     set.add(`${randomRow}-${randomCol}`)
//   }

//   return set
// }

export function InteractiveGridBackground({ rows = 6, cols = 8, className = "" }: InteractiveGridBackgroundProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)
  const [fadingCells, setFadingCells] = useState<Set<string>>(new Set())

  // ✅ giữ state cho highlightedCells, không random lại mỗi render
  // const [highlightedCells, setHighlightedCells] = useState<Set<string>>(() =>
  //   generateHighlightedCells(rows, cols),
  // )

  // nếu rows/cols đổi, random lại một lần
  // useEffect(() => {
  //   setHighlightedCells(generateHighlightedCells(rows, cols))
  // }, [rows, cols])

  const handleMouseEnter = (cellId: string) => {
    setHoveredCell(cellId)
    setFadingCells((prev) => {
      const newSet = new Set(prev)
      newSet.delete(cellId)
      return newSet
    })
  }

  const handleMouseLeave = (cellId: string) => {
    setHoveredCell(null)
    setFadingCells((prev) => new Set(prev).add(cellId))

    setTimeout(() => {
      setFadingCells((prev) => {
        const newSet = new Set(prev)
        newSet.delete(cellId)
        return newSet
      })
    }, 500)
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        className="w-full h-full grid gap-0"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`
            // const isHighlighted = highlightedCells.has(cellId)
            const isHovered = hoveredCell === cellId
            const isFading = fadingCells.has(cellId)

            return (
              <div
                key={cellId}
                onMouseEnter={() => handleMouseEnter(cellId)}
                onMouseLeave={() => handleMouseLeave(cellId)}
                className={`
                  border border-gray-200/30 
                  transition-all duration-500 ease-out
                  cursor-pointer
                  ${!isHovered && !isFading ? "bg-white" : ""}
                  ${isHovered ? "bg-primary-200 border-foreground" : ""}
                  ${isFading ? "bg-primary-50 border-foreground" : ""}
                  ${!isHovered && !isFading ? "bg-transparent" : ""}
                `}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}
