"use client"

export function BackgroundGradient() {
  return (
    <div
      data-home-background-gradient
      className="absolute inset-0 z-[1]"
      style={{
        background: `radial-gradient(circle at 50% var(--home-hero-light-y, var(--home-hero-visual-center-y, 52svh)),
          #4c2a78 0%,
          #251240 40%,
          #0d0516 70%,
          #020103 100%)`,
      }}
    />
  )
}
