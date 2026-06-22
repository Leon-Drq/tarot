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
            heading: "When to upgrade",
            body: "Membership is useful after the first reading if you want unlimited follow-up questions, saved history, advanced spreads, and deeper reports.",
          },
        ],
        faqs: [
          {
            question: "Is the first AI tarot reading free?",
            answer: "Yes. You can start a reading without paying first. Membership adds unlimited use, saved history, and deeper reports.",
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
            answer: "是的。你可以先免费开始，不需要先付费。会员主要提供无限次数、历史记录和深度报告。",
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
          { heading: "アップグレードのタイミング", body: "無制限リーディング、履歴保存、高度なスプレッド、深い恋愛/仕事レポートが必要な時に会員が役立ちます。" },
        ],
        faqs: [
          { question: "最初の AI タロットは無料ですか？", answer: "はい。まず無料で始められます。会員は無制限利用や履歴保存を追加します。" },
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
          { heading: "업그레이드 시점", body: "무제한 리딩, 기록 저장, 고급 스프레드, 깊은 관계/커리어 리포트가 필요할 때 멤버십이 유용합니다." },
        ],
        faqs: [
          { question: "첫 AI 타로 리딩은 무료인가요?", answer: "네. 먼저 무료로 시작할 수 있습니다. 멤버십은 무제한 사용과 기록 저장을 제공합니다." },
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
)

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
} satisfies Record<Exclude<SeoLocale, Locale>, Record<string, string>>

function regionalContent(base: SeoPageContent, locale: Exclude<SeoLocale, Locale>): SeoPageContent {
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
  const source = seoPageSources.find((page) => page.slug === slug)
  if (!source) return undefined
  const content =
    locale === "es" || locale === "pt-br"
      ? regionalContent(source.content[defaultLocale], locale)
      : source.content[locale] || source.content[defaultLocale]
  return {
    ...content,
    slug: source.slug,
    locale,
    cards: source.cards,
    recommendedSpread: source.recommendedSpread,
    path: localePath(locale, `/${source.slug}`),
  }
}

export function getAllLocalizedSeoPages() {
  return seoPageSources.flatMap((source) =>
    seoLocales.map((locale) => getSeoPage(source.slug, locale)).filter(Boolean),
  ) as SeoPage[]
}

export function getSeoAlternates(slug: string) {
  return Object.fromEntries(seoLocales.map((locale) => [locale, localePath(locale, `/${slug}`)]))
}
