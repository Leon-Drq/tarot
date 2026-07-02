const INTERNAL_STRUCTURE_PATTERN =
  /(解读结构|输出结构|问题类型结构|阅读结构|interpretation structure|reading structure|result structure|output format|result format)/i

const INTERNAL_PROMPT_PATTERN =
  /(请严格用这些|use this result structure|write the final answer directly|do not add any heading)/i

const STRUCTURE_LIST_PATTERN =
  /^(\d{1,2}|[一二三四五六七八九十])[\s.、:-]*(核心结论|核心答案|当前|仍在|真正|继续|健康|下一步|残留|阻碍|能量|Core|Current|What|Whether|Healthiest|Next|Block|Energy|Answer)\b/i

export type ReadingPresentationSection = {
  title: string
  body: string
}

export function stripReadingMarkdownInline(value: string) {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_`>#~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function truncateReadingText(value: string, maxLength = 220) {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trim()}...`
}

function shouldDropStructureLine(line: string) {
  const plain = stripReadingMarkdownInline(line)
  if (!plain) return false
  return INTERNAL_STRUCTURE_PATTERN.test(plain) || INTERNAL_PROMPT_PATTERN.test(plain)
}

function looksLikeStructureList(line: string) {
  return STRUCTURE_LIST_PATTERN.test(stripReadingMarkdownInline(line))
}

export function cleanReadingMarkdownForUser(content: string) {
  const normalized = content.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim()
  if (!normalized) return ""

  const lines = normalized.split("\n")
  const cleaned: string[] = []
  let droppingStructurePrelude = 0

  for (const line of lines) {
    const trimmed = line.trim()
    const plain = stripReadingMarkdownInline(line)
    const isHeading = /^#{1,6}\s+/.test(trimmed)

    if (shouldDropStructureLine(line)) {
      droppingStructurePrelude = 3
      continue
    }

    if (droppingStructurePrelude > 0) {
      if (!plain) continue
      if (isHeading) {
        droppingStructurePrelude = 0
      } else if (looksLikeStructureList(line) || plain.length <= 42) {
        droppingStructurePrelude -= 1
        continue
      } else {
        droppingStructurePrelude = 0
      }
    }

    if (looksLikeStructureList(line) && cleaned.length === 0) continue
    cleaned.push(line)
  }

  return cleaned.join("\n").replace(/\n{3,}/g, "\n\n").trim()
}

export function extractReadingSections(content: string, maxSections = 4): ReadingPresentationSection[] {
  const cleaned = cleanReadingMarkdownForUser(content)
  if (!cleaned) return []

  const lines = cleaned.split("\n")
  const sections: ReadingPresentationSection[] = []
  let currentTitle = ""
  let currentBody: string[] = []

  const flush = () => {
    const body = stripReadingMarkdownInline(currentBody.join(" "))
    const title = stripReadingMarkdownInline(currentTitle)
    if (title && body && !INTERNAL_STRUCTURE_PATTERN.test(title)) {
      sections.push({ title, body: truncateReadingText(body, 180) })
    }
    currentTitle = ""
    currentBody = []
  }

  for (const line of lines) {
    const headingMatch = line.trim().match(/^#{1,6}\s+(.+)$/)
    if (headingMatch) {
      flush()
      currentTitle = headingMatch[1]
      continue
    }
    currentBody.push(line)
  }
  flush()

  if (sections.length > 0) return sections.slice(0, maxSections)

  return cleaned
    .split(/\n\s*\n/)
    .map((paragraph) => stripReadingMarkdownInline(paragraph))
    .filter(Boolean)
    .slice(0, maxSections)
    .map((paragraph, index) => ({
      title: index === 0 ? "Summary" : `Point ${index + 1}`,
      body: truncateReadingText(paragraph, 180),
    }))
}

export function createReadingShareExcerpt(content: string, maxLength = 900) {
  return truncateReadingText(stripReadingMarkdownInline(cleanReadingMarkdownForUser(content)), maxLength)
}
