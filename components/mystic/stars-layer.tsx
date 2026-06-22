"use client"
import { useMemo } from "react"

interface Star {
  id: number
  x: string
  y: string
  size: string
  opacity: string
  duration: string
  delay: string
}

interface StarsLayerProps {
  count?: number
}

function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function formatStyleNumber(value: number, precision = 4) {
  return value.toFixed(precision).replace(/\.?0+$/, "")
}

export function StarsLayer({ count = 150 }: StarsLayerProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = seededValue(i + 201) > 0.85 ? 2 : seededValue(i + 301) > 0.5 ? 1.5 : 1
      return {
        id: i,
        x: `${formatStyleNumber(seededValue(i + 1) * 100)}%`,
        y: `${formatStyleNumber(seededValue(i + 101) * 100)}%`,
        size: `${formatStyleNumber(size, 1)}px`,
        opacity: formatStyleNumber(seededValue(i + 401) * 0.7 + 0.3),
        duration: `${formatStyleNumber(seededValue(i + 501) * 3 + 2)}s`,
        delay: `${formatStyleNumber(seededValue(i + 601) * 5)}s`,
      }
    })
  }, [count])

  return (
    <div className="absolute inset-0 z-[2] overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
