"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Location } from "@/lib/content";

const CONFETTI_COLORS = [
  "#ec6fa0",
  "#f7a8c4",
  "#ffd1b3",
  "#c58dc8",
  "#fff1a8",
];

export default function PlanReveal({
  location,
  isLast,
  onContinue,
  onClose,
}: {
  location: Location;
  isLast: boolean;
  onContinue: () => void;
  onClose: () => void;
}) {
  // Stay hidden long enough for the ChicagoMap path animation to finish.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Fire a confetti burst the first time the last-flower reveal appears.
  const firedRef = useRef(false);
  useEffect(() => {
    if (!ready || !isLast || firedRef.current) return;
    firedRef.current = true;
    confetti({
      particleCount: 110,
      spread: 85,
      startVelocity: 48,
      origin: { x: 0.5, y: 0.55 },
      colors: CONFETTI_COLORS,
    });
    const t1 = setTimeout(
      () =>
        confetti({
          particleCount: 70,
          spread: 110,
          origin: { x: 0.25, y: 0.65 },
          colors: CONFETTI_COLORS,
        }),
      320
    );
    const t2 = setTimeout(
      () =>
        confetti({
          particleCount: 70,
          spread: 110,
          origin: { x: 0.75, y: 0.65 },
          colors: CONFETTI_COLORS,
        }),
      640
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready, isLast]);

  if (!ready) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-rose-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="relative z-10 mx-3 w-full max-w-md overflow-hidden rounded-t-3xl bg-rose-50 p-7 pb-8 text-center shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 rounded-full bg-white/70 px-3 py-1 text-sm text-rose-500 shadow-sm hover:bg-white"
        >
          ✕
        </button>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-xs uppercase tracking-[0.3em] text-rose-400"
        >
          {location.name} complete ✨
        </motion.p>

        {isLast ? (
          <>
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 12,
              }}
              className="mx-auto mt-3 text-7xl"
            >
              🎁
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="shimmer-text mt-2 font-script text-5xl leading-tight"
            >
              {location.nextPlan}
            </motion.h2>
          </>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-3 font-script text-3xl text-rose-500"
            >
              next up…
            </motion.h2>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.35,
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              className="mt-5 rounded-2xl border-2 border-rose-200 bg-white/80 px-5 py-6"
            >
              <p className="font-script text-3xl leading-snug text-rose-600">
                {location.nextPlan}
              </p>
            </motion.div>
          </>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isLast ? 1.1 : 0.75 }}
          onClick={onContinue}
          className="mt-6 w-full rounded-full bg-rose-500 px-5 py-3 text-white shadow-md transition-transform active:scale-95 hover:bg-rose-600"
        >
          {isLast ? "open it ✨" : "let's go ✨"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
