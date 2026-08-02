import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const iconsDir = join(publicDir, 'icons');

mkdirSync(iconsDir, { recursive: true });

// SVG source — purple rounded square + airplane
const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#863bff"/>
  <path fill="white" d="M88 50 C88 47 84 44 78 44 L60 44 L48 28 L38 28 L46 44 L24 44 L18 38 L10 38 L14 50 L10 62 L18 62 L24 56 L46 56 L38 72 L48 72 L60 56 L78 56 C84 56 88 53 88 50Z"/>
</svg>`;

// SVG for maskable icons — full bleed purple background (no rounded corners, airplane centered smaller)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#863bff"/>
  <path fill="white" transform="scale(0.7) translate(21.4, 21.4)" d="M88 50 C88 47 84 44 78 44 L60 44 L48 28 L38 28 L46 44 L24 44 L18 38 L10 38 L14 50 L10 62 L18 62 L24 56 L46 56 L38 72 L48 72 L60 56 L78 56 C84 56 88 53 88 50Z"/>
</svg>`;

const sizes = [16, 32, 72, 96, 120, 128, 144, 152, 192, 384, 512];

console.log('Generating icons...');

await Promise.all(
  sizes.map(async (size) => {
    const isMaskable = size >= 192;
    const svg = isMaskable ? svgMaskable : svgSource;
    const outPath = join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`  ✓ icon-${size}x${size}.png`);
  })
);

// apple-touch-icon at 180x180 also goes in /public root
await sharp(Buffer.from(svgSource))
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('  ✓ apple-touch-icon.png (in /public)');

// favicon.png removed — index.html uses SVG + specific sized PNGs directly

// Splash screen SVG → PNG at common iOS sizes
const splashSizes = [
  { w: 2048, h: 2732, name: 'splash-ipad-pro-12' },
  { w: 1668, h: 2388, name: 'splash-ipad-pro-11' },
  { w: 1290, h: 2796, name: 'splash-iphone-15-pro-max' },
  { w: 1179, h: 2556, name: 'splash-iphone-15-pro' },
  { w: 1170, h: 2532, name: 'splash-iphone-14' },
  { w: 1080, h: 1920, name: 'splash-android-xxhdpi' },
  { w: 750,  h: 1334, name: 'splash-iphone-se' },
];

const splashDir = join(publicDir, 'splash');
mkdirSync(splashDir, { recursive: true });

for (const { w, h, name } of splashSizes) {
  const iconSize = Math.round(Math.min(w, h) * 0.22);
  const x = Math.round((w - iconSize) / 2);
  const y = Math.round((h - iconSize) / 2) - Math.round(h * 0.05);
  const textY = y + iconSize + Math.round(h * 0.06);
  const fontSize = Math.round(h * 0.028);

  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#863bff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5b1fc8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g transform="translate(${x}, ${y})">
    <rect width="${iconSize}" height="${iconSize}" rx="${Math.round(iconSize * 0.22)}" fill="rgba(255,255,255,0.15)"/>
    <path fill="white" transform="scale(${iconSize / 100})" d="M88 50 C88 47 84 44 78 44 L60 44 L48 28 L38 28 L46 44 L24 44 L18 38 L10 38 L14 50 L10 62 L18 62 L24 56 L46 56 L38 72 L48 72 L60 56 L78 56 C84 56 88 53 88 50Z"/>
  </g>
  <text x="${w / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="white">החופשות שלי</text>
</svg>`;

  await sharp(Buffer.from(splashSvg)).resize(w, h).png().toFile(join(splashDir, `${name}.png`));
  console.log(`  ✓ splash/${name}.png`);
}

console.log('\nDone! All icons and splash screens generated.');
