"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        // Quick simplified variants to avoid needing Class Variance Authority since we are keeping it lightweight
        let variantClass = "bg-primary text-primary-foreground shadow hover:bg-primary/90"
        if (variant === "outline") variantClass = "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        if (variant === "ghost") variantClass = "hover:bg-accent hover:text-accent-foreground"
        if (variant === "destructive") variantClass = "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"

        let sizeClass = "h-9 px-4 py-2"
        if (size === "sm") sizeClass = "h-8 rounded-md px-3 text-xs"
        if (size === "lg") sizeClass = "h-10 rounded-md px-8"
        if (size === "icon") sizeClass = "h-9 w-9"

        return (
            <Comp
                className={cn(buttonVariants, variantClass, sizeClass, className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
