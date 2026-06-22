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
      className="pointer-events-none relative z-[5] mx-auto mt-[11rem] flex h-[19rem] w-full items-center justify-center sm:mt-36 sm:h-[min(42svh,22rem)] sm:min-h-[20rem] md:mt-24 md:h-[min(52svh,29rem)] md:min-h-[25rem] lg:mt-20"
      style={{
        perspective: "1000px",
        opacity: 1,
        transform: shouldAnimate ? "scale(1) translateY(0)" : "scale(0.96) translateY(0)",
        filter: "blur(0px)",
        transition: "opacity 2s cubic-bezier(0.34, 1.56, 0.64, 1), transform 2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 1.5s ease-out",
      }}
    >
      <div
        className="relative h-[17.75rem] w-[10.375rem] sm:h-[21rem] sm:w-[12.25rem] md:h-[29.125rem] md:w-[16.875rem]"
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
            sizes="(max-width: 768px) 50vw, 220px"
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
            sizes="(max-width: 768px) 50vw, 220px"
          />
          <div className="absolute inset-0 rounded-lg md:rounded-xl border-2 md:border-4 border-amber-700/30 pointer-events-none" />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,215,100,0.5) 0%, rgba(212,175,55,0.2) 25%, transparent 50%, rgba(212,175,55,0.2) 75%, rgba(255,215,100,0.4) 100%)",
              mixBlendMode: "overlay",
              animation: "holoShimmer 3.5s ease-in-out infinite",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 20% 10%, rgba(255,223,120,0.7) 0%, transparent 45%)",
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
                  "linear-gradient(90deg, transparent 0%, rgba(255,215,100,0.4) 20%, rgba(255,255,255,0.7) 50%, rgba(255,215,100,0.4) 80%, transparent 100%)",
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
                  "linear-gradient(180deg, transparent 0%, rgba(255,215,100,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(255,215,100,0.3) 55%, transparent 100%)",
                filter: "blur(25px)",
                animation: "shineSwipeVertical 11s ease-in-out infinite 4s",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute rounded-xl md:rounded-2xl"
        style={{
          width: "clamp(188px, 46vw, 320px)",
          height: "clamp(296px, 72vw, 520px)",
          background: "radial-gradient(ellipse, rgba(162, 137, 255, 0.3) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: `rotateZ(${tiltAngle}deg)`,
          animation: "breathe 4s ease-in-out infinite",
        }}
      />
    </div>
  )
}
