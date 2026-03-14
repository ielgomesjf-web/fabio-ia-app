const http = require('http');
const sharp = require('sharp');
const path = require('path');

const url = 'http://localhost:5173/og-generator.html';

// We'll use a different approach: render the SVG from og-generator directly
// Since we can't easily screenshot from Node, let's create the OG image from SVG

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#080d19"/>
      <stop offset="40%" style="stop-color:#1a1040"/>
      <stop offset="100%" style="stop-color:#0d1a2e"/>
    </linearGradient>
    <linearGradient id="rb" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8b6fff"/>
      <stop offset="50%" style="stop-color:#6b4fcf"/>
      <stop offset="100%" style="stop-color:#4a2fa0"/>
    </linearGradient>
    <linearGradient id="rb2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#7c5cfc"/>
      <stop offset="100%" style="stop-color:#3a1f80"/>
    </linearGradient>
    <linearGradient id="eg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#00f0ff"/>
      <stop offset="100%" style="stop-color:#00b8d4"/>
    </linearGradient>
    <linearGradient id="lg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#b8a4ff"/>
      <stop offset="40%" style="stop-color:#7c5cfc"/>
      <stop offset="100%" style="stop-color:#5a3de8"/>
    </linearGradient>
    <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9b7dff"/>
      <stop offset="50%" style="stop-color:#7c5cfc"/>
      <stop offset="100%" style="stop-color:#5a3de8"/>
    </linearGradient>
    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.7"/>
      <stop offset="100%" style="stop-color:#7c5cfc;stop-opacity:0.2"/>
    </linearGradient>
    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00d4ff"/>
      <stop offset="100%" style="stop-color:rgba(0,212,255,0.1)"/>
    </linearGradient>
    <filter id="gc" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgba(124,92,252,0.15)"/>
      <stop offset="100%" style="stop-color:transparent"/>
    </radialGradient>
    <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgba(0,212,255,0.1)"/>
      <stop offset="100%" style="stop-color:transparent"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Grid -->
  <g opacity="0.05" stroke="#7c5cfc" stroke-width="0.5">
    <line x1="0" y1="60" x2="1200" y2="60"/><line x1="0" y1="120" x2="1200" y2="120"/>
    <line x1="0" y1="180" x2="1200" y2="180"/><line x1="0" y1="240" x2="1200" y2="240"/>
    <line x1="0" y1="300" x2="1200" y2="300"/><line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="420" x2="1200" y2="420"/><line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
    <line x1="60" y1="0" x2="60" y2="630"/><line x1="120" y1="0" x2="120" y2="630"/>
    <line x1="180" y1="0" x2="180" y2="630"/><line x1="240" y1="0" x2="240" y2="630"/>
    <line x1="300" y1="0" x2="300" y2="630"/><line x1="360" y1="0" x2="360" y2="630"/>
    <line x1="420" y1="0" x2="420" y2="630"/><line x1="480" y1="0" x2="480" y2="630"/>
    <line x1="540" y1="0" x2="540" y2="630"/><line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="660" y1="0" x2="660" y2="630"/><line x1="720" y1="0" x2="720" y2="630"/>
    <line x1="780" y1="0" x2="780" y2="630"/><line x1="840" y1="0" x2="840" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/><line x1="960" y1="0" x2="960" y2="630"/>
    <line x1="1020" y1="0" x2="1020" y2="630"/><line x1="1080" y1="0" x2="1080" y2="630"/>
    <line x1="1140" y1="0" x2="1140" y2="630"/>
  </g>

  <!-- Glow orbs -->
  <ellipse cx="900" cy="100" rx="200" ry="200" fill="url(#orb1)"/>
  <ellipse cx="200" cy="500" rx="180" ry="180" fill="url(#orb2)"/>

  <!-- Corner accents -->
  <path d="M25,25 L25,60 M25,25 L60,25" fill="none" stroke="#7c5cfc" stroke-width="2" opacity="0.3"/>
  <path d="M1175,25 L1175,60 M1175,25 L1140,25" fill="none" stroke="#7c5cfc" stroke-width="2" opacity="0.3"/>
  <path d="M25,605 L25,570 M25,605 L60,605" fill="none" stroke="#7c5cfc" stroke-width="2" opacity="0.3"/>
  <path d="M1175,605 L1175,570 M1175,605 L1140,605" fill="none" stroke="#7c5cfc" stroke-width="2" opacity="0.3"/>

  <!-- Robot mascot -->
  <g transform="translate(140, 90) scale(3.2)">
    <!-- Antenna -->
    <line x1="48" y1="10" x2="48" y2="-2" stroke="#7c5cfc" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="48" cy="-5" r="4.5" fill="#00d4ff" filter="url(#gc)"/>
    <circle cx="48" cy="-5" r="2" fill="#fff" opacity="0.5"/>
    <!-- Head -->
    <rect x="12" y="10" width="72" height="55" rx="16" fill="url(#rb)"/>
    <rect x="20" y="22" width="56" height="30" rx="10" fill="#0d0d2a"/>
    <!-- Radar -->
    <g opacity="0.4">
      <circle cx="48" cy="37" r="12" fill="none" stroke="#00d4ff" stroke-width="0.6"/>
      <circle cx="48" cy="37" r="8" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.6"/>
      <circle cx="48" cy="37" r="4" fill="none" stroke="#00d4ff" stroke-width="0.4" opacity="0.4"/>
      <path d="M48,37 L48,25 A12,12 0 0,1 58,30 Z" fill="url(#rg)" opacity="0.7"/>
    </g>
    <!-- Eyes -->
    <ellipse cx="36" cy="36" rx="8" ry="9" fill="#0a0a2a"/>
    <ellipse cx="60" cy="36" rx="8" ry="9" fill="#0a0a2a"/>
    <ellipse cx="36" cy="36" rx="6" ry="7" fill="url(#eg)" filter="url(#gc)"/>
    <ellipse cx="60" cy="36" rx="6" ry="7" fill="url(#eg)" filter="url(#gc)"/>
    <ellipse cx="33" cy="33" rx="2.5" ry="3" fill="white" opacity="0.7"/>
    <ellipse cx="57" cy="33" rx="2.5" ry="3" fill="white" opacity="0.7"/>
    <!-- Ears -->
    <rect x="4" y="28" width="9" height="18" rx="4" fill="url(#pg)"/>
    <rect x="83" y="28" width="9" height="18" rx="4" fill="url(#pg)"/>
    <circle cx="8.5" cy="35" r="2" fill="#00d4ff" opacity="0.5"/>
    <circle cx="87.5" cy="35" r="2" fill="#00d4ff" opacity="0.5"/>
    <!-- Smile -->
    <path d="M37,52 Q48,62 59,52" fill="none" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <!-- Neck -->
    <rect x="38" y="65" width="20" height="8" rx="3" fill="#4a2fa0"/>
    <!-- Body -->
    <rect x="14" y="72" width="68" height="42" rx="12" fill="url(#rb2)"/>
    <rect x="24" y="78" width="48" height="28" rx="8" fill="#1a1040" opacity="0.7"/>
    <!-- Chest radar -->
    <g transform="translate(48, 92)">
      <circle cx="0" cy="0" r="10" fill="none" stroke="#00d4ff" stroke-width="0.8" opacity="0.4"/>
      <circle cx="0" cy="0" r="6.5" fill="none" stroke="#00d4ff" stroke-width="0.6" opacity="0.3"/>
      <circle cx="0" cy="0" r="3" fill="none" stroke="#00d4ff" stroke-width="0.4" opacity="0.25"/>
      <circle cx="0" cy="0" r="1.5" fill="#00d4ff" opacity="0.7"/>
      <path d="M0,0 L0,-10 A10,10 0 0,1 8,-6 Z" fill="url(#rg)" opacity="0.5"/>
      <circle cx="5" cy="-6" r="1.2" fill="#00d4ff" opacity="0.8"/>
      <circle cx="-4" cy="4" r="1" fill="#00f0ff" opacity="0.6"/>
    </g>
    <!-- Arms -->
    <rect x="0" y="76" width="14" height="30" rx="6" fill="url(#rb2)"/>
    <rect x="82" y="76" width="14" height="30" rx="6" fill="url(#rb2)"/>
    <circle cx="7" cy="110" r="7" fill="url(#rb)" stroke="#4a2fa0" stroke-width="1.5"/>
    <circle cx="89" cy="110" r="7" fill="url(#rb)" stroke="#4a2fa0" stroke-width="1.5"/>
  </g>

  <!-- GRZ Text -->
  <text x="620" y="340" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="180" fill="url(#lg)" letter-spacing="-4">GRZ</text>

  <!-- Cyan line -->
  <rect x="625" y="365" width="480" height="3" rx="2" fill="url(#cg)"/>

  <!-- Subtitle -->
  <text x="630" y="420" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="38" fill="#00d4ff" letter-spacing="6" filter="url(#textGlow)" opacity="0.85">GESTÃO RISCO ZERO</text>

  <!-- Tagline -->
  <text x="635" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="300" font-size="20" fill="#7c5cfc" letter-spacing="5" opacity="0.5">PLATAFORMA DE GESTÃO DIGITAL</text>
</svg>`;

async function generate() {
  try {
    const buffer = Buffer.from(svgContent);
    await sharp(buffer)
      .resize(1200, 630)
      .png()
      .toFile(path.join(__dirname, 'public', 'og-image.png'));
    console.log('og-image.png generated successfully!');

    // Also generate for dist
    const fs = require('fs');
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      await sharp(buffer)
        .resize(1200, 630)
        .png()
        .toFile(path.join(distPath, 'og-image.png'));
      console.log('dist/og-image.png also updated!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

generate();
