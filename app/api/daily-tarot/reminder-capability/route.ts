import { emailProviderStatus, hasEmailProvider } from "@/lib/server/email"
import { hasSupabaseServiceKey } from "@/lib/server/supabase"
import {
  checkDailyReminderDatabaseAccess,
  checkDailyReminderUnsubscribeAccess,
  hasReminderCronSecret,
} from "@/lib/server/daily-reminder-rpc"

export async function GET() {
  const providerStatus = emailProviderStatus()
  const emailProviderConfigured = hasEmailProvider()
  const cronSecretConfigured = hasReminderCronSecret()
  const serverServiceKeyConfigured = hasSupabaseServiceKey()
  const databaseRpcAccessible = serverServiceKeyConfigured ? await checkDailyReminderDatabaseAccess() : false
  const unsubscribeRpcAccessible = serverServiceKeyConfigured ? await checkDailyReminderUnsubscribeAccess() : false
  const scheduledDeliveryEnabled =
    emailProviderConfigured && serverServiceKeyConfigured && databaseRpcAccessible && cronSecretConfigured && unsubscribeRpcAccessible
  const missingCapabilities = [
    !emailProviderConfigured ? "email_provider" : null,
    !serverServiceKeyConfigured ? "service_role_key" : null,
    serverServiceKeyConfigured && !databaseRpcAccessible ? "service_database" : null,
    !cronSecretConfigured ? "cron_authorization" : null,
    serverServiceKeyConfigured && !unsubscribeRpcAccessible ? "unsubscribe_rpc" : null,
  ].filter((item): item is string => Boolean(item))
  const nextSetupStep =
    missingCapabilities.length > 1
      ? `Complete reminder setup: ${missingCapabilities.join(", ")}.`
      : missingCapabilities[0] === "email_provider"
        ? "Add RESEND_API_KEY to the Vercel Production environment, then redeploy."
        : missingCapabilities[0] === "service_role_key"
          ? "Add SUPABASE_SERVICE_ROLE_KEY to the Vercel Production environment, then redeploy."
          : missingCapabilities[0] === "service_database"
            ? "Deploy the daily reminder Supabase RPC helpers and verify CRON_SECRET matches."
            : missingCapabilities[0] === "cron_authorization"
              ? "Add CRON_SECRET to the Vercel Production environment."
              : missingCapabilities[0] === "unsubscribe_rpc"
                ? "Deploy the unsubscribe RPC helper before enabling scheduled email delivery."
                : "Scheduled Daily Tarot email reminders are ready."

  return Response.json(
    {
      email_delivery_enabled: emailProviderConfigured && serverServiceKeyConfigured && databaseRpcAccessible && unsubscribeRpcAccessible,
      scheduled_delivery_enabled: scheduledDeliveryEnabled,
      can_send_email_reminders: scheduledDeliveryEnabled,
      calendar_reminder_available: true,
      setup_required: !scheduledDeliveryEnabled,
      email_provider_configured: emailProviderConfigured,
      email_provider: providerStatus.provider,
      email_provider_status: providerStatus,
      email_from_configured: providerStatus.from_configured,
      email_reply_to_configured: providerStatus.reply_to_configured,
      server_service_key_configured: serverServiceKeyConfigured,
      database_rpc_accessible: databaseRpcAccessible,
      service_database_configured: databaseRpcAccessible,
      unsubscribe_rpc_accessible: unsubscribeRpcAccessible,
      unsubscribe_configured: unsubscribeRpcAccessible,
      reminder_database_access_mode: !serverServiceKeyConfigured
        ? "missing_service_role_key"
        : databaseRpcAccessible
          ? "service_role_rpc"
          : "unavailable",
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
