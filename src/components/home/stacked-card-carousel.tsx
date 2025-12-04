"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StackedCardCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export function StackedCardCarousel({
  images,
  autoPlayInterval = 4000,
}: StackedCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate which image should be on the back face based on direction
  const backIndex =
    flipDirection === "next"
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;

  const handleFlip = useCallback(
    (direction: "next" | "prev") => {
      if (isFlipping) return;

      setIsFlipping(true);
      setFlipDirection(direction);

      // Wait for animation to finish before updating state
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (direction === "next") return (prev + 1) % images.length;
          return (prev - 1 + images.length) % images.length;
        });
        setIsFlipping(false);
      }, 600); // Match this with CSS transition duration
    },
    [images.length, isFlipping]
  );

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isFlipping) {
      timerRef.current = setInterval(() => {
        handleFlip("next");
      }, autoPlayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isFlipping, handleFlip, autoPlayInterval]);

  const handleManualNavigation = (direction: "next" | "prev") => {
    setIsAutoPlaying(false);
    handleFlip(direction);

    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Determine the rotation transform
  // When flipping 'next', rotate to -180deg
  // When flipping 'prev', rotate to 180deg
  // When stable, stay at 0deg
  const rotationTransform = isFlipping
    ? flipDirection === "next"
      ? "rotateY(-180deg)"
      : "rotateY(180deg)"
    : "rotateY(0deg)";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center py-8">
      {/* 3D Card Container */}
      <div className="relative w-full max-w-2xl aspect-[16/10] group [perspective:1000px] mb-8">
        {/* Flipping Element */}
        <div
          className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-600 ease-in-out"
          style={{ transform: rotationTransform }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Slide ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white"
            style={{ transform: "rotateY(180deg)" }}
          >
            <Image
              src={images[backIndex] || "/placeholder.svg"}
              alt={`Slide ${backIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Decorative Elements (Static Backgrounds) */}
        <div className="absolute -inset-4 bg-[#C2E2FA] rounded-[2.5rem] -z-10 rotate-3 opacity-40 transition-transform duration-500 group-hover:rotate-6"></div>
        <div className="absolute -inset-4 bg-blue-100 rounded-[2.5rem] -z-20 -rotate-2 opacity-40 transition-transform duration-500 group-hover:-rotate-4"></div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleManualNavigation("prev")}
          className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-[#C2E2FA] hover:bg-[#C2E2FA] hover:text-blue-900 transition-all bg-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Indicators */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                // Determine direction based on click
                const direction = index > currentIndex ? "next" : "prev";
                if (index !== currentIndex) handleManualNavigation(direction);
              }}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 bg-blue-600"
                  : "w-2.5 bg-gray-300 hover:bg-blue-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleManualNavigation("next")}
          className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-[#C2E2FA] hover:bg-[#C2E2FA] hover:text-blue-900 transition-all bg-white"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
