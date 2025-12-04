import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// <CHANGE> Upgraded button system with hard shadow (no blur), hover lift and active press effects
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-2 border-primary-700 shadow-[3px_3px_0px_0px_var(--primary-700)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--primary-700)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--primary-700)]",
        destructive:
          "bg-destructive text-white shadow-[3px_3px_0px_0px_var(--error-300)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--error-300)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--error-300)]",
        outline:
          "border-2 border-primary-300 bg-background text-primary-700 shadow-[3px_3px_0px_0px_var(--primary-200)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--primary-200)] hover:bg-primary-50 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--primary-200)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[3px_3px_0px_0px_var(--secondary-400)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--secondary-600)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--secondary-700)]",
        ghost: "hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100",
        link: "text-primary underline-offset-4 hover:underline active:text-primary-700",
        accent:
          "bg-accent text-accent-foreground shadow-[3px_3px_0px_0px_var(--accent-600)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--accent-600)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--accent-600)]",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-8 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
