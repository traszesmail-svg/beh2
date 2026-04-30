const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });

  const allPiesLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]:contains("Pies")')).map((a, idx) => ({
      idx,
      text: a.textContent,
      classes: a.className,
      href: a.href,
      decoration: window.getComputedStyle(a).textDecoration,
      parentClass: a.parentElement?.className?.substring(0, 40)
    }));
  });

  // :contains nie działa w vanilla JS, spróbuj inaczej
  const allPiesLinks2 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).filter(a => a.textContent === 'Pies').map((a, idx) => ({
      idx,
      text: a.textContent,
      classes: a.className,
      href: a.href.substring(0, 50),
      decoration: window.getComputedStyle(a).textDecoration
    }));
  });

  console.log(`All "Pies" links (${allPiesLinks2.length}):\n`);
  allPiesLinks2.forEach(l => {
    console.log(`- Classes: "${l.classes}" href: ${l.href}`);
    console.log(`  Decoration: ${l.decoration}\n`);
  });

  await browser.close();
})();
