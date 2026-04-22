"use client";

import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  hue: number;
};

const COUNT = 18;

function makePetals(): Petal[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 9 + Math.random() * 8,
    drift: (Math.random() - 0.5) * 220,
    size: 14 + Math.random() * 22,
    hue: 320 + Math.random() * 40,
  }));
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[] | null>(null);

  useEffect(() => {
    setPetals(makePetals());
  }, []);

  if (!petals) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {petals.map((p) => (
        <svg
          key={p.id}
          width={p.size}
          height={p.size}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
            opacity: 0.85,
          }}
        >
          <path
            d="M12 2 C14 6 18 8 18 12 C18 16 14 18 12 22 C10 18 6 16 6 12 C6 8 10 6 12 2 Z"
            fill={`hsl(${p.hue}, 85%, 82%)`}
            stroke={`hsl(${p.hue}, 60%, 68%)`}
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  );
}
