"use client"
import { useMemo } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

interface StarsLayerProps {
  count?: number
}

function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

export function StarsLayer({ count = 150 }: StarsLayerProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededValue(i + 1) * 100,
      y: seededValue(i + 101) * 100,
      size: seededValue(i + 201) > 0.85 ? 2 : seededValue(i + 301) > 0.5 ? 1.5 : 1,
      opacity: seededValue(i + 401) * 0.7 + 0.3,
      duration: seededValue(i + 501) * 3 + 2,
      delay: seededValue(i + 601) * 5,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 z-[2] overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
