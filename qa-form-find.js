const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  const pages = ['/', '/blog', '/niezbednik', '/kontakt', '/book', '/psy', '/koty'];

  for (const url of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    
    try {
      await page.goto('http://localhost:4501' + url, { waitUntil: 'networkidle2', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1500));
      
      const badForms = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.type === 'hidden' || el.offsetHeight === 0) return;
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          const h = el.getBoundingClientRect().height;
          if (fs < 16 || h < 40) {
            bad.push({ type: el.type || el.tagName, fontSize: fs, height: Math.round(h), id: el.id, name: el.name });
          }
        });
        return bad;
      });
      
      if (badForms.length > 0) {
        console.log(`\n${url}: ${badForms.length} złych pól`);
        badForms.forEach(f => console.log(`  - ${f.type} font=${f.fontSize}px h=${f.height}px id="${f.id}"`));
      }
    } catch (e) {} finally { await page.close(); }
  }
  
  await browser.close();
})();
