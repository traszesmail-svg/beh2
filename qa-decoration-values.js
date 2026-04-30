const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });

  const linkStyles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).slice(0, 20).map((a, idx) => {
      const style = window.getComputedStyle(a);
      return {
        idx,
        text: a.textContent.substring(0, 20),
        classes: a.className.substring(0, 30),
        textDecoration: style.textDecoration,
        textDecorationLine: style.textDecorationLine,
        getPropertyValue_textDecoration: style.getPropertyValue('text-decoration'),
        textDecValues: style.textDecoration.split(' ')
      };
    });
  });

  console.log(JSON.stringify(linkStyles, null, 2).substring(0, 2000));
  await browser.close();
})();
