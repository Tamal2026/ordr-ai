# OrdR AI

Voice-first booking assistant. Say what you need, get 3 matched slots, book in one tap.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

`.env.local` is already included with your n8n production webhook URL:

```
N8N_WEBHOOK_URL=https://n8n.srv1106977.hstgr.cloud/webhook/2b5aeb9a-d55a-405a-b667-87ad9c331473
```

If you rotate your n8n webhook, update this value and restart `npm run dev`
(Next.js only reads `.env.local` at server start).

## How a request flows

```
Browser (VoiceOrb / VoicePlayground)
  → POST /api/voice-intent   (app/api/voice-intent/route.ts)
    → POST N8N_WEBHOOK_URL   (your n8n workflow)
      Webhook trigger → Validate Payload → If → AI Intent Parser
      → Reconcile Intent → Get row(s) in sheet → Filter and Rank
      → Respond to Webhook
  ← { products: ServiceMatch[] }
→ ResultGrid renders top 3 matches
```

## Project structure

- `app/page.tsx` — landing page, wires everything together
- `app/api/voice-intent/route.ts` — forwards intent payload to n8n
- `components/CategorySelector.tsx` — Medical / Barber / Legal / Restaurant pills
- `components/VoiceOrb.tsx` — mic button + live waveform (Web Speech API)
- `components/VoicePlayground.tsx` — typed sample-request tester
- `components/ResultGrid.tsx` / `ResultCard.tsx` — top-3 match cards
- `components/ArchitectureDiagram.tsx` — pipeline explainer for recruiters
- `lib/webhook.ts` — intent parsing + `/api/voice-intent` call
- `lib/types.ts` — shared TypeScript types
