"use client";

import { AnimatePresence, motion } from "framer-motion";
import ResultCard from "./ResultCard";
import type { ServiceMatch } from "@/lib/types";

export default function ResultGrid({
  services,
  budgetMax,
  loading,
  onBook,
}: {
  services: ServiceMatch[];
  budgetMax: number | null;
  loading: boolean;
  onBook: (service: ServiceMatch) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl border border-line bg-panel" />
        ))}
      </div>
    );
  }

  if (!services.length) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={services.map((s) => s.id).join("-")}
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {services.slice(0, 3).map((service, i) => (
          <ResultCard
            key={service.id}
            service={service}
            budgetMax={budgetMax}
            index={i}
            onBook={onBook}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}