"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
}

export function Button3D({ children, className, variant = "primary", size = "md", disabled, ...props }: Button3DProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const variants = {
    primary: {
      shadow: isHovered || isPressed ? "bg-primary-700" : "bg-primary-400",
      button: isHovered || isPressed ? "bg-primary-400" : "bg-primary-300",
      outline: isHovered || isPressed ? "outline-primary-500" : "outline-primary-300",
      text: "text-primary-900",
    },
    secondary: {
      shadow: isHovered || isPressed ? "bg-secondary-500" : "bg-secondary-300",
      button: isHovered || isPressed ? "bg-secondary-300" : "bg-secondary-200",
      outline: isHovered || isPressed ? "outline-secondary-500" : "outline-secondary-300",
      text: "text-secondary-900",
    },
    success: {
      shadow: isHovered || isPressed ? "bg-accent-500" : "bg-accent-300",
      button: isHovered || isPressed ? "bg-accent-300" : "bg-accent-200",
      outline: isHovered || isPressed ? "outline-accent-500" : "outline-accent-300",
      text: "text-accent-900",
    },
    danger: {
      shadow: isHovered || isPressed ? "bg-red-500" : "bg-red-300",
      button: isHovered || isPressed ? "bg-red-300" : "bg-red-200",
      outline: isHovered || isPressed ? "outline-red-500" : "outline-red-300",
      text: "text-red-900",
    },
  }

  const sizes = {
    // use min-width + padding so the button grows with content and supports wrapping
    sm: "min-w-[56px] h-7 text-[11px] px-3 py-1",
    md: "min-w-[96px] h-9 text-sm px-4 py-2",
    lg: "min-w-[140px] h-11 text-base px-6 py-2",
  }

  const currentVariant = variants[variant]
  const currentSize = sizes[size]

  const getButtonTop = () => {
    if (isPressed) return "top-[2px]"
    if (isHovered) return "top-[-2px]"
    return "top-0"
  }

  return (
    <button
      className={cn(
        "relative cursor-pointer inline-flex items-center justify-center overflow-hidden",
        // apply min-width/height from size mapping
        currentSize,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        if (!disabled) {
          setIsHovered(false)
          setIsPressed(false)
        }
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      {...props}
    >
      {/* Shadow layer */}
      <div
        className={cn(
          "absolute left-0 top-[3px] inline-flex justify-center items-center gap-2 transition-colors duration-100 pointer-events-none",
          currentVariant.shadow,
          // make shadow layer fill the button dimensions so it follows the actual width/height
          "w-full h-full",
        )}
        style={{ borderRadius: "inherit" }}
      >
        {/* invisible element to preserve width/height for shadow */}
            <span className="text-center font-bold font-['Nunito'] leading-4 opacity-0 whitespace-pre-wrap wrap-break-word">{children}</span>
      </div>

      {/* Main button layer */}
      <div
        className={cn(
          "absolute left-0 outline -outline-offset-1 inline-flex justify-center items-center gap-1.5 transition-all duration-100",
          currentVariant.button,
          currentVariant.outline,
          currentVariant.text,
          "w-full h-full",
          // When pressing/hovering we translate the top layer to create the 3D effect.
              isPressed ? "translate-y-0.5" : isHovered ? "-translate-y-0.5" : "translate-y-0",
        )}
        style={{ borderRadius: "inherit" }}
      >
            <span className="text-center font-bold font-['Nunito'] leading-5 whitespace-pre-wrap wrap-break-word">{children}</span>
      </div>
    </button>
  )
}
