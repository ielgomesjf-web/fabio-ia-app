const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourceImage = path.join('C:', 'Users', 'Fábio UBox', 'Downloads', 'icone grz.png');
const iconsDir = path.join(__dirname, 'public', 'icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateAll() {
  // Regular icons - resize preserving original image
  for (const size of sizes) {
    const outPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(sourceImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Maskable icons - with padding for safe zone (10% on each side)
  for (const size of [192, 512]) {
    const innerSize = Math.round(size * 0.8);
    const outPath = path.join(iconsDir, `icon-maskable-${size}x${size}.png`);
    const resized = await sharp(sourceImage)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 14, g: 196, b: 224, alpha: 255 } // cyan background
      }
    })
      .composite([{ input: resized, gravity: 'centre' }])
      .png()
      .toFile(outPath);
    console.log(`Generated: icon-maskable-${size}x${size}.png`);
  }

  // Copy to dist if exists
  const distIcons = path.join(__dirname, 'dist', 'icons');
  if (fs.existsSync(distIcons)) {
    for (const file of fs.readdirSync(iconsDir)) {
      if (file.endsWith('.png')) {
        fs.copyFileSync(path.join(iconsDir, file), path.join(distIcons, file));
      }
    }
    console.log('Copied to dist/icons/');
  }

  console.log('Done!');
}

generateAll().catch(console.error);
