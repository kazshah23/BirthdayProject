"use client";

type Variant = "bud" | "bloom" | "locked";

const PALETTE: Record<Variant, { petal: string; petalDark: string; core: string }> = {
  bud: { petal: "#f7a8c4", petalDark: "#d94f87", core: "#fde68a" },
  bloom: { petal: "#ec4899", petalDark: "#b23a6a", core: "#fff1a8" },
  locked: { petal: "#d6ccd1", petalDark: "#8e8287", core: "#ece6e9" },
};

export default function FlowerPin({
  variant,
  size = 56,
  label,
}: {
  variant: Variant;
  size?: number;
  label?: string;
}) {
  const { petal, petalDark, core } = PALETTE[variant];
  const animClass =
    variant === "bud" ? "flower-bud" : variant === "bloom" ? "flower-bloom" : "";
  return (
    <div
      className={`flower-wrap ${animClass}`}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox="0 0 56 56">
        <g transform="translate(28 28)">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx={0}
              cy={-14}
              rx={8}
              ry={14}
              fill={petal}
              stroke={petalDark}
              strokeWidth={1.4}
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx={0} cy={0} r={7} fill={core} stroke={petalDark} strokeWidth={1.2} />
        </g>
      </svg>
    </div>
  );
}
