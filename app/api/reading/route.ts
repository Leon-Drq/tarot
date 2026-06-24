import { requireMemberAccess } from "@/lib/server/member-gate"
import { requireUser } from "@/lib/server/supabase"
import { getSpreadConfig, isAdvancedSpreadType, isKnownSpreadType } from "@/lib/spread-config"

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
  if (isKnownSpreadType(spreadType)) {
    const position = getSpreadConfig(spreadType).positions[index]
    if (position) return lang === "zh" || !lang ? position.name : position.nameEn || position.name
  }

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

function getSpreadPromptInstruction(spreadType?: string, lang?: string) {
  const spread = isKnownSpreadType(spreadType) ? getSpreadConfig(spreadType) : getSpreadConfig("three_card")
  const spreadName = lang === "zh" || !lang ? spread.name : spread.nameEn || spread.name
  const positions = spread.positions.map((position) => (lang === "zh" || !lang ? position.name : position.nameEn || position.name)).join(" / ")

  if (lang === "en") {
    return `Spread context: this reading uses the ${spreadName} spread with these positions: ${positions}. Interpret each card according to its listed position label. Do not reframe the reading as past/present/future unless those are the actual positions.`
  }

  if (lang === "ja") {
    return `スプレッドの前提：このリーディングは「${spreadName}」を使い、位置は ${positions} です。各カードは表示された位置名に沿って解釈し、実際の位置でない限り過去・現在・未来の三枚引きとして読み替えないでください。`
  }

  if (lang === "ko") {
    return `스프레드 전제: 이 리딩은 ${spreadName} 스프레드를 사용하며 위치는 ${positions}입니다. 각 카드는 표시된 위치 이름에 맞춰 해석하고, 실제 위치가 아닐 때 과거/현재/미래 스프레드로 바꾸어 읽지 마세요.`
  }

  if (lang === "es") {
    return `Contexto de la tirada: esta lectura usa la tirada ${spreadName}, con estas posiciones: ${positions}. Interpreta cada carta según su posición indicada. No la conviertas en pasado/presente/futuro a menos que esas sean las posiciones reales.`
  }

  if (lang === "pt-br") {
    return `Contexto da tiragem: esta leitura usa a tiragem ${spreadName}, com estas posições: ${positions}. Interprete cada carta conforme a posição indicada. Não transforme a leitura em passado/presente/futuro a menos que essas sejam as posições reais.`
  }

  return `牌阵前提：本次使用「${spreadName}」，牌位为：${positions}。请严格按照每张牌标注的牌位解读，不要把非三牌阵强行解释成过去、现在、未来。`
}

function getReadingTaskPrompt(lang?: string) {
  if (lang === "en") {
    return `Please provide a focused reading:

1. Card-by-card reading: explain each card in its actual spread position and relate it to the user's question.
2. Whole spread pattern: connect the cards into one coherent picture instead of treating them as isolated keywords.
3. Practical guidance: give specific, grounded advice for the user's next step.`
  }

  if (lang === "ja") {
    return `以下の形でリーディングしてください：

1. 各カードの解釈：それぞれのカードを実際の位置に沿って読み、質問と結びつける。
2. 全体の流れ：カード同士の関係をつなげ、ひとつの状況として描く。
3. 実践的な助言：次に取れる具体的で現実的な一歩を示す。`
  }

  if (lang === "ko") {
    return `다음 구조로 리딩해 주세요:

1. 카드별 해석: 각 카드를 실제 스프레드 위치에 맞춰 읽고 질문과 연결합니다.
2. 전체 흐름: 카드를 따로따로 보지 말고 하나의 상황으로 연결합니다.
3. 실천 조언: 다음 행동에 도움이 되는 구체적이고 현실적인 조언을 줍니다.`
  }

  if (lang === "es") {
    return `Haz una lectura enfocada:

1. Carta por carta: interpreta cada carta según su posición real en la tirada y relaciónala con la pregunta.
2. Patrón completo: conecta las cartas en una imagen coherente, no como palabras clave aisladas.
3. Guía práctica: ofrece un siguiente paso claro, concreto y realista.`
  }

  if (lang === "pt-br") {
    return `Faça uma leitura focada:

1. Carta por carta: interprete cada carta conforme sua posição real na tiragem e relacione com a pergunta.
2. Padrão geral: conecte as cartas em uma visão coerente, não como palavras-chave isoladas.
3. Orientação prática: ofereça um próximo passo claro, concreto e realista.`
  }

  return `请进行深度解读：

1. 逐牌解读：解读每张牌在其实际牌位中的独特含义，结合用户问题分析。
2. 整体联结：揭示这些牌之间的内在联系，描绘用户所处的关系、选择或行动模式。
3. 具体建议：针对用户问题，给出切实可行、具体明确的下一步建议。`
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
  const spreadInstruction = getSpreadPromptInstruction(spread_type, lang)
  const readingTaskPrompt = getReadingTaskPrompt(lang)

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

【牌阵说明】
${spreadInstruction}

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

【牌阵说明】
${spreadInstruction}

---

${readingTaskPrompt}

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
