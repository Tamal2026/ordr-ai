"use client";

import { motion } from "framer-motion";

const STAGES = [
  { title: "Speech-to-Text", detail: "Web Speech API transcribes in the browser — no round trip." },
  { title: "Webhook Pipeline", detail: "Transcript + intent POSTed to a Next.js route, relayed to n8n." },
  { title: "Intent Parser", detail: "n8n calls Groq/OpenAI to confirm category, budget, and rating." },
  { title: "Array Filtering", detail: "Confirmed intent filters the service dataset to a ranked shortlist." },
  { title: "Instant Render", detail: "Top 3 matches stream back and mount with a staggered entrance." },
];

export default function ArchitectureDiagram() {
  return (
    <div className="rounded-2xl border border-line bg-panel p-6 md:p-8">
      <div className="relative flex flex-col gap-6 md:flex-row md:items-stretch md:gap-0">
        {STAGES.map((stage, i) => (
          <div key={stage.title} className="relative flex flex-1 flex-col items-start md:px-4">
            {i > 0 && (
              <div className="absolute left-0 top-5 hidden h-px w-full -translate-x-1/2 bg-line md:block" />
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-signal/50 bg-panel2 text-sm font-medium text-signal"
            >
              {i + 1}
            </motion.div>
            <h4 className="font-display text-sm font-medium text-ink">{stage.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate">{stage.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
