"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Location, locations } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import LockScreen from "@/components/LockScreen";
import Intro from "@/components/Intro";
import TriviaModal from "@/components/TriviaModal";
import PlanReveal from "@/components/PlanReveal";
import FinalRiddle from "@/components/FinalRiddle";
import FinalReveal from "@/components/FinalReveal";
import FallingPetals from "@/components/FallingPetals";
import SunsetBackground from "@/components/SunsetBackground";
import ChicagoMap from "@/components/ChicagoMap";

type ModalState =
  | { kind: "none" }
  | { kind: "trivia"; location: Location }
  | { kind: "plan"; location: Location };

export default function Home() {
  const {
    progress,
    hydrated,
    unlock,
    setStage,
    markTriviaCorrect,
    revealWord,
    reset,
  } = useProgress();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  const solvedIds = useMemo(
    () => new Set(Object.keys(progress.words)),
    [progress.words]
  );

  if (!hydrated) {
    return (
      <main className="relative flex min-h-[100dvh] items-center justify-center">
        <SunsetBackground />
      </main>
    );
  }

  const openLocation = (loc: Location) => {
    if (progress.words[loc.id]) return;
    // Lock flowers that aren't the next in sequence.
    const nextIdx = locations.findIndex((l) => !solvedIds.has(l.id));
    const thisIdx = locations.findIndex((l) => l.id === loc.id);
    if (thisIdx !== nextIdx) return;

    const triviaDone = (progress.trivia[loc.id] ?? 0) >= loc.trivia.length;
    if (triviaDone) {
      setModal({ kind: "plan", location: loc });
    } else {
      setModal({ kind: "trivia", location: loc });
    }
  };

  return (
    <main className="relative flex min-h-[100dvh] flex-col">
      <SunsetBackground />
      <FallingPetals />

      <AnimatePresence mode="wait">
        {progress.stage === "lock" && (
          <LockScreen key="lock" onUnlock={unlock} />
        )}

        {progress.stage === "intro" && (
          <Intro key="intro" onStart={() => setStage("map")} />
        )}

        {progress.stage === "map" && (
          <motion.section
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex min-h-[100dvh] flex-col gap-3 px-4 pb-5 pt-6"
          >
            <header className="text-center">
              <h1 className="font-script text-4xl text-rose-600">
                happy birthday aishu 🌹
              </h1>
              <p className="mx-auto mt-1 max-w-xs text-sm text-rose-600/80">
                an adventure built by kaz and guppy
              </p>
            </header>

            <div className="min-h-[360px] flex-1">
              <ChicagoMap onSelect={openLocation} solvedIds={solvedIds} />
            </div>

            <FinalRiddle
              solvedCount={solvedIds.size}
              total={locations.length}
              onOpen={() => setStage("reveal")}
            />
          </motion.section>
        )}

        {progress.stage === "reveal" && (
          <FinalReveal
            key="reveal"
            words={progress.words}
            onRestart={() => reset()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal.kind === "trivia" && (
          <TriviaModal
            key={`trivia-${modal.location.id}`}
            location={modal.location}
            onClose={() => setModal({ kind: "none" })}
            onComplete={() => {
              const loc = modal.location;
              for (let i = 0; i < loc.trivia.length; i++) {
                markTriviaCorrect(loc.id);
              }
              // Reveal now so the map path + bloom animate while the PlanReveal
              // waits its internal 2s delay before appearing.
              revealWord(loc.id, loc.riddle.answer);
              setModal({ kind: "plan", location: loc });
            }}
          />
        )}
        {modal.kind === "plan" && (() => {
          const loc = modal.location;
          const thisIdx = locations.findIndex((l) => l.id === loc.id);
          const isLast = thisIdx === locations.length - 1;
          return (
            <PlanReveal
              key={`plan-${loc.id}`}
              location={loc}
              isLast={isLast}
              onClose={() => setModal({ kind: "none" })}
              onContinue={() => setModal({ kind: "none" })}
            />
          );
        })()}
      </AnimatePresence>
    </main>
  );
}
