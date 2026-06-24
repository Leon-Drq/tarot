import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js"

import { getProfile, isMemberActive, isPartnerActive, jsonError, type ProfileRow } from "@/lib/server/supabase"

type MemberFeature = "followup" | "history" | "advanced_spread" | "monthly_report"

const upgradeMessages: Record<MemberFeature, Record<string, string>> = {
  followup: {
    zh: "深度追问属于会员功能，请升级会员后继续。",
    en: "Deeper follow-up questions are a membership feature. Upgrade to continue.",
    ja: "深い追質問はメンバー機能です。アップグレードして続けてください。",
    ko: "심층 후속 질문은 멤버십 기능입니다. 업그레이드 후 계속하세요.",
    es: "Las preguntas de seguimiento profundas son una función de membresía. Actualiza para continuar.",
    "pt-br": "Perguntas de acompanhamento aprofundadas são um recurso de membro. Faça upgrade para continuar.",
  },
  history: {
    zh: "保存和查看解读历史属于会员功能，请升级会员后继续。",
    en: "Saved reading history is a membership feature. Upgrade to continue.",
    ja: "リーディング履歴の保存と閲覧はメンバー機能です。アップグレードして続けてください。",
    ko: "리딩 기록 저장과 보기는 멤버십 기능입니다. 업그레이드 후 계속하세요.",
    es: "Guardar y ver el historial de lecturas es una función de membresía. Actualiza para continuar.",
    "pt-br": "Salvar e ver o histórico de leituras é um recurso de membro. Faça upgrade para continuar.",
  },
  advanced_spread: {
    zh: "高级牌阵属于会员功能，请升级会员后继续。",
    en: "Advanced spreads are a membership feature. Upgrade to continue.",
    ja: "高度なスプレッドはメンバー機能です。アップグレードして続けてください。",
    ko: "고급 스프레드는 멤버십 기능입니다. 업그레이드 후 계속하세요.",
    es: "Las tiradas avanzadas son una función de membresía. Actualiza para continuar.",
    "pt-br": "Tiragens avançadas são um recurso de membro. Faça upgrade para continuar.",
  },
  monthly_report: {
    zh: "月度报告属于会员功能，请升级会员后查看本月模式。",
    en: "Monthly reports are a membership feature. Upgrade to review this month's patterns.",
    ja: "月間レポートはメンバー機能です。アップグレードして今月のパターンを確認してください。",
    ko: "월간 리포트는 멤버십 기능입니다. 업그레이드 후 이번 달의 패턴을 확인하세요.",
    es: "Los informes mensuales son una función de membresía. Actualiza para revisar los patrones de este mes.",
    "pt-br": "Relatórios mensais são um recurso de membro. Faça upgrade para revisar os padrões deste mês.",
  },
}

export function memberUpgradeMessage(feature: MemberFeature, lang?: string) {
  const locale = lang?.toLowerCase() || "en"
  return upgradeMessages[feature][locale] || upgradeMessages[feature].en
}

export function hasMemberAccess(profile: Pick<ProfileRow, "member_expire_at" | "partner_expire_at"> | null | undefined) {
  return isMemberActive(profile) || isPartnerActive(profile)
}

export async function requireMemberAccess(
  supabase: SupabaseClient,
  user: SupabaseUser,
  feature: MemberFeature,
  lang?: string,
): Promise<{ ok: true; profile: ProfileRow } | { ok: false; response: Response }> {
  const profile = await getProfile(supabase, user)
  if (hasMemberAccess(profile)) return { ok: true, profile }
  return { ok: false, response: jsonError(memberUpgradeMessage(feature, lang), 402) }
}
