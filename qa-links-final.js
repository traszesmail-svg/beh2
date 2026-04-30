const puppeteer = require('puppeteer');

(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔗 WERYFIKACJA LINKÓW');
  console.log('='.repeat(60) + '\n');

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  for (const page of ['/', '/blog', '/psy']) {
    const p = await browser.newPage();
    await p.setViewport({ width: 1280, height: 720 });

    try {
      await p.goto('http://localhost:3011' + page, { waitUntil: 'networkidle2', timeout: 25000 });

      const stats = await p.evaluate(() => {
        let total = 0, problemLinks = 0;

        document.querySelectorAll('a[href]').forEach(a => {
          total++;
          const decoration = window.getComputedStyle(a).textDecoration;
          const isButton = a.classList.contains('button') || a.getAttribute('role') === 'button';

          if (!isButton && !decoration.includes('underline')) {
            problemLinks++;
          }
        });

        return { total, problemLinks };
      });

      const status = stats.problemLinks === 0 ? '✅' : '❌';
      console.log(`${status} ${page}: ${stats.total} links, ${stats.problemLinks} bez underline`);
    } catch (e) {
      console.log(`❌ ${page}: ${e.message.substring(0, 40)}`);
    } finally {
      await p.close();
    }
  }

  await browser.close();
  console.log('\n' + '='.repeat(60) + '\n');
})();
