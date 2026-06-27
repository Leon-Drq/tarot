import type { ReminderCandidateRow } from "./daily-reminder-rpc"

export type ReminderClockParts = {
  date: string
  minutes: number
}

function localDateTimeParts(timeZone: string, now: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })

  return Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]))
}

export function localReminderParts(timeZone = "UTC", now = new Date()): ReminderClockParts {
  let parts: Record<string, string>
  try {
    parts = localDateTimeParts(timeZone || "UTC", now)
  } catch {
    parts = localDateTimeParts("UTC", now)
  }

  const rawHour = Number(parts.hour || 0)
  const hour = rawHour === 24 ? 0 : Math.max(0, Math.min(23, rawHour))
  const minute = Math.max(0, Math.min(59, Number(parts.minute || 0)))

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: hour * 60 + minute,
  }
}

export function reminderMinutes(value: string | null | undefined) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || "")
  if (!match) return 8 * 60 + 30
  return Math.min(23, Number(match[1])) * 60 + Math.min(59, Number(match[2]))
}

export function isDailyReminderDue(row: Pick<ReminderCandidateRow, "reminder_timezone" | "reminder_last_sent_on" | "reminder_time">, now = new Date()) {
  const { date, minutes } = localReminderParts(row.reminder_timezone || "UTC", now)
  if (row.reminder_last_sent_on === date) return false
  return minutes >= reminderMinutes(row.reminder_time)
}

export function newestReminderPerUser<T extends Pick<ReminderCandidateRow, "user_id">>(rows: T[]) {
  const seen = new Set<string>()
  const result: T[] = []
  for (const row of rows) {
    if (seen.has(row.user_id)) continue
    seen.add(row.user_id)
    result.push(row)
  }
  return result
}
