"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import CategorySelector from "@/components/CategorySelector";
import VoiceOrb from "@/components/VoiceOrb";
import VoicePlayground from "@/components/VoicePlayground";
import ResultGrid from "@/components/ResultGrid";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { parseVoiceIntent, sendVoiceRequest } from "@/lib/webhook";
import type { Category, ServiceMatch } from "@/lib/types";

export default function Page() {
  const [category, setCategory] = useState<Category>("medical");
  const [typedQuery, setTypedQuery] = useState("");
  const [services, setServices] = useState<ServiceMatch[]>([]);
  const [cart, setCart] = useState<ServiceMatch[]>([]);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "temp_session";
    let id = localStorage.getItem("ordr_session_id");
    if (!id) {
      id = `oa_${Date.now().toString(36)}`;
      localStorage.setItem("ordr_session_id", id);
    }
    return id;
  });

  const runIntent = useCallback(
    async (rawQuery: string) => {
      setLoading(true);

      const detected = parseVoiceIntent(rawQuery, null);
      const effectiveCategory = detected.category ?? category;

      setCategory(effectiveCategory);
      setBudgetMax(detected.budgetMax);

      try {
        const {
          products,
          cart: updatedCart,
          message,
        } = await sendVoiceRequest(rawQuery, effectiveCategory, sessionId);
        setServices(products);
        setCart(updatedCart);
        setAiMessage(message);
      } catch {
        setServices([]);
        setAiMessage("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [category, sessionId]
  );

  const handleBook = useCallback((service: ServiceMatch) => {
    setBookingMsg(`✓ Booked ${service.name}! Confirmation sent (demo).`);
    setTimeout(() => setBookingMsg(null), 4000);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="text-sm font-medium text-signal">OrdR AI</span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink md:text-5xl">
            Speak it. See three.
            <br />
            Book in one tap.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate">
            No forms, no phone tag. Say what you need across clinics, barbers,
            legal offices, or restaurants — OrdR AI matches you to three open
            slots in under two seconds.
          </p>

          <div className="mt-8">
            <CategorySelector active={category} onSelect={setCategory} />
          </div>
        </div>

        <div className="flex justify-center">
          <VoiceOrb
            onFinalTranscript={(t) => {
              setTypedQuery(t);
              runIntent(t);
            }}
            disabled={loading}
          />
        </div>
      </section>

      {/* Playground */}
      <section className="mt-20">
        <VoicePlayground
          category={category}
          query={typedQuery}
          onQueryChange={setTypedQuery}
          onTest={(q) => runIntent(q)}
          isRunning={loading}
        />
      </section>

      {/* AI message (confirmation / cart feedback) */}
      {aiMessage && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-signal"
        >
          {aiMessage}
        </motion.p>
      )}

      {/* Cart panel */}
      {cart.length > 0 && (
        <section className="mt-10 rounded-2xl border border-line bg-panel p-6">
          <h2 className="font-display text-lg font-medium text-ink">
            Your cart ({cart.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {cart.map((item, i) => (
              <li
                key={`${item.id}-${i}`}
                className="flex items-center justify-between rounded-xl border border-line bg-panel2 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-slate">
                    ${item.price.toFixed(2)} · ★{item.rating}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Results */}
      <section className="mt-14">
        {bookingMsg && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-signal"
          >
            {bookingMsg}
          </motion.p>
        )}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">
            Your matches
          </h2>
          {budgetMax !== null && (
            <span className="text-sm text-slate">
              Budget ceiling: ${budgetMax.toFixed(2)}
            </span>
          )}
        </div>
        <ResultGrid
          services={services}
          budgetMax={budgetMax}
          loading={loading}
          onBook={handleBook}
        />
        {!loading && !services.length && (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-slate">
            Speak a request or send the sample above to see three matches appear
            here.
          </p>
        )}
      </section>

      {/* Architecture */}
      <section className="mt-24">
        <h2 className="mb-2 font-display text-xl font-medium text-ink">
          How it works
        </h2>
        <p className="mb-6 max-w-lg text-sm text-slate">
          Every request moves through five stages, end to end, in under two
          seconds.
        </p>
        <ArchitectureDiagram />
      </section>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 border-t border-line pt-8 text-xs text-slate"
      >
        Built with Next.js App Router, Tailwind CSS, Framer Motion, and the Web
        Speech API.
      </motion.footer>
    </main>
  );
}