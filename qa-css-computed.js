const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });
  
  const computedStyles = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href]');
    const results = [];
    
    // Test different link types
    const testLinks = [
      { selector: '.notatnik-nav a', desc: 'Nav link' },
      { selector: 'a.prep-inline-link', desc: 'Inline link' },
      { selector: 'a:not(.button):not(.notatnik-btn)', desc: 'Plain link' }
    ];
    
    testLinks.forEach(test => {
      const el = document.querySelector(test.selector);
      if (el) {
        const style = window.getComputedStyle(el);
        results.push({
          type: test.desc,
          selector: test.selector,
          text: el.textContent.substring(0, 20),
          decoration: style.textDecoration,
          hasUnderline: style.textDecoration.includes('underline')
        });
      }
    });
    
    return results;
  });
  
  console.log('CSS Computed Styles Check:');
  computedStyles.forEach(r => {
    console.log(`\n${r.type} (${r.selector})`);
    console.log(`  Text: "${r.text}"`);
    console.log(`  Decoration: ${r.decoration}`);
    console.log(`  Has Underline: ${r.hasUnderline}`);
  });
  
  await browser.close();
})();
