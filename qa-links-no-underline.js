const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:3011/', { waitUntil: 'networkidle2' });

  const problematic = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).filter((a, idx) => {
      const style = window.getComputedStyle(a);
      // Dokładnie jak w ostatecznym teście
      const hasDec = style.textDecoration?.includes('underline') || style.textDecorationLine?.includes('underline');
      const isButton = a.classList.contains('button') || a.getAttribute('role') === 'button' || a.classList.contains('notatnik-btn');
      
      const isBad = !isButton && !hasDec;
      if (isBad) {
        return true;
      }
      return false;
    }).map(a => ({
      text: a.textContent.substring(0, 30),
      classes: a.className,
      decoration: window.getComputedStyle(a).textDecoration,
      role: a.getAttribute('role')
    }));
  });

  console.log(`Found ${problematic.length} problem links:\n`);
  problematic.forEach((l, i) => {
    console.log(`${i+1}. "${l.text}"`);
    console.log(`   Classes: ${l.classes || '(none)'}`);
    console.log(`   Decoration: ${l.decoration}`);
    console.log(`   Role: ${l.role || '(none)'}\n`);
  });

  await browser.close();
})();
