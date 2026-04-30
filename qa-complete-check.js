const puppeteer = require('puppeteer');

async function completeCheck() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  console.log('\n' + '█'.repeat(70));
  console.log('🔍 PEŁNA WERYFIKACJA QA - 2026-04-29');
  console.log('█'.repeat(70));

  const results = {
    pages: [],
    totalImages: 0,
    totalBrokenImages: 0,
    totalSmallFonts: 0,
    totalBadForms: 0,
    totalGoodForms: 0
  };

  try {
    const testPages = [
      { url: '/', name: 'Home' },
      { url: '/blog', name: 'Blog' },
      { url: '/niezbednik', name: 'Niezbędnik' },
      { url: '/psy', name: 'Psy' },
      { url: '/koty', name: 'Koty' },
      { url: '/o-mnie', name: 'O mnie' },
      { url: '/cennik', name: 'Cennik' },
      { url: '/faq', name: 'FAQ' },
      { url: '/kontakt', name: 'Kontakt' },
      { url: '/book', name: 'Rezerwacja' }
    ];

    for (const {url, name} of testPages) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });

      try {
        console.log(`\n📄 ${name} (${url})`);
        await page.goto(`http://localhost:${url}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // ===== IMAGES =====
        const images = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src.substring(0, 80),
            complete: img.complete,
            naturalHeight: img.naturalHeight,
            broken: img.complete && img.naturalHeight === 0 && img.src && !img.src.includes('data:')
          }));
        });

        const brokenImages = images.filter(img => img.broken);
        results.totalImages += images.length;
        results.totalBrokenImages += brokenImages.length;

        // ===== FONTS =====
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

        results.totalSmallFonts += smallFonts;

        // ===== LINKS =====
        const linkStats = await page.evaluate(() => {
          let underlined = 0;
          let notUnderlined = 0;
          document.querySelectorAll('a[href]').forEach(link => {
            const style = window.getComputedStyle(link);
            const isButton = link.classList.contains('button') || 
                           link.getAttribute('role') === 'button' ||
                           link.classList.toString().includes('btn');
            if (!isButton) {
              if (style.textDecoration.includes('underline')) {
                underlined++;
              } else {
                notUnderlined++;
              }
            }
          });
          return { underlined, notUnderlined };
        });

        // ===== FORMS =====
        const formStats = await page.evaluate(() => {
          let good = 0, bad = 0;
          document.querySelectorAll('input, textarea, select').forEach(input => {
            const style = window.getComputedStyle(input);
            const fontSize = parseInt(style.fontSize);
            const rect = input.getBoundingClientRect();
            
            // Ignore hidden inputs
            if (rect.height === 0 || input.type === 'hidden') return;

            if (fontSize >= 16 && rect.height >= 40) {
              good++;
            } else {
              bad++;
              console.log(`    ❌ Form field: font=${fontSize}px, height=${Math.round(rect.height)}px, type=${input.type}`);
            }
          });
          return { good, bad };
        });

        results.totalGoodForms += formStats.good;
        results.totalBadForms += formStats.bad;

        // PAGE SUMMARY
        const imageStatus = brokenImages.length === 0 ? '✅' : '❌';
        const fontStatus = smallFonts === 0 ? '✅' : '❌';
        const linkStatus = linkStats.notUnderlined === 0 ? '✅' : '⚠️';
        const formStatus = formStats.bad === 0 ? '✅' : '❌';

        console.log(`   ${imageStatus} Obrazy: ${images.length} total, ${brokenImages.length} broken`);
        console.log(`   ${fontStatus} Czcionki: ${smallFonts} < 12px`);
        console.log(`   ${linkStatus} Linki: ${linkStats.underlined} z underline, ${linkStats.notUnderlined} bez`);
        console.log(`   ${formStatus} Formularz: ${formStats.good} good, ${formStats.bad} bad`);

        results.pages.push({
          name, url,
          images: images.length,
          brokenImages: brokenImages.length,
          smallFonts,
          linksNoUnderline: linkStats.notUnderlined,
          formsBad: formStats.bad
        });

      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } finally {
        await page.close();
      }
    }

  } finally {
    await browser.close();
  }

  // ===== FINAL REPORT =====
  console.log('\n' + '█'.repeat(70));
  console.log('📊 PODSUMOWANIE KOŃCOWE');
  console.log('█'.repeat(70));

  console.log(`\n🖼️  OBRAZY (64):`);
  console.log(`    Razem: ${results.totalImages}`);
  console.log(`    Zepsute: ${results.totalBrokenImages}`);
  console.log(`    Status: ${results.totalBrokenImages === 0 ? '✅ PASS' : '❌ FAIL'}`);

  console.log(`\n🔤 CZCIONKI:`);
  console.log(`    < 12px: ${results.totalSmallFonts}`);
  console.log(`    Status: ${results.totalSmallFonts === 0 ? '✅ PASS' : '❌ FAIL'}`);

  console.log(`\n📝 FORMULARZE:`);
  console.log(`    Poprawne (16px + 40px): ${results.totalGoodForms}`);
  console.log(`    Błędne: ${results.totalBadForms}`);
  console.log(`    Status: ${results.totalBadForms === 0 ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n' + '█'.repeat(70));
  const allPass = results.totalBrokenImages === 0 &&
                  results.totalSmallFonts === 0 &&
                  results.totalBadForms === 0;
  
  if (allPass) {
    console.log('✅✅✅ WSZYSTKO PRZESZŁO - PRODUCTION READY ✅✅✅');
  } else {
    console.log('⚠️  PROBLEMY DO NAPRAWY:');
    if (results.totalBrokenImages > 0) console.log(`   - ${results.totalBrokenImages} zepsutych obrazów`);
    if (results.totalSmallFonts > 0) console.log(`   - ${results.totalSmallFonts} elementów ze zbyt małą czcionką`);
    if (results.totalBadForms > 0) console.log(`   - ${results.totalBadForms} pól formularza z błędami`);
  }
  console.log('█'.repeat(70) + '\n');
}

completeCheck().catch(console.error);
