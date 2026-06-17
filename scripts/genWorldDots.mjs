// Pre-generates a stippled "dot world" — a grid of dots over land only —
// so the partner map is pure static SVG with zero runtime map dependencies.
// Run: node scripts/genWorldDots.mjs   (dev-time only)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const topo = JSON.parse(
  readFileSync(join(root, "node_modules/world-atlas/land-110m.json"), "utf8")
);
const land = feature(topo, topo.objects.land);

// Equirectangular layout. viewBox 1000 x 500 (2:1).
const W = 1000;
const H = 500;
// Grid step in degrees — smaller = denser/heavier. 2.2 gives a crisp, light map.
const STEP_LON = 2.2;
const STEP_LAT = 2.2;
// Clip the empty polar caps so the map sits nicely.
const LAT_MAX = 83;
const LAT_MIN = -56;

const project = (lon, lat) => [
  ((lon + 180) / 360) * W,
  ((90 - lat) / 180) * H,
];

const dots = [];
for (let lat = LAT_MAX; lat >= LAT_MIN; lat -= STEP_LAT) {
  for (let lon = -180; lon <= 180; lon += STEP_LON) {
    if (geoContains(land, [lon, lat])) {
      const [x, y] = project(lon, lat);
      dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
  }
}

const out = {
  width: W,
  height: H,
  // Projection params so partner markers can be placed with the same math.
  proj: { latMax: 90, latMin: -90, lonMax: 180, lonMin: -180 },
  dots,
};

writeFileSync(
  join(root, "lib/worldDots.json"),
  JSON.stringify(out),
  "utf8"
);
console.log(`Generated ${dots.length} land dots → lib/worldDots.json`);
