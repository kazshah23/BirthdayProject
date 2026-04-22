"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { Location } from "@/lib/content";
import { matches } from "@/lib/normalize";

export default function RiddleModal({
  location,
  onClose,
  onSolved,
}: {
  location: Location;
  onClose: () => void;
  onSolved: (word: string) => void;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (matches(value, location.riddle.answer)) {
      onSolved(location.riddle.answer);
    } else {
      setWrong(true);
      setShakeKey((n) => n + 1);
    }
  };

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
        className="relative z-10 mx-3 w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(180deg, #fff1f4 0%, #fff5f2 100%)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 rounded-full bg-white/70 px-3 py-1 text-sm text-rose-500 shadow-sm hover:bg-white"
        >
          ✕
        </button>

        <div className="mb-1 text-xs uppercase tracking-widest text-rose-400">
          a riddle at {location.name}
        </div>
        <h2 className="font-script text-3xl text-rose-600">A whisper for you…</h2>

        <div className="mt-5 rounded-2xl bg-white/60 p-4 text-rose-700 shadow-inner">
          <p className="font-script whitespace-pre-line text-2xl leading-snug">
            {location.riddle.text}
          </p>
        </div>

        <motion.form
          key={shakeKey}
          animate={wrong ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
          onSubmit={submit}
          className="mt-5 flex flex-col gap-3"
        >
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setWrong(false);
            }}
            autoFocus
            autoComplete="off"
            placeholder="one word…"
            className="rounded-full border-2 border-rose-200 bg-white px-5 py-3 text-center text-lg text-rose-700 placeholder:text-rose-300 outline-none focus:border-rose-400"
          />
          <button
            type="submit"
            className="rounded-full bg-rose-500 px-5 py-3 text-white shadow-md transition-transform active:scale-95 hover:bg-rose-600"
          >
            reveal 🌸
          </button>
          {wrong && (
            <p className="text-center text-sm text-rose-500">
              hmm, try again 💕
            </p>
          )}
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
