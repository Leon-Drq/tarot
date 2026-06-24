const args = new Set(process.argv.slice(2))
const strict = args.has("--strict")
const scriptName = "check-reminder-capability"
const appUrl = process.env.CHECK_REMINDER_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
const url = `${appUrl.replace(/\/$/, "")}/api/daily-tarot/reminder-capability`

function line(label, value) {
  console.log(`${label.padEnd(32)} ${value}`)
}

try {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || `Capability check failed with HTTP ${response.status}`)
  }

  console.log(`${scriptName}: ${url}`)
  line("delivery_status", data.delivery_status || "unknown")
  line("can_send_email_reminders", String(Boolean(data.can_send_email_reminders)))
  line("email_provider_configured", String(Boolean(data.email_provider_configured)))
  line("service_database_configured", String(Boolean(data.service_database_configured)))
  line("cron_authorization_configured", String(Boolean(data.cron_authorization_configured)))
  line("unsubscribe_configured", String(Boolean(data.unsubscribe_configured)))
  line("calendar_reminder_available", String(Boolean(data.calendar_reminder_available)))

  const missing = Array.isArray(data.missing_capabilities) ? data.missing_capabilities : []
  if (missing.length > 0) {
    line("missing_capabilities", missing.join(", "))
  }
  if (data.next_setup_step) {
    line("next_setup_step", data.next_setup_step)
  }

  if (strict && !data.can_send_email_reminders) {
    process.exitCode = 1
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
