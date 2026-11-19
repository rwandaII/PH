// Generates public/patterns/water-lines-light.svg and water-lines-soft.svg: the "technology water" texture used in page
// headers (see components/site/TechLines.tsx). Run: node scripts/water-dots.mjs
//
// Thin, continuous wavy lines in a pale white-blue, stacked close together like the surface of
// water and only faintly visible, all the same soft brightness. They move like water: the lines
// are split into three interleaved sets that travel sideways together, each gently rising and
// falling on its own rhythm, so neighbouring lines move a little differently and the
// surface ripples. Each line is drawn in one piece (no tiles, so no seams) and repeats every
// PERIOD units, so sliding it by one PERIOD loops seamlessly. Still for reduced motion.
import { writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const W = 1600; // drawing size; headers show it with object-cover, anchored right
const H = 900;
const PERIOD = 640; // the waves repeat every PERIOD units across
const GAP = 12; // space between neighbouring lines (small and tidy)
const STEP = 14; // sample spacing along a line

// the three sets of lines: [seconds to travel one PERIOD, seconds per rise-and-fall, rise in units].
// All sets travel at the same speed so neighbouring lines stay in step and never cross; only
// their gentle rise and fall differs, which makes the surface ripple.
const SETS = [
  [34, 6, 2.6],
  [34, 8, 2.2],
  [34, 10, 2.8],
];

const TWO_PI = Math.PI * 2;
const sets = SETS.map(() => []);
for (let i = 0, y0 = -40; y0 < H + 40; i++, y0 += GAP) {
  const a1 = 14 + 5 * Math.sin(i * 0.21); // the long wave, varying a little from line to line
  const a2 = 3.5 + 1.5 * Math.sin(i * 0.37 + 1); // a shorter ripple on top
  const p1 = i * 0.09; // neighbouring lines almost in step
  const p2 = i * 0.23;
  const pts = [];
  for (let x = 0; x <= W + PERIOD + 0.1; x += STEP) {
    const y = y0 + a1 * Math.sin((TWO_PI * x) / PERIOD + p1) + a2 * Math.sin((TWO_PI * 2 * x) / PERIOD + p2);
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  sets[i % SETS.length].push(`<path d="M${pts.join("L")}"/>`);
}

let css = "";
let body = "";
SETS.forEach(([travel, bob, rise], k) => {
  // the outer group travels sideways; the inner group rises and falls
  css +=
    `.t${k}{animation:t${k} ${travel}s linear infinite}@keyframes t${k}{to{transform:translateX(-${PERIOD}px)}}` +
    `.b${k}{animation:b${k} ${bob}s ease-in-out infinite alternate}@keyframes b${k}{from{transform:translateY(-${rise}px)}to{transform:translateY(${rise}px)}}`;
  body += `<g class="t${k}"><g class="b${k}">${sets[k].join("")}</g></g>`;
});
css += "@media (prefers-reduced-motion:reduce){g{animation:none!important}}";

// Two colourings of the same lines:
//  - light: a blue only a little lighter than the background, for blue backgrounds (Home, team,
//    partners and contact banners) — there, but hard to notice;
//  - soft: dark blue, clearly visible, for photos (pale lines disappear on a bright picture).
const TONES = {
  light: { stroke: "#5aa6e4", opacity: 0.3, width: 1.3 },
  soft: { stroke: "#0b3a78", opacity: 0.6, width: 1.4 },
};
for (const [name, tone] of Object.entries(TONES)) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMid slice">` +
    `<style>${css}</style>` +
    `<g fill="none" stroke="${tone.stroke}" stroke-opacity="${tone.opacity}" stroke-width="${tone.width}" stroke-linecap="round">${body}</g></svg>`;
  writeFileSync(new URL(`../public/patterns/water-lines-${name}.svg`, import.meta.url), svg);
  console.log(`water-lines-${name}.svg: ${Math.round(svg.length / 1024)} KB, ${Math.round(gzipSync(svg).length / 1024)} KB compressed`);
}
