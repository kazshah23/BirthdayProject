"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { finalReveal } from "@/lib/content";

export default function FinalReveal({
  words,
  onRestart,
}: {
  words: Record<string, string>;
  onRestart: () => void;
}) {
  const [stage, setStage] = useState<"words" | "combining" | "answer">(
    "words"
  );

  useEffect(() => {
    const t1 = setTimeout(() => setStage("combining"), 1800);
    const t2 = setTimeout(() => setStage("answer"), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage !== "answer") return;
    const colors = ["#ec6fa0", "#f7a8c4", "#ffd1b3", "#c58dc8", "#fff1a8"];
    const burst = () => {
      confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.6 },
        colors,
      });
    };
    burst();
    const t = setTimeout(burst, 700);
    const t2 = setTimeout(burst, 1500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [stage]);

  const ordered = finalReveal.wordsInOrder.map((canonical) => {
    const found = Object.values(words).find(
      (w) => w.toLowerCase() === canonical
    );
    return found ?? canonical;
  });

  return (
    <motion.section
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      {stage === "words" && (
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {ordered.map((w, i) => (
            <motion.div
              key={w + i}
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.25, type: "spring" }}
              className="rounded-2xl border-2 border-rose-200 bg-white/85 px-5 py-3 text-4xl text-rose-600 shadow-md"
            >
              {w}
            </motion.div>
          ))}
        </motion.div>
      )}

      {stage === "combining" && (
        <motion.div
          className="mt-10 font-script text-5xl text-rose-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.15, 0.95, 1] }}
            transition={{ duration: 1.2 }}
          >
            {ordered.join(" · ")}
          </motion.span>
          <p className="mt-4 text-lg text-rose-500/80 italic">
            rearranging…
          </p>
        </motion.div>
      )}

      {stage === "answer" && (
        <>
          <motion.h1
            initial={{ scale: 0.5, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className="font-script shimmer-text mt-8 text-7xl sm:text-8xl"
          >
            {finalReveal.answer}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 max-w-sm text-base leading-relaxed text-rose-700"
          >
            {finalReveal.loveNote}
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={onRestart}
            className="mt-8 rounded-full border-2 border-rose-300 bg-white/70 px-6 py-2 text-sm text-rose-500 hover:bg-white"
          >
            replay the adventure
          </motion.button>
        </>
      )}
    </motion.section>
  );
}
