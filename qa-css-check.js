const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });
  
  const result = await page.evaluate(() => {
    const navLink = document.querySelector('.notatnik-nav a');
    if (!navLink) return { error: 'No nav link found' };
    
    const style = window.getComputedStyle(navLink);
    return {
      tag: navLink.tagName,
      text: navLink.textContent,
      decoration: style.textDecoration,
      hasUnderline: style.textDecoration.includes('underline')
    };
  });
  
  console.log('Nav link check:');
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})();
