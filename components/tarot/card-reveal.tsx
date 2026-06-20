"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface CardRevealProps {
  selectedCardIds: number[]
  question: string
}

export function CardReveal({ selectedCardIds, question }: CardRevealProps) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const positions = [t("tarot.past"), t("tarot.present"), t("tarot.future")]

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
      {/* 标题 */}
      <div
        className="text-center mb-12 transition-all duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        <p className="text-white/60 text-sm mb-2">{t("tarot.question")}</p>
        <h1
          className="text-2xl sm:text-3xl text-white/90 font-light px-4"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          {question || t("nav.reading")}
        </h1>
        <p className="text-[#dcb360] text-sm mt-4">{t("tarot.reveal")}</p>
      </div>

      {/* 三张卡牌 */}
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {selectedCardIds.map((cardId, index) => (
          <div
            key={cardId}
            className="transition-all duration-700 cursor-pointer hover:scale-105"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(50px)",
              transitionDelay: `${index * 150 + 200}ms`,
            }}
          >
            <div
              className="relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,179,96,0.4)]"
              style={{
                width: "clamp(100px, 20vw, 140px)",
                height: "clamp(172px, 34vw, 240px)",
                border: "2px solid #dcb360",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <Image src="https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/back1.jpg" alt={`Tarot card ${index + 1}`} fill className="object-cover" />
              <div
                className="absolute top-2 left-2 right-2 bottom-2 rounded-lg pointer-events-none"
                style={{ border: "1px solid rgba(220, 179, 96, 0.4)" }}
              />
            </div>
            <p className="text-center text-white/50 text-xs mt-3">{positions[index]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
