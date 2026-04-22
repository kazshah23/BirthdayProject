"use client";

import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Location, locations as allLocations } from "@/lib/content";
import FlowerPin from "./FlowerPin";

// River North roughly — used as the initial zoom focus.
const RIVER_NORTH: [number, number] = [41.891, -87.632];

const VIEW_W = 1600;
const VIEW_H = 2000;

const BOUNDS = {
  minLat: 41.86,
  maxLat: 41.945,
  minLng: -87.655,
  maxLng: -87.575,
};

function project([lat, lng]: [number, number]) {
  const xPct = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const yPct = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { xPct, yPct };
}

function projectSvg(coords: [number, number]) {
  const { xPct, yPct } = project(coords);
  return { x: (xPct / 100) * VIEW_W, y: (yPct / 100) * VIEW_H };
}

// Named roads — reused for the pavement layer and the center dash on top.
const ROADS: { d: string; name: string }[] = [
  { d: "M 985 0 C 900 320, 865 700, 855 1100 C 860 1380, 920 1660, 990 2000", name: "lake shore dr" },
  { d: "M 780 160 L 780 1900", name: "michigan ave" },
  { d: "M 640 160 L 640 1900", name: "clark st" },
  { d: "M 340 160 L 340 1900", name: "halsted st" },
  { d: "M 140 720 L 1000 720", name: "north ave" },
  { d: "M 140 540 L 1000 540", name: "fullerton" },
  { d: "M 340 940 L 1000 940", name: "division" },
];

// Building rects scattered in clusters so the grid has texture when zoomed in.
// [x, y, w, h, colorIndex]
const BUILDINGS: [number, number, number, number, number][] = [
  // The Loop (downtown)
  [560, 1500, 46, 52, 0], [614, 1488, 34, 64, 1], [656, 1510, 50, 42, 2],
  [714, 1485, 40, 70, 0], [762, 1500, 38, 56, 3], [560, 1560, 42, 48, 1],
  [612, 1564, 48, 54, 2], [668, 1566, 36, 60, 0], [712, 1572, 46, 50, 3],
  [568, 1624, 44, 50, 4], [622, 1630, 48, 44, 1], [680, 1628, 42, 56, 2],
  [732, 1636, 40, 48, 0], [572, 1688, 42, 46, 3], [624, 1692, 44, 50, 1],
  // Streeterville (east of Michigan Ave, south of river)
  [810, 1180, 46, 60, 2], [866, 1175, 40, 68, 0], [816, 1250, 42, 52, 3],
  [864, 1255, 48, 48, 1], [818, 1320, 40, 54, 2],
  // River North
  [502, 1180, 38, 46, 1], [548, 1170, 42, 50, 3], [600, 1180, 36, 42, 0],
  [650, 1200, 44, 40, 2], [702, 1185, 40, 52, 1], [502, 1240, 40, 44, 4],
  [550, 1238, 38, 48, 0], [600, 1246, 42, 42, 2],
  // Gold Coast (north of river, between Michigan and LSD)
  [810, 1020, 38, 44, 0], [856, 1015, 42, 50, 1], [810, 1075, 44, 42, 3],
  [858, 1078, 40, 48, 2],
  // Old Town
  [360, 880, 36, 40, 1], [410, 875, 40, 44, 0], [460, 890, 34, 38, 2],
  [510, 880, 42, 46, 3], [360, 940, 38, 42, 4], [410, 950, 36, 40, 1],
  [460, 948, 40, 42, 2], [510, 944, 36, 38, 0],
  // West Town
  [180, 1210, 40, 48, 3], [230, 1215, 36, 42, 1], [276, 1205, 44, 46, 0],
  [180, 1278, 38, 40, 2], [232, 1282, 42, 44, 4], [278, 1282, 36, 38, 1],
];

const BUILDING_COLORS = ["#ffcfc8", "#ffbdcd", "#f5c2d5", "#ffdab8", "#ecb3ca", "#ffd0d8"];

// Bridges crossing the Chicago River's main stem — [x, y, w, h]
const BRIDGES: [number, number, number, number][] = [
  [326, 1142, 28, 36],
  [626, 1140, 28, 36],
  [766, 1124, 28, 36],
  [860, 1106, 28, 36],
];

export default function ChicagoMap({
  onSelect,
  solvedIds,
}: {
  onSelect: (location: Location) => void;
  solvedIds: Set<string>;
}) {
  return (
    <div className="relative h-[min(65vh,640px)] min-h-[420px] w-full overflow-hidden rounded-3xl border-4 border-white/60 shadow-xl">
      <TransformWrapper
        initialScale={2}
        minScale={0.8}
        maxScale={4}
        limitToBounds
        doubleClick={{ mode: "toggle", step: 1.2 }}
        wheel={{ step: 0.2 }}
        pinch={{ step: 8 }}
        onInit={(ref) => ref.zoomToElement("cm-rn-anchor", 2, 0)}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <div className="relative h-full w-full">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              aria-hidden
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="cm-land" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffe7d1" />
                  <stop offset="55%" stopColor="#ffd1d8" />
                  <stop offset="100%" stopColor="#efbfde" />
                </linearGradient>
                <linearGradient id="cm-lake" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f8b9c4" />
                  <stop offset="60%" stopColor="#d4a2d8" />
                  <stop offset="100%" stopColor="#b787c6" />
                </linearGradient>
                <radialGradient id="cm-sun" cx="72%" cy="18%" r="50%">
                  <stop offset="0%" stopColor="#fff4c8" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#ffd6b8" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#ffd6b8" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cm-park" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#ffd9bb" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffc6c8" stopOpacity="0.6" />
                </radialGradient>
                <filter id="cm-soft" x="-5%" y="-5%" width="110%" height="110%">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
              </defs>

              {/* land + sun */}
              <rect width={VIEW_W} height={VIEW_H} fill="url(#cm-land)" />
              <rect width={VIEW_W} height={VIEW_H} fill="url(#cm-sun)" />

              {/* Lake Michigan */}
              <path
                d="M 1080 -40
                   C 1000 260, 960 560, 940 880
                   C 920 1100, 900 1220, 905 1340
                   C 920 1480, 990 1620, 1060 1780
                   C 1100 1880, 1120 1940, 1140 2040
                   L 1660 2040
                   L 1660 -40 Z"
                fill="url(#cm-lake)"
                opacity="0.95"
              />

              {/* Beach strip along the shore */}
              <path
                d="M 1080 -40
                   C 1000 260, 960 560, 940 880
                   C 920 1100, 900 1220, 905 1340
                   C 920 1480, 990 1620, 1060 1780
                   C 1100 1880, 1120 1940, 1140 2040"
                stroke="#fde4c4"
                strokeWidth={22}
                fill="none"
                opacity="0.7"
                strokeLinecap="round"
              />

              {/* sailboats */}
              <g fill="#fff" opacity="0.85">
                <g transform="translate(1180 620)">
                  <polygon points="0,0 0,-36 22,0" fill="#fff" />
                  <polygon points="0,0 -2,-36 -22,0" fill="#ffe6f0" />
                  <rect x={-24} y={0} width={48} height={4} rx={2} fill="#fff" />
                </g>
                <g transform="translate(1380 980)">
                  <polygon points="0,0 0,-28 18,0" fill="#fff" />
                  <rect x={-18} y={0} width={36} height={3} rx={1.5} fill="#fff" />
                </g>
                <g transform="translate(1240 1480)">
                  <polygon points="0,0 0,-32 20,0" fill="#fff" />
                  <polygon points="0,0 -2,-32 -20,0" fill="#ffe6f0" />
                  <rect x={-22} y={0} width={44} height={4} rx={2} fill="#fff" />
                </g>
                <g transform="translate(1430 280)">
                  <polygon points="0,0 0,-22 14,0" fill="#fff" />
                  <rect x={-14} y={0} width={28} height={3} rx={1.5} fill="#fff" />
                </g>
              </g>

              {/* lake shimmer wavelets */}
              <g stroke="#fff" strokeLinecap="round" fill="none" opacity="0.45">
                {[
                  [1200, 420], [1320, 560], [1180, 720], [1400, 860],
                  [1260, 1020], [1380, 1180], [1200, 1360], [1340, 1520],
                  [1230, 1700], [1420, 1820],
                ].map(([cx, cy], i) => (
                  <path
                    key={i}
                    d={`M ${cx} ${cy} q 26 -6 52 0 q 26 -6 52 0`}
                    strokeWidth={3}
                  />
                ))}
              </g>

              {/* Lake Michigan label */}
              <text
                x={1360}
                y={1100}
                transform="rotate(90 1360 1100)"
                fontFamily="var(--font-script), cursive"
                fontSize="56"
                fill="#fff"
                opacity="0.85"
                letterSpacing="10"
              >
                lake michigan
              </text>

              {/* Lincoln Park */}
              <g>
                <ellipse cx={430} cy={540} rx={340} ry={260} fill="url(#cm-park)" opacity="0.85" />
                <g fill="#d67c9e" opacity="0.65">
                  {[
                    [260, 400], [320, 480], [380, 360], [440, 520], [500, 400],
                    [560, 500], [620, 420], [300, 580], [400, 640], [480, 700],
                    [560, 620], [640, 580], [220, 520], [360, 720], [520, 340],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r={10 + (i % 3) * 3} />
                  ))}
                </g>
                <g fill="#ec6fa0" opacity="0.7">
                  <circle cx={350} cy={450} r={6} />
                  <circle cx={360} cy={445} r={5} />
                  <circle cx={355} cy={460} r={4} />
                  <circle cx={530} cy={560} r={6} />
                  <circle cx={540} cy={555} r={5} />
                </g>
                <g transform="translate(410 540)" stroke="#b23a6a" strokeWidth={3} fill="#fff8">
                  <rect x={-22} y={-4} width={44} height={28} rx={3} />
                  <rect x={-22} y={-22} width={44} height={18} fill="#b23a6a" />
                  <line x1={-12} y1={-4} x2={-12} y2={24} />
                  <line x1={0} y1={-4} x2={0} y2={24} />
                  <line x1={12} y1={-4} x2={12} y2={24} />
                </g>
              </g>

              {/* Grant + Millennium Park */}
              <g>
                <rect x={540} y={1480} width={240} height={180} rx={30} fill="url(#cm-park)" opacity="0.85" />
                <g fill="#d67c9e" opacity="0.6">
                  <circle cx={570} cy={1510} r={8} />
                  <circle cx={610} cy={1560} r={9} />
                  <circle cx={660} cy={1500} r={7} />
                  <circle cx={710} cy={1540} r={8} />
                  <circle cx={740} cy={1610} r={9} />
                </g>
                {/* The Bean */}
                <g transform="translate(646 1560)">
                  <ellipse cx={0} cy={0} rx={40} ry={28} fill="#c8a8d8" />
                  <ellipse cx={0} cy={0} rx={40} ry={28} fill="none" stroke="#9773a8" strokeWidth={2} />
                  <path d="M -24 -14 Q -4 -22 22 -10" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity="0.9" />
                  <ellipse cx={-12} cy={4} rx={8} ry={4} fill="#fff" opacity="0.55" />
                </g>
              </g>

              {/* Navy Pier */}
              <rect x={820} y={1232} width={170} height={46} rx={10} fill="#f3cbd8" stroke="#b23a6a" strokeWidth={2} opacity="0.9" />

              {/* Adler Planetarium — small peninsula + dome */}
              <g>
                <ellipse cx={965} cy={1858} rx={70} ry={14} fill="#ffd8b8" stroke="#b23a6a" strokeWidth={1.2} opacity="0.85" />
                <path d="M 950 1855 A 15 15 0 0 1 980 1855 Z" fill="#c8a8d8" stroke="#7a2d54" strokeWidth={1.2} />
                <rect x={948} y={1855} width={34} height={7} fill="#fff5e0" stroke="#7a2d54" strokeWidth={1} />
                <circle cx={965} cy={1846} r={1.5} fill="#fff" />
              </g>

              {/* Chicago River — drawn before roads so bridges visually cross over */}
              <g stroke="#b8d4ec" strokeWidth={18} fill="none" strokeLinecap="round" opacity="0.8" filter="url(#cm-soft)">
                <path d="M 540 1160 Q 700 1150, 860 1130 Q 940 1120, 1000 1080" />
                <path d="M 540 1160 Q 490 1050, 460 900 Q 440 780, 420 640" />
                <path d="M 540 1160 Q 490 1260, 440 1380" />
              </g>

              {/* Buildings — clusters of rooftops with subtle window lines */}
              <g>
                {BUILDINGS.map(([x, y, w, h, ci], i) => (
                  <g key={`b${i}`}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      rx={3}
                      fill={BUILDING_COLORS[ci]}
                      stroke="#b23a6a"
                      strokeWidth={0.8}
                      opacity={0.8}
                    />
                    <line x1={x + 4} y1={y + 10} x2={x + w - 4} y2={y + 10} stroke="#b23a6a" strokeWidth={0.5} opacity={0.4} />
                    <line x1={x + 4} y1={y + h / 2} x2={x + w - 4} y2={y + h / 2} stroke="#b23a6a" strokeWidth={0.5} opacity={0.4} />
                    <line x1={x + 4} y1={y + h - 10} x2={x + w - 4} y2={y + h - 10} stroke="#b23a6a" strokeWidth={0.5} opacity={0.4} />
                    {/* rooftop highlight */}
                    <rect x={x + 2} y={y + 2} width={w - 4} height={3} rx={1} fill="#fff" opacity={0.35} />
                  </g>
                ))}
              </g>

              {/* Soft street grid (background minor streets) */}
              <g stroke="#fff" strokeWidth={2} opacity="0.22" strokeDasharray="8 22">
                {Array.from({ length: 14 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={140 + i * 130} x2={1040} y2={140 + i * 130} />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line key={`v${i}`} x1={120 + i * 130} y1={0} x2={120 + i * 130} y2={VIEW_H} />
                ))}
              </g>

              {/* Named roads — soft rose edge beneath a cream pavement */}
              <g fill="none" strokeLinecap="round">
                <g stroke="#b23a6a" strokeWidth={17} opacity="0.15">
                  {ROADS.map((r, i) => <path key={`pe${i}`} d={r.d} />)}
                </g>
                <g stroke="#ffe5cc" strokeWidth={14} opacity="0.95">
                  {ROADS.map((r, i) => <path key={`pa${i}`} d={r.d} />)}
                </g>
              </g>

              {/* Bridges over the main river stem */}
              <g>
                {BRIDGES.map(([x, y, w, h], i) => (
                  <g key={`br${i}`}>
                    <rect x={x} y={y} width={w} height={h} fill="#fff5e0" stroke="#b23a6a" strokeWidth={1.2} opacity={0.9} />
                    {[0.25, 0.5, 0.75].map((f, j) => (
                      <line
                        key={j}
                        x1={x + w * f}
                        y1={y + 2}
                        x2={x + w * f}
                        y2={y + h - 2}
                        stroke="#b23a6a"
                        strokeWidth={0.8}
                        opacity={0.55}
                      />
                    ))}
                  </g>
                ))}
              </g>

              {/* Road center dashed line on top of pavement */}
              <g
                fill="none"
                strokeLinecap="round"
                stroke="#fff"
                strokeWidth={2}
                strokeDasharray="10 14"
                opacity="0.85"
              >
                {ROADS.map((r, i) => <path key={`pc${i}`} d={r.d} />)}
              </g>

              {/* Street labels */}
              <g fontFamily="var(--font-script), cursive" fontSize="26" fill="#b23a6a" opacity="0.7">
                <text x={795} y={1050} transform="rotate(-90 795 1050)">michigan ave</text>
                <text x={655} y={1000} transform="rotate(-90 655 1000)">clark st</text>
                <text x={355} y={1000} transform="rotate(-90 355 1000)">halsted st</text>
                <text x={160} y={712}>north ave</text>
                <text x={160} y={532}>fullerton</text>
                <text x={875} y={1440} transform="rotate(78 875 1440)" fill="#fff" opacity="0.85">lake shore dr</text>
              </g>

              {/* Neighborhood labels */}
              <g fontFamily="var(--font-script), cursive" fontSize="48" fill="#b23a6a" opacity="0.45">
                <text x={120} y={240}>lincoln park</text>
                <text x={140} y={900}>old town</text>
                <text x={560} y={1280}>river north</text>
                <text x={820} y={1280}>streeterville</text>
                <text x={280} y={1200}>west town</text>
                <text x={560} y={1780}>the loop</text>
                <text x={820} y={1120}>gold coast</text>
              </g>

              {/* sparkles */}
              <g fill="#fff" opacity="0.9">
                {[
                  [180, 160, 3], [920, 80, 4], [1500, 240, 3], [1580, 1000, 3],
                  [240, 820, 3], [740, 360, 2.5], [1060, 500, 3.5], [420, 1400, 3],
                  [880, 1700, 3], [1520, 1860, 3.5], [300, 1680, 3], [680, 140, 3],
                  [120, 1060, 2.5], [1100, 1880, 3], [260, 1940, 2.5], [1560, 560, 3],
                  [860, 460, 2.5], [440, 1300, 3], [720, 1660, 2.5], [1080, 1240, 3],
                ].map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} />
                ))}
              </g>

              {/* faint hearts */}
              <g fill="#ec6fa0" opacity="0.35">
                {[[1240, 180], [220, 1200], [1480, 1440], [620, 1920]].map(
                  ([cx, cy], i) => (
                    <path
                      key={i}
                      transform={`translate(${cx} ${cy}) scale(1.6)`}
                      d="M 0 6 C -8 -4, -18 4, 0 20 C 18 4, 8 -4, 0 6 Z"
                    />
                  )
                )}
              </g>

              {/* compass rose */}
              <g transform="translate(130 140)" opacity="0.7">
                <circle cx={0} cy={0} r={44} fill="#fff8" stroke="#b23a6a" strokeWidth={2} />
                <polygon points="0,-40 6,0 0,40 -6,0" fill="#b23a6a" opacity="0.8" />
                <polygon points="-40,0 0,-6 40,0 0,6" fill="#b23a6a" opacity="0.35" />
                <text x={0} y={-48} textAnchor="middle" fontFamily="var(--font-script), cursive" fontSize="22" fill="#b23a6a">n</text>
              </g>

              {/* Progress paths — drawn once the previous flower is solved */}
              <g>
                {allLocations.slice(0, -1).map((loc, i) => {
                  const next = allLocations[i + 1];
                  if (!solvedIds.has(loc.id)) return null;
                  const from = projectSvg(loc.coords);
                  const to = projectSvg(next.coords);
                  const midX = (from.x + to.x) / 2;
                  const midY = Math.min(from.y, to.y) - 90;
                  return (
                    <g key={`path-${loc.id}-${next.id}`}>
                      <motion.path
                        d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                        stroke="#ec4899"
                        strokeWidth={7}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="16 14"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.85 }}
                        transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                      />
                      <motion.path
                        d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                        stroke="#fff1a8"
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.9 }}
                        transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Hidden anchor so onInit can center the starting zoom on River North */}
            {(() => {
              const { xPct, yPct } = project(RIVER_NORTH);
              return (
                <div
                  id="cm-rn-anchor"
                  aria-hidden
                  className="pointer-events-none absolute h-px w-px"
                  style={{ left: `${xPct}%`, top: `${yPct}%` }}
                />
              );
            })()}

            {/* Interactive flower pins */}
            {(() => {
              const currentIdx = allLocations.findIndex(
                (l) => !solvedIds.has(l.id)
              );
              return allLocations.map((loc, i) => {
                const { xPct, yPct } = project(loc.coords);
                const solved = solvedIds.has(loc.id);
                const isCurrent = !solved && i === currentIdx;
                const isLocked = !solved && !isCurrent;
                const variant = solved ? "bloom" : isLocked ? "locked" : "bud";
                const showStartHere = isCurrent && i === 0;

                return (
                  <button
                    key={loc.id}
                    type="button"
                    aria-label={loc.name}
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) onSelect(loc);
                    }}
                    className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus:outline-none ${
                      isLocked ? "cursor-not-allowed opacity-45" : "cursor-pointer"
                    }`}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                  >
                    {showStartHere && (
                      <motion.span
                        initial={{ y: 2, opacity: 0 }}
                        animate={{ y: [0, -2, 0], opacity: 1 }}
                        transition={{
                          y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
                          opacity: { duration: 0.4 },
                        }}
                        className="mb-0.5 whitespace-nowrap rounded-full bg-rose-500 px-1.5 py-0.5 font-script text-[9px] leading-tight text-white shadow-md"
                      >
                        start here ✨
                      </motion.span>
                    )}
                    <FlowerPin variant={variant} size={18} label={loc.name} />
                    <span
                      className={`mt-0.5 whitespace-nowrap rounded-full px-1 py-0 font-script text-[8px] leading-tight shadow-sm backdrop-blur-sm ${
                        isLocked
                          ? "bg-white/50 text-rose-300"
                          : "bg-white/80 text-rose-600"
                      }`}
                    >
                      {loc.name.toLowerCase()}
                    </span>
                  </button>
                );
              });
            })()}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Sunset overlay — stays fixed over the viewport */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,200,180,0.10) 0%, rgba(255,170,210,0.04) 55%, rgba(200,150,210,0.14) 100%)",
          mixBlendMode: "soft-light",
        }}
      />

    </div>
  );
}
