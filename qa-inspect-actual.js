const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });

  const inspect = await page.evaluate(() => {
    const navLink = Array.from(document.querySelectorAll('.notatnik-nav a')).find(a => a.textContent === 'Pies');
    if (!navLink) return { error: 'Nav link not found' };

    const style = window.getComputedStyle(navLink);
    const inline = navLink.getAttribute('style');
    
    return {
      text: navLink.textContent,
      classes: navLink.className,
      inline_style: inline,
      computed_textDecoration: style.textDecoration,
      computed_textDecorationLine: style.textDecorationLine,
      computed_textDecorationStyle: style.textDecorationStyle,
      all_declarations: Array.from(style).filter(p => p.includes('decoration'))
    };
  });

  console.log(JSON.stringify(inspect, null, 2));
  await browser.close();
})();
