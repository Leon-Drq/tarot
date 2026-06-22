import { TAROT_CARDS, type DrawnCard } from "@/lib/tarot-cards"
import type { Locale } from "@/lib/locales"

export type DailyTarotEntry = {
  id?: string
  entry_date: string
  card_id: number
  card_name: string
  is_reversed: boolean
  question: string
  interpretation?: string | null
  journal?: string | null
  mood?: string | null
  streak_count: number
  reminder_enabled: boolean
  reminder_email?: string | null
  reminder_time: string
  reminder_timezone: string
}

export const dailyTarotQuestion = "What guidance do I need today?"

function hashString(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getDailyCard(dateKey: string, seed: string): DrawnCard {
  const hash = hashString(`${dateKey}:${seed}`)
  const card = TAROT_CARDS[hash % TAROT_CARDS.length]
  return {
    ...card,
    isReversed: Math.floor(hash / TAROT_CARDS.length) % 2 === 1,
  }
}

export function createFallbackDailyInterpretation(card: DrawnCard, locale: Locale) {
  const name = locale === "zh" ? card.name : locale === "ja" ? card.nameJa || card.nameEn : locale === "ko" ? card.nameKo || card.nameEn : card.nameEn

  if (locale === "zh") {
    const orientation = card.isReversed ? card.meaning.reversed : card.meaning.upright
    return `今天的牌是${name}${card.isReversed ? "逆位" : "正位"}。关键词是：${orientation}。把它当作一个温和提醒：先看清自己真正能掌控的部分，再做下一步。`
  }
  if (locale === "ja") {
    return `今日のカードは${name}${card.isReversed ? "逆位置" : "正位置"}です。今日は、急いで結論を出すより、自分が動かせる一歩に意識を向けてみてください。`
  }
  if (locale === "ko") {
    return `오늘의 카드는 ${name} ${card.isReversed ? "역방향" : "정방향"}입니다. 오늘은 결론을 서두르기보다 내가 선택할 수 있는 한 가지 행동에 집중해 보세요.`
  }
  return `Today's card is ${name} ${card.isReversed ? "reversed" : "upright"}. Let it be a practical reminder: notice what is actually within your control, then choose one clear next step.`
}

export function getDailyTarotCopy(locale: Locale) {
  return (
    {
      zh: {
        title: "每日 AI 塔罗",
        subtitle: "每天抽一张免费牌，保存你的能量日记和连续打卡。",
        eyebrow: "Daily Tarot",
        draw: "抽取今日牌",
        drawing: "正在解读今日能量...",
        saved: "已保存",
        savedLocal: "已保存在此设备",
        saveJournal: "保存日记",
        journalPlaceholder: "写下今天的感受、事件或你想提醒未来自己的话。",
        reminderTitle: "每日提醒",
        reminderEmail: "提醒邮箱",
        reminderTime: "时间",
        reminderToggle: "开启提醒偏好",
        saveReminder: "保存提醒",
        streak: "连续打卡",
        days: "天",
        startReading: "继续免费解读",
        upgrade: "会员用于深度追问、历史保存和高级报告。",
      },
      en: {
        title: "Daily AI Tarot",
        subtitle: "Draw one free card each day, keep a streak, and save a private tarot journal.",
        eyebrow: "Daily Tarot",
        draw: "Draw Today's Card",
        drawing: "Reading today's energy...",
        saved: "Saved",
        savedLocal: "Saved on this device",
        saveJournal: "Save Journal",
        journalPlaceholder: "Write what happened today, how the card landed, or what you want to remember.",
        reminderTitle: "Daily Reminder",
        reminderEmail: "Reminder email",
        reminderTime: "Time",
        reminderToggle: "Enable reminder preference",
        saveReminder: "Save Reminder",
        streak: "Streak",
        days: "days",
        startReading: "Start a Free Reading",
        upgrade: "Membership is for deeper follow-ups, saved history, and advanced reports.",
      },
      ja: {
        title: "毎日の AI タロット",
        subtitle: "毎日1枚の無料カードを引き、記録と連続日数を残せます。",
        eyebrow: "Daily Tarot",
        draw: "今日のカードを引く",
        drawing: "今日の流れを読んでいます...",
        saved: "保存しました",
        savedLocal: "この端末に保存しました",
        saveJournal: "日記を保存",
        journalPlaceholder: "今日の出来事、カードを読んで感じたことを書きましょう。",
        reminderTitle: "毎日のリマインダー",
        reminderEmail: "メール",
        reminderTime: "時間",
        reminderToggle: "リマインダー設定を保存",
        saveReminder: "保存",
        streak: "連続記録",
        days: "日",
        startReading: "無料リーディングへ",
        upgrade: "会員は深い追質問、履歴保存、高度なレポート向けです。",
      },
      ko: {
        title: "데일리 AI 타로",
        subtitle: "매일 무료 카드 한 장을 뽑고 기록과 연속 체크인을 남기세요.",
        eyebrow: "Daily Tarot",
        draw: "오늘의 카드 뽑기",
        drawing: "오늘의 에너지를 읽는 중...",
        saved: "저장됨",
        savedLocal: "이 기기에 저장됨",
        saveJournal: "저널 저장",
        journalPlaceholder: "오늘의 일, 카드가 준 느낌, 기억하고 싶은 내용을 적어보세요.",
        reminderTitle: "매일 알림",
        reminderEmail: "이메일",
        reminderTime: "시간",
        reminderToggle: "알림 설정 저장",
        saveReminder: "저장",
        streak: "연속 기록",
        days: "일",
        startReading: "무료 리딩 시작",
        upgrade: "멤버십은 심층 질문, 기록 저장, 고급 리포트를 위한 기능입니다.",
      },
    }[locale]
  )
}
