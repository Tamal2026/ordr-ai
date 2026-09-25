"use client";

import { motion } from "framer-motion";
import type { Category } from "@/lib/types";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "medical", label: "Medical clinic" },
  { id: "barber", label: "Barber shop" },
  { id: "legal", label: "Legal office" },
  { id: "restaurant", label: "Restaurant" },
];

export default function CategorySelector({
  active,
  onSelect,
}: {
  active: Category | null;
  onSelect: (c: Category) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3" role="tablist" aria-label="Business category">
      {CATEGORIES.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(c.id)}
            className={`focus-ring relative rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "border-signal/60 text-base bg-signal"
                : "border-line text-ink/80 bg-panel hover:border-signal/40 hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-active-bg"
                className="absolute inset-0 -z-10 rounded-full bg-signal"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
