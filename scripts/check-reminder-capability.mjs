const args = new Set(process.argv.slice(2))
const strict = args.has("--strict")
const checkCron = args.has("--cron") || args.has("--cron-dry-run")
const sendTest = args.has("--send-test")
const scriptName = "check-reminder-capability"
const appUrl =
  process.env.CHECK_REMINDER_APP_URL ||
  process.env.REMINDER_CHECK_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://poptarot.com"
const rootUrl = appUrl.replace(/\/$/, "")
const url = `${rootUrl}/api/daily-tarot/reminder-capability`
const cronDryRunUrl = `${rootUrl}/api/cron/daily-tarot-reminders?dry_run=1`
const testEmailUrl = `${rootUrl}/api/cron/daily-tarot-reminders/test`

function line(label, value) {
  console.log(`${label.padEnd(32)} ${value}`)
}

async function checkCronDryRun() {
  const secret = process.env.CHECK_REMINDER_CRON_SECRET || process.env.CRON_SECRET || ""
  if (!secret) {
    throw new Error("Missing CHECK_REMINDER_CRON_SECRET for --cron dry-run check")
  }

  const response = await fetch(cronDryRunUrl, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${secret}`,
    },
    cache: "no-store",
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || `Cron dry-run failed with HTTP ${response.status}`)
  }
  if (data?.dry_run !== true) {
    throw new Error("Cron dry-run endpoint did not report dry_run=true")
  }

  console.log("")
  console.log(`daily-reminder-cron-dry-run: ${cronDryRunUrl}`)
  line("cron_dry_run", String(Boolean(data.dry_run)))
  line("cron_scanned", String(Number(data.scanned || 0)))
  line("cron_due", String(Number(data.due || 0)))
  line("cron_sent", String(Number(data.sent || 0)))
  line("cron_failed", String(Number(data.failed || 0)))
  line("cron_email_provider_configured", String(Boolean(data.email_provider_configured)))
  line("cron_email_provider", data.email_provider?.provider || data.email_provider || "unknown")
}

async function sendReminderTestEmail() {
  const secret = process.env.CHECK_REMINDER_CRON_SECRET || process.env.CRON_SECRET || ""
  const to = process.env.CHECK_REMINDER_TEST_EMAIL || ""
  if (!secret) {
    throw new Error("Missing CHECK_REMINDER_CRON_SECRET for --send-test")
  }
  if (!to) {
    throw new Error("Missing CHECK_REMINDER_TEST_EMAIL for --send-test")
  }

  const response = await fetch(testEmailUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to }),
    cache: "no-store",
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.error || `Reminder test email failed with HTTP ${response.status}`)
  }

  console.log("")
  console.log(`daily-reminder-test-email: ${testEmailUrl}`)
  line("test_email_sent", String(Boolean(data.ok)))
  line("test_email_to", data.to || "unknown")
  line("test_email_provider", data.provider?.provider || data.provider || "unknown")
  line("test_email_id", data.email_id || "unknown")
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
  line("email_provider", data.email_provider || data.email_provider_status?.provider || "unknown")
  line("email_provider_configured", String(Boolean(data.email_provider_configured)))
  line("email_from_configured", String(Boolean(data.email_from_configured)))
  line("email_reply_to_configured", String(Boolean(data.email_reply_to_configured)))
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

  if (checkCron) {
    await checkCronDryRun()
  }

  if (sendTest) {
    await sendReminderTestEmail()
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
