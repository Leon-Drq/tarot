import { hasEmailProvider } from "@/lib/server/email"
import { hasSupabaseServiceKey } from "@/lib/server/supabase"

export async function GET() {
  return Response.json(
    {
      email_delivery_enabled: hasEmailProvider() && hasSupabaseServiceKey(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}
