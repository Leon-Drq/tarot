export type ReaderStyle = "gentle" | "direct" | "relationship"

export function normalizeReaderStyle(value: unknown): ReaderStyle {
  return value === "direct" || value === "relationship" ? value : "gentle"
}

export function getReaderStylePrompt(style: ReaderStyle, lang?: string) {
  const prompts = {
    gentle: {
      zh: "解读风格：温柔陪伴。先准确承接用户的感受，再给出清晰判断；不回避问题，也不制造焦虑。",
      en: "Reading style: gentle guide. Acknowledge the user's feelings before giving a clear judgment. Do not avoid the issue or create anxiety.",
      ja: "リーディングスタイル：やさしい伴走。気持ちを正確に受け止めてから明確な判断を示し、不安を煽らない。",
      ko: "리딩 스타일: 부드러운 안내. 감정을 정확히 이해한 뒤 명확히 판단하며 불안을 조장하지 않습니다.",
    },
    direct: {
      zh: "解读风格：清醒直说。优先指出最关键的事实、矛盾和可观察信号；语言简洁直接，但不刻薄。",
      en: "Reading style: clear truth. Lead with the key fact, contradiction, and observable signal. Be concise and direct without being harsh.",
      ja: "リーディングスタイル：率直な答え。重要な事実、矛盾、観察できるサインを先に示し、簡潔だが冷たくしない。",
      ko: "리딩 스타일: 명확한 진실. 핵심 사실, 모순, 관찰 가능한 신호를 먼저 말하되 차갑거나 공격적이지 않게 답합니다.",
    },
    relationship: {
      zh: "解读风格：关系洞察。重点分析双方互动、投入是否对等、沟通模式和边界，并给出保护用户主体性的下一步。",
      en: "Reading style: relationship lens. Focus on interaction, reciprocity, communication patterns, and boundaries, then give a next step that preserves the user's agency.",
      ja: "リーディングスタイル：関係の洞察。相互作用、対等さ、対話のパターン、境界線を中心に読み、主体性を守る次の一歩を示す。",
      ko: "리딩 스타일: 관계 통찰. 상호작용, 상호성, 소통 패턴, 경계를 중심으로 읽고 사용자의 주도권을 지키는 다음 단계를 제시합니다.",
    },
  } as const

  const locale = lang === "zh" || lang === "ja" || lang === "ko" ? lang : "en"
  return prompts[style][locale]
}
