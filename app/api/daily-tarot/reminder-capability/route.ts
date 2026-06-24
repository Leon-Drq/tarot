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
  const nextSetupStep =
    missingCapabilities[0] === "email_provider"
      ? "Add RESEND_API_KEY to the Vercel Production environment, then redeploy."
      : missingCapabilities[0] === "service_database"
        ? "Deploy the daily reminder Supabase RPC helpers and verify CRON_SECRET matches."
        : missingCapabilities[0] === "cron_authorization"
          ? "Add CRON_SECRET to the Vercel Production environment."
          : missingCapabilities[0] === "unsubscribe_rpc"
            ? "Deploy the unsubscribe RPC helper before enabling scheduled email delivery."
            : "Scheduled Daily Tarot email reminders are ready."

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
      delivery_status: scheduledDeliveryEnabled ? "ready" : "setup_required",
      next_setup_step: nextSetupStep,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}
