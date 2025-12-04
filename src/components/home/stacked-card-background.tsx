"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface StackedCardBackgroundProps {
  images: string[]
  autoPlayInterval?: number
}

export function StackedCardBackground({ images, autoPlayInterval = 3000 }: StackedCardBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlayInterval, images.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-[400px] lg:h-[500px]">
      {/* Stacked cards effect */}
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((image, index) => {
          const isActive = index === currentIndex
          const isPrev = index === (currentIndex - 1 + images.length) % images.length
          const isNext = index === (currentIndex + 1) % images.length

          let transform = "scale(0.8) translateX(100%)"
          let opacity = 0
          let zIndex = 0

          if (isActive) {
            transform = "scale(1) translateX(0)"
            opacity = 1
            zIndex = 30
          } else if (isPrev) {
            transform = "scale(0.85) translateX(-60%)"
            opacity = 0.6
            zIndex = 20
          } else if (isNext) {
            transform = "scale(0.85) translateX(60%)"
            opacity = 0.6
            zIndex = 20
          }

          return (
            <div
              key={index}
              className="absolute w-[280px] h-[350px] lg:w-[320px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out"
              style={{
                transform,
                opacity,
                zIndex,
              }}
            >
              <Image src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              index === currentIndex ? "bg-blue-500 w-6" : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
