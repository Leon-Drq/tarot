"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function LoadingReadingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
    startTimeRef.current = Date.now()

    const data = sessionStorage.getItem("tarotReading")
    if (!data) {
      router.push("/")
      return
    }

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / 5000) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          router.push("/reading")
        }, 300)
      }
    }, 50)

    return () => clearInterval(progressInterval)
  }, [router])

  return (
    <div
      className="fixed inset-0 overflow-hidden touch-none flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% 50%, #6b4a9e 0%, #3d2066 30%, #1a0d2e 70%, #0f0518 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {/* 光晕1 - 大型主光晕 */}
        <div
          className="absolute rounded-full pointer-events-none animate-orb-1"
          style={{
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(200, 180, 230, 0.5) 0%, rgba(150, 120, 200, 0.25) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* 光晕2 - 中型次光晕 */}
        <div
          className="absolute rounded-full pointer-events-none animate-orb-2"
          style={{
            width: "140px",
            height: "140px",
            background:
              "radial-gradient(circle, rgba(220, 200, 255, 0.45) 0%, rgba(180, 150, 220, 0.2) 40%, transparent 70%)",
            filter: "blur(35px)",
          }}
        />

        {/* 光晕3 - 小型快速光晕 */}
        <div
          className="absolute rounded-full pointer-events-none animate-orb-3"
          style={{
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle, rgba(240, 220, 255, 0.55) 0%, rgba(200, 170, 230, 0.25) 40%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* 光晕4 - 金色点缀光晕 */}
        <div
          className="absolute rounded-full pointer-events-none animate-orb-4"
          style={{
            width: "90px",
            height: "90px",
            background:
              "radial-gradient(circle, rgba(220, 190, 140, 0.4) 0%, rgba(200, 170, 120, 0.15) 40%, transparent 70%)",
            filter: "blur(25px)",
          }}
        />

        {/* 光晕5 - 额外氛围光晕 */}
        <div
          className="absolute rounded-full pointer-events-none animate-orb-5"
          style={{
            width: "160px",
            height: "160px",
            background:
              "radial-gradient(circle, rgba(180, 160, 220, 0.35) 0%, rgba(140, 110, 180, 0.15) 40%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
      </div>

      {/* 中心内容 */}
      <div
        className="relative z-10 text-center transition-all duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <p
          className="text-white/60 text-lg sm:text-xl tracking-wide"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          {t("tarot.preparing")}
        </p>

        {/* 进度指示 */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                background: progress > (i + 1) * 30 ? "rgba(220, 179, 96, 0.8)" : "rgba(255, 255, 255, 0.2)",
                boxShadow: progress > (i + 1) * 30 ? "0 0 10px rgba(220, 179, 96, 0.5)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes orb-float-1 {
          0%, 100% {
            transform: translate(25vw, 35vh) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translate(55vw, 25vh) scale(1.15);
            opacity: 0.65;
          }
          50% {
            transform: translate(70vw, 55vh) scale(0.9);
            opacity: 0.45;
          }
          75% {
            transform: translate(35vw, 65vh) scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes orb-float-2 {
          0%, 100% {
            transform: translate(60vw, 45vh) scale(1);
            opacity: 0.45;
          }
          30% {
            transform: translate(30vw, 60vh) scale(1.2);
            opacity: 0.55;
          }
          60% {
            transform: translate(45vw, 30vh) scale(0.85);
            opacity: 0.4;
          }
          85% {
            transform: translate(70vw, 50vh) scale(1.05);
            opacity: 0.5;
          }
        }
        
        @keyframes orb-float-3 {
          0%, 100% {
            transform: translate(45vw, 55vh) scale(1);
            opacity: 0.55;
          }
          20% {
            transform: translate(65vw, 35vh) scale(1.1);
            opacity: 0.65;
          }
          45% {
            transform: translate(25vw, 45vh) scale(0.95);
            opacity: 0.5;
          }
          70% {
            transform: translate(55vw, 70vh) scale(1.15);
            opacity: 0.6;
          }
        }
        
        @keyframes orb-float-4 {
          0%, 100% {
            transform: translate(70vw, 30vh) scale(1);
            opacity: 0.4;
          }
          35% {
            transform: translate(40vw, 50vh) scale(1.25);
            opacity: 0.55;
          }
          65% {
            transform: translate(55vw, 65vh) scale(0.9);
            opacity: 0.35;
          }
          90% {
            transform: translate(30vw, 35vh) scale(1.1);
            opacity: 0.45;
          }
        }

        @keyframes orb-float-5 {
          0%, 100% {
            transform: translate(35vw, 70vh) scale(1);
            opacity: 0.35;
          }
          40% {
            transform: translate(60vw, 40vh) scale(1.1);
            opacity: 0.45;
          }
          80% {
            transform: translate(25vw, 30vh) scale(0.95);
            opacity: 0.4;
          }
        }
        
        .animate-orb-1 {
          animation: orb-float-1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        .animate-orb-2 {
          animation: orb-float-2 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -2s;
        }
        
        .animate-orb-3 {
          animation: orb-float-3 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -4s;
        }
        
        .animate-orb-4 {
          animation: orb-float-4 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -1s;
        }

        .animate-orb-5 {
          animation: orb-float-5 11s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -3s;
        }
      `}</style>
    </div>
  )
}
