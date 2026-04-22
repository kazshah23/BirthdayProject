"use client";

import { useCallback, useEffect, useState } from "react";

export type Stage = "lock" | "intro" | "map" | "reveal";

export type Progress = {
  version: number;
  stage: Stage;
  unlocked: boolean; // lock screen passed
  trivia: Record<string, number>; // locationId -> count of correctly answered questions
  words: Record<string, string>; // locationId -> revealed riddle word
};

const STORAGE_KEY = "birthday-v1";

const EMPTY: Progress = {
  version: 1,
  stage: "lock",
  unlocked: false,
  trivia: {},
  words: {},
};

function load(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Progress;
    if (parsed.version !== EMPTY.version) return EMPTY;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset") === "1") {
        window.localStorage.removeItem(STORAGE_KEY);
        setProgress(EMPTY);
        setHydrated(true);
        return;
      }
    }
    setProgress(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // quota / private-mode — fine to ignore for this use case
    }
  }, [progress, hydrated]);

  const setStage = useCallback((stage: Stage) => {
    setProgress((p) => ({ ...p, stage }));
  }, []);

  const unlock = useCallback(() => {
    setProgress((p) => ({ ...p, unlocked: true, stage: "intro" }));
  }, []);

  const markTriviaCorrect = useCallback((locationId: string) => {
    setProgress((p) => ({
      ...p,
      trivia: { ...p.trivia, [locationId]: (p.trivia[locationId] ?? 0) + 1 },
    }));
  }, []);

  const revealWord = useCallback((locationId: string, word: string) => {
    setProgress((p) => ({ ...p, words: { ...p.words, [locationId]: word } }));
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setProgress(EMPTY);
  }, []);

  return {
    progress,
    hydrated,
    setStage,
    unlock,
    markTriviaCorrect,
    revealWord,
    reset,
  };
}
