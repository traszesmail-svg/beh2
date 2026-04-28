const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3003';

async function checkInlines() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(`${BASE_URL}/kontakt`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const formData = await page.evaluate(() => {
      const selects = document.querySelectorAll('form.form-grid select');
      if (selects.length === 0) return { error: 'No selects found' };

      const select = selects[0];
      return {
        id: select.id,
        className: select.className,
        style: select.getAttribute('style'),
        computedFontSize: window.getComputedStyle(select).fontSize,
        computedBorderRadius: window.getComputedStyle(select).borderRadius,
        computedHeight: window.getComputedStyle(select).minHeight,
        outerHTML: select.outerHTML.substring(0, 300)
      };
    });

    console.log('📋 First Select Element:');
    console.log(JSON.stringify(formData, null, 2));

  } finally {
    await browser.close();
  }
}

checkInlines().catch(console.error);
