const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3003';

async function checkPageClass() {
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

    const bodyClass = await page.evaluate(() => {
      return {
        bodyClasses: document.body.className,
        mainClasses: document.querySelector('main')?.className || 'no main found',
        hasContactPage: document.body.classList.contains('contact-page'),
        allClasses: Array.from(document.body.classList).join(', ')
      };
    });

    console.log('📋 Page Classes:');
    console.log(JSON.stringify(bodyClass, null, 2));

  } finally {
    await browser.close();
  }
}

checkPageClass().catch(console.error);
