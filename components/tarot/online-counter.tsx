"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

/**
 * 在线占卜人数显示组件 - 隐秘低语风格
 * 若隐若现，像背景中的低语，完全融入神秘氛围
 */
export function OnlineCounter() {
  const { language } = useLanguage()
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 生成基础人数（2000-4000之间）
    const baseCount = Math.floor(Math.random() * 2000) + 2000
    setCount(baseCount)

    // 每隔5-10秒随机变化人数（±5-20人）
    const interval = setInterval(() => {
      setCount(prevCount => {
        const change = Math.floor(Math.random() * 15) - 7 // -7 到 +7 的随机变化
        const newCount = prevCount + change
        // 确保人数在 1800-5000 之间
        return Math.max(1800, Math.min(5000, newCount))
      })
    }, Math.random() * 5000 + 5000) // 5-10秒随机间隔

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  // 根据语言返回诗意文案
  const getText = () => {
    switch (language) {
      case 'zh':
        return `此刻 ${count.toLocaleString()} 人正在占卜`
      case 'en':
        return `divining for ${count.toLocaleString()} seekers`
      case 'ja':
        return `今 ${count.toLocaleString()} の探求者`
      case 'ko':
        return `지금 ${count.toLocaleString()} 탐구자`
      default:
        return `此刻 ${count.toLocaleString()} 人正在占卜`
    }
  }

  return (
    <div className="absolute bottom-[15%] sm:bottom-[17%] md:bottom-[19%] left-1/2 -translate-x-1/2 z-20">
      {/* 隐秘低语风格：单行、极简、若隐若现 */}
      <div 
        className="relative inline-flex items-center gap-2 transition-opacity duration-1000"
        style={{ opacity: 0.4 }}
      >
        {/* 左侧神秘符号 */}
        <span 
          className="text-mystic-foreground-muted text-xs sm:text-sm animate-pulse"
          style={{ 
            fontFamily: 'var(--font-display)',
            animationDuration: '3s'
          }}
        >
          ⊹
        </span>
        
        {/* 诗意文案 */}
        <span 
          className="text-[10px] sm:text-xs text-mystic-foreground-muted whitespace-nowrap tracking-wide"
          style={{ 
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}
        >
          {getText()}
        </span>

        {/* 右侧神秘符号 */}
        <span 
          className="text-mystic-foreground-muted text-xs sm:text-sm animate-pulse"
          style={{ 
            fontFamily: 'var(--font-display)',
            animationDuration: '3s'
          }}
        >
          ⊹
        </span>
      </div>
    </div>
  )
}
