import { hasEmailProvider } from "@/lib/server/email"
import { hasSupabaseServiceKey } from "@/lib/server/supabase"

export async function GET() {
  const emailProviderConfigured = hasEmailProvider()
  const serviceDatabaseConfigured = hasSupabaseServiceKey()
  const cronSecretConfigured = Boolean(process.env.CRON_SECRET)
  const scheduledDeliveryEnabled = emailProviderConfigured && serviceDatabaseConfigured && cronSecretConfigured
  const missingCapabilities = [
    !emailProviderConfigured ? "email_provider" : null,
    !serviceDatabaseConfigured ? "service_database" : null,
    !cronSecretConfigured ? "cron_authorization" : null,
  ].filter((item): item is string => Boolean(item))

  return Response.json(
    {
      email_delivery_enabled: emailProviderConfigured && serviceDatabaseConfigured,
      scheduled_delivery_enabled: scheduledDeliveryEnabled,
      can_send_email_reminders: scheduledDeliveryEnabled,
      calendar_reminder_available: true,
      setup_required: !scheduledDeliveryEnabled,
      email_provider_configured: emailProviderConfigured,
      service_database_configured: serviceDatabaseConfigured,
      cron_authorization_configured: cronSecretConfigured,
      cron_path_configured: true,
      missing_capabilities: missingCapabilities,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}
