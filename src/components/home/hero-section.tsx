"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { InteractiveGridBackground } from "@/components/ui/interactive-grid-background";
import { StackedCardBackground } from "@/components/home/stacked-card-background";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

export function HeroSection() {
  const partnerLogos = [
    { src: "/bc-logo.png", alt: "British Council" },
    { src: "/idp-logo.png", alt: "IDP" },
    { src: "/cambridge-logo.png", alt: "Cambridge" },
    { src: "/toefl-logo.png", alt: "TOEFL" },
    { src: "/ielts-logo.png", alt: "IELTS" },
  ];

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16">
        <InteractiveGridBackground
          rows={12}
          cols={20}
          className="z-0 opacity-80"
        />

        <div className="pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left">
              <RevealOnScroll className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary-100 shadow-sm cursor-pointer hover:bg-primary-100 transition-colors">
                <Sparkles className="w-4 h-4 fill-primary-400 text-primary-500" />
                <span>The #1 AI-Powered English Platform</span>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h1 className="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.1] tracking-tight text-gray-700">
                  Daily<span className="text-primary-500">Eng</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-6 leading-relaxed text-gray-500">
                  Master English the <br className="hidden lg:block" />
                  <span className="text-primary-500 font-semibold">
                    Smart & Fun Way!
                  </span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">
                  Stop memorizing lists. Start using the language. Practice with
                  real-world scenarios, AI tutors, and personalized roadmaps.
                </p>
              </RevealOnScroll>

              <RevealOnScroll
                delay={400}
                className="flex flex-col sm:flex-row gap-4 pointer-events-auto w-full sm:w-auto"
              >
                <Link
                  href="/auth/signup"
                  className="pointer-events-auto w-full sm:w-auto cursor-pointer"
                >
                  <Button
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto bg-primary-400 hover:bg-primary-500 text-white px-8 py-6 rounded-full text-lg font-bold border-2 border-primary-700 cursor-pointer"
                  >
                    Start Learning Free
                  </Button>
                </Link>
                <Link
                  href="/help"
                  className="pointer-events-auto w-full sm:w-auto cursor-pointer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-primary-200 text-primary-700 hover:border-primary-300 hover:bg-primary-50 px-8 py-6 rounded-full text-lg bg-transparent cursor-pointer"
                  >
                    How it works
                  </Button>
                </Link>
              </RevealOnScroll>

              <RevealOnScroll
                delay={500}
                className="mt-8 flex items-center gap-4 text-sm text-gray-500"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                    >
                      <Image
                        src={`/placeholder-user.jpg`}
                        width={32}
                        height={32}
                        alt="User"
                      />
                    </div>
                  ))}
                </div>
                <p>Trusted by 10,000+ learners</p>
              </RevealOnScroll>
            </div>

            {/* Right Visual - StackedCardCarousel */}
            <div
              className="relative w-full pointer-events-auto lg:pl-10 animate-fade-in-up"
              style={{ animationDelay: "600ms" }}
            >
              <div className="absolute -inset-4 bg-linear-to-r from-primary-100 to-secondary-100 rounded-full opacity-30 blur-3xl z-0" />
              <StackedCardBackground
                images={[
                  "/learning.png",
                  "/abstract-job-concept.png",
                  "/diverse-travelers-world-map.png",
                  "/diverse-food-spread.png",
                ]}
                autoPlayInterval={3000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logos Marquee - Infinite Loop, No Grayscale */}
      <section className="py-8 bg-background border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Prepared for success with
          </p>
        </div>

        <div className="relative flex overflow-hidden">
          {/* First set of logos */}
          <div className="flex animate-scroll-left whitespace-nowrap py-2">
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div
                key={`logo-1-${index}`}
                className="flex items-center justify-center mx-12 w-32 h-16 relative"
              >
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
