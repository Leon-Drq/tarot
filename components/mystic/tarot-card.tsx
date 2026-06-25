"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface TarotCardProps {
  frontImage: string
  backImage: string
  tiltAngle?: number
  rotationDuration?: number
}

function preloadImage(src: string) {
  if (typeof window !== "undefined" && src) {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  }
}

export function TarotCard({ frontImage, backImage, tiltAngle = -15, rotationDuration = 8 }: TarotCardProps) {
  const [isFrontLoaded, setIsFrontLoaded] = useState(false)
  const [isBackLoaded, setIsBackLoaded] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    preloadImage(frontImage)
    preloadImage(backImage)
  }, [frontImage, backImage])

  // 当正反面图片都加载完成后，触发由远及近的动画
  useEffect(() => {
    if (isFrontLoaded && isBackLoaded) {
      // 稍微延迟一点点，确保浏览器已经准备好渲染，体验更顺滑
      const timer = setTimeout(() => setShouldAnimate(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isFrontLoaded, isBackLoaded])

  return (
    <div
      data-home-card
      className="pointer-events-none relative z-[5] h-[var(--home-hero-card-height)] w-[var(--home-hero-card-width)] origin-center"
      style={{
        perspective: "1000px",
        opacity: 1,
        transform: shouldAnimate ? "scale(1) translateY(0)" : "scale(0.96) translateY(0)",
        filter: "blur(0px)",
        transition: "opacity 2s cubic-bezier(0.34, 1.56, 0.64, 1), transform 2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 1.5s ease-out",
      }}
    >
      <div
        className="relative z-10 h-full w-full origin-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateZ(${tiltAngle}deg)`,
          animation: shouldAnimate ? `rotateCard ${rotationDuration}s linear infinite` : "none",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-lg md:rounded-xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(162, 137, 255, 0.3)",
          }}
        >
          <Image
            src={frontImage || "/placeholder.svg"}
            alt="Tarot Card Front"
            fill
            className="object-cover"
            priority
            onLoad={() => setIsFrontLoaded(true)}
            sizes="(max-width: 768px) 45vw, 220px"
          />
          <div className="absolute inset-0 rounded-lg md:rounded-xl border-2 md:border-4 border-white/20 pointer-events-none" />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 25%, transparent 50%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.3) 100%)",
              mixBlendMode: "overlay",
              animation: "holoShimmer 3s ease-in-out infinite",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.6) 0%, transparent 40%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Front face scan animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              style={{
                position: "absolute",
                width: "250%",
                height: "120px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.3) 80%, transparent 100%)",
                filter: "blur(20px)",
                animation: "shineSwipe 8s ease-in-out infinite",
              }}
            />
          </div>

          {/* Front face vertical scan animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "300%",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 55%, transparent 100%)",
                filter: "blur(25px)",
                animation: "shineSwipeVertical 10s ease-in-out infinite 2s",
              }}
            />
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-lg md:rounded-xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(162, 137, 255, 0.3)",
          }}
        >
          <Image
            src={backImage || "/placeholder.svg"}
            alt="Tarot Card Back"
            fill
            className="object-cover"
            priority
            onLoad={() => setIsBackLoaded(true)}
            sizes="(max-width: 768px) 45vw, 220px"
          />
          <div className="absolute inset-0 rounded-lg md:rounded-xl border-2 border-[#c9c0ff]/20 md:border-4 pointer-events-none" />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(235,232,255,0.46) 0%, rgba(170,161,255,0.2) 25%, transparent 50%, rgba(170,161,255,0.18) 75%, rgba(235,232,255,0.34) 100%)",
              mixBlendMode: "overlay",
              animation: "holoShimmer 3.5s ease-in-out infinite",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 20% 10%, rgba(235,232,255,0.6) 0%, transparent 45%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Back face scan animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              style={{
                position: "absolute",
                width: "250%",
                height: "120px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(190,182,255,0.34) 20%, rgba(255,255,255,0.68) 50%, rgba(190,182,255,0.34) 80%, transparent 100%)",
                filter: "blur(20px)",
                animation: "shineSwipe 9s ease-in-out infinite 2s",
              }}
            />
          </div>

          {/* Back face vertical scan animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "300%",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(190,182,255,0.28) 45%, rgba(255,255,255,0.48) 50%, rgba(190,182,255,0.28) 55%, transparent 100%)",
                filter: "blur(25px)",
                animation: "shineSwipeVertical 11s ease-in-out infinite 4s",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-xl md:rounded-2xl"
        style={{
          width: "calc(var(--home-hero-card-width) * 1.35)",
          height: "calc(var(--home-hero-card-height) * 1.15)",
          background: "radial-gradient(ellipse, rgba(162, 137, 255, 0.3) 0%, transparent 70%)",
          filter: "blur(30px)",
          animation: "breathe 4s ease-in-out infinite",
        }}
      />
    </div>
  )
}
