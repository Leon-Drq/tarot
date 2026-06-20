"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
)

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.455L18 2.25l.259 1.036a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
)

interface MenuPanelProps {
  isOpen: boolean
  frontImage: string | null
  backImage: string | null
  onFrontChange: (url: string | null) => void
  onBackChange: (url: string | null) => void
  onClose?: () => void
}

// 计算剩余天数
function getRemainingDays(expireAt: string | undefined | null): number {
  if (!expireAt) return 0
  const expire = new Date(expireAt)
  const now = new Date()
  const diff = expire.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function MenuPanel({ isOpen, frontImage, backImage, onFrontChange, onBackChange, onClose }: MenuPanelProps) {
  const router = useRouter()
  const { user, isLoggedIn, isLoading } = useAuth()
  const { t } = useLanguage()
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  // 显示"敬请期待"提示
  const handleComingSoon = () => {
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 2000)
  }

  // 会员类型显示名称（使用翻译）
  const getMemberTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      week: t("menu.weekMember"),
      month: t("menu.monthMember"),
      year: t("menu.yearMember"),
      partner: t("menu.partnerMember"),
    }
    return labels[type] || t("menu.member")
  }

  const handleNavigate = (path: string) => {
    router.push(path)
    onClose?.() // 关闭菜单
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (type === "front") {
        onFrontChange(url)
      } else {
        onBackChange(url)
      }
    }
  }

  const handleClear = (type: "front" | "back") => {
    if (type === "front") {
      onFrontChange(null)
      if (frontInputRef.current) frontInputRef.current.value = ""
    } else {
      onBackChange(null)
      if (backInputRef.current) backInputRef.current.value = ""
    }
  }

  const remainingDays = user?.member_expire_at ? getRemainingDays(user.member_expire_at) : 0

  return (
    <div
      className={`absolute top-0 left-0 z-40 h-full w-full sm:w-72 bg-mystic-overlay-strong sm:bg-mystic-overlay backdrop-blur-xl border-r border-mystic-border transform transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="pt-16 sm:pt-24 px-4 sm:px-6">
        {/* 用户区域 */}
        {isLoading ? (
          <div className="p-4 mb-6 rounded-lg border border-mystic-border bg-mystic-surface/50">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mystic-foreground/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-mystic-foreground/10 rounded w-20" />
                <div className="h-3 bg-mystic-foreground/10 rounded w-16" />
              </div>
            </div>
          </div>
        ) : isLoggedIn && user ? (
          <button
            onClick={() => handleNavigate("/profile")}
            className="w-full group p-4 mb-6 rounded-lg border border-mystic-border hover:border-mystic-foreground/20 bg-mystic-surface/50 hover:bg-mystic-surface transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-3">
              {/* 头像 */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic-foreground/20 to-mystic-foreground/5 flex items-center justify-center border border-mystic-border">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-mystic-foreground-muted" />
                  )}
                </div>
                {user.is_member && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-mystic-gold-bright rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(255,215,100,0.5)]">
                    <CrownIcon className="w-2.5 h-2.5 text-black" />
                  </div>
                )}
              </div>

              {/* 用户信息 */}
              <div className="flex-1 min-w-0">
                <p className="text-mystic-foreground text-sm font-medium truncate">
                  {user.nickname || user.email?.split("@")[0] || "User"}
                </p>
                {user.is_member ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-mystic-gold-bright text-xs font-medium">
                      {getMemberTypeLabel(user.member_type || "")}
                    </span>
                    <span className="text-mystic-foreground-muted text-xs">·</span>
                    <span className="text-mystic-foreground-muted text-xs">
                      {remainingDays > 0 ? t("menu.daysRemaining").replace("{days}", String(remainingDays)) : "Expired"}
                    </span>
                  </div>
                ) : (
                  <p className="text-mystic-foreground-muted text-xs mt-0.5">{t("menu.freeUser")}</p>
                )}
              </div>

              <ArrowRightIcon className="w-4 h-4 text-mystic-foreground-muted group-hover:text-mystic-foreground group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
            </div>
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="group flex items-center justify-between p-4 mb-6 rounded-lg border border-mystic-border hover:border-mystic-foreground/20 bg-mystic-surface/50 hover:bg-mystic-surface transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mystic-surface flex items-center justify-center border border-mystic-border">
                <UserIcon className="w-5 h-5 text-mystic-foreground-muted" />
              </div>
              <div>
                <p className="text-mystic-foreground text-sm tracking-wide">{t("menu.loginRegister")}</p>
                <p className="text-mystic-foreground-muted text-xs mt-0.5">{t("menu.unlockFeatures")}</p>
              </div>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-mystic-foreground-muted group-hover:text-mystic-foreground group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        )}

        {/* 会员入口 */}
        <button
          onClick={() => handleNavigate("/membership")}
          className="w-full group flex items-center justify-between p-4 mb-4 rounded-lg border border-mystic-border hover:border-mystic-foreground/20 bg-mystic-surface/50 hover:bg-mystic-surface transition-all duration-300"
        >
          <div>
            <p className="text-mystic-foreground text-sm tracking-wide">{t("menu.membership")}</p>
            <p className="text-mystic-foreground-muted text-xs mt-0.5">{t("menu.unlockAllFeatures")}</p>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-mystic-foreground-muted group-hover:text-mystic-foreground group-hover:translate-x-0.5 transition-all duration-300" />
        </button>

        {/* 每日运势入口 */}
        <button
          onClick={handleComingSoon}
          className="w-full group flex items-center justify-between p-4 mb-6 rounded-lg border border-mystic-gold-muted hover:border-mystic-gold-bright/30 bg-mystic-gold/5 hover:bg-mystic-gold/10 transition-all duration-300 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-mystic-gold-bright" />
              <p className="text-mystic-gold-bright text-sm tracking-wide font-medium">{t("menu.dailyFortune")}</p>
            </div>
            <p className="text-white/70 text-xs mt-0.5 ml-6">{t("menu.dailyFortuneSubtitle")}</p>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-mystic-gold-muted group-hover:text-mystic-gold-bright group-hover:translate-x-0.5 transition-all duration-300" />
          
          {/* 微光动画效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mystic-gold/10 to-transparent -translate-x-full group-hover:animate-[shineEffect_2s_infinite]" />
        </button>

        {/* 敬请期待提示 */}
        {showComingSoon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-mystic-surface border border-mystic-gold-muted rounded-xl px-8 py-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center gap-3">
                <SparklesIcon className="w-8 h-8 text-mystic-gold-bright animate-pulse" />
                <p className="text-mystic-gold-bright text-lg font-medium tracking-wide">敬请期待</p>
                <p className="text-white/60 text-sm">Coming Soon</p>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-mystic-foreground text-sm font-medium flex items-center gap-2 mb-6">
          <ImageIcon className="w-4 h-4" />
          {t("menu.customCards")}
        </h3>

        <div className="space-y-5">
          {/* Front image upload */}
          <div className="space-y-2">
            <label className="text-mystic-foreground-muted text-xs">{t("menu.frontImage")}</label>
            <div className="flex gap-2">
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "front")}
                className="hidden"
                id="menu-front-upload"
              />
              <label
                htmlFor="menu-front-upload"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-mystic-surface hover:bg-mystic-surface-hover rounded-lg cursor-pointer transition-colors text-mystic-foreground-subtle text-xs"
              >
                <UploadIcon className="w-3 h-3" />
                {frontImage ? t("menu.changeImage") : t("menu.uploadImage")}
              </label>
              {frontImage && (
                <button
                  onClick={() => handleClear("front")}
                  className="px-3 py-2 bg-destructive/20 hover:bg-destructive/30 rounded-lg text-destructive text-xs transition-colors"
                >
                  {t("menu.clear")}
                </button>
              )}
            </div>
            {frontImage && (
              <div className="relative w-12 h-20 rounded overflow-hidden border border-mystic-border-strong">
                <img
                  src={frontImage || "/placeholder.svg"}
                  alt="Front preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Back image upload */}
          <div className="space-y-2">
            <label className="text-mystic-foreground-muted text-xs">{t("menu.backImage")}</label>
            <div className="flex gap-2">
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "back")}
                className="hidden"
                id="menu-back-upload"
              />
              <label
                htmlFor="menu-back-upload"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-mystic-surface hover:bg-mystic-surface-hover rounded-lg cursor-pointer transition-colors text-mystic-foreground-subtle text-xs"
              >
                <UploadIcon className="w-3 h-3" />
                {backImage ? t("menu.changeImage") : t("menu.uploadImage")}
              </label>
              {backImage && (
                <button
                  onClick={() => handleClear("back")}
                  className="px-3 py-2 bg-destructive/20 hover:bg-destructive/30 rounded-lg text-destructive text-xs transition-colors"
                >
                  {t("menu.clear")}
                </button>
              )}
            </div>
            {backImage && (
              <div className="relative w-12 h-20 rounded overflow-hidden border border-mystic-border-strong">
                <img src={backImage || "/placeholder.svg"} alt="Back preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
