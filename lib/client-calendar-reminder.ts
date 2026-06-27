export type DailyReturnCalendarInput = {
  time: string
  summary: string
  description: string
  url?: string
  filename?: string
}

export function getClientTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

function padCalendarNumber(value: number) {
  return String(value).padStart(2, "0")
}

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

function formatCalendarDateTime(date: Date, utc = false) {
  const source = utc
    ? {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
      }
    : {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      }

  return `${source.year}${padCalendarNumber(source.month)}${padCalendarNumber(source.day)}T${padCalendarNumber(source.hour)}${padCalendarNumber(source.minute)}${padCalendarNumber(source.second)}${utc ? "Z" : ""}`
}

function getReminderStartDate(time: string) {
  const [rawHour, rawMinute] = time.split(":")
  const hour = Number(rawHour)
  const minute = Number(rawMinute)
  const next = new Date()
  next.setHours(Number.isFinite(hour) ? hour : 8, Number.isFinite(minute) ? minute : 30, 0, 0)
  if (next.getTime() < Date.now() - 60_000) next.setDate(next.getDate() + 1)
  return next
}

export function createDailyReturnCalendar(input: DailyReturnCalendarInput) {
  const timezone = getClientTimezone()
  const calendarTimezone = timezone.replace(/[";:,]/g, "-")
  const safeTimezone = timezone.replace(/[^A-Za-z0-9_-]/g, "-")
  const start = getReminderStartDate(input.time)
  const url = input.url || "https://poptarot.com/daily-tarot"
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//POPTarot//Daily Tarot//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:POPTarot Daily Tarot",
    `X-WR-TIMEZONE:${calendarTimezone}`,
    "BEGIN:VEVENT",
    `UID:poptarot-daily-tarot-${input.time.replace(/[^0-9]/g, "")}-${safeTimezone}@poptarot.com`,
    `DTSTAMP:${formatCalendarDateTime(new Date(), true)}`,
    `DTSTART;TZID=${calendarTimezone}:${formatCalendarDateTime(start)}`,
    "DURATION:PT10M",
    "RRULE:FREQ=DAILY;INTERVAL=1",
    `SUMMARY:${escapeCalendarText(input.summary)}`,
    `DESCRIPTION:${escapeCalendarText(input.description)}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-PT10M",
    `DESCRIPTION:${escapeCalendarText(input.summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `${lines.join("\r\n")}\r\n`
}

export function downloadDailyReturnCalendar(input: DailyReturnCalendarInput) {
  const calendar = createDailyReturnCalendar(input)
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = input.filename || "poptarot-daily-tarot.ics"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
