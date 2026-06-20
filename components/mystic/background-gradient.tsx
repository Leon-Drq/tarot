"use client"

export function BackgroundGradient() {
  return (
    <div
      className="absolute inset-0 z-[1]"
      style={{
        background: `radial-gradient(circle at 50% 50%, 
          #4c2a78 0%, 
          #251240 40%, 
          #0d0516 70%, 
          #020103 100%)`,
      }}
    />
  )
}
