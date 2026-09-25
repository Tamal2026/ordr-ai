"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Category } from "@/lib/types";

const SAMPLE_PROMPTS: Record<Category, string> = {
  medical: "Hi, I need to see a doctor sometime next week for a follow-up.",
  barber: "Can I get a fade this Saturday, ideally in the afternoon?",
  legal: "I'd like a 30-minute consultation about a lease dispute.",
  restaurant: "Table for 4 tonight around 7:30, if you have anything.",
};

export default function VoicePlayground({
  category,
  onTest,
  isRunning,
}: {
  category: Category;
  onTest: (query: string) => void;
  isRunning: boolean;
}) {
  const [query, setQuery] = useState(SAMPLE_PROMPTS[category]);

  useEffect(() => {
    setQuery(SAMPLE_PROMPTS[category]);
  }, [category]);

  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-ink">Try it without your mic</h3>
        <span className="text-xs text-slate">Sample request</span>
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={2}
        className="focus-ring w-full resize-none rounded-xl border border-line bg-panel2 p-4 text-sm text-ink placeholder:text-slate/60"
        placeholder="Type what you'd say out loud…"
      />

      <button
        onClick={() => onTest(query)}
        disabled={isRunning || !query.trim()}
        className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-signal py-3 text-sm font-semibold text-base transition-opacity disabled:opacity-40"
      >
        {isRunning ? (
          <motion.span
            className="h-4 w-4 rounded-full border-2 border-base border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
          />
        ) : (
          "Send to the AI"
        )}
      </button>
    </div>
  );
}
