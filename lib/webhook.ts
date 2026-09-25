import type { Category, VoiceIntent, WebhookPayload, ServiceMatch } from "./types";

/**
 * Client-side transcript parsing. Runs before the network call so the UI can
 * show an "understood" state instantly. n8n's LLM step (Groq/OpenAI) re-confirms
 * this server-side, and Reconcile Intent merges the two.
 */

const CATEGORY_MAP: Record<Category, string[]> = {
  medical: ["doctor", "clinic", "appointment", "checkup", "dentist", "pediatrician", "follow-up", "follow up"],
  barber: ["haircut", "barber", "fade", "trim", "beard", "shave"],
  legal: ["lawyer", "legal", "consultation", "contract", "lease", "attorney", "dispute"],
  restaurant: ["table", "restaurant", "reservation", "dinner", "reserve", "seating"],
};

function extractBudget(text: string): number | null {
  const match = text.match(/(?:\$|under|below|less than)\s?(\d+(?:\.\d{1,2})?)/i);
  return match ? parseFloat(match[1]) : null;
}

function extractRating(text: string): number | null {
  const match = text.match(/(\d(?:\.\d)?)\s?(?:\+|stars?|star)?\s*(?:rating|rated)?/i);
  if (!match) return null;
  const val = parseFloat(match[1]);
  return val >= 1 && val <= 5 ? val : null;
}

function extractCategory(text: string): Category | null {
  const lower = text.toLowerCase();
  for (const [category, terms] of Object.entries(CATEGORY_MAP) as [Category, string[]][]) {
    if (terms.some((term) => lower.includes(term))) return category;
  }
  return null;
}

function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    "i", "want", "to", "show", "me", "the", "a", "with", "for", "top", "rated",
    "options", "under", "please", "hi", "need", "and", "of", "if", "you", "have",
    "anything", "sometime", "ideally", "like", "get", "can",
  ]);
  return text
    .toLowerCase()
    .replace(/[^\w\s.$]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

export function parseVoiceIntent(rawQuery: string, forcedCategory?: Category | null): VoiceIntent {
  return {
    category: forcedCategory ?? extractCategory(rawQuery),
    budgetMax: extractBudget(rawQuery),
    minRating: extractRating(rawQuery),
    rawQuery,
    keywords: extractKeywords(rawQuery),
  };
}

export function buildWebhookPayload(
  intent: VoiceIntent,
  sessionId: string,
  clientLatencyMs: number
): WebhookPayload {
  return {
    sessionId,
    timestamp: new Date().toISOString(),
    transcript: intent.rawQuery,
    intent: {
      category: intent.category,
      budgetMax: intent.budgetMax,
      minRating: intent.minRating,
      keywords: intent.keywords,
    },
    meta: {
      source: "ordr-ai-web",
      sttEngine: "web-speech-api",
      clientLatencyMs,
    },
  };
}

/**
 * Sends the transcript to our own /api/voice-intent route, which relays it
 * to the n8n workflow (N8N_WEBHOOK_URL) and returns the top 3 matches.
 */
export async function sendVoiceRequest(
  rawQuery: string,
  category: Category | null
): Promise<{ products: ServiceMatch[] }> {
  const intent = parseVoiceIntent(rawQuery, category);
  const sessionId = `oa_${Date.now().toString(36)}`;
  const start = Date.now();
  const payload = buildWebhookPayload(intent, sessionId, 0);

  const res = await fetch("/api/voice-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = await res.json();
  return { products: data.products ?? [] };
}
