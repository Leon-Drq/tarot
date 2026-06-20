"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

type Mode = "login" | "register"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
  
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasInviteCode, setHasInviteCode] = useState(false)

  // 从 URL 或 localStorage 读取邀请码
  useEffect(() => {
    // 优先从 URL 读取
    const refFromUrl = searchParams.get("ref")
    if (refFromUrl) {
      setReferralCode(refFromUrl.toUpperCase())
      setMode("register") // 有邀请码时自动切换到注册模式
      setHasInviteCode(true)
      // 保存到 localStorage，以防用户刷新页面
      localStorage.setItem("poptarot_ref", refFromUrl.toUpperCase())
      return
    }
    
    // 从 localStorage 读取（用户之前通过邀请链接访问过）
    const refFromStorage = localStorage.getItem("poptarot_ref")
    if (refFromStorage) {
      setReferralCode(refFromStorage)
      setHasInviteCode(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(email, password, nickname || undefined, referralCode || undefined)
        // 注册成功后清除存储的邀请码
        localStorage.removeItem("poptarot_ref")
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.operationFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center px-4 py-4 sm:px-6 sm:py-5 bg-mystic-bg/80 backdrop-blur-md border-b border-mystic-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-mystic-foreground-muted hover:text-mystic-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm hidden sm:inline">{t("auth.backButton")}</span>
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-serif text-base sm:text-lg tracking-widest text-mystic-foreground">
          {mode === "login" ? t("auth.login") : t("auth.register")}
        </h1>
      </header>

      <main className="relative z-10 px-4 py-12 sm:px-6 sm:py-16 max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mystic-surface/50 border border-mystic-border flex items-center justify-center">
            <span className="text-2xl">🔮</span>
          </div>
          <h2 className="text-mystic-foreground font-serif text-xl tracking-wide">{t("auth.title")}</h2>
          <p className="text-mystic-foreground-muted text-sm mt-2">{t("auth.subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-mystic-foreground-muted text-sm">{t("auth.emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              required
              className="w-full px-4 py-3 rounded-xl bg-mystic-surface/50 border border-mystic-border text-mystic-foreground placeholder:text-mystic-foreground-muted/50 focus:outline-none focus:border-mystic-foreground/50 transition-colors"
            />
          </div>

          {/* Nickname (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-mystic-foreground-muted text-sm">{t("auth.nicknameLabel")}</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t("auth.nicknamePlaceholder")}
                className="w-full px-4 py-3 rounded-xl bg-mystic-surface/50 border border-mystic-border text-mystic-foreground placeholder:text-mystic-foreground-muted/50 focus:outline-none focus:border-mystic-foreground/50 transition-colors"
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <label className="text-mystic-foreground-muted text-sm">{t("auth.passwordLabel")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-mystic-surface/50 border border-mystic-border text-mystic-foreground placeholder:text-mystic-foreground-muted/50 focus:outline-none focus:border-mystic-foreground/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mystic-foreground-muted hover:text-mystic-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Referral Code (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-mystic-foreground-muted text-sm">
                {t("auth.referralCodeLabel")}
                {hasInviteCode && referralCode && (
                  <span className="text-green-400 ml-2">{t("auth.referralCodeFilled")}</span>
                )}
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value.toUpperCase())
                  setHasInviteCode(false) // 用户手动修改时取消自动填充标记
                }}
                placeholder={t("auth.referralCodePlaceholder")}
                maxLength={8}
                className={`w-full px-4 py-3 rounded-xl border text-mystic-foreground placeholder:text-mystic-foreground-muted/50 focus:outline-none transition-colors uppercase ${
                  hasInviteCode && referralCode
                    ? "bg-green-500/10 border-green-500/30 focus:border-green-500/50"
                    : "bg-mystic-surface/50 border-mystic-border focus:border-mystic-foreground/50"
                }`}
              />
              {hasInviteCode && referralCode && (
                <p className="text-green-400 text-xs">{t("auth.referralCodeBenefit")}</p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-4 rounded-lg">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full py-3.5 rounded-xl bg-mystic-foreground text-mystic-bg text-sm tracking-wide font-medium hover:bg-mystic-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-mystic-bg/30 border-t-mystic-bg rounded-full animate-spin" />
                {mode === "login" ? t("auth.loggingIn") : t("auth.registering")}
              </>
            ) : (
              mode === "login" ? t("auth.login") : t("auth.register")
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center">
          <p className="text-mystic-foreground-muted text-sm">
            {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login")
                setError("")
              }}
              className="text-mystic-foreground ml-2 hover:underline"
            >
              {mode === "login" ? t("auth.registerNow") : t("auth.goToLogin")}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-mystic-border" />
          <span className="text-mystic-foreground-muted text-xs">{t("auth.orDivider")}</span>
          <div className="flex-1 h-px bg-mystic-border" />
        </div>

        {/* Guest Mode */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl border border-mystic-border text-mystic-foreground-muted text-sm tracking-wide hover:bg-mystic-surface/50 transition-colors"
        >
          {t("auth.guestMode")}
        </button>
      </main>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-mystic-bg">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 30%, 
              #4c2a78 0%, 
              #251240 40%, 
              #0d0516 70%, 
              #020103 100%)`,
          }}
        />
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-mystic-foreground/30 border-t-mystic-foreground rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
