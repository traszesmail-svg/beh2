const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:3002';

async function inspectForm() {
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

    // Get form element measurements
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
          lineHeight: style.lineHeight,
          visible: rect.width > 0 && rect.height > 0
        });
      });

      return details;
    });

    console.log('📋 Form Elements Analysis:');
    console.log(JSON.stringify(formData, null, 2));

    // Take screenshot
    await page.screenshot({ path: './qa-screenshots/kontakt-form-detail.png', fullPage: true });
    console.log('📸 Screenshot saved: qa-screenshots/kontakt-form-detail.png');

  } finally {
    await browser.close();
  }
}

inspectForm().catch(console.error);
