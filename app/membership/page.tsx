"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi, paymentApi, memberApi, userApi, MemberStatus, UserProfile, Product } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"

// 预定义的星星位置，避免 hydration 不匹配
const STAR_POSITIONS = Array.from({ length: 60 }, (_, i) => ({
  left: ((i * 17 + 23) % 97) + Math.sin(i * 0.5) * 3,
  top: ((i * 31 + 7) % 93) + Math.cos(i * 0.7) * 3,
  opacity: 0.3 + ((i * 13) % 7) / 10,
  delay: (i * 0.17) % 3,
  duration: 2 + ((i * 11) % 20) / 10,
}))

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
  </svg>
)

type PlanType = "member_week" | "member_month" | "member_year"
type PayType = "alipay" | "wxpay" | "stripe"

function MembershipContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoggedIn, isLoading: authLoading, refreshUser } = useAuth()
  const { t, language } = useLanguage()
  
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("member_year")
  const [payType, setPayType] = useState<PayType>("alipay")
  const [isProcessing, setIsProcessing] = useState(false)
  const [memberStatus, setMemberStatus] = useState<MemberStatus | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [invitedCount, setInvitedCount] = useState(0)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // 加载产品列表
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await paymentApi.getProducts()
        setProducts(data.products.filter(p => p.type !== 'partner')) // 排除合伙人套餐
      } catch (err) {
        console.error("Failed to load products:", err)
        setError(t("membership.loading"))
      } finally {
        setIsLoadingProducts(false)
      }
    }
    loadProducts()
  }, [])

  // 当选择的套餐不支持 Stripe 时，切换到支付宝
  useEffect(() => {
    const currentProduct = products.find(p => p.type === selectedPlan)
    if (currentProduct && !currentProduct.stripe_enabled && payType === "stripe") {
      setPayType("alipay")
    }
  }, [selectedPlan, payType, products])

  // 检查支付成功回调
  useEffect(() => {
    const paymentStatus = searchParams.get("payment")
    const orderNo = searchParams.get("order_no")
    if (paymentStatus === "success") {
      async function verifyPayment() {
        try {
          if (orderNo) {
            const status = await paymentApi.checkStatus(orderNo)
            setSuccessMessage(status.paid ? "支付成功！会员权益已生效" : "支付处理中，稍后会自动生效")
          } else {
            setSuccessMessage("支付成功！会员权益正在同步")
          }
          await refreshUser()
        } catch (error) {
          console.error("Failed to verify payment:", error)
          setSuccessMessage("支付成功！会员权益正在同步")
        } finally {
          router.replace("/membership")
        }
      }
      verifyPayment()
    }
  }, [searchParams, refreshUser, router])

  // 加载会员状态和邀请数据
  useEffect(() => {
    async function loadData() {
      if (!isLoggedIn) return
      
      try {
        const [status, userProfile] = await Promise.all([
          memberApi.getStatus(),
          userApi.getProfile(),
        ])
        setMemberStatus(status)
        setProfile(userProfile)
        setInvitedCount(userProfile.referral_count || 0)
      } catch (err) {
        console.error("Failed to load member data:", err)
      }
    }
    
    loadData()
  }, [isLoggedIn])

  const hasPartnerDiscount = invitedCount >= 10
  const extraBenefitLabels =
    {
      zh: {
        basic: "基础",
        deep: "深度",
        dailyAdvanced: "进阶",
        sessionOnly: "本次",
        saved: "保存",
        basicSpread: "基础",
        advancedSpread: "高级",
        deepReports: "深度关系/事业报告",
        shareImages: "分享图",
        enhanced: "增强",
      },
      en: {
        basic: "Basic",
        deep: "Deep",
        dailyAdvanced: "Advanced",
        sessionOnly: "Session",
        saved: "Saved",
        basicSpread: "Basic",
        advancedSpread: "Advanced",
        deepReports: "Love/Career reports",
        shareImages: "Share images",
        enhanced: "Enhanced",
      },
      ja: {
        basic: "基本",
        deep: "深掘り",
        dailyAdvanced: "高度",
        sessionOnly: "今回のみ",
        saved: "保存",
        basicSpread: "基本",
        advancedSpread: "高度",
        deepReports: "恋愛/仕事レポート",
        shareImages: "共有画像",
        enhanced: "強化",
      },
      ko: {
        basic: "기본",
        deep: "심층",
        dailyAdvanced: "고급",
        sessionOnly: "이번 세션",
        saved: "저장",
        basicSpread: "기본",
        advancedSpread: "고급",
        deepReports: "관계/커리어 리포트",
        shareImages: "공유 이미지",
        enhanced: "향상",
      },
    }[language] || {
      basic: "Basic",
      deep: "Deep",
      dailyAdvanced: "Advanced",
      sessionOnly: "Session",
      saved: "Saved",
      basicSpread: "Basic",
      advancedSpread: "Advanced",
      deepReports: "Love/Career reports",
      shareImages: "Share images",
      enhanced: "Enhanced",
    }
  const membershipBoundary =
    {
      zh: {
        eyebrow: "先免费使用",
        title: "会员不是开始塔罗的门槛",
        body: "POPTarot 的第一目标是免费 AI 塔罗工具。你可以先完成免费解读、每日一牌和牌义查询；会员只在你需要更深追问、长期保存和月度总结时出现。",
        freeCta: "开始免费解读",
        dailyCta: "每日塔罗",
        upgradeTitle: "适合升级的场景",
        items: [
          "深度追问：围绕同一个问题继续追问，而不是反复重新开始。",
          "历史保存：把重要解读、日记和关系/事业线索长期留存。",
          "高级牌阵：用于复合、事业转折、重大选择和复杂关系。",
          "月度报告：把重复出现的牌、日记主题和行动建议整理成月报。",
        ],
      },
      en: {
        eyebrow: "Free first",
        title: "Membership is not the starting gate",
        body: "POPTarot should work as a free AI tarot tool before anyone pays. Start with a free reading, Daily Tarot, and card meanings; upgrade only when you need deeper follow-ups, saved history, advanced spreads, or monthly reports.",
        freeCta: "Start Free Reading",
        dailyCta: "Daily Tarot",
        upgradeTitle: "Upgrade when you need",
        items: [
          "Deeper follow-ups: continue one question instead of restarting the same reading.",
          "Saved history: keep important readings, journals, relationship signals, and career patterns.",
          "Advanced spreads: use richer layouts for reconciliation, career turns, major choices, and complex relationships.",
          "Monthly reports: summarize repeated cards, journal themes, and next actions into a longer member report.",
        ],
      },
      ja: {
        eyebrow: "まず無料",
        title: "会員登録は最初の入口ではありません",
        body: "POPTarot は、支払い前に無料 AI タロットとして役立つことを優先します。無料リーディング、毎日のタロット、カード意味から始め、深い追質問、履歴保存、高度なスプレッド、月次レポートが必要な時だけアップグレードできます。",
        freeCta: "無料で始める",
        dailyCta: "毎日のタロット",
        upgradeTitle: "アップグレードが役立つ時",
        items: [
          "深い追質問: 同じテーマを最初からやり直さずに続けて整理する。",
          "履歴保存: 重要なリーディング、日記、恋愛や仕事のパターンを残す。",
          "高度なスプレッド: 復縁、仕事の転機、大きな選択、複雑な関係に使う。",
          "月次レポート: 繰り返し出るカード、日記テーマ、次の行動をまとめる。",
        ],
      },
      ko: {
        eyebrow: "무료 먼저",
        title: "멤버십은 시작 조건이 아닙니다",
        body: "POPTarot은 결제 전에도 무료 AI 타로 도구로 충분히 유용해야 합니다. 무료 리딩, 데일리 타로, 카드 의미부터 시작하고, 심층 질문, 기록 저장, 고급 스프레드, 월간 리포트가 필요할 때만 업그레이드하세요.",
        freeCta: "무료 리딩 시작",
        dailyCta: "데일리 타로",
        upgradeTitle: "업그레이드가 필요한 순간",
        items: [
          "심층 후속 질문: 같은 질문을 처음부터 반복하지 않고 이어서 정리합니다.",
          "기록 저장: 중요한 리딩, 저널, 관계와 커리어 패턴을 보관합니다.",
          "고급 스프레드: 재회, 커리어 전환, 큰 선택, 복잡한 관계에 사용합니다.",
          "월간 리포트: 반복 카드, 저널 주제, 다음 행동을 긴 리포트로 정리합니다.",
        ],
      },
    }[language] || {
      eyebrow: "Free first",
      title: "Membership is not the starting gate",
      body: "POPTarot should work as a free AI tarot tool before anyone pays. Start with a free reading, Daily Tarot, and card meanings; upgrade only when you need deeper follow-ups, saved history, advanced spreads, or monthly reports.",
      freeCta: "Start Free Reading",
      dailyCta: "Daily Tarot",
      upgradeTitle: "Upgrade when you need",
      items: [
        "Deeper follow-ups: continue one question instead of restarting the same reading.",
        "Saved history: keep important readings, journals, relationship signals, and career patterns.",
        "Advanced spreads: use richer layouts for reconciliation, career turns, major choices, and complex relationships.",
        "Monthly reports: summarize repeated cards, journal themes, and next actions into a longer member report.",
      ],
    }

  // 购买会员
  const handlePurchase = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      analyticsApi.track("payment_started", {
        ...getCurrentAttribution(),
        locale: language,
        metadata: {
          product_type: selectedPlan,
          pay_type: payType,
        },
      })
      const result = await paymentApi.createOrder(selectedPlan, payType)
      // 跳转到支付页面
      window.location.href = result.pay_url
    } catch (err) {
      setError(err instanceof Error ? err.message : t("payment.paymentFailed"))
    } finally {
      setIsProcessing(false)
    }
  }

  // 购买合伙人
  const handleBuyPartner = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      analyticsApi.track("payment_started", {
        ...getCurrentAttribution(),
        locale: language,
        metadata: {
          product_type: "partner",
          pay_type: payType,
        },
      })
      const result = await paymentApi.createOrder("partner", payType)
      window.location.href = result.pay_url
    } catch (err) {
      setError(err instanceof Error ? err.message : t("payment.paymentFailed"))
    } finally {
      setIsProcessing(false)
    }
  }

  // 复制邀请链接
  const handleCopyInviteLink = () => {
    if (!profile?.referral_code) {
      setError(t("errors.unauthorized"))
      return
    }
    
    const inviteLink = `${window.location.origin}/?ref=${profile.referral_code}`
    navigator.clipboard.writeText(inviteLink)
    setSuccessMessage("邀请链接已复制！")
    setTimeout(() => setSuccessMessage(""), 3000)
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
          <span className="text-sm hidden sm:inline">{t("membership.backButton")}</span>
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-serif text-base sm:text-lg tracking-widest text-mystic-foreground">
          {t("membership.memberTitle")}
        </h1>
      </header>

      <main className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 max-w-lg mx-auto space-y-8 pb-24">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Free-first boundary */}
        <section className="rounded-xl border border-mystic-foreground/20 bg-mystic-surface/45 p-5 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-mystic-foreground-muted">{membershipBoundary.eyebrow}</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-mystic-foreground sm:text-3xl">
            {membershipBoundary.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-mystic-foreground-muted">{membershipBoundary.body}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/free-ai-tarot-reading"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-mystic-foreground px-4 py-2.5 text-sm font-medium text-mystic-bg transition hover:bg-mystic-foreground/90"
            >
              {membershipBoundary.freeCta}
            </Link>
            <Link
              href="/daily-tarot"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-mystic-border px-4 py-2.5 text-sm text-mystic-foreground transition hover:border-mystic-foreground/35 hover:bg-mystic-surface"
            >
              {membershipBoundary.dailyCta}
            </Link>
          </div>
          <div className="mt-5 border-t border-mystic-border pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-mystic-foreground-muted">{membershipBoundary.upgradeTitle}</p>
            <ul className="mt-3 space-y-2">
              {membershipBoundary.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-mystic-foreground-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mystic-foreground/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Status */}
        <div className="text-center space-y-1">
          {authLoading ? (
            <p className="text-mystic-foreground-muted text-sm">{t("membership.loading")}</p>
          ) : memberStatus?.is_member ? (
            <>
              <p className="text-mystic-foreground text-sm">
                {memberStatus.member_type === "partner" ? t("membership.partnerMember") : `${memberStatus.member_type}${t("membership.member")}`}
              </p>
              {memberStatus.member_expire_at && (
                <p className="text-mystic-foreground-muted text-xs">
                  {t("membership.validUntil")} {new Date(memberStatus.member_expire_at).toLocaleDateString(language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : language === "ko" ? "ko-KR" : "en-US")}
                </p>
              )}
            </>
          ) : (
            <>
          <p className="text-mystic-foreground-muted text-sm">{t("membership.freeUser")}</p>
          <p className="text-mystic-foreground text-xs">{t("membership.dailyLimit")}</p>
            </>
          )}
        </div>

        {/* Plan Selection */}
        <div className="space-y-4">
          {isLoadingProducts ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-mystic-foreground/30 border-t-mystic-foreground rounded-full animate-spin mx-auto" />
              <p className="text-mystic-foreground-muted text-sm mt-2">{t("membership.loading")}</p>
            </div>
          ) : (
            products.map((product) => {
              const planType = product.type as PlanType
              // 计算折扣和月均价
              const discount = product.type === "member_year" ? "2.8" : undefined
              const monthly = product.type === "member_year" ? Number((product.price / 12).toFixed(2)) : undefined
              const noteKey = product.type === "member_week" ? "inviteFriend" : undefined
              
              return (
                <button
                  key={product.type}
                  onClick={() => setSelectedPlan(planType)}
                  className={`relative w-full p-4 sm:p-5 rounded-xl border transition-all duration-300 text-left ${
                    selectedPlan === planType
                      ? "border-mystic-foreground/40 bg-mystic-surface"
                      : "border-mystic-border bg-mystic-surface/30 hover:border-mystic-border-strong hover:bg-mystic-surface/50"
                  }`}
                >
                  {/* Recommended Tag */}
                  {product.type === "member_year" && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 text-[10px] tracking-wider uppercase bg-mystic-foreground text-mystic-bg rounded">
                      {t("membership.recommended")}
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-mystic-foreground font-serif tracking-wide">
                          {t(`membership.${product.type === "member_week" ? "week" : product.type === "member_month" ? "month" : "year"}`)}
                        </span>
                        {discount && (
                          <span className="px-1.5 py-0.5 text-[10px] tracking-wide bg-mystic-foreground/10 text-mystic-foreground rounded">
                            {discount}{language === "zh" ? "折" : language === "ja" ? "折" : language === "ko" ? "% 할인" : "% off"}
                          </span>
                        )}
                      </div>
                      {noteKey && <p className="text-mystic-foreground-muted text-xs">{t(`membership.${noteKey}`)}</p>}
                      {monthly && <p className="text-mystic-foreground-muted text-xs">{t("membership.monthly").replace("{price}", monthly.toString())}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-mystic-foreground text-xl sm:text-2xl font-light">¥{product.price}</span>
                        <span className="text-mystic-foreground-muted text-xs ml-1">/{product.days}天</span>
                      </div>

                      {/* Selection Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedPlan === planType
                            ? "border-mystic-foreground bg-mystic-foreground"
                            : "border-mystic-foreground/30"
                        }`}
                      >
                        {selectedPlan === planType && <CheckIcon className="w-3 h-3 text-mystic-bg" />}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Payment Type Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPayType("alipay")}
            className={`py-2.5 rounded-xl border text-sm transition-all ${
              payType === "alipay"
                ? "border-mystic-foreground/40 bg-mystic-surface text-mystic-foreground"
                : "border-mystic-border text-mystic-foreground-muted"
            }`}
          >
            {t("membership.alipay")}
          </button>
          {/* 微信支付暂时隐藏 */}
          <button
            onClick={() => setPayType("wxpay")}
            className={`hidden py-2.5 rounded-xl border text-sm transition-all ${
              payType === "wxpay"
                ? "border-mystic-foreground/40 bg-mystic-surface text-mystic-foreground"
                : "border-mystic-border text-mystic-foreground-muted"
            }`}
          >
            {t("membership.wechat")}
          </button>
          <button
            onClick={() => setPayType("stripe")}
            disabled={!products.find(p => p.type === selectedPlan)?.stripe_enabled}
            className={`py-2.5 rounded-xl border text-sm transition-all ${
              payType === "stripe"
                ? "border-mystic-foreground/40 bg-mystic-surface text-mystic-foreground"
                : "border-mystic-border text-mystic-foreground-muted"
            } ${!products.find(p => p.type === selectedPlan)?.stripe_enabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!products.find(p => p.type === selectedPlan)?.stripe_enabled ? "该套餐不支持 Stripe 支付" : ""}
          >
            Stripe
          </button>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-xl bg-mystic-foreground text-mystic-bg text-sm tracking-wide font-medium hover:bg-mystic-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-mystic-bg/30 border-t-mystic-bg rounded-full animate-spin" />
              {t("membership.processing")}
            </>
          ) : (
            t("membership.activateNow")
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-mystic-border" />
          <span className="text-mystic-foreground-muted text-xs tracking-wide">{t("membership.or")}</span>
          <div className="flex-1 h-px bg-mystic-border" />
        </div>

        {/* Invite Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-mystic-foreground text-sm">{t("membership.inviteFriends")}</p>
              <p className="text-mystic-foreground-muted text-xs mt-0.5">{t("membership.inviteDescription")}</p>
            </div>
            <div className="text-right">
              <p className="text-mystic-foreground text-sm">{invitedCount}/10</p>
              <p className="text-mystic-foreground-muted text-xs">{t("membership.invitedCount").replace("{days}", String(invitedCount * 7))}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-mystic-border rounded-full overflow-hidden">
            <div
              className="h-full bg-mystic-foreground/60 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((invitedCount / 10) * 100, 100)}%` }}
            />
          </div>

          {/* 显示邀请码 */}
          {isLoggedIn && profile?.referral_code && (
            <div className="p-3 rounded-lg bg-mystic-surface/50 border border-mystic-border">
              <p className="text-mystic-foreground-muted text-xs mb-1">{t("membership.myReferralCode")}</p>
              <p className="text-mystic-foreground font-mono text-lg tracking-wider">{profile.referral_code}</p>
            </div>
          )}

          <button
            onClick={handleCopyInviteLink}
            disabled={!isLoggedIn}
            className="w-full py-3 rounded-xl border border-mystic-border text-mystic-foreground text-sm tracking-wide hover:bg-mystic-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggedIn ? t("membership.copyInviteLink") : t("membership.loginToInvite")}
          </button>
        </div>

        {/* Partner Section */}
        <div className="pt-6 space-y-4">
          <div className="relative p-5 rounded-xl border border-mystic-foreground/20 bg-mystic-surface/50">
            {/* Badge */}
            <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 text-[10px] tracking-wider uppercase bg-mystic-foreground text-mystic-bg rounded font-medium">
              {t("membership.partnerPlan")}
            </span>
            
            <div className="flex items-start justify-between mt-1">
              <div className="space-y-2">
                <p className="text-mystic-foreground font-serif tracking-wide">{t("membership.becomePartner")}</p>
                <div className="space-y-1.5 text-mystic-foreground-muted text-xs">
                  <p className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-mystic-foreground/50" />
                    {t("membership.oneYearMembership")}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-mystic-foreground/50" />
                    {t("membership.commission")}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-mystic-foreground/50" />
                    {t("membership.exclusiveMaterials")}
                  </p>
                </div>
            </div>
              <div className="text-right">
            <div className="flex items-baseline gap-1">
              {hasPartnerDiscount && (
                    <span className="text-mystic-foreground-muted text-xs line-through">¥199</span>
              )}
                  <span className="text-mystic-foreground text-2xl font-light">¥{hasPartnerDiscount ? "99" : "199"}</span>
                </div>
                <p className="text-mystic-foreground-muted text-[10px] mt-0.5">{t("membership.oneTime")}</p>
              </div>
            </div>

            {/* 收益示例 */}
            <div className="mt-4 pt-4 border-t border-mystic-border">
              <p className="text-mystic-foreground-muted text-[10px] mb-1">{t("membership.earningExample")}</p>
              <p className="text-mystic-foreground text-sm">
                {t("membership.earningCalculation")}
              </p>
            </div>

            {hasPartnerDiscount && (
              <p className="text-mystic-foreground text-xs mt-3 pt-3 border-t border-mystic-border">
                {t("membership.discountUnlocked")}
              </p>
            )}
          </div>

          <button
            onClick={handleBuyPartner}
            disabled={isProcessing || memberStatus?.is_partner}
            className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-mystic-foreground text-mystic-bg text-sm tracking-wide font-medium hover:bg-mystic-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {memberStatus?.is_partner ? (
              <span>{t("membership.alreadyPartner")}</span>
            ) : (
              <>
                <span>{t("membership.becomePartner")}</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Benefits */}
        <div className="pt-4 space-y-4">
          <p className="text-mystic-foreground-muted text-xs tracking-wide uppercase">{t("membership.memberBenefits")}</p>
          <div className="space-y-3">
            {[
              { label: t("membership.dailyReading"), free: `1 ${t("membership.times")}`, member: extraBenefitLabels.dailyAdvanced },
              { label: t("membership.aiInterpretation"), free: extraBenefitLabels.basic, member: extraBenefitLabels.deep },
              { label: t("membership.historyRecords"), free: extraBenefitLabels.sessionOnly, member: extraBenefitLabels.saved },
              { label: t("membership.exclusiveSpreads"), free: extraBenefitLabels.basicSpread, member: extraBenefitLabels.advancedSpread },
              { label: extraBenefitLabels.deepReports, free: t("membership.notAvailable"), member: t("membership.available") },
              { label: extraBenefitLabels.shareImages, free: extraBenefitLabels.basic, member: extraBenefitLabels.enhanced },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-mystic-border/50">
                <span className="text-mystic-foreground text-sm">{item.label}</span>
                <div className="flex items-center gap-6 text-xs">
                  <span className="text-mystic-foreground-muted w-12 text-center">{item.free}</span>
                  <span className="text-mystic-foreground w-12 text-center">{item.member}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default function MembershipPage() {
  return (
    <div className="relative min-h-screen w-full bg-mystic-bg">
      {/* Fixed background layer */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              #4c2a78 0%, 
              #251240 40%, 
              #0d0516 70%, 
              #020103 100%)`,
          }}
        />
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {STAR_POSITIONS.map((star, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white rounded-full animate-pulse"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="w-8 h-8 border-2 border-mystic-foreground/30 border-t-mystic-foreground rounded-full animate-spin" />
        </div>
      }>
        <MembershipContent />
      </Suspense>
    </div>
  )
}
