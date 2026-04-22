"use client";

export default function SunsetBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* sky gradient fallback handled on body; add glowing sun */}
      <div
        className="animate-sun absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(80vw, 420px)",
          height: "min(80vw, 420px)",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,220,160,0.95) 0%, rgba(255,170,170,0.55) 40%, rgba(255,170,170,0) 70%)",
          filter: "blur(4px)",
        }}
      />
      {/* subtle clouds */}
      <div
        className="absolute inset-x-0 top-[30%] h-40 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.7) 0%, transparent 60%), radial-gradient(ellipse at 75% 40%, rgba(255,255,255,0.55) 0%, transparent 55%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
