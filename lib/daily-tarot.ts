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
        reminderHelp: "邮件提醒需要同步到云端；未登录时会自动创建一个私密访客账号用于提醒。",
        reminderSaved: "邮件提醒已开启",
        reminderSavedLocal: "提醒已保存在此设备；邮件发送需要云端同步",
        reminderSavedPending: "提醒偏好已保存；邮件发送配置完成后会生效",
        reminderUnavailable: "当前站点正在连接邮件发送服务。你可以先保存提醒偏好，邮件发送配置完成后会生效。",
        reminderEmailInvalid: "请输入有效的邮箱地址",
        emailReminderReadyTitle: "邮件提醒已可用",
        calendarFallbackTitle: "现在可用：日历提醒",
        calendarFallbackBody: "邮件发送服务还在接入中。现在可以先下载日历提醒，让手机日历每天提醒你回到 Daily Tarot。",
        calendarReminder: "添加日历提醒",
        calendarReminderSaved: "日历提醒已下载",
        calendarReminderSummary: "POPTarot 每日塔罗",
        calendarReminderDescription: "抽取每日免费塔罗牌，保存日记并延续连续打卡。",
        installEyebrow: "手机复访",
        installTitle: "把 Daily Tarot 放到主屏",
        installBody: "明天可以直接打开每日塔罗，不需要重新搜索。",
        installAction: "添加到手机",
        installFallback: "请使用浏览器分享菜单添加到主屏。",
        installInstalled: "已准备好从主屏回来",
        recentTitle: "最近 7 天",
        recentEmpty: "抽取今日牌后，这里会显示你的每日记录。",
        recentNoNote: "还没有写日记。",
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
        reminderHelp: "Email reminders need cloud sync. If you are not signed in, POPTarot creates a private guest account for reminders.",
        reminderSaved: "Email reminder is active",
        reminderSavedLocal: "Reminder saved on this device; email delivery needs cloud sync",
        reminderSavedPending: "Reminder preference saved; email delivery will start after mail configuration is connected",
        reminderUnavailable: "Email delivery is still being connected. You can save the preference now, and delivery will start after mail configuration is ready.",
        reminderEmailInvalid: "Enter a valid email address",
        emailReminderReadyTitle: "Email reminders are ready",
        calendarFallbackTitle: "Available now: calendar reminder",
        calendarFallbackBody: "Email delivery is still being connected. For now, download a calendar reminder so your phone can bring you back to Daily Tarot every day.",
        calendarReminder: "Add Calendar Reminder",
        calendarReminderSaved: "Calendar reminder downloaded",
        calendarReminderSummary: "POPTarot Daily Tarot",
        calendarReminderDescription: "Draw your free daily tarot card, save a journal note, and keep your streak.",
        installEyebrow: "Mobile return",
        installTitle: "Put Daily Tarot on your home screen",
        installBody: "Come back tomorrow from one tap instead of searching again.",
        installAction: "Add to Phone",
        installFallback: "Use your browser share menu to add POPTarot to the home screen.",
        installInstalled: "Ready for one-tap daily return",
        recentTitle: "Last 7 Days",
        recentEmpty: "Draw today's card and your daily record will appear here.",
        recentNoNote: "No journal note yet.",
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
        reminderHelp: "メールリマインダーにはクラウド同期が必要です。未ログインの場合は、非公開のゲストアカウントを作成します。",
        reminderSaved: "メールリマインダーを有効にしました",
        reminderSavedLocal: "この端末に保存しました。メール送信には同期が必要です",
        reminderSavedPending: "リマインダー設定を保存しました。メール送信設定が完了すると有効になります",
        reminderUnavailable: "現在メール送信サービスを接続中です。先に設定を保存でき、送信設定が完了すると有効になります。",
        reminderEmailInvalid: "有効なメールアドレスを入力してください",
        emailReminderReadyTitle: "メール通知を利用できます",
        calendarFallbackTitle: "今すぐ使える: カレンダー通知",
        calendarFallbackBody: "メール送信はまだ接続中です。今はカレンダー通知をダウンロードして、毎日 Daily Tarot に戻れるようにできます。",
        calendarReminder: "カレンダーに追加",
        calendarReminderSaved: "カレンダーリマインダーをダウンロードしました",
        calendarReminderSummary: "POPTarot 毎日のタロット",
        calendarReminderDescription: "無料の今日のカードを引き、日記と連続記録を残しましょう。",
        installEyebrow: "スマホで再訪",
        installTitle: "Daily Tarot をホーム画面へ",
        installBody: "明日は検索せず、ワンタップで戻れます。",
        installAction: "スマホに追加",
        installFallback: "ブラウザの共有メニューからホーム画面に追加できます。",
        installInstalled: "毎日戻る準備ができました",
        recentTitle: "直近7日",
        recentEmpty: "今日のカードを引くと、ここに記録が表示されます。",
        recentNoNote: "まだ日記はありません。",
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
        reminderHelp: "이메일 알림은 클라우드 동기화가 필요합니다. 로그인하지 않은 경우 비공개 게스트 계정을 만듭니다.",
        reminderSaved: "이메일 알림이 켜졌습니다",
        reminderSavedLocal: "이 기기에 저장됨. 이메일 발송에는 동기화가 필요합니다",
        reminderSavedPending: "알림 설정이 저장되었습니다. 메일 설정이 연결되면 발송이 시작됩니다",
        reminderUnavailable: "현재 이메일 발송 서비스를 연결 중입니다. 먼저 알림 설정을 저장할 수 있고, 메일 설정이 준비되면 발송됩니다.",
        reminderEmailInvalid: "유효한 이메일 주소를 입력하세요",
        emailReminderReadyTitle: "이메일 알림 사용 가능",
        calendarFallbackTitle: "지금 사용 가능: 캘린더 알림",
        calendarFallbackBody: "이메일 발송은 아직 연결 중입니다. 지금은 캘린더 알림을 내려받아 휴대폰 캘린더가 매일 Daily Tarot 방문을 알려주게 할 수 있습니다.",
        calendarReminder: "캘린더 알림 추가",
        calendarReminderSaved: "캘린더 알림 다운로드됨",
        calendarReminderSummary: "POPTarot 데일리 타로",
        calendarReminderDescription: "무료 데일리 타로 카드를 뽑고 저널과 연속 기록을 이어가세요.",
        installEyebrow: "모바일 재방문",
        installTitle: "Daily Tarot을 홈 화면에 추가",
        installBody: "내일은 다시 검색하지 않고 한 번에 돌아오세요.",
        installAction: "휴대폰에 추가",
        installFallback: "브라우저 공유 메뉴에서 홈 화면에 추가할 수 있습니다.",
        installInstalled: "매일 돌아올 준비가 됐습니다",
        recentTitle: "최근 7일",
        recentEmpty: "오늘의 카드를 뽑으면 여기에 기록이 표시됩니다.",
        recentNoNote: "아직 저널이 없습니다.",
        streak: "연속 기록",
        days: "일",
        startReading: "무료 리딩 시작",
        upgrade: "멤버십은 심층 질문, 기록 저장, 고급 리포트를 위한 기능입니다.",
      },
    }[locale]
  )
}
