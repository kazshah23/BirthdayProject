"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { Location, Trivia } from "@/lib/content";
import { matches } from "@/lib/normalize";

export default function TriviaModal({
  location,
  onClose,
  onComplete,
}: {
  location: Location;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [wrong, setWrong] = useState(false);

  const q = location.trivia[index];

  const advance = () => {
    setWrong(false);
    if (index + 1 < location.trivia.length) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  const missed = () => {
    setWrong(true);
    setShakeKey((n) => n + 1);
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="mb-1 text-xs uppercase tracking-widest text-rose-400">
        stop #{location.name}
      </div>
      <h2 className="font-script text-3xl text-rose-600">{location.name}</h2>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-rose-500">
          <span>question</span>
          <span className="font-semibold">
            {index + 1} / {location.trivia.length}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg leading-relaxed text-rose-700"
          >
            {q.q}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        key={shakeKey}
        animate={wrong ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-5"
      >
        <QuestionView
          key={index}
          q={q}
          isLast={index + 1 >= location.trivia.length}
          onCorrect={advance}
          onWrong={missed}
        />
        {wrong && (
          <p className="mt-3 text-center text-sm text-rose-500">
            not quite, try again 💕
          </p>
        )}
      </motion.div>
    </ModalShell>
  );
}

function QuestionView({
  q,
  isLast,
  onCorrect,
  onWrong,
}: {
  q: Trivia;
  isLast: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  if (q.type === "mc") {
    return <MCView q={q} onCorrect={onCorrect} onWrong={onWrong} />;
  }
  if (q.type === "slider") {
    return <SliderView q={q} isLast={isLast} onCorrect={onCorrect} onWrong={onWrong} />;
  }
  return <TextView q={q} isLast={isLast} onCorrect={onCorrect} onWrong={onWrong} />;
}

function TextView({
  q,
  isLast,
  onCorrect,
  onWrong,
}: {
  q: { q: string; a: string };
  isLast: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "correct") return;
    if (matches(value, q.a)) {
      setStatus("correct");
      setTimeout(() => {
        setValue("");
        setStatus("idle");
        onCorrect();
      }, 550);
    } else {
      setStatus("wrong");
      onWrong();
    }
  };

  const border =
    status === "correct"
      ? "border-green-400"
      : status === "wrong"
      ? "border-red-400"
      : "border-rose-200";
  const btnBg =
    status === "correct"
      ? "bg-green-500 hover:bg-green-500"
      : status === "wrong"
      ? "bg-red-500 hover:bg-red-500"
      : "bg-rose-500 hover:bg-rose-600";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (status === "wrong") setStatus("idle");
        }}
        autoFocus
        autoComplete="off"
        placeholder="your answer…"
        className={`rounded-full border-2 bg-white px-5 py-3 text-center text-lg text-rose-700 placeholder:text-rose-300 outline-none focus:border-rose-400 transition-colors ${border}`}
      />
      <button
        type="submit"
        className={`rounded-full px-5 py-3 text-white shadow-md transition-all active:scale-95 ${btnBg}`}
      >
        {isLast ? "unlock ✨" : "next →"}
      </button>
    </form>
  );
}

function MCView({
  q,
  onCorrect,
  onWrong,
}: {
  q: { options: string[]; correct: number };
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [wrongIdx, setWrongIdx] = useState<Set<number>>(new Set());
  const [correctIdx, setCorrectIdx] = useState<number | null>(null);

  const pick = (i: number) => {
    if (correctIdx !== null) return;
    if (i === q.correct) {
      setCorrectIdx(i);
      setTimeout(onCorrect, 550);
    } else {
      setWrongIdx((prev) => new Set(prev).add(i));
      onWrong();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {q.options.map((opt, i) => {
        const isWrong = wrongIdx.has(i);
        const isCorrect = correctIdx === i;
        const tone = isCorrect
          ? "border-green-500 bg-green-100 text-green-800 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]"
          : isWrong
          ? "border-red-500 bg-red-100 text-red-800 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
          : "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50";
        return (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            disabled={correctIdx !== null}
            className={`rounded-2xl border-2 px-4 py-3 text-left shadow-sm transition-all active:scale-[0.98] ${tone}`}
          >
            <span
              className={`mr-2 font-semibold ${
                isCorrect
                  ? "text-green-600"
                  : isWrong
                  ? "text-red-500"
                  : "text-rose-400"
              }`}
            >
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
            {isCorrect && <span className="ml-2">✓</span>}
            {isWrong && <span className="ml-2">✗</span>}
          </button>
        );
      })}
    </div>
  );
}

function SliderView({
  q,
  isLast,
  onCorrect,
  onWrong,
}: {
  q: { min: number; max: number; answer: number; unit?: string };
  isLast: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [value, setValue] = useState(q.min);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "correct") return;
    if (value === q.answer) {
      setStatus("correct");
      setTimeout(onCorrect, 550);
    } else {
      setStatus("wrong");
      onWrong();
    }
  };

  const unit = q.unit ?? "";
  const valueTone =
    status === "correct"
      ? "text-green-600"
      : status === "wrong"
      ? "text-red-500"
      : "text-rose-600";
  const btnBg =
    status === "correct"
      ? "bg-green-500 hover:bg-green-500"
      : status === "wrong"
      ? "bg-red-500 hover:bg-red-500"
      : "bg-rose-500 hover:bg-rose-600";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className={`text-center font-script text-4xl transition-colors ${valueTone}`}>
        {value}
        {unit ? ` ${unit}` : ""}
      </div>
      <input
        type="range"
        min={q.min}
        max={q.max}
        step={1}
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value));
          if (status === "wrong") setStatus("idle");
        }}
        className="w-full accent-rose-500"
      />
      <div className="flex justify-between text-xs text-rose-400">
        <span>
          {q.min}
          {unit ? ` ${unit}` : ""}
        </span>
        <span>
          {q.max}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <button
        type="submit"
        className={`rounded-full px-5 py-3 text-white shadow-md transition-all active:scale-95 ${btnBg}`}
      >
        {isLast ? "unlock ✨" : "next →"}
      </button>
    </form>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
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
        className="relative z-10 mx-3 w-full max-w-md rounded-t-3xl bg-rose-50 p-6 pb-8 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 rounded-full bg-white/70 px-3 py-1 text-sm text-rose-500 shadow-sm hover:bg-white"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
