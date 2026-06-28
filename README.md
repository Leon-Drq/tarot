# POPTarot

POPTarot is a Next.js tarot reading app. The old Flask/MySQL backend has been removed from this repository.

## Current Architecture

- Frontend: Next.js App Router
- AI reading API: `app/api/reading/route.ts`
- AI provider: OpenAI Responses API
- User data, credits, readings, orders, and membership state: Supabase
- Payment: existing Z-pay/Alipay flow, with Supabase Edge Functions for fulfillment
- Optional future payment: Stripe

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the OpenAI, Supabase, and payment variables in `.env.local` before testing the full app.

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.2
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_for_cron_jobs
SUPABASE_FUNCTIONS_URL=your_supabase_functions_url
POPTAROT_FULFILLMENT_SECRET=server_to_edge_function_secret
CRON_SECRET=shared_secret_for_vercel_cron_authorization
DAILY_TAROT_UNSUBSCRIBE_SECRET=optional_separate_secret_for_reminder_unsubscribe_links
RESEND_API_KEY=your_resend_api_key_for_daily_tarot_reminders
RESEND_FROM_EMAIL="POPTarot <daily@poptarot.com>"
RESEND_REPLY_TO=optional_support_or_reply_email
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/your_verified_handle
NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@your_verified_handle
NEXT_PUBLIC_X_URL=https://x.com/your_verified_handle
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/@your_verified_handle
NEXT_PUBLIC_PINTEREST_URL=https://www.pinterest.com/your_verified_handle
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/your_verified_page
ZPAY_PID=your_zpay_pid
ZPAY_KEY=your_zpay_key
ZPAY_API_URL=https://zpayz.cn/submit.php
ZPAY_QUERY_URL=https://zpayz.cn/api.php
```

Stripe variables are optional until the Stripe payment flow is implemented.

Daily Tarot email reminders require the Vercel cron in `vercel.json`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` in the Vercel Production environment. `DAILY_TAROT_UNSUBSCRIBE_SECRET` is optional; when omitted, unsubscribe links fall back to `CRON_SECRET` for signing. Without the required variables, users can still save local reminders, download a calendar reminder, and keep daily journal entries, but scheduled reminder emails cannot be delivered.

Production reminder setup:

```bash
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel env add RESEND_API_KEY production
npx vercel env add RESEND_FROM_EMAIL production
npx vercel env add CRON_SECRET production
npx vercel env add DAILY_TAROT_UNSUBSCRIBE_SECRET production
npx vercel deploy --prod
```

After deployment, check:

```bash
REMINDER_CHECK_BASE_URL=https://poptarot.com npm run check:reminders
PWA_CHECK_BASE_URL=https://poptarot.com npm run check:pwa
```

`can_send_email_reminders` and `unsubscribe_configured` should be `true` before the site promises scheduled email delivery. Use `REMINDER_CHECK_BASE_URL=https://poptarot.com npm run check:reminders:strict` when you want the command to fail until all scheduled email capabilities are active. The script also accepts `CHECK_REMINDER_APP_URL` for the same target URL.

Official social profiles are optional but should be configured as full `https://` URLs only after the account is active and links back to poptarot.com. Configured profiles appear on `/official-channels` and in Organization structured data as `sameAs` brand signals.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run check:seo
PWA_CHECK_BASE_URL=http://localhost:3001 npm run check:pwa
REMINDER_CHECK_BASE_URL=https://poptarot.com npm run check:reminders
```
