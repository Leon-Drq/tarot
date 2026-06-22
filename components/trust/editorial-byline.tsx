import Link from "next/link"
import type { SeoLocale } from "@/lib/locales"
import { editorialTeam, trustLastReviewed } from "@/lib/trust-signals"
import { cn } from "@/lib/utils"

const copy: Record<
  SeoLocale,
  {
    label: string
    reviewed: string
    body: string
    policy: string
    disclaimer: string
    standards: string
  }
> = {
  zh: {
    label: "编辑审核",
    reviewed: "最近审核",
    body: "由 POPTarot 编辑团队维护：先依据塔罗象征，再结合问题语境和 AI 解读，避免把结果说成确定预言。",
    policy: "编辑说明",
    disclaimer: "AI 声明",
    standards: "审核标准",
  },
  en: {
    label: "Editorial review",
    reviewed: "Last reviewed",
    body: "Maintained by the POPTarot Editorial Team: tarot symbolism first, AI-assisted interpretation second, with clear limits around certainty and professional advice.",
    policy: "Editorial Policy",
    disclaimer: "AI Disclaimer",
    standards: "Review standards",
  },
  ja: {
    label: "編集レビュー",
    reviewed: "最終確認",
    body: "POPTarot 編集チームが、タロット象徴を先に置き、AI 解釈を補助として使い、断定しすぎない読み方に整えています。",
    policy: "編集方針",
    disclaimer: "AI 免責",
    standards: "確認基準",
  },
  ko: {
    label: "편집 검토",
    reviewed: "최근 검토",
    body: "POPTarot 편집팀이 타로 상징을 먼저 보고, AI 해석은 보조로 사용하며, 확정적 예언처럼 보이지 않도록 검토합니다.",
    policy: "편집 원칙",
    disclaimer: "AI 안내",
    standards: "검토 기준",
  },
  es: {
    label: "Revision editorial",
    reviewed: "Ultima revision",
    body: "El equipo editorial de POPTarot mantiene estas guias: primero simbolismo del tarot, luego interpretacion asistida por IA, con limites claros.",
    policy: "Politica editorial",
    disclaimer: "Aviso de IA",
    standards: "Criterios de revision",
  },
  "pt-br": {
    label: "Revisao editorial",
    reviewed: "Ultima revisao",
    body: "A equipe editorial da POPTarot mantem estas paginas: primeiro simbolismo do tarot, depois interpretacao assistida por IA, com limites claros.",
    policy: "Politica editorial",
    disclaimer: "Aviso de IA",
    standards: "Padroes de revisao",
  },
}

export function EditorialByline({
  locale = "en",
  className,
  showStandards = false,
}: {
  locale?: SeoLocale
  className?: string
  showStandards?: boolean
}) {
  const text = copy[locale] ?? copy.en

  return (
    <aside
      className={cn(
        "rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.045] p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.16)]",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/78">{text.label}</p>
          <p className="mt-2 text-sm font-medium text-white">{editorialTeam.name}</p>
          <p className="mt-2 text-sm leading-6 text-white/62">{text.body}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:max-w-[13rem] sm:justify-end">
          <span className="inline-flex min-h-9 items-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/52">
            {text.reviewed} {trustLastReviewed}
          </span>
          <Link
            href="/editorial-policy"
            className="inline-flex min-h-9 items-center rounded-lg border border-white/10 px-3 py-2 text-xs text-[#d8d0ff] transition hover:border-[#bfb6ff]/45 hover:text-white"
          >
            {text.policy}
          </Link>
          <Link
            href="/ai-tarot-disclaimer"
            className="inline-flex min-h-9 items-center rounded-lg border border-white/10 px-3 py-2 text-xs text-[#d8d0ff] transition hover:border-[#bfb6ff]/45 hover:text-white"
          >
            {text.disclaimer}
          </Link>
        </div>
      </div>
      {showStandards && (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">{text.standards}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {editorialTeam.standards.map((standard) => (
              <div key={standard} className="rounded-lg border border-white/10 bg-black/[0.16] px-3 py-2 text-sm leading-6 text-white/62">
                {standard}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
