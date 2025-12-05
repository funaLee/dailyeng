"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface HubHeroProps {
  title: string
  description: string
  // Thêm prop cho hình ảnh
  imageSrc?: string
  primaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  notification?: {
    text: string
    actionLabel: string
    onClick?: () => void
  }
  decorativeWords?: string[]
  children?: ReactNode
}

export function HubHero({
  title,
  description,
  imageSrc = "/learning.png", // Hình ảnh mặc định
  primaryAction,
  secondaryAction,
  notification,
  decorativeWords = ["vocabulary", "learning", "mastery"],
}: HubHeroProps) {
  return (
    <Card className="relative mb-8 overflow-hidden rounded-3xl border-[1.4px] border-primary-200 bg-white p-8">
      {/* --- LEFT SIDE: Content --- */}
      {/* Thêm max-w-[60%] (hoặc số khác tùy ý) để text tự xuống dòng trước khi chạm vào ảnh */}
      <div className="relative z-10 flex h-full max-w-full flex-col justify-center md:max-w-[60%]">
        <h1 className="mb-2 text-4xl font-bold">{title}</h1>
        <p className="mb-6 text-muted-foreground">{description}</p>
        
        <div className="mb-4 flex flex-wrap gap-3">
          {primaryAction && (
            <Button variant="default" className="gap-2 cursor-pointer">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" className="gap-2 bg-transparent cursor-pointer">
              {secondaryAction.label}
            </Button>
          )}
        </div>

        {notification && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{notification.text}</span>
            <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
              {notification.actionLabel}
            </Button>
          </div>
        )}
      </div>

      {/* --- RIGHT SIDE: Image with Fade Effect --- */}
      <div className="absolute bottom-0 right-0 top-0 w-1/2 md:w-[55%] pointer-events-none select-none">
        {/* Container chứa ảnh */}
        <div className="relative h-full w-full">
            {/* Hiệu ứng mờ dần (Fade):
                Sử dụng mask-image linear-gradient:
                - Bên phải (black): hiển thị 100%
                - Bên trái (transparent): mờ dần đi để hòa vào nền
            */}
            <img 
                src={imageSrc} 
                alt="Hero background" 
                className="h-full w-full object-cover"
                style={{
                    maskImage: "linear-gradient(to left, black 50%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to left, black 50%, transparent 100%)"
                }}
            />

            {/* Nếu bạn vẫn muốn giữ lại decorativeWords đè lên ảnh thì uncomment đoạn dưới này. 
                Hiện tại tôi ẩn đi để hình ảnh được rõ ràng hơn theo style hiện đại. 
            */}
            {/* <div className="absolute inset-0 overflow-hidden">
                {decorativeWords[0] && (
                <div className="absolute right-12 top-12 rotate-12 text-6xl font-bold text-white/20 mix-blend-overlay">
                    {decorativeWords[0]}
                </div>
                )}
                {decorativeWords[1] && (
                <div className="absolute right-24 top-32 -rotate-6 text-5xl font-bold text-white/20 mix-blend-overlay">
                    {decorativeWords[1]}
                </div>
                )}
            </div> 
            */}
        </div>
      </div>
    </Card>
  )
}