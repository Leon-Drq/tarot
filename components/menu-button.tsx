"use client"

import { cn } from "@/lib/utils"

interface MenuButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function MenuButton({ isOpen, onClick, className }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex flex-col items-center justify-center gap-2 sm:gap-2.5 group transition-all duration-300",
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <span
        className={`block w-6 sm:w-7 md:w-8 h-0.5 bg-mystic-foreground-subtle transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-1.5 sm:translate-y-2" : "group-hover:bg-mystic-foreground"
        }`}
      />
      <span
        className={`block w-6 sm:w-7 md:w-8 h-0.5 bg-mystic-foreground-subtle transition-all duration-300 ${
          isOpen ? "-rotate-45 -translate-y-1.5 sm:-translate-y-2" : "group-hover:bg-mystic-foreground"
        }`}
      />
    </button>
  )
}
