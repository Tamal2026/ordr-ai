"use client";

import { motion } from "framer-motion";
import type { ServiceMatch } from "@/lib/types";

export default function ResultCard({
  service,
  budgetMax,
  index,
}: {
  service: ServiceMatch;
  budgetMax: number | null;
  index: number;
}) {
  const underBudget = budgetMax !== null && service.price <= budgetMax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            underBudget ? "bg-signal text-base" : "bg-panel2 text-ink"
          }`}
        >
          ${service.price.toFixed(2)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-base font-medium leading-snug text-ink">
            {service.name}
          </h4>
          <div className="flex shrink-0 items-center gap-1 text-amber">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-medium text-ink">{service.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-slate">{service.matchReason}</p>

        <button className="focus-ring mt-3 flex items-center justify-center gap-2 rounded-xl border border-signal/40 bg-transparent py-2.5 text-sm font-medium text-signal transition-colors hover:bg-signal hover:text-base">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path d="M19 11a7 7 0 01-14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          1-Click Voice Booking
        </button>
      </div>
    </motion.div>
  );
}
