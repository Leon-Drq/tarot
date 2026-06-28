import { createServiceSupabase, getSupabaseUrl, hasSupabaseServiceKey } from "@/lib/server/supabase"

export type ReminderCandidateRow = {
  id: string
  user_id: string
  entry_date: string
  card_name: string
  is_reversed: boolean
  streak_count: number
  reminder_email: string | null
  reminder_time: string
  reminder_timezone: string
  reminder_last_sent_on: string | null
  reminder_send_count: number | null
}

export type ReminderDatabaseAccessMode = "missing_database_access" | "service_role_rpc" | "edge_function" | "unavailable"

const reminderEdgeFunctionName = "poptarot-daily-reminders"

function cronSecret() {
  return process.env.CRON_SECRET || ""
}

export function hasReminderCronSecret() {
  return Boolean(cronSecret())
}

function reminderEdgeFunctionUrl() {
  const functionsUrl = process.env.SUPABASE_FUNCTIONS_URL || `${getSupabaseUrl()}/functions/v1`
  return `${functionsUrl.replace(/\/$/, "")}/${reminderEdgeFunctionName}`
}

function hasReminderEdgeFunctionConfig() {
  if (!hasReminderCronSecret()) return false
  try {
    reminderEdgeFunctionUrl()
    return true
  } catch {
    return false
  }
}

export function configuredReminderDatabaseAccessMode(): ReminderDatabaseAccessMode {
  if (hasSupabaseServiceKey()) return "service_role_rpc"
  if (hasReminderEdgeFunctionConfig()) return "edge_function"
  return "missing_database_access"
}

async function callReminderEdgeFunction<T>(action: string, payload: Record<string, unknown> = {}) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  const response = await fetch(reminderEdgeFunctionUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-cron-secret": secret,
    },
    body: JSON.stringify({ action, ...payload }),
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data?.ok === false) {
    throw new Error(typeof data?.error === "string" ? data.error : `Daily reminder edge function failed: ${action}`)
  }

  return data as T
}

async function checkDailyReminderDatabaseAccessViaServiceRole(secret: string) {
  const { data, error } = await createServiceSupabase().rpc("daily_tarot_reminder_database_ready", {
    p_secret: secret,
  })

  if (error) return false
  return data === true
}

async function checkDailyReminderUnsubscribeAccessViaServiceRole(secret: string) {
  const { data, error } = await createServiceSupabase().rpc("disable_daily_tarot_reminders", {
    p_secret: secret,
    p_user_id: "00000000-0000-0000-0000-000000000000",
  })

  if (error) return false
  return typeof data === "number"
}

export async function checkDailyReminderDatabaseAccess() {
  const secret = cronSecret()
  if (!secret) return false

  try {
    if (hasSupabaseServiceKey()) return checkDailyReminderDatabaseAccessViaServiceRole(secret)

    const data = await callReminderEdgeFunction<{ ready?: boolean }>("database_ready")
    return data.ready === true
  } catch {
    return false
  }
}

export async function checkDailyReminderUnsubscribeAccess() {
  const secret = cronSecret()
  if (!secret) return false

  try {
    if (hasSupabaseServiceKey()) return checkDailyReminderUnsubscribeAccessViaServiceRole(secret)

    const data = await callReminderEdgeFunction<{ disabled_count?: number }>("unsubscribe_ready")
    return typeof data.disabled_count === "number"
  } catch {
    return false
  }
}

export async function listDailyReminderCandidates(limit = 2000) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  if (!hasSupabaseServiceKey()) {
    const response = await callReminderEdgeFunction<{ data?: ReminderCandidateRow[] }>("candidates", { limit })
    return response.data || []
  }

  const { data, error } = await createServiceSupabase().rpc("daily_tarot_reminder_candidates", {
    p_secret: secret,
    p_limit: limit,
  })

  if (error) throw new Error(error.message)
  return (data || []) as ReminderCandidateRow[]
}

export async function markDailyReminderSent(entryId: string, sentOn: string) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  if (!hasSupabaseServiceKey()) {
    const response = await callReminderEdgeFunction<{ updated?: boolean }>("mark_sent", {
      entry_id: entryId,
      sent_on: sentOn,
    })
    if (response.updated !== true) throw new Error("Daily reminder entry was not updated")
    return
  }

  const { data, error } = await createServiceSupabase().rpc("mark_daily_tarot_reminder_sent", {
    p_secret: secret,
    p_entry_id: entryId,
    p_sent_on: sentOn,
  })

  if (error) throw new Error(error.message)
  if (data !== true) throw new Error("Daily reminder entry was not updated")
}

export async function markDailyReminderFailed(entryId: string, errorMessage: string) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  if (!hasSupabaseServiceKey()) {
    await callReminderEdgeFunction("mark_failed", {
      entry_id: entryId,
      error: errorMessage,
    })
    return
  }

  const { error } = await createServiceSupabase().rpc("mark_daily_tarot_reminder_failed", {
    p_secret: secret,
    p_entry_id: entryId,
    p_error: errorMessage,
  })

  if (error) throw new Error(error.message)
}

export async function disableDailyReminders(userId: string) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  if (!hasSupabaseServiceKey()) {
    const response = await callReminderEdgeFunction<{ disabled_count?: number }>("disable", {
      user_id: userId,
    })
    return Number(response.disabled_count || 0)
  }

  const { data, error } = await createServiceSupabase().rpc("disable_daily_tarot_reminders", {
    p_secret: secret,
    p_user_id: userId,
  })

  if (error) throw new Error(error.message)
  return typeof data === "number" ? data : Number(data || 0)
}
