"use client"

import { useLanguage } from "@/contexts/language-context"
import { useMemo } from "react"
import { type SpreadConfig, type DeckType } from "@/lib/api"

interface CardSelectionHeaderProps {
  visible: boolean
  selectedCount: number
  totalCards: number
  question: string
  onShuffle?: () => void
  showShuffle?: boolean
  spreadConfig?: SpreadConfig | null  // 从后端获取的牌阵配置
  deckType?: DeckType  // 牌组类型
}

export function CardSelectionHeader({
  visible,
  selectedCount,
  totalCards,
  question,
  onShuffle,
  showShuffle = true,
  spreadConfig,
  deckType = 'major',
}: CardSelectionHeaderProps) {
  const { language } = useLanguage()
  const remaining = totalCards - selectedCount
  
  // 根据语言获取牌阵名称
  const spreadName = useMemo(() => {
    if (!spreadConfig) {
      return {
        zh: "时间之流",
        en: "Past Present Future",
        ja: "時の流れ",
        ko: "시간의 흐름",
      }[language] || "时间之流"
    }
    
    // 根据语言选择对应字段
    const nameMap: Record<string, string | undefined> = {
      zh: spreadConfig.name,
      en: spreadConfig.nameEn,
      ja: spreadConfig.nameJa || spreadConfig.nameEn,
      ko: spreadConfig.nameKo || spreadConfig.nameEn,
    }
    return nameMap[language] || spreadConfig.name
  }, [spreadConfig, language])
  
  // 获取牌阵描述（支持后端返回的多语言字段）
  const spreadDescription = useMemo(() => {
    const defaultDesc = {
      zh: "经典的三牌阵，从过去、现在、未来三个维度解读",
      en: "Classic three-card spread, reading from past, present, and future perspectives",
      ja: "古典的な3枚のスプレッド、過去・現在・未来の3つの視点から解読",
      ko: "클래식 3카드 스프레드, 과거·현재·미래 관점에서 해석",
    }
    
    if (!spreadConfig) {
      return defaultDesc[language] || defaultDesc.zh
    }
    
    // 根据语言选择对应描述字段
    const descMap: Record<string, string | undefined> = {
      zh: spreadConfig.description,
      en: spreadConfig.descriptionEn || spreadConfig.description,
      ja: spreadConfig.descriptionJa || spreadConfig.descriptionEn || spreadConfig.description,
      ko: spreadConfig.descriptionKo || spreadConfig.descriptionEn || spreadConfig.description,
    }
    return descMap[language] || spreadConfig.description
  }, [spreadConfig, language])

  // 获取牌组类型的显示名称
  const deckTypeName = useMemo(() => {
    if (deckType === 'major') {
      return {
        zh: "大阿尔卡纳 22张",
        en: "Major Arcana 22 Cards",
        ja: "大アルカナ 22枚",
        ko: "메이저 아르카나 22장",
      }[language] || "大阿尔卡纳 22张"
    }
    return {
      zh: "全套塔罗牌 78张",
      en: "Full Deck 78 Cards",
      ja: "フルデッキ 78枚",
      ko: "풀 덱 78장",
    }[language] || "全套塔罗牌 78张"
  }, [deckType, language])
  
  // 获取位置名称列表（支持后端返回的多语言字段）
  const positionNames = useMemo(() => {
    if (!spreadConfig?.positions) {
      return {
        zh: ["过去", "现在", "未来"],
        en: ["Past", "Present", "Future"],
        ja: ["過去", "現在", "未来"],
        ko: ["과거", "현재", "미래"],
      }[language] || ["过去", "现在", "未来"]
    }
    return spreadConfig.positions.map(p => {
      const nameMap: Record<string, string> = {
        zh: p.name,
        en: p.nameEn || p.name,
        ja: p.nameJa || p.nameEn || p.name,
        ko: p.nameKo || p.nameEn || p.name,
      }
      return nameMap[language] || p.name
    })
  }, [spreadConfig, language])
  
  // 获取下一张牌的位置名称
  const nextPosition = useMemo(() => {
    if (selectedCount < positionNames.length) {
      return positionNames[selectedCount]
    }
    return null
  }, [selectedCount, positionNames])

  // 选择完成时隐藏整个 header，避免与过渡动画重叠
  const isComplete = remaining === 0

  return (
    <>
      {/* 桌面端 - 显示在顶部 */}
      <div
        className={`absolute top-[8%] left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-2 transition-all duration-700 ${
          visible && !isComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#bfb6ff]/45" />
          <h2 className="text-white/80 text-lg font-medium tracking-wide">
            {spreadName}
          </h2>
          <span className="h-px w-8 bg-[#bfb6ff]/45" />
        </div>
        
        <p className="text-white/40 text-xs text-center max-w-md px-4 leading-relaxed">
          {spreadDescription}
        </p>
        
        <div className="flex items-center gap-1.5">
          <span className="h-px w-5 bg-[#bfb6ff]/35" />
          <span className="text-[#c9c0ff]/65 text-[10px] tracking-wider">
            {deckTypeName}
          </span>
          <span className="h-px w-5 bg-[#bfb6ff]/35" />
        </div>

        {nextPosition && (
          <p className="text-white/60 text-base tracking-wide mt-2">
            {{
              zh: "下一张",
              en: "Next",
              ja: "次",
              ko: "다음",
            }[language] || "下一张"}：<span className="text-[#c9c0ff]">{nextPosition}</span>
            <span className="text-white/40 ml-2">({selectedCount + 1}/{totalCards})</span>
          </p>
        )}
      </div>

      {/* 手机端 - 显示在底部 */}
      <div
        className={`absolute bottom-[calc(env(safe-area-inset-bottom)+6rem)] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full border border-white/10 bg-black/26 px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-700 sm:hidden ${
          visible && !isComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        {nextPosition && (
          <p className="whitespace-nowrap text-sm tracking-wide text-white/72">
            {{
              zh: "下一张",
              en: "Next",
              ja: "次",
              ko: "다음",
            }[language] || "下一张"}：<span className="text-[#c9c0ff]">{nextPosition}</span>
            <span className="text-white/40 ml-2">({selectedCount + 1}/{totalCards})</span>
          </p>
        )}
      </div>
    </>
  )
}
