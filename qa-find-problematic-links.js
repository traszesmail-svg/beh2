const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map((a, idx) => {
      const style = window.getComputedStyle(a);
      const isBtn = a.classList.contains('button') || a.getAttribute('role') === 'button';
      return {
        idx,
        text: a.textContent.substring(0, 30),
        decoration: style.textDecoration,
        classes: a.className.substring(0, 50),
        isButton: isBtn,
        hasUnderline: style.textDecoration.includes('underline')
      };
    });
  });
  
  const problemLinks = links.filter(l => !l.hasUnderline && !l.isButton);
  
  console.log(`Total links: ${links.length}`);
  console.log(`Problem links (no underline, not button): ${problemLinks.length}\n`);
  
  problemLinks.slice(0, 10).forEach((l, i) => {
    console.log(`${i+1}. "${l.text}"`);
    console.log(`   Classes: ${l.classes || '(none)'}`);
    console.log(`   Decoration: ${l.decoration}`);
  });
  
  await browser.close();
})();
