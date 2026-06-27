const {
  isDailyReminderDue,
  localReminderParts,
  newestReminderPerUser,
  reminderMinutes,
} = await import("../lib/server/daily-reminder-schedule.ts")

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message}: expected ${expected}, received ${actual}`)
}

const newYorkMidnight = new Date("2026-06-27T04:30:00Z")
const newYorkParts = localReminderParts("America/New_York", newYorkMidnight)

assertEqual(newYorkParts.date, "2026-06-27", "New York local date")
assertEqual(newYorkParts.minutes, 30, "New York 00:30 must not normalize to 24:30")
assertEqual(reminderMinutes(null), 8 * 60 + 30, "default reminder time")
assertEqual(reminderMinutes("25:99"), 23 * 60 + 59, "out-of-range reminder time clamp")

const baseRow = {
  reminder_timezone: "America/New_York",
  reminder_last_sent_on: null,
  reminder_time: "08:30",
}

assert(!isDailyReminderDue(baseRow, newYorkMidnight), "08:30 reminder must not be due at 00:30")
assert(isDailyReminderDue({ ...baseRow, reminder_time: "00:15" }, newYorkMidnight), "00:15 reminder should be due at 00:30")
assert(
  !isDailyReminderDue({ ...baseRow, reminder_last_sent_on: "2026-06-27", reminder_time: "00:15" }, newYorkMidnight),
  "already-sent reminder must not repeat on the same local date",
)
assert(isDailyReminderDue({ ...baseRow, reminder_timezone: "Invalid/Zone", reminder_time: "04:00" }, newYorkMidnight), "invalid time zone should fall back to UTC")

const newest = newestReminderPerUser([
  { user_id: "a", id: "latest-a" },
  { user_id: "b", id: "latest-b" },
  { user_id: "a", id: "older-a" },
])
assertEqual(newest.length, 2, "newest reminder per user count")
assertEqual(newest[0].id, "latest-a", "newest reminder per user preserves first row")

console.log("Reminder schedule checks passed.")
