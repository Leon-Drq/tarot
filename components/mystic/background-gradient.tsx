"use client"

export function BackgroundGradient() {
  return (
    <div
      data-home-background-gradient
      className="absolute inset-0 z-[1]"
      style={{
        background: `radial-gradient(circle at 50% var(--home-hero-light-y, var(--home-hero-visual-center-y, 52svh)),
          #40345f 0%,
          #1b1827 38%,
          #0b0b11 70%,
          #030405 100%)`,
      }}
    />
  )
}
