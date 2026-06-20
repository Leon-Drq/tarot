"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { userApi } from "@/lib/api"

export default function DailyFortunePage() {
  const router = useRouter()
  const { user, isLoggedIn, isLoading, refreshUser } = useAuth()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [birthday, setBirthday] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user?.birthday) {
      setBirthday(user.birthday)
    }
  }, [user])

  if (isLoading) return null

  const handleStartRitual = async () => {
    if (!birthday) return
    
    setIsSubmitting(true)
    try {
      // 如果生日发生了变化或用户尚未设置生日，则更新
      if (birthday !== user?.birthday) {
        try {
          await userApi.updateProfile({ birthday })
          await refreshUser()
        } catch (error) {
          // 如果是"没有要更新的内容"错误，忽略它，继续执行
          const errorMessage = error instanceof Error ? error.message : String(error)
          if (!errorMessage.includes('没有要更新') && !errorMessage.includes('No content to update')) {
            throw error
          }
        }
      }
      
      // 保存生日到 sessionStorage，用于个性化展示
      sessionStorage.setItem('user_birthday', birthday)
      
      // 跳转到每日抽牌页面
      router.push("/daily/reading")
    } catch (error) {
      console.error("Failed to save birthday:", error)
      // 即使保存失败，也允许继续（降级处理）
      sessionStorage.setItem('user_birthday', birthday)
      router.push("/daily/reading")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center p-6"
      style={{
        background: "radial-gradient(circle at 50% 30%, #2a1f4e 0%, #1a1030 40%, #0f0518 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="relative z-10 w-full max-w-md text-center transition-all duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <h1 className="text-2xl sm:text-3xl text-white font-light mb-2 tracking-widest">
          {t("daily.title")}
        </h1>
        <p className="text-[#dcb360] text-sm tracking-wider mb-12 opacity-80">
          {t("daily.subtitle")}
        </p>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
          <p className="text-white/70 text-sm mb-6">
            {t("daily.inputBirthday")}
          </p>
          
          <div className="relative mb-6">
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#dcb360]/50 transition-colors appearance-none"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed mb-8 px-2">
            {t("daily.whyBirthday")}
          </p>

          <button
            onClick={handleStartRitual}
            disabled={!birthday || isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#dcb360] to-[#b88a2d] text-[#1a0f30] font-medium tracking-widest hover:scale-[1.02] transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(220,179,96,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "..." : t("daily.startRitual")}
          </button>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-12 text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          {t("daily.backToHome")}
        </button>
      </div>

      {/* 装饰性背景光 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5a3c85]/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}

