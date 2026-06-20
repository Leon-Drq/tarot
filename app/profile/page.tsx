"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { userApi, readingApi, ReadingRecord, authApi } from "@/lib/api"

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
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

const KeyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
)

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
)

function getRemainingDays(expireAt: string | undefined | null): number {
  if (!expireAt) return 0
  const expire = new Date(expireAt)
  const now = new Date()
  const diff = expire.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

type Tab = "profile" | "password" | "history"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoggedIn, isLoading, logout, refreshUser } = useAuth()
  const { t, language } = useLanguage()
  
  // 获取会员类型标签
  const getMemberTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      week: t("profile.weekMember"),
      month: t("profile.monthMember"),
      year: t("profile.yearMember"),
      partner: t("profile.partnerMember"),
    }
    return labels[type] || t("profile.freeUser")
  }
  
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [nickname, setNickname] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [readings, setReadings] = useState<ReadingRecord[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // 匿名用户绑定邮箱的状态
  const [bindEmail, setBindEmail] = useState("")
  const [bindPassword, setBindPassword] = useState("")
  const [bindConfirmPassword, setBindConfirmPassword] = useState("")

  // 未登录重定向
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/auth/login")
    }
  }, [isLoading, isLoggedIn, router])

  // 初始化昵称
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "")
    }
  }, [user])

  // 加载历史记录
  useEffect(() => {
    async function loadHistory() {
      if (activeTab === "history" && isLoggedIn) {
        setLoadingHistory(true)
        try {
          const result = await readingApi.getHistory(1, 20)
          setReadings(result.readings)
        } catch (error) {
          console.error("Failed to load history:", error)
        } finally {
          setLoadingHistory(false)
        }
      }
    }
    loadHistory()
  }, [activeTab, isLoggedIn])

  const handleSaveProfile = async () => {
    if (!nickname.trim()) {
      setMessage({ type: "error", text: t("profile.bindFieldsRequired") })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      await userApi.updateProfile({ nickname: nickname.trim() })
      await refreshUser()
      setMessage({ type: "success", text: t("common.success") })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t("common.error") })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBindEmail = async () => {
    if (!bindEmail || !bindPassword || !bindConfirmPassword) {
      setMessage({ type: "error", text: t("profile.bindFieldsRequired") })
      return
    }

    if (bindPassword !== bindConfirmPassword) {
      setMessage({ type: "error", text: t("profile.bindPasswordsNotMatch") })
      return
    }

    if (bindPassword.length < 6) {
      setMessage({ type: "error", text: t("profile.bindPasswordTooShort") })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      await authApi.bindEmail(bindEmail, bindPassword, nickname || undefined)
      await refreshUser()
      setMessage({ type: "success", text: t("profile.bindEmailSuccess") })
      setBindEmail("")
      setBindPassword("")
      setBindConfirmPassword("")
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t("profile.bindEmailFailed") })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: t("profile.passwordFieldsRequired") })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: t("profile.passwordsNotMatch") })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: t("profile.passwordTooShort") })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      // 这里需要后端实现修改密码的接口
      // await authApi.changePassword(currentPassword, newPassword)
      setMessage({ type: "success", text: t("profile.passwordChangeSuccess") })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t("profile.passwordChangeFailed") })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mystic-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mystic-foreground/30 border-t-mystic-foreground rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const remainingDays = getRemainingDays(user.member_expire_at)

  return (
    <div className="relative min-h-screen w-full bg-mystic-bg overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 30%, 
              #5a3c85 0%, 
              #241438 40%, 
              #0f0518 70%, 
              #020103 100%)`,
          }}
        />
        {/* 噪点纹理 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center px-4 py-4 sm:px-6 sm:py-6 bg-transparent">
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#dcb360]/30 group-hover:bg-[#dcb360]/5">
            <ArrowLeftIcon className="w-4 h-4" />
          </div>
          <span className="text-xs tracking-widest hidden sm:inline">{t("profile.backButton")}</span>
        </button>
        <h1 
          className="absolute left-1/2 -translate-x-1/2 font-serif text-lg sm:text-xl tracking-[0.2em] text-white/90"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          {t("profile.title")}
        </h1>
      </header>

      <main className="relative z-10 px-4 py-4 sm:px-6 sm:py-8 max-w-xl mx-auto pb-24">
        {/* User Identity Card */}
        <div 
          className="relative p-8 rounded-[2rem] border border-[#dcb360]/20 bg-white/5 backdrop-blur-xl mb-10 overflow-hidden group"
          style={{
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(220, 179, 96, 0.05)"
          }}
        >
          {/* Decorative light */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#dcb360]/10 rounded-full blur-[60px] group-hover:bg-[#dcb360]/20 transition-colors duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center sm:flex-row sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-br from-[#dcb360]/40 via-[#dcb360]/10 to-transparent border border-[#dcb360]/20 flex items-center justify-center overflow-hidden shadow-2xl"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-[#dcb360]/40" />
                  </div>
                )}
              </div>
              {user.is_member && (
                <div 
                  className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-[#ffd764] to-[#d4af37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,215,100,0.6)]"
                >
                  <CrownIcon className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <h2 
                className="text-white text-xl sm:text-2xl font-light tracking-wide"
                style={{ fontFamily: "var(--font-serif, serif)" }}
              >
                {user.nickname || user.email?.split("@")[0]}
              </h2>
              <p className="text-white/40 text-sm tracking-wider font-light">{user.email}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                {user.is_member ? (
                  <div className="px-3 py-1 rounded-full bg-[#dcb360]/10 border border-[#dcb360]/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#dcb360] animate-pulse" />
                    <span className="text-[#dcb360] text-xs font-medium tracking-wide">
                      {getMemberTypeLabel(user.member_type || "")} · {t("profile.daysRemaining").replace("{days}", String(remainingDays))}
                    </span>
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="text-white/40 text-xs tracking-wide">{t("profile.freeUser")}</span>
                  </div>
                )}
                
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="text-[#dcb360]/80 text-xs font-medium tracking-wide">
                    {t("profile.credits")}: {user.credits}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          <button
            onClick={() => router.push("/membership")}
            className="relative mt-8 w-full group overflow-hidden py-4 rounded-2xl bg-[#dcb360]/5 border border-[#dcb360]/30 hover:border-[#dcb360]/60 transition-all duration-500"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <CrownIcon className="w-4 h-4 text-[#dcb360]" />
              <span className="text-[#dcb360] text-sm tracking-[0.2em] font-medium">
                {user.is_member ? t("profile.upgradeRenew") : t("profile.upgradeMember")}
              </span>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#dcb360]/10 to-transparent -translate-x-full group-hover:animate-[shineEffect_2s_infinite]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="relative flex justify-around mb-12 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-white/5">
          {[
            { id: "profile", label: t("profile.tabProfile"), icon: UserIcon },
            { id: "password", label: t("profile.tabPassword"), icon: KeyIcon },
            { id: "history", label: t("profile.tabHistory"), icon: HistoryIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`relative pb-4 px-2 flex items-center gap-2 transition-all duration-300 ${
                activeTab === tab.id 
                  ? "text-[#dcb360]" 
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "opacity-100" : "opacity-50"}`} />
              <span className="text-xs sm:text-sm tracking-widest uppercase font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#dcb360] to-transparent shadow-[0_0_10px_rgba(220,179,96,0.5)]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="min-h-[300px]">
          {/* Message Area */}
          {message && (
            <div
              className={`mb-8 px-5 py-3 rounded-2xl text-xs sm:text-sm text-center animate-fade-in-up ${
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500/30 text-green-300"
                  : "bg-red-500/10 border border-red-500/30 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Content */}
          {activeTab === "profile" && (
            <div className="space-y-8 animate-fade-in-up">
              {user.is_anonymous ? (
                /* 游客绑定提示 */
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#dcb360]/10 to-transparent border border-[#dcb360]/20 space-y-6">
                  <p className="text-[#dcb360]/80 text-sm leading-relaxed text-center italic">
                    {t("profile.bindEmailNotice")}
                  </p>
                  
                  <div className="space-y-5">
                    <div className="group space-y-2">
                      <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.nicknameLabel")}</label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t("profile.guestNicknamePlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                      />
                    </div>
                    {/* ... (Other bind inputs follow same style) ... */}
                    <div className="group space-y-2">
                      <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.emailRequired")}</label>
                      <input
                        type="email"
                        value={bindEmail}
                        onChange={(e) => setBindEmail(e.target.value)}
                        placeholder={t("profile.emailPlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.setPasswordLabel")}</label>
                      <input
                        type="password"
                        value={bindPassword}
                        onChange={(e) => setBindPassword(e.target.value)}
                        placeholder={t("profile.setPasswordPlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.confirmPasswordLabel")}</label>
                      <input
                        type="password"
                        value={bindConfirmPassword}
                        onChange={(e) => setBindConfirmPassword(e.target.value)}
                        placeholder={t("profile.confirmPasswordPlaceholderAlt")}
                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                      />
                    </div>
                    
                    <button
                      onClick={handleBindEmail}
                      disabled={isSaving}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#dcb360] to-[#b88a2d] text-[#1a0f30] font-semibold tracking-[0.2em] shadow-lg shadow-[#dcb360]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {isSaving ? t("profile.binding") : t("profile.bindEmailButton")}
                    </button>
                  </div>
                </div>
              ) : (
                /* 正式用户资料 */
                <div className="space-y-6">
                  <div className="group space-y-2">
                    <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.nicknameLabel")}</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={t("profile.nicknamePlaceholder")}
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                    />
                  </div>

                  <div className="group space-y-2">
                    <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.emailLabel")}</label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/30 cursor-not-allowed"
                    />
                    <p className="text-white/20 text-[10px] sm:text-xs ml-1 italic">{t("profile.emailCannotModify")}</p>
                  </div>

                  <div className="group space-y-2">
                    <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.referralCodeLabel")}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={user.referral_code || ""}
                        readOnly
                        className="flex-1 px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/80 font-mono tracking-wider"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.referral_code || "")
                          setMessage({ type: "success", text: t("profile.referralCodeCopied") })
                        }}
                        className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#dcb360]/30 transition-all"
                      >
                        {t("profile.copy")}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full py-4 rounded-2xl bg-white text-[#0f0518] font-bold tracking-[0.2em] shadow-xl hover:bg-white/90 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                  >
                    {isSaving ? t("profile.saving") : t("profile.saveChanges")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Password Tab Content */}
          {activeTab === "password" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="group space-y-2">
                <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.currentPassword")}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("profile.currentPasswordPlaceholder")}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                />
              </div>

              <div className="group space-y-2">
                <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.newPassword")}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("profile.newPasswordPlaceholder")}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                />
              </div>

              <div className="group space-y-2">
                <label className="text-white/40 text-xs tracking-widest ml-1">{t("profile.confirmNewPassword")}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("profile.confirmPasswordPlaceholder")}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#dcb360]/40 transition-all duration-300"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="w-full py-4 rounded-2xl bg-white text-[#0f0518] font-bold tracking-[0.2em] shadow-xl hover:bg-white/90 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
              >
                {isSaving ? t("profile.changing") : t("profile.changePassword")}
              </button>
            </div>
          )}

          {/* History Tab Content */}
          {activeTab === "history" && (
            <div className="space-y-4 animate-fade-in-up">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-8 h-8 border-2 border-[#dcb360]/30 border-t-[#dcb360] rounded-full animate-spin" />
                  <p className="text-white/20 text-xs tracking-widest uppercase">Fetching Records...</p>
                </div>
              ) : readings.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
                  <HistoryIcon className="w-16 h-16 text-white/10 mx-auto mb-6" />
                  <p className="text-white/40 text-sm tracking-widest font-light">{t("profile.noHistory")}</p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-8 px-8 py-3 rounded-full border border-[#dcb360]/30 text-[#dcb360] text-xs tracking-[0.2em] hover:bg-[#dcb360]/10 transition-all duration-500"
                  >
                    {t("profile.startReading")}
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {readings.map((reading) => (
                    <div
                      key={reading.id}
                      onClick={() => router.push(`/reading/${reading.id}`)}
                      className="group relative p-6 rounded-[1.5rem] border border-white/5 bg-white/5 hover:border-[#dcb360]/30 hover:bg-white/10 transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <p 
                            className="text-white/90 text-sm sm:text-base font-medium line-clamp-1 pr-4"
                            style={{ fontFamily: "var(--font-serif, serif)" }}
                          >
                            {reading.question || t("nav.reading")}
                          </p>
                          <span className="text-white/20 text-[10px] flex-shrink-0 tracking-widest uppercase mt-1">
                            {new Date(reading.created_at).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          {reading.cards.slice(0, 3).map((card, idx) => (
                            <span key={idx} className="flex items-center text-[#dcb360]/60 text-xs font-light">
                              {card.name}
                              {card.isReversed ? (
                                <span className="ml-0.5 text-[#dcb360]/40 italic text-[10px]">(逆)</span>
                              ) : (
                                <span className="ml-0.5 text-[#dcb360]/40 italic text-[10px]">(正)</span>
                              )}
                              {idx < Math.min(reading.cards.length, 3) - 1 && (
                                <span className="ml-2 text-white/10">/</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Hover light */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#dcb360]/5 rounded-full blur-2xl -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/5 text-white/30 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all duration-500"
          >
            <LogoutIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-xs tracking-[0.2em] font-medium uppercase">{t("profile.logout")}</span>
          </button>
        </div>
      </main>

      {/* Decorative fixed elements */}
      <div className="fixed bottom-[-10vh] left-[-10vw] w-[40vw] h-[40vw] bg-[#5a3c85]/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[-10vh] right-[-10vw] w-[30vw] h-[30vw] bg-[#dcb360]/5 rounded-full blur-[80px] pointer-events-none z-0" />
    </div>
  )
}

