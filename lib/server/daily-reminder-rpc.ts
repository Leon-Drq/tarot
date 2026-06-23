import { createAnonSupabase } from "@/lib/server/supabase"

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

function cronSecret() {
  return process.env.CRON_SECRET || ""
}

export function hasReminderCronSecret() {
  return Boolean(cronSecret())
}

export async function checkDailyReminderDatabaseAccess() {
  const secret = cronSecret()
  if (!secret) return false

  try {
    const { data, error } = await createAnonSupabase().rpc("daily_tarot_reminder_database_ready", {
      p_secret: secret,
    })

    if (error) return false
    return data === true
  } catch {
    return false
  }
}

export async function checkDailyReminderUnsubscribeAccess() {
  const secret = cronSecret()
  if (!secret) return false

  try {
    const { data, error } = await createAnonSupabase().rpc("disable_daily_tarot_reminders", {
      p_secret: secret,
      p_user_id: "00000000-0000-0000-0000-000000000000",
    })

    if (error) return false
    return typeof data === "number"
  } catch {
    return false
  }
}

export async function listDailyReminderCandidates(limit = 2000) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  const { data, error } = await createAnonSupabase().rpc("daily_tarot_reminder_candidates", {
    p_secret: secret,
    p_limit: limit,
  })

  if (error) throw new Error(error.message)
  return (data || []) as ReminderCandidateRow[]
}

export async function markDailyReminderSent(entryId: string, sentOn: string) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  const { data, error } = await createAnonSupabase().rpc("mark_daily_tarot_reminder_sent", {
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

  const { error } = await createAnonSupabase().rpc("mark_daily_tarot_reminder_failed", {
    p_secret: secret,
    p_entry_id: entryId,
    p_error: errorMessage,
  })

  if (error) throw new Error(error.message)
}

export async function disableDailyReminders(userId: string) {
  const secret = cronSecret()
  if (!secret) throw new Error("Missing CRON_SECRET")

  const { data, error } = await createAnonSupabase().rpc("disable_daily_tarot_reminders", {
    p_secret: secret,
    p_user_id: userId,
  })

  if (error) throw new Error(error.message)
  return typeof data === "number" ? data : Number(data || 0)
}
