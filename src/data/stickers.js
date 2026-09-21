// src/data/stickers.js
// High quality SVG sticker collection matching the wireframe and photobooth aesthetics

export const STICKER_ITEMS = [
  {
    id: 'ribbon-red',
    name: 'Red Ribbon Bow',
    category: 'bows',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gingham" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#e11d48"/>
          <rect width="5" height="5" fill="#fda4af"/>
          <rect x="5" y="5" width="5" height="5" fill="#fda4af"/>
          <rect x="5" y="0" width="5" height="5" fill="#be123c"/>
          <rect x="0" y="5" width="5" height="5" fill="#be123c"/>
        </pattern>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.25"/>
        </filter>
      </defs>
      <!-- Left loop -->
      <path d="M 50 45 C 30 18 5 28 8 48 C 10 60 32 54 50 48 Z" fill="url(#gingham)" stroke="#9f1239" stroke-width="1.5" filter="url(#shadow)"/>
      <path d="M 44 45 C 32 32 18 36 20 46 C 22 52 35 50 45 47 Z" fill="#fff" opacity="0.3"/>
      <!-- Right loop -->
      <path d="M 50 45 C 70 18 95 28 92 48 C 90 60 68 54 50 48 Z" fill="url(#gingham)" stroke="#9f1239" stroke-width="1.5" filter="url(#shadow)"/>
      <path d="M 56 45 C 68 32 82 36 80 46 C 78 52 65 50 55 47 Z" fill="#fff" opacity="0.3"/>
      <!-- Left tail -->
      <path d="M 46 50 C 38 65 24 82 16 90 C 24 86 34 84 38 88 C 42 84 48 68 50 52 Z" fill="url(#gingham)" stroke="#9f1239" stroke-width="1.5" filter="url(#shadow)"/>
      <!-- Right tail -->
      <path d="M 54 50 C 62 65 76 82 84 90 C 76 86 66 84 62 88 C 58 84 52 68 50 52 Z" fill="url(#gingham)" stroke="#9f1239" stroke-width="1.5" filter="url(#shadow)"/>
      <!-- Knot -->
      <ellipse cx="50" cy="47" rx="7" ry="6" fill="#be123c" stroke="#881337" stroke-width="1.5"/>
      <ellipse cx="49" cy="46" rx="4" ry="3" fill="#fb7185"/>
    </svg>`
  },
  {
    id: 'binder-clip-red',
    name: 'Red Clip',
    category: 'pins',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="clipBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e11d48"/>
          <stop offset="50%" stop-color="#be123c"/>
          <stop offset="100%" stop-color="#881337"/>
        </linearGradient>
        <linearGradient id="metalWire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="50%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <!-- Wire handles -->
      <path d="M 38 48 C 38 20 62 20 62 48" fill="none" stroke="url(#metalWire)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 44 48 C 44 28 56 28 56 48" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      <!-- Clip Main Body (Trapezoid) -->
      <polygon points="26,50 74,50 82,85 18,85" fill="url(#clipBody)" stroke="#4c0519" stroke-width="2"/>
      <!-- Base lip -->
      <rect x="16" y="83" width="68" height="8" rx="3" fill="#881337" stroke="#4c0519" stroke-width="1.5"/>
      <!-- Highlights -->
      <line x1="28" y1="53" x2="72" y2="53" stroke="#fda4af" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'vintage-camera',
    name: 'Vintage Camera',
    category: 'retro',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="camBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <radialGradient id="camLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="40%" stop-color="#0284c7"/>
          <stop offset="80%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#64748b"/>
        </radialGradient>
      </defs>
      <!-- Camera base body -->
      <rect x="15" y="32" width="70" height="48" rx="8" fill="url(#camBody)" stroke="#1e293b" stroke-width="2"/>
      <!-- Top header bar -->
      <path d="M 22 32 L 78 32 L 72 24 L 28 24 Z" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/>
      <!-- Shutter button & flash -->
      <rect x="25" y="19" width="10" height="5" rx="1.5" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>
      <circle cx="70" cy="27" r="3" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <!-- Lens outer ring -->
      <circle cx="50" cy="56" r="18" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <!-- Lens glass -->
      <circle cx="50" cy="56" r="14" fill="url(#camLens)"/>
      <ellipse cx="46" cy="52" rx="4" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-30 46 52)"/>
      <!-- Floral accent on camera corner -->
      <circle cx="23" cy="40" r="4" fill="#fb7185"/>
      <circle cx="28" cy="42" r="3" fill="#f43f5e"/>
      <circle cx="25" cy="45" r="3.5" fill="#fda4af"/>
      <circle cx="25" cy="42" r="1.5" fill="#fef08a"/>
    </svg>`
  },
  {
    id: 'star-sparkle',
    name: 'Aesthetic Star',
    category: 'sparkles',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fda4af"/>
          <stop offset="40%" stop-color="#fb7185"/>
          <stop offset="100%" stop-color="#e11d48"/>
        </linearGradient>
      </defs>
      <!-- 4-point star -->
      <path d="M 50 12 Q 50 50 12 50 Q 50 50 50 88 Q 50 50 88 50 Q 50 50 50 12 Z" fill="url(#starGrad)" stroke="#be123c" stroke-width="1.5"/>
      <!-- Center glowing dot -->
      <circle cx="50" cy="50" r="5" fill="#fff" opacity="0.9"/>
      <!-- Mini sparkle -->
      <circle cx="28" cy="28" r="2.5" fill="#fb7185"/>
      <circle cx="72" cy="72" r="2" fill="#fb7185"/>
    </svg>`
  },
  {
    id: 'pushpin-red',
    name: 'Red Pushpin',
    category: 'pins',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="60%" stop-color="#be123c"/>
          <stop offset="100%" stop-color="#881337"/>
        </linearGradient>
      </defs>
      <!-- Needle point -->
      <polygon points="50,60 48,88 52,88" fill="#94a3b8" stroke="#64748b" stroke-width="1"/>
      <!-- Pin head upper rim -->
      <ellipse cx="50" cy="26" rx="14" ry="6" fill="#f43f5e" stroke="#9f1239" stroke-width="1.5"/>
      <ellipse cx="50" cy="24" rx="11" ry="4" fill="#fda4af"/>
      <!-- Pin waist -->
      <path d="M 40 26 C 42 38 43 45 37 52 L 63 52 C 57 45 58 38 60 26 Z" fill="url(#pinGrad)" stroke="#9f1239" stroke-width="1.5"/>
      <!-- Pin base disc -->
      <ellipse cx="50" cy="54" rx="15" ry="5" fill="#be123c" stroke="#881337" stroke-width="1.5"/>
      <ellipse cx="49" cy="53" rx="11" ry="3" fill="#fb7185" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'retro-heart',
    name: 'Red Heart',
    category: 'love',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="50%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#9f1239"/>
        </linearGradient>
      </defs>
      <path d="M 50 82 C 20 62 10 40 18 24 C 26 8 44 14 50 30 C 56 14 74 8 82 24 C 90 40 80 62 50 82 Z" fill="url(#heartGrad)" stroke="#881337" stroke-width="2"/>
      <ellipse cx="32" cy="28" rx="6" ry="3" fill="#ffffff" opacity="0.5" transform="rotate(-30 32 28)"/>
    </svg>`
  },
  {
    id: 'glitter-sparkles',
    name: 'Golden Sparkles',
    category: 'sparkles',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <!-- Main Star -->
      <path d="M 45 15 Q 45 45 15 45 Q 45 45 45 75 Q 45 45 75 45 Q 45 45 45 15 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="1.2"/>
      <circle cx="45" cy="45" r="3.5" fill="#fff"/>
      <!-- Smaller star -->
      <path d="M 75 60 Q 75 75 60 75 Q 75 75 75 90 Q 75 75 90 75 Q 75 75 75 60 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="1"/>
      <circle cx="75" cy="75" r="2" fill="#fff"/>
      <!-- Tiny star -->
      <circle cx="25" cy="78" r="3" fill="#facc15"/>
      <circle cx="70" cy="25" r="2.5" fill="#fde047"/>
    </svg>`
  },
  {
    id: 'photobooth-stamp',
    name: 'Photobooth Stamp',
    category: 'text',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
      </defs>
      <rect x="10" y="24" width="80" height="52" rx="10" fill="url(#badgeGrad)" stroke="#0c4a6e" stroke-width="2.5"/>
      <rect x="14" y="28" width="72" height="44" rx="7" fill="none" stroke="#bae6fd" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="50" y="47" font-family="Arial, sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">PHOTOBOOTH</text>
      <text x="50" y="62" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#fef08a" text-anchor="middle">★ 2026 ★</text>
    </svg>`
  },
  {
    id: 'daisy-flower',
    name: 'Daisy Flower',
    category: 'nature',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Petals -->
        <ellipse cx="0" cy="-28" rx="8" ry="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <ellipse cx="0" cy="28" rx="8" ry="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <ellipse cx="-28" cy="0" rx="16" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <ellipse cx="28" cy="0" rx="16" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <ellipse cx="-20" cy="-20" rx="14" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" transform="rotate(45 -20 -20)"/>
        <ellipse cx="20" cy="-20" rx="14" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" transform="rotate(-45 20 -20)"/>
        <ellipse cx="-20" cy="20" rx="14" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" transform="rotate(-45 -20 20)"/>
        <ellipse cx="20" cy="20" rx="14" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" transform="rotate(45 20 20)"/>
        <!-- Flower Center -->
        <circle cx="0" cy="0" r="14" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
        <circle cx="-3" cy="-3" r="10" fill="#facc15"/>
      </g>
    </svg>`
  },
  {
    id: 'cherry-sweet',
    name: 'Sweet Cherries',
    category: 'cute',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cherryGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="40%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#881337"/>
        </radialGradient>
      </defs>
      <!-- Stems -->
      <path d="M 52 20 C 45 35 32 46 32 60" fill="none" stroke="#65a30d" stroke-width="3" stroke-linecap="round"/>
      <path d="M 52 20 C 60 35 68 46 68 62" fill="none" stroke="#65a30d" stroke-width="3" stroke-linecap="round"/>
      <!-- Leaf -->
      <path d="M 52 20 C 65 14 74 18 78 26 C 70 28 60 26 52 20 Z" fill="#84cc16" stroke="#4d7c0f" stroke-width="1.5"/>
      <!-- Left Cherry -->
      <circle cx="32" cy="65" r="16" fill="url(#cherryGrad)" stroke="#4c0519" stroke-width="1.5"/>
      <ellipse cx="26" cy="58" rx="4" ry="2" fill="#fff" opacity="0.6" transform="rotate(-30 26 58)"/>
      <!-- Right Cherry -->
      <circle cx="68" cy="66" r="16" fill="url(#cherryGrad)" stroke="#4c0519" stroke-width="1.5"/>
      <ellipse cx="62" cy="59" rx="4" ry="2" fill="#fff" opacity="0.6" transform="rotate(-30 62 59)"/>
    </svg>`
  }
];

// Helper: convert raw SVG string to base64 Data URL for <img> and <canvas>
export const getStickerDataUrl = (svgString) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};
