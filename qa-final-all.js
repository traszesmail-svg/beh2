const puppeteer = require('puppeteer');

(async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 OSTATECZNA WERYFIKACJA - WSZYSTKO');
  console.log('='.repeat(70) + '\n');

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  let metrics = { broken: 0, smallFont: 0, badForm: 0, noLinks: 0 };

  for (const page of ['/', '/blog', '/psy', '/koty', '/kontakt']) {
    const p = await browser.newPage();
    await p.setViewport({ width: 1280, height: 720 });

    try {
      await p.goto('http://localhost:3011' + page, { waitUntil: 'networkidle2', timeout: 25000 });

      const m = await p.evaluate(() => {
        let broken = 0, smallFont = 0, badForm = 0, linkIssues = 0;

        // Images broken
        document.querySelectorAll('img').forEach(img => {
          if (img.complete && img.naturalHeight === 0 && img.src && !img.src.includes('data:')) broken++;
        });

        // Small fonts
        document.querySelectorAll('*').forEach(el => {
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          if (fs < 12 && el.textContent?.trim().length > 5) smallFont++;
        });

        // Bad forms
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.type === 'hidden' || el.offsetHeight === 0) return;
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          const h = el.getBoundingClientRect().height;
          if (fs < 16 || h < 40) badForm++;
        });

        // Link decoration - check CORRECTLY
        document.querySelectorAll('a[href]').forEach(a => {
          const style = window.getComputedStyle(a);
          // Check for both text-decoration and text-decoration-line
          const hasDec = style.textDecoration?.includes('underline') || style.textDecorationLine?.includes('underline');
          const isButton = a.classList.contains('button') || a.getAttribute('role') === 'button' || a.classList.contains('notatnik-btn');
          if (!isButton && !hasDec) {
            linkIssues++;
          }
        });

        return { broken, smallFont, badForm, linkIssues };
      });

      metrics.broken += m.broken;
      metrics.smallFont += m.smallFont;
      metrics.badForm += m.badForm;
      metrics.noLinks += m.linkIssues;

      const status = m.broken === 0 && m.smallFont === 0 && m.badForm === 0 && m.linkIssues === 0 ? '✅' : '❌';
      console.log(`${status} ${page.padEnd(10)} broken=${m.broken} fonts=${m.smallFont} forms=${m.badForm} links=${m.linkIssues}`);
    } catch (e) {
      console.log(`❌ ${page.padEnd(10)} ERROR: ${e.message.substring(0, 30)}`);
    } finally {
      await p.close();
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(70));
  console.log(`🖼️  Zepsute obrazy: ${metrics.broken}`);
  console.log(`🔤 Małe czcionki: ${metrics.smallFont}`);
  console.log(`📝 Błędy formularza: ${metrics.badForm}`);
  console.log(`🔗 Linki bez underline: ${metrics.noLinks}`);

  const allGood = metrics.broken === 0 && metrics.smallFont === 0 && metrics.badForm === 0 && metrics.noLinks === 0;
  console.log('\n' + (allGood ? '✅✅✅ PRODUKCJA READY ✅✅✅' : '❌ PROBLEMY') + '\n');
  console.log('='.repeat(70) + '\n');
})();
