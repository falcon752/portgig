import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonsProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary"
  size?: "lg" | "fullWidth"
}

const Buttons = React.forwardRef<HTMLAnchorElement, ButtonsProps>(
  ({ className, variant = "primary", size = "lg", children, ...props }, ref) => {
    const baseStyles =
      "font-light font-raleway cursor-pointer flex items-center justify-center text-center rounded transition-colors duration-200"

    const variantStyles = {
      primary: "bg-[#0A1754] text-white hover:bg-[#2A3B6B]", 
    }

    const sizeStyles = {
      lg: "px-2 py-3 max-w-40",
      fullWidth: "px-8 py-3 w-full",
    }

    return (
      <a className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} ref={ref} {...props}>
        {children}
      </a>
    )
  },
)
Buttons.displayName = "Buttons"

export { Buttons }
