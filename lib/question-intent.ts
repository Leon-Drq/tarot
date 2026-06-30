import { isKnownSpreadType, type SpreadType } from "@/lib/spread-config"
import type { Locale, SeoLocale } from "@/lib/locales"

export type QuestionIntentType =
  | "love"
  | "reconciliation"
  | "career"
  | "yes_no"
  | "daily"
  | "decision"
  | "self_growth"
  | "general"

export type QuestionIntentTone = "direct" | "warm" | "grounded" | "reflective"

export interface QuestionIntent {
  type: QuestionIntentType
  recommendedSpreadType: SpreadType
  confidence: number
  tone: QuestionIntentTone
  isYesNo: boolean
  isLove: boolean
  isCareer: boolean
  isDaily: boolean
  reason: string
}

const INTENT_KEYWORDS: Record<QuestionIntentType, string[]> = {
  reconciliation: [
    "前任",
    "复合",
    "挽回",
    "分手",
    "回来",
    "断联",
    "ex",
    "breakup",
    "come back",
    "get back together",
    "reconcile",
    "no contact",
  ],
  love: [
    "爱我",
    "喜欢我",
    "暗恋",
    "暧昧",
    "感情",
    "恋爱",
    "关系",
    "他",
    "她",
    "对方",
    "crush",
    "love me",
    "feelings",
    "relationship",
    "dating",
    "text me",
  ],
  career: [
    "工作",
    "事业",
    "求职",
    "跳槽",
    "离职",
    "面试",
    "offer",
    "升职",
    "career",
    "job",
    "work",
    "quit",
    "interview",
    "salary",
    "business",
  ],
  yes_no: [
    "是否",
    "会不会",
    "能不能",
    "可不可以",
    "要不要",
    "行不行",
    "该不该",
    "yes or no",
    "should i",
    "will i",
    "will he",
    "will she",
    "can i",
  ],
  daily: ["今天", "每日", "今日", "今天要注意", "daily", "today", "guidance today"],
  decision: [
    "选择",
    "二选一",
    "三选一",
    "还是",
    "或者",
    "纠结",
    "怎么办",
    "下一步",
    "choose",
    "choice",
    "option",
    "stay or leave",
    "what should i do",
  ],
  self_growth: [
    "焦虑",
    "疗愈",
    "成长",
    "自我",
    "状态",
    "能量",
    "迷茫",
    "blocked",
    "healing",
    "anxious",
    "confidence",
    "stuck",
    "energy",
  ],
  general: [],
}

const INTENT_SPREADS: Record<QuestionIntentType, SpreadType> = {
  love: "their_thoughts",
  reconciliation: "breakup_recovery",
  career: "job_opportunity",
  yes_no: "yes_no",
  daily: "single_card",
  decision: "decision_starter",
  self_growth: "single_card",
  general: "three_card",
}

function normalizeQuestion(question: string) {
  return question.toLowerCase().replace(/\s+/g, " ").trim()
}

function countMatches(normalized: string, keywords: string[]) {
  return keywords.reduce((count, keyword) => {
    const needle = keyword.toLowerCase()
    return normalized.includes(needle) ? count + 1 : count
  }, 0)
}

function isLikelyYesNo(normalized: string) {
  return (
    countMatches(normalized, INTENT_KEYWORDS.yes_no) > 0 ||
    /[吗嘛]$/.test(normalized) ||
    /\b(should|will|can|does|is|are|do)\b/.test(normalized)
  )
}

export function classifyQuestionIntent(question: string, spreadType?: string | null): QuestionIntent {
  const normalized = normalizeQuestion(question)
  const scores: Record<QuestionIntentType, number> = {
    love: countMatches(normalized, INTENT_KEYWORDS.love),
    reconciliation: countMatches(normalized, INTENT_KEYWORDS.reconciliation),
    career: countMatches(normalized, INTENT_KEYWORDS.career),
    yes_no: isLikelyYesNo(normalized) ? Math.max(1, countMatches(normalized, INTENT_KEYWORDS.yes_no)) : 0,
    daily: countMatches(normalized, INTENT_KEYWORDS.daily),
    decision: countMatches(normalized, INTENT_KEYWORDS.decision),
    self_growth: countMatches(normalized, INTENT_KEYWORDS.self_growth),
    general: 0,
  }

  const priority: QuestionIntentType[] = [
    "reconciliation",
    "career",
    "love",
    "decision",
    "daily",
    "self_growth",
    "yes_no",
    "general",
  ]
  const best = priority.reduce<QuestionIntentType>((current, candidate) => {
    if (scores[candidate] > scores[current]) return candidate
    return current
  }, "general")

  const type = scores[best] > 0 ? best : "general"
  const requestedSpread = isKnownSpreadType(spreadType) ? spreadType : null
  const recommendedSpreadType = requestedSpread || INTENT_SPREADS[type]
  const confidence = Math.min(0.92, type === "general" ? 0.48 : 0.62 + scores[type] * 0.1)

  return {
    type,
    recommendedSpreadType,
    confidence,
    tone: type === "career" ? "grounded" : type === "yes_no" || type === "decision" ? "direct" : type === "self_growth" ? "reflective" : "warm",
    isYesNo: scores.yes_no > 0,
    isLove: type === "love" || type === "reconciliation",
    isCareer: type === "career",
    isDaily: type === "daily",
    reason: `question_type:${type}`,
  }
}

export function getQuestionIntentPrompt(intentType: QuestionIntentType, lang?: string) {
  if (lang === "en") {
    const prompts: Record<QuestionIntentType, string> = {
      love:
        "Use this result structure: ### Core answer, ### Current relationship energy, ### Their observable signal, ### What you need to see clearly, ### Next action. Avoid claiming private thoughts as facts; anchor everything in cards and observable behavior.",
      reconciliation:
        "Use this result structure: ### Core answer, ### What still remains, ### The real block, ### Whether waiting helps, ### Healthiest next step. Do not promise reunion; separate possibility from healthy action.",
      career:
        "Use this result structure: ### Core answer, ### Work pressure, ### Available opportunity, ### Risk or blind spot, ### Practical next move. Keep the advice grounded and actionable.",
      yes_no:
        "Use this result structure: ### Core answer, ### Why the card leans this way, ### Condition that could change the answer, ### What to do next. Give a clear leaning instead of hiding behind maybe.",
      daily:
        "Use this result structure: ### Today's focus, ### Energy to notice, ### One thing to avoid, ### One practical action. Keep it concise and useful for the next 24 hours.",
      decision:
        "Use this result structure: ### Core answer, ### Option energy, ### Hidden cost, ### Decision condition, ### Next action. Help the user choose a testable next step.",
      self_growth:
        "Use this result structure: ### Core answer, ### Inner pattern, ### What is draining you, ### What restores agency, ### One gentle next step. Keep it reflective but concrete.",
      general:
        "Use this result structure: ### Core answer, ### Card-by-card reading, ### Overall pattern, ### Practical guidance, ### What to watch next. Keep it focused on the user's question.",
    }
    return prompts[intentType]
  }

  const prompts: Record<QuestionIntentType, string> = {
    love:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 当前关系能量、### 对方可观察信号、### 你需要看清的点、### 下一步行动。不要把对方内心当成事实，只能结合牌面和可观察行为给判断。",
    reconciliation:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 仍在延续的能量、### 真正的阻碍、### 继续等待是否有帮助、### 健康下一步。不要承诺一定复合，要区分可能性和对用户更健康的行动。",
    career:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 当前工作压力、### 可用机会、### 风险或盲点、### 现实下一步。建议必须落到可执行行动。",
    yes_no:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 为什么牌面这样倾向、### 会改变答案的条件、### 下一步怎么做。要给清晰倾向，不要用模糊话术逃避。",
    daily:
      "请严格用这些 Markdown 小标题输出：### 今日重点、### 需要注意的能量、### 今天避免什么、### 一个具体行动。控制在未来 24 小时可用。",
    decision:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 选项能量、### 隐藏代价、### 决策条件、### 下一步行动。帮助用户得到可验证的下一步。",
    self_growth:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 内在模式、### 正在消耗你的部分、### 重新拿回主动权、### 温和下一步。要有共情，但不能空泛。",
    general:
      "请严格用这些 Markdown 小标题输出：### 核心结论、### 逐牌解读、### 整体模式、### 现实建议、### 接下来观察什么。始终贴合用户问题。",
  }
  return prompts[intentType]
}

export function getQuestionIntentFollowUps(intentType: QuestionIntentType, locale: Locale | SeoLocale) {
  const copy: Record<string, Record<QuestionIntentType, string[]>> = {
    zh: {
      love: ["对方现在真实状态是什么？", "我下一步该主动吗？", "这段关系未来一个月趋势？"],
      reconciliation: ["前任还会联系我吗？", "我该继续等还是放下？", "复合真正的阻碍是什么？"],
      career: ["我该继续这份工作吗？", "近期事业机会在哪里？", "我下一步最该做什么？"],
      yes_no: ["这个答案的关键条件是什么？", "如果我主动会怎样？", "我现在最该避免什么？"],
      daily: ["今天最该注意什么情绪？", "我今天的行动重点是什么？", "明天这股能量会怎样延续？"],
      decision: ["选 A 的代价是什么？", "选 B 的机会是什么？", "我该用什么标准判断？"],
      self_growth: ["我真正卡住的原因是什么？", "我该如何拿回主动权？", "下一周我该练习什么？"],
      general: ["这件事真正的核心是什么？", "我下一步该怎么做？", "未来一个月趋势如何？"],
    },
    en: {
      love: ["What is their real current state?", "Should I reach out next?", "Where is this connection heading?"],
      reconciliation: ["Will my ex contact me?", "Should I wait or let go?", "What is the real block?"],
      career: ["Should I stay in this job?", "Where is the next opportunity?", "What should I do next?"],
      yes_no: ["What condition could change this?", "What if I take action first?", "What should I avoid now?"],
      daily: ["What emotion should I watch today?", "What is today's action focus?", "How will this carry into tomorrow?"],
      decision: ["What is the cost of option A?", "What is the opportunity in option B?", "What standard should guide me?"],
      self_growth: ["What is keeping me stuck?", "How do I regain agency?", "What should I practice this week?"],
      general: ["What is the real core here?", "What should I do next?", "What is the next-month trend?"],
    },
  }
  return (copy[locale] || copy.en)[intentType]
}

export function getQuestionIntentResultStructure(intentType: QuestionIntentType, locale: Locale | SeoLocale) {
  const copy: Record<string, Record<QuestionIntentType, { label: string; title: string; body: string; stages: string[] }>> = {
    zh: {
      love: {
        label: "感情问题",
        title: "先看关系能量，再看行动",
        body: "这类问题会把感觉、可观察信号和你的下一步分开，避免只猜对方心里怎么想。",
        stages: ["核心结论", "关系能量", "对方信号", "行动建议"],
      },
      reconciliation: {
        label: "复合问题",
        title: "先判断是否值得等",
        body: "复合解读会分开看残留能量、真正阻碍和更健康的下一步。",
        stages: ["核心结论", "残留能量", "真正阻碍", "健康下一步"],
      },
      career: {
        label: "事业问题",
        title: "把压力、机会和行动拆开",
        body: "事业解读会尽量落到可执行动作，而不是只说运势好坏。",
        stages: ["核心结论", "当前压力", "可用机会", "现实行动"],
      },
      yes_no: {
        label: "是否问题",
        title: "给出倾向，也说明条件",
        body: "是否类问题会给清晰倾向，同时说明什么条件会改变答案。",
        stages: ["核心结论", "倾向原因", "改变条件", "下一步"],
      },
      daily: {
        label: "每日指引",
        title: "把今天的能量落到行动",
        body: "每日解读会聚焦未来 24 小时能用的提醒和动作。",
        stages: ["今日重点", "注意能量", "避免事项", "具体行动"],
      },
      decision: {
        label: "决策问题",
        title: "把选择变成可验证下一步",
        body: "决策解读会拆开选项能量、隐藏代价和判断标准。",
        stages: ["核心结论", "选项能量", "隐藏代价", "决策条件"],
      },
      self_growth: {
        label: "自我成长",
        title: "先看内在模式，再拿回主动权",
        body: "成长类解读会给共情，但重点放在具体可恢复的行动上。",
        stages: ["核心结论", "内在模式", "消耗来源", "温和下一步"],
      },
      general: {
        label: "综合问题",
        title: "按牌面结构完整解读",
        body: "综合问题会先给结论，再看逐牌含义、整体模式和现实建议。",
        stages: ["核心结论", "逐牌解读", "整体模式", "现实建议"],
      },
    },
    en: {
      love: {
        label: "Love",
        title: "Read the connection before the action",
        body: "This separates emotion, observable signals, and your next move.",
        stages: ["Core answer", "Connection energy", "Their signal", "Next action"],
      },
      reconciliation: {
        label: "Reconciliation",
        title: "Check whether waiting helps",
        body: "This separates remaining energy, real blocks, and the healthier next step.",
        stages: ["Core answer", "What remains", "Real block", "Healthy step"],
      },
      career: {
        label: "Career",
        title: "Separate pressure, opportunity, and action",
        body: "Career readings stay grounded in practical next moves.",
        stages: ["Core answer", "Pressure", "Opportunity", "Practical move"],
      },
      yes_no: {
        label: "Yes or No",
        title: "Clear leaning with conditions",
        body: "Yes/no readings give a direction and the condition that could change it.",
        stages: ["Core answer", "Why", "Condition", "Next step"],
      },
      daily: {
        label: "Daily",
        title: "Turn today's energy into action",
        body: "Daily readings focus on one useful cue for the next 24 hours.",
        stages: ["Focus", "Energy", "Avoid", "Action"],
      },
      decision: {
        label: "Decision",
        title: "Make the choice testable",
        body: "Decision readings compare energy, hidden cost, and the judging condition.",
        stages: ["Core answer", "Option energy", "Hidden cost", "Condition"],
      },
      self_growth: {
        label: "Self-growth",
        title: "Read the pattern, then regain agency",
        body: "Reflective readings stay concrete and action-oriented.",
        stages: ["Core answer", "Pattern", "Drain", "Gentle step"],
      },
      general: {
        label: "General",
        title: "Conclusion first, then the full pattern",
        body: "General readings connect card meanings to a practical next step.",
        stages: ["Core answer", "Cards", "Pattern", "Guidance"],
      },
    },
  }
  return (copy[locale] || copy.en)[intentType]
}
