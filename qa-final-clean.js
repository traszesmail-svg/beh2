const puppeteer = require('puppeteer');

(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ OSTATECZNA WERYFIKACJA WSZYSTKICH METRYK');
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  let totalBroken = 0, totalSmallFont = 0, totalBadForms = 0;

  for (const page of ['/', '/blog', '/psy', '/koty', '/kontakt']) {
    const p = await browser.newPage();
    await p.setViewport({ width: 1280, height: 720 });

    try {
      await p.goto('http://localhost:3011' + page, { waitUntil: 'networkidle2', timeout: 25000 });

      const metrics = await p.evaluate(() => {
        let broken = 0, smallFont = 0, badForm = 0;

        // IMAGES
        document.querySelectorAll('img').forEach(img => {
          if (img.complete && img.naturalHeight === 0 && img.src && !img.src.includes('data:')) {
            broken++;
          }
        });

        // SMALL FONTS
        document.querySelectorAll('*').forEach(el => {
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          if (fs < 12 && el.textContent?.trim().length > 5) {
            smallFont++;
          }
        });

        // BAD FORMS
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.type === 'hidden' || el.offsetHeight === 0) return;
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          const h = el.getBoundingClientRect().height;
          if (fs < 16 || h < 40) {
            badForm++;
          }
        });

        return { broken, smallFont, badForm };
      });

      totalBroken += metrics.broken;
      totalSmallFont += metrics.smallFont;
      totalBadForms += metrics.badForm;

      const status = metrics.broken === 0 && metrics.smallFont === 0 && metrics.badForm === 0 ? '✅' : '❌';
      console.log(`${status} ${page}: broken=${metrics.broken}, small=${metrics.smallFont}, form=${metrics.badForm}`);
    } catch (e) {
      console.log(`❌ ${page}: ${e.message.substring(0, 40)}`);
    } finally {
      await p.close();
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('📊 PODSUMOWANIE');
  console.log('='.repeat(60));
  console.log(`Zepsute obrazy: ${totalBroken}`);
  console.log(`Małe czcionki: ${totalSmallFont}`);
  console.log(`Błędy formularza: ${totalBadForms}`);

  const allGood = totalBroken === 0 && totalSmallFont === 0 && totalBadForms === 0;
  console.log('\n' + (allGood ? '✅ WSZYSTKO PRZESZŁO' : '❌ PROBLEMY') + '\n');
  console.log('='.repeat(60) + '\n');
})();
