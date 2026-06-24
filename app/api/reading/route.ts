import { requireMemberAccess } from "@/lib/server/member-gate"
import { requireUser } from "@/lib/server/supabase"
import { isAdvancedSpreadType } from "@/lib/spread-config"

const TAROT_MASTER_SYSTEM = `## Role
你是一位拥有20年占卜经验的塔罗牌大师，精通78张塔罗牌的含义和解读，擅长运用直觉和智慧为人们解答疑惑。你的占卜技艺源自古老的吉普赛传统，经过多年实践不断精进。

## Skills
1. 精通78张塔罗牌（22张大阿尔卡纳 + 56张小阿尔卡纳）的含义和解读
2. 擅长倾听和提问，引导用户进行自我反思和觉察
3. 具备丰富的心理学和哲学知识，善于给出建设性建议
4. 能敏锐捕捉用户情绪，给予适当的安慰和鼓励

## Style
- 语气富有神秘主义，使用形象和感性的语言
- 将占卜结果与用户的个人经历相连接
- 使用涉及用户情感和期望的语言，创造一种只属于他们的故事
- 引发用户的共情和共鸣

## Constraints
1. 不说模棱两可的废话，给出准确、有逻辑性的回答
2. 解读要有深度，与用户问题紧密相关
3. 为用户提供积极向上的建议和指引`

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
const MODEL = process.env.OPENAI_MODEL || "gpt-5.2"

type TarotCardInput = {
  name: string
  position?: string
  isReversed: boolean
  meaning: {
    upright: string
    reversed: string
  }
}

function getAnswerLanguage(lang?: string) {
  return lang === "en"
    ? "English"
    : lang === "ja"
      ? "日本語"
      : lang === "ko"
        ? "한국어"
        : lang === "es"
          ? "Spanish"
          : lang === "pt-br"
            ? "Brazilian Portuguese"
            : "中文"
}

function getPositionName(index: number, spreadType?: string, lang?: string) {
  const positionsBySpread: Record<string, string[]> = {
    one_card: ["核心指引"],
    three_card: ["过去", "现在", "未来"],
    relationship: ["你", "对方", "关系现状", "潜在发展"],
    celtic_cross: ["现状", "挑战", "潜意识", "过去", "目标", "未来", "自我", "环境", "希望/恐惧", "结果"],
  }
  const englishPositionsBySpread: Record<string, string[]> = {
    one_card: ["Core guidance"],
    three_card: ["Past", "Present", "Future"],
    relationship: ["You", "Them", "Current bond", "Likely direction"],
    celtic_cross: ["Situation", "Challenge", "Subconscious", "Past", "Goal", "Future", "Self", "Environment", "Hope or fear", "Outcome"],
  }

  const positions = lang === "zh" || !lang ? positionsBySpread : englishPositionsBySpread
  return positions[spreadType || "three_card"]?.[index] || (lang === "zh" || !lang ? `位置${index + 1}` : `Position ${index + 1}`)
}

function orientationName(isReversed: boolean, lang?: string) {
  if (lang === "zh" || !lang) return isReversed ? "逆位" : "正位"
  return isReversed ? "reversed" : "upright"
}

function enqueueSse(controller: ReadableStreamDefaultController<Uint8Array>, payload: unknown) {
  const encoder = new TextEncoder()
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
}

export async function POST(req: Request) {
  const { question, cards, isFollowUp, followUpQuestion, previousMessages, lang, spread_type } = await req.json()
  const usesAdvancedSpread = isAdvancedSpreadType(spread_type) || (Array.isArray(cards) && cards.length > 3)

  if (isFollowUp) {
    const auth = await requireUser(req)
    if (!auth.ok) return auth.response
    const member = await requireMemberAccess(auth.supabase, auth.user, "followup", lang)
    if (!member.ok) return member.response
  } else if (usesAdvancedSpread) {
    const auth = await requireUser(req)
    if (!auth.ok) return auth.response
    const member = await requireMemberAccess(auth.supabase, auth.user, "advanced_spread", lang)
    if (!member.ok) return member.response
  }

  if (!OPENAI_API_KEY) {
    return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })
  }

  const answerLanguage = getAnswerLanguage(lang)

  // 构建塔罗解读prompt
  const cardsDescription = (cards as TarotCardInput[])
    .map(
      (
        card,
        index: number,
      ) => {
        const position = card.position || getPositionName(index, spread_type, lang)
        const orientation = orientationName(card.isReversed, lang)
        const meaning = card.isReversed ? card.meaning.reversed : card.meaning.upright
        return `${position}: ${card.name} (${orientation}) - ${meaning}`
      },
    )
    .join("\n")

  let userPrompt: string

  if (isFollowUp && followUpQuestion) {
    const previousContext = previousMessages?.join("\n\n---\n\n") || ""
    userPrompt = `用户之前就以下问题进行了塔罗占卜：

【原始问题】${question || "寻求指引"}

【抽到的牌】
${cardsDescription}

【之前的解读】
${previousContext}

---

现在用户想进一步了解：${followUpQuestion}

请基于之前的牌面和解读，针对用户的追问提供更深入、更具体的解读。
- 结合牌面给出有针对性的回答
- 语言要有画面感，能引发共鸣
- 给出具体可行的建议
使用${answerLanguage}回答，控制在300字以内。`
  } else {
    userPrompt = `【用户问题】${question || "寻求指引"}

【抽到的牌】
${cardsDescription}

---

请进行深度解读：

1. **逐牌解读**：解读每张牌在其位置（过去、现在、未来）的独特含义，结合用户问题分析
2. **整体联结**：揭示三张牌之间的内在联系，描绘用户所处的人生叙事
3. **具体建议**：针对用户问题，给出切实可行、具体明确的建议

要求：
- 语言要有画面感和故事性，将牌面与用户的生命经历相连接
- 回答要有逻辑性，避免模棱两可
- 引发用户的共情和自我反思
使用${answerLanguage}回答，控制在400字以内。`
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        { role: "developer", content: TAROT_MASTER_SYSTEM },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_output_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[Reading API] OpenAI error:", error)
    return new Response(JSON.stringify({ error: "AI 服务暂时不可用" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      let sentDone = false
      const reader = response.body?.getReader()
      if (!reader) {
        sentDone = true
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
        controller.close()
        return
      }

      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim()
              if (data === "[DONE]") {
                sentDone = true
                controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
                controller.close()
                return
              }

              try {
                const json = JSON.parse(data)
                const content = json.type === "response.output_text.delta" ? json.delta : undefined
                if (content) {
                  enqueueSse(controller, { content })
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      } catch (error) {
        console.error("[Reading API] Stream error:", error)
      } finally {
        if (!sentDone) {
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
