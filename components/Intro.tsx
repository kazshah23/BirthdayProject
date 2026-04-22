"use client";

import { motion } from "framer-motion";
import { BIRTHDAY_GIRL, INTRO_NOTE } from "@/lib/content";

export default function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-base tracking-widest uppercase text-rose-500"
      >
        happy birthday
      </motion.p>
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 12 }}
        className="font-script mt-3 text-6xl leading-none text-rose-600 drop-shadow-sm sm:text-7xl"
      >
        {BIRTHDAY_GIRL} 🌹
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 max-w-sm text-base leading-relaxed text-rose-700"
      >
        {INTRO_NOTE}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
        onClick={onStart}
        className="mt-10 rounded-full bg-rose-500 px-8 py-4 text-lg text-white shadow-lg transition-transform active:scale-95 hover:bg-rose-600"
      >
        start your adventure →
      </motion.button>
    </motion.section>
  );
}
