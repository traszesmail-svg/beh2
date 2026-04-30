const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3008/', { waitUntil: 'networkidle2' });
  
  const links = await page.evaluate(() => {
    let noUnderline = 0;
    document.querySelectorAll('a[href]').forEach(a => {
      const style = window.getComputedStyle(a);
      const isButton = a.classList.contains('button') || a.getAttribute('role') === 'button';
      if (!isButton && !style.textDecoration.includes('underline')) {
        noUnderline++;
        console.log(`NO UNDERLINE: ${a.textContent.substring(0, 30)} classes="${a.className}"`);
      }
    });
    return noUnderline;
  });
  
  console.log(`\nLinki bez underline: ${links}`);
  await browser.close();
})();
