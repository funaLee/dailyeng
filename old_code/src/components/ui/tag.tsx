import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, AlertCircle, XCircle, Loader, CircleDot, Pause, Play } from "lucide-react"

const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border-[1.4px] transition-colors",
  {
    variants: {
      variant: {
        // Success states - green
        completed: "bg-success-100 text-success-300 border-success-200",
        done: "bg-success-100 text-success-300 border-success-200",
        active: "bg-success-100 text-success-300 border-success-200",

        // Warning states - yellow/amber
        pending: "bg-warning-100 text-warning-300 border-warning-200",
        inProgress: "bg-warning-100 text-warning-300 border-warning-200",
        waiting: "bg-warning-100 text-warning-300 border-warning-200",

        //blue
        notYet: "bg-info-100 text-info-200 border-info-200",

        // Error states - red
        
        failed: "bg-error-100 text-error-300",
        cancelled: "bg-error-100 text-error-300",

        // Info states - blue
        info: "bg-info-100 text-info-300",
        scheduled: "bg-info-100 text-info-300",
        new: "bg-info-100 text-info-300",

        // Neutral states - gray
        default: "bg-gray-100 text-gray-600",
        paused: "bg-gray-100 text-gray-600",
        draft: "bg-gray-100 text-gray-600",

        // Primary states - blue-violet
        primary: "bg-primary-100 text-primary-700",

        // Secondary states - pink
        secondary: "bg-secondary-100 text-secondary-700",

        // Accent states - mint
        accent: "bg-accent-100 text-accent-700",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

// Icon mapping for each variant
const variantIcons: Record<string, React.ElementType> = {
  completed: CheckCircle2,
  done: CheckCircle2,
  active: Play,
  pending: Clock,
  inProgress: Loader,
  waiting: Clock,
  notYet: XCircle,
  failed: AlertCircle,
  cancelled: XCircle,
  info: CircleDot,
  scheduled: Clock,
  new: CircleDot,
  default: CircleDot,
  paused: Pause,
  draft: CircleDot,
  primary: CircleDot,
  secondary: CircleDot,
  accent: CircleDot,
}

// Label mapping for auto-generated labels
const variantLabels: Record<string, string> = {
  completed: "Completed",
  done: "Done",
  active: "Active",
  pending: "Pending",
  inProgress: "In Progress",
  waiting: "Waiting",
  notYet: "Not Yet",
  failed: "Failed",
  cancelled: "Cancelled",
  info: "Info",
  scheduled: "Scheduled",
  new: "New",
  default: "Default",
  paused: "Paused",
  draft: "Draft",
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
}

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  showIcon?: boolean
  icon?: React.ElementType
}

function Tag({ className, variant = "default", size, showIcon = true, icon, children, ...props }: TagProps) {
  const IconComponent = icon || (variant ? variantIcons[variant] : variantIcons.default)
  const defaultLabel = variant ? variantLabels[variant] : variantLabels.default
  const isSpinning = variant === "inProgress"

  return (
    <span className={cn(tagVariants({ variant, size }), className)} {...props}>
      {showIcon && IconComponent && <IconComponent className={cn("size-3.5")} />}
      {children || defaultLabel}
    </span>
  )
}

export { Tag, tagVariants }
