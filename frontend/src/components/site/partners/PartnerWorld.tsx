"use client";

import { useEffect, useRef, useState } from "react";
import type { Partner } from "@/lib/types";
import { useMotionOK } from "@/lib/use-motion";
import { PartnerLogo, PartnerReference, WebsiteLink, shortName } from "./PartnerParts";

/*
  Dot maps with water routes to the programme in Musanze. Outlines are simplified on purpose:
  drawn as dots they read as a map without pretending to be a survey. Two maps share one engine:
  Europe and Africa for the international partners, Rwanda for the local partners.
*/

type Pt = readonly [number, number];
type Poly = [number, number][];

function inside(lon: number, lat: number, poly: Poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Dots on a grid inside `land` and outside `holes`, as one path of zero-length strokes (round caps draw the dots). */
function dotPath(o: { lon0: number; lon1: number; lat0: number; lat1: number; k: number; step: number; land: Poly[]; holes?: Poly[] }) {
  let d = "";
  for (let lat = o.lat0 - o.step / 2; lat > o.lat1; lat -= o.step) {
    for (let lon = o.lon0 + o.step / 2; lon < o.lon1; lon += o.step) {
      if (o.land.some((p) => inside(lon, lat, p)) && !(o.holes ?? []).some((p) => inside(lon, lat, p))) {
        d += `M${((lon - o.lon0) * o.k).toFixed(1)} ${((o.lat0 - lat) * o.k).toFixed(1)}h0`;
      }
    }
  }
  return d;
}

/** A curve from a pin to the hub that bows to one side, so neighbouring routes fan out. */
function route([x1, y1]: Pt, [x2, y2]: Pt, bend: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = mx - (y2 - y1) * bend;
  const cy = my + (x2 - x1) * bend;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

interface Home {
  /** Label shown by the pin (always on the world map; only while chosen on the Rwanda map). */
  label: string;
  pins: Pt[];
}

interface MapDef {
  id: string;
  title: (homes: Home[]) => string;
  W: number;
  H: number;
  land: string;
  water?: string;
  dot: number;
  hub: Pt;
  hubLabel: { dx: number; dy: number; anchor: "start" | "end" };
  /** Place names drawn on the map (countries, towns). */
  places: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; kind: "country" | "town" | "water" }[];
  line?: { y: number; text: string };
  homes: (partners: Partner[]) => Home[];
  bend: (i: number) => number;
  labelsAlways: boolean;
  caption: (n: number) => string;
}

/** How long each partner stays on screen when the slider turns by itself. */
const SLIDE_MS = 6500;

/* ---------- Europe and Africa (10 units per degree, lon -12..42, lat 58..-12) ---------- */
const E = { lon0: -12, lon1: 42, lat0: 58, lat1: -12, k: 10 };
const ePx = (lon: number, lat: number): Pt => [(lon - E.lon0) * E.k, (E.lat0 - lat) * E.k];
const WORLD_LAND: Poly[] = [
  [[-17.1, 21], [-16, 23.5], [-14.5, 26], [-13, 27.8], [-9.8, 29.8], [-9.6, 32.5], [-6.8, 34], [-5.9, 35.8], [-2, 35.1], [1, 36.5], [5, 36.8], [10, 37.3], [11.1, 35.2], [10.2, 33.8], [11.5, 33.1], [15.5, 32], [19.8, 30.6], [20.1, 32.2], [23, 32.6], [25, 31.7], [29, 30.9], [32.3, 31.3], [34.2, 31.3], [34.4, 29.5], [33, 28.1], [35, 24], [37, 21], [38.6, 18], [39.7, 15.5], [41.7, 13.5], [43.3, 12.5], [44.5, 10.4], [51.2, 11.8], [51, 10.4], [49.5, 6.5], [47.9, 4.4], [46, 2], [43.5, -0.5], [41.6, -1.8], [40.1, -3], [39.2, -4.7], [39.3, -6.8], [39.5, -8.5], [40.4, -10.5], [40.5, -14], [12.5, -14], [13.6, -10], [12.3, -6], [12, -5], [11, -3.5], [9.4, -0.8], [9.6, 1], [9.8, 3], [8.5, 4.5], [6, 4.3], [4.5, 6.3], [2, 6.3], [-0.5, 5.5], [-2, 4.8], [-4, 5.2], [-7.5, 4.4], [-9, 5], [-11.5, 6.9], [-13.2, 8.5], [-13.5, 9.5], [-15, 11], [-16.7, 12.5], [-17.5, 14.7], [-16.5, 16.5], [-16, 19]],
  [[34.2, 31.3], [35, 33], [35.9, 35.5], [36.2, 36.6], [40, 37], [44, 37], [44, 30], [48, 29.5], [50, 26], [51.5, 24.5], [56, 24], [59, 22.5], [57, 19], [52, 16], [48, 14], [45, 12.8], [43.3, 12.7], [42.6, 15], [40.8, 19.5], [39, 21.7], [37, 25.5], [35, 28], [34.6, 29.5]],
  [[26.1, 40], [26.4, 38.4], [27.3, 37], [28.5, 36.7], [30.6, 36.8], [32.5, 36.1], [34.6, 36.8], [36.2, 36.6], [40, 37], [44, 37], [44, 41], [41.5, 41.5], [38, 41], [35, 42], [33, 42], [31, 41.2], [29, 41.1], [27.5, 41]],
  [[-8.9, 42], [-8.8, 40], [-9.4, 38.8], [-8.8, 37], [-7.4, 37.2], [-6, 36.2], [-5.4, 36.1], [-4.4, 36.7], [-2.1, 36.7], [-0.6, 37.6], [0.2, 38.8], [-0.3, 39.5], [0.9, 41], [3.2, 41.9], [3.1, 43.1], [4.6, 43.4], [6.5, 43.1], [7.6, 43.8], [8.8, 44.4], [10.2, 43.9], [10.5, 42.9], [12, 41.9], [13.6, 41.2], [15.6, 40.1], [16, 38.9], [15.7, 38], [16.6, 38.4], [17.1, 39], [16.5, 39.7], [17, 40.5], [18.5, 40.1], [18.4, 40.6], [16, 41.4], [15, 42], [14, 42.6], [13.6, 43.5], [12.4, 44.2], [12.3, 45.2], [13.1, 45.7], [13.7, 45.6], [14.5, 45.2], [15.2, 44.3], [16.4, 43.5], [18.5, 42.5], [19.4, 41.9], [19.4, 40.4], [20.1, 39.6], [21, 38.4], [21.8, 36.8], [22.5, 36.4], [23, 38.2], [24, 38], [23, 39.5], [22.6, 40.3], [23.7, 40.2], [24.4, 40.9], [26, 40.8], [28, 41.6], [28, 43.4], [28.6, 43.8], [29.7, 45.2], [30.5, 46.4], [31.5, 46.6], [33.5, 46], [32.5, 45.4], [33.5, 44.5], [35.5, 45.1], [36.5, 45.3], [35, 46.3], [38, 47.1], [39.5, 47], [38.2, 46], [39, 44.5], [41.6, 42], [42, 42], [42, 58], [28, 58], [24.3, 58.3], [24, 57], [21, 56.8], [21, 55.3], [19.5, 54.4], [18.5, 54.8], [16.5, 54.5], [14.2, 53.9], [12, 54.2], [10.8, 54], [10, 54.6], [10.5, 56], [10.6, 57.7], [8.2, 56.8], [8.1, 55.5], [8.6, 54], [7, 53.4], [4.8, 53], [4, 51.9], [3.3, 51.3], [1.6, 50.9], [1.6, 50.2], [0.2, 49.7], [-1.3, 49.7], [-1.6, 48.6], [-3, 48.8], [-4.7, 48.4], [-4.3, 47.8], [-2.5, 47.3], [-1.2, 46.2], [-1.3, 44.5], [-1.8, 43.4], [-3.8, 43.4], [-7.8, 43.7], [-9.2, 43.1]],
  [[12.5, 56.3], [12.9, 55.4], [14.2, 55.4], [16, 56.2], [16.6, 57.5], [16.8, 58], [11.2, 58], [11.8, 57.6]],
  [[-5.7, 50.1], [-3.5, 50.3], [-1, 50.7], [1.4, 51.2], [1.7, 52.6], [0.3, 53.4], [-0.2, 54.1], [-1.3, 54.8], [-1.6, 55.6], [-2.4, 56], [-3, 58], [-6, 58], [-5.6, 56.4], [-5, 55], [-3.3, 54.9], [-3, 53.8], [-4.6, 53.3], [-4.1, 52.3], [-5.2, 51.8], [-3.5, 51.5], [-4.5, 51]],
  [[-10.2, 51.6], [-8, 51.6], [-6.2, 52.2], [-6, 53.3], [-5.5, 54.5], [-6.2, 55.2], [-7.5, 55.3], [-8.6, 54.6], [-10, 54.1], [-9.8, 53]],
  [[8.6, 41.4], [9.4, 41.6], [9.5, 43], [8.6, 42.4]],
  [[8.4, 39], [9.6, 39.1], [9.8, 40.9], [8.2, 41], [8.4, 39.9]],
  [[12.4, 37.9], [15.6, 38.3], [15.1, 36.7], [13.6, 37.2]],
  [[32.3, 34.7], [34.6, 35.6], [34, 34.6]],
];
const VICTORIA: Poly = [[31.6, -1], [31.8, 0.3], [33, 0.4], [34.1, -0.3], [34, -1.2], [33.5, -2.5], [32, -2.6], [31.6, -1.8]];
const WORLD_HOMES: { match: RegExp; lon: number; lat: number; label: string }[] = [
  { match: /misereor/i, lon: 6.08, lat: 50.78, label: "Aachen" },
  { match: /medicus/i, lon: -1.64, lat: 42.81, label: "Navarra" },
  { match: /manos/i, lon: -3.7, lat: 40.42, label: "Madrid" },
  { match: /vincenzo|paoli/i, lon: 12.5, lat: 41.9, label: "Italy" },
];

const WORLD: MapDef = {
  id: "world",
  title: (h) => `Map: routes from ${h.map((x) => x.label).join(", ")} to the Hydraulic Programme in Musanze, Rwanda`,
  W: 540,
  H: 700,
  land: dotPath({ ...E, step: 1.15, land: WORLD_LAND, holes: [VICTORIA] }),
  dot: 4.6,
  hub: ePx(29.63, -1.5),
  hubLabel: { dx: -14, dy: 5, anchor: "end" },
  places: [],
  line: { y: E.lat0 * E.k, text: "EQUATOR" },
  homes: (ps) =>
    ps.map((p, i) => {
      const h = WORLD_HOMES.find((x) => x.match.test(p.name));
      return h ? { label: h.label, pins: [ePx(h.lon, h.lat)] } : { label: p.place || shortName(p.name), pins: [ePx(-4 + i * 7, 52 - (i % 2) * 4)] };
    }),
  bend: (i) => 0.16 + (i % 2) * 0.1,
  labelsAlways: true,
  caption: (n) => `${n} international partners · routes to Musanze, Rwanda. Point at a partner to follow its route.`,
};

/* ---------- Rwanda (200 units per degree, lon 28.75..31, lat -0.95..-2.95) ---------- */
const R = { lon0: 28.75, lon1: 31, lat0: -0.95, lat1: -2.95, k: 200 };
const rPx = (lon: number, lat: number): Pt => [(lon - R.lon0) * R.k, (R.lat0 - lat) * R.k];
const RWANDA: Poly = [
  [29.25, -1.62], [29.36, -1.5], [29.58, -1.39], [29.82, -1.32], [30.0, -1.42], [30.15, -1.3], [30.35, -1.13], [30.47, -1.06], [30.57, -1.33], [30.74, -1.56],
  [30.83, -1.85], [30.9, -2.08], [30.85, -2.3], [30.78, -2.38], [30.57, -2.4], [30.4, -2.33], [30.15, -2.43], [29.95, -2.48], [29.85, -2.7], [29.6, -2.8],
  [29.35, -2.82], [29.05, -2.75], [28.9, -2.65], [28.87, -2.5], [28.98, -2.3], [29.05, -2.05], [29.15, -1.85],
];
const KIVU: Poly = [[29.24, -1.66], [29.18, -1.8], [29.1, -1.95], [29.03, -2.12], [28.97, -2.3], [28.9, -2.45], [28.82, -2.42], [28.8, -2.25], [28.85, -2.0], [28.95, -1.8], [29.1, -1.68]];
const MUSANZE: Pt = rPx(29.63, -1.5);
const KIGALI: Pt = rPx(30.06, -1.95);
const DISTRICTS = { Gakenke: rPx(29.78, -1.69), Burera: rPx(29.88, -1.45), Nyabihu: rPx(29.5, -1.66) };
/** n points on a small ring around a town, so partners in the same town each get a pin. */
const ring = (c: Pt, r: number, n: number, i: number, start = -Math.PI / 2): Pt => {
  const a = start + (i / n) * Math.PI * 2;
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
};

/** n points on an arc east of a town (from north-north-west round to south), leaving its west side free. */
const arc = (c: Pt, r: number, n: number, i: number): Pt => {
  const a = (-110 + (n > 1 ? (i * 190) / (n - 1) : 0)) * (Math.PI / 180);
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
};

const RWANDA_MAP: MapDef = {
  id: "rwanda",
  title: () => "Map of Rwanda: routes from our local partners in Kigali, the districts and Musanze to the Hydraulic Programme in Musanze",
  W: 450,
  H: 400,
  land: dotPath({ ...R, step: 0.042, land: [RWANDA] }),
  water: dotPath({ ...R, step: 0.042, land: [KIVU] }),
  dot: 5,
  hub: MUSANZE,
  hubLabel: { dx: -18, dy: 2, anchor: "end" },
  places: [
    { ...xy(rPx(29.95, -1.0)), text: "UGANDA", kind: "country" },
    { ...xy(rPx(31.0, -1.1)), text: "TANZANIA", anchor: "end", kind: "country" },
    { ...xy(rPx(29.75, -2.92)), text: "BURUNDI", kind: "country" },
    { ...xy(rPx(28.78, -1.17)), text: "DR CONGO", anchor: "start", kind: "country" },
    { ...xy(rPx(28.99, -2.08)), text: "Lake Kivu", kind: "water" },
    { x: KIGALI[0], y: KIGALI[1] + 34, text: "Kigali", kind: "town" },
    { x: DISTRICTS.Gakenke[0] + 10, y: DISTRICTS.Gakenke[1] + 16, text: "Gakenke", anchor: "start", kind: "town" },
    { x: DISTRICTS.Burera[0] + 10, y: DISTRICTS.Burera[1] - 8, text: "Burera", anchor: "start", kind: "town" },
    { x: DISTRICTS.Nyabihu[0] - 8, y: DISTRICTS.Nyabihu[1] + 18, text: "Nyabihu", anchor: "end", kind: "town" },
  ],
  homes: (ps) => {
    const musanze = ps.filter((p) => /INES|DORWASA|DERN|Diocese/i.test(p.name));
    const kigali = ps.filter((p) => !musanze.includes(p) && !/Local Administrative/i.test(p.name));
    return ps.map((p) => {
      if (/Local Administrative/i.test(p.name)) return { label: shortName(p.name), pins: [DISTRICTS.Gakenke, DISTRICTS.Burera, DISTRICTS.Nyabihu] };
      if (musanze.includes(p)) return { label: shortName(p.name), pins: [arc(MUSANZE, 30, musanze.length, musanze.indexOf(p))] };
      return { label: shortName(p.name), pins: [ring(KIGALI, 17, kigali.length, kigali.indexOf(p))] };
    });
  },
  bend: (i) => (i % 2 ? -0.18 : 0.14),
  labelsAlways: false,
  caption: (n) => `${n} local partners · routes to Musanze. Point at a partner to follow its route.`,
};

function xy([x, y]: Pt) {
  return { x, y };
}

const MAPS = { world: WORLD, rwanda: RWANDA_MAP } as const;

/**
 * A map with a glowing water route from each partner to Musanze, beside a transparent card per
 * partner. Pointing at a card (or a pin) lights up its route; when nobody is pointing, the routes
 * light up in turn. The map stays in view while the cards scroll past. Each card opens to show the
 * partner's reference.
 */
export function PartnerWorld({ partners, map = "world" }: { partners: Partner[]; map?: keyof typeof MAPS }) {
  const m = MAPS[map];
  const motion = useMotionOK();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);
  const n = partners.length;

  // Move to the next partner in turn while nobody is pointing at the map or the card.
  useEffect(() => {
    if (!motion || held || n < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % n), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [motion, held, n, active]);

  // Open the partner named in the address (#partner-12), e.g. from the Home page.
  useEffect(() => {
    const fromHash = () => {
      const id = Number(window.location.hash.replace("#partner-", ""));
      const i = partners.findIndex((p) => p.id === id);
      if (i < 0) return;
      setActive(i);
      setHeld(true);
      root.current?.scrollIntoView({ block: "center" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [partners]);

  const go = (i: number) => setActive(((i % n) + n) % n);

  const homes = m.homes(partners);
  const routes = homes.map((h, i) => h.pins.map((pin) => route(pin, m.hub, m.bend(i))));

  const focusCard = (i: number) => {
    setActive(i);
    setHeld(true);
  };

  const g = `pw-${m.id}`;
  // Draw the chosen partner last so its route and pins sit on top.
  const order = partners.map((_, i) => i).sort((a, b) => Number(a === active) - Number(b === active));

  return (
    // data-no-reveal: these cards re-render as the routes change, which would wipe the scroll-reveal class.
    <div ref={root} data-no-reveal="" className="grid items-center gap-10 lg:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] lg:gap-14">
      {/* The map */}
      <figure className="relative mx-auto w-full max-w-[520px]" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
        <svg viewBox={`0 0 ${m.W} ${m.H}`} className="h-auto w-full overflow-visible" role="img" aria-labelledby={`${g}-title`}>
          <title id={`${g}-title`}>{m.title(homes)}</title>
          <defs>
            <radialGradient id={`${g}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#48cae4" stopOpacity=".55" />
              <stop offset="1" stopColor="#48cae4" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${g}-route`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#90e0ef" />
              <stop offset="1" stopColor="#48cae4" />
            </linearGradient>
            <filter id={`${g}-blur`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          <path d={m.land} stroke="#9fbde3" strokeOpacity=".5" strokeWidth={m.dot} strokeLinecap="round" fill="none" />
          {m.water && <path d={m.water} stroke="#48cae4" strokeOpacity=".28" strokeWidth={m.dot * 0.8} strokeLinecap="round" fill="none" />}

          {m.line && (
            <>
              <line x1="0" x2={m.W} y1={m.line.y} y2={m.line.y} stroke="#9fbde3" strokeOpacity=".18" strokeDasharray="2 7" />
              <text x={m.W - 6} y={m.line.y - 6} textAnchor="end" fill="#9fbde3" fillOpacity=".45" fontSize="11" letterSpacing="2">
                {m.line.text}
              </text>
            </>
          )}

          {m.places.map((p) => (
            <text
              key={p.text}
              x={p.x}
              y={p.y}
              textAnchor={p.anchor ?? "middle"}
              fill={p.kind === "town" ? "#cfe3f5" : p.kind === "water" ? "#48cae4" : "#9fbde3"}
              fillOpacity={p.kind === "town" ? 0.9 : 0.5}
              fontSize={p.kind === "town" ? 12 : 10.5}
              fontWeight={p.kind === "town" ? 600 : 500}
              fontStyle={p.kind === "water" ? "italic" : undefined}
              letterSpacing={p.kind === "country" ? 2.5 : undefined}
            >
              {p.text}
            </text>
          ))}

          {order.map((i) => {
            const on = i === active;
            return (
              <g key={i} style={{ transition: "opacity .5s" }} opacity={on ? 1 : 0.38}>
                {routes[i].map((d, j) => (
                  <g key={j}>
                    {on && <path d={d} stroke="#48cae4" strokeWidth="7" fill="none" filter={`url(#${g}-blur)`} opacity=".7" />}
                    <path d={d} stroke={`url(#${g}-route)`} strokeWidth={on ? 2.6 : 1.4} fill="none" strokeLinecap="round" className={motion ? "route-flow" : undefined} strokeDasharray="6 7" />
                    {motion && (
                      <circle r={on ? 4.6 : 3} fill="#ffffff">
                        <animateMotion dur={`${3 + ((i + j) % 4) * 0.45}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    )}
                  </g>
                ))}
              </g>
            );
          })}

          {/* the hub: the programme in Musanze */}
          <g transform={`translate(${m.hub[0]} ${m.hub[1]})`}>
            <circle r="46" fill={`url(#${g}-glow)`} />
            {motion && <circle r="10" fill="none" stroke="#90e0ef" strokeWidth="1.5" className="map-ping" />}
            <circle r="8" fill="#ffffff" />
            <circle r="4" fill="#0077b6" />
            <text x={m.hubLabel.dx} y={m.hubLabel.dy} textAnchor={m.hubLabel.anchor} fill="#ffffff" fontSize="15" fontWeight="700" stroke="#002e6d" strokeWidth="4" paintOrder="stroke">
              Musanze
            </text>
            <text x={m.hubLabel.dx} y={m.hubLabel.dy + 16} textAnchor={m.hubLabel.anchor} fill="#90e0ef" fontSize="11.5" stroke="#002e6d" strokeWidth="4" paintOrder="stroke">
              Hydraulic Programme
            </text>
          </g>

          {/* partner pins */}
          {order.map((i) => {
            const h = homes[i];
            const on = i === active;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setActive(i)} onClick={() => focusCard(i)}>
                {h.pins.map((pin, j) => (
                  <g key={j} transform={`translate(${pin[0]} ${pin[1]})`}>
                    <circle r="14" fill="transparent" />
                    {on && motion && <circle r="7" fill="none" stroke="#48cae4" strokeWidth="1.5" className="map-ping" />}
                    <circle r={on ? 8 : 5.5} fill={on ? "#48cae4" : "#ffffff"} stroke="#002e6d" strokeWidth="2.5" style={{ transition: "r .3s, fill .3s" }} />
                  </g>
                ))}
                {(m.labelsAlways || on) &&
                  (() => {
                    const [x, y] = h.pins[0];
                    // world map: names to the right of pins near the west edge; Rwanda map: to the right of pins east of Musanze, so they never cover its name
                    const left = m.labelsAlways ? x < 120 : x >= m.hub[0] - 4;
                    return (
                      <text
                        x={x + (left ? 14 : -14)}
                        y={y + (m.labelsAlways && i === 1 ? -10 : 5) - (m.labelsAlways ? 0 : 14)}
                        textAnchor={left ? "start" : "end"}
                        fill={on ? "#ffffff" : "#cfe3f5"}
                        fontSize={on ? 15 : 13}
                        fontWeight={on ? 700 : 500}
                        stroke="#002e6d"
                        strokeWidth="4"
                        paintOrder="stroke"
                        className={m.labelsAlways ? undefined : "panel-in"}
                      >
                        {h.label}
                      </text>
                    );
                  })()}
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-3 text-center text-[12.5px] text-white/60">{m.caption(partners.length)}</figcaption>
      </figure>

      {/* The cards: a slider, one partner at a time, in step with the map */}
      <div
        className="min-w-0"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onKeyDown={(e) => {
          if (e.target instanceof HTMLElement && e.target.closest("summary, a")) return;
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
      >
        {/* counter, arrows and the timer of the automatic turn */}
        <div className="flex items-center justify-between gap-4">
          <p className="tabular-nums" aria-live={held ? "polite" : "off"}>
            <span className="font-display text-[40px] font-light leading-none text-white">{String(active + 1).padStart(2, "0")}</span>
            <span className="text-[14px] font-semibold text-white/50"> / {String(n).padStart(2, "0")}</span>
            <span className="sr-only">: {partners[active]?.name}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous partner" className="flex h-11 w-11 items-center justify-center border border-white/30 text-white transition-colors hover:border-[#48cae4] hover:bg-[#48cae4] hover:text-navy">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next partner" className="flex h-11 w-11 items-center justify-center border border-white/30 text-white transition-colors hover:border-[#48cae4] hover:bg-[#48cae4] hover:text-navy">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="mt-3 flex gap-1">
          {partners.map((p, i) => (
            <span key={p.id} className="relative h-[3px] flex-1 overflow-hidden bg-white/15">
              {i < active && <span className="absolute inset-0 bg-[#48cae4]" />}
              {i === active && (
                <span
                  key={`${active}-${held}`}
                  className={`absolute inset-0 origin-left bg-[#48cae4] ${motion && !held ? "slide-timer" : ""}`}
                  style={{ animationDuration: `${SLIDE_MS}ms` }}
                />
              )}
            </span>
          ))}
        </div>

        {/* the slides, stacked in one place so the slider keeps the height of the tallest card */}
        <div
          className="mt-5 grid"
          onPointerDown={(e) => {
            swipe.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (swipe.current === null) return;
            const dx = e.clientX - swipe.current;
            swipe.current = null;
            if (Math.abs(dx) > 50) {
              setHeld(true);
              go(active + (dx < 0 ? 1 : -1));
            }
          }}
        >
          {partners.map((p, i) => {
            const on = i === active;
            const side = i < active ? "is-before" : i > active ? "is-after" : "";
            return (
              <article
                key={p.id}
                id={`partner-${p.id}`}
                aria-label={p.name}
                aria-hidden={!on}
                inert={!on}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className={`slide spot-card glass-card group relative scroll-mt-8 overflow-hidden border [grid-area:1/1] ${
                  on ? "is-on border-[#48cae4]/70 bg-white/[.1] shadow-[0_24px_60px_-30px_rgba(72,202,228,.55)]" : `border-white/15 bg-white/[.05] ${side}`
                }`}
              >
                <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-[#48cae4]" />
                <div className="relative flex flex-wrap items-center gap-5 p-5 sm:p-6">
                  <div className="logo-tile flex h-[78px] w-[132px] flex-none items-center justify-center bg-white p-3 text-[26px] shadow-[0_14px_30px_-18px_rgba(0,0,0,.6)]">
                    <PartnerLogo partner={p} sizes="264px" />
                  </div>
                  <div className="min-w-0 flex-[1_1_220px]">
                    {p.badge && (
                      <span className={`inline-block px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[.08em] ${/principal/i.test(p.badge) ? "bg-[#ffd166] text-navy" : "bg-[#48cae4]/20 text-[#90e0ef]"}`}>
                        {p.badge}
                      </span>
                    )}
                    <h3 className={`text-[19px] font-bold leading-[1.25] text-white ${p.badge ? "mt-1.5" : ""}`}>{p.name}</h3>
                    {p.place && (
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/70">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-none text-[#48cae4]" fill="currentColor">
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                        </svg>
                        {p.place}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
                  <p className="text-[12px] font-bold uppercase tracking-[.14em] text-[#90e0ef]">Collaboration experience</p>
                  <p className="mt-2 text-[15px] leading-[1.7] text-white/90">{p.description}</p>
                  <details className="ref-details mt-4 border-t border-white/15 pt-3">
                    <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 text-[13.5px] font-semibold text-white hover:text-[#90e0ef]">
                      Partner reference
                      <span aria-hidden="true" className="ref-plus relative h-4 w-4 flex-none" />
                    </summary>
                    <div className="ref-body pb-1 pt-3">
                      <PartnerReference partner={p} tone="dark" />
                    </div>
                  </details>
                  {p.websiteUrl && (
                    <div className="mt-4">
                      <WebsiteLink partner={p} tone="dark" />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* every partner as a small logo chip: jump straight to one */}
        <ul aria-label="Choose a partner" className="mt-5 flex flex-wrap gap-2">
          {partners.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setHeld(true);
                    go(i);
                  }}
                  aria-pressed={on}
                  title={p.name}
                  className={`flex h-11 w-[68px] items-center justify-center bg-white p-1.5 text-[12px] transition-[translate,box-shadow,opacity] duration-300 ${
                    on ? "-translate-y-1 opacity-100 shadow-[0_0_0_3px_#48cae4,0_12px_24px_-12px_rgba(0,0,0,.6)]" : "opacity-60 hover:-translate-y-0.5 hover:opacity-100"
                  }`}
                >
                  <PartnerLogo partner={p} sizes="136px" />
                  <span className="sr-only">{p.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
