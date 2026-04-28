const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3004';

async function verifyFixes() {
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
      const form = document.querySelector('form.form-grid');
      if (!form) return { error: 'Form not found' };

      const inputs = form.querySelectorAll('select, input[type="text"], input[type="email"], textarea, input[type="date"]');
      const details = [];

      inputs.forEach((input, idx) => {
        const rect = input.getBoundingClientRect();
        const style = window.getComputedStyle(input);

        details.push({
          index: idx,
          type: input.tagName,
          name: input.name || input.id,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          fontSize: style.fontSize,
          padding: style.padding,
          borderRadius: style.borderRadius,
          minHeight: style.minHeight,
          status: `${style.fontSize} / ${Math.round(rect.height)}px height`
        });
      });

      return details;
    });

    console.log('✅ Form Elements After Fix:\n');
    if (formData.error) {
      console.log(`❌ ${formData.error}`);
    } else {
      formData.forEach(el => {
        console.log(`${el.type} (${el.name}): fontSize=${el.fontSize}, height=${el.height}px, padding=${el.padding}`);
      });
    }

  } finally {
    await browser.close();
  }
}

verifyFixes().catch(console.error);
