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
  const [services, setServices] = useState<ServiceMatch[]>([]);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const runIntent = useCallback(
    async (rawQuery: string) => {
      setLoading(true);
      const intent = parseVoiceIntent(rawQuery, category);
      setBudgetMax(intent.budgetMax);

      try {
        const result = await sendVoiceRequest(rawQuery, category);
      
        setServices(result.products);
      } catch (err) {
        console.log("CATCH ERROR:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    },
    [category],
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="text-sm font-medium text-signal">OrdR AI</span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink md:text-5xl">
            Speak it. See three .
            <br />
            Book in one tap.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate">
            No forms,no phone tag. Say what you need across clinics,
            barbers,legal offices, or restaurants OrdR AI matches you to three
            open slot in under two seconds.
          </p>

          <div className="mt-8">
            <CategorySelector active={category} onSelect={setCategory} />
          </div>
        </div>

        <div className="flex justify-center">
          <VoiceOrb
            onFinalTranscript={(t) => runIntent(t)}
            disabled={loading}
          />
        </div>
      </section>

      {/* Playground */}
      <section className="mt-20">
        <VoicePlayground
          category={category}
          onTest={(q) => runIntent(q)}
          isRunning={loading}
        />
      </section>

      {/* Results */}
      <section className="mt-14">
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
        />
        {!loading && !services.length && (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-slate">
            Speak a request or send the sample above to see three matches appear
            here .
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
