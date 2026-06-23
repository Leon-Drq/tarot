import { hasEmailProvider } from "@/lib/server/email"
import {
  checkDailyReminderDatabaseAccess,
  checkDailyReminderUnsubscribeAccess,
  hasReminderCronSecret,
} from "@/lib/server/daily-reminder-rpc"

export async function GET() {
  const emailProviderConfigured = hasEmailProvider()
  const cronSecretConfigured = hasReminderCronSecret()
  const serviceDatabaseConfigured = await checkDailyReminderDatabaseAccess()
  const unsubscribeConfigured = await checkDailyReminderUnsubscribeAccess()
  const scheduledDeliveryEnabled = emailProviderConfigured && serviceDatabaseConfigured && cronSecretConfigured && unsubscribeConfigured
  const missingCapabilities = [
    !emailProviderConfigured ? "email_provider" : null,
    !serviceDatabaseConfigured ? "service_database" : null,
    !cronSecretConfigured ? "cron_authorization" : null,
    !unsubscribeConfigured ? "unsubscribe_rpc" : null,
  ].filter((item): item is string => Boolean(item))

  return Response.json(
    {
      email_delivery_enabled: emailProviderConfigured && serviceDatabaseConfigured && unsubscribeConfigured,
      scheduled_delivery_enabled: scheduledDeliveryEnabled,
      can_send_email_reminders: scheduledDeliveryEnabled,
      calendar_reminder_available: true,
      setup_required: !scheduledDeliveryEnabled,
      email_provider_configured: emailProviderConfigured,
      service_database_configured: serviceDatabaseConfigured,
      unsubscribe_configured: unsubscribeConfigured,
      reminder_database_access_mode: serviceDatabaseConfigured ? "cron_secret_rpc" : "unavailable",
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
