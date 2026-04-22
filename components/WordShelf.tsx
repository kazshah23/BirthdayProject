"use client";

import { motion } from "framer-motion";
import { finalReveal, locations } from "@/lib/content";

export default function WordShelf({
  words,
}: {
  words: Record<string, string>;
}) {
  return (
    <div className="pointer-events-none flex items-center justify-center gap-3 px-4">
      {locations.map((loc) => {
        const w = words[loc.id];
        const revealed = Boolean(w);
        const idx = finalReveal.wordsInOrder.indexOf(
          (w ?? "").toLowerCase()
        );
        return (
          <motion.div
            key={loc.id}
            initial={false}
            animate={{
              scale: revealed ? 1 : 0.95,
              opacity: revealed ? 1 : 0.55,
            }}
            className={`pointer-events-auto min-w-[86px] rounded-2xl border-2 px-3 py-2 text-center shadow-md backdrop-blur ${
              revealed
                ? "border-rose-300 bg-white/85 text-rose-600"
                : "border-rose-200/60 bg-white/50 text-rose-300"
            }`}
          >
            <div className="text-[10px] uppercase tracking-widest text-rose-400/80">
              {revealed && idx >= 0 ? `#${idx + 1}` : "locked"}
            </div>
            <div className="font-script text-2xl leading-tight">
              {revealed ? w : "🌸"}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
