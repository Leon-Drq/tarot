import "jsr:@supabase/functions-js/edge-runtime.d.ts"

declare const Deno: {
  env: {
    get(name: string): string | undefined
  }
  serve(handler: (req: Request) => Response | Promise<Response>): void
}

type ReminderAction =
  | "database_ready"
  | "unsubscribe_ready"
  | "candidates"
  | "mark_sent"
  | "mark_failed"
  | "disable"

const jsonHeaders = {
  "Content-Type": "application/json",
  "Connection": "keep-alive",
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  })
}

function supabaseUrl() {
  const url = Deno.env.get("SUPABASE_URL")
  if (!url) throw new Error("Missing SUPABASE_URL")
  return url.replace(/\/$/, "")
}

function supabaseAdminKey() {
  const legacyServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (legacyServiceRole) return legacyServiceRole

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS")
  if (secretKeys) {
    const parsed = JSON.parse(secretKeys) as Record<string, string>
    if (parsed.default) return parsed.default
  }

  throw new Error("Missing Supabase admin key")
}

function rpcHeaders(adminKey: string) {
  const headers: Record<string, string> = {
    ...jsonHeaders,
    apikey: adminKey,
  }

  if (!adminKey.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${adminKey}`
  }

  return headers
}

async function rpc<T>(name: string, args: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl()}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: rpcHeaders(supabaseAdminKey()),
    body: JSON.stringify(args),
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : `Supabase RPC ${name} failed`
    throw new Error(message)
  }

  return data as T
}

async function handleAction(action: ReminderAction, secret: string, body: Record<string, unknown>) {
  if (!secret) return json({ ok: false, error: "Unauthorized" }, 401)

  if (action === "database_ready") {
    const ready = await rpc<boolean>("daily_tarot_reminder_database_ready", { p_secret: secret })
    return json({ ok: ready === true, ready: ready === true }, ready === true ? 200 : 401)
  }

  if (action === "unsubscribe_ready") {
    const count = await rpc<number>("disable_daily_tarot_reminders", {
      p_secret: secret,
      p_user_id: "00000000-0000-0000-0000-000000000000",
    })
    return json({ ok: typeof count === "number", disabled_count: count })
  }

  if (action === "candidates") {
    const limit = Number.isFinite(Number(body.limit)) ? Number(body.limit) : 2000
    const data = await rpc<unknown[]>("daily_tarot_reminder_candidates", {
      p_secret: secret,
      p_limit: Math.min(Math.max(Math.trunc(limit), 0), 5000),
    })
    return json({ ok: true, data })
  }

  if (action === "mark_sent") {
    const entryId = typeof body.entry_id === "string" ? body.entry_id : ""
    const sentOn = typeof body.sent_on === "string" ? body.sent_on : ""
    if (!entryId || !sentOn) return json({ ok: false, error: "Missing entry_id or sent_on" }, 400)

    const updated = await rpc<boolean>("mark_daily_tarot_reminder_sent", {
      p_secret: secret,
      p_entry_id: entryId,
      p_sent_on: sentOn,
    })
    return json({ ok: updated === true, updated }, updated === true ? 200 : 404)
  }

  if (action === "mark_failed") {
    const entryId = typeof body.entry_id === "string" ? body.entry_id : ""
    const errorMessage = typeof body.error === "string" ? body.error : "Unknown email error"
    if (!entryId) return json({ ok: false, error: "Missing entry_id" }, 400)

    const updated = await rpc<boolean>("mark_daily_tarot_reminder_failed", {
      p_secret: secret,
      p_entry_id: entryId,
      p_error: errorMessage.slice(0, 500),
    })
    return json({ ok: updated === true, updated }, updated === true ? 200 : 404)
  }

  if (action === "disable") {
    const userId = typeof body.user_id === "string" ? body.user_id : ""
    if (!userId) return json({ ok: false, error: "Missing user_id" }, 400)

    const count = await rpc<number>("disable_daily_tarot_reminders", {
      p_secret: secret,
      p_user_id: userId,
    })
    return json({ ok: true, disabled_count: Number(count || 0) })
  }

  return json({ ok: false, error: "Unknown action" }, 400)
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return json({ ok: true })
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405)

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const action = String(body.action || "database_ready") as ReminderAction
    const secret = req.headers.get("x-cron-secret") || (typeof body.secret === "string" ? body.secret : "")
    return await handleAction(action, secret, body)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Daily reminder function failed"
    return json({ ok: false, error: message }, 500)
  }
})
