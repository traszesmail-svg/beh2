const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await browser.newPage();
  await p.setViewport({ width: 1280, height: 720 });

  await p.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });

  const problemLinks = await p.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map((a, idx) => {
        const decoration = window.getComputedStyle(a).textDecoration;
        const isButton = a.classList.contains('button') || a.getAttribute('role') === 'button';
        return { idx, decoration, isButton, text: a.textContent.substring(0, 25), classes: a.className.substring(0, 40) };
      })
      .filter(a => !a.isButton && !a.decoration.includes('underline'));
  });

  console.log(`Found ${problemLinks.length} problem links on home\n`);
  problemLinks.slice(0, 8).forEach(l => {
    console.log(`${l.idx}. "${l.text}"`);
    console.log(`   Classes: ${l.classes || '(none)'}`);
    console.log(`   Decoration: ${l.decoration}\n`);
  });

  await browser.close();
})();
