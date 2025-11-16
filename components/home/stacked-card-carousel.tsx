"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface StackedCardCarouselProps {
  images: string[]
  autoPlayInterval?: number
}

export function StackedCardCarousel({ images, autoPlayInterval = 5000 }: StackedCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isShuffling, setIsShuffling] = useState(false)

  const nextSlide = useCallback(() => {
    setIsShuffling(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
      setIsShuffling(false)
    }, 600)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setIsShuffling(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      setIsShuffling(false)
    }, 600)
  }, [images.length])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlaying, autoPlayInterval, nextSlide])

  // Reset auto-play when user manually navigates
  const handleManualNavigation = (direction: "next" | "prev") => {
    setIsAutoPlaying(false)
    if (direction === "next") {
      nextSlide()
    } else {
      prevSlide()
    }
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  // Get the visible card indices for stacking effect
  const getVisibleIndices = () => {
    const indices = []
    for (let i = 0; i < Math.min(4, images.length); i++) {
      indices.push((currentIndex + i) % images.length)
    }
    return indices
  }

  const visibleIndices = getVisibleIndices()

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-8">
      {/* Stacked Cards Container */}
      <div className="relative w-full max-w-3xl h-[500px] mb-8">
        {visibleIndices.map((imageIndex, stackPosition) => {
          const isActive = stackPosition === 0
          let scale, translateY, translateX, rotate, zIndex, opacity
          
          if (isShuffling && isActive) {
            scale = 0.7
            translateY = 400
            translateX = 120
            rotate = 15
            zIndex = 0
            opacity = 0.3
          } else if (isShuffling && stackPosition > 0) {
            const targetPosition = stackPosition - 1
            scale = 1 - targetPosition * 0.05
            translateY = targetPosition * 20
            translateX = targetPosition * 30
            rotate = targetPosition * 3
            zIndex = 10 - targetPosition
            opacity = targetPosition === 0 ? 1 : 0.7
          } else {
            scale = 1 - stackPosition * 0.05
            translateY = stackPosition * 20
            translateX = stackPosition * 30
            rotate = stackPosition * 3
            zIndex = 10 - stackPosition
            opacity = isActive ? 1 : 0.7
          }

          return (
            <div
              key={`${imageIndex}-${stackPosition}`}
              className="absolute inset-0 transition-all duration-600 ease-out"
              style={{
                transform: `
                  translateX(${translateX}px) 
                  translateY(${translateY}px) 
                  scale(${scale}) 
                  rotate(${rotate}deg)
                `,
                zIndex,
                opacity,
              }}
            >
              <div
                className={`w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-600 ${
                  isActive ? "ring-4 ring-[#C2E2FA]" : ""
                }`}
              >
                <Image
                  src={images[imageIndex] || "/placeholder.svg"}
                  alt={`Slide ${imageIndex + 1}`}
                  fill
                  className="object-cover rounded-3xl"
                  priority={isActive}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleManualNavigation("prev")}
          className="w-12 h-12 rounded-full border-2 border-[#C2E2FA] hover:bg-[#C2E2FA] hover:text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Indicators */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlaying(false)
                setTimeout(() => setIsAutoPlaying(true), 10000)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-[#C2E2FA]" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleManualNavigation("next")}
          className="w-12 h-12 rounded-full border-2 border-[#C2E2FA] hover:bg-[#C2E2FA] hover:text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Auto-play indicator */}
      <div className="mt-4 text-sm text-gray-500">
        {isAutoPlaying ? "Auto-playing..." : "Manual control"}
      </div>
    </div>
  )
}
