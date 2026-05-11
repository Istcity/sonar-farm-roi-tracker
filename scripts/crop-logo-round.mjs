/**
 * Keeps only the centered circular badge; drops transparent / outer "checkerboard" margin.
 * Adjust RATIO (0–1) if the ring still shows artifacts (try 0.88–0.96).
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "assets", "sonaryenilogo-whitebadge.png");
const output = path.join(root, "assets", "sonaryenilogo-round.png");

const RATIO = 0.955;

const img = sharp(input);
const { width: w, height: h } = await img.metadata();
if (!w || !h) throw new Error("Could not read image size");

const cx = w / 2;
const cy = h / 2;
const r = (Math.min(w, h) / 2) * RATIO;

const maskSvg = Buffer.from(
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff"/>
  </svg>`,
);

const buf = await sharp(input)
  .ensureAlpha()
  .composite([{ input: maskSvg, blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(buf).trim().png().toFile(output);

console.log("Wrote", output);
