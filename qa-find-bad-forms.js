const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  const pages = [
    '/', '/psy', '/psy/reaktywnosc-na-smyczy', '/psy/lek-separacyjny',
    '/koty', '/koty/zalatwianie-poza-kuweta', '/koty/konflikt-miedzy-kotami',
    '/o-mnie', '/cennik', '/faq', '/blog', '/niezbednik', '/kontakt', '/book',
    '/opinie', '/oferta', '/konsultacja-behawioralna-online',
    '/behawiorysta-online-polska',
    '/blog/dlaczego-moj-pies-szczeka-na-inne-psy',
    '/blog/pies-wyje-kiedy-zostaje-sam',
    '/materialy/kot-zyje-w-napieciu',
    '/materialy/pies-ile-ruchu-potrzebuje'
  ];
  
  for (const url of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    try {
      await page.goto('http://localhost:4501' + url, { waitUntil: 'networkidle2', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1500));
      
      const bad = await page.evaluate(() => {
        const r = [];
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.type === 'hidden' || el.offsetHeight === 0) return;
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          const h = el.getBoundingClientRect().height;
          if (fs < 16 || h < 40) {
            r.push({ type: el.type, fs, h: Math.round(h), id: el.id, name: el.name });
          }
        });
        return r;
      });
      
      if (bad.length > 0) {
        console.log(`\n❌ ${url} (${bad.length} bad)`);
        bad.forEach(f => console.log(`  ${f.type} fs=${f.fs}px h=${f.h}px id="${f.id || '-'}" name="${f.name || '-'}"`));
      }
    } catch (e) {} finally { await page.close(); }
  }
  
  await browser.close();
})();
