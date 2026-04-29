const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, 'app', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const sizes = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 512, name: 'icon-maskable-512.png' }, // Same as 512, just for maskable
  ];

  for (const { size, name } of sizes) {
    const outputPath = path.join(__dirname, 'public', name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✅ Created: public/${name} (${size}x${size})`);
  }
}

generateIcons().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
