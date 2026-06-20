# POPTarot

POPTarot is a Next.js tarot reading app. The old Flask/MySQL backend has been removed from this repository.

## Current Architecture

- Frontend: Next.js App Router
- AI reading API: `app/api/reading/route.ts`
- AI provider: OpenAI Responses API
- Planned user data: Supabase
- Planned membership/payment: Stripe

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` in `.env.local` before testing AI readings.

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.2
```

Supabase and Stripe keys are listed in `.env.example` for the next backend iteration, but they are not required for the current AI reading route.

## Scripts

```bash
npm run dev
npm run build
npm run start
```
