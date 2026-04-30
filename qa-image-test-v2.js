const puppeteer = require('puppeteer');

async function testImages() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const urls = ['/blog', '/niezbednik', '/'];

    for (const url of urls) {
      console.log(`\n📍 Testing ${url}`);
      await page.goto(`http://localhost:3001${url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.querySelectorAll('img')).map(img => {
            return new Promise((resolve) => {
              if (img.complete) resolve();
              else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            });
          })
        );
      });

      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map((img) => ({
          src: img.src.substring(0, 80),
          complete: img.complete,
          naturalHeight: img.naturalHeight,
          hasError: img.complete && img.naturalHeight === 0
        }));
      });

      const broken = images.filter(img => img.hasError);
      console.log(`  Total images: ${images.length}`);
      console.log(`  Broken images: ${broken.length}`);
      if (broken.length > 0) {
        broken.forEach(img => console.log(`    - ${img.src}`));
      } else {
        console.log(`  ✅ All images loaded successfully`);
      }
    }

  } finally {
    await browser.close();
  }
}

testImages().catch(console.error);
