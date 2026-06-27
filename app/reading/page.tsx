"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Archive, CalendarPlus, Copy, Instagram, Mail, MessageSquare, Share2 } from "lucide-react"
import type { DrawnCard } from "@/lib/tarot-cards"
import { getCardName } from "@/lib/tarot-cards"
import BlurText from "@/components/ui/blur-text"
import ReactMarkdown from "react-markdown"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi, readingApi, getAccessToken, authApi, setAccessToken, type SpreadConfig } from "@/lib/api"
import { downloadDailyReturnCalendar } from "@/lib/client-calendar-reminder"
import { createShareTemplate, type ShareTemplatePlatform } from "@/lib/share-templates"
import { getCurrentAttribution } from "@/lib/client-analytics"
import { isLocale, isSeoLocale, type Locale, type SeoLocale } from "@/lib/locales"
import type { SpreadType } from "@/lib/spread-config"

interface Message {
  id: string
  type: "reading" | "followup"
  content: string
  question?: string
}

type ReadingNextFreeItem = {
  label: string
  body: string
  campaign: string
  href?: string
  question?: string
  spread?: SpreadType
}

export default function ReadingPage() {
  const router = useRouter()
  const { user, isLoggedIn, refreshUser } = useAuth()
  const { t, language } = useLanguage()
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [question, setQuestion] = useState("")
  const [readingLocale, setReadingLocale] = useState(language)
  const [spreadType, setSpreadType] = useState("three_card")
  const [spreadConfig, setSpreadConfig] = useState<SpreadConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStreaming, setCurrentStreaming] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")
  const hasStartedRef = useRef(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [followUpInput, setFollowUpInput] = useState("")
  const contentEndRef = useRef<HTMLDivElement>(null)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [isExiting, setIsExiting] = useState(false)
  const [readingId, setReadingId] = useState<string | null>(null)
  const [fullInterpretation, setFullInterpretation] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [shareStatus, setShareStatus] = useState("")
  const [isCreatingShare, setIsCreatingShare] = useState(false)
  const [readingCount, setReadingCount] = useState(0)
  const activeReadingLocale: SeoLocale = isSeoLocale(readingLocale) ? readingLocale : "en"
  const shareTemplateLocale: Locale = isLocale(activeReadingLocale) ? activeReadingLocale : "en"
  const shareCopy =
    {
      zh: {
        title: "SHARE",
        description: "生成一个公开结果页，分享时会带上牌面图片。",
        button: "分享",
        loading: "生成中",
        generated: "分享链接已生成",
        copied: "分享链接已复制",
        xhs: "小红书文案",
        instagram: "Instagram 文案",
        emailSelf: "发到我的邮箱",
        feedback: "提交反馈",
        emailSubject: "我的 POPTarot 解读",
        emailIntro: "这是我在 POPTarot 的免费 AI 塔罗解读，留给自己明天再看。",
        emailCardsLabel: "抽到的牌",
        emailInsightLabel: "AI 解读摘录",
        emailOpenLabel: "打开解读",
        emailDailyLabel: "明天继续每日塔罗",
        emailOpened: "已打开邮件草稿",
        templateCopied: "分享文案已复制",
        fallbackGenerated: "已生成可分享文案；登录后可创建公开结果页。",
        fallbackCopied: "分享文案已复制；登录后可创建公开结果页。",
        failed: "分享失败，请稍后重试",
        memberTitle: "需要深入时再打开进阶功能",
        memberText: "会员只放在更深层体验里：深度追问、保存历史、高级牌阵和月度报告。",
        memberButton: "查看进阶功能",
        saveTitle: "需要留存时再升级",
        saveText: "你已经体验了 {count} 次。会员可以保存解读历史，回看反复出现的牌和主题。",
        saveButton: "升级保存历史",
      },
      en: {
        title: "SHARE",
        description: "Create a public result page with card images for social sharing.",
        button: "Share",
        loading: "Creating",
        generated: "Share link ready",
        copied: "Share link copied",
        xhs: "Xiaohongshu copy",
        instagram: "Instagram caption",
        emailSelf: "Email to myself",
        feedback: "Leave feedback",
        emailSubject: "My POPTarot reading",
        emailIntro: "Here is my free AI tarot reading from POPTarot, saved so I can revisit it tomorrow.",
        emailCardsLabel: "Cards",
        emailInsightLabel: "AI insight excerpt",
        emailOpenLabel: "Open reading",
        emailDailyLabel: "Continue with Daily Tarot tomorrow",
        emailOpened: "Email draft opened",
        templateCopied: "Share caption copied",
        fallbackGenerated: "Share caption ready. Log in to create a public result page.",
        fallbackCopied: "Share caption copied. Log in to create a public result page.",
        failed: "Sharing failed. Please try again.",
        memberTitle: "Go deeper only when you need it",
        memberText: "Membership stays for deeper follow-ups, saved history, advanced spreads, and monthly reports.",
        memberButton: "View advanced features",
        saveTitle: "Save history when it matters",
        saveText: "You have tried {count} readings. Members can save reading history and revisit repeated cards and themes.",
        saveButton: "Upgrade to save history",
      },
      ja: {
        title: "SHARE",
        description: "カード画像つきの公開結果ページを作成します。",
        button: "共有",
        loading: "作成中",
        generated: "共有リンクを作成しました",
        copied: "共有リンクをコピーしました",
        xhs: "小紅書テキスト",
        instagram: "Instagramキャプション",
        emailSelf: "自分にメール",
        feedback: "感想を送る",
        emailSubject: "POPTarot リーディング",
        emailIntro: "POPTarot の無料 AI タロットリーディングを、明日見返すために保存します。",
        emailCardsLabel: "カード",
        emailInsightLabel: "AIリーディング抜粋",
        emailOpenLabel: "リーディングを開く",
        emailDailyLabel: "明日のデイリータロットへ",
        emailOpened: "メール下書きを開きました",
        templateCopied: "共有テキストをコピーしました",
        fallbackGenerated: "共有テキストを用意しました。ログインすると公開結果ページを作成できます。",
        fallbackCopied: "共有テキストをコピーしました。ログインすると公開結果ページを作成できます。",
        failed: "共有に失敗しました。もう一度お試しください。",
        memberTitle: "必要な時だけ深く読む",
        memberText: "会員機能は深い追質問、履歴保存、高度なスプレッド、月次レポートのために用意されています。",
        memberButton: "会員特典を見る",
        saveTitle: "必要な時だけ履歴を保存",
        saveText: "{count} 回体験しました。会員は履歴を保存し、繰り返し出るカードやテーマを見返せます。",
        saveButton: "履歴保存をアップグレード",
      },
      ko: {
        title: "SHARE",
        description: "카드 이미지가 포함된 공개 결과 페이지를 만듭니다.",
        button: "공유",
        loading: "생성 중",
        generated: "공유 링크가 생성되었습니다",
        copied: "공유 링크를 복사했습니다",
        xhs: "샤오홍슈 문구",
        instagram: "Instagram 캡션",
        emailSelf: "내 이메일로 보내기",
        feedback: "피드백 남기기",
        emailSubject: "나의 POPTarot 리딩",
        emailIntro: "내일 다시 보기 위해 POPTarot 무료 AI 타로 리딩을 저장합니다.",
        emailCardsLabel: "카드",
        emailInsightLabel: "AI 해석 요약",
        emailOpenLabel: "리딩 열기",
        emailDailyLabel: "내일 데일리 타로 계속하기",
        emailOpened: "이메일 초안이 열렸습니다",
        templateCopied: "공유 문구를 복사했습니다",
        fallbackGenerated: "공유 문구가 준비되었습니다. 로그인하면 공개 결과 페이지를 만들 수 있습니다.",
        fallbackCopied: "공유 문구를 복사했습니다. 로그인하면 공개 결과 페이지를 만들 수 있습니다.",
        failed: "공유에 실패했습니다. 다시 시도해 주세요.",
        memberTitle: "필요할 때만 더 깊게 보기",
        memberText: "멤버십은 심층 질문, 기록 저장, 고급 스프레드, 월간 리포트에만 배치됩니다.",
        memberButton: "멤버십 보기",
        saveTitle: "필요할 때 기록 저장",
        saveText: "{count}번 체험했습니다. 멤버는 리딩 기록과 반복되는 카드, 주제를 다시 볼 수 있습니다.",
        saveButton: "기록 저장 업그레이드",
      },
      es: {
        title: "SHARE",
        description: "Crea una pagina publica con las cartas para compartirla.",
        button: "Compartir",
        loading: "Creando",
        generated: "Enlace listo",
        copied: "Enlace copiado",
        xhs: "Texto Xiaohongshu",
        instagram: "Caption Instagram",
        emailSelf: "Enviarme por email",
        feedback: "Dejar feedback",
        emailSubject: "Mi lectura POPTarot",
        emailIntro: "Esta es mi lectura gratis de tarot con IA en POPTarot, guardada para revisarla manana.",
        emailCardsLabel: "Cartas",
        emailInsightLabel: "Extracto de la lectura IA",
        emailOpenLabel: "Abrir lectura",
        emailDailyLabel: "Continuar manana con Tarot Diario",
        emailOpened: "Borrador de email abierto",
        templateCopied: "Texto copiado",
        fallbackGenerated: "Texto listo. Inicia sesion para crear una pagina publica.",
        fallbackCopied: "Texto copiado. Inicia sesion para crear una pagina publica.",
        failed: "No se pudo compartir. Intentalo de nuevo.",
        memberTitle: "Profundiza solo cuando lo necesites",
        memberText: "La membresia queda para preguntas profundas, historial guardado, tiradas avanzadas e informes mensuales.",
        memberButton: "Ver funciones avanzadas",
        saveTitle: "Guarda historial cuando importe",
        saveText: "Ya probaste {count} lecturas. Los miembros pueden guardar historial y revisar cartas o temas repetidos.",
        saveButton: "Mejorar para guardar historial",
      },
      "pt-br": {
        title: "SHARE",
        description: "Crie uma pagina publica com as cartas para compartilhar.",
        button: "Compartilhar",
        loading: "Criando",
        generated: "Link pronto",
        copied: "Link copiado",
        xhs: "Texto Xiaohongshu",
        instagram: "Legenda Instagram",
        emailSelf: "Enviar para meu email",
        feedback: "Enviar feedback",
        emailSubject: "Minha leitura POPTarot",
        emailIntro: "Esta e minha leitura gratis de tarot com IA no POPTarot, salva para rever amanha.",
        emailCardsLabel: "Cartas",
        emailInsightLabel: "Trecho da leitura IA",
        emailOpenLabel: "Abrir leitura",
        emailDailyLabel: "Continuar amanha com Tarot Diario",
        emailOpened: "Rascunho de email aberto",
        templateCopied: "Texto copiado",
        fallbackGenerated: "Texto pronto. Entre para criar uma pagina publica.",
        fallbackCopied: "Texto copiado. Entre para criar uma pagina publica.",
        failed: "Nao foi possivel compartilhar. Tente de novo.",
        memberTitle: "Aprofunde apenas quando precisar",
        memberText: "A assinatura fica para perguntas profundas, historico salvo, tiragens avancadas e relatorios mensais.",
        memberButton: "Ver recursos avancados",
        saveTitle: "Salve historico quando fizer sentido",
        saveText: "Voce ja testou {count} leituras. Membros podem salvar historico e rever cartas ou temas repetidos.",
        saveButton: "Fazer upgrade para salvar historico",
      },
    }[activeReadingLocale] || {
      title: "SHARE",
      description: "Create a public result page with card images for social sharing.",
      button: "Share",
      loading: "Creating",
      generated: "Share link ready",
      copied: "Share link copied",
      xhs: "Xiaohongshu copy",
      instagram: "Instagram caption",
      emailSelf: "Email to myself",
      feedback: "Leave feedback",
      emailSubject: "My POPTarot reading",
      emailIntro: "Here is my free AI tarot reading from POPTarot, saved so I can revisit it tomorrow.",
      emailCardsLabel: "Cards",
      emailInsightLabel: "AI insight excerpt",
      emailOpenLabel: "Open reading",
      emailDailyLabel: "Continue with Daily Tarot tomorrow",
      emailOpened: "Email draft opened",
      templateCopied: "Share caption copied",
      fallbackGenerated: "Share caption ready. Log in to create a public result page.",
      fallbackCopied: "Share caption copied. Log in to create a public result page.",
      failed: "Sharing failed. Please try again.",
      memberTitle: "Go deeper only when you need it",
      memberText: "Membership stays for deeper follow-ups, saved history, advanced spreads, and monthly reports.",
      memberButton: "View advanced features",
      saveTitle: "Save history when it matters",
      saveText: "You have tried {count} readings. Members can save reading history and revisit repeated cards and themes.",
      saveButton: "Upgrade to save history",
    }

  const shareFreeLoopCopy =
    {
      zh: {
        eyebrow: "免费分享链路",
        title: "先分享和回访，不急着升级",
        body: "公开结果页、社媒文案和发给自己的邮件都可以先免费完成；会员只用于保存历史、深度追问和月度报告。",
        steps: ["公开结果页", "社媒文案", "发给自己"],
      },
      en: {
        eyebrow: "Free share loop",
        title: "Share and revisit first, upgrade later",
        body: "Public result pages, social captions, and self-email are available before membership. Upgrades stay for saved history, deeper follow-ups, and monthly reports.",
        steps: ["Public result page", "Social caption", "Email yourself"],
      },
      ja: {
        eyebrow: "無料共有ループ",
        title: "まず共有と再訪、アップグレードは後で",
        body: "公開結果ページ、SNS用テキスト、自分宛メールは会員登録前に使えます。会員機能は履歴保存、深い追質問、月次レポート用です。",
        steps: ["公開結果ページ", "SNSテキスト", "自分にメール"],
      },
      ko: {
        eyebrow: "무료 공유 루프",
        title: "먼저 공유하고 다시 보기, 업그레이드는 나중에",
        body: "공개 결과 페이지, 소셜 문구, 내 이메일 저장은 멤버십 전에도 사용할 수 있습니다. 업그레이드는 기록 저장, 심층 질문, 월간 리포트에만 둡니다.",
        steps: ["공개 결과 페이지", "소셜 문구", "내 이메일"],
      },
      es: {
        eyebrow: "Bucle gratis",
        title: "Comparte y vuelve primero, mejora despues",
        body: "La pagina publica, los textos sociales y el email personal estan disponibles antes de la membresia. El upgrade queda para historial, preguntas profundas e informes mensuales.",
        steps: ["Pagina publica", "Texto social", "Email propio"],
      },
      "pt-br": {
        eyebrow: "Loop gratis",
        title: "Compartilhe e volte primeiro, assine depois",
        body: "Pagina publica, textos sociais e email para voce ficam disponiveis antes da assinatura. O upgrade fica para historico, perguntas profundas e relatorios mensais.",
        steps: ["Pagina publica", "Texto social", "Email proprio"],
      },
    }[activeReadingLocale] || {
      eyebrow: "Free share loop",
      title: "Share and revisit first, upgrade later",
      body: "Public result pages, social captions, and self-email are available before membership. Upgrades stay for saved history, deeper follow-ups, and monthly reports.",
      steps: ["Public result page", "Social caption", "Email yourself"],
    }

  const statusCopy =
    {
      zh: {
        member: "进阶功能已开启",
        free: "免费 AI 解读可用",
      },
      en: {
        member: "Advanced features active",
        free: "Free AI reading active",
      },
      ja: {
        member: "高度な機能が有効です",
        free: "無料 AI リーディング利用中",
      },
      ko: {
        member: "고급 기능 활성화",
        free: "무료 AI 리딩 사용 가능",
      },
      es: {
        member: "Funciones avanzadas activas",
        free: "Lectura AI gratis activa",
      },
      "pt-br": {
        member: "Recursos avancados ativos",
        free: "Leitura AI gratis ativa",
      },
    }[activeReadingLocale] || {
      member: "Advanced features active",
      free: "Free AI reading active",
    }

  const followUpLoginCopy =
    {
      zh: "登录后可以继续深度追问，并保存这次解读历史。",
      en: "Log in to continue with deeper follow-up questions and save this reading.",
      ja: "深い追質問と履歴保存を続けるにはログインしてください。",
      ko: "심층 후속 질문과 기록 저장을 계속하려면 로그인하세요.",
      es: "Inicia sesion para continuar con preguntas profundas y guardar esta lectura.",
      "pt-br": "Entre para continuar com perguntas profundas e salvar esta leitura.",
    }[activeReadingLocale] || "Log in to continue with deeper follow-up questions and save this reading."

  const readingReturnCopy =
    {
      zh: {
        eyebrow: "每日复访",
        title: "把这次解读变成明天的每日塔罗",
        body: "明天回来抽一张免费每日牌，连续打卡并写下日记，看看这次问题是否正在形成某种反复出现的主题。",
        daily: "打开每日塔罗",
        calendar: "添加日历提醒",
        calendarSaved: "日历提醒已下载",
        calendarSummary: "POPTarot 每日塔罗",
        calendarDescription: "回到 POPTarot 抽一张每日免费塔罗牌，保存日记并延续连续打卡。",
        meanings: "查看牌义",
        tools: "免费工具",
      },
      en: {
        eyebrow: "Daily return",
        title: "Turn this reading into tomorrow's Daily Tarot",
        body: "Come back for one free daily card, keep a streak, and use your journal to see whether this reading becomes a pattern.",
        daily: "Open Daily Tarot",
        calendar: "Add Calendar",
        calendarSaved: "Calendar reminder downloaded",
        calendarSummary: "POPTarot Daily Tarot",
        calendarDescription: "Return to POPTarot for one free daily tarot card, a journal note, and your streak.",
        meanings: "Read Card Meanings",
        tools: "Free Tools",
      },
      ja: {
        eyebrow: "毎日の再訪",
        title: "このリーディングを明日のデイリータロットへ",
        body: "明日また無料の1枚を引き、連続記録と日記で、このテーマが繰り返されているか見てみましょう。",
        daily: "デイリータロット",
        calendar: "カレンダーに追加",
        calendarSaved: "カレンダーリマインダーを保存しました",
        calendarSummary: "POPTarot Daily Tarot",
        calendarDescription: "POPTarotで無料の毎日カードを引き、日記と連続記録を続けましょう。",
        meanings: "カードの意味",
        tools: "無料ツール",
      },
      ko: {
        eyebrow: "매일 돌아오기",
        title: "이 리딩을 내일의 데일리 타로로 이어가기",
        body: "내일 무료 일일 카드를 뽑고, 연속 기록과 저널로 이 주제가 반복되는지 살펴보세요.",
        daily: "데일리 타로 열기",
        calendar: "캘린더에 추가",
        calendarSaved: "캘린더 알림이 저장되었습니다",
        calendarSummary: "POPTarot Daily Tarot",
        calendarDescription: "POPTarot에서 무료 데일리 카드를 뽑고 저널과 연속 기록을 이어가세요.",
        meanings: "카드 의미 보기",
        tools: "무료 도구",
      },
      es: {
        eyebrow: "Regreso diario",
        title: "Convierte esta lectura en tu Tarot Diario de manana",
        body: "Vuelve por una carta diaria gratis, mantiene una racha y usa el diario para ver si esta lectura se convierte en un patron.",
        daily: "Abrir Tarot Diario",
        calendar: "Agregar calendario",
        calendarSaved: "Recordatorio de calendario descargado",
        calendarSummary: "POPTarot Tarot Diario",
        calendarDescription: "Vuelve a POPTarot por una carta diaria gratis, una nota de diario y tu racha.",
        meanings: "Leer significados",
        tools: "Herramientas gratis",
      },
      "pt-br": {
        eyebrow: "Retorno diario",
        title: "Transforme esta leitura no Tarot Diario de amanha",
        body: "Volte para tirar uma carta diaria gratis, manter uma sequencia e usar o diario para perceber se esta leitura vira um padrao.",
        daily: "Abrir Tarot Diario",
        calendar: "Adicionar calendario",
        calendarSaved: "Lembrete de calendario baixado",
        calendarSummary: "POPTarot Tarot Diario",
        calendarDescription: "Volte ao POPTarot para uma carta diaria gratis, uma nota no diario e sua sequencia.",
        meanings: "Ler significados",
        tools: "Ferramentas gratis",
      },
    }[activeReadingLocale] || {
      eyebrow: "Daily return",
      title: "Turn this reading into tomorrow's Daily Tarot",
      body: "Come back for one free daily card, keep a streak, and use your journal to see whether this reading becomes a pattern.",
      daily: "Open Daily Tarot",
      calendar: "Add Calendar",
      calendarSaved: "Calendar reminder downloaded",
      calendarSummary: "POPTarot Daily Tarot",
      calendarDescription: "Return to POPTarot for one free daily tarot card, a journal note, and your streak.",
      meanings: "Read Card Meanings",
      tools: "Free Tools",
    }
  const readingReturnParams = `utm_source=reading_result&utm_medium=return_path&utm_campaign=free_reading&lang=${activeReadingLocale}`
  const dailyReturnHref = `/daily-tarot?${readingReturnParams}`
  const meaningsReturnHref = `/tarot-card-meanings?${readingReturnParams}`
  const toolsReturnHref = `/free-tarot-tools?${readingReturnParams}`
  const readingFeedbackParams = new URLSearchParams({
    type: "free_reading",
    surface: "reading_result",
    context: "Free AI tarot reading",
    locale: activeReadingLocale,
  })
  const readingFeedbackHref = `/reviews?${readingFeedbackParams.toString()}#reader-feedback`
  const readingNextFreeCopy =
    {
      zh: {
        eyebrow: "继续免费",
        title: "下一步先继续问一个具体问题",
        body: "如果这次解读还没完全清楚，可以换一个高意图问题继续免费抽牌；深度追问、历史保存和月度报告再作为会员功能。",
        items: [
          { label: "他爱我吗？", body: "看真实情绪、一致性和下一步。", question: "他爱我吗？这段关系真实的情绪是什么？", spread: "their_thoughts", campaign: "does_he_love_me" },
          { label: "前任会回来吗？", body: "看复合、联系时机和是否值得等。", question: "前任会回来吗？我该继续等还是放下？", spread: "breakup_recovery", campaign: "ex_return" },
          { label: "事业下一步", body: "把压力、机会和行动重点分开。", question: "我现在的事业方向需要注意什么？", spread: "job_opportunity", campaign: "career_tarot" },
          { label: "明天每日塔罗", body: "一张每日牌、连续打卡和日记。", href: dailyReturnHref, campaign: "daily_tarot" },
        ] satisfies ReadingNextFreeItem[],
      },
      en: {
        eyebrow: "Continue free",
        title: "Ask one more precise question first",
        body: "If this reading opened another thread, continue with a focused free question. Deeper follow-ups, saved history, and monthly reports can stay for membership.",
        items: [
          { label: "Does he love me?", body: "Check feelings, consistency, and the next move.", question: "Does he love me, and what is the real emotional energy between us?", spread: "their_thoughts", campaign: "does_he_love_me" },
          { label: "Will my ex come back?", body: "Look at contact, timing, and whether waiting helps.", question: "Will my ex come back, and should I keep waiting or let go?", spread: "breakup_recovery", campaign: "ex_return" },
          { label: "Career tarot", body: "Separate pressure, opportunity, and one practical step.", question: "What should I understand about my career path right now?", spread: "job_opportunity", campaign: "career_tarot" },
          { label: "Daily Tarot", body: "One daily card, streaks, and a journal note.", href: dailyReturnHref, campaign: "daily_tarot" },
        ] satisfies ReadingNextFreeItem[],
      },
      ja: {
        eyebrow: "無料で続ける",
        title: "次は具体的な質問で続ける",
        body: "このリーディングから別の疑問が出たら、まず無料の質問で続けられます。深い追質問、履歴保存、月次レポートは会員機能です。",
        items: [
          { label: "彼は私を愛している？", body: "感情、一貫性、次の行動を見る。", question: "彼は私を愛していますか？二人の本当の感情は何ですか？", spread: "their_thoughts", campaign: "does_he_love_me" },
          { label: "元恋人は戻る？", body: "連絡、時期、待つ意味を確認。", question: "元恋人は戻りますか？待つべきですか、それとも手放すべきですか？", spread: "breakup_recovery", campaign: "ex_return" },
          { label: "仕事の流れ", body: "プレッシャー、機会、次の一歩を分ける。", question: "今の仕事の流れについて何を理解すべきですか？", spread: "job_opportunity", campaign: "career_tarot" },
          { label: "今日のタロット", body: "一枚引き、連続記録、日記。", href: dailyReturnHref, campaign: "daily_tarot" },
        ] satisfies ReadingNextFreeItem[],
      },
      ko: {
        eyebrow: "무료로 계속",
        title: "다음은 더 구체적인 질문으로",
        body: "이번 리딩에서 새 질문이 생겼다면 먼저 무료 질문으로 이어가세요. 심층 질문, 기록 저장, 월간 리포트는 멤버십에 남겨둡니다.",
        items: [
          { label: "그는 나를 사랑할까?", body: "감정, 일관성, 다음 행동을 봅니다.", question: "그는 나를 사랑하나요? 우리 사이의 진짜 감정은 무엇인가요?", spread: "their_thoughts", campaign: "does_he_love_me" },
          { label: "전 애인이 돌아올까?", body: "연락, 시기, 기다림의 의미를 확인.", question: "전 애인이 돌아올까요? 계속 기다려야 하나요, 내려놓아야 하나요?", spread: "breakup_recovery", campaign: "ex_return" },
          { label: "커리어 타로", body: "압박, 기회, 다음 실천을 나눠 봅니다.", question: "지금 내 커리어 흐름에서 무엇을 이해해야 하나요?", spread: "job_opportunity", campaign: "career_tarot" },
          { label: "데일리 타로", body: "하루 한 장, 연속 기록, 저널.", href: dailyReturnHref, campaign: "daily_tarot" },
        ] satisfies ReadingNextFreeItem[],
      },
      es: {
        eyebrow: "Continua gratis",
        title: "Haz una pregunta mas precisa primero",
        body: "Si esta lectura abrio otro hilo, continua con una pregunta gratis enfocada. Las preguntas profundas, el historial y los informes mensuales quedan para membresia.",
        items: [
          { label: "Does he love me?", body: "Sentimientos, coherencia y proximo paso.", question: "Does he love me, and what is the real emotional energy between us?", spread: "their_thoughts", campaign: "does_he_love_me" },
          { label: "Will my ex come back?", body: "Contacto, tiempo y si conviene esperar.", question: "Will my ex come back, and should I keep waiting or let go?", spread: "breakup_recovery", campaign: "ex_return" },
          { label: "Career tarot", body: "Presion, oportunidad y una accion practica.", question: "What should I understand about my career path right now?", spread: "job_opportunity", campaign: "career_tarot" },
          { label: "Tarot Diario", body: "Una carta diaria, racha y diario.", href: dailyReturnHref, campaign: "daily_tarot" },
        ] satisfies ReadingNextFreeItem[],
      },
      "pt-br": {
        eyebrow: "Continue gratis",
        title: "Faca uma pergunta mais precisa primeiro",
        body: "Se esta leitura abriu outro tema, continue com uma pergunta gratis focada. Perguntas profundas, historico e relatorios mensais ficam para a assinatura.",
        items: [
          { label: "Does he love me?", body: "Sentimentos, consistencia e proximo passo.", question: "Does he love me, and what is the real emotional energy between us?", spread: "their_thoughts", campaign: "does_he_love_me" },
          { label: "Will my ex come back?", body: "Contato, tempo e se vale esperar.", question: "Will my ex come back, and should I keep waiting or let go?", spread: "breakup_recovery", campaign: "ex_return" },
          { label: "Career tarot", body: "Pressao, oportunidade e uma acao pratica.", question: "What should I understand about my career path right now?", spread: "job_opportunity", campaign: "career_tarot" },
          { label: "Tarot Diario", body: "Uma carta diaria, sequencia e diario.", href: dailyReturnHref, campaign: "daily_tarot" },
        ] satisfies ReadingNextFreeItem[],
      },
    }[activeReadingLocale] || {
      eyebrow: "Continue free",
      title: "Ask one more precise question first",
      body: "If this reading opened another thread, continue with a focused free question. Deeper follow-ups, saved history, and monthly reports can stay for membership.",
      items: [
        { label: "Does he love me?", body: "Check feelings, consistency, and the next move.", question: "Does he love me, and what is the real emotional energy between us?", spread: "their_thoughts", campaign: "does_he_love_me" },
        { label: "Will my ex come back?", body: "Look at contact, timing, and whether waiting helps.", question: "Will my ex come back, and should I keep waiting or let go?", spread: "breakup_recovery", campaign: "ex_return" },
        { label: "Career tarot", body: "Separate pressure, opportunity, and one practical step.", question: "What should I understand about my career path right now?", spread: "job_opportunity", campaign: "career_tarot" },
        { label: "Daily Tarot", body: "One daily card, streaks, and a journal note.", href: dailyReturnHref, campaign: "daily_tarot" },
      ] satisfies ReadingNextFreeItem[],
    }
  const readingNextFreeHref = (questionText: string, spread: SpreadType, campaign: string) => {
    const params = new URLSearchParams({
      q: questionText,
      auto: "1",
      source: "reading_result",
      spread,
      lang: activeReadingLocale,
      utm_source: "reading_result",
      utm_medium: "next_free_question",
      utm_campaign: campaign,
    })
    return `/input?${params.toString()}`
  }
  const orientationCopy =
    {
      zh: { upright: "正", reversed: "逆" },
      en: { upright: "U", reversed: "R" },
      ja: { upright: "正", reversed: "逆" },
      ko: { upright: "정", reversed: "역" },
      es: { upright: "U", reversed: "R" },
      "pt-br": { upright: "U", reversed: "R" },
    }[activeReadingLocale] || { upright: "U", reversed: "R" }

  const isUpgradeErrorMessage = (message: string) => {
    const normalized = message.toLowerCase()
    return (
      message.includes(t("tarot.noCredits")) ||
      message.includes("深度追问") ||
      message.includes("会员功能") ||
      normalized.includes("insufficient credits") ||
      normalized.includes("membership feature") ||
      normalized.includes("upgrade to continue") ||
      message.includes("メンバー機能") ||
      message.includes("멤버십 기능") ||
      normalized.includes("función de membresía") ||
      normalized.includes("recurso de membro")
    )
  }

  const tx = (key: string, fallback: string) => {
    const value = t(key)
    return value === key ? fallback : value
  }

  const getLocalizedPosition = (config: SpreadConfig | null | undefined, index: number, locale: string) => {
    const position = config?.positions?.[index]
    if (!position) return undefined
    if (locale === "ja") return position.nameJa || position.nameEn || position.name
    if (locale === "ko") return position.nameKo || position.nameEn || position.name
    if (locale === "zh") return position.name
    return position.nameEn || position.name
  }

  const buildReadingCards = (cards: DrawnCard[], locale: string, config: SpreadConfig | null | undefined) =>
    cards.map((card, index) => ({
      name: getCardName(card, locale),
      position: getLocalizedPosition(config, index, locale),
      isReversed: card.isReversed,
      meaning: card.meaning,
    }))

  useEffect(() => {
    const count = Number(localStorage.getItem("poptarot_reading_count") || "0")
    setReadingCount(Number.isFinite(count) ? count : 0)
  }, [])

  useEffect(() => {
    const data = sessionStorage.getItem("tarotReading")
    if (!data) {
      router.push("/")
      return
    }

    const parsed = JSON.parse(data)
    setDrawnCards(parsed.drawnCards || [])
    setQuestion(parsed.question || "")
    const parsedLocale = isSeoLocale(parsed.readingLocale || "") ? parsed.readingLocale : language
    setReadingLocale(parsedLocale)
    setSpreadType(parsed.spreadType || "three_card")
    setSpreadConfig(parsed.spreadConfig || null)
    setMounted(true)

    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      startReading(parsed.drawnCards, parsed.question, false, "", parsed.spreadType || "three_card", parsedLocale, parsed.spreadConfig || null)
    }
  }, [router])

  useEffect(() => {
    if (!isReading && currentStreaming) {
      const cleanContent = currentStreaming
      const isInitialReading = messages.length === 0

      if (isInitialReading) {
        const nextCount = Number(localStorage.getItem("poptarot_reading_count") || "0") + 1
        localStorage.setItem("poptarot_reading_count", String(nextCount))
        setReadingCount(nextCount)
        analyticsApi.track("reading_completed", {
          ...getCurrentAttribution(),
          locale: readingLocale,
          keyword: question,
          reading_id: readingId,
          metadata: {
            spread_type: spreadType,
            card_count: drawnCards.length,
            reading_count: nextCount,
          },
        })
      }

      // 添加到消息列表
      const newMessage = {
        id: Date.now().toString(),
        type: (isInitialReading ? "reading" : "followup") as "reading" | "followup",
        content: cleanContent,
        question: currentQuestion || undefined,
      }
      
      setMessages((prev) => [...prev, newMessage])
      
      // 累积解读内容用于保存
      setFullInterpretation(prev => prev + (prev ? "\n\n---\n\n" : "") + cleanContent)
      
      // 不再自动生成追问建议，让用户自由提问
      setCurrentStreaming("")
      setCurrentQuestion("")
      setShowFollowUp(true)
    }
  }, [isReading, currentStreaming, currentQuestion, readingLocale])

  // 保存解读结果到后端
  useEffect(() => {
    async function saveInterpretation() {
      if (readingId && fullInterpretation && !isReading && showFollowUp) {
        try {
          await readingApi.saveInterpretation(readingId, fullInterpretation, readingLocale)
          console.log("[Reading] Interpretation saved")
        } catch (err) {
          console.error("[Reading] Failed to save interpretation:", err)
        }
      }
    }
    saveInterpretation()
  }, [readingId, fullInterpretation, isReading, showFollowUp])

  const startReading = async (
    cards: DrawnCard[],
    userQuestion: string,
    isFollowUp = false,
    followUpQuestion = "",
    currentSpreadType = "three_card",
    currentReadingLocale = readingLocale,
    currentSpreadConfig: SpreadConfig | null = spreadConfig,
  ) => {
    if (isReading || cards.length === 0) return

    setIsReading(true)
    setCurrentStreaming("")
    setShowFollowUp(false)
    setError("")

    try {
      const readingCards = buildReadingCards(cards, currentReadingLocale, currentSpreadConfig)

      // 免费首读不强制保存历史；会员才创建可回看的解读记录。
      if (!isFollowUp && isLoggedIn && user?.is_member && !readingId) {
        try {
          const createResult = await readingApi.create(
            userQuestion,
            readingCards,
            currentSpreadType || spreadType,
            currentReadingLocale
          )
          setReadingId(createResult.reading_id)
          
          // 如果消耗了积分，刷新用户信息
          if (createResult.credits_used > 0) {
            refreshUser()
          }
        } catch (apiError) {
          console.warn("[Reading] History save skipped, continuing with free reading:", apiError)
        }
      }

      // 调用 AI 解读 API（后端流式接口，带语言参数和牌阵类型）
      const response = await readingApi.interpret(
        userQuestion,
        readingCards,
        isFollowUp,
        followUpQuestion,
        messages.map((m) => m.content),
        currentReadingLocale,
        currentSpreadType || spreadType
      )

      if (!response.ok) {
        // 处理积分不足的错误
        if (response.status === 402) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "需要更多深度追问额度")
        }
        if (response.status === 401 && isFollowUp) {
          throw new Error(followUpLoginCopy)
        }
        throw new Error("Reading failed")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""
          
          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue
            
            if (trimmedLine.startsWith("data: ")) {
              const data = trimmedLine.slice(6)
              if (data === "[DONE]") {
                continue
              }
              
              try {
                const parsed = JSON.parse(data)
                const content = parsed.content
                if (content) {
                  setCurrentStreaming((prev) => prev + content)
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
        
        // 处理剩余的 buffer
        if (buffer.trim()) {
          const trimmedLine = buffer.trim()
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6)
            if (data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data)
                const content = parsed.content
                if (content) {
                  setCurrentStreaming((prev) => prev + content)
                }
              } catch (e) {
                console.error("Error parsing final SSE data:", e)
              }
            }
          }
        }
        
        // 追问完成后刷新会员状态和用户信息
        if (isFollowUp && isLoggedIn) {
          refreshUser()
        }
      }
    } catch (err) {
      console.error("Reading error:", err)
      const errorMessage = err instanceof Error ? err.message : ""
      if (errorMessage && isUpgradeErrorMessage(errorMessage)) {
        setError(errorMessage.includes("积分不足") ? "需要更多深度追问额度" : errorMessage)
      } else if (err instanceof Error && err.message === followUpLoginCopy) {
        setError(err.message)
      } else {
        setError("解读时发生错误，请重试。")
      }
    } finally {
      setIsReading(false)
    }
  }

  const handleFollowUp = (questionText: string) => {
    if (!questionText.trim() || isReading) return
    setFollowUpInput("")
    setCurrentQuestion(questionText)
    startReading(drawnCards, question, true, questionText, spreadType, readingLocale)
  }

  const handleNewReading = () => {
    setIsExiting(true)
    setTimeout(() => {
      sessionStorage.removeItem("tarotReading")
      router.push("/")
    }, 2000)
  }

  const getCurrentInterpretation = () =>
    fullInterpretation ||
    messages.map((message) => message.content).join("\n\n---\n\n") ||
    currentStreaming

  const getFallbackShareUrl = () => {
    const params = new URLSearchParams({
      utm_source: "share",
      utm_medium: "fallback_share",
      utm_campaign: "free_reading",
    })
    return `${window.location.origin}/free-ai-tarot-reading?${params.toString()}`
  }

  const buildShareCaption = (platform: ShareTemplatePlatform, url: string) =>
    createShareTemplate({
      platform,
      locale: shareTemplateLocale,
      question,
      cards: drawnCards.map((card, index) => ({
        name: getCardName(card, activeReadingLocale),
        position: getLocalizedPosition(spreadConfig, index, activeReadingLocale),
        isReversed: card.isReversed,
      })),
      interpretation: getCurrentInterpretation(),
      url,
    })

  const buildSelfEmailBody = () => {
    const readingUrl = shareUrl || getFallbackShareUrl()
    const dailyUrl = `${window.location.origin}${dailyReturnHref}`
    const cards = drawnCards
      .map((card, index) => {
        const position = getLocalizedPosition(spreadConfig, index, activeReadingLocale)
        const orientation = card.isReversed ? orientationCopy.reversed : orientationCopy.upright
        return position
          ? `${position}: ${getCardName(card, activeReadingLocale)} (${orientation})`
          : `${getCardName(card, activeReadingLocale)} (${orientation})`
      })
      .join(" / ")
    const excerpt = getCurrentInterpretation().replace(/\s+/g, " ").trim().slice(0, 900)

    return [
      shareCopy.emailIntro,
      "",
      question,
      "",
      `${shareCopy.emailCardsLabel}: ${cards}`,
      "",
      `${shareCopy.emailInsightLabel}:`,
      excerpt,
      "",
      `${shareCopy.emailOpenLabel}: ${readingUrl}`,
      `${shareCopy.emailDailyLabel}: ${dailyUrl}`,
    ].join("\n")
  }

  const handleSelfEmail = () => {
    if (drawnCards.length === 0) return

    const subject = encodeURIComponent(shareCopy.emailSubject)
    const body = encodeURIComponent(buildSelfEmailBody())
    analyticsApi.track("reading_email_self_opened", {
      ...getCurrentAttribution(),
      locale: activeReadingLocale,
      keyword: question,
      reading_id: readingId,
      metadata: {
        spread_type: spreadType,
        has_share_url: Boolean(shareUrl),
      },
    })
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setShareStatus(shareCopy.emailOpened)
  }

  const handleDownloadReadingReturnCalendar = () => {
    downloadDailyReturnCalendar({
      time: "08:30",
      summary: readingReturnCopy.calendarSummary,
      description: readingReturnCopy.calendarDescription,
      url: `${window.location.origin}${dailyReturnHref}`,
      filename: "poptarot-reading-daily-return.ics",
    })
    analyticsApi.track("daily_calendar_reminder_downloaded", {
      ...getCurrentAttribution(),
      locale: activeReadingLocale,
      keyword: question,
      reading_id: readingId,
      metadata: {
        surface: "reading_result",
        reminder_time: "08:30",
        return_href: dailyReturnHref,
      },
    })
    setShareStatus(readingReturnCopy.calendarSaved)
  }

  const trackFallbackShare = (platform: ShareTemplatePlatform, channel: "native" | "clipboard") => {
    analyticsApi.track("share_template_copied", {
      ...getCurrentAttribution(),
      locale: activeReadingLocale,
      keyword: question,
      reading_id: readingId,
      metadata: {
        fallback: true,
        platform,
        channel,
        spread_type: spreadType,
      },
    })
  }

  const ensureShareSession = async () => {
    if (getAccessToken()) return

    console.log("[Reading] Creating anonymous share session...")
    const anonResult = await authApi.registerAnonymous()
    setAccessToken(anonResult.access_token)
    await refreshUser()
    analyticsApi.track("share_session_only", {
      ...getCurrentAttribution(),
      locale: activeReadingLocale,
      keyword: question,
      metadata: {
        spread_type: spreadType,
      },
    })
  }

  const shareFallbackCaption = async (platform: ShareTemplatePlatform, preferNativeShare: boolean) => {
    const fallbackUrl = getFallbackShareUrl()
    const text = buildShareCaption(platform, fallbackUrl)

    if (preferNativeShare && navigator.share) {
      await navigator.share({
        title: "POPTarot Reading",
        text,
        url: fallbackUrl,
      })
      trackFallbackShare(platform, "native")
      setShareStatus(shareCopy.fallbackGenerated)
      return
    }

    await navigator.clipboard.writeText(text)
    trackFallbackShare(platform, "clipboard")
    setShareStatus(shareCopy.fallbackCopied)
  }

  const ensureShareUrl = async () => {
    if (shareUrl) return shareUrl
    if (drawnCards.length === 0) throw new Error("No cards to share")
    await ensureShareSession()

    const result = await readingApi.createShare({
      reading_id: readingId || undefined,
      question,
      cards: buildReadingCards(drawnCards, activeReadingLocale, spreadConfig),
      interpretation: getCurrentInterpretation(),
      spread_type: spreadType,
    })

    const absoluteUrl = `${window.location.origin}${result.url}`
    setShareUrl(absoluteUrl)
    analyticsApi.track("share_created", {
      ...getCurrentAttribution(),
      locale: activeReadingLocale,
      keyword: question,
      reading_id: readingId,
      share_slug: result.slug,
      metadata: {
        spread_type: spreadType,
      },
    })
    return absoluteUrl
  }

  const handleShare = async () => {
    if (isCreatingShare || drawnCards.length === 0) return

    setIsCreatingShare(true)
    setShareStatus("")

    try {
      const absoluteUrl = await ensureShareUrl()

      if (navigator.share) {
        await navigator.share({
          title: "POPTarot Reading",
          text: question,
          url: absoluteUrl,
        })
        setShareStatus(shareCopy.generated)
      } else {
        await navigator.clipboard.writeText(absoluteUrl)
        setShareStatus(shareCopy.copied)
      }
    } catch (err) {
      console.error("[Reading] Share failed:", err)
      try {
        await shareFallbackCaption("instagram", true)
      } catch (fallbackErr) {
        console.error("[Reading] Fallback share failed:", fallbackErr)
        setShareStatus(shareCopy.failed)
      }
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleCopyShareTemplate = async (platform: ShareTemplatePlatform) => {
    if (isCreatingShare || drawnCards.length === 0) return

    setIsCreatingShare(true)
    setShareStatus("")

    try {
      const absoluteUrl = await ensureShareUrl()
      const text = buildShareCaption(platform, absoluteUrl)

      await navigator.clipboard.writeText(text)
      analyticsApi.track("share_template_copied", {
        ...getCurrentAttribution(),
        locale: activeReadingLocale,
        keyword: question,
        reading_id: readingId,
        metadata: {
          platform,
        },
      })
      setShareStatus(shareCopy.templateCopied)
    } catch (err) {
      console.error("[Reading] Share template failed:", err)
      try {
        await shareFallbackCaption(platform, false)
      } catch (fallbackErr) {
        console.error("[Reading] Fallback share template failed:", fallbackErr)
        setShareStatus(shareCopy.failed)
      }
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setShareStatus(shareCopy.copied)
  }

  // 获取位置标签
  const getPositionLabel = (index: number): string => {
    const localizedPosition = getLocalizedPosition(spreadConfig, index, activeReadingLocale)
    if (localizedPosition) return localizedPosition

    const defaultLabels =
      {
        zh: ["过去", "现在", "未来"],
        en: ["Past", "Present", "Future"],
        ja: ["過去", "現在", "未来"],
        ko: ["과거", "현재", "미래"],
        es: ["Past", "Present", "Future"],
        "pt-br": ["Past", "Present", "Future"],
      }[activeReadingLocale] || ["Past", "Present", "Future"]
    return defaultLabels[index] || `Position ${index + 1}`
  }

  const renderContent = (content: string, isNew: boolean) => {
    if (isNew) {
      return parseParagraphs(content).map((para) => renderParagraph(para, true))
    }

    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl text-[#c9c0ff] font-semibold mt-6 mb-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl text-[#c9c0ff]/90 font-semibold mt-5 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg text-[#c9c0ff]/80 font-medium mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3">{children}</p>,
          strong: ({ children }) => <strong className="text-[#c9c0ff] font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-white/90 italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-white/80 text-sm sm:text-base mb-3 space-y-1 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-white/80 text-sm sm:text-base mb-3 space-y-1 ml-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-white/80">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#c9c0ff]/50 pl-4 my-3 text-white/70 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  const parseParagraphs = (text: string) => {
    return text
      .split("\n\n")
      .filter((p) => p.trim())
      .map((paragraph, index) => {
        const trimmed = paragraph.trim()
        if (trimmed.startsWith("### ")) {
          return { type: "h3", content: trimmed.slice(4), key: index }
        } else if (trimmed.startsWith("## ")) {
          return { type: "h2", content: trimmed.slice(3), key: index }
        } else if (trimmed.startsWith("# ")) {
          return { type: "h1", content: trimmed.slice(2), key: index }
        } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return { type: "bold", content: trimmed.slice(2, -2), key: index }
        }
        return { type: "p", content: trimmed, key: index }
      })
  }

  const renderParagraph = (para: { type: string; content: string; key: number }, isNew: boolean) => {
    const baseDelay = isNew ? 50 : 0

    const classMap: Record<string, string> = {
      h1: "text-xl sm:text-2xl text-[#c9c0ff] font-semibold mt-6 mb-4 first:mt-0",
      h2: "text-lg sm:text-xl text-[#c9c0ff]/90 font-semibold mt-5 mb-3",
      h3: "text-base sm:text-lg text-[#c9c0ff]/80 font-medium mt-4 mb-2",
      bold: "text-[#c9c0ff] font-semibold",
      p: "text-white/80 leading-relaxed text-sm sm:text-base",
    }

    return (
      <BlurText
        key={para.key}
        text={para.content}
        delay={baseDelay}
        className={classMap[para.type] || classMap.p}
        animateBy="words"
        direction="bottom"
        stepDuration={isNew ? 0.3 : 0}
      />
    )
  }

  const renderQuestion = (questionText: string) => (
    <div className="my-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9c0ff]/40" />
        <div className="w-1 h-1 rounded-full bg-[#c9c0ff]/60 animate-pulse" />
        <div className="w-8 h-px bg-[#c9c0ff]/30" />
        <div className="w-1 h-1 rounded-full bg-[#c9c0ff]/60 animate-pulse" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9c0ff]/40" />
      </div>

      <div className="text-center">
        <p className="text-[#c9c0ff]/50 text-xs tracking-widest mb-2">{t("tarot.yourQuestion")}</p>
        <p
          className="text-white/90 text-base sm:text-lg font-light italic max-w-md mx-auto"
          style={{
            fontFamily: "var(--font-serif, serif)",
            textShadow: "0 0 20px rgba(201, 192, 255, 0.2)",
          }}
        >
          「{questionText}」
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9c0ff]/40" />
        <div className="w-1 h-1 rounded-full bg-[#c9c0ff]/60 animate-pulse" />
        <div className="w-8 h-px bg-[#c9c0ff]/30" />
        <div className="w-1 h-1 rounded-full bg-[#c9c0ff]/60 animate-pulse" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9c0ff]/40" />
      </div>
    </div>
  )

  const shouldShowSavePrompt =
    showFollowUp && readingCount >= 2 && readingCount <= 3 && !user?.is_member
  const shouldShowMemberPrompt = showFollowUp && readingCount >= 4 && !user?.is_member

  return (
    <div
      className="relative w-full min-h-screen allow-scroll scrollbar-hide"
      style={{
        background: "radial-gradient(circle at 50% 0%, #5a3c85 0%, #241438 40%, #0f0518 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isExiting ? 1 : 0,
          background: "radial-gradient(circle at 50% 50%, #5a3c85 0%, #241438 40%, #0f0518 100%)",
        }}
      >
        {isExiting && (
          <>
            <div
              className="absolute w-32 h-32 rounded-full opacity-50"
              style={{
                background: "radial-gradient(circle, rgba(180, 150, 255, 0.6) 0%, transparent 70%)",
                filter: "blur(30px)",
                left: "30%",
                top: "40%",
                animation: "floatOrb1 4s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-40 h-40 rounded-full opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(200, 180, 255, 0.5) 0%, transparent 70%)",
                filter: "blur(40px)",
                left: "50%",
                top: "45%",
                animation: "floatOrb2 5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-24 h-24 rounded-full opacity-45"
              style={{
                background: "radial-gradient(circle, rgba(220, 200, 255, 0.55) 0%, transparent 70%)",
                filter: "blur(25px)",
                left: "60%",
                top: "35%",
                animation: "floatOrb3 3.5s ease-in-out infinite",
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className="text-white/70 text-lg sm:text-xl tracking-widest animate-pulse"
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  textShadow: "0 0 30px rgba(180, 150, 255, 0.5)",
                }}
              >
                {tx("tarot.newJourney", "新的旅程即将开始...")}
              </p>
            </div>
          </>
        )}
      </div>

      <div
        className="relative z-10 py-12 px-4 max-w-4xl mx-auto transition-opacity duration-500"
        style={{ opacity: isExiting ? 0 : 1 }}
      >
        {/* 标题区域 */}
        <div
          className="text-center mb-10 transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-20px)",
          }}
        >
          <p className="text-white/40 text-xs tracking-widest mb-2">YOUR QUESTION</p>
          <h1
            className="text-xl sm:text-2xl text-white/90 font-light max-w-md mx-auto"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            {question || t("nav.reading")}
          </h1>
          
          {/* 显示用户状态 */}
          {isLoggedIn && user && (
            <p className="text-white/30 text-xs mt-2">
              {user.is_member ? statusCopy.member : statusCopy.free}
            </p>
          )}
        </div>

        {/* 三张卡牌 */}
        <div
          className="flex items-start justify-center gap-4 sm:gap-6 mb-10 transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          {drawnCards.map((card, index) => (
            <div key={card.id} className="flex flex-col items-center">
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  width: "80px",
                  height: "136px",
                  border: "2px solid rgba(201, 192, 255, 0.5)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  fill
                  className="object-cover"
                  style={{
                    transform: card.isReversed ? "rotate(180deg)" : "none",
                  }}
                />
              </div>
              <p className="text-[#c9c0ff]/60 text-xs mt-2">{getPositionLabel(index)}</p>
              <p className="text-white/80 text-xs mt-1 text-center">
                {getCardName(card, activeReadingLocale)}
                <span className="text-white/50 ml-1">{card.isReversed ? orientationCopy.reversed : orientationCopy.upright}</span>
              </p>
            </div>
          ))}
        </div>

        {/* 解读区域 */}
        <div
          className="transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "400ms",
          }}
        >
          <div
            className="p-6 sm:p-8 rounded-2xl"
            style={{
              background: "rgba(26, 16, 48, 0.6)",
              border: "1px solid rgba(201, 192, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-8 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(201, 192, 255, 0.5))" }}
              />
              <h3 className="text-[#c9c0ff] text-sm tracking-widest">{isReading ? t("common.loading") : t("tarot.interpretation")}</h3>
              <div
                className="w-8 h-px"
                style={{ background: "linear-gradient(to left, transparent, rgba(201, 192, 255, 0.5))" }}
              />
            </div>

            {error ? (
              <div className="text-red-400/80 text-center">
                <p>{error}</p>
                <div className="flex gap-3 justify-center mt-4">
                  <button
                    onClick={() => startReading(drawnCards, question, false, "", spreadType, readingLocale)}
                    className="px-6 py-2 rounded-full text-sm border border-red-400/50 hover:bg-red-400/10 transition-colors"
                  >
                    {t("common.retry")}
                  </button>
                  {isUpgradeErrorMessage(error) && (
                    <button
                      onClick={() => router.push("/membership")}
                      className="px-6 py-2 rounded-full text-sm bg-[#aaa1ff] text-[#110c24] hover:bg-[#c9c0ff] transition-colors"
                    >
                      {shareCopy.memberButton}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4" style={{ fontFamily: "var(--font-serif, serif)" }}>
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.question && renderQuestion(message.question)}
                    {renderContent(message.content, false)}
                  </div>
                ))}

                {currentStreaming && (
                  <>
                    {currentQuestion && renderQuestion(currentQuestion)}
                    {renderContent(currentStreaming, true)}
                  </>
                )}

                {isReading && <span className="inline-block w-2 h-5 bg-[#c9c0ff]/80 animate-pulse ml-1" />}

                {!isReading && messages.length === 0 && !currentStreaming && (
                  <div className="text-white/80 text-sm sm:text-base leading-relaxed flex items-center justify-center">
                    <span className="inline-block w-2 h-5 bg-[#c9c0ff]/80 animate-pulse" />
                  </div>
                )}

                <div ref={contentEndRef} />
              </div>
            )}
          </div>

          <div
            className="mt-8 transition-all duration-700"
            style={{
              opacity: showFollowUp ? 1 : 0,
              transform: showFollowUp ? "translateY(0)" : "translateY(20px)",
              pointerEvents: showFollowUp ? "auto" : "none",
            }}
          >
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(26, 16, 48, 0.4)",
                border: "1px solid rgba(201, 192, 255, 0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p className="text-center text-white/50 text-sm mb-4 tracking-wide">{t("tarot.followUpQuestion")}</p>

              {/* 输入框 */}
              <div
                className="relative rounded-xl overflow-hidden mb-4"
                style={{
                  background: "rgba(15, 5, 24, 0.6)",
                  border: followUpInput.trim() ? "1px solid rgba(201, 192, 255, 0.5)" : "1px solid rgba(201, 192, 255, 0.25)",
                  boxShadow: followUpInput.trim() 
                    ? "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 30px rgba(201, 192, 255, 0.15)" 
                    : "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(201, 192, 255, 0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                <textarea
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleFollowUp(followUpInput)
                    }
                  }}
                  placeholder={t("tarot.questionPlaceholder")}
                  disabled={isReading}
                  rows={3}
                  className="w-full bg-transparent px-5 py-4 text-base text-white/90 placeholder:text-white/30 focus:outline-none disabled:opacity-50 resize-none"
                  style={{ fontFamily: "var(--font-sans)" }}
                />
              </div>

              {/* 发送按钮 - 大而明显 */}
              <button
                onClick={() => handleFollowUp(followUpInput)}
                disabled={isReading || !followUpInput.trim()}
                className="w-full py-4 rounded-xl text-base font-medium tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: followUpInput.trim() 
                    ? "linear-gradient(135deg, rgba(201, 192, 255, 0.9) 0%, rgba(170, 161, 255, 0.9) 100%)" 
                    : "rgba(201, 192, 255, 0.2)",
                  border: followUpInput.trim() ? "1px solid rgba(201, 192, 255, 0.8)" : "1px solid rgba(201, 192, 255, 0.3)",
                  color: followUpInput.trim() ? "#1a0f30" : "rgba(201, 192, 255, 0.6)",
                  boxShadow: followUpInput.trim() 
                    ? "0 4px 20px rgba(201, 192, 255, 0.4), 0 0 40px rgba(201, 192, 255, 0.2)" 
                    : "none",
                  transform: followUpInput.trim() ? "scale(1)" : "scale(0.98)",
                }}
                onMouseEnter={(e) => {
                  if (followUpInput.trim() && !isReading) {
                    e.currentTarget.style.transform = "scale(1.02)"
                    e.currentTarget.style.boxShadow = "0 6px 30px rgba(201, 192, 255, 0.5), 0 0 50px rgba(201, 192, 255, 0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (followUpInput.trim()) {
                    e.currentTarget.style.transform = "scale(1)"
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(201, 192, 255, 0.4), 0 0 40px rgba(201, 192, 255, 0.2)"
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isReading ? (
                    <>
                      <span className="inline-block w-2 h-2 bg-current rounded-full animate-pulse" />
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {t("tarot.askMe")}
                    </>
                  )}
                </span>
              </button>

              {/* Enter 提示 */}
              {followUpInput.trim() && !isReading && (
                <p className="text-white/30 text-xs text-center mt-3">
                  {tx("common.pressEnter", "Press Enter to send")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 分享与会员轻转化 */}
        <div
          className="mt-8 transition-all duration-700"
          style={{
            opacity: showFollowUp ? 1 : 0,
            transform: showFollowUp ? "translateY(0)" : "translateY(18px)",
            pointerEvents: showFollowUp ? "auto" : "none",
          }}
        >
          <div className={`grid gap-4 ${shouldShowSavePrompt || shouldShowMemberPrompt ? "md:grid-cols-[1.05fr_0.95fr]" : ""}`}>
            <div
              className="rounded-lg border border-[#c9c0ff]/18 bg-white/[0.045] p-5 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#c9c0ff] text-sm tracking-widest">{shareCopy.title}</p>
                  <p className="mt-2 text-white/58 text-sm leading-6">
                    {shareCopy.description}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  disabled={isCreatingShare || isReading}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#c9c0ff]/40 px-4 py-2 text-sm text-[#eeeaff] transition-colors hover:border-[#eeeaff] hover:bg-[#c9c0ff]/10 disabled:opacity-45"
                >
                  <Share2 className="h-4 w-4" />
                  {isCreatingShare ? shareCopy.loading : shareCopy.button}
                </button>
              </div>

              <div
                data-reading-free-share-loop
                className="mt-4 rounded-lg border border-[#c9c0ff]/14 bg-[#c9c0ff]/[0.035] p-4"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#c9c0ff]/70">
                  {shareFreeLoopCopy.eyebrow}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-white/88">{shareFreeLoopCopy.title}</p>
                <p className="mt-2 text-xs leading-5 text-white/52">{shareFreeLoopCopy.body}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {shareFreeLoopCopy.steps.map((step) => (
                    <span
                      key={step}
                      data-reading-free-share-step
                      className="rounded-md border border-white/10 bg-black/16 px-3 py-2 text-center text-[0.7rem] leading-4 text-white/62"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              {shareUrl && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-2">
                  <p className="min-w-0 flex-1 truncate text-xs text-white/55">{shareUrl}</p>
                  <button
                    onClick={handleCopyShareUrl}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy share link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <button
                  onClick={() => handleCopyShareTemplate("xhs")}
                  disabled={isCreatingShare || isReading}
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white disabled:opacity-45"
                >
                  <Copy className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 break-words text-center leading-4">{shareCopy.xhs}</span>
                </button>
                <button
                  onClick={() => handleCopyShareTemplate("instagram")}
                  disabled={isCreatingShare || isReading}
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white disabled:opacity-45"
                >
                  <Instagram className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 break-words text-center leading-4">{shareCopy.instagram}</span>
                </button>
                <button
                  onClick={handleSelfEmail}
                  disabled={isCreatingShare || isReading || drawnCards.length === 0}
                  data-reading-email-self
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white disabled:opacity-45"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 break-words text-center leading-4">{shareCopy.emailSelf}</span>
                </button>
                <Link
                  href={readingFeedbackHref}
                  data-reading-feedback-link
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 break-words text-center leading-4">{shareCopy.feedback}</span>
                </Link>
              </div>

              {shareStatus && <p className="mt-3 text-xs text-white/45">{shareStatus}</p>}
            </div>

            {shouldShowSavePrompt && (
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9c0ff]/12 text-[#eeeaff]">
                    <Archive className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/86 text-sm font-medium">{shareCopy.saveTitle}</p>
                    <p className="mt-2 text-white/52 text-sm leading-6">
                      {shareCopy.saveText.replace("{count}", String(readingCount))}
                    </p>
                    <Link
                      href="/membership"
                      className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[#c9c0ff] px-4 py-2 text-sm font-medium text-[#1a0f30] transition hover:bg-[#eeeaff]"
                    >
                      {shareCopy.saveButton}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {shouldShowMemberPrompt && (
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9c0ff]/12 text-[#eeeaff]">
                    <span className="text-[10px] font-semibold tracking-[0.16em]">PRO</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/86 text-sm font-medium">{shareCopy.memberTitle}</p>
                    <p className="mt-2 text-white/52 text-sm leading-6">
                      {shareCopy.memberText}
                    </p>
                    <Link
                      href="/membership"
                      className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[#c9c0ff] px-4 py-2 text-sm font-medium text-[#1a0f30] transition hover:bg-[#eeeaff]"
                    >
                      {shareCopy.memberButton}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            data-reading-next-free-paths
            className="mt-4 rounded-lg border border-[#c9c0ff]/16 bg-[#c9c0ff]/[0.035] p-5 backdrop-blur-sm"
          >
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/72">{readingNextFreeCopy.eyebrow}</p>
              <h2 className="mt-2 text-base font-medium leading-snug text-white/88">{readingNextFreeCopy.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/52">{readingNextFreeCopy.body}</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {readingNextFreeCopy.items.map((item) => {
                const href =
                  item.href ||
                  readingNextFreeHref(
                    item.question || question || "What should I ask next?",
                    item.spread || "three_card",
                    item.campaign
                  )

                return (
                  <Link
                    key={item.campaign}
                    href={href}
                    data-reading-next-free-question
                    data-reading-next-free-daily={item.href ? "true" : undefined}
                    className="group min-w-0 rounded-lg border border-white/10 bg-black/18 p-4 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.055]"
                  >
                    <p className="break-words text-sm font-medium leading-snug text-[#f2eeff]">{item.label}</p>
                    <p className="mt-2 text-xs leading-5 text-white/52">{item.body}</p>
                  </Link>
                )
              })}
            </div>
          </div>
          <div
            data-reading-return-path
            className="mt-4 rounded-lg border border-[#c9c0ff]/18 bg-white/[0.04] p-5 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/72">{readingReturnCopy.eyebrow}</p>
                <h2 className="mt-2 text-base font-medium text-white/88">{readingReturnCopy.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">{readingReturnCopy.body}</p>
              </div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href={dailyReturnHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#c9c0ff] px-4 py-2 text-sm font-medium text-[#130d27] transition hover:bg-[#eeeaff]"
                >
                  {readingReturnCopy.daily}
                </Link>
                <button
                  type="button"
                  onClick={handleDownloadReadingReturnCalendar}
                  data-reading-return-calendar
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/24 px-4 py-2 text-sm text-[#eeeaff] transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05]"
                >
                  <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 text-center leading-tight">{readingReturnCopy.calendar}</span>
                </button>
                <Link
                  href={meaningsReturnHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
                >
                  {readingReturnCopy.meanings}
                </Link>
                <Link
                  href={toolsReturnHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
                >
                  {readingReturnCopy.tools}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div
          className="mt-12 text-center transition-all duration-700"
          style={{
            opacity: showFollowUp && !followUpInput.trim() ? 1 : 0.3,
            transform: showFollowUp ? "translateY(0)" : "translateY(20px)",
            pointerEvents: followUpInput.trim() ? "none" : "auto",
          }}
        >
          <button
            onClick={handleNewReading}
            disabled={isExiting || !!followUpInput.trim()}
            className="px-8 py-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "transparent",
              border: "1px solid rgba(201, 192, 255, 0.3)",
              color: "rgba(201, 192, 255, 0.6)",
            }}
          >
            {t("tarot.newReading")}
          </button>
          
          {/* 提示文字 */}
          {!followUpInput.trim() && (
            <p className="text-white/20 text-xs mt-3">
              {tx("tarot.or", "or")} {tx("tarot.continueAsking", "continue asking questions above")}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(1.15); }
          66% { transform: translate(35px, -15px) scale(0.9); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 30px) scale(1.05); }
          66% { transform: translate(-30px, -25px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
