const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Robot mascot face icon SVG - circular cyan frame with robot face
const createIconSvg = (size) => {
  const p = size / 512; // scale factor
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ef5ff"/>
      <stop offset="50%" style="stop-color:#00c4e0"/>
      <stop offset="100%" style="stop-color:#0090b8"/>
    </linearGradient>
    <linearGradient id="innerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f8ff"/>
      <stop offset="100%" style="stop-color:#c0eeff"/>
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8b6fff"/>
      <stop offset="50%" style="stop-color:#6b4fcf"/>
      <stop offset="100%" style="stop-color:#5540b0"/>
    </linearGradient>
    <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#00f5ff"/>
      <stop offset="100%" style="stop-color:#00c8d4"/>
    </linearGradient>
    <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9b7dff"/>
      <stop offset="100%" style="stop-color:#6b4fcf"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="230"/>
    </clipPath>
  </defs>

  <!-- Outer circle - cyan border -->
  <circle cx="256" cy="256" r="248" fill="url(#bgGrad)"/>

  <!-- Inner circle - light background -->
  <circle cx="256" cy="256" r="222" fill="url(#innerBg)"/>

  <!-- Robot head -->
  <g filter="url(#shadow)">
    <!-- Antenna -->
    <line x1="256" y1="95" x2="256" y2="65" stroke="#7c5cfc" stroke-width="8" stroke-linecap="round"/>
    <circle cx="256" cy="58" r="14" fill="#00d4ff" filter="url(#glow)"/>
    <circle cx="256" cy="58" r="6" fill="#fff" opacity="0.6"/>

    <!-- Head shape -->
    <rect x="108" y="100" width="296" height="220" rx="65" fill="url(#headGrad)"/>

    <!-- Visor -->
    <rect x="135" y="145" width="242" height="120" rx="45" fill="#0d0d2a"/>

    <!-- Eyes -->
    <ellipse cx="205" cy="205" rx="35" ry="40" fill="#050520"/>
    <ellipse cx="307" cy="205" rx="35" ry="40" fill="#050520"/>
    <ellipse cx="205" cy="205" rx="27" ry="32" fill="url(#eyeGrad)" filter="url(#glow)"/>
    <ellipse cx="307" cy="205" rx="27" ry="32" fill="url(#eyeGrad)" filter="url(#glow)"/>
    <!-- Eye highlights -->
    <ellipse cx="193" cy="193" rx="10" ry="13" fill="white" opacity="0.75"/>
    <ellipse cx="295" cy="193" rx="10" ry="13" fill="white" opacity="0.75"/>

    <!-- Ear panels -->
    <rect x="80" y="175" width="32" height="65" rx="12" fill="url(#earGrad)"/>
    <rect x="400" y="175" width="32" height="65" rx="12" fill="url(#earGrad)"/>
    <circle cx="96" cy="200" r="6" fill="#00d4ff" opacity="0.6"/>
    <circle cx="416" cy="200" r="6" fill="#00d4ff" opacity="0.6"/>

    <!-- Smile -->
    <path d="M205,290 Q256,330 307,290" fill="none" stroke="#00d4ff" stroke-width="8" stroke-linecap="round" opacity="0.75"/>

    <!-- Neck hint -->
    <rect x="220" y="320" width="72" height="28" rx="10" fill="#4a2fa0"/>

    <!-- Body top -->
    <rect x="145" y="345" width="222" height="90" rx="30" fill="url(#headGrad)"/>
    <!-- Chest plate -->
    <rect x="175" y="358" width="162" height="60" rx="18" fill="#1a1040" opacity="0.65"/>

    <!-- Chest radar -->
    <circle cx="256" cy="388" r="22" fill="none" stroke="#00d4ff" stroke-width="1.5" opacity="0.4"/>
    <circle cx="256" cy="388" r="14" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.3"/>
    <circle cx="256" cy="388" r="6" fill="none" stroke="#00d4ff" stroke-width="0.8" opacity="0.25"/>
    <circle cx="256" cy="388" r="3" fill="#00d4ff" opacity="0.7"/>
  </g>
</svg>`;
};

// Maskable icon has more padding (safe zone)
const createMaskableSvg = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ef5ff"/>
      <stop offset="50%" style="stop-color:#00c4e0"/>
      <stop offset="100%" style="stop-color:#0090b8"/>
    </linearGradient>
    <linearGradient id="innerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f8ff"/>
      <stop offset="100%" style="stop-color:#c0eeff"/>
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8b6fff"/>
      <stop offset="50%" style="stop-color:#6b4fcf"/>
      <stop offset="100%" style="stop-color:#5540b0"/>
    </linearGradient>
    <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#00f5ff"/>
      <stop offset="100%" style="stop-color:#00c8d4"/>
    </linearGradient>
    <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9b7dff"/>
      <stop offset="100%" style="stop-color:#6b4fcf"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Full background fill for maskable -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  <circle cx="256" cy="256" r="200" fill="url(#innerBg)"/>

  <g transform="translate(256,240) scale(0.72) translate(-256,-240)">
    <!-- Antenna -->
    <line x1="256" y1="95" x2="256" y2="68" stroke="#7c5cfc" stroke-width="8" stroke-linecap="round"/>
    <circle cx="256" cy="60" r="12" fill="#00d4ff" filter="url(#glow)"/>
    <circle cx="256" cy="60" r="5" fill="#fff" opacity="0.6"/>

    <!-- Head -->
    <rect x="115" y="100" width="282" height="210" rx="60" fill="url(#headGrad)"/>
    <rect x="140" y="145" width="232" height="115" rx="42" fill="#0d0d2a"/>

    <!-- Eyes -->
    <ellipse cx="208" cy="203" rx="32" ry="37" fill="#050520"/>
    <ellipse cx="304" cy="203" rx="32" ry="37" fill="#050520"/>
    <ellipse cx="208" cy="203" rx="25" ry="30" fill="url(#eyeGrad)" filter="url(#glow)"/>
    <ellipse cx="304" cy="203" rx="25" ry="30" fill="url(#eyeGrad)" filter="url(#glow)"/>
    <ellipse cx="197" cy="192" rx="9" ry="12" fill="white" opacity="0.75"/>
    <ellipse cx="293" cy="192" rx="9" ry="12" fill="white" opacity="0.75"/>

    <!-- Ears -->
    <rect x="88" y="173" width="30" height="60" rx="11" fill="url(#earGrad)"/>
    <rect x="394" y="173" width="30" height="60" rx="11" fill="url(#earGrad)"/>

    <!-- Smile -->
    <path d="M210,283 Q256,320 302,283" fill="none" stroke="#00d4ff" stroke-width="7" stroke-linecap="round" opacity="0.75"/>

    <!-- Neck -->
    <rect x="224" y="310" width="64" height="25" rx="9" fill="#4a2fa0"/>

    <!-- Body top -->
    <rect x="152" y="332" width="208" height="85" rx="28" fill="url(#headGrad)"/>
    <rect x="180" y="345" width="152" height="55" rx="16" fill="#1a1040" opacity="0.65"/>
    <circle cx="256" cy="372" r="18" fill="none" stroke="#00d4ff" stroke-width="1.2" opacity="0.4"/>
    <circle cx="256" cy="372" r="10" fill="none" stroke="#00d4ff" stroke-width="0.8" opacity="0.3"/>
    <circle cx="256" cy="372" r="3" fill="#00d4ff" opacity="0.7"/>
  </g>
</svg>`;
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

async function generateAll() {
  // Regular icons
  for (const size of sizes) {
    const svg = createIconSvg(size);
    const outPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Maskable icons
  for (const size of [192, 512]) {
    const svg = createMaskableSvg(size);
    const outPath = path.join(iconsDir, `icon-maskable-${size}x${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`Generated: icon-maskable-${size}x${size}.png`);
  }

  // Copy to dist if exists
  const distIcons = path.join(__dirname, 'dist', 'icons');
  if (fs.existsSync(distIcons)) {
    for (const file of fs.readdirSync(iconsDir)) {
      fs.copyFileSync(path.join(iconsDir, file), path.join(distIcons, file));
    }
    console.log('Copied icons to dist/icons/');
  }

  console.log('All icons generated!');
}

generateAll().catch(console.error);
