const puppeteer = require('puppeteer');

async function ultimateTest() {
  console.log('\n' + '█'.repeat(70));
  console.log('🎯 OSTATECZNA WERYFIKACJA - WSZYSTKO SPRAWDZANE');
  console.log('█'.repeat(70));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const results = {
    images: { total: 0, broken: 0 },
    fonts: { small: 0 },
    links: { noUnderline: 0 },
    forms: { bad: 0 }
  };

  const testPages = [
    { url: '/', name: 'Home' },
    { url: '/blog', name: 'Blog' },
    { url: '/niezbednik', name: 'Niezbędnik' },
    { url: '/psy', name: 'Psy' },
    { url: '/koty', name: 'Koty' },
    { url: '/kontakt', name: 'Kontakt' },
    { url: '/book', name: 'Rezerwacja' }
  ];

  for (const {url, name} of testPages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
      await page.goto('http://localhost:3010' + url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Images
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).filter(img =>
          img.complete && img.naturalHeight === 0 && img.src && !img.src.includes('data:')
        ).length;
      });
      results.images.total += Array.from(await page.evaluate(() => document.querySelectorAll('img'))).length;
      results.images.broken += images;

      // Fonts
      const fonts = await page.evaluate(() => {
        let count = 0;
        document.querySelectorAll('*').forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseInt(style.fontSize);
          const text = el.textContent?.trim();
          if (fontSize < 12 && text && text.length > 5) count++;
        });
        return count;
      });
      results.fonts.small += fonts;

      // Links
      const links = await page.evaluate(() => {
        let count = 0;
        document.querySelectorAll('a[href]').forEach(a => {
          const style = window.getComputedStyle(a);
          const isButton = a.classList.contains('button') || a.getAttribute('role') === 'button';
          if (!isButton && !style.textDecoration.includes('underline')) count++;
        });
        return count;
      });
      results.links.noUnderline += links;

      // Forms
      const forms = await page.evaluate(() => {
        let bad = 0;
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.offsetHeight === 0 || el.type === 'hidden') return;
          const style = window.getComputedStyle(el);
          const fontSize = parseInt(style.fontSize);
          if (fontSize < 16 || el.getBoundingClientRect().height < 40) bad++;
        });
        return bad;
      });
      results.forms.bad += forms;

      console.log(`  ${name}: ✅`);
    } catch (e) {
      console.log(`  ${name}: ❌ ${e.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n' + '█'.repeat(70));
  console.log('📊 WYNIKI');
  console.log('█'.repeat(70));
  console.log(`🖼️  Obrazy: ${results.images.broken} zepsute z ${results.images.total}`);
  console.log(`🔤 Czcionki: ${results.fonts.small} < 12px`);
  console.log(`🔗 Linki: ${results.links.noUnderline} bez underline`);
  console.log(`📝 Formularz: ${results.forms.bad} błędów`);

  const allGood = results.images.broken === 0 &&
                  results.fonts.small === 0 &&
                  results.links.noUnderline === 0 &&
                  results.forms.bad === 0;

  console.log('\n' + '█'.repeat(70));
  if (allGood) {
    console.log('✅✅✅ WSZYSTKO JEST DOSKONAŁE - PRODUCTION READY ✅✅✅');
  } else {
    console.log('❌ PROBLEMY:');
    if (results.images.broken > 0) console.log(`   - ${results.images.broken} zepsutych obrazów`);
    if (results.fonts.small > 0) console.log(`   - ${results.fonts.small} małych czcionek`);
    if (results.links.noUnderline > 0) console.log(`   - ${results.links.noUnderline} linków bez underline`);
    if (results.forms.bad > 0) console.log(`   - ${results.forms.bad} błędów formularza`);
  }
  console.log('█'.repeat(70) + '\n');
}

ultimateTest().catch(console.error);
