import { verifyDailyReminderUnsubscribeToken } from "@/lib/server/daily-reminder-unsubscribe"
import { createServiceSupabase, hasSupabaseServiceKey } from "@/lib/server/supabase"

function htmlResponse(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#080310;color:#f8f4ff;font-family:Inter,Arial,sans-serif;">
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px;">
      <section style="width:min(100%,520px);border:1px solid rgba(201,192,255,.2);border-radius:14px;background:rgba(255,255,255,.04);padding:28px;box-shadow:0 24px 70px rgba(0,0,0,.35);">
        <p style="margin:0 0 12px;color:#c9c0ff;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">POPTarot Daily</p>
        <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:32px;line-height:1.15;">${title}</h1>
        <p style="margin:0;color:#cfc4dc;font-size:15px;line-height:1.7;">${body}</p>
        <a href="/daily-tarot" style="display:inline-block;margin-top:22px;border:1px solid rgba(201,192,255,.35);border-radius:10px;color:#f8f4ff;text-decoration:none;padding:12px 16px;font-size:14px;">Open Daily Tarot</a>
      </section>
    </main>
  </body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  )
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("u") || ""
  const token = url.searchParams.get("t") || ""

  if (!userId || !token) {
    return htmlResponse("Invalid unsubscribe link", "This reminder link is missing required information.", 400)
  }

  let isValid = false
  try {
    isValid = verifyDailyReminderUnsubscribeToken(userId, token)
  } catch {
    isValid = false
  }

  if (!isValid) {
    return htmlResponse("Invalid unsubscribe link", "This reminder link is expired or could not be verified.", 400)
  }

  if (!hasSupabaseServiceKey()) {
    return htmlResponse("Reminder settings unavailable", "Please open Daily Tarot and update your reminder preferences there.", 503)
  }

  const supabase = createServiceSupabase()
  const { data, error } = await supabase
    .from("daily_tarot_entries")
    .update({ reminder_enabled: false })
    .eq("user_id", userId)
    .eq("reminder_enabled", true)
    .select("id")

  if (error) {
    return htmlResponse("Could not turn off reminders", "Please open Daily Tarot and update your reminder preferences there.", 500)
  }

  const count = data?.length || 0
  const body =
    count > 0
      ? "Daily Tarot email reminders have been turned off for this account. You can turn them back on from Daily Tarot anytime."
      : "Daily Tarot email reminders were already turned off for this account."

  return htmlResponse("Reminders turned off", body)
}
