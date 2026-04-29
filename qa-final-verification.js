const puppeteer = require('puppeteer');

async function finalVerification() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const results = {
    pages: [],
    images: { total: 0, broken: 0 },
    fonts: { small: 0 },
    links: { underline: 0, noUnderline: 0 },
    forms: { good: 0, bad: 0 }
  };

  try {
    const testPages = [
      '/', '/blog', '/niezbednik', '/psy', '/koty', '/kontakt', '/book'
    ];

    for (const pageUrl of testPages) {
      console.log(`\n🔍 SPRAWDZAM: ${pageUrl}`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });

      try {
        await page.goto(`http://localhost:3006${pageUrl}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // ===== IMAGE CHECK =====
        const images = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            complete: img.complete,
            naturalHeight: img.naturalHeight,
            broken: img.complete && img.naturalHeight === 0
          }));
        });

        const brokenImages = images.filter(img => img.broken);
        results.images.total += images.length;
        results.images.broken += brokenImages.length;

        // ===== FONT SIZE CHECK =====
        const smallFonts = await page.evaluate(() => {
          let count = 0;
          document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            const fontSize = parseInt(style.fontSize);
            const text = el.textContent?.trim();
            if (fontSize < 12 && text && text.length > 5) {
              count++;
            }
          });
          return count;
        });

        results.fonts.small += smallFonts;

        // ===== LINK UNDERLINE CHECK =====
        const linkCheck = await page.evaluate(() => {
          let underlined = 0;
          let notUnderlined = 0;
          document.querySelectorAll('a[href]').forEach(link => {
            const style = window.getComputedStyle(link);
            if (style.textDecoration.includes('underline')) {
              underlined++;
            } else if (!link.classList.contains('button') && !link.getAttribute('role') === 'button') {
              notUnderlined++;
            }
          });
          return { underlined, notUnderlined };
        });

        results.links.underline += linkCheck.underlined;
        results.links.noUnderline += linkCheck.notUnderlined;

        // ===== FORM CHECK =====
        const formCheck = await page.evaluate(() => {
          let good = 0, bad = 0;
          document.querySelectorAll('input, textarea, select').forEach(input => {
            const style = window.getComputedStyle(input);
            const fontSize = parseInt(style.fontSize);
            const rect = input.getBoundingClientRect();

            if (fontSize >= 16 && rect.height >= 40) {
              good++;
            } else {
              bad++;
            }
          });
          return { good, bad };
        });

        results.forms.good += formCheck.good;
        results.forms.bad += formCheck.bad;

        // SUMMARY FOR THIS PAGE
        console.log(`  📸 Images: ${images.length} total, ${brokenImages.length} broken`);
        console.log(`  🔤 Font < 12px: ${smallFonts} elements`);
        console.log(`  🔗 Links underlined: ${linkCheck.underlined}`);
        console.log(`  📝 Forms: ${formCheck.good} good, ${formCheck.bad} bad`);

        results.pages.push({
          url: pageUrl,
          images: images.length,
          brokenImages: brokenImages.length,
          smallFonts: smallFonts,
          formsGood: formCheck.good,
          formsBad: formCheck.bad
        });

      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
      } finally {
        await page.close();
      }
    }

  } finally {
    await browser.close();
  }

  // FINAL REPORT
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 FINAL VERIFICATION REPORT');
  console.log('='.repeat(60));

  console.log('\n🖼️ OBRAZY:');
  console.log(`   Total: ${results.images.total}`);
  console.log(`   Broken: ${results.images.broken}`);
  console.log(`   Status: ${results.images.broken === 0 ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🔤 CZCIONKI:');
  console.log(`   Elements < 12px: ${results.fonts.small}`);
  console.log(`   Status: ${results.fonts.small === 0 ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🔗 LINKI:');
  console.log(`   Z underline: ${results.links.underline}`);
  console.log(`   Bez underline: ${results.links.noUnderline}`);
  console.log(`   Status: ${results.links.noUnderline === 0 ? '✅ PASS' : '⚠️ CHECK'}`);

  console.log('\n📝 FORMULARZ:');
  console.log(`   Good (16px + 40px): ${results.forms.good}`);
  console.log(`   Bad: ${results.forms.bad}`);
  console.log(`   Status: ${results.forms.bad === 0 ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n' + '='.repeat(60));
  const allGood = results.images.broken === 0 &&
                  results.fonts.small === 0 &&
                  results.forms.bad === 0;
  console.log(`OGÓLNY STATUS: ${allGood ? '✅✅✅ WSZYSTKO OK ✅✅✅' : '⚠️ POTRZEBNE POPRAWKI'}`);
  console.log('='.repeat(60));
}

finalVerification().catch(console.error);
