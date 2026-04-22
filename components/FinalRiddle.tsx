"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { finalRiddle, finalReveal } from "@/lib/content";
import { matches } from "@/lib/normalize";

// Build the live hint row — positions fill in as the user types the
// correct letters in sequence; untyped positions show an underscore.
function hintCells(answer: string, input: string) {
  const normInput = input.replace(/[^A-Za-z]/g, "").toUpperCase();
  let letterIdx = 0;
  const cells: { kind: "gap" | "filled" | "blank"; char?: string }[] = [];
  for (let i = 0; i < answer.length; i++) {
    const c = answer[i];
    if (c === " ") {
      cells.push({ kind: "gap" });
      continue;
    }
    const expected = c.toUpperCase();
    const typed = normInput[letterIdx];
    if (typed === expected) {
      cells.push({ kind: "filled", char: expected });
    } else {
      cells.push({ kind: "blank" });
    }
    letterIdx++;
  }
  return cells;
}

export default function FinalRiddle({
  solvedCount,
  total,
  onOpen,
}: {
  solvedCount: number;
  total: number;
  onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const lines = finalRiddle.lines;
  const linesCount = lines.length; // 4
  // 1 flower → line 1, 2 flowers → lines 1–2, 3 flowers → all 4 lines + solve.
  const allSolved = solvedCount >= total;
  const revealed = allSolved
    ? linesCount
    : Math.min(solvedCount, linesCount);

  // Toast flash when the revealed count grows. Hides automatically or on expand.
  const seenRef = useRef(revealed);
  const [flashDelta, setFlashDelta] = useState(0);
  useEffect(() => {
    if (revealed > seenRef.current) {
      const delta = revealed - seenRef.current;
      seenRef.current = revealed;
      setFlashDelta(delta);
      const t = setTimeout(() => setFlashDelta(0), 6000);
      return () => clearTimeout(t);
    }
  }, [revealed]);
  useEffect(() => {
    if (expanded && flashDelta > 0) setFlashDelta(0);
  }, [expanded, flashDelta]);

  return (
    <div className="relative mx-auto w-full max-w-sm px-1">
      <AnimatePresence>
        {flashDelta > 0 && (
          <motion.div
            key="riddle-flash"
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 px-3 py-1 font-script text-sm text-white shadow-lg"
          >
            +{flashDelta} new line{flashDelta !== 1 ? "s" : ""} unlocked! ✨
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={`w-full rounded-2xl border-2 px-4 py-3 text-left shadow-md backdrop-blur transition-colors ${
          allSolved
            ? "border-rose-300 bg-rose-50 hover:bg-rose-100"
            : "border-rose-200 bg-white/85 hover:bg-white"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <div
              className={`font-script text-xl leading-tight ${
                allSolved ? "text-rose-700" : "text-rose-500"
              }`}
            >
              {allSolved ? "✨ the final riddle ✨" : "the final riddle"}
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-rose-400">
              {revealed} / {linesCount} lines revealed
            </div>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
            className="text-xl text-rose-400"
          >
            ▶
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="riddle-panel"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-2xl border-2 border-rose-200/60 bg-white/80 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-2 px-4 py-4 text-center">
              {lines.map((line, i) => {
                const isRevealed = i < revealed;
                return (
                  <div
                    key={i}
                    className="text-[15px] font-medium leading-relaxed text-rose-700"
                  >
                    {isRevealed ? (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="inline-block"
                      >
                        {line}
                      </motion.span>
                    ) : (
                      <span
                        aria-label="hidden riddle line"
                        className="inline-block select-none rounded-md bg-rose-900/85 px-2 text-transparent shadow-inner"
                      >
                        {line}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {allSolved && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mx-2 mb-2 mt-0"
              >
                <RiddleSolver onSolve={onOpen} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RiddleSolver({ onSolve }: { onSolve: () => void }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const cells = hintCells(finalReveal.answer, value);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "correct") return;
    if (matches(value, finalReveal.answer)) {
      setStatus("correct");
      setTimeout(onSolve, 900);
    } else {
      setStatus("wrong");
      setShakeKey((n) => n + 1);
    }
  };

  const inputTone =
    status === "correct"
      ? "border-green-500 bg-green-50 text-green-800"
      : status === "wrong"
      ? "border-red-500 bg-red-50 text-red-800"
      : "border-rose-200 bg-white text-rose-700 focus:border-rose-400";
  const btnTone =
    status === "correct"
      ? "bg-green-500 hover:bg-green-500"
      : status === "wrong"
      ? "bg-red-500 hover:bg-red-500"
      : "bg-rose-500 hover:bg-rose-600";

  return (
    <motion.form
      key={shakeKey}
      animate={status === "wrong" ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-2xl border-2 border-rose-200 bg-white/90 px-3 py-3"
    >
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-rose-400">
        type your guess
      </p>
      <div className="flex items-center justify-center gap-[2px] font-mono text-xl tracking-wider sm:text-2xl">
        {cells.map((cell, i) => {
          if (cell.kind === "gap") {
            return <span key={i} className="inline-block w-3 sm:w-4" />;
          }
          if (cell.kind === "filled") {
            return (
              <motion.span
                key={i}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="w-[0.9em] text-center font-bold text-rose-700"
              >
                {cell.char}
              </motion.span>
            );
          }
          return (
            <span key={i} className="w-[0.9em] text-center text-rose-300">
              _
            </span>
          );
        })}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (status === "wrong") setStatus("idle");
        }}
        placeholder=""
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        className={`rounded-full border-2 px-4 py-2 text-center text-base tracking-wide outline-none transition-colors placeholder:text-rose-300 ${inputTone}`}
      />
      <button
        type="submit"
        className={`rounded-full px-4 py-2 font-script text-lg text-white shadow-md transition-all active:scale-95 ${btnTone}`}
      >
        {status === "correct" ? "correct! ✨" : "reveal ✨"}
      </button>
    </motion.form>
  );
}
