"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { LOCK_ANSWER, LOCK_QUESTION } from "@/lib/content";
import { matches, normalize } from "@/lib/normalize";

// Cheeky responses for common wrong guesses.
const WRONG_REPLIES: { inputs: string[]; reply: string }[] = [
  { inputs: ["kaz", "kazmain"], reply: "I'm honored but no" },
  { inputs: ["mahnur"], reply: "Probably true but no" },
  { inputs: ["mom"], reply: "Okay that's cute but no" },
  { inputs: ["isha"], reply: "This is a prayer not a friend…" },
  { inputs: ["hi"], reply: "hiiiiiii" },
];

const DEFAULT_WRONG = "not quite, sweetie — try again 💕";

function wrongMessage(input: string): string {
  const n = normalize(input);
  for (const entry of WRONG_REPLIES) {
    if (entry.inputs.some((i) => normalize(i) === n)) return entry.reply;
  }
  return DEFAULT_WRONG;
}

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (matches(value, LOCK_ANSWER)) {
      onUnlock();
    } else {
      setErrorMsg(wrongMessage(value));
      setShake((n) => n + 1);
    }
  };

  return (
    <motion.section
      key="lock"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 140, damping: 14 }}
        className="text-6xl"
      >
        🌹
      </motion.div>

      <h1 className="font-script mt-2 text-5xl text-rose-600 drop-shadow-sm sm:text-6xl">
        hi
      </h1>
      <p className="mt-2 max-w-xs text-base text-rose-600/80">
        to begin our day unlock the site
      </p>
      <p className="mt-6 max-w-sm text-lg font-medium text-rose-700">
        {LOCK_QUESTION}
      </p>

      <motion.form
        key={shake}
        onSubmit={onSubmit}
        animate={errorMsg ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-6 flex w-full max-w-xs flex-col items-stretch gap-3"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setErrorMsg(null);
          }}
          placeholder="type your guess…"
          autoComplete="off"
          className="rounded-full border-2 border-rose-200 bg-white/80 px-5 py-3 text-center text-lg text-rose-700 placeholder:text-rose-300 shadow-sm outline-none backdrop-blur focus:border-rose-400"
        />
        <button
          type="submit"
          className="rounded-full bg-rose-500 px-5 py-3 text-white shadow-md transition-transform active:scale-95 hover:bg-rose-600"
        >
          unlock 💗
        </button>
        {errorMsg && (
          <p className="text-sm text-rose-500">{errorMsg}</p>
        )}
      </motion.form>
    </motion.section>
  );
}
