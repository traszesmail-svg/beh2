const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = './qa-screenshots-final-verification';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const pages = [
      { url: '/blog', name: 'blog-fixed' },
      { url: '/niezbednik', name: 'niezbednik-fixed' },
      { url: '/kontakt', name: 'kontakt-fixed' },
      { url: '/', name: 'home-fixed' },
    ];

    for (const {url, name} of pages) {
      console.log(`📸 Capturing: ${name}`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });

      await page.goto(`http://localhost:3001${url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}-desktop.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  ✅ Saved: ${screenshotPath}`);

      await page.close();
    }

    console.log(`\n✅ All screenshots captured: ${SCREENSHOTS_DIR}/`);

  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
