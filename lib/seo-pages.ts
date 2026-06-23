import { defaultLocale, localePath, seoLocales, type Locale, type SeoLocale } from "@/lib/locales"
import type { SpreadType } from "@/lib/spread-config"

export type SeoPageContent = {
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  intent: string
  ctaQuestion: string
  primaryCta: string
  secondaryCta: string
  questionsTitle: string
  bottomCta: string
  sections: Array<{
    heading: string
    body: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
}

export type SeoPage = SeoPageContent & {
  slug: string
  locale: SeoLocale
  cards: number[]
  recommendedSpread?: SpreadType
  path: string
}

type SeoPageSource = {
  slug: string
  cards: number[]
  recommendedSpread?: SpreadType
  content: Record<Locale, SeoPageContent>
}

const cta = {
  zh: {
    primary: "免费抽牌",
    secondary: "每日塔罗",
    questions: "常见问题",
    bottom: "开始你的免费解读",
  },
  en: {
    primary: "Free Reading",
    secondary: "Daily Tarot",
    questions: "Questions",
    bottom: "Draw Your Cards",
  },
  ja: {
    primary: "無料リーディング",
    secondary: "毎日のタロット",
    questions: "よくある質問",
    bottom: "カードを引く",
  },
  ko: {
    primary: "무료 리딩",
    secondary: "데일리 타로",
    questions: "질문",
    bottom: "카드 뽑기",
  },
} satisfies Record<Locale, Record<string, string>>

function withSharedCta(locale: Locale, content: Omit<SeoPageContent, "primaryCta" | "secondaryCta" | "questionsTitle" | "bottomCta">): SeoPageContent {
  return {
    ...content,
    primaryCta: cta[locale].primary,
    secondaryCta: cta[locale].secondary,
    questionsTitle: cta[locale].questions,
    bottomCta: cta[locale].bottom,
  }
}

export const seoPageSources: SeoPageSource[] = [
  {
    slug: "free-ai-tarot-reading",
    cards: [0, 2, 17],
    recommendedSpread: "three_card",
    content: {
      en: withSharedCta("en", {
        title: "Free AI Tarot Reading",
        description: "Draw tarot cards online and receive a free AI tarot reading for love, career, daily guidance, and personal decisions.",
        eyebrow: "Free Online Tarot",
        h1: "Free AI Tarot Reading",
        intro: "Start with one clear question, draw your cards, and receive a focused AI interpretation without creating an account first.",
        intent: "A fast first reading for anyone who wants practical guidance before committing to a deeper spread.",
        ctaQuestion: "What do I most need to understand right now?",
        sections: [
          {
            heading: "How the free reading works",
            body: "Ask one sincere question, choose your cards, reveal them, and read an interpretation shaped around your actual question and card positions.",
          },
          {
            heading: "What to ask",
            body: "Open questions work best. Ask what you need to notice, what energy surrounds a choice, or what action would help you move forward.",
          },
          {
            heading: "When advanced features help",
            body: "Membership is useful after the first reading when you want deeper follow-up questions, saved history, advanced spreads, and longer monthly reports.",
          },
        ],
        faqs: [
          {
            question: "Is the first AI tarot reading free?",
            answer: "Yes. You can start a reading without paying first. Membership is reserved for deeper follow-ups, saved history, advanced spreads, and longer reports.",
          },
          {
            question: "Do I need to log in before drawing cards?",
            answer: "No. You can begin first, then log in when you want to save history or continue with more readings.",
          },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "免费 AI 塔罗解读",
        description: "在线抽塔罗牌，免费获得 AI 解读，适合爱情、事业、每日指引和重要选择。",
        eyebrow: "免费在线塔罗",
        h1: "免费 AI 塔罗解读",
        intro: "先问一个清晰的问题，抽取你的牌，再获得围绕真实处境生成的 AI 塔罗解读。",
        intent: "适合第一次体验塔罗的人：先获得有用的答案，再决定是否需要更深入的牌阵。",
        ctaQuestion: "我现在最需要理解什么？",
        sections: [
          {
            heading: "免费解读如何开始",
            body: "输入一个真诚的问题，选择牌面，揭示结果后，AI 会结合问题、牌位和正逆位给出解读。",
          },
          {
            heading: "什么问题更适合塔罗",
            body: "开放式问题更有价值。可以问我需要注意什么、这件事的能量是什么、下一步怎样行动更好。",
          },
          {
            heading: "什么时候适合升级",
            body: "当你想保存历史、连续追问、使用高级牌阵或查看深度关系/事业报告时，再考虑会员。",
          },
        ],
        faqs: [
          {
            question: "第一次 AI 塔罗解读免费吗？",
            answer: "是的。你可以先免费开始，不需要先付费。会员主要用于深度追问、历史保存、高级牌阵和更完整的报告。",
          },
          {
            question: "抽牌前必须登录吗？",
            answer: "不需要。你可以先体验，之后想保存结果或继续深入时再登录。",
          },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "無料 AI タロットリーディング",
        description: "恋愛、仕事、今日の流れ、選択に使える無料 AI タロットリーディング。",
        eyebrow: "無料オンラインタロット",
        h1: "無料 AI タロットリーディング",
        intro: "ひとつの質問を入力し、カードを引いて、状況に合わせた AI 解釈を受け取れます。",
        intent: "まず体験してから、履歴保存や深いスプレッドが必要か判断できます。",
        ctaQuestion: "今の私に一番必要なメッセージは？",
        sections: [
          { heading: "無料リーディングの流れ", body: "質問を入力し、カードを選び、カードの位置と向きに合わせた解釈を読みます。" },
          { heading: "よい質問の作り方", body: "相手をコントロールする質問より、自分が理解すべきことや次の一歩を聞くと読みやすくなります。" },
          { heading: "高度な機能が役立つ時", body: "深い追質問、履歴保存、高度なスプレッド、月次レポートが必要な時に会員機能が役立ちます。" },
        ],
        faqs: [
          { question: "最初の AI タロットは無料ですか？", answer: "はい。まず無料で始められます。会員機能は深い追質問、履歴保存、高度なスプレッド、長いレポート向けです。" },
          { question: "カードを引く前にログインが必要ですか？", answer: "いいえ。先に体験し、結果を保存したい時にログインできます。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "무료 AI 타로 리딩",
        description: "사랑, 커리어, 오늘의 흐름, 선택을 위한 무료 AI 타로 리딩.",
        eyebrow: "무료 온라인 타로",
        h1: "무료 AI 타로 리딩",
        intro: "하나의 질문을 입력하고 카드를 뽑으면 상황에 맞춘 AI 타로 해석을 받을 수 있습니다.",
        intent: "먼저 체험한 뒤 기록 저장, 고급 스프레드, 심층 리포트가 필요한지 결정하세요.",
        ctaQuestion: "지금 내가 가장 이해해야 할 것은 무엇인가요?",
        sections: [
          { heading: "무료 리딩 방식", body: "질문을 입력하고 카드를 고른 뒤, 카드 위치와 정/역방향을 반영한 해석을 읽습니다." },
          { heading: "좋은 질문", body: "상대의 선택을 단정하기보다 내가 알아차릴 점, 현재 에너지, 다음 행동을 묻는 질문이 좋습니다." },
          { heading: "고급 기능이 필요한 때", body: "심층 질문, 기록 저장, 고급 스프레드, 월간 리포트가 필요할 때 멤버십 기능이 유용합니다." },
        ],
        faqs: [
          { question: "첫 AI 타로 리딩은 무료인가요?", answer: "네. 먼저 무료로 시작할 수 있습니다. 멤버십은 심층 질문, 기록 저장, 고급 스프레드, 긴 리포트에 사용됩니다." },
          { question: "카드를 뽑기 전에 로그인이 필요한가요?", answer: "아니요. 먼저 체험하고 결과를 저장하고 싶을 때 로그인하면 됩니다." },
        ],
      }),
    },
  },
  {
    slug: "love-tarot-reading",
    cards: [6, 36, 37],
    recommendedSpread: "relationship",
    content: {
      en: withSharedCta("en", {
        title: "Love Tarot Reading",
        description: "Ask a relationship question and draw tarot cards for feelings, timing, connection, and next steps.",
        eyebrow: "Relationship Guidance",
        h1: "Love Tarot Reading",
        intro: "Use a love tarot reading when you need a calmer view of a relationship, a crush, a breakup, or the emotional pattern between two people.",
        intent: "Best for feelings, communication, reconciliation, commitment, and relationship timing.",
        ctaQuestion: "What is the real energy between us right now?",
        sections: [
          { heading: "Ask about the connection", body: "Tarot is strongest when the question gives room for nuance. Ask what the cards reveal about the connection." },
          { heading: "Read the whole pattern", body: "A relationship reading looks at attraction, fear, communication, timing, and the choice you can control." },
          { heading: "Use follow-up carefully", body: "After the first answer, ask one precise follow-up instead of chasing reassurance." },
        ],
        faqs: [
          { question: "Can tarot tell me if someone loves me?", answer: "It can explore emotional signals and relationship dynamics, but it should be guidance, not control over another person." },
          { question: "What is a good love tarot question?", answer: "Try: What is the real energy between us? What should I understand before I act?" },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "爱情塔罗解读",
        description: "针对感情、暧昧、分手、复合和关系走向抽牌，获得 AI 爱情塔罗解读。",
        eyebrow: "关系指引",
        h1: "爱情塔罗解读",
        intro: "当你想看清一段关系、一个人的态度、分手后的能量或两个人之间的模式时，可以使用爱情塔罗。",
        intent: "适合询问感受、沟通、承诺、复合可能、关系时机和下一步行动。",
        ctaQuestion: "我们之间现在真实的能量是什么？",
        sections: [
          { heading: "询问关系本身", body: "与其问绝对答案，不如问这段关系正在呈现什么模式、我应该理解什么。" },
          { heading: "看整体牌阵", body: "爱情解读会综合吸引、恐惧、沟通、时机和你能掌控的选择。" },
          { heading: "谨慎追问", body: "第一次答案之后，选择一个精准追问，避免为了寻求安慰而反复问同一个问题。" },
        ],
        faqs: [
          { question: "塔罗能看出对方爱不爱我吗？", answer: "塔罗能帮助你理解情绪信号和关系动力，但不能替代现实沟通，也不能控制对方选择。" },
          { question: "爱情塔罗适合问什么？", answer: "可以问：我们之间真实能量是什么？我行动前需要理解什么？这段关系反复出现的模式是什么？" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "恋愛タロットリーディング",
        description: "相手の気持ち、関係性、復縁、タイミングを AI タロットで読み解きます。",
        eyebrow: "恋愛のガイダンス",
        h1: "恋愛タロットリーディング",
        intro: "片思い、別れ、復縁、関係の流れを落ち着いて見たい時のリーディングです。",
        intent: "気持ち、連絡、関係の進展、復縁、次の行動に向いています。",
        ctaQuestion: "今、二人の間にある本当のエネルギーは？",
        sections: [
          { heading: "関係そのものを聞く", body: "白黒の答えより、関係のパターンや理解すべき感情を聞くと深く読めます。" },
          { heading: "全体の流れを見る", body: "恋愛リーディングは魅力、不安、会話、タイミング、あなたの選択を合わせて読みます。" },
          { heading: "追質問は一つずつ", body: "同じ質問を繰り返すより、次に理解すべき一点を聞くと結果が安定します。" },
        ],
        faqs: [
          { question: "相手の気持ちは分かりますか？", answer: "感情のサインや関係性は読めますが、現実の会話と合わせて使うことが大切です。" },
          { question: "恋愛でよい質問は？", answer: "今の二人のエネルギーは？ 行動する前に何を理解すべき？ などがおすすめです。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "사랑 타로 리딩",
        description: "상대 마음, 관계 흐름, 재회, 타이밍을 AI 타로로 해석합니다.",
        eyebrow: "관계 가이드",
        h1: "사랑 타로 리딩",
        intro: "썸, 이별, 재회, 관계 패턴을 차분히 보고 싶을 때 사용할 수 있습니다.",
        intent: "감정, 연락, 관계 진전, 재회 가능성, 다음 행동에 적합합니다.",
        ctaQuestion: "지금 우리 사이의 진짜 에너지는 무엇인가요?",
        sections: [
          { heading: "관계 자체를 묻기", body: "예/아니오보다 관계가 보여주는 패턴과 내가 이해해야 할 감정을 묻는 것이 좋습니다." },
          { heading: "전체 패턴 읽기", body: "사랑 리딩은 끌림, 두려움, 소통, 타이밍, 내가 선택할 수 있는 행동을 함께 봅니다." },
          { heading: "후속 질문은 조심스럽게", body: "같은 질문 반복보다 다음에 이해할 한 가지를 묻는 편이 더 안정적입니다." },
        ],
        faqs: [
          { question: "상대가 나를 사랑하는지 알 수 있나요?", answer: "감정 신호와 관계 흐름을 살펴볼 수 있지만 현실의 대화와 함께 사용해야 합니다." },
          { question: "좋은 사랑 타로 질문은?", answer: "우리 사이의 실제 에너지는? 행동하기 전에 무엇을 알아야 할까? 같은 질문이 좋습니다." },
        ],
      }),
    },
  },
  {
    slug: "reconciliation-tarot-reading",
    cards: [6, 13, 20],
    recommendedSpread: "breakup_recovery",
    content: {
      en: withSharedCta("en", {
        title: "Reconciliation Tarot Reading",
        description: "Ask about an ex, breakup energy, reconnection, and whether reconciliation is healthy or realistic.",
        eyebrow: "Breakup And Return",
        h1: "Reconciliation Tarot Reading",
        intro: "A reconciliation tarot reading helps you look at what ended, what still has energy, and what would need to change before a return.",
        intent: "Best for ex-contact, breakup clarity, second chances, apology timing, and whether reconnecting would support your growth.",
        ctaQuestion: "What should I understand before reconnecting?",
        sections: [
          { heading: "Separate longing from signal", body: "Missing someone does not always mean the relationship is ready to return. Tarot can show whether the connection has changed." },
          { heading: "Look for changed behavior", body: "Reconciliation needs more than feelings. The reading should examine accountability, timing, communication, and boundaries." },
          { heading: "Choose self-respect first", body: "The most useful answer is not only whether they return, but what choice protects your peace and growth." },
        ],
        faqs: [
          { question: "Can tarot predict if my ex will come back?", answer: "It can show the current energy and likely obstacles, but reconciliation depends on real choices from both people." },
          { question: "What should I ask about reconciliation?", answer: "Ask what changed, what still needs healing, and what boundary you should keep before reconnecting." },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "复合塔罗解读",
        description: "针对前任、分手后能量、是否会联系、是否适合复合，获得 AI 复合塔罗指引。",
        eyebrow: "分手与复合",
        h1: "复合塔罗解读",
        intro: "复合塔罗帮助你看清已经结束的部分、仍然存在的牵引，以及重新靠近前需要改变什么。",
        intent: "适合前任联系、分手原因、二次机会、道歉时机、复合是否健康等问题。",
        ctaQuestion: "重新联系之前，我最需要理解什么？",
        sections: [
          { heading: "区分想念和信号", body: "想念不等于关系已经准备好回头。塔罗可以帮助你看见连接是否真的发生了变化。" },
          { heading: "看行为是否改变", body: "复合不只靠感情，还需要责任、边界、沟通和时机。牌阵会帮助你看这些条件是否存在。" },
          { heading: "先选择自我尊重", body: "最重要的答案不只是对方会不会回来，而是怎样的选择更保护你的平静和成长。" },
        ],
        faqs: [
          { question: "塔罗能预测前任会不会回来吗？", answer: "可以看当前能量和阻碍，但复合依然取决于双方真实选择和行为改变。" },
          { question: "复合塔罗应该问什么？", answer: "可以问：什么已经改变？什么还需要疗愈？重新联系前我需要守住什么边界？" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "復縁タロットリーディング",
        description: "元恋人、別れた後の流れ、連絡、復縁が健全かどうかを AI タロットで確認します。",
        eyebrow: "別れと再会",
        h1: "復縁タロットリーディング",
        intro: "復縁リーディングは、終わったもの、まだ残る感情、戻る前に変わるべき点を見ます。",
        intent: "元恋人からの連絡、別れの理由、二度目のチャンス、謝罪のタイミングに向いています。",
        ctaQuestion: "再びつながる前に、何を理解すべき？",
        sections: [
          { heading: "恋しさとサインを分ける", body: "会いたい気持ちだけでは復縁の準備が整ったとは限りません。変化があるかを見ます。" },
          { heading: "行動の変化を見る", body: "復縁には感情だけでなく、責任、境界線、会話、タイミングが必要です。" },
          { heading: "自分を大切にする", body: "戻るかどうかだけでなく、あなたの平穏と成長を守る選択を読みます。" },
        ],
        faqs: [
          { question: "元恋人が戻るか分かりますか？", answer: "現在の流れや障害は読めますが、復縁は二人の現実の選択に左右されます。" },
          { question: "復縁で何を聞けばいい？", answer: "何が変わったか、何を癒す必要があるか、どんな境界線が必要かを聞くのがおすすめです。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "재회 타로 리딩",
        description: "전 연인, 이별 후 흐름, 연락 가능성, 재회가 건강한 선택인지 AI 타로로 살펴봅니다.",
        eyebrow: "이별과 재회",
        h1: "재회 타로 리딩",
        intro: "재회 리딩은 끝난 부분, 아직 남은 에너지, 다시 가까워지기 전에 바뀌어야 할 점을 봅니다.",
        intent: "전 연인 연락, 이별 이유, 두 번째 기회, 사과 타이밍, 건강한 재회 여부에 적합합니다.",
        ctaQuestion: "다시 연락하기 전에 무엇을 이해해야 하나요?",
        sections: [
          { heading: "그리움과 신호 구분", body: "그리움이 곧 관계가 준비되었다는 뜻은 아닙니다. 실제 변화가 있는지 봐야 합니다." },
          { heading: "행동 변화 보기", body: "재회에는 감정뿐 아니라 책임, 경계, 소통, 타이밍이 필요합니다." },
          { heading: "자존감을 먼저 선택", body: "상대가 돌아오는지뿐 아니라 내 평온과 성장을 지키는 선택을 확인합니다." },
        ],
        faqs: [
          { question: "전 연인이 돌아올지 알 수 있나요?", answer: "현재 에너지와 장애물은 볼 수 있지만 재회는 두 사람의 현실 선택에 달려 있습니다." },
          { question: "재회 타로 질문은?", answer: "무엇이 변했는지, 무엇을 치유해야 하는지, 어떤 경계를 지켜야 하는지 물어보세요." },
        ],
      }),
    },
  },
  {
    slug: "daily-tarot",
    cards: [19, 10, 14],
    recommendedSpread: "three_card",
    content: {
      en: withSharedCta("en", {
        title: "Daily Tarot Reading",
        description: "Draw a daily tarot card or spread for today's energy, practical guidance, and a clear theme.",
        eyebrow: "Today's Energy",
        h1: "Daily Tarot Reading",
        intro: "A daily tarot reading gives you one grounded theme for the day, helping you notice the choice, emotion, or opportunity that deserves attention.",
        intent: "Use it in the morning for focus, at midday for recalibration, or at night to reflect on what the day was teaching you.",
        ctaQuestion: "What energy should guide me today?",
        sections: [
          { heading: "Keep it simple", body: "Daily tarot works best when the question is small and immediate." },
          { heading: "Turn it into action", body: "After reading the card, choose one small action that matches the advice." },
          { heading: "Track patterns", body: "Members can save reading history and see repeated cards, moods, and themes over time." },
        ],
        faqs: [
          { question: "Should I do a daily reading every day?", answer: "Yes, if it helps you reflect. Keep the question simple and avoid repeating the same question many times." },
          { question: "Is one card enough?", answer: "For a quick check-in, one card is enough. For a complex situation, try a three-card spread." },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "每日塔罗",
        description: "抽取每日塔罗牌，获得今日能量、行动建议和需要关注的主题。",
        eyebrow: "今日能量",
        h1: "每日塔罗",
        intro: "每日塔罗给你一个清晰的今日主题，帮助你看见今天值得注意的选择、情绪或机会。",
        intent: "适合早晨定调、中午调整状态，或晚上复盘今天真正教会你的东西。",
        ctaQuestion: "今天什么能量会指引我？",
        sections: [
          { heading: "保持简单", body: "每日塔罗适合小而即时的问题，不需要把整个人生都交给一张牌。" },
          { heading: "转化成行动", body: "读完牌后，选择一个能落实建议的小动作。" },
          { heading: "长期追踪模式", body: "会员可以保存历史，更容易看见反复出现的牌、情绪和主题。" },
        ],
        faqs: [
          { question: "每日塔罗可以每天抽吗？", answer: "可以，只要它帮助你反思。问题保持简单，不要同一天反复问同一个问题。" },
          { question: "每日一张牌够吗？", answer: "快速检查状态时，一张牌足够。复杂问题可以使用三牌阵。" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "今日のタロット",
        description: "今日のエネルギー、行動のヒント、注目すべきテーマをタロットで確認します。",
        eyebrow: "今日のエネルギー",
        h1: "今日のタロット",
        intro: "今日のテーマを一つ受け取り、感情や選択、チャンスに気づくためのリーディングです。",
        intent: "朝の集中、昼の調整、夜の振り返りに使えます。",
        ctaQuestion: "今日の私を導くエネルギーは？",
        sections: [
          { heading: "シンプルに聞く", body: "毎日のタロットは、小さく今に近い質問ほど役立ちます。" },
          { heading: "行動に変える", body: "カードを読んだら、アドバイスに合う小さな行動を一つ選びます。" },
          { heading: "パターンを記録", body: "会員は履歴を保存し、繰り返すカードやテーマを見られます。" },
        ],
        faqs: [
          { question: "毎日引いてもいいですか？", answer: "はい。反省や集中に役立つなら、毎日使えます。" },
          { question: "一枚で十分ですか？", answer: "簡単な確認なら一枚で十分です。複雑な問題は三枚引きが向いています。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "데일리 타로",
        description: "오늘의 에너지, 실천 조언, 주목할 테마를 타로로 확인하세요.",
        eyebrow: "오늘의 에너지",
        h1: "데일리 타로",
        intro: "하루의 명확한 테마를 받아 오늘의 선택, 감정, 기회를 알아차리게 돕습니다.",
        intent: "아침 집중, 낮의 조정, 밤의 회고에 사용할 수 있습니다.",
        ctaQuestion: "오늘 나를 이끌 에너지는 무엇인가요?",
        sections: [
          { heading: "단순하게 묻기", body: "데일리 타로는 작고 현재에 가까운 질문일수록 좋습니다." },
          { heading: "행동으로 바꾸기", body: "카드를 읽은 뒤 조언과 맞는 작은 행동 하나를 정하세요." },
          { heading: "패턴 기록", body: "멤버는 기록을 저장해 반복되는 카드와 테마를 볼 수 있습니다." },
        ],
        faqs: [
          { question: "매일 뽑아도 되나요?", answer: "네. 성찰에 도움이 된다면 매일 사용할 수 있습니다." },
          { question: "한 장이면 충분한가요?", answer: "빠른 확인에는 한 장도 충분합니다. 복잡한 문제는 세 장 스프레드가 좋습니다." },
        ],
      }),
    },
  },
  {
    slug: "monthly-tarot-report",
    cards: [18, 20, 21],
    recommendedSpread: "three_card",
    content: {
      en: withSharedCta("en", {
        title: "Monthly Tarot Report",
        description: "Start a free monthly tarot check-in and unlock deeper member reports built from saved readings, recurring cards, and journal themes.",
        eyebrow: "Monthly Reflection",
        h1: "Monthly Tarot Report",
        intro: "A monthly tarot report turns scattered readings into a clearer pattern: repeated cards, relationship themes, career signals, and the next month’s focus.",
        intent: "Start with a free monthly check-in. Membership is useful when you want saved history, deeper follow-up questions, advanced spreads, and a longer monthly report.",
        ctaQuestion: "What theme should guide my next month?",
        sections: [
          { heading: "Begin with a free check-in", body: "Ask one clear monthly question first. The reading gives you a theme before you decide whether you need a deeper report." },
          { heading: "Use saved history for depth", body: "A stronger report comes from repeated cards, old questions, journal notes, and patterns across love, career, and daily readings." },
          { heading: "Keep membership value clear", body: "The free tool stays useful on its own. Membership belongs to saved history, deeper follow-ups, advanced spreads, and monthly reports." },
        ],
        faqs: [
          { question: "Is the monthly tarot report free?", answer: "You can start with a free monthly check-in. Longer reports based on saved history and repeated patterns are positioned as a membership feature." },
          { question: "What should a monthly tarot report include?", answer: "Useful reports summarize the month’s theme, repeated cards, love and career signals, practical advice, and one next action." },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "月度塔罗报告",
        description: "先免费做一次月度塔罗检查；会员可解锁基于历史记录、重复牌和日记主题的深度月报。",
        eyebrow: "月度复盘",
        h1: "月度塔罗报告",
        intro: "月度塔罗报告把零散解读整理成清晰模式：反复出现的牌、关系主题、事业信号和下个月重点。",
        intent: "先做一次免费月度检查。会员价值放在历史保存、深度追问、高级牌阵和更完整的月报上。",
        ctaQuestion: "下个月最应该指引我的主题是什么？",
        sections: [
          { heading: "先免费检查一次", body: "先问一个清晰的月度问题，得到一个主题，再决定是否需要更深的报告。" },
          { heading: "用历史记录增加深度", body: "真正有价值的月报来自重复出现的牌、旧问题、日记记录，以及爱情、事业、每日塔罗里的模式。" },
          { heading: "会员价值要清晰", body: "免费工具本身要有用；会员只承接历史保存、深度追问、高级牌阵和月度报告。" },
        ],
        faqs: [
          { question: "月度塔罗报告免费吗？", answer: "可以先免费做一次月度检查。基于历史记录和重复模式的完整长报告适合作为会员功能。" },
          { question: "月度塔罗报告应该包含什么？", answer: "好的月报会总结本月主题、重复牌、爱情和事业信号、行动建议，以及下一步最重要的动作。" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "月間タロットレポート",
        description: "無料の月間チェックインから始め、保存した履歴や繰り返すカードを使った深い会員レポートへ進めます。",
        eyebrow: "月間リフレクション",
        h1: "月間タロットレポート",
        intro: "月間レポートは、散らばったリーディングをテーマ、繰り返すカード、恋愛や仕事の流れとして整理します。",
        intent: "まず無料で月間チェックイン。履歴保存、深い追質問、高度なスプレッド、長い月報が必要な時に会員が役立ちます。",
        ctaQuestion: "来月の私を導くテーマは？",
        sections: [
          { heading: "無料で始める", body: "最初は一つの月間質問だけで十分です。深いレポートが必要か判断できます。" },
          { heading: "履歴で深く読む", body: "保存した質問、日記、繰り返すカードがあるほど、月間レポートは具体的になります。" },
          { heading: "会員価値を明確に", body: "無料ツールは単体で役立ち、会員は履歴、追質問、高度なスプレッド、月報を担当します。" },
        ],
        faqs: [
          { question: "月間レポートは無料ですか？", answer: "無料チェックインから始められます。長い履歴ベースのレポートは会員向けです。" },
          { question: "何が含まれますか？", answer: "月のテーマ、繰り返すカード、恋愛と仕事の流れ、助言、次の一歩を含めると役立ちます。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "월간 타로 리포트",
        description: "무료 월간 체크인으로 시작하고, 저장 기록과 반복 카드 기반의 심층 멤버 리포트로 확장하세요.",
        eyebrow: "월간 회고",
        h1: "월간 타로 리포트",
        intro: "월간 리포트는 흩어진 리딩을 반복 카드, 관계 테마, 커리어 신호, 다음 달의 초점으로 정리합니다.",
        intent: "먼저 무료 월간 체크인을 시작하세요. 기록 저장, 심층 질문, 고급 스프레드, 긴 월간 리포트는 멤버십 가치입니다.",
        ctaQuestion: "다음 달 나를 이끌 주제는 무엇인가요?",
        sections: [
          { heading: "무료 체크인부터", body: "처음에는 하나의 월간 질문으로 충분합니다. 더 깊은 리포트가 필요한지 판단할 수 있습니다." },
          { heading: "기록으로 깊이 보기", body: "저장된 질문, 저널, 반복 카드가 있을수록 월간 리포트는 더 구체적입니다." },
          { heading: "멤버십 가치를 분리", body: "무료 도구는 자체로 유용하고, 멤버십은 기록, 후속 질문, 고급 스프레드, 월간 리포트를 담당합니다." },
        ],
        faqs: [
          { question: "월간 타로 리포트는 무료인가요?", answer: "무료 체크인으로 시작할 수 있습니다. 기록 기반의 긴 리포트는 멤버십 기능으로 두는 것이 좋습니다." },
          { question: "무엇이 포함되나요?", answer: "월간 테마, 반복 카드, 사랑과 커리어 신호, 실천 조언, 다음 행동을 포함하면 유용합니다." },
        ],
      }),
    },
  },
  {
    slug: "yes-or-no-tarot",
    cards: [11, 12, 20],
    recommendedSpread: "yes_no",
    content: {
      en: withSharedCta("en", {
        title: "Yes or No Tarot",
        description: "Use yes or no tarot for a quick decision reading with an AI explanation of the energy behind the answer.",
        eyebrow: "Decision Reading",
        h1: "Yes or No Tarot",
        intro: "A yes or no tarot reading is useful when you need a quick signal, but the explanation behind the answer matters most.",
        intent: "Best for decisions with a clear action: reach out, wait, accept, decline, continue, or change course.",
        ctaQuestion: "Should I move forward with this choice?",
        sections: [
          { heading: "Ask a clean question", body: "Make it specific and time-bound so the answer has a real decision attached." },
          { heading: "Read the reason", body: "The card can show momentum, resistance, hidden information, or a need for patience." },
          { heading: "Do not repeat too much", body: "If the result feels uncomfortable, ask what to understand next instead." },
        ],
        faqs: [
          { question: "Can tarot answer yes or no?", answer: "It can give a direction, but the explanation and conditions matter." },
          { question: "What should I do after the answer?", answer: "Use it as reflection, then compare it with your real-world facts and responsibilities." },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "是或否塔罗",
        description: "用是或否塔罗快速判断一个选择，并通过 AI 解读理解答案背后的能量。",
        eyebrow: "选择判断",
        h1: "是或否塔罗",
        intro: "当你需要一个快速方向时，是或否塔罗可以给出信号，但真正有价值的是理解为什么。",
        intent: "适合是否联系、是否等待、是否接受、是否继续、是否换方向这类明确行动。",
        ctaQuestion: "我应该推进这个选择吗？",
        sections: [
          { heading: "问题要清晰", body: "让问题具体、有时间范围，并对应一个真实行动。" },
          { heading: "重点看原因", body: "牌面会显示推动力、阻力、隐藏信息或需要等待的部分。" },
          { heading: "不要反复问", body: "如果答案不舒服，换成问：我接下来需要理解什么？" },
        ],
        faqs: [
          { question: "塔罗能回答是或否吗？", answer: "可以给方向，但解释和条件比单纯答案更重要。" },
          { question: "得到答案后该怎么做？", answer: "把它当作反思，再结合现实信息、责任和风险判断。" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "イエス・ノー タロット",
        description: "決断に迷う時、AI がカードの理由まで説明する yes/no タロット。",
        eyebrow: "決断のリーディング",
        h1: "イエス・ノー タロット",
        intro: "素早いサインが必要な時に使えます。ただし答えの理由を読むことが大切です。",
        intent: "連絡する、待つ、受け入れる、断る、続ける、変えるなど明確な選択に向いています。",
        ctaQuestion: "この選択を進めるべき？",
        sections: [
          { heading: "質問を具体的に", body: "時間や行動が明確な質問ほど読みやすくなります。" },
          { heading: "理由を読む", body: "カードは勢い、抵抗、隠れた情報、待つ必要を示します。" },
          { heading: "繰り返しすぎない", body: "不安な時は同じ質問ではなく、次に理解すべきことを聞きます。" },
        ],
        faqs: [
          { question: "タロットは yes/no に答えますか？", answer: "方向性は示せますが、条件と理由の方が重要です。" },
          { question: "答えの後は？", answer: "現実の情報や責任と照らし合わせて判断してください。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "예 아니오 타로",
        description: "빠른 결정을 위한 yes/no 타로와 AI 해석.",
        eyebrow: "결정 리딩",
        h1: "예 아니오 타로",
        intro: "빠른 신호가 필요할 때 유용하지만, 답의 이유를 이해하는 것이 더 중요합니다.",
        intent: "연락, 기다림, 수락, 거절, 계속, 방향 전환처럼 명확한 행동에 적합합니다.",
        ctaQuestion: "이 선택을 계속 진행해야 할까요?",
        sections: [
          { heading: "질문을 명확하게", body: "구체적이고 시간 범위가 있는 질문이 좋습니다." },
          { heading: "이유 읽기", body: "카드는 추진력, 저항, 숨은 정보, 기다림의 필요를 보여줍니다." },
          { heading: "반복하지 않기", body: "불편한 결과라면 같은 질문보다 다음에 이해할 것을 물어보세요." },
        ],
        faqs: [
          { question: "타로가 예/아니오에 답할 수 있나요?", answer: "방향은 줄 수 있지만 이유와 조건이 더 중요합니다." },
          { question: "답을 받은 뒤에는?", answer: "현실 정보와 책임을 함께 비교해 판단하세요." },
        ],
      }),
    },
  },
  {
    slug: "career-tarot",
    cards: [1, 7, 21],
    recommendedSpread: "job_opportunity",
    content: {
      en: withSharedCta("en", {
        title: "Career Tarot Reading",
        description: "Ask about work, money, direction, job changes, creative projects, or professional timing.",
        eyebrow: "Work And Direction",
        h1: "Career Tarot Reading",
        intro: "Career tarot helps you examine direction, timing, motivation, and the unseen pattern around a work or money decision.",
        intent: "Best for job changes, interviews, projects, workplace conflict, business timing, and long-term direction.",
        ctaQuestion: "What should I understand about my career path now?",
        sections: [
          { heading: "Clarify the choice", body: "Career readings work best when tied to a concrete decision." },
          { heading: "Separate fear from signal", body: "The cards can help distinguish useful caution from self-doubt." },
          { heading: "Use deeper spreads", body: "Big transitions need a spread that examines obstacles, resources, timing, and likely outcomes." },
        ],
        faqs: [
          { question: "Can tarot help career decisions?", answer: "It can help you reflect on motivation, risk, timing, and next steps." },
          { question: "What is a good career question?", answer: "Try: What is blocking my growth? What should I focus on this month?" },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "事业塔罗解读",
        description: "针对工作、财富、跳槽、项目、职业方向和事业时机进行 AI 塔罗解读。",
        eyebrow: "工作与方向",
        h1: "事业塔罗解读",
        intro: "事业塔罗帮助你审视方向、时机、动力，以及工作或金钱选择背后的隐藏模式。",
        intent: "适合跳槽、面试、项目推进、职场冲突、创业时机和长期职业方向。",
        ctaQuestion: "我现在需要如何理解自己的事业路径？",
        sections: [
          { heading: "明确具体选择", body: "事业问题越具体越好，比如留下还是离开、启动还是等待、谈判还是观察。" },
          { heading: "区分恐惧和信号", body: "牌面可以帮助你区分有用的谨慎和单纯的自我怀疑。" },
          { heading: "重大转变用深度牌阵", body: "重要事业转折需要看阻碍、资源、时机和可能结果。" },
        ],
        faqs: [
          { question: "塔罗能帮助事业决策吗？", answer: "可以帮助你反思动力、风险、时机和下一步，但仍需要结合现实规划。" },
          { question: "事业塔罗适合问什么？", answer: "可以问：什么阻碍我的成长？这个月我该专注什么？换工作前我需要知道什么？" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "仕事タロットリーディング",
        description: "仕事、お金、転職、プロジェクト、キャリアの流れを AI タロットで確認します。",
        eyebrow: "仕事と方向性",
        h1: "仕事タロットリーディング",
        intro: "仕事やお金の選択にある方向、タイミング、動機、見えないパターンを読みます。",
        intent: "転職、面接、企画、職場の衝突、起業のタイミングに向いています。",
        ctaQuestion: "今のキャリアで理解すべきことは？",
        sections: [
          { heading: "選択を具体化", body: "残るか動くか、始めるか待つかなど、具体的な選択に結びつけます。" },
          { heading: "恐れとサインを分ける", body: "有益な注意と自己不信を区別する助けになります。" },
          { heading: "大きな変化は深く読む", body: "障害、資源、タイミング、結果を合わせて見ると判断しやすくなります。" },
        ],
        faqs: [
          { question: "仕事の決断に役立ちますか？", answer: "動機、リスク、タイミング、次の一歩を整理できます。" },
          { question: "よい質問は？", answer: "成長を止めているものは？ 今月集中すべきことは？ などです。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "커리어 타로 리딩",
        description: "일, 돈, 이직, 프로젝트, 직업 방향과 타이밍을 AI 타로로 확인하세요.",
        eyebrow: "일과 방향",
        h1: "커리어 타로 리딩",
        intro: "일이나 돈의 선택에서 방향, 타이밍, 동기, 보이지 않는 패턴을 살펴봅니다.",
        intent: "이직, 면접, 프로젝트, 직장 갈등, 사업 타이밍에 적합합니다.",
        ctaQuestion: "지금 내 커리어 경로에서 이해해야 할 것은?",
        sections: [
          { heading: "선택을 구체화", body: "남을지 이동할지, 시작할지 기다릴지처럼 실제 선택과 연결하세요." },
          { heading: "두려움과 신호 분리", body: "유용한 주의와 자기 의심을 구분하는 데 도움이 됩니다." },
          { heading: "큰 변화는 깊게 보기", body: "장애, 자원, 타이밍, 결과를 함께 보면 판단이 쉬워집니다." },
        ],
        faqs: [
          { question: "커리어 결정에 도움이 되나요?", answer: "동기, 위험, 타이밍, 다음 행동을 정리하는 데 도움이 됩니다." },
          { question: "좋은 질문은?", answer: "성장을 막는 것은? 이번 달 집중할 것은? 같은 질문이 좋습니다." },
        ],
      }),
    },
  },
  {
    slug: "tarot-card-meanings",
    cards: [2, 8, 18],
    recommendedSpread: "three_card",
    content: {
      en: withSharedCta("en", {
        title: "Tarot Card Meanings",
        description: "Learn tarot card meanings for upright and reversed cards, then draw a spread for a personalized AI interpretation.",
        eyebrow: "Card Meanings",
        h1: "Tarot Card Meanings",
        intro: "Tarot card meanings are a language of symbols. Each card changes depending on the question, position, and whether it appears upright or reversed.",
        intent: "Use this page as a starting point before drawing cards, then let the full reading connect the symbols to your situation.",
        ctaQuestion: "What message do these cards have for me?",
        sections: [
          { heading: "Upright and reversed meanings", body: "Upright meanings show the active form of a card. Reversed meanings can show delay, imbalance, or inner work." },
          { heading: "Position changes meaning", body: "The same card feels different in past, present, obstacle, advice, or outcome positions." },
          { heading: "The spread tells a story", body: "A strong reading connects cards together rather than treating them as isolated definitions." },
        ],
        faqs: [
          { question: "Do reversed cards mean something bad?", answer: "No. They can show blocked energy, delay, imbalance, or a private inner process." },
          { question: "Should beginners memorize every card?", answer: "Meanings help, but context matters more. Start with keywords, then read the full spread." },
        ],
      }),
      zh: withSharedCta("zh", {
        title: "塔罗牌牌义大全",
        description: "学习 78 张塔罗牌正位与逆位含义，再抽牌获得个性化 AI 解读。",
        eyebrow: "牌义学习",
        h1: "塔罗牌牌义大全",
        intro: "塔罗牌义是一套象征语言。每张牌会因为问题、牌位和正逆位而呈现不同含义。",
        intent: "先了解基础牌义，再让完整牌阵把象征和你的真实处境连接起来。",
        ctaQuestion: "这些牌想给我什么讯息？",
        sections: [
          { heading: "正位与逆位", body: "正位通常代表牌的主动表达，逆位可能代表延迟、失衡、阻塞或内在过程。" },
          { heading: "牌位会改变含义", body: "同一张牌放在过去、现在、阻碍、建议或结果位置时，含义会不同。" },
          { heading: "牌阵是一段故事", body: "真正有洞察的解读会连接牌与牌，而不是孤立背诵定义。" },
        ],
        faqs: [
          { question: "逆位一定不好吗？", answer: "不一定。逆位可能代表能量阻塞、延迟、失衡，也可能是内在转化过程。" },
          { question: "新手需要背完所有牌义吗？", answer: "不需要。先从关键词开始，再结合问题和牌位理解。" },
        ],
      }),
      ja: withSharedCta("ja", {
        title: "タロットカード意味一覧",
        description: "78 枚のタロットカードの正位置・逆位置の意味を学び、AI リーディングにつなげます。",
        eyebrow: "カードの意味",
        h1: "タロットカード意味一覧",
        intro: "タロットの意味は象徴の言語です。質問、位置、正逆によってカードの読み方は変わります。",
        intent: "基本の意味を知り、実際のスプレッドで状況に合わせて読みます。",
        ctaQuestion: "このカードたちは私に何を伝えていますか？",
        sections: [
          { heading: "正位置と逆位置", body: "正位置はカードの能動的な表現、逆位置は遅れや不均衡、内面の課題を示します。" },
          { heading: "位置で意味が変わる", body: "過去、現在、障害、助言、結果で同じカードも違って読まれます。" },
          { heading: "スプレッドは物語", body: "カード同士をつなげることで、より深い読みになります。" },
        ],
        faqs: [
          { question: "逆位置は悪い意味ですか？", answer: "必ずしも悪くありません。遅れ、内面化、バランス調整を示すことがあります。" },
          { question: "全カードを暗記すべき？", answer: "キーワードから始め、質問と位置に合わせて読むのがおすすめです。" },
        ],
      }),
      ko: withSharedCta("ko", {
        title: "타로 카드 의미",
        description: "78장 타로 카드의 정방향과 역방향 의미를 배우고 AI 리딩으로 연결하세요.",
        eyebrow: "카드 의미",
        h1: "타로 카드 의미",
        intro: "타로 의미는 상징의 언어입니다. 질문, 위치, 정/역방향에 따라 해석이 달라집니다.",
        intent: "기본 의미를 알고 실제 스프레드에서 상황과 연결해 읽어보세요.",
        ctaQuestion: "이 카드들이 나에게 전하는 메시지는?",
        sections: [
          { heading: "정방향과 역방향", body: "정방향은 카드의 적극적 표현, 역방향은 지연, 불균형, 내면 과제를 보여줄 수 있습니다." },
          { heading: "위치가 의미를 바꿈", body: "과거, 현재, 장애, 조언, 결과 위치에 따라 같은 카드도 다르게 읽힙니다." },
          { heading: "스프레드는 이야기", body: "카드를 서로 연결할 때 더 깊은 통찰이 나옵니다." },
        ],
        faqs: [
          { question: "역방향은 나쁜 뜻인가요?", answer: "항상 나쁜 것은 아닙니다. 막힘, 지연, 균형 조정, 내면 과정을 의미할 수 있습니다." },
          { question: "모든 카드를 외워야 하나요?", answer: "키워드부터 시작하고 질문과 위치에 맞춰 읽는 것이 좋습니다." },
        ],
      }),
    },
  },
]

function makeQuestionSeoPage(input: {
  slug: string
  cards: number[]
  recommendedSpread: SpreadType
  title: string
  description: string
  h1: string
  intent: string
  question: string
  sections: SeoPageContent["sections"]
  faqs: SeoPageContent["faqs"]
}): SeoPageSource {
  return {
    slug: input.slug,
    cards: input.cards,
    recommendedSpread: input.recommendedSpread,
    content: {
      en: withSharedCta("en", {
        title: input.title,
        description: input.description,
        eyebrow: "Tarot Question",
        h1: input.h1,
        intro: `Ask: ${input.question}. Draw cards and receive a free AI tarot reading focused on this exact situation.`,
        intent: input.intent,
        ctaQuestion: input.question,
        sections: input.sections,
        faqs: input.faqs,
      }),
      zh: withSharedCta("zh", {
        title: input.title,
        description: input.description,
        eyebrow: "问题塔罗",
        h1: input.h1,
        intro: `围绕这个问题抽牌：${input.question}。AI 会根据你的牌面给出更具体的解读。`,
        intent: "这是一个面向搜索问题的免费入口，适合先获得答案，再决定是否需要深入追问。",
        ctaQuestion: input.question,
        sections: input.sections,
        faqs: input.faqs,
      }),
      ja: withSharedCta("ja", {
        title: input.title,
        description: input.description,
        eyebrow: "Tarot Question",
        h1: input.h1,
        intro: `質問「${input.question}」でカードを引き、AI 解釈を受け取れます。`,
        intent: "検索意図に合わせた無料リーディング入口です。",
        ctaQuestion: input.question,
        sections: input.sections,
        faqs: input.faqs,
      }),
      ko: withSharedCta("ko", {
        title: input.title,
        description: input.description,
        eyebrow: "Tarot Question",
        h1: input.h1,
        intro: `질문 "${input.question}" 으로 카드를 뽑고 AI 해석을 받아보세요.`,
        intent: "검색 질문에 맞춘 무료 타로 입구입니다.",
        ctaQuestion: input.question,
        sections: input.sections,
        faqs: input.faqs,
      }),
    },
  }
}

seoPageSources.push(
  makeQuestionSeoPage({
    slug: "will-my-ex-come-back-tarot",
    cards: [6, 13, 20],
    recommendedSpread: "breakup_recovery",
    title: "Will My Ex Come Back Tarot",
    description: "Draw tarot cards for a free AI reading about reconciliation, your ex's energy, timing, and what you should do next.",
    h1: "Will My Ex Come Back Tarot",
    intent: "Best for breakup clarity, reconciliation signals, emotional timing, and whether reaching out is wise.",
    question: "Will my ex come back, and what should I understand before I act?",
    sections: [
      { heading: "Look for the pattern", body: "A reconciliation reading should show why the relationship broke, what energy remains, and whether both people can choose differently." },
      { heading: "Timing is not certainty", body: "Cards can point to movement or delay, but your healthiest action matters more than waiting for another person." },
      { heading: "Ask one follow-up", body: "After the first spread, ask what you can do next rather than repeating the same question for reassurance." },
    ],
    faqs: [
      { question: "Can tarot predict if my ex will return?", answer: "Tarot can explore signals, blocks, and likely dynamics. It should guide your choices, not replace direct communication or self-respect." },
      { question: "What cards suggest reconciliation?", answer: "Judgement, The Lovers, Two of Cups, Six of Cups, and Temperance can suggest reconnection when supported by the full spread." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "does-he-love-me-tarot",
    cards: [6, 37, 44],
    recommendedSpread: "their_thoughts",
    title: "Does He Love Me Tarot",
    description: "Ask a free AI tarot reading about his feelings, emotional signals, mixed behavior, and the next step in your connection.",
    h1: "Does He Love Me Tarot",
    intent: "Best for reading emotional energy, mixed signals, communication, and whether the connection is mutual.",
    question: "Does he love me, and what is the real emotional energy between us?",
    sections: [
      { heading: "Read feelings and behavior together", body: "A strong love reading compares emotion, action, fear, and consistency instead of treating one card as proof." },
      { heading: "Notice your own needs", body: "The cards should also reveal what you need in order to feel secure, respected, and clear." },
      { heading: "Avoid chasing certainty", body: "If the spread shows confusion, ask what conversation or boundary would bring clarity." },
    ],
    faqs: [
      { question: "Can tarot tell if someone loves me?", answer: "It can reveal emotional dynamics and likely feelings, but love also has to be shown through consistent action." },
      { question: "What if the cards are mixed?", answer: "Mixed cards often mean mixed behavior. Look for the advice card and the pattern across the whole spread." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "yes-or-no-tarot-love",
    cards: [1, 6, 11],
    recommendedSpread: "yes_no",
    title: "Yes or No Tarot Love",
    description: "Get a free yes or no love tarot reading with AI interpretation for crushes, relationships, dating, and reconciliation.",
    h1: "Yes or No Tarot Love",
    intent: "Best for simple love questions when you still want context, advice, and the emotional reason behind the answer.",
    question: "Give me a yes or no love tarot answer with the reason behind it.",
    sections: [
      { heading: "Yes or no needs context", body: "Love questions are rarely clean. The answer becomes more useful when the cards explain why the energy leans yes, no, or not yet." },
      { heading: "Use one clear question", body: "Ask about one person, one relationship, or one decision. Avoid combining several outcomes in a single spread." },
      { heading: "Let advice lead", body: "Even a yes card should show what to do next; even a no card can show what protects you." },
    ],
    faqs: [
      { question: "Which tarot cards mean yes in love?", answer: "The Lovers, Two of Cups, Ace of Cups, The Sun, and Ten of Cups often lean yes when the surrounding cards support them." },
      { question: "Can a reversed card still mean yes?", answer: "Yes, but usually with a delay, condition, or inner block that needs attention first." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "career-tarot-reading",
    cards: [1, 21, 50],
    recommendedSpread: "job_opportunity",
    title: "Career Tarot Reading",
    description: "Free AI career tarot reading for job changes, interviews, business timing, money choices, and professional direction.",
    h1: "Career Tarot Reading",
    intent: "Best for job changes, interviews, business choices, workplace conflict, and deciding where to focus next.",
    question: "What should I understand about my career path right now?",
    sections: [
      { heading: "Career cards show momentum", body: "A work reading can reveal readiness, hidden resistance, timing, and the resources needed for your next step." },
      { heading: "Separate fear from signal", body: "Some cards warn you to slow down. Others simply show fear. The whole spread helps tell the difference." },
      { heading: "Turn insight into action", body: "Use the reading to choose one practical move: apply, prepare, negotiate, wait, or change direction." },
    ],
    faqs: [
      { question: "Can tarot help with career decisions?", answer: "Yes. It is strongest for clarifying motivation, risk, timing, and the next useful action." },
      { question: "What cards are good for career?", answer: "The Magician, The World, Ace of Pentacles, Three of Pentacles, and King of Pentacles often support career growth." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "should-i-quit-my-job-tarot",
    cards: [12, 16, 63],
    recommendedSpread: "job_opportunity",
    title: "Should I Quit My Job Tarot",
    description: "Ask a free AI tarot reading before quitting your job. Explore timing, risk, burnout, money, and the best next step.",
    h1: "Should I Quit My Job Tarot",
    intent: "Best for job stress, burnout, toxic workplaces, financial timing, and deciding whether to stay, plan, or leave.",
    question: "Should I quit my job, and what is the wisest next step?",
    sections: [
      { heading: "Do not rush the card answer", body: "This question involves money, identity, stress, and timing. Read the advice card as seriously as the outcome card." },
      { heading: "Look for burnout versus growth", body: "Some spreads show a job is truly done. Others show exhaustion that needs boundaries, rest, or negotiation first." },
      { heading: "Build a practical bridge", body: "If the cards support leaving, ask what preparation, savings, or conversation should happen before you move." },
    ],
    faqs: [
      { question: "Can tarot decide if I should quit?", answer: "Tarot can clarify the pattern and risks, but you should combine it with financial planning and real-world options." },
      { question: "What cards suggest leaving a job?", answer: "The Tower, Death, Eight of Cups, Ten of Wands, and The World can suggest transition when supported by the full spread." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "is-he-thinking-about-me-tarot",
    cards: [2, 6, 18],
    recommendedSpread: "their_thoughts",
    title: "Is He Thinking About Me Tarot",
    description: "Ask a free AI tarot reading about whether he is thinking about you, what his feelings show, and what action is healthiest next.",
    h1: "Is He Thinking About Me Tarot",
    intent: "Best for mixed signals, silence, no-contact periods, crushes, and understanding whether attention is emotional, casual, or unresolved.",
    question: "Is he thinking about me, and what is the real energy behind his silence?",
    sections: [
      { heading: "Read thoughts with behavior", body: "A card can suggest attention, but the full spread should compare thoughts, feelings, fears, and whether those thoughts become real action." },
      { heading: "Silence has different meanings", body: "No contact can mean processing, avoidance, pride, confusion, or simply moving on. The reading should separate hope from evidence." },
      { heading: "Return to your clarity", body: "The most useful answer should show what you can do next without waiting indefinitely for a message." },
    ],
    faqs: [
      { question: "Can tarot tell if he is thinking about me?", answer: "Tarot can reflect emotional signals, attention, and likely mental energy, but thoughts matter most when they connect to respectful action." },
      { question: "What cards suggest he is thinking about me?", answer: "The High Priestess, Page of Cups, Six of Cups, The Lovers, and The Moon can suggest inner focus or unresolved feeling when supported by the spread." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "should-i-text-him-tarot",
    cards: [1, 11, 14],
    recommendedSpread: "yes_no",
    title: "Should I Text Him Tarot",
    description: "Use a free yes or no AI tarot reading before texting him. Check timing, intention, emotional safety, and the best next step.",
    h1: "Should I Text Him Tarot",
    intent: "Best for deciding whether to send a message today, wait, set a boundary, or choose a calmer way to reopen contact.",
    question: "Should I text him today, and what should I consider before I send it?",
    sections: [
      { heading: "Texting is about timing and intention", body: "A yes-or-no answer is most useful when it also shows whether the message comes from clarity, anxiety, care, or pressure." },
      { heading: "Look for the cost of contact", body: "The spread should show whether texting would open healthy communication or restart an old loop." },
      { heading: "Make the answer practical", body: "If the cards lean yes, write one clear message. If they lean no or not yet, choose the boundary or pause that protects your peace." },
    ],
    faqs: [
      { question: "Can tarot answer whether I should text him?", answer: "Yes, it can give a quick direction and the reason behind it. Use the answer as reflection, not as pressure to ignore your boundaries." },
      { question: "What cards suggest I should wait before texting?", answer: "The Hanged Man, Four of Swords, Temperance, The Moon, or reversed communication cards can suggest waiting, clarifying intention, or protecting your energy." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "when-will-i-find-love-tarot",
    cards: [3, 10, 17],
    recommendedSpread: "love_connection",
    title: "When Will I Find Love Tarot",
    description: "Draw a free AI tarot reading about finding love, timing, dating energy, soulmate traits, and what helps you become ready.",
    h1: "When Will I Find Love Tarot",
    intent: "Best for single readers, dating fatigue, soulmate timing, opening to love, and understanding what pattern needs to shift first.",
    question: "When will I find love, and what should I open myself to next?",
    sections: [
      { heading: "Love timing is also readiness", body: "A timing reading should not only predict when love appears; it should show what energy, choices, and openness make love easier to recognize." },
      { heading: "Look for the pattern before the person", body: "The cards can reveal whether the next relationship is blocked by old expectations, fear, unavailable people, or a need to widen your world." },
      { heading: "Use the answer as movement", body: "Translate the reading into one dating or self-trust action instead of waiting passively for fate." },
    ],
    faqs: [
      { question: "Can tarot predict when I will find love?", answer: "Tarot can show timing themes and readiness signals, but the most useful answer also points to the choices that make connection possible." },
      { question: "What cards suggest new love is coming?", answer: "Ace of Cups, The Lovers, The Star, Two of Cups, The Empress, and Wheel of Fortune can suggest new love when the surrounding cards support openness." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "what-does-he-think-of-me-tarot",
    cards: [2, 6, 18],
    recommendedSpread: "their_thoughts",
    title: "What Does He Think of Me Tarot",
    description: "Ask a free AI tarot reading about what he thinks of you, how he sees the connection, and whether his thoughts may become action.",
    h1: "What Does He Think of Me Tarot",
    intent: "Best for mixed signals, uncertain attraction, silence, dating ambiguity, and understanding how someone may perceive you.",
    question: "What does he think of me, and what should I understand about his attitude?",
    sections: [
      { heading: "Thoughts are not the whole story", body: "A useful reading should separate private thoughts, visible behavior, attraction, fear, and whether any of it becomes respectful action." },
      { heading: "Read perception and pattern", body: "The spread can show how he currently sees you, what he may be avoiding, and what the connection asks you to notice." },
      { heading: "Bring the answer back to you", body: "The best next step is not only knowing his opinion; it is knowing what boundary, conversation, or pause helps you feel clear." },
    ],
    faqs: [
      { question: "Can tarot show what he thinks of me?", answer: "Tarot can reflect likely perception, attention, and emotional tone, but the answer matters most when it connects to behavior and communication." },
      { question: "What cards suggest he sees me positively?", answer: "The Lovers, The Star, Queen of Cups, Page of Cups, and Six of Cups can suggest warmth or idealization when the whole spread supports it." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "will-he-contact-me-tarot",
    cards: [8, 14, 20],
    recommendedSpread: "their_thoughts",
    title: "Will He Contact Me Tarot",
    description: "Draw a free AI tarot reading about whether he will contact you, what may delay him, and what you should do while waiting.",
    h1: "Will He Contact Me Tarot",
    intent: "Best for no-contact periods, delayed replies, breakup silence, mixed signals, and deciding whether to wait or move forward.",
    question: "Will he contact me, and what should I do while I wait?",
    sections: [
      { heading: "Contact depends on more than feeling", body: "The cards should show desire, fear, timing, pride, avoidance, and whether communication is likely to become real action." },
      { heading: "Waiting needs a limit", body: "A contact reading is most useful when it also shows what protects your peace if the message does not arrive soon." },
      { heading: "Choose your response before the message", body: "If contact appears likely, ask what boundary or tone would keep the conversation healthy instead of reactive." },
    ],
    faqs: [
      { question: "Can tarot predict if he will message me?", answer: "Tarot can show communication energy and possible blocks, but real contact still depends on a person's choices and circumstances." },
      { question: "What cards suggest contact is coming?", answer: "Eight of Wands, Page of Cups, Knight of Swords, Judgement, and The Magician can suggest movement when supported by the spread." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "is-this-relationship-over-tarot",
    cards: [13, 16, 21],
    recommendedSpread: "relationship",
    title: "Is This Relationship Over Tarot",
    description: "Use a free AI tarot reading to explore whether a relationship is ending, what can still be repaired, and what next step is healthiest.",
    h1: "Is This Relationship Over Tarot",
    intent: "Best for relationship doubts, breakup warnings, emotional distance, repeated conflict, and deciding whether repair is realistic.",
    question: "Is this relationship over, and what is the healthiest next step?",
    sections: [
      { heading: "Endings can be emotional or practical", body: "A relationship may feel over because trust, effort, or communication has changed. The spread should clarify which layer is ending." },
      { heading: "Look for repair conditions", body: "If the cards show a path forward, they should also name what would need to change in behavior, timing, honesty, and boundaries." },
      { heading: "Let the advice card lead", body: "Whether the answer leans ending or repair, the most useful message is what protects your self-respect and emotional stability now." },
    ],
    faqs: [
      { question: "Can tarot tell if a relationship is over?", answer: "Tarot can show the current pattern, what is collapsing, and whether repair energy remains. It should guide reflection, not force a breakup or reunion." },
      { question: "What cards suggest a relationship ending?", answer: "Death, The Tower, Ten of Swords, Eight of Cups, and The World can suggest closure when the surrounding cards confirm completion." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "will-i-get-the-job-tarot",
    cards: [1, 7, 50],
    recommendedSpread: "job_opportunity",
    title: "Will I Get the Job Tarot",
    description: "Ask a free AI career tarot reading about a job offer, interview outcome, hidden obstacles, and how to strengthen your chances.",
    h1: "Will I Get the Job Tarot",
    intent: "Best for interviews, pending offers, applications, promotion chances, and deciding what practical step improves the outcome.",
    question: "Will I get the job, and what should I do to improve my chances?",
    sections: [
      { heading: "Outcome and preparation belong together", body: "A job reading should not only ask if the offer comes; it should show strengths, weak spots, timing, and what to prepare next." },
      { heading: "Read obstacles honestly", body: "Cards can point to competition, missing information, unclear communication, or a mismatch that needs attention before the outcome is fixed." },
      { heading: "Turn the answer into follow-through", body: "Use the reading to choose one concrete action: follow up, practice, clarify compensation, improve materials, or widen your options." },
    ],
    faqs: [
      { question: "Can tarot predict if I will get the job?", answer: "Tarot can show momentum, fit, obstacles, and likely direction, but preparation, market conditions, and real hiring decisions still matter." },
      { question: "What cards suggest getting a job?", answer: "The Magician, The Chariot, Ace of Pentacles, Three of Pentacles, and Six of Wands can support success when the full spread agrees." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "should-i-take-this-job-tarot",
    cards: [11, 21, 63],
    recommendedSpread: "binary_choice",
    title: "Should I Take This Job Tarot",
    description: "Use a free AI tarot reading to compare accepting a job offer with saying no, waiting, or negotiating for better terms.",
    h1: "Should I Take This Job Tarot",
    intent: "Best for comparing a new job offer, salary, culture fit, long-term growth, risk, and whether negotiation is needed.",
    question: "Should I take this job, and what should I compare before deciding?",
    sections: [
      { heading: "Compare the real tradeoffs", body: "A job offer can look good in one area and costly in another. The reading should weigh growth, money, culture, stability, and energy." },
      { heading: "Use the spread as a decision map", body: "A binary choice spread can compare taking the job with waiting, negotiating, or choosing another route." },
      { heading: "Do not ignore practical details", body: "Tarot can clarify values and risk, but the final choice should also check contracts, benefits, commute, workload, and money." },
    ],
    faqs: [
      { question: "Can tarot help me decide whether to take a job?", answer: "Yes. It can clarify tradeoffs, motives, risk, and growth potential, especially when paired with practical facts." },
      { question: "What cards warn against accepting a job?", answer: "The Devil, Five of Pentacles, Seven of Swords, Ten of Wands, or The Moon can warn of pressure, weak fit, hidden terms, or burnout." },
    ],
  }),
  makeQuestionSeoPage({
    slug: "will-i-be-successful-tarot",
    cards: [1, 19, 21],
    recommendedSpread: "three_card",
    title: "Will I Be Successful Tarot",
    description: "Draw a free AI tarot reading about success, obstacles, timing, personal growth, and the next action that improves your chances.",
    h1: "Will I Be Successful Tarot",
    intent: "Best for goals, creative projects, career moves, exams, launches, and understanding what success requires from you now.",
    question: "Will I be successful, and what should I focus on next?",
    sections: [
      { heading: "Success has a shape", body: "A useful reading should define what success means in this situation: recognition, stability, completion, growth, money, or confidence." },
      { heading: "Look for the controllable lever", body: "The cards should show the obstacle, the strength you can use, and the next action that makes the outcome more likely." },
      { heading: "Use timing as guidance, not delay", body: "If the reading shows slow progress, ask what consistency, support, or skill-building will move the goal forward." },
    ],
    faqs: [
      { question: "Can tarot tell if I will be successful?", answer: "Tarot can show momentum, blocks, strengths, and likely direction. It is most useful when it turns the answer into an action you can take." },
      { question: "What cards suggest success?", answer: "The Sun, The World, The Magician, Six of Wands, Ace of Pentacles, and The Chariot often support success when the spread is coherent." },
    ],
  }),
)

type RegionalLocale = Exclude<SeoLocale, Locale>
type RegionalPageCopy = Omit<SeoPageContent, "primaryCta" | "secondaryCta" | "questionsTitle" | "bottomCta">
type SeoContentEnhancement = Pick<SeoPageContent, "sections" | "faqs">

const regionalCta = {
  es: {
    primary: "Lectura gratis",
    secondary: "Tarot diario",
    questions: "Preguntas",
    bottom: "Sacar cartas",
  },
  "pt-br": {
    primary: "Leitura grátis",
    secondary: "Tarot diário",
    questions: "Perguntas",
    bottom: "Tirar cartas",
  },
} satisfies Record<RegionalLocale, Record<string, string>>

export const localizedSeoSlugs: Partial<Record<SeoLocale, Record<string, string>>> = {
  es: {
    "free-ai-tarot-reading": "lectura-tarot-gratis-ia",
    "love-tarot-reading": "tarot-amor",
    "reconciliation-tarot-reading": "tarot-reconciliacion",
    "daily-tarot": "tarot-diario",
    "monthly-tarot-report": "informe-mensual-tarot",
    "yes-or-no-tarot": "tarot-si-o-no",
    "career-tarot": "tarot-profesional",
    "tarot-card-meanings": "significados-cartas-tarot",
    "will-my-ex-come-back-tarot": "mi-ex-volvera-tarot",
    "does-he-love-me-tarot": "el-me-ama-tarot",
    "is-he-thinking-about-me-tarot": "esta-pensando-en-mi-tarot",
    "should-i-text-him-tarot": "deberia-escribirle-tarot",
    "when-will-i-find-love-tarot": "cuando-encontrare-amor-tarot",
    "yes-or-no-tarot-love": "tarot-amor-si-o-no",
    "career-tarot-reading": "lectura-tarot-carrera",
    "should-i-quit-my-job-tarot": "debo-renunciar-trabajo-tarot",
    "what-does-he-think-of-me-tarot": "que-piensa-de-mi-tarot",
    "will-he-contact-me-tarot": "me-contactara-tarot",
    "is-this-relationship-over-tarot": "esta-relacion-termino-tarot",
    "will-i-get-the-job-tarot": "conseguire-el-trabajo-tarot",
    "should-i-take-this-job-tarot": "deberia-aceptar-este-trabajo-tarot",
    "will-i-be-successful-tarot": "tendre-exito-tarot",
  },
  "pt-br": {
    "free-ai-tarot-reading": "leitura-tarot-gratis-ia",
    "love-tarot-reading": "tarot-do-amor",
    "reconciliation-tarot-reading": "tarot-reconciliacao",
    "daily-tarot": "tarot-diario",
    "monthly-tarot-report": "relatorio-mensal-tarot",
    "yes-or-no-tarot": "tarot-sim-ou-nao",
    "career-tarot": "tarot-carreira",
    "tarot-card-meanings": "significados-cartas-tarot",
    "will-my-ex-come-back-tarot": "meu-ex-vai-voltar-tarot",
    "does-he-love-me-tarot": "ele-me-ama-tarot",
    "is-he-thinking-about-me-tarot": "ele-esta-pensando-em-mim-tarot",
    "should-i-text-him-tarot": "devo-mandar-mensagem-tarot",
    "when-will-i-find-love-tarot": "quando-vou-encontrar-amor-tarot",
    "yes-or-no-tarot-love": "tarot-amor-sim-ou-nao",
    "career-tarot-reading": "leitura-tarot-carreira",
    "should-i-quit-my-job-tarot": "devo-pedir-demissao-tarot",
    "what-does-he-think-of-me-tarot": "o-que-ele-pensa-de-mim-tarot",
    "will-he-contact-me-tarot": "ele-vai-entrar-em-contato-tarot",
    "is-this-relationship-over-tarot": "este-relacionamento-acabou-tarot",
    "will-i-get-the-job-tarot": "vou-conseguir-o-emprego-tarot",
    "should-i-take-this-job-tarot": "devo-aceitar-este-trabalho-tarot",
    "will-i-be-successful-tarot": "vou-ter-sucesso-tarot",
  },
}

export function getCanonicalSeoSlug(sourceSlug: string, locale: SeoLocale = defaultLocale) {
  return localizedSeoSlugs[locale]?.[sourceSlug] || sourceSlug
}

export function resolveSeoSourceSlug(slug: string, locale: SeoLocale = defaultLocale) {
  const localizedSlugs = localizedSeoSlugs[locale]
  const localeMatch = localizedSlugs && Object.entries(localizedSlugs).find(([, localizedSlug]) => localizedSlug === slug)
  if (localeMatch) return localeMatch[0]

  for (const slugsBySource of Object.values(localizedSeoSlugs)) {
    const globalMatch = Object.entries(slugsBySource).find(([, localizedSlug]) => localizedSlug === slug)
    if (globalMatch) return globalMatch[0]
  }

  return slug
}

export function getSeoStaticParams(locale: SeoLocale = defaultLocale) {
  const slugs = seoPageSources.flatMap((source) => {
    const canonicalSlug = getCanonicalSeoSlug(source.slug, locale)
    return canonicalSlug === source.slug ? [source.slug] : [canonicalSlug, source.slug]
  })

  return Array.from(new Set(slugs)).map((slug) => ({ slug }))
}

function withRegionalCta(locale: RegionalLocale, content: RegionalPageCopy): SeoPageContent {
  return {
    ...content,
    primaryCta: regionalCta[locale].primary,
    secondaryCta: regionalCta[locale].secondary,
    questionsTitle: regionalCta[locale].questions,
    bottomCta: regionalCta[locale].bottom,
  }
}

const regionalSeoCopy: Record<RegionalLocale, Partial<Record<string, RegionalPageCopy>>> = {
  es: {
    "free-ai-tarot-reading": {
      title: "Lectura de tarot gratis con IA",
      description: "Saca cartas online y recibe una lectura de tarot gratis con IA para amor, trabajo, decisiones y guía diaria.",
      eyebrow: "Tarot online gratis",
      h1: "Lectura de tarot gratis con IA",
      intro: "Escribe una pregunta clara, elige tus cartas y recibe una interpretación enfocada en tu situación, sin crear una cuenta antes.",
      intent: "Una primera lectura rápida para obtener claridad práctica antes de decidir si quieres una tirada más profunda.",
      ctaQuestion: "¿Qué necesito entender con más claridad ahora?",
      sections: [
        { heading: "Cómo funciona la lectura gratis", body: "Haz una pregunta sincera, saca tus cartas y lee una interpretación que une la posición de cada carta con tu contexto real." },
        { heading: "Qué tipo de pregunta hacer", body: "Funcionan mejor las preguntas abiertas: qué debo notar, qué energía rodea esta decisión o qué paso me ayuda a avanzar." },
        { heading: "Cuándo conviene profundizar", body: "La membresía tiene sentido cuando quieres preguntas de seguimiento, historial guardado, tiradas avanzadas e informes más largos." },
      ],
      faqs: [
        { question: "¿La primera lectura de tarot con IA es gratis?", answer: "Sí. Puedes empezar sin pagar. La membresía añade uso ampliado, historial guardado y reportes más profundos." },
        { question: "¿Necesito iniciar sesión para sacar cartas?", answer: "No. Puedes comenzar primero y entrar más tarde si quieres guardar resultados o continuar la lectura." },
      ],
    },
    "love-tarot-reading": {
      title: "Lectura de tarot del amor",
      description: "Pregunta por una relación, una persona especial, una ruptura o una reconciliación y recibe una lectura de tarot del amor con IA.",
      eyebrow: "Guía sentimental",
      h1: "Lectura de tarot del amor",
      intro: "Usa esta lectura cuando necesites mirar con calma una conexión, señales mixtas, una ruptura o el patrón emocional entre dos personas.",
      intent: "Ideal para sentimientos, comunicación, compromiso, reconciliación, tiempos de la relación y próximos pasos.",
      ctaQuestion: "¿Cuál es la energía real entre nosotros ahora?",
      sections: [
        { heading: "Pregunta por la conexión", body: "Una buena lectura de amor deja espacio para los matices y pregunta qué revela la relación, no solo si todo será sí o no." },
        { heading: "Lee el patrón completo", body: "La tirada observa atracción, miedo, comunicación, tiempo y la elección que sí está bajo tu control." },
        { heading: "Usa el seguimiento con cuidado", body: "Después de la primera respuesta, haz una pregunta precisa en lugar de repetir lo mismo para buscar seguridad." },
      ],
      faqs: [
        { question: "¿El tarot puede decir si alguien me ama?", answer: "Puede explorar señales emocionales y dinámicas de relación, pero debe usarse como guía, no como control sobre otra persona." },
        { question: "¿Cuál es una buena pregunta de tarot del amor?", answer: "Prueba: ¿qué energía hay entre nosotros? ¿Qué debo comprender antes de actuar?" },
      ],
    },
    "reconciliation-tarot-reading": {
      title: "Tarot de reconciliación",
      description: "Consulta sobre tu ex, la energía después de una ruptura, el contacto y si una reconciliación sería sana o realista.",
      eyebrow: "Ruptura y regreso",
      h1: "Tarot de reconciliación",
      intro: "Esta lectura ayuda a ver qué terminó, qué energía sigue viva y qué tendría que cambiar antes de volver a acercarse.",
      intent: "Ideal para contacto con un ex, claridad tras la ruptura, segundas oportunidades, disculpas y límites.",
      ctaQuestion: "¿Qué debo entender antes de volver a contactar?",
      sections: [
        { heading: "Distingue nostalgia de señal", body: "Extrañar a alguien no siempre significa que la relación esté lista para volver. Las cartas pueden mostrar si algo cambió de verdad." },
        { heading: "Busca cambios de conducta", body: "La reconciliación necesita más que sentimientos: responsabilidad, comunicación, límites y un momento adecuado." },
        { heading: "Elige primero tu paz", body: "La respuesta útil no es solo si vuelve, sino qué decisión protege tu dignidad, tu calma y tu crecimiento." },
      ],
      faqs: [
        { question: "¿El tarot puede predecir si mi ex volverá?", answer: "Puede mostrar energía actual, bloqueos y tendencias, pero una reconciliación depende de decisiones reales de ambas personas." },
        { question: "¿Qué preguntar sobre una reconciliación?", answer: "Pregunta qué cambió, qué aún necesita sanar y qué límite debes mantener antes de volver a hablar." },
      ],
    },
    "daily-tarot": {
      title: "Tarot diario gratis",
      description: "Saca una carta diaria para conocer la energía de hoy, una guía práctica y el tema que merece tu atención.",
      eyebrow: "Energía de hoy",
      h1: "Tarot diario gratis",
      intro: "El tarot diario te da un tema claro para el día y te ayuda a notar la emoción, elección u oportunidad que conviene atender.",
      intent: "Úsalo por la mañana para enfocarte, a mitad del día para reajustar o por la noche para reflexionar.",
      ctaQuestion: "¿Qué energía debe guiarme hoy?",
      sections: [
        { heading: "Mantén la pregunta simple", body: "El tarot diario funciona mejor con preguntas pequeñas, concretas y cercanas al momento presente." },
        { heading: "Convierte la carta en acción", body: "Después de leer la carta, elige una acción pequeña que aplique el consejo en tu día real." },
        { heading: "Observa patrones", body: "Con historial guardado puedes ver cartas repetidas, estados de ánimo y temas que vuelven con el tiempo." },
      ],
      faqs: [
        { question: "¿Puedo hacer una lectura diaria todos los días?", answer: "Sí, si te ayuda a reflexionar. Mantén la pregunta simple y evita repetir la misma inquietud muchas veces." },
        { question: "¿Una sola carta es suficiente?", answer: "Para un chequeo rápido, sí. Para una situación compleja, una tirada de tres cartas suele dar más contexto." },
      ],
    },
    "monthly-tarot-report": {
      title: "Informe mensual de tarot",
      description: "Empieza con un chequeo mensual gratis y desbloquea informes más profundos con historial, cartas repetidas y notas personales.",
      eyebrow: "Reflexión mensual",
      h1: "Informe mensual de tarot",
      intro: "Un informe mensual convierte lecturas sueltas en un patrón más claro: cartas repetidas, temas de amor, señales profesionales y foco del próximo mes.",
      intent: "Empieza con una lectura mensual gratis. La membresía sirve para historial guardado, seguimientos, tiradas avanzadas e informes largos.",
      ctaQuestion: "¿Qué tema debe guiar mi próximo mes?",
      sections: [
        { heading: "Empieza con un chequeo gratis", body: "Haz una pregunta mensual clara para recibir un tema inicial antes de decidir si necesitas un análisis más profundo." },
        { heading: "El historial da profundidad", body: "Un informe fuerte nace de cartas repetidas, preguntas antiguas, notas y patrones en amor, carrera y lecturas diarias." },
        { heading: "Mantén clara la membresía", body: "La herramienta gratis debe ser útil por sí sola; la membresía añade profundidad, memoria y continuidad." },
      ],
      faqs: [
        { question: "¿El informe mensual de tarot es gratis?", answer: "Puedes empezar con un chequeo mensual gratis. Los informes largos basados en historial son una función de membresía." },
        { question: "¿Qué debe incluir un informe mensual?", answer: "Tema del mes, cartas repetidas, señales de amor y trabajo, consejo práctico y una acción prioritaria." },
      ],
    },
    "yes-or-no-tarot": {
      title: "Tarot sí o no",
      description: "Usa el tarot sí o no para una decisión rápida con una explicación de IA sobre la energía detrás de la respuesta.",
      eyebrow: "Lectura de decisión",
      h1: "Tarot sí o no",
      intro: "Una lectura sí o no sirve cuando necesitas una señal rápida, pero la explicación detrás de la respuesta es lo más importante.",
      intent: "Ideal para decisiones claras: contactar, esperar, aceptar, rechazar, continuar o cambiar de rumbo.",
      ctaQuestion: "¿Debo avanzar con esta decisión?",
      sections: [
        { heading: "Haz una pregunta limpia", body: "La pregunta debe ser específica y tener un marco de tiempo para que la respuesta se conecte con una acción real." },
        { heading: "Lee la razón", body: "La carta puede mostrar impulso, resistencia, información oculta o la necesidad de paciencia." },
        { heading: "No repitas demasiado", body: "Si el resultado incomoda, pregunta qué debes entender a continuación en lugar de sacar otra carta igual." },
      ],
      faqs: [
        { question: "¿El tarot puede responder sí o no?", answer: "Puede dar una dirección, pero la explicación y las condiciones importan más que una palabra aislada." },
        { question: "¿Qué hago después de la respuesta?", answer: "Úsala como reflexión y compárala con datos reales, responsabilidades y riesgos concretos." },
      ],
    },
    "career-tarot": {
      title: "Lectura de tarot profesional",
      description: "Pregunta por trabajo, dinero, dirección, cambios laborales, proyectos creativos o tiempos profesionales.",
      eyebrow: "Trabajo y dirección",
      h1: "Lectura de tarot profesional",
      intro: "El tarot profesional ayuda a examinar dirección, motivación, tiempos y patrones invisibles alrededor de una decisión laboral o económica.",
      intent: "Ideal para cambios de empleo, entrevistas, proyectos, conflictos laborales, negocios y dirección a largo plazo.",
      ctaQuestion: "¿Qué debo entender sobre mi camino profesional ahora?",
      sections: [
        { heading: "Aclara la decisión", body: "Las lecturas de carrera funcionan mejor cuando se conectan con una decisión concreta: quedarte, moverte, negociar o esperar." },
        { heading: "Separa miedo de señal", body: "Las cartas pueden ayudarte a distinguir una cautela útil de una duda que solo te paraliza." },
        { heading: "Usa tiradas más profundas", body: "Una gran transición necesita mirar obstáculos, recursos, tiempos y posibles resultados." },
      ],
      faqs: [
        { question: "¿El tarot ayuda en decisiones de carrera?", answer: "Puede ayudarte a reflexionar sobre motivación, riesgo, tiempos y próximos pasos." },
        { question: "¿Qué pregunta profesional funciona bien?", answer: "Prueba: ¿qué bloquea mi crecimiento? ¿En qué debo enfocarme este mes?" },
      ],
    },
    "tarot-card-meanings": {
      title: "Significados de las cartas del tarot",
      description: "Aprende los significados de cartas al derecho e invertidas y luego saca una tirada con interpretación personalizada de IA.",
      eyebrow: "Significados de cartas",
      h1: "Significados de las cartas del tarot",
      intro: "Los significados del tarot forman un lenguaje de símbolos. Cada carta cambia según la pregunta, la posición y si aparece al derecho o invertida.",
      intent: "Usa esta guía como punto de partida y deja que una lectura completa conecte los símbolos con tu situación.",
      ctaQuestion: "¿Qué mensaje tienen estas cartas para mí?",
      sections: [
        { heading: "Cartas al derecho e invertidas", body: "El derecho muestra la energía activa de la carta. La inversión puede señalar retraso, bloqueo, desequilibrio o trabajo interno." },
        { heading: "La posición cambia el sentido", body: "La misma carta se lee distinto en pasado, presente, obstáculo, consejo o resultado." },
        { heading: "La tirada cuenta una historia", body: "Una buena lectura conecta las cartas entre sí en vez de tratarlas como definiciones aisladas." },
      ],
      faqs: [
        { question: "¿Las cartas invertidas son malas?", answer: "No necesariamente. Pueden mostrar energía bloqueada, demora, ajuste interno o una parte privada del proceso." },
        { question: "¿Los principiantes deben memorizar todo?", answer: "Los significados ayudan, pero el contexto pesa más. Empieza con palabras clave y lee la tirada completa." },
      ],
    },
    "will-my-ex-come-back-tarot": {
      title: "Tarot: ¿mi ex volverá?",
      description: "Saca cartas para una lectura gratis con IA sobre reconciliación, energía de tu ex, tiempos y qué hacer después.",
      eyebrow: "Pregunta de tarot",
      h1: "Tarot: ¿mi ex volverá?",
      intro: "Pregunta si tu ex podría volver y qué debes comprender antes de actuar. La lectura mira señales, bloqueos y el paso más sano para ti.",
      intent: "Ideal para claridad después de una ruptura, señales de reconciliación, tiempos emocionales y si conviene contactar.",
      ctaQuestion: "¿Mi ex volverá y qué debo entender antes de actuar?",
      sections: [
        { heading: "Mira el patrón", body: "Una lectura de reconciliación debe mostrar por qué se rompió la relación, qué energía queda y si ambos podrían elegir distinto." },
        { heading: "El tiempo no es certeza", body: "Las cartas pueden señalar movimiento o demora, pero tu acción más sana importa más que quedarte esperando." },
        { heading: "Haz un solo seguimiento", body: "Después de la primera tirada, pregunta qué puedes hacer ahora en lugar de repetir lo mismo por ansiedad." },
      ],
      faqs: [
        { question: "¿El tarot puede predecir si mi ex regresa?", answer: "Puede explorar señales, bloqueos y dinámicas probables. Debe guiar tus decisiones, no reemplazar comunicación directa ni autoestima." },
        { question: "¿Qué cartas sugieren reconciliación?", answer: "El Juicio, Los Enamorados, Dos de Copas, Seis de Copas y La Templanza pueden sugerir reconexión si el conjunto lo apoya." },
      ],
    },
    "does-he-love-me-tarot": {
      title: "Tarot: ¿él me ama?",
      description: "Pregunta gratis al tarot con IA sobre sus sentimientos, señales mixtas, comunicación y el próximo paso en la conexión.",
      eyebrow: "Pregunta de amor",
      h1: "Tarot: ¿él me ama?",
      intro: "Saca cartas para mirar sus sentimientos, la coherencia entre emoción y conducta, y lo que tú necesitas para sentirte clara.",
      intent: "Ideal para energía emocional, señales mixtas, comunicación y si la conexión es realmente mutua.",
      ctaQuestion: "¿Él me ama y cuál es la energía emocional real entre nosotros?",
      sections: [
        { heading: "Lee sentimientos y conducta juntos", body: "Una carta no es prueba absoluta. La lectura compara emoción, acción, miedo y consistencia." },
        { heading: "Observa tus necesidades", body: "Las cartas también deben mostrar qué necesitas para sentir seguridad, respeto y claridad." },
        { heading: "No persigas certeza", body: "Si la tirada muestra confusión, pregunta qué conversación o límite puede traer claridad." },
      ],
      faqs: [
        { question: "¿El tarot puede decir si alguien me ama?", answer: "Puede revelar dinámicas emocionales y sentimientos probables, pero el amor también debe verse en acciones consistentes." },
        { question: "¿Qué pasa si las cartas son mixtas?", answer: "A menudo reflejan conducta mixta. Mira la carta de consejo y el patrón de toda la tirada." },
      ],
    },
    "is-he-thinking-about-me-tarot": {
      title: "Tarot: ¿está pensando en mí?",
      description: "Lectura gratis con IA sobre si piensa en ti, qué significa su silencio, sus sentimientos y el próximo paso más sano.",
      eyebrow: "Pregunta de amor",
      h1: "Tarot: ¿está pensando en mí?",
      intro: "Pregunta si él está pensando en ti y qué energía real hay detrás de su silencio. La lectura separa atención privada, miedo, evasión y posible acción.",
      intent: "Ideal para silencio, mensajes tardíos, contacto cero, señales mixtas y dudas sobre si sus pensamientos pueden convertirse en acción.",
      ctaQuestion: "¿Está pensando en mí y qué energía real hay detrás de su silencio?",
      sections: [
        { heading: "Lee pensamientos junto a conducta", body: "Una carta puede sugerir atención, pero la tirada completa debe comparar pensamientos, sentimientos, miedos y acciones posibles." },
        { heading: "El silencio no significa una sola cosa", body: "El contacto cero puede ser procesamiento, orgullo, evitación, confusión o cierre. La lectura ayuda a separar esperanza de señales reales." },
        { heading: "Vuelve a tu claridad", body: "La respuesta más útil muestra qué puedes hacer sin quedarte esperando indefinidamente un mensaje." },
      ],
      faqs: [
        { question: "¿El tarot puede decir si piensa en mí?", answer: "Puede reflejar señales emocionales y energía mental probable, pero los pensamientos importan más cuando se conectan con acciones respetuosas." },
        { question: "¿Qué cartas sugieren que piensa en mí?", answer: "La Sacerdotisa, Paje de Copas, Seis de Copas, Los Enamorados y La Luna pueden sugerir enfoque interno si la tirada lo apoya." },
      ],
    },
    "should-i-text-him-tarot": {
      title: "Tarot: ¿debería escribirle?",
      description: "Lectura gratis sí o no con IA antes de escribirle. Revisa timing, intención, seguridad emocional y el siguiente paso.",
      eyebrow: "Decisión de contacto",
      h1: "Tarot: ¿debería escribirle?",
      intro: "Haz una pregunta clara antes de enviar el mensaje. La lectura revisa si escribir ahora nace de claridad, ansiedad, cuidado o presión.",
      intent: "Ideal para decidir si escribir hoy, esperar, poner un límite o elegir una forma más tranquila de reabrir el contacto.",
      ctaQuestion: "¿Debería escribirle hoy y qué debo considerar antes de enviarlo?",
      sections: [
        { heading: "Escribir depende de timing e intención", body: "Un sí o no útil también muestra si el mensaje abre comunicación clara o reacciona desde ansiedad." },
        { heading: "Mira el costo del contacto", body: "La tirada debe mostrar si escribir ayuda a una comunicación sana o reinicia un patrón viejo." },
        { heading: "Haz práctica la respuesta", body: "Si inclina a sí, envía un mensaje claro. Si inclina a no o todavía no, usa la pausa para proteger tu paz." },
      ],
      faqs: [
        { question: "¿El tarot puede responder si debo escribirle?", answer: "Sí, puede dar dirección rápida y la razón detrás. Úsalo como reflexión, no como presión para ignorar tus límites." },
        { question: "¿Qué cartas sugieren esperar antes de escribir?", answer: "El Colgado, Cuatro de Espadas, Templanza, La Luna o cartas de comunicación invertidas pueden sugerir esperar." },
      ],
    },
    "when-will-i-find-love-tarot": {
      title: "Tarot: ¿cuándo encontraré el amor?",
      description: "Lectura gratis con IA sobre encontrar amor, timing, energía de citas, rasgos de una pareja y lo que te prepara.",
      eyebrow: "Tiempo de amor",
      h1: "Tarot: ¿cuándo encontraré el amor?",
      intro: "Pregunta cuándo puede llegar el amor y qué debes abrir en ti. La lectura mira timing, disponibilidad, patrones y el siguiente movimiento.",
      intent: "Ideal para personas solteras, cansancio de citas, timing de pareja, apertura al amor y patrones que conviene soltar.",
      ctaQuestion: "¿Cuándo encontraré el amor y a qué debo abrirme ahora?",
      sections: [
        { heading: "El timing también es disponibilidad", body: "Una lectura de tiempo no solo predice cuándo aparece el amor; muestra qué energía y elecciones ayudan a reconocerlo." },
        { heading: "Mira el patrón antes que la persona", body: "Las cartas pueden revelar si bloquean expectativas antiguas, miedo, personas no disponibles o falta de espacios nuevos." },
        { heading: "Convierte la respuesta en movimiento", body: "Usa la lectura para elegir una acción de citas o confianza propia, no para esperar pasivamente." },
      ],
      faqs: [
        { question: "¿El tarot puede predecir cuándo encontraré el amor?", answer: "Puede mostrar temas de timing y disponibilidad, pero lo más útil es entender qué decisiones hacen posible la conexión." },
        { question: "¿Qué cartas sugieren nuevo amor?", answer: "As de Copas, Los Enamorados, La Estrella, Dos de Copas, La Emperatriz y Rueda de la Fortuna pueden sugerir apertura a nuevo amor." },
      ],
    },
    "yes-or-no-tarot-love": {
      title: "Tarot del amor sí o no",
      description: "Obtén una lectura gratis de amor sí o no con IA para citas, relaciones, atracción y reconciliación.",
      eyebrow: "Decisión amorosa",
      h1: "Tarot del amor sí o no",
      intro: "Haz una pregunta amorosa simple y recibe una respuesta con contexto, consejo y la razón emocional detrás del sí, no o todavía no.",
      intent: "Ideal para preguntas de amor simples cuando también necesitas contexto, consejo y una explicación de la energía.",
      ctaQuestion: "Dame una respuesta de amor sí o no y la razón detrás.",
      sections: [
        { heading: "Sí o no necesita contexto", body: "Las preguntas de amor rara vez son limpias. La explicación muestra por qué la energía inclina hacia sí, no o aún no." },
        { heading: "Usa una pregunta clara", body: "Pregunta por una persona, una relación o una decisión. No combines varios resultados en una sola tirada." },
        { heading: "Deja que el consejo mande", body: "Incluso un sí debe mostrar el próximo paso; incluso un no puede indicar qué te protege." },
      ],
      faqs: [
        { question: "¿Qué cartas significan sí en amor?", answer: "Los Enamorados, Dos de Copas, As de Copas, El Sol y Diez de Copas suelen inclinar a sí cuando el contexto acompaña." },
        { question: "¿Una carta invertida puede ser sí?", answer: "Sí, pero normalmente con una demora, condición o bloqueo interno que debe atenderse primero." },
      ],
    },
    "career-tarot-reading": {
      title: "Lectura de tarot para carrera",
      description: "Lectura gratis con IA para cambios de empleo, entrevistas, negocios, dinero y dirección profesional.",
      eyebrow: "Pregunta profesional",
      h1: "Lectura de tarot para carrera",
      intro: "Pregunta por tu camino profesional y recibe una lectura centrada en impulso, bloqueos, recursos y el siguiente movimiento práctico.",
      intent: "Ideal para cambios laborales, entrevistas, decisiones de negocio, conflictos de trabajo y dónde enfocarte ahora.",
      ctaQuestion: "¿Qué debo entender sobre mi carrera en este momento?",
      sections: [
        { heading: "Las cartas muestran impulso", body: "Una lectura laboral puede revelar preparación, resistencia oculta, tiempos y recursos necesarios para avanzar." },
        { heading: "Separa miedo de señal", body: "Algunas cartas piden frenar; otras solo muestran miedo. La tirada completa ayuda a distinguirlo." },
        { heading: "Convierte la claridad en acción", body: "Elige un movimiento práctico: postular, prepararte, negociar, esperar o cambiar de dirección." },
      ],
      faqs: [
        { question: "¿El tarot puede ayudar con decisiones laborales?", answer: "Sí. Es más fuerte para aclarar motivación, riesgo, tiempos y la próxima acción útil." },
        { question: "¿Qué cartas son buenas para carrera?", answer: "El Mago, El Mundo, As de Oros, Tres de Oros y Rey de Oros suelen apoyar crecimiento profesional." },
      ],
    },
    "should-i-quit-my-job-tarot": {
      title: "Tarot: ¿debo renunciar a mi trabajo?",
      description: "Pregunta antes de renunciar. Explora tiempos, riesgo, agotamiento, dinero y el siguiente paso más sabio.",
      eyebrow: "Decisión laboral",
      h1: "Tarot: ¿debo renunciar a mi trabajo?",
      intro: "Esta lectura ayuda a mirar si estás ante una transición real, un agotamiento temporal o una decisión que requiere preparación.",
      intent: "Ideal para estrés laboral, burnout, ambientes tóxicos, tiempos financieros y decidir si quedarte, planear o salir.",
      ctaQuestion: "¿Debo renunciar a mi trabajo y cuál es el siguiente paso más sabio?",
      sections: [
        { heading: "No te apresures con la respuesta", body: "La pregunta toca dinero, identidad, estrés y tiempo. Lee la carta de consejo con tanta seriedad como la de resultado." },
        { heading: "Distingue burnout de crecimiento", body: "Algunas tiradas muestran que un trabajo ya terminó. Otras muestran cansancio que pide límites, descanso o negociación." },
        { heading: "Construye un puente práctico", body: "Si las cartas apoyan salir, pregunta qué preparación, ahorro o conversación debe ocurrir antes." },
      ],
      faqs: [
        { question: "¿El tarot puede decidir si debo renunciar?", answer: "Puede aclarar patrones y riesgos, pero debes combinarlo con planificación financiera y opciones reales." },
        { question: "¿Qué cartas sugieren dejar un trabajo?", answer: "La Torre, La Muerte, Ocho de Copas, Diez de Bastos y El Mundo pueden sugerir transición si la tirada lo confirma." },
      ],
    },
    "what-does-he-think-of-me-tarot": {
      title: "Tarot: ¿qué piensa de mí?",
      description: "Lectura gratis con IA sobre qué piensa de ti, cómo ve la conexión y si sus pensamientos pueden convertirse en acción.",
      eyebrow: "Pregunta de amor",
      h1: "Tarot: ¿qué piensa de mí?",
      intro: "Pregunta qué piensa de ti y qué debes entender sobre su actitud. La lectura separa percepción, atracción, miedo y conducta real.",
      intent: "Ideal para señales mixtas, atracción incierta, silencio, citas ambiguas y cómo alguien puede verte.",
      ctaQuestion: "¿Qué piensa de mí y qué debo entender sobre su actitud?",
      sections: [
        { heading: "Los pensamientos no son toda la historia", body: "Una lectura útil separa pensamientos privados, conducta visible, atracción, miedo y si algo de eso se vuelve acción respetuosa." },
        { heading: "Lee percepción y patrón", body: "La tirada puede mostrar cómo te ve ahora, qué evita y qué te pide notar esta conexión." },
        { heading: "Vuelve la respuesta hacia ti", body: "El siguiente paso no es solo saber su opinión, sino qué límite, conversación o pausa te devuelve claridad." },
      ],
      faqs: [
        { question: "¿El tarot puede mostrar qué piensa de mí?", answer: "Puede reflejar percepción probable, atención y tono emocional, pero importa más cuando se conecta con conducta y comunicación." },
        { question: "¿Qué cartas sugieren que me ve bien?", answer: "Los Enamorados, La Estrella, Reina de Copas, Paje de Copas y Seis de Copas pueden mostrar calidez si la tirada lo apoya." },
      ],
    },
    "will-he-contact-me-tarot": {
      title: "Tarot: ¿me contactará?",
      description: "Lectura gratis con IA sobre si te contactará, qué puede retrasarlo y qué hacer mientras esperas.",
      eyebrow: "Contacto y silencio",
      h1: "Tarot: ¿me contactará?",
      intro: "Pregunta si habrá contacto y qué hacer mientras esperas. La lectura mira deseo, miedo, orgullo, timing y bloqueos de comunicación.",
      intent: "Ideal para contacto cero, respuestas tardías, silencio tras una ruptura, señales mixtas y si conviene esperar o avanzar.",
      ctaQuestion: "¿Me contactará y qué debo hacer mientras espero?",
      sections: [
        { heading: "El contacto depende de más que sentimiento", body: "Las cartas deben mostrar deseo, miedo, timing, orgullo, evasión y si la comunicación puede volverse acción real." },
        { heading: "Esperar necesita un límite", body: "Una lectura de contacto sirve más cuando también muestra qué protege tu paz si el mensaje no llega pronto." },
        { heading: "Decide tu respuesta antes del mensaje", body: "Si parece probable que contacte, pregunta qué límite o tono mantendría una conversación sana." },
      ],
      faqs: [
        { question: "¿El tarot puede predecir si me escribirá?", answer: "Puede mostrar energía de comunicación y bloqueos posibles, pero el contacto real depende de decisiones y circunstancias." },
        { question: "¿Qué cartas sugieren contacto?", answer: "Ocho de Bastos, Paje de Copas, Caballero de Espadas, El Juicio y El Mago pueden sugerir movimiento si la tirada acompaña." },
      ],
    },
    "is-this-relationship-over-tarot": {
      title: "Tarot: ¿esta relación terminó?",
      description: "Lectura gratis con IA para explorar si una relación termina, qué aún puede repararse y cuál es el paso más sano.",
      eyebrow: "Relación y cierre",
      h1: "Tarot: ¿esta relación terminó?",
      intro: "Pregunta si la relación terminó o si todavía existe energía de reparación. La lectura mira distancia, confianza, conflicto y límites.",
      intent: "Ideal para dudas de pareja, señales de ruptura, distancia emocional, conflicto repetido y si reparar es realista.",
      ctaQuestion: "¿Esta relación terminó y cuál es el paso más sano?",
      sections: [
        { heading: "Los finales pueden ser emocionales o prácticos", body: "Una relación puede sentirse terminada porque cambiaron la confianza, el esfuerzo o la comunicación. La tirada aclara qué capa se cierra." },
        { heading: "Busca condiciones de reparación", body: "Si las cartas muestran camino, también deben nombrar qué conducta, honestidad, timing y límites tendrían que cambiar." },
        { heading: "Deja que el consejo mande", body: "Tanto si inclina a cierre como a reparación, el mensaje útil protege tu autoestima y estabilidad emocional." },
      ],
      faqs: [
        { question: "¿El tarot puede decir si una relación terminó?", answer: "Puede mostrar el patrón actual, qué se está cayendo y si queda energía de reparación. Debe guiar reflexión, no forzar una ruptura." },
        { question: "¿Qué cartas sugieren final de relación?", answer: "La Muerte, La Torre, Diez de Espadas, Ocho de Copas y El Mundo pueden sugerir cierre cuando la tirada confirma." },
      ],
    },
    "will-i-get-the-job-tarot": {
      title: "Tarot: ¿conseguiré el trabajo?",
      description: "Lectura gratis con IA sobre una oferta, entrevista, obstáculos ocultos y cómo mejorar tus posibilidades.",
      eyebrow: "Trabajo y oferta",
      h1: "Tarot: ¿conseguiré el trabajo?",
      intro: "Pregunta por una entrevista u oferta pendiente. La lectura revisa impulso, encaje, obstáculos y el próximo paso práctico.",
      intent: "Ideal para entrevistas, ofertas pendientes, postulaciones, ascensos y qué acción mejora el resultado.",
      ctaQuestion: "¿Conseguiré el trabajo y qué puedo hacer para mejorar mis posibilidades?",
      sections: [
        { heading: "Resultado y preparación van juntos", body: "Una lectura laboral no solo pregunta si llega la oferta; muestra fortalezas, puntos débiles, timing y qué preparar." },
        { heading: "Lee los obstáculos con honestidad", body: "Las cartas pueden señalar competencia, información faltante, comunicación poco clara o un encaje que necesita atención." },
        { heading: "Convierte la respuesta en seguimiento", body: "Elige una acción concreta: escribir, practicar, aclarar salario, mejorar materiales o ampliar opciones." },
      ],
      faqs: [
        { question: "¿El tarot puede predecir si conseguiré el trabajo?", answer: "Puede mostrar impulso, encaje, obstáculos y dirección probable, pero preparación y decisiones reales siguen importando." },
        { question: "¿Qué cartas sugieren conseguir trabajo?", answer: "El Mago, El Carro, As de Oros, Tres de Oros y Seis de Bastos pueden apoyar éxito si la tirada coincide." },
      ],
    },
    "should-i-take-this-job-tarot": {
      title: "Tarot: ¿debería aceptar este trabajo?",
      description: "Lectura gratis con IA para comparar aceptar una oferta con decir no, esperar o negociar mejores condiciones.",
      eyebrow: "Decisión laboral",
      h1: "Tarot: ¿debería aceptar este trabajo?",
      intro: "Compara la oferta con tus necesidades reales. La lectura mira dinero, cultura, crecimiento, estabilidad, riesgo y negociación.",
      intent: "Ideal para evaluar oferta nueva, salario, cultura, crecimiento a largo plazo, riesgo y si conviene negociar.",
      ctaQuestion: "¿Debería aceptar este trabajo y qué debo comparar antes de decidir?",
      sections: [
        { heading: "Compara los costos reales", body: "Una oferta puede verse bien en un área y costar en otra. La lectura pesa crecimiento, dinero, cultura, estabilidad y energía." },
        { heading: "Usa la tirada como mapa de decisión", body: "Una tirada de dos opciones compara aceptar con esperar, negociar o tomar otra ruta." },
        { heading: "No ignores lo práctico", body: "El tarot aclara valores y riesgos, pero la decisión final debe revisar contrato, beneficios, carga, traslado y dinero." },
      ],
      faqs: [
        { question: "¿El tarot ayuda a decidir si aceptar un trabajo?", answer: "Sí. Aclara costos, motivos, riesgo y potencial de crecimiento, especialmente si lo combinas con datos reales." },
        { question: "¿Qué cartas advierten no aceptar?", answer: "El Diablo, Cinco de Oros, Siete de Espadas, Diez de Bastos o La Luna pueden advertir presión, mal encaje o términos ocultos." },
      ],
    },
    "will-i-be-successful-tarot": {
      title: "Tarot: ¿tendré éxito?",
      description: "Lectura gratis con IA sobre éxito, obstáculos, timing, crecimiento personal y la próxima acción que mejora tus posibilidades.",
      eyebrow: "Meta y éxito",
      h1: "Tarot: ¿tendré éxito?",
      intro: "Pregunta por una meta, proyecto o cambio importante. La lectura define qué tipo de éxito buscas y qué acción lo acerca.",
      intent: "Ideal para metas, proyectos creativos, carrera, exámenes, lanzamientos y qué requiere el éxito ahora.",
      ctaQuestion: "¿Tendré éxito y en qué debería enfocarme ahora?",
      sections: [
        { heading: "El éxito tiene forma", body: "Una lectura útil define si éxito significa reconocimiento, estabilidad, cierre, crecimiento, dinero o confianza." },
        { heading: "Busca la palanca controlable", body: "Las cartas deben mostrar el obstáculo, la fuerza disponible y la acción que mejora la probabilidad." },
        { heading: "Usa el timing como guía", body: "Si aparece progreso lento, pregunta qué constancia, apoyo o habilidad moverá la meta." },
      ],
      faqs: [
        { question: "¿El tarot puede decir si tendré éxito?", answer: "Puede mostrar impulso, bloqueos, fortalezas y dirección probable. Es más útil cuando convierte la respuesta en acción." },
        { question: "¿Qué cartas sugieren éxito?", answer: "El Sol, El Mundo, El Mago, Seis de Bastos, As de Oros y El Carro suelen apoyar éxito cuando la tirada es coherente." },
      ],
    },
  },
  "pt-br": {
    "free-ai-tarot-reading": {
      title: "Leitura de tarot grátis com IA",
      description: "Tire cartas online e receba uma leitura de tarot grátis com IA para amor, carreira, decisões e orientação diária.",
      eyebrow: "Tarot online grátis",
      h1: "Leitura de tarot grátis com IA",
      intro: "Escreva uma pergunta clara, escolha suas cartas e receba uma interpretação focada na sua situação, sem criar conta antes.",
      intent: "Uma primeira leitura rápida para obter clareza prática antes de decidir se precisa de uma tiragem mais profunda.",
      ctaQuestion: "O que eu mais preciso entender agora?",
      sections: [
        { heading: "Como funciona a leitura grátis", body: "Faça uma pergunta sincera, tire suas cartas e leia uma interpretação que conecta posição, carta e contexto real." },
        { heading: "Que pergunta fazer", body: "Perguntas abertas funcionam melhor: o que devo perceber, que energia envolve esta escolha ou qual passo ajuda a avançar." },
        { heading: "Quando aprofundar", body: "A assinatura faz sentido quando você quer perguntas de acompanhamento, histórico salvo, tiragens avançadas e relatórios mais longos." },
      ],
      faqs: [
        { question: "A primeira leitura de tarot com IA é grátis?", answer: "Sim. Você pode começar sem pagar. A assinatura adiciona uso ampliado, histórico salvo e relatórios mais profundos." },
        { question: "Preciso entrar na conta antes de tirar cartas?", answer: "Não. Você pode começar primeiro e entrar depois se quiser salvar resultados ou continuar a leitura." },
      ],
    },
    "love-tarot-reading": {
      title: "Leitura de tarot do amor",
      description: "Pergunte sobre relacionamento, paixão, término ou reconciliação e receba uma leitura de tarot do amor com IA.",
      eyebrow: "Guia amoroso",
      h1: "Leitura de tarot do amor",
      intro: "Use esta leitura quando precisar olhar com calma para uma conexão, sinais confusos, uma ruptura ou o padrão emocional entre duas pessoas.",
      intent: "Ideal para sentimentos, comunicação, compromisso, reconciliação, tempo do relacionamento e próximos passos.",
      ctaQuestion: "Qual é a energia real entre nós agora?",
      sections: [
        { heading: "Pergunte sobre a conexão", body: "Uma boa leitura de amor deixa espaço para nuances e pergunta o que a relação revela, não apenas se tudo será sim ou não." },
        { heading: "Leia o padrão completo", body: "A tiragem observa atração, medo, comunicação, tempo e a escolha que está sob seu controle." },
        { heading: "Use o acompanhamento com cuidado", body: "Depois da primeira resposta, faça uma pergunta precisa em vez de repetir a mesma coisa por insegurança." },
      ],
      faqs: [
        { question: "O tarot pode dizer se alguém me ama?", answer: "Pode explorar sinais emocionais e dinâmicas de relação, mas deve ser guia, não controle sobre outra pessoa." },
        { question: "Qual é uma boa pergunta de tarot do amor?", answer: "Tente: qual é a energia entre nós? O que devo entender antes de agir?" },
      ],
    },
    "reconciliation-tarot-reading": {
      title: "Tarot de reconciliação",
      description: "Pergunte sobre ex, energia após o término, contato e se uma reconciliação seria saudável ou realista.",
      eyebrow: "Término e retorno",
      h1: "Tarot de reconciliação",
      intro: "Esta leitura ajuda a ver o que terminou, que energia ainda existe e o que teria que mudar antes de uma reaproximação.",
      intent: "Ideal para contato com ex, clareza após término, segundas chances, pedido de desculpas e limites.",
      ctaQuestion: "O que devo entender antes de voltar a falar?",
      sections: [
        { heading: "Separe saudade de sinal", body: "Sentir falta não significa que a relação esteja pronta para voltar. As cartas podem mostrar se algo realmente mudou." },
        { heading: "Procure mudança de comportamento", body: "Reconciliação precisa de mais do que sentimento: responsabilidade, comunicação, limites e momento adequado." },
        { heading: "Escolha sua paz primeiro", body: "A resposta útil não é só se a pessoa volta, mas que decisão protege sua dignidade, calma e crescimento." },
      ],
      faqs: [
        { question: "O tarot pode prever se meu ex vai voltar?", answer: "Pode mostrar energia atual, bloqueios e tendências, mas a reconciliação depende de escolhas reais das duas pessoas." },
        { question: "O que perguntar sobre reconciliação?", answer: "Pergunte o que mudou, o que ainda precisa curar e que limite manter antes de falar de novo." },
      ],
    },
    "daily-tarot": {
      title: "Tarot diário grátis",
      description: "Tire uma carta diária para conhecer a energia de hoje, uma orientação prática e o tema que merece atenção.",
      eyebrow: "Energia de hoje",
      h1: "Tarot diário grátis",
      intro: "O tarot diário dá um tema claro para o dia e ajuda você a perceber a emoção, escolha ou oportunidade que merece atenção.",
      intent: "Use de manhã para focar, no meio do dia para reajustar ou à noite para refletir sobre o que o dia ensinou.",
      ctaQuestion: "Que energia deve me guiar hoje?",
      sections: [
        { heading: "Mantenha simples", body: "O tarot diário funciona melhor com perguntas pequenas, concretas e próximas do momento presente." },
        { heading: "Transforme a carta em ação", body: "Depois de ler a carta, escolha uma pequena ação que aplique o conselho no seu dia real." },
        { heading: "Observe padrões", body: "Com histórico salvo você pode ver cartas repetidas, humores e temas que voltam com o tempo." },
      ],
      faqs: [
        { question: "Posso fazer uma leitura diária todos os dias?", answer: "Sim, se isso ajudar você a refletir. Mantenha a pergunta simples e evite repetir a mesma questão muitas vezes." },
        { question: "Uma carta só é suficiente?", answer: "Para um check-in rápido, sim. Para uma situação complexa, uma tiragem de três cartas costuma dar mais contexto." },
      ],
    },
    "monthly-tarot-report": {
      title: "Relatório mensal de tarot",
      description: "Comece com um check-in mensal grátis e desbloqueie relatórios mais profundos com histórico, cartas repetidas e notas pessoais.",
      eyebrow: "Reflexão mensal",
      h1: "Relatório mensal de tarot",
      intro: "Um relatório mensal transforma leituras soltas em um padrão mais claro: cartas repetidas, temas de amor, sinais profissionais e foco do próximo mês.",
      intent: "Comece com uma leitura mensal grátis. A assinatura serve para histórico salvo, acompanhamentos, tiragens avançadas e relatórios longos.",
      ctaQuestion: "Que tema deve guiar meu próximo mês?",
      sections: [
        { heading: "Comece com um check-in grátis", body: "Faça uma pergunta mensal clara para receber um tema inicial antes de decidir se precisa de uma análise mais profunda." },
        { heading: "O histórico dá profundidade", body: "Um relatório forte nasce de cartas repetidas, perguntas antigas, notas e padrões em amor, carreira e leituras diárias." },
        { heading: "Deixe a assinatura clara", body: "A ferramenta grátis deve ser útil sozinha; a assinatura adiciona profundidade, memória e continuidade." },
      ],
      faqs: [
        { question: "O relatório mensal de tarot é grátis?", answer: "Você pode começar com um check-in mensal grátis. Relatórios longos baseados em histórico são função de assinatura." },
        { question: "O que deve entrar em um relatório mensal?", answer: "Tema do mês, cartas repetidas, sinais de amor e trabalho, conselho prático e uma ação prioritária." },
      ],
    },
    "yes-or-no-tarot": {
      title: "Tarot sim ou não",
      description: "Use o tarot sim ou não para uma decisão rápida com explicação de IA sobre a energia por trás da resposta.",
      eyebrow: "Leitura de decisão",
      h1: "Tarot sim ou não",
      intro: "Uma leitura sim ou não ajuda quando você precisa de um sinal rápido, mas a explicação por trás da resposta é o mais importante.",
      intent: "Ideal para decisões claras: falar, esperar, aceitar, recusar, continuar ou mudar de direção.",
      ctaQuestion: "Devo avançar com esta decisão?",
      sections: [
        { heading: "Faça uma pergunta limpa", body: "A pergunta deve ser específica e ter um prazo para que a resposta se conecte a uma ação real." },
        { heading: "Leia o motivo", body: "A carta pode mostrar impulso, resistência, informação oculta ou necessidade de paciência." },
        { heading: "Não repita demais", body: "Se o resultado incomodar, pergunte o que entender em seguida em vez de tirar outra carta igual." },
      ],
      faqs: [
        { question: "O tarot pode responder sim ou não?", answer: "Pode dar uma direção, mas a explicação e as condições importam mais do que uma palavra isolada." },
        { question: "O que faço depois da resposta?", answer: "Use como reflexão e compare com fatos reais, responsabilidades e riscos concretos." },
      ],
    },
    "career-tarot": {
      title: "Leitura de tarot profissional",
      description: "Pergunte sobre trabalho, dinheiro, direção, mudanças de emprego, projetos criativos ou tempo profissional.",
      eyebrow: "Trabalho e direção",
      h1: "Leitura de tarot profissional",
      intro: "O tarot profissional ajuda a examinar direção, motivação, tempo e padrões invisíveis em uma decisão de trabalho ou dinheiro.",
      intent: "Ideal para mudanças de emprego, entrevistas, projetos, conflitos no trabalho, negócios e direção de longo prazo.",
      ctaQuestion: "O que devo entender sobre meu caminho profissional agora?",
      sections: [
        { heading: "Clareie a decisão", body: "Leituras de carreira funcionam melhor quando estão ligadas a uma decisão concreta: ficar, mudar, negociar ou esperar." },
        { heading: "Separe medo de sinal", body: "As cartas podem ajudar a distinguir uma cautela útil de uma dúvida que só paralisa." },
        { heading: "Use tiragens mais profundas", body: "Uma grande transição precisa olhar obstáculos, recursos, tempo e possíveis resultados." },
      ],
      faqs: [
        { question: "O tarot ajuda em decisões de carreira?", answer: "Pode ajudar você a refletir sobre motivação, risco, tempo e próximos passos." },
        { question: "Que pergunta profissional funciona bem?", answer: "Tente: o que bloqueia meu crescimento? Em que devo focar este mês?" },
      ],
    },
    "tarot-card-meanings": {
      title: "Significados das cartas de tarot",
      description: "Aprenda significados de cartas em pé e invertidas e depois tire uma leitura com interpretação personalizada de IA.",
      eyebrow: "Significados das cartas",
      h1: "Significados das cartas de tarot",
      intro: "Os significados do tarot formam uma linguagem de símbolos. Cada carta muda conforme a pergunta, a posição e se aparece em pé ou invertida.",
      intent: "Use este guia como ponto de partida e deixe uma leitura completa conectar os símbolos à sua situação.",
      ctaQuestion: "Que mensagem estas cartas têm para mim?",
      sections: [
        { heading: "Cartas em pé e invertidas", body: "A carta em pé mostra a energia ativa. A invertida pode indicar atraso, bloqueio, desequilíbrio ou trabalho interno." },
        { heading: "A posição muda o sentido", body: "A mesma carta é lida de forma diferente em passado, presente, obstáculo, conselho ou resultado." },
        { heading: "A tiragem conta uma história", body: "Uma boa leitura conecta as cartas entre si em vez de tratá-las como definições isoladas." },
      ],
      faqs: [
        { question: "Cartas invertidas são ruins?", answer: "Não necessariamente. Podem mostrar energia bloqueada, atraso, ajuste interno ou uma parte privada do processo." },
        { question: "Iniciantes precisam memorizar tudo?", answer: "Os significados ajudam, mas o contexto pesa mais. Comece por palavras-chave e leia a tiragem completa." },
      ],
    },
    "will-my-ex-come-back-tarot": {
      title: "Tarot: meu ex vai voltar?",
      description: "Tire cartas para uma leitura grátis com IA sobre reconciliação, energia do ex, tempo e o que fazer depois.",
      eyebrow: "Pergunta de tarot",
      h1: "Tarot: meu ex vai voltar?",
      intro: "Pergunte se seu ex pode voltar e o que você deve compreender antes de agir. A leitura observa sinais, bloqueios e o passo mais saudável.",
      intent: "Ideal para clareza após término, sinais de reconciliação, tempo emocional e se vale a pena entrar em contato.",
      ctaQuestion: "Meu ex vai voltar e o que devo entender antes de agir?",
      sections: [
        { heading: "Observe o padrão", body: "Uma leitura de reconciliação deve mostrar por que a relação terminou, que energia resta e se ambos poderiam escolher diferente." },
        { heading: "Tempo não é certeza", body: "As cartas podem indicar movimento ou demora, mas sua ação mais saudável importa mais do que ficar esperando." },
        { heading: "Faça só um acompanhamento", body: "Depois da primeira tiragem, pergunte o que você pode fazer agora em vez de repetir a mesma pergunta por ansiedade." },
      ],
      faqs: [
        { question: "O tarot pode prever se meu ex volta?", answer: "Pode explorar sinais, bloqueios e dinâmicas prováveis. Deve guiar suas escolhas, não substituir comunicação direta nem autoestima." },
        { question: "Que cartas sugerem reconciliação?", answer: "O Julgamento, Os Enamorados, Dois de Copas, Seis de Copas e A Temperança podem sugerir reconexão quando o conjunto apoia." },
      ],
    },
    "does-he-love-me-tarot": {
      title: "Tarot: ele me ama?",
      description: "Pergunte grátis ao tarot com IA sobre sentimentos, sinais confusos, comunicação e o próximo passo na conexão.",
      eyebrow: "Pergunta de amor",
      h1: "Tarot: ele me ama?",
      intro: "Tire cartas para olhar sentimentos, coerência entre emoção e comportamento, e o que você precisa para se sentir clara.",
      intent: "Ideal para energia emocional, sinais confusos, comunicação e se a conexão é realmente mútua.",
      ctaQuestion: "Ele me ama e qual é a energia emocional real entre nós?",
      sections: [
        { heading: "Leia sentimentos e comportamento juntos", body: "Uma carta não é prova absoluta. A leitura compara emoção, ação, medo e consistência." },
        { heading: "Observe suas necessidades", body: "As cartas também devem mostrar o que você precisa para sentir segurança, respeito e clareza." },
        { heading: "Não persiga certeza", body: "Se a tiragem mostrar confusão, pergunte que conversa ou limite pode trazer clareza." },
      ],
      faqs: [
        { question: "O tarot pode dizer se alguém me ama?", answer: "Pode revelar dinâmicas emocionais e sentimentos prováveis, mas amor também precisa aparecer em ações consistentes." },
        { question: "E se as cartas forem mistas?", answer: "Muitas vezes refletem comportamento misto. Observe a carta de conselho e o padrão da tiragem inteira." },
      ],
    },
    "is-he-thinking-about-me-tarot": {
      title: "Tarot: ele está pensando em mim?",
      description: "Leitura grátis com IA sobre se ele pensa em você, o que o silêncio significa, sentimentos e o próximo passo saudável.",
      eyebrow: "Pergunta de amor",
      h1: "Tarot: ele está pensando em mim?",
      intro: "Pergunte se ele está pensando em você e que energia real existe por trás do silêncio. A leitura separa atenção privada, medo, evasão e possível ação.",
      intent: "Ideal para silêncio, respostas demoradas, contato zero, sinais mistos e dúvidas sobre se pensamento pode virar ação.",
      ctaQuestion: "Ele está pensando em mim e que energia real existe por trás do silêncio?",
      sections: [
        { heading: "Leia pensamentos junto com comportamento", body: "Uma carta pode sugerir atenção, mas a tiragem completa deve comparar pensamentos, sentimentos, medos e ações possíveis." },
        { heading: "Silêncio não significa uma coisa só", body: "Contato zero pode ser processamento, orgulho, evasão, confusão ou fechamento. A leitura ajuda a separar esperança de sinais reais." },
        { heading: "Volte para sua clareza", body: "A resposta mais útil mostra o que você pode fazer sem esperar indefinidamente por uma mensagem." },
      ],
      faqs: [
        { question: "O tarot pode dizer se ele pensa em mim?", answer: "Pode refletir sinais emocionais e energia mental provável, mas pensamentos importam mais quando se conectam a ações respeitosas." },
        { question: "Que cartas sugerem que ele pensa em mim?", answer: "A Sacerdotisa, Pajem de Copas, Seis de Copas, Os Enamorados e A Lua podem sugerir foco interno quando a tiragem apoia." },
      ],
    },
    "should-i-text-him-tarot": {
      title: "Tarot: devo mandar mensagem?",
      description: "Leitura grátis sim ou não com IA antes de mandar mensagem. Veja timing, intenção, segurança emocional e o próximo passo.",
      eyebrow: "Decisão de contato",
      h1: "Tarot: devo mandar mensagem?",
      intro: "Faça uma pergunta clara antes de enviar a mensagem. A leitura revisa se escrever agora vem de clareza, ansiedade, cuidado ou pressão.",
      intent: "Ideal para decidir se mandar mensagem hoje, esperar, colocar limite ou escolher uma forma mais calma de reabrir contato.",
      ctaQuestion: "Devo mandar mensagem hoje e o que considerar antes de enviar?",
      sections: [
        { heading: "Mensagem depende de timing e intenção", body: "Um sim ou não útil também mostra se a mensagem abre comunicação clara ou reage a partir de ansiedade." },
        { heading: "Veja o custo do contato", body: "A tiragem deve mostrar se escrever ajuda uma conversa saudável ou reinicia um padrão antigo." },
        { heading: "Transforme a resposta em ação", body: "Se inclinar para sim, mande uma mensagem clara. Se inclinar para não ou ainda não, use a pausa para proteger sua paz." },
      ],
      faqs: [
        { question: "O tarot pode responder se devo mandar mensagem?", answer: "Sim, pode dar uma direção rápida e a razão por trás. Use como reflexão, não como pressão para ignorar limites." },
        { question: "Que cartas sugerem esperar antes de mandar mensagem?", answer: "O Enforcado, Quatro de Espadas, Temperança, A Lua ou cartas de comunicação invertidas podem sugerir esperar." },
      ],
    },
    "when-will-i-find-love-tarot": {
      title: "Tarot: quando vou encontrar amor?",
      description: "Leitura grátis com IA sobre encontrar amor, timing, energia de encontros, traços de parceria e o que prepara você.",
      eyebrow: "Tempo do amor",
      h1: "Tarot: quando vou encontrar amor?",
      intro: "Pergunte quando o amor pode chegar e ao que você deve se abrir. A leitura olha timing, disponibilidade, padrões e o próximo movimento.",
      intent: "Ideal para pessoas solteiras, cansaço de encontros, timing de parceria, abertura ao amor e padrões que precisam mudar.",
      ctaQuestion: "Quando vou encontrar amor e ao que devo me abrir agora?",
      sections: [
        { heading: "Timing também é disponibilidade", body: "Uma leitura de tempo não só prevê quando o amor aparece; mostra que energia e escolhas ajudam a reconhecê-lo." },
        { heading: "Veja o padrão antes da pessoa", body: "As cartas podem revelar se expectativas antigas, medo, pessoas indisponíveis ou falta de novos espaços estão bloqueando." },
        { heading: "Transforme a resposta em movimento", body: "Use a leitura para escolher uma ação de encontros ou autoconfiança, não para esperar passivamente." },
      ],
      faqs: [
        { question: "O tarot pode prever quando vou encontrar amor?", answer: "Pode mostrar temas de timing e disponibilidade, mas o mais útil é entender quais decisões tornam a conexão possível." },
        { question: "Que cartas sugerem novo amor?", answer: "Ás de Copas, Os Enamorados, A Estrela, Dois de Copas, A Imperatriz e Roda da Fortuna podem sugerir abertura para novo amor." },
      ],
    },
    "yes-or-no-tarot-love": {
      title: "Tarot do amor sim ou não",
      description: "Receba uma leitura grátis de amor sim ou não com IA para encontros, relacionamento, atração e reconciliação.",
      eyebrow: "Decisão amorosa",
      h1: "Tarot do amor sim ou não",
      intro: "Faça uma pergunta amorosa simples e receba uma resposta com contexto, conselho e a razão emocional por trás do sim, não ou ainda não.",
      intent: "Ideal para perguntas simples de amor quando você também precisa de contexto, conselho e explicação da energia.",
      ctaQuestion: "Dê uma resposta de amor sim ou não e o motivo por trás.",
      sections: [
        { heading: "Sim ou não precisa de contexto", body: "Perguntas de amor raramente são limpas. A explicação mostra por que a energia inclina para sim, não ou ainda não." },
        { heading: "Use uma pergunta clara", body: "Pergunte sobre uma pessoa, uma relação ou uma decisão. Não misture vários resultados em uma só tiragem." },
        { heading: "Deixe o conselho liderar", body: "Até um sim deve mostrar o próximo passo; até um não pode revelar o que protege você." },
      ],
      faqs: [
        { question: "Que cartas significam sim no amor?", answer: "Os Enamorados, Dois de Copas, Ás de Copas, O Sol e Dez de Copas costumam inclinar para sim quando o contexto apoia." },
        { question: "Uma carta invertida pode ser sim?", answer: "Sim, mas normalmente com atraso, condição ou bloqueio interno que precisa de atenção primeiro." },
      ],
    },
    "career-tarot-reading": {
      title: "Leitura de tarot para carreira",
      description: "Leitura grátis com IA para mudança de emprego, entrevistas, negócios, dinheiro e direção profissional.",
      eyebrow: "Pergunta profissional",
      h1: "Leitura de tarot para carreira",
      intro: "Pergunte sobre seu caminho profissional e receba uma leitura centrada em impulso, bloqueios, recursos e próximo movimento prático.",
      intent: "Ideal para mudanças de trabalho, entrevistas, decisões de negócio, conflitos profissionais e onde focar agora.",
      ctaQuestion: "O que devo entender sobre minha carreira neste momento?",
      sections: [
        { heading: "As cartas mostram impulso", body: "Uma leitura de trabalho pode revelar preparo, resistência oculta, tempo e recursos necessários para avançar." },
        { heading: "Separe medo de sinal", body: "Algumas cartas pedem pausa; outras só mostram medo. A tiragem completa ajuda a diferenciar." },
        { heading: "Transforme clareza em ação", body: "Escolha um movimento prático: candidatar-se, preparar-se, negociar, esperar ou mudar de direção." },
      ],
      faqs: [
        { question: "O tarot pode ajudar em decisões de trabalho?", answer: "Sim. Ele é mais forte para clarear motivação, risco, tempo e a próxima ação útil." },
        { question: "Que cartas são boas para carreira?", answer: "O Mago, O Mundo, Ás de Ouros, Três de Ouros e Rei de Ouros costumam apoiar crescimento profissional." },
      ],
    },
    "should-i-quit-my-job-tarot": {
      title: "Tarot: devo pedir demissão?",
      description: "Pergunte antes de sair do emprego. Explore tempo, risco, burnout, dinheiro e o próximo passo mais sábio.",
      eyebrow: "Decisão profissional",
      h1: "Tarot: devo pedir demissão?",
      intro: "Esta leitura ajuda a olhar se você vive uma transição real, um esgotamento temporário ou uma decisão que exige preparação.",
      intent: "Ideal para estresse no trabalho, burnout, ambientes tóxicos, tempo financeiro e decidir se fica, planeja ou sai.",
      ctaQuestion: "Devo pedir demissão e qual é o próximo passo mais sábio?",
      sections: [
        { heading: "Não se apresse com a resposta", body: "A pergunta envolve dinheiro, identidade, estresse e tempo. Leia a carta de conselho com a mesma seriedade da carta de resultado." },
        { heading: "Separe burnout de crescimento", body: "Algumas tiragens mostram que o trabalho acabou. Outras mostram cansaço que pede limites, descanso ou negociação." },
        { heading: "Construa uma ponte prática", body: "Se as cartas apoiam sair, pergunte que preparação, reserva financeira ou conversa deve acontecer antes." },
      ],
      faqs: [
        { question: "O tarot pode decidir se devo pedir demissão?", answer: "Pode clarear padrões e riscos, mas você deve combinar isso com planejamento financeiro e opções reais." },
        { question: "Que cartas sugerem sair de um trabalho?", answer: "A Torre, A Morte, Oito de Copas, Dez de Paus e O Mundo podem sugerir transição quando a tiragem confirma." },
      ],
    },
    "what-does-he-think-of-me-tarot": {
      title: "Tarot: o que ele pensa de mim?",
      description: "Leitura grátis com IA sobre o que ele pensa de você, como vê a conexão e se pensamentos podem virar ação.",
      eyebrow: "Pergunta de amor",
      h1: "Tarot: o que ele pensa de mim?",
      intro: "Pergunte o que ele pensa de você e o que entender sobre a atitude dele. A leitura separa percepção, atração, medo e comportamento real.",
      intent: "Ideal para sinais mistos, atração incerta, silêncio, encontros ambíguos e como alguém pode perceber você.",
      ctaQuestion: "O que ele pensa de mim e o que devo entender sobre a atitude dele?",
      sections: [
        { heading: "Pensamentos não são toda a história", body: "Uma leitura útil separa pensamentos privados, comportamento visível, atração, medo e se isso vira ação respeitosa." },
        { heading: "Leia percepção e padrão", body: "A tiragem pode mostrar como ele vê você agora, o que evita e o que essa conexão pede que você perceba." },
        { heading: "Traga a resposta de volta para você", body: "O próximo passo não é só saber a opinião dele, mas que limite, conversa ou pausa devolve clareza." },
      ],
      faqs: [
        { question: "O tarot pode mostrar o que ele pensa de mim?", answer: "Pode refletir percepção provável, atenção e tom emocional, mas importa mais quando se conecta a comportamento e comunicação." },
        { question: "Que cartas sugerem que ele me vê bem?", answer: "Os Enamorados, A Estrela, Rainha de Copas, Pajem de Copas e Seis de Copas podem mostrar calor se a tiragem apoiar." },
      ],
    },
    "will-he-contact-me-tarot": {
      title: "Tarot: ele vai entrar em contato?",
      description: "Leitura grátis com IA sobre se ele vai falar com você, o que pode atrasar e o que fazer enquanto espera.",
      eyebrow: "Contato e silêncio",
      h1: "Tarot: ele vai entrar em contato?",
      intro: "Pergunte se haverá contato e o que fazer enquanto espera. A leitura olha desejo, medo, orgulho, timing e bloqueios de comunicação.",
      intent: "Ideal para contato zero, respostas demoradas, silêncio depois de término, sinais mistos e se convém esperar ou seguir.",
      ctaQuestion: "Ele vai entrar em contato e o que devo fazer enquanto espero?",
      sections: [
        { heading: "Contato depende de mais que sentimento", body: "As cartas devem mostrar desejo, medo, timing, orgulho, evasão e se a comunicação pode virar ação real." },
        { heading: "Esperar precisa de limite", body: "Uma leitura de contato serve mais quando também mostra o que protege sua paz se a mensagem não chegar logo." },
        { heading: "Decida sua resposta antes da mensagem", body: "Se contato parece provável, pergunte que limite ou tom manteria uma conversa saudável." },
      ],
      faqs: [
        { question: "O tarot pode prever se ele vai mandar mensagem?", answer: "Pode mostrar energia de comunicação e bloqueios possíveis, mas contato real depende de decisões e circunstâncias." },
        { question: "Que cartas sugerem contato?", answer: "Oito de Paus, Pajem de Copas, Cavaleiro de Espadas, O Julgamento e O Mago podem sugerir movimento se a tiragem apoiar." },
      ],
    },
    "is-this-relationship-over-tarot": {
      title: "Tarot: este relacionamento acabou?",
      description: "Leitura grátis com IA para explorar se um relacionamento está acabando, o que ainda pode ser reparado e o próximo passo saudável.",
      eyebrow: "Relacionamento e fim",
      h1: "Tarot: este relacionamento acabou?",
      intro: "Pergunte se a relação acabou ou se ainda existe energia de reparo. A leitura olha distância, confiança, conflito e limites.",
      intent: "Ideal para dúvidas de relacionamento, sinais de término, distância emocional, conflito repetido e se reparar é realista.",
      ctaQuestion: "Este relacionamento acabou e qual é o próximo passo mais saudável?",
      sections: [
        { heading: "Finais podem ser emocionais ou práticos", body: "Uma relação pode parecer acabada porque confiança, esforço ou comunicação mudaram. A tiragem esclarece qual camada está fechando." },
        { heading: "Procure condições de reparo", body: "Se as cartas mostram caminho, também devem nomear que comportamento, honestidade, timing e limites teriam que mudar." },
        { heading: "Deixe o conselho liderar", body: "Tanto para fim quanto para reparo, a mensagem útil protege sua autoestima e estabilidade emocional." },
      ],
      faqs: [
        { question: "O tarot pode dizer se uma relação acabou?", answer: "Pode mostrar o padrão atual, o que está ruindo e se ainda há energia de reparo. Deve guiar reflexão, não forçar uma ruptura." },
        { question: "Que cartas sugerem fim de relacionamento?", answer: "A Morte, A Torre, Dez de Espadas, Oito de Copas e O Mundo podem sugerir fechamento quando a tiragem confirma." },
      ],
    },
    "will-i-get-the-job-tarot": {
      title: "Tarot: vou conseguir o emprego?",
      description: "Leitura grátis com IA sobre oferta, entrevista, obstáculos ocultos e como fortalecer suas chances.",
      eyebrow: "Trabalho e oferta",
      h1: "Tarot: vou conseguir o emprego?",
      intro: "Pergunte sobre entrevista ou oferta pendente. A leitura revisa impulso, encaixe, obstáculos e o próximo passo prático.",
      intent: "Ideal para entrevistas, ofertas pendentes, candidaturas, promoções e que ação melhora o resultado.",
      ctaQuestion: "Vou conseguir o emprego e o que posso fazer para melhorar minhas chances?",
      sections: [
        { heading: "Resultado e preparação andam juntos", body: "Uma leitura profissional não só pergunta se a oferta chega; mostra forças, pontos fracos, timing e o que preparar." },
        { heading: "Leia obstáculos com honestidade", body: "As cartas podem apontar concorrência, informação faltante, comunicação confusa ou um encaixe que precisa de atenção." },
        { heading: "Transforme a resposta em acompanhamento", body: "Escolha uma ação concreta: escrever, praticar, esclarecer salário, melhorar materiais ou ampliar opções." },
      ],
      faqs: [
        { question: "O tarot pode prever se vou conseguir o emprego?", answer: "Pode mostrar impulso, encaixe, obstáculos e direção provável, mas preparação e decisões reais continuam importantes." },
        { question: "Que cartas sugerem conseguir emprego?", answer: "O Mago, O Carro, Ás de Ouros, Três de Ouros e Seis de Paus podem apoiar sucesso se a tiragem concorda." },
      ],
    },
    "should-i-take-this-job-tarot": {
      title: "Tarot: devo aceitar este trabalho?",
      description: "Leitura grátis com IA para comparar aceitar uma oferta com dizer não, esperar ou negociar condições melhores.",
      eyebrow: "Decisão profissional",
      h1: "Tarot: devo aceitar este trabalho?",
      intro: "Compare a oferta com suas necessidades reais. A leitura olha dinheiro, cultura, crescimento, estabilidade, risco e negociação.",
      intent: "Ideal para avaliar nova oferta, salário, cultura, crescimento de longo prazo, risco e se convém negociar.",
      ctaQuestion: "Devo aceitar este trabalho e o que devo comparar antes de decidir?",
      sections: [
        { heading: "Compare os custos reais", body: "Uma oferta pode parecer boa em uma área e custar em outra. A leitura pesa crescimento, dinheiro, cultura, estabilidade e energia." },
        { heading: "Use a tiragem como mapa de decisão", body: "Uma tiragem de duas opções compara aceitar com esperar, negociar ou escolher outra rota." },
        { heading: "Não ignore o prático", body: "O tarot esclarece valores e riscos, mas a decisão final deve revisar contrato, benefícios, carga, deslocamento e dinheiro." },
      ],
      faqs: [
        { question: "O tarot ajuda a decidir se aceito um trabalho?", answer: "Sim. Clareia custos, motivos, risco e potencial de crescimento, especialmente quando combinado com dados reais." },
        { question: "Que cartas alertam para não aceitar?", answer: "O Diabo, Cinco de Ouros, Sete de Espadas, Dez de Paus ou A Lua podem alertar pressão, mau encaixe ou termos ocultos." },
      ],
    },
    "will-i-be-successful-tarot": {
      title: "Tarot: vou ter sucesso?",
      description: "Leitura grátis com IA sobre sucesso, obstáculos, timing, crescimento pessoal e a próxima ação que melhora suas chances.",
      eyebrow: "Meta e sucesso",
      h1: "Tarot: vou ter sucesso?",
      intro: "Pergunte sobre uma meta, projeto ou mudança importante. A leitura define que tipo de sucesso você busca e que ação aproxima isso.",
      intent: "Ideal para metas, projetos criativos, carreira, provas, lançamentos e o que o sucesso exige agora.",
      ctaQuestion: "Vou ter sucesso e em que devo focar agora?",
      sections: [
        { heading: "Sucesso tem forma", body: "Uma leitura útil define se sucesso significa reconhecimento, estabilidade, conclusão, crescimento, dinheiro ou confiança." },
        { heading: "Procure a alavanca controlável", body: "As cartas devem mostrar o obstáculo, a força disponível e a ação que aumenta a probabilidade." },
        { heading: "Use o timing como guia", body: "Se aparece progresso lento, pergunte que constância, apoio ou habilidade vai mover a meta." },
      ],
      faqs: [
        { question: "O tarot pode dizer se vou ter sucesso?", answer: "Pode mostrar impulso, bloqueios, forças e direção provável. É mais útil quando transforma a resposta em ação." },
        { question: "Que cartas sugerem sucesso?", answer: "O Sol, O Mundo, O Mago, Seis de Paus, Ás de Ouros e O Carro costumam apoiar sucesso quando a tiragem é coerente." },
      ],
    },
  },
}

const questionSeoEnhancements: Record<string, SeoContentEnhancement> = {
  "will-my-ex-come-back-tarot": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask this when you are trying to separate genuine reconnection signals from loneliness, hope, or the urge to check their social media again.",
      },
      {
        heading: "What the spread should clarify",
        body: "The most useful cards show what still connects you, what ended for a reason, what has changed, and whether contact would be healing or destabilizing.",
      },
      {
        heading: "How to act on the answer",
        body: "If the reading leans toward return, still look for accountability and timing. If it leans no or not yet, use the answer to protect your peace instead of waiting in place.",
      },
      {
        heading: "A better follow-up",
        body: "After the first answer, ask: what boundary or conversation would help me move forward with self-respect?",
      },
    ],
    faqs: [
      {
        question: "Is this ex tarot reading free?",
        answer: "Yes. You can start this question as a free AI tarot reading. Membership is only needed for deeper follow-ups, saved history, and longer reports.",
      },
      {
        question: "What if the answer is not yet?",
        answer: "Not yet usually means timing, behavior, or emotional readiness is still unresolved. Ask what needs to change before contact would be healthy.",
      },
      {
        question: "Should I ask again tomorrow?",
        answer: "Avoid repeating the same question for reassurance. Wait until something changes, or ask a different question about your next step.",
      },
      {
        question: "What spread is best for an ex question?",
        answer: "A breakup recovery or relationship spread is stronger than one card because it can show cause, remaining energy, advice, and likely direction.",
      },
    ],
  },
  "does-he-love-me-tarot": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask this when someone's words, attention, distance, or mixed signals leave you unsure whether affection is mutual and consistent.",
      },
      {
        heading: "What the spread should clarify",
        body: "A useful love reading separates attraction, emotional availability, fear, behavior, and your own need for safety and clarity.",
      },
      {
        heading: "How to act on the answer",
        body: "If the cards show love without action, look for what blocks expression. If they show confusion, prioritize a conversation or boundary over guessing.",
      },
      {
        heading: "A better follow-up",
        body: "After the first answer, ask: what would help me know whether this connection is emotionally safe for me?",
      },
    ],
    faqs: [
      {
        question: "Is this love tarot reading free?",
        answer: "Yes. The first reading can be started for free. Deep follow-up questions and saved reading history are membership features.",
      },
      {
        question: "Can tarot read his true feelings?",
        answer: "Tarot can reflect emotional dynamics and likely signals, but real love also needs consistent behavior, communication, and respect.",
      },
      {
        question: "What cards suggest love is mutual?",
        answer: "The Lovers, Two of Cups, Ace of Cups, Ten of Cups, and The Sun often support mutual affection when the surrounding cards agree.",
      },
      {
        question: "What if I get mixed cards?",
        answer: "Mixed cards often mirror mixed behavior. Read the advice card carefully and ask what clarity or boundary is needed next.",
      },
    ],
  },
  "yes-or-no-tarot-love": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Use this page when you need a quick love signal about texting, dating, waiting, reconnecting, or choosing whether to keep investing energy.",
      },
      {
        heading: "What the spread should clarify",
        body: "A good yes or no love reading should explain whether the energy is yes, no, or not yet, and why the answer is leaning that way.",
      },
      {
        heading: "How to act on the answer",
        body: "Treat yes as permission to act thoughtfully, no as protection, and not yet as a request for patience, timing, or more information.",
      },
      {
        heading: "A better follow-up",
        body: "After the yes or no answer, ask: what is the healthiest next action for me in this connection?",
      },
    ],
    faqs: [
      {
        question: "Is yes or no love tarot free?",
        answer: "Yes. You can start this yes or no love reading for free and use membership later for deeper follow-ups or saved history.",
      },
      {
        question: "Can love tarot answer with maybe?",
        answer: "Yes. In relationship questions, maybe or not yet can be more honest than a forced yes or no because timing and readiness matter.",
      },
      {
        question: "Should I use one card for yes or no love?",
        answer: "One card can work for a quick signal, but a small spread gives better context about feelings, blocks, advice, and timing.",
      },
      {
        question: "What if the answer is no?",
        answer: "Read the reason before reacting. A no can point to protection, poor timing, mixed intentions, or a better direction for your energy.",
      },
    ],
  },
  "career-tarot-reading": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask a career tarot question when you are weighing a job change, interview, project, negotiation, business idea, or professional direction.",
      },
      {
        heading: "What the spread should clarify",
        body: "The cards should separate motivation from fear, show where momentum exists, and reveal the resource or skill that needs attention next.",
      },
      {
        heading: "How to act on the answer",
        body: "Turn the reading into one concrete move: update your resume, prepare for a conversation, negotiate, wait, apply, or test a smaller step first.",
      },
      {
        heading: "A better follow-up",
        body: "After the first career reading, ask: what practical action would create the most progress in the next two weeks?",
      },
    ],
    faqs: [
      {
        question: "Is this career tarot reading free?",
        answer: "Yes. You can begin with a free AI career tarot reading. Membership is for deeper follow-ups, saved history, advanced spreads, and reports.",
      },
      {
        question: "Can tarot predict a job offer?",
        answer: "Tarot can show momentum, fit, obstacles, and likely dynamics, but job outcomes still depend on preparation, market conditions, and real decisions.",
      },
      {
        question: "What spread is best for career questions?",
        answer: "A job opportunity spread works well because it can examine readiness, obstacles, resources, timing, and the next practical move.",
      },
      {
        question: "Should I use tarot for money decisions?",
        answer: "Use tarot for reflection, not as financial advice. Pair the reading with budgets, timelines, contracts, and realistic alternatives.",
      },
    ],
  },
  "should-i-quit-my-job-tarot": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask this when burnout, conflict, boredom, money pressure, or a new opportunity makes staying feel difficult but leaving feels risky.",
      },
      {
        heading: "What the spread should clarify",
        body: "The reading should distinguish temporary exhaustion from a completed cycle, and show whether planning, boundaries, negotiation, or departure is wiser.",
      },
      {
        heading: "How to act on the answer",
        body: "Do not quit from one card alone. Use the reading to decide what real-world preparation is needed before you stay, speak up, or leave.",
      },
      {
        heading: "A better follow-up",
        body: "After the first answer, ask: what needs to be prepared so my next career move is stable and self-respecting?",
      },
    ],
    faqs: [
      {
        question: "Is this quit my job tarot reading free?",
        answer: "Yes. You can start this job decision reading for free. Membership adds deeper follow-ups, saved history, advanced spreads, and reports.",
      },
      {
        question: "Can tarot tell me to quit immediately?",
        answer: "Tarot can show strong transition energy, but you should still check money, contracts, health, references, and realistic options before acting.",
      },
      {
        question: "What if the cards show burnout?",
        answer: "Burnout cards may point to rest, boundaries, support, or a planned exit. The advice card matters more than a dramatic outcome card.",
      },
      {
        question: "What spread is best before quitting?",
        answer: "Use a career or job opportunity spread that checks current pressure, hidden risks, available resources, timing, and the next safest step.",
      },
    ],
  },
  "is-he-thinking-about-me-tarot": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask this when silence, delayed replies, no contact, or a sudden change in attention makes you wonder whether the connection is still alive.",
      },
      {
        heading: "What the spread should clarify",
        body: "The cards should separate mental attention, emotional attachment, fear, avoidance, and likely action instead of turning one sign into proof.",
      },
      {
        heading: "How to act on the answer",
        body: "If the reading shows thought without action, do not wait in place. Let the advice card show whether to pause, ask directly, or refocus on yourself.",
      },
      {
        heading: "A better follow-up",
        body: "After the first answer, ask: what would help me feel clear even if he does not message first?",
      },
    ],
    faqs: [
      {
        question: "Is this thinking about me tarot reading free?",
        answer: "Yes. You can start this question as a free AI tarot reading. Membership is for deeper follow-ups, saved history, advanced spreads, and reports.",
      },
      {
        question: "Does thinking about me mean he will contact me?",
        answer: "Not always. A reading can show mental energy without action, so look for communication, courage, and consistency cards in the full spread.",
      },
      {
        question: "What if the cards show he misses me but stays silent?",
        answer: "That often points to pride, fear, unresolved conflict, or emotional avoidance. The advice card should show whether contact would help or hurt.",
      },
      {
        question: "What spread is best for this question?",
        answer: "A thoughts and attitude spread works well because it compares impression, thoughts, attitude, concerns, and possible action.",
      },
    ],
  },
  "should-i-text-him-tarot": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask this before sending a message you might regret, especially after silence, conflict, a breakup, or mixed signals.",
      },
      {
        heading: "What the spread should clarify",
        body: "The reading should show whether texting now supports clear communication or comes from anxiety, pressure, loneliness, or unfinished attachment.",
      },
      {
        heading: "How to act on the answer",
        body: "If the answer leans yes, keep the message simple and honest. If it leans no or not yet, use the pause to protect dignity and timing.",
      },
      {
        heading: "A better follow-up",
        body: "After the answer, ask: what message, boundary, or silence would respect both my feelings and the situation?",
      },
    ],
    faqs: [
      {
        question: "Is this should I text him tarot reading free?",
        answer: "Yes. You can start the yes-or-no reading for free. Membership is only for deeper follow-ups, saved history, and advanced spreads.",
      },
      {
        question: "Can tarot tell me the best time to text?",
        answer: "Tarot can show readiness, pressure, and timing themes, but you should also consider real context, boundaries, and whether the message is necessary.",
      },
      {
        question: "What if the answer is not yet?",
        answer: "Not yet usually means the timing, intention, or emotional state needs to settle first. Wait until the message can be clear and grounded.",
      },
      {
        question: "Should I ask about the exact wording?",
        answer: "A useful follow-up is: what tone would create the healthiest communication? Then keep the actual message brief and respectful.",
      },
    ],
  },
  "when-will-i-find-love-tarot": {
    sections: [
      {
        heading: "When this question is useful",
        body: "Ask this when you feel ready for love, tired of dating, or unsure whether the next relationship needs a different pattern from the last one.",
      },
      {
        heading: "What the spread should clarify",
        body: "A love timing spread should show readiness, blocks, where connection may appear, what traits matter, and what action opens the path.",
      },
      {
        heading: "How to act on the answer",
        body: "Use the timing as a theme, not a countdown. The best reading gives you one way to become more available to the love you want.",
      },
      {
        heading: "A better follow-up",
        body: "After the first reading, ask: what pattern should I release so healthier love can meet me?",
      },
    ],
    faqs: [
      {
        question: "Is this when will I find love tarot reading free?",
        answer: "Yes. You can start this love timing reading for free. Membership is for deeper follow-ups, saved history, advanced spreads, and reports.",
      },
      {
        question: "Can tarot give an exact date for love?",
        answer: "Tarot is better at timing themes than exact dates. It can show season, readiness, delay, or the kind of action that changes timing.",
      },
      {
        question: "What spread is best for finding love?",
        answer: "A love connection spread works well because it looks at dating energy, soulmate traits, timing, and advice together.",
      },
      {
        question: "What if the cards show a delay?",
        answer: "A delay can point to healing, old expectations, limited social openings, or choosing unavailable people. The advice card shows what can shift.",
      },
    ],
  },
}

const regionalQuestionSeoEnhancements: Record<RegionalLocale, Record<string, SeoContentEnhancement>> = {
  es: {
    "will-my-ex-come-back-tarot": {
      sections: [
        {
          heading: "Cuándo usar esta pregunta",
          body: "Úsala cuando quieras separar señales reales de reconciliación de la soledad, la esperanza o el impulso de revisar otra vez sus redes.",
        },
        {
          heading: "Qué debe aclarar la tirada",
          body: "Las cartas más útiles muestran qué vínculo sigue vivo, qué terminó por una razón, qué cambió y si contactar sanaría o desestabilizaría.",
        },
        {
          heading: "Cómo actuar con la respuesta",
          body: "Si la lectura inclina al regreso, busca responsabilidad y buen momento. Si inclina a no o todavía no, protege tu paz en vez de quedarte esperando.",
        },
        {
          heading: "Mejor pregunta de seguimiento",
          body: "Después de la primera respuesta, pregunta: ¿qué límite o conversación me ayuda a avanzar con amor propio?",
        },
      ],
      faqs: [
        {
          question: "¿Esta lectura sobre mi ex es gratis?",
          answer: "Sí. Puedes empezar esta pregunta como una lectura gratis con IA. La membresía queda para seguimientos profundos, historial guardado e informes largos.",
        },
        {
          question: "¿Qué significa si la respuesta es todavía no?",
          answer: "Todavía no suele indicar que el tiempo, la conducta o la disponibilidad emocional siguen sin resolverse. Pregunta qué debe cambiar antes de contactar.",
        },
        {
          question: "¿Debo preguntar lo mismo mañana?",
          answer: "Evita repetir la misma pregunta por ansiedad. Espera a que algo cambie o pregunta por tu próximo paso.",
        },
        {
          question: "¿Qué tirada conviene para una pregunta sobre un ex?",
          answer: "Una tirada de recuperación tras ruptura es mejor que una sola carta porque puede mostrar causa, energía restante, consejo y dirección probable.",
        },
      ],
    },
    "does-he-love-me-tarot": {
      sections: [
        {
          heading: "Cuándo usar esta pregunta",
          body: "Úsala cuando sus palabras, atención, distancia o señales mixtas te dejan sin saber si el afecto es mutuo y consistente.",
        },
        {
          heading: "Qué debe aclarar la tirada",
          body: "Una buena lectura separa atracción, disponibilidad emocional, miedo, conducta y tu propia necesidad de seguridad y claridad.",
        },
        {
          heading: "Cómo actuar con la respuesta",
          body: "Si las cartas muestran amor sin acción, mira qué bloquea la expresión. Si muestran confusión, prioriza una conversación o un límite.",
        },
        {
          heading: "Mejor pregunta de seguimiento",
          body: "Después de la primera respuesta, pregunta: ¿qué me ayudaría a saber si esta conexión es emocionalmente segura para mí?",
        },
      ],
      faqs: [
        {
          question: "¿Esta lectura de amor es gratis?",
          answer: "Sí. La primera lectura puede empezar gratis. Las preguntas profundas de seguimiento y el historial guardado son funciones de membresía.",
        },
        {
          question: "¿El tarot puede leer sus sentimientos reales?",
          answer: "El tarot puede reflejar dinámicas emocionales y señales probables, pero el amor real también necesita conducta consistente, comunicación y respeto.",
        },
        {
          question: "¿Qué cartas sugieren amor mutuo?",
          answer: "Los Enamorados, Dos de Copas, As de Copas, Diez de Copas y El Sol suelen apoyar afecto mutuo cuando las cartas cercanas coinciden.",
        },
        {
          question: "¿Qué pasa si las cartas salen mixtas?",
          answer: "Las cartas mixtas suelen reflejar conducta mixta. Lee con cuidado la carta de consejo y pregunta qué claridad o límite necesitas.",
        },
      ],
    },
    "yes-or-no-tarot-love": {
      sections: [
        {
          heading: "Cuándo usar esta pregunta",
          body: "Usa esta página cuando necesites una señal rápida sobre escribir, salir con alguien, esperar, reconectar o seguir invirtiendo energía.",
        },
        {
          heading: "Qué debe aclarar la tirada",
          body: "Una buena lectura de amor sí o no explica si la energía inclina a sí, no o todavía no, y por qué.",
        },
        {
          heading: "Cómo actuar con la respuesta",
          body: "Toma el sí como permiso para actuar con cuidado, el no como protección y el todavía no como petición de paciencia o más información.",
        },
        {
          heading: "Mejor pregunta de seguimiento",
          body: "Después del sí o no, pregunta: ¿cuál es la acción más sana para mí en esta conexión?",
        },
      ],
      faqs: [
        {
          question: "¿El tarot del amor sí o no es gratis?",
          answer: "Sí. Puedes empezar esta lectura gratis y usar la membresía después para seguimientos más profundos o historial guardado.",
        },
        {
          question: "¿El tarot de amor puede responder tal vez?",
          answer: "Sí. En preguntas de relación, tal vez o todavía no puede ser más honesto que forzar un sí o no.",
        },
        {
          question: "¿Una carta basta para amor sí o no?",
          answer: "Una carta sirve como señal rápida, pero una tirada pequeña da mejor contexto sobre sentimientos, bloqueos, consejo y tiempo.",
        },
        {
          question: "¿Qué hago si la respuesta es no?",
          answer: "Lee la razón antes de reaccionar. Un no puede señalar protección, mal momento, intenciones mezcladas o una dirección mejor para tu energía.",
        },
      ],
    },
    "career-tarot-reading": {
      sections: [
        {
          heading: "Cuándo usar esta pregunta",
          body: "Pregunta al tarot profesional cuando estás evaluando cambio de empleo, entrevista, proyecto, negociación, negocio o dirección laboral.",
        },
        {
          heading: "Qué debe aclarar la tirada",
          body: "Las cartas deben separar motivación de miedo, mostrar dónde hay impulso y revelar qué recurso o habilidad necesita atención.",
        },
        {
          heading: "Cómo actuar con la respuesta",
          body: "Convierte la lectura en un paso concreto: actualizar tu CV, preparar una conversación, negociar, esperar, postular o probar un paso pequeño.",
        },
        {
          heading: "Mejor pregunta de seguimiento",
          body: "Después de la lectura profesional, pregunta: ¿qué acción práctica crearía más progreso en las próximas dos semanas?",
        },
      ],
      faqs: [
        {
          question: "¿Esta lectura de tarot profesional es gratis?",
          answer: "Sí. Puedes empezar con una lectura gratis con IA. La membresía es para seguimientos profundos, historial, tiradas avanzadas e informes.",
        },
        {
          question: "¿El tarot puede predecir una oferta de trabajo?",
          answer: "Puede mostrar impulso, encaje, obstáculos y dinámicas probables, pero el resultado depende también de preparación, mercado y decisiones reales.",
        },
        {
          question: "¿Qué tirada sirve para carrera?",
          answer: "Una tirada de oportunidad laboral funciona bien porque examina preparación, obstáculos, recursos, tiempo y el próximo movimiento práctico.",
        },
        {
          question: "¿Puedo usar tarot para decisiones de dinero?",
          answer: "Úsalo para reflexionar, no como consejo financiero. Combina la lectura con presupuesto, plazos, contratos y alternativas realistas.",
        },
      ],
    },
    "should-i-quit-my-job-tarot": {
      sections: [
        {
          heading: "Cuándo usar esta pregunta",
          body: "Úsala cuando burnout, conflicto, aburrimiento, presión económica o una nueva oportunidad hacen difícil quedarte pero riesgoso irte.",
        },
        {
          heading: "Qué debe aclarar la tirada",
          body: "La lectura debe distinguir cansancio temporal de ciclo terminado, y mostrar si conviene planear, poner límites, negociar o salir.",
        },
        {
          heading: "Cómo actuar con la respuesta",
          body: "No renuncies por una sola carta. Usa la lectura para decidir qué preparación real necesitas antes de quedarte, hablar o irte.",
        },
        {
          heading: "Mejor pregunta de seguimiento",
          body: "Después de la respuesta, pregunta: ¿qué debo preparar para que mi próximo paso profesional sea estable y respetuoso conmigo?",
        },
      ],
      faqs: [
        {
          question: "¿Esta lectura sobre renunciar es gratis?",
          answer: "Sí. Puedes empezar esta lectura de decisión laboral gratis. La membresía añade seguimientos profundos, historial, tiradas avanzadas e informes.",
        },
        {
          question: "¿El tarot puede decirme que renuncie de inmediato?",
          answer: "Puede mostrar energía fuerte de transición, pero antes conviene revisar dinero, contratos, salud, referencias y opciones realistas.",
        },
        {
          question: "¿Qué pasa si las cartas muestran burnout?",
          answer: "Las cartas de burnout pueden pedir descanso, límites, apoyo o una salida planificada. La carta de consejo importa más que una carta dramática.",
        },
        {
          question: "¿Qué tirada sirve antes de renunciar?",
          answer: "Usa una tirada profesional que revise presión actual, riesgos ocultos, recursos disponibles, tiempo y el siguiente paso más seguro.",
        },
      ],
    },
  },
  "pt-br": {
    "will-my-ex-come-back-tarot": {
      sections: [
        {
          heading: "Quando usar esta pergunta",
          body: "Use quando quiser separar sinais reais de reconciliação de solidão, esperança ou vontade de olhar as redes da pessoa de novo.",
        },
        {
          heading: "O que a tiragem deve esclarecer",
          body: "As cartas mais úteis mostram o que ainda conecta vocês, o que terminou por um motivo, o que mudou e se o contato curaria ou desestabilizaria.",
        },
        {
          heading: "Como agir com a resposta",
          body: "Se a leitura inclinar para retorno, procure responsabilidade e bom momento. Se inclinar para não ou ainda não, proteja sua paz em vez de esperar parada.",
        },
        {
          heading: "Melhor pergunta de acompanhamento",
          body: "Depois da primeira resposta, pergunte: que limite ou conversa me ajuda a seguir em frente com amor-próprio?",
        },
      ],
      faqs: [
        {
          question: "Esta leitura sobre meu ex é grátis?",
          answer: "Sim. Você pode começar esta pergunta como leitura grátis com IA. A assinatura fica para acompanhamentos profundos, histórico salvo e relatórios longos.",
        },
        {
          question: "O que significa se a resposta for ainda não?",
          answer: "Ainda não costuma indicar que tempo, comportamento ou disponibilidade emocional seguem sem resolução. Pergunte o que precisa mudar antes do contato.",
        },
        {
          question: "Devo perguntar a mesma coisa amanhã?",
          answer: "Evite repetir a mesma pergunta por ansiedade. Espere algo mudar ou pergunte sobre seu próximo passo.",
        },
        {
          question: "Que tiragem combina com pergunta sobre ex?",
          answer: "Uma tiragem de recuperação pós-término é melhor que uma carta só porque mostra causa, energia restante, conselho e direção provável.",
        },
      ],
    },
    "does-he-love-me-tarot": {
      sections: [
        {
          heading: "Quando usar esta pergunta",
          body: "Use quando palavras, atenção, distância ou sinais confusos deixam você sem saber se o afeto é mútuo e consistente.",
        },
        {
          heading: "O que a tiragem deve esclarecer",
          body: "Uma boa leitura separa atração, disponibilidade emocional, medo, comportamento e sua própria necessidade de segurança e clareza.",
        },
        {
          heading: "Como agir com a resposta",
          body: "Se as cartas mostram amor sem ação, veja o que bloqueia a expressão. Se mostram confusão, priorize uma conversa ou limite.",
        },
        {
          heading: "Melhor pergunta de acompanhamento",
          body: "Depois da primeira resposta, pergunte: o que me ajudaria a saber se esta conexão é emocionalmente segura para mim?",
        },
      ],
      faqs: [
        {
          question: "Esta leitura de amor é grátis?",
          answer: "Sim. A primeira leitura pode começar grátis. Perguntas profundas de acompanhamento e histórico salvo são funções de assinatura.",
        },
        {
          question: "O tarot pode ler os sentimentos reais dele?",
          answer: "O tarot pode refletir dinâmicas emocionais e sinais prováveis, mas amor real também precisa de comportamento consistente, comunicação e respeito.",
        },
        {
          question: "Que cartas sugerem amor mútuo?",
          answer: "Os Enamorados, Dois de Copas, Ás de Copas, Dez de Copas e O Sol costumam apoiar afeto mútuo quando as cartas ao redor concordam.",
        },
        {
          question: "E se as cartas forem misturadas?",
          answer: "Cartas misturadas costumam refletir comportamento misto. Leia a carta de conselho com cuidado e pergunte que clareza ou limite é necessário.",
        },
      ],
    },
    "yes-or-no-tarot-love": {
      sections: [
        {
          heading: "Quando usar esta pergunta",
          body: "Use esta página quando precisar de um sinal rápido sobre mandar mensagem, sair com alguém, esperar, reconectar ou continuar investindo energia.",
        },
        {
          heading: "O que a tiragem deve esclarecer",
          body: "Uma boa leitura de amor sim ou não explica se a energia inclina para sim, não ou ainda não, e por quê.",
        },
        {
          heading: "Como agir com a resposta",
          body: "Tome o sim como permissão para agir com cuidado, o não como proteção e o ainda não como pedido de paciência ou mais informação.",
        },
        {
          heading: "Melhor pergunta de acompanhamento",
          body: "Depois do sim ou não, pergunte: qual é a ação mais saudável para mim nesta conexão?",
        },
      ],
      faqs: [
        {
          question: "O tarot do amor sim ou não é grátis?",
          answer: "Sim. Você pode começar esta leitura grátis e usar a assinatura depois para acompanhamentos mais profundos ou histórico salvo.",
        },
        {
          question: "O tarot de amor pode responder talvez?",
          answer: "Sim. Em perguntas de relacionamento, talvez ou ainda não pode ser mais honesto do que forçar um sim ou não.",
        },
        {
          question: "Uma carta basta para amor sim ou não?",
          answer: "Uma carta serve como sinal rápido, mas uma tiragem pequena dá melhor contexto sobre sentimentos, bloqueios, conselho e tempo.",
        },
        {
          question: "O que faço se a resposta for não?",
          answer: "Leia o motivo antes de reagir. Um não pode indicar proteção, mau momento, intenções misturadas ou uma direção melhor para sua energia.",
        },
      ],
    },
    "career-tarot-reading": {
      sections: [
        {
          heading: "Quando usar esta pergunta",
          body: "Pergunte ao tarot profissional quando estiver avaliando troca de emprego, entrevista, projeto, negociação, negócio ou direção de carreira.",
        },
        {
          heading: "O que a tiragem deve esclarecer",
          body: "As cartas devem separar motivação de medo, mostrar onde há impulso e revelar que recurso ou habilidade precisa de atenção.",
        },
        {
          heading: "Como agir com a resposta",
          body: "Transforme a leitura em um passo concreto: atualizar currículo, preparar uma conversa, negociar, esperar, candidatar-se ou testar um passo menor.",
        },
        {
          heading: "Melhor pergunta de acompanhamento",
          body: "Depois da leitura profissional, pergunte: que ação prática criaria mais progresso nas próximas duas semanas?",
        },
      ],
      faqs: [
        {
          question: "Esta leitura de tarot profissional é grátis?",
          answer: "Sim. Você pode começar com uma leitura grátis com IA. A assinatura serve para acompanhamentos profundos, histórico, tiragens avançadas e relatórios.",
        },
        {
          question: "O tarot pode prever uma proposta de emprego?",
          answer: "Pode mostrar impulso, encaixe, obstáculos e dinâmicas prováveis, mas o resultado também depende de preparação, mercado e decisões reais.",
        },
        {
          question: "Que tiragem serve para carreira?",
          answer: "Uma tiragem de oportunidade profissional funciona bem porque examina preparo, obstáculos, recursos, tempo e próximo movimento prático.",
        },
        {
          question: "Posso usar tarot para decisões de dinheiro?",
          answer: "Use para reflexão, não como conselho financeiro. Combine a leitura com orçamento, prazos, contratos e alternativas realistas.",
        },
      ],
    },
    "should-i-quit-my-job-tarot": {
      sections: [
        {
          heading: "Quando usar esta pergunta",
          body: "Use quando burnout, conflito, tédio, pressão financeira ou uma nova oportunidade tornam difícil ficar, mas arriscado sair.",
        },
        {
          heading: "O que a tiragem deve esclarecer",
          body: "A leitura deve distinguir cansaço temporário de ciclo encerrado e mostrar se convém planejar, colocar limites, negociar ou sair.",
        },
        {
          heading: "Como agir com a resposta",
          body: "Não peça demissão por uma carta só. Use a leitura para decidir que preparação real precisa antes de ficar, conversar ou sair.",
        },
        {
          heading: "Melhor pergunta de acompanhamento",
          body: "Depois da resposta, pergunte: o que devo preparar para que meu próximo passo profissional seja estável e respeitoso comigo?",
        },
      ],
      faqs: [
        {
          question: "Esta leitura sobre pedir demissão é grátis?",
          answer: "Sim. Você pode começar esta leitura de decisão profissional grátis. A assinatura adiciona acompanhamentos profundos, histórico, tiragens avançadas e relatórios.",
        },
        {
          question: "O tarot pode dizer para eu pedir demissão agora?",
          answer: "Pode mostrar energia forte de transição, mas antes convém revisar dinheiro, contratos, saúde, referências e opções realistas.",
        },
        {
          question: "E se as cartas mostrarem burnout?",
          answer: "Cartas de burnout podem pedir descanso, limites, apoio ou saída planejada. A carta de conselho importa mais que uma carta dramática.",
        },
        {
          question: "Que tiragem serve antes de pedir demissão?",
          answer: "Use uma tiragem profissional que revise pressão atual, riscos ocultos, recursos disponíveis, tempo e próximo passo mais seguro.",
        },
      ],
    },
  },
}

function dedupeSections(sections: SeoPageContent["sections"]) {
  const seen = new Set<string>()
  return sections.filter((section) => {
    const key = section.heading.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function dedupeFaqs(faqs: SeoPageContent["faqs"]) {
  const seen = new Set<string>()
  return faqs.filter((faq) => {
    const key = faq.question.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function enhanceSeoContent(slug: string, locale: SeoLocale, content: SeoPageContent): SeoPageContent {
  const enhancement =
    locale === "en"
      ? questionSeoEnhancements[slug]
      : locale === "es" || locale === "pt-br"
        ? regionalQuestionSeoEnhancements[locale][slug]
        : undefined
  if (!enhancement) return content

  return {
    ...content,
    sections: dedupeSections([...content.sections, ...enhancement.sections]),
    faqs: dedupeFaqs([...content.faqs, ...enhancement.faqs]),
  }
}

function regionalContent(slug: string, base: SeoPageContent, locale: RegionalLocale): SeoPageContent {
  const localized = regionalSeoCopy[locale][slug]
  if (localized) return withRegionalCta(locale, localized)

  const prefix =
    locale === "es"
      ? {
          eyebrow: "Tarot gratis",
          intro: "Haz una pregunta clara, elige tus cartas y recibe una lectura de tarot con IA enfocada en tu situación.",
          intent: "Esta página está pensada como una entrada gratuita: primero obtén claridad, luego decide si necesitas una lectura más profunda.",
        }
      : {
          eyebrow: "Tarot grátis",
          intro: "Faça uma pergunta clara, escolha suas cartas e receba uma leitura de tarot com IA focada na sua situação.",
          intent: "Esta página funciona como uma entrada gratuita: primeiro ganhe clareza, depois decida se precisa de uma leitura mais profunda.",
        }

  return {
    ...base,
    title: locale === "es" ? `${base.title} gratis` : `${base.title} grátis`,
    description:
      locale === "es"
        ? `${base.description} Lectura gratuita con IA para amor, carrera, decisiones y orientación diaria.`
        : `${base.description} Leitura gratuita com IA para amor, carreira, decisões e orientação diária.`,
    eyebrow: prefix.eyebrow,
    intro: prefix.intro,
    intent: prefix.intent,
    primaryCta: regionalCta[locale].primary,
    secondaryCta: regionalCta[locale].secondary,
    questionsTitle: regionalCta[locale].questions,
    bottomCta: regionalCta[locale].bottom,
    sections: base.sections.map((section) => ({
      heading: section.heading,
      body:
        locale === "es"
          ? `${section.body} Usa esta guía como punto de partida y deja que la lectura conecte los símbolos con tu pregunta real.`
          : `${section.body} Use este guia como ponto de partida e deixe a leitura conectar os símbolos à sua pergunta real.`,
    })),
    faqs: base.faqs,
  }
}

export const seoPages = seoPageSources.map((source) => getSeoPage(source.slug, defaultLocale)).filter(Boolean) as SeoPage[]

export function getSeoPage(slug: string, locale: SeoLocale = defaultLocale): SeoPage | undefined {
  const sourceSlug = resolveSeoSourceSlug(slug, locale)
  const source = seoPageSources.find((page) => page.slug === sourceSlug)
  if (!source) return undefined
  const content =
    locale === "es" || locale === "pt-br"
      ? regionalContent(source.slug, source.content[defaultLocale], locale)
      : source.content[locale] || source.content[defaultLocale]
  const enhancedContent = enhanceSeoContent(source.slug, locale, content)
  return {
    ...enhancedContent,
    slug: source.slug,
    locale,
    cards: source.cards,
    recommendedSpread: source.recommendedSpread,
    path: localePath(locale, `/${getCanonicalSeoSlug(source.slug, locale)}`),
  }
}

export function getAllLocalizedSeoPages() {
  return seoPageSources.flatMap((source) =>
    seoLocales.map((locale) => getSeoPage(source.slug, locale)).filter(Boolean),
  ) as SeoPage[]
}

export function getSeoAlternates(slug: string) {
  const sourceSlug = resolveSeoSourceSlug(slug)

  return Object.fromEntries(
    seoLocales.map((locale) => [locale, localePath(locale, `/${getCanonicalSeoSlug(sourceSlug, locale)}`)]),
  )
}
