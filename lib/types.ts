export type Category = "medical" | "barber" | "legal" | "restaurant";

export interface VoiceIntent {
  category: Category | null;
  budgetMax: number | null;
  minRating: number | null;
  rawQuery: string;
  keywords: string[];
}

export interface WebhookPayload {
  sessionId: string;
  timestamp: string;
  transcript: string;
  intent: {
    category: Category | null;
    budgetMax: number | null;
    minRating: number | null;
    keywords: string[];
  };
  meta: {
    source: "ordr-ai-web";
    sttEngine: "web-speech-api";
    clientLatencyMs: number;
  };
}

export interface ServiceMatch {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  matchReason: string;
  category: Category;
}
