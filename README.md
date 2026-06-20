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
SUPABASE_FUNCTIONS_URL=your_supabase_functions_url
POPTAROT_FULFILLMENT_SECRET=server_to_edge_function_secret
ZPAY_PID=your_zpay_pid
ZPAY_KEY=your_zpay_key
ZPAY_API_URL=https://zpayz.cn/submit.php
ZPAY_QUERY_URL=https://zpayz.cn/api.php
```

Stripe variables are optional until the Stripe payment flow is implemented.

## Scripts

```bash
npm run dev
npm run build
npm run start
```
