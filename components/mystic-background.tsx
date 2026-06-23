"use client"

import { useEffect, useState, Suspense, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BackgroundGradient } from "./mystic/background-gradient"
import { StarsLayer } from "./mystic/stars-layer"
import { CoreLight } from "./mystic/core-light"
import { TarotCard } from "./mystic/tarot-card"
import { MysticAnimations } from "./mystic/mystic-animations"
import { MenuButton } from "./menu-button"
import { MenuPanel } from "./menu-panel"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { getLocalDateKey } from "@/lib/daily-tarot"

const DEFAULT_FRONT = "/images/0.png"
const DEFAULT_BACK = "/images/back1.jpg"

// 单独提取 searchParams 相关逻辑
function ReferralCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      localStorage.setItem("poptarot_ref", ref.toUpperCase())
    }
  }, [searchParams])

  return null
}

function HomeQuestionForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [question, setQuestion] = useState("")

  const copy =
    {
      zh: {
        label: "从一个真实问题开始",
        placeholder: "输入你的问题...",
        action: "抽牌",
        examples: ["他对我是什么感觉？", "我该换工作吗？", "今天我需要注意什么？"],
      },
      en: {
        label: "Start with one real question",
        placeholder: "Ask your question...",
        action: "Draw",
        examples: ["Will my ex come back?", "Should I quit my job?", "What do I need today?"],
      },
      ja: {
        label: "ひとつの本当の質問から",
        placeholder: "質問を入力...",
        action: "引く",
        examples: ["相手の気持ちは？", "転職すべき？", "今日必要なメッセージは？"],
      },
      ko: {
        label: "진짜 질문 하나로 시작",
        placeholder: "질문을 입력하세요...",
        action: "뽑기",
        examples: ["그 사람 마음은?", "이직해야 할까?", "오늘 필요한 조언은?"],
      },
    }[language]

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) {
      router.push("/input?source=home")
      return
    }
    sessionStorage.setItem("tarot_question", trimmed)
    router.push(`/input?q=${encodeURIComponent(trimmed)}&auto=1&source=home`)
  }

  return (
    <form
      onSubmit={submitQuestion}
      className="relative z-30 mx-auto w-[calc(100vw_-_3rem)] max-w-[460px] md:max-w-[560px] lg:max-w-[620px]"
    >
      <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/42 md:text-xs">
        {copy.label}
      </p>
      <div className="group relative rounded-lg border border-white/14 bg-black/38 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-md transition focus-within:border-[#aaa1ff]/65">
        <div className="pointer-events-none absolute -inset-1 rounded-lg bg-[#aaa1ff]/10 opacity-0 blur-xl transition group-focus-within:opacity-100" />
        <div className="relative flex items-center">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={copy.placeholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:px-5 md:py-4 md:text-base"
          />
        </div>
      </div>
      <button
        type="submit"
        aria-label={copy.action}
        className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f5f2ff_0%,#b7adff_42%,#6d63d8_100%)] text-sm font-medium text-[#0c0920] shadow-[0_18px_45px_rgba(109,99,216,0.28)] transition hover:brightness-110 md:h-11"
      >
        <span>{copy.action}</span>
      </button>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
        {copy.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuestion(example)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[11px] text-white/58 transition hover:border-[#aaa1ff]/45 hover:text-white"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  )
}

function HomeDailyReturnPanel() {
  const { language } = useLanguage()
  const [hasDailyEntry, setHasDailyEntry] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const today = getLocalDateKey()
    const raw = localStorage.getItem(`poptarot_daily_${today}`)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { interpretation?: string | null; streak_count?: number | null }
      setHasDailyEntry(Boolean(parsed.interpretation))
      setStreak(Number(parsed.streak_count || 0))
    } catch {
      // Ignore corrupt local daily tarot cache.
    }
  }, [])

  const copy =
    {
      zh: {
        eyebrow: "每日复访",
        titleReady: "今天的每日塔罗还没抽",
        titleDone: "今天的每日牌已保存",
        bodyReady: "每天一张免费牌，保留连续打卡和日记，比一次性解读更容易形成回访。",
        bodyDone: "明天回来继续打卡；也可以补一条日记，记录这张牌今天是否应验在情绪或行动上。",
        primary: "打开每日塔罗",
        secondary: "查看牌义",
        streak: "连续",
        days: "天",
      },
      en: {
        eyebrow: "Daily return",
        titleReady: "Today's Daily Tarot is waiting",
        titleDone: "Today's daily card is saved",
        bodyReady: "One free card each day keeps the habit light: draw, read, journal, and return tomorrow.",
        bodyDone: "Come back tomorrow to keep the streak, or add a short journal note while today's card is still fresh.",
        primary: "Open Daily Tarot",
        secondary: "Learn card meanings",
        streak: "Streak",
        days: "days",
      },
      ja: {
        eyebrow: "毎日の入口",
        titleReady: "今日のタロットを引けます",
        titleDone: "今日のカードを保存済み",
        bodyReady: "毎日一枚だけなら続けやすく、記録と振り返りでまた戻ってこられます。",
        bodyDone: "明日また戻って連続記録を続けるか、今日のカードに短いメモを残しましょう。",
        primary: "毎日のタロットへ",
        secondary: "カードの意味",
        streak: "連続",
        days: "日",
      },
      ko: {
        eyebrow: "매일 돌아오기",
        titleReady: "오늘의 데일리 타로가 기다려요",
        titleDone: "오늘의 카드가 저장됐어요",
        bodyReady: "하루 한 장 무료 카드로 가볍게 시작하고, 기록과 저널로 다시 돌아오세요.",
        bodyDone: "내일 다시 돌아와 연속 기록을 이어가거나, 오늘 카드에 짧은 저널을 남겨보세요.",
        primary: "데일리 타로 열기",
        secondary: "카드 의미 보기",
        streak: "연속",
        days: "일",
      },
    }[language]

  return (
    <div className="relative z-30 mx-auto mt-5 w-[calc(100vw_-_3rem)] max-w-[620px] rounded-lg border border-white/10 bg-black/28 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-md sm:mt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72 sm:text-xs">{copy.eyebrow}</p>
          <h2 className="mt-2 text-base font-medium leading-snug text-white sm:text-lg">
            {hasDailyEntry ? copy.titleDone : copy.titleReady}
          </h2>
          <p className="mt-2 text-xs leading-6 text-white/54 sm:text-sm">
            {hasDailyEntry ? copy.bodyDone : copy.bodyReady}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:w-[168px]">
          {streak > 0 && (
            <div className="rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/[0.08] px-3 py-2 text-center text-xs text-[#eeeaff]">
              {copy.streak} {streak} {copy.days}
            </div>
          )}
          <a
            href="/daily-tarot"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 text-sm font-medium text-[#120c22] shadow-[0_14px_35px_rgba(143,128,238,0.22)] transition hover:brightness-110"
          >
            {copy.primary}
          </a>
          <a
            href="/tarot-card-meanings"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-white/68 transition hover:border-[#bfb6ff]/35 hover:text-white"
          >
            {copy.secondary}
          </a>
        </div>
      </div>
    </div>
  )
}

function HomeScrollContent() {
  const { language } = useLanguage()
  const copy =
    {
      zh: {
        eyebrow: "继续探索",
        title: "每天回来，或直接问一个具体问题",
        body: "免费入口负责起步；牌义、每日塔罗和长尾问题页负责复访与搜索收录。",
        trustEyebrow: "信任与透明",
        trustTitle: "先免费体验，也能清楚知道它如何工作",
        trustBody: "补充阅读编辑说明、AI 解读边界、隐私政策、用户反馈和真实问题案例。",
        items: [
          { href: "/daily-tarot", title: "每日塔罗", body: "每日一牌、连续打卡、保存日记。" },
          { href: "/tarot-spreads", title: "免费牌阵", body: "爱情、事业、是/否问题直接匹配牌阵。" },
          { href: "/tarot-questions", title: "问题入口", body: "前任、爱情、事业和是否问题直接开始。" },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "适合快速判断，但保留 AI 解释。" },
          { href: "/love-tarot-reading", title: "爱情塔罗", body: "感情、复合、对方想法专项入口。" },
          { href: "/tarot-card-meanings", title: "牌义大全", body: "78 张牌的正位、逆位和场景解读。" },
        ],
        trustItems: [
          { href: "/about", title: "关于" },
          { href: "/official-channels", title: "官方渠道" },
          { href: "/editorial-policy", title: "编辑说明" },
          { href: "/ai-tarot-disclaimer", title: "AI 声明" },
          { href: "/privacy", title: "隐私" },
          { href: "/reviews", title: "用户评价" },
          { href: "/tarot-reading-examples", title: "真实案例" },
        ],
        feedbackEyebrow: "读者反馈",
        feedbackTitle: "好的免费解读，应该先让人更清楚",
        feedbackBody: "这些是我们优化产品时参考的代表性体验：快速、具体、不过度承诺，并且能给出下一步。",
        feedbackItems: [
          { title: "每日塔罗", body: "每日一牌比泛泛的运势更容易坚持，因为它只给今天一个重点。" },
          { title: "爱情问题", body: "感情解读不只回答是或否，而是解释能观察什么、接下来怎么问。" },
          { title: "事业选择", body: "事业牌阵帮助区分短期疲惫和真正需要制定离开计划的信号。" },
        ],
        assuranceItems: [
          { title: "免费优先", body: "第一次解读、每日塔罗、牌义和问题页都先提供免费价值。" },
          { title: "会员后置", body: "会员主要用于深度追问、历史保存、高级牌阵和长期报告。" },
          { title: "边界清楚", body: "AI 塔罗是反思工具，不替代医疗、法律、财务或安全建议。" },
        ],
      },
      en: {
        eyebrow: "Explore next",
        title: "Come back daily, or ask a precise question",
        body: "Free readings start the loop. Daily tarot, card meanings, and long-tail tools make the site worth revisiting.",
        trustEyebrow: "Trust and transparency",
        trustTitle: "Try it free, and see how the guidance is framed",
        trustBody: "Read the editorial policy, AI disclaimer, privacy notes, representative reviews, and realistic reading examples.",
        items: [
          { href: "/daily-tarot", title: "Daily Tarot", body: "One card, streaks, journal, and reminders." },
          { href: "/tarot-spreads", title: "Tarot Spreads", body: "Choose yes/no, love, ex, career, and decision spreads." },
          { href: "/tarot-questions", title: "Tarot Questions", body: "Start from ex, love, yes/no, and career questions." },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "A quick answer with the reason behind it." },
          { href: "/love-tarot-reading", title: "Love Tarot", body: "Feelings, reconnection, and relationship clarity." },
          { href: "/tarot-card-meanings", title: "Card Meanings", body: "Upright, reversed, love, career, money, and advice." },
        ],
        trustItems: [
          { href: "/about", title: "About" },
          { href: "/official-channels", title: "Official" },
          { href: "/editorial-policy", title: "Editorial" },
          { href: "/ai-tarot-disclaimer", title: "AI Disclaimer" },
          { href: "/privacy", title: "Privacy" },
          { href: "/reviews", title: "Reviews" },
          { href: "/tarot-reading-examples", title: "Examples" },
        ],
        feedbackEyebrow: "Reader feedback",
        feedbackTitle: "A good free reading should make the next step clearer",
        feedbackBody: "These representative patterns describe the experience we optimize for: fast, specific, grounded, and easy to return to.",
        feedbackItems: [
          { title: "Daily tarot", body: "One daily card is easier to keep using because it gives a single focus instead of vague horoscope text." },
          { title: "Love questions", body: "Relationship readings should explain what can be observed next, not only force a yes or no answer." },
          { title: "Career choices", body: "Career spreads help separate temporary burnout from a real signal to build a practical exit plan." },
        ],
        assuranceItems: [
          { title: "Free first", body: "The first reading, daily tarot, card meanings, and question pages are designed to be useful without payment." },
          { title: "Membership second", body: "Paid features are reserved for deeper follow-ups, saved history, advanced spreads, and longer reports." },
          { title: "Clear limits", body: "AI tarot is reflective guidance, not medical, legal, financial, psychological, or safety advice." },
        ],
      },
      ja: {
        eyebrow: "次に見る",
        title: "毎日の一枚、または具体的な質問へ",
        body: "無料リーディングから始め、毎日・カード意味・質問別ページで継続利用できます。",
        trustEyebrow: "信頼と透明性",
        trustTitle: "無料で試し、読み方の前提も確認できます",
        trustBody: "編集方針、AI 免責、プライバシー、レビュー、質問例を確認できます。",
        items: [
          { href: "/daily-tarot", title: "今日のタロット", body: "一枚引き、記録、リマインダー。" },
          { href: "/tarot-spreads", title: "Tarot Spreads", body: "恋愛、仕事、Yes/No に合うスプレッド。" },
          { href: "/tarot-questions", title: "質問別タロット", body: "復縁、恋愛、仕事、Yes/No から開始。" },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "短い答えと理由を確認。" },
          { href: "/love-tarot-reading", title: "恋愛タロット", body: "気持ち、復縁、関係の流れ。" },
          { href: "/tarot-card-meanings", title: "カードの意味", body: "正位置、逆位置、恋愛、仕事、金運。" },
        ],
        trustItems: [
          { href: "/about", title: "About" },
          { href: "/official-channels", title: "Official" },
          { href: "/editorial-policy", title: "Editorial" },
          { href: "/ai-tarot-disclaimer", title: "AI Disclaimer" },
          { href: "/privacy", title: "Privacy" },
          { href: "/reviews", title: "Reviews" },
          { href: "/tarot-reading-examples", title: "Examples" },
        ],
        feedbackEyebrow: "読者の声",
        feedbackTitle: "よい無料リーディングは、次の一歩を少し明確にします",
        feedbackBody: "私たちは、速く、具体的で、過度に断定せず、また戻ってきやすい体験を目指しています。",
        feedbackItems: [
          { title: "毎日のタロット", body: "一枚だけのカードは、今日の焦点を絞りやすく、続けやすい形式です。" },
          { title: "恋愛の質問", body: "恋愛リーディングは Yes/No だけでなく、観察すべき行動を示します。" },
          { title: "仕事の選択", body: "仕事のスプレッドは、一時的な疲れと計画すべき転機を分けて考えます。" },
        ],
        assuranceItems: [
          { title: "まず無料", body: "初回リーディング、毎日の一枚、カード意味、質問ページは無料で使えます。" },
          { title: "会員は後から", body: "会員機能は深い追質問、履歴保存、高度なスプレッド、長いレポート向けです。" },
          { title: "限界を明確に", body: "AI タロットは内省の補助であり、専門的な助言の代わりではありません。" },
        ],
      },
      ko: {
        eyebrow: "다음 탐색",
        title: "매일 돌아오거나 구체적인 질문을 해보세요",
        body: "무료 리딩으로 시작하고, 데일리 타로와 카드 의미 페이지로 다시 방문하게 만듭니다.",
        trustEyebrow: "신뢰와 투명성",
        trustTitle: "무료로 시작하고, 해석 기준도 확인하세요",
        trustBody: "편집 원칙, AI 안내, 개인정보, 리뷰, 실제 질문 예시를 확인할 수 있습니다.",
        items: [
          { href: "/daily-tarot", title: "오늘의 타로", body: "한 장 뽑기, 기록, 알림." },
          { href: "/tarot-spreads", title: "Tarot Spreads", body: "사랑, 커리어, 예/아니오 질문별 스프레드." },
          { href: "/tarot-questions", title: "질문별 타로", body: "재회, 사랑, 커리어, 예/아니오로 시작." },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "빠른 답과 그 이유." },
          { href: "/love-tarot-reading", title: "연애 타로", body: "감정, 재회, 관계 흐름." },
          { href: "/tarot-card-meanings", title: "카드 의미", body: "정방향, 역방향, 사랑, 커리어, 조언." },
        ],
        trustItems: [
          { href: "/about", title: "About" },
          { href: "/official-channels", title: "Official" },
          { href: "/editorial-policy", title: "Editorial" },
          { href: "/ai-tarot-disclaimer", title: "AI Disclaimer" },
          { href: "/privacy", title: "Privacy" },
          { href: "/reviews", title: "Reviews" },
          { href: "/tarot-reading-examples", title: "Examples" },
        ],
        feedbackEyebrow: "사용자 피드백",
        feedbackTitle: "좋은 무료 리딩은 다음 행동을 더 분명하게 만듭니다",
        feedbackBody: "빠르고, 구체적이며, 과장하지 않고, 다시 돌아오기 쉬운 경험을 기준으로 제품을 다듬고 있습니다.",
        feedbackItems: [
          { title: "데일리 타로", body: "하루 한 장은 막연한 운세보다 오늘의 초점을 하나로 잡기 쉽습니다." },
          { title: "연애 질문", body: "관계 리딩은 예/아니오뿐 아니라 다음에 관찰할 행동을 설명해야 합니다." },
          { title: "커리어 선택", body: "커리어 스프레드는 일시적 번아웃과 실제 전환 신호를 구분하는 데 도움을 줍니다." },
        ],
        assuranceItems: [
          { title: "무료 우선", body: "첫 리딩, 데일리 타로, 카드 의미, 질문 페이지는 결제 없이 유용하게 설계되어 있습니다." },
          { title: "멤버십은 이후", body: "유료 기능은 심층 후속 질문, 기록 저장, 고급 스프레드, 긴 리포트에 집중합니다." },
          { title: "명확한 한계", body: "AI 타로는 성찰을 돕는 도구이며 전문 조언을 대체하지 않습니다." },
        ],
      },
    }[language]

  return (
    <section className="relative z-10 mx-auto w-[min(92vw,1040px)] px-1 pb-20 pt-12 sm:pt-20">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">{copy.title}</h2>
        <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">{copy.body}</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {copy.items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#bfb6ff]/45 hover:bg-white/[0.07]"
          >
            <h3 className="text-base font-medium text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/52">{item.body}</p>
          </a>
        ))}
      </div>
      <div className="mt-12 border-t border-white/10 pt-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.trustEyebrow}</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_1.25fr] lg:items-end">
          <div>
            <h2 className="font-serif text-2xl text-white sm:text-3xl">{copy.trustTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.trustBody}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {copy.trustItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white/62 transition hover:border-[#bfb6ff]/45 hover:text-white"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 pt-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.feedbackEyebrow}</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-serif text-2xl text-white sm:text-3xl">{copy.feedbackTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.feedbackBody}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {copy.feedbackItems.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {copy.assuranceItems.map((item) => (
            <article key={item.title} className="rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4">
              <h3 className="text-sm font-medium text-[#eeeaff]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/56">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function MysticContent() {
  const { language } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [customFront, setCustomFront] = useState<string | null>(null)
  const [customBack, setCustomBack] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const heroCopy =
    {
      zh: {
        eyebrow: "免费 AI 塔罗工具",
        line: "先免费抽牌解读；深度追问、历史保存和报告再升级。",
      },
      en: {
        eyebrow: "Free AI Tarot Tool",
        line: "Ask a question, draw cards, and get your first AI tarot reading free.",
      },
      ja: {
        eyebrow: "無料 AI タロット",
        line: "質問して、まず無料で AI リーディング。",
      },
      ko: {
        eyebrow: "무료 AI 타로 도구",
        line: "질문하고 먼저 무료 AI 리딩을 받아보세요.",
      },
    }[language]

  return (
    <div className="allow-scroll home-hero-stage relative min-h-screen overflow-x-hidden bg-mystic-bg">
      <div className="absolute inset-0 z-0 min-h-full pointer-events-none">
        {/* 1. Background gradient */}
        <BackgroundGradient />

        {/* 2. Dynamic twinkling stars */}
        <StarsLayer count={isMobile ? 80 : 150} />
      </div>

      {/* Header Area - 确保所有元素垂直居中对齐 */}
      <header className="absolute top-4 left-0 right-0 sm:top-6 md:top-7 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 pointer-events-none">
        <div className="flex-1 flex justify-start pointer-events-auto">
          <MenuButton isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>
        
        <h1 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[0.12em] sm:tracking-[0.18em] md:tracking-[0.24em] text-mystic-foreground drop-shadow-[0_0_15px_var(--mystic-glow)] whitespace-nowrap pointer-events-auto">
          POP TAROT
        </h1>

        <div className="flex-1 flex justify-end pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </header>

      {menuOpen && (
        <MenuPanel
          isOpen={menuOpen}
          frontImage={customFront}
          backImage={customBack}
          onFrontChange={setCustomFront}
          onBackChange={setCustomBack}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <div className="relative min-h-[142svh] overflow-visible pb-[calc(env(safe-area-inset-bottom)+6rem)] sm:min-h-[132svh] md:min-h-[124svh] md:pb-28">
        <section
          data-home-hero-copy
          className="pointer-events-none relative z-30 mx-auto w-[calc(100vw_-_2rem)] max-w-[680px] pt-[8rem] text-center sm:pt-[8.75rem] md:pt-[9.25rem] lg:pt-[9.75rem]"
        >
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#c9c0ff]/80 sm:text-xs">
            {heroCopy.eyebrow}
          </p>
          <p className="mx-auto mt-3 max-w-[20rem] break-words text-xs leading-6 text-white/58 [overflow-wrap:anywhere] sm:max-w-[34rem] sm:text-sm md:text-base">
            {heroCopy.line}
          </p>
        </section>

        {/* 4. 3D rotating tarot card - use custom images if available */}
        <div
          data-home-card-scene
          className="absolute left-0 right-0 top-[var(--home-hero-focal-y)] z-20 h-0 overflow-visible"
        >
          <div
            data-home-focal-glow
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-0 h-[min(78vw,34rem)] w-[min(78vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,244,255,0.54)_0%,rgba(170,161,255,0.32)_32%,rgba(76,42,120,0.14)_58%,transparent_76%)] blur-2xl mix-blend-screen md:h-[34rem] md:w-[34rem]"
          />
          <CoreLight className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex h-0 items-center justify-center" />
          <div
            data-home-card-anchor
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 overflow-visible"
          >
            <TarotCard
              frontImage={customFront || DEFAULT_FRONT}
              backImage={customBack || DEFAULT_BACK}
              tiltAngle={-15}
              rotationDuration={12}
            />
          </div>
        </div>

        <div className="relative z-30 pt-[var(--home-hero-content-y)]">
          <HomeQuestionForm />

          <HomeDailyReturnPanel />

          <div className="relative z-30 mx-auto mt-5 flex w-[min(92vw,520px)] items-center justify-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] text-white/52 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md md:mt-6 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-xs md:text-white/44 md:shadow-none md:backdrop-blur-0">
            <a href="/daily-tarot" className="transition hover:text-white">
              Daily Tarot
            </a>
            <span className="h-1 w-1 rounded-full bg-white/24" />
            <a href="/tarot-spreads" className="transition hover:text-white">
              Spreads
            </a>
            <span className="h-1 w-1 rounded-full bg-white/24" />
            <a href="/tarot-card-meanings" className="transition hover:text-white">
              Card Meanings
            </a>
            <span className="h-1 w-1 rounded-full bg-white/24" />
            <a href="/about" className="transition hover:text-white">
              About
            </a>
          </div>
        </div>
      </div>

      <HomeScrollContent />

      {/* Global animations */}
      <MysticAnimations />

      {/* 捕获邀请码 */}
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
    </div>
  )
}

export default function MysticBackground() {
  return <MysticContent />
}
