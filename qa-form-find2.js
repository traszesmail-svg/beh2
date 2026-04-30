const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  await page.goto('http://localhost:4501/book', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const all = await page.evaluate(() => {
    const result = [];
    document.querySelectorAll('input, textarea, select').forEach(el => {
      if (el.type === 'hidden' || el.offsetHeight === 0) return;
      const fs = parseInt(window.getComputedStyle(el).fontSize);
      const h = el.getBoundingClientRect().height;
      const isBad = fs < 16 || h < 40;
      result.push({ type: el.type || el.tagName.toLowerCase(), fs, h: Math.round(h), bad: isBad, id: el.id });
    });
    return result;
  });
  
  console.log('All form fields on /book:');
  all.forEach(f => console.log(`  ${f.bad ? '❌' : '✅'} ${f.type.padEnd(10)} font=${f.fs}px h=${f.h}px id="${f.id || '-'}"`));
  
  const bad = all.filter(f => f.bad);
  console.log(`\nBad: ${bad.length}`);
  console.log(`Bad types: ${[...new Set(bad.map(f => f.type))].join(', ')}`);
  
  await browser.close();
})();
