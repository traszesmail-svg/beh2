const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') errors.push(text);
    if (msg.type() === 'warning') warnings.push(text);
  });
  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message);
  });

  await page.goto('http://localhost:4501/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Check for nested anchors (should be 0 if fix works)
  const nestedAnchors = await page.evaluate(() => {
    return document.querySelectorAll('a a').length;
  });

  // Check for hydration errors
  const hydrationErrors = errors.filter(e => 
    e.toLowerCase().includes('hydrat') || 
    e.toLowerCase().includes('cannot be a descendant')
  );

  console.log('=== HYDRATION CHECK ===');
  console.log(`Nested <a> in <a>: ${nestedAnchors}`);
  console.log(`Hydration errors: ${hydrationErrors.length}`);
  console.log(`Total console errors: ${errors.length}`);
  console.log(`Total warnings: ${warnings.length}`);
  
  if (hydrationErrors.length > 0) {
    console.log('\n⚠️ Errors:');
    hydrationErrors.slice(0, 3).forEach(e => console.log('  - ' + e.substring(0, 100)));
  }
  
  if (errors.length > 0) {
    console.log('\nFirst few errors:');
    errors.slice(0, 5).forEach(e => console.log('  - ' + e.substring(0, 100)));
  }

  await browser.close();
  process.exit(nestedAnchors > 0 || hydrationErrors.length > 0 ? 1 : 0);
})();
