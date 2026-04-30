const puppeteer = require('puppeteer');

async function auditFonts() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const testPages = [
      { url: '/niezbednik', maxIssues: 5 }
    ];

    for (const {url, maxIssues} of testPages) {
      console.log(`\n📍 Analyzing fonts on ${url}`);
      await page.goto(`http://localhost:3001${url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const smallFonts = await page.evaluate(() => {
        const elements = [];
        document.querySelectorAll('*').forEach((el) => {
          const style = window.getComputedStyle(el);
          const fontSize = parseInt(style.fontSize);
          const text = el.textContent?.trim();

          if (fontSize < 12 && text && text.length > 5) {
            elements.push({
              tag: el.tagName.toLowerCase(),
              fontSize: fontSize,
              text: text.substring(0, 60),
              classes: el.className.substring(0, 60)
            });
          }
        });
        return elements;
      });

      console.log(`Found ${smallFonts.length} elements with font < 12px`);
      smallFonts.slice(0, maxIssues).forEach((el, i) => {
        console.log(`  ${i+1}. <${el.tag}> ${el.fontSize}px - "${el.text}..."`);
        if (el.classes) console.log(`     classes: ${el.classes}`);
      });
    }

  } finally {
    await browser.close();
  }
}

auditFonts().catch(console.error);
