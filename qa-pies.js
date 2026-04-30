const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });

  const result = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).filter(a => a.textContent === 'Pies').map((a, idx) => ({
      idx,
      classes: a.className,
      href: a.href.substring(0, 40),
      decoration: window.getComputedStyle(a).textDecoration,
      parent: a.parentElement?.tagName
    }));
  });

  console.log(`All "Pies" links (${result.length}):\n`);
  result.forEach((l, i) => {
    console.log(`${i+1}. ${l.classes ? 'Classes: ' + l.classes : 'NO CLASSES'}`);
    console.log(`   Decoration: ${l.decoration}`);
    console.log(`   Parent: ${l.parent}\n`);
  });

  await browser.close();
})();
