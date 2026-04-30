const puppeteer = require('puppeteer');

(async () => {
  console.log('\n' + '█'.repeat(70));
  console.log('🎯 OSTATECZNA WERYFIKACJA WSZYSTKICH NAPRAW');
  console.log('█'.repeat(70));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  const results = {
    pages: 0,
    httpErrors: 0,
    brokenImages: 0,
    smallFonts: 0,
    badForms: 0,
    consoleErrors: 0,
    hydrationErrors: 0,
    duplicateKeys: 0,
    failed404: 0,
    titlesTooLong: 0,
    descTooLong: 0
  };

  const testPages = [
    '/', '/psy', '/psy/reaktywnosc-na-smyczy', '/psy/lek-separacyjny',
    '/koty', '/koty/zalatwianie-poza-kuweta', '/koty/konflikt-miedzy-kotami',
    '/o-mnie', '/cennik', '/faq', '/blog', '/niezbednik', '/kontakt', '/book',
    '/opinie', '/oferta', '/konsultacja-behawioralna-online',
    '/behawiorysta-online-polska', '/polityka-prywatnosci', '/regulamin',
    '/regulamin-pelna-konsultacja',
    '/blog/dlaczego-moj-pies-szczeka-na-inne-psy',
    '/blog/pies-wyje-kiedy-zostaje-sam',
    '/blog/kot-zalatwia-sie-poza-kuweta',
    '/materialy/kot-zyje-w-napieciu',
    '/materialy/pies-ile-ruchu-potrzebuje',
    '/materialy/kot-problem-poza-kuweta'
  ];

  for (const url of testPages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    
    const errors = [];
    page.on('console', m => {
      if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
    });
    page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));
    page.on('response', r => {
      if (r.status() === 404) results.failed404++;
    });

    try {
      const resp = await page.goto('http://localhost:4501' + url, { waitUntil: 'networkidle2', timeout: 25000 });
      if (resp.status() >= 400) results.httpErrors++;
      
      await new Promise(r => setTimeout(r, 2000));
      
      const data = await page.evaluate(() => {
        const r = { broken: 0, smallFont: 0, badForm: 0, titleLen: document.title.length,
                    descLen: document.querySelector('meta[name="description"]')?.content?.length || 0 };
        
        document.querySelectorAll('img').forEach(img => {
          if (img.complete && img.naturalHeight === 0 && img.src && !img.src.includes('data:')) r.broken++;
        });
        document.querySelectorAll('*').forEach(el => {
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          if (fs < 12 && el.textContent?.trim().length > 5) r.smallFont++;
        });
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.type === 'hidden' || el.offsetHeight === 0) return;
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          if (fs < 16 || el.getBoundingClientRect().height < 40) r.badForm++;
        });
        return r;
      });
      
      results.pages++;
      results.brokenImages += data.broken;
      results.smallFonts += data.smallFont;
      results.badForms += data.badForm;
      
      if (data.titleLen > 60) results.titlesTooLong++;
      if (data.descLen > 160) results.descTooLong++;
      
      const hydrErrors = errors.filter(e => e.toLowerCase().includes('hydrat') || e.includes('cannot be a descendant'));
      const dupKeys = errors.filter(e => e.includes('two children with the same key'));
      
      results.hydrationErrors += hydrErrors.length;
      results.duplicateKeys += dupKeys.length;
      results.consoleErrors += errors.length;
      
    } catch (e) {
      console.log(`❌ ${url}: ${e.message.substring(0, 40)}`);
    } finally {
      await page.close();
    }
  }
  
  await browser.close();

  console.log('\n' + '█'.repeat(70));
  console.log('📊 WYNIKI');
  console.log('█'.repeat(70));
  console.log(`  Sprawdzono stron:           ${results.pages}/${testPages.length}`);
  console.log(`  HTTP errors (>=400):        ${results.httpErrors} ${results.httpErrors === 0 ? '✅' : '❌'}`);
  console.log(`  Failed 404 requests:        ${results.failed404} ${results.failed404 === 0 ? '✅' : '❌'}`);
  console.log(`  Hydration errors:           ${results.hydrationErrors} ${results.hydrationErrors === 0 ? '✅' : '❌'}`);
  console.log(`  React duplicate keys:       ${results.duplicateKeys} ${results.duplicateKeys === 0 ? '✅' : '❌'}`);
  console.log(`  Total console errors:       ${results.consoleErrors} ${results.consoleErrors === 0 ? '✅' : '⚠️'}`);
  console.log(`  Tytuły > 60 znaków:         ${results.titlesTooLong} ${results.titlesTooLong === 0 ? '✅' : '❌'}`);
  console.log(`  Description > 160 znaków:   ${results.descTooLong} ${results.descTooLong === 0 ? '✅' : '❌'}`);
  console.log(`  Zepsute obrazy:             ${results.brokenImages} ${results.brokenImages === 0 ? '✅' : '❌'}`);
  console.log(`  Czcionki < 12px:            ${results.smallFonts} ${results.smallFonts === 0 ? '✅' : '❌'}`);
  console.log(`  Pola formularza złe:        ${results.badForms} ${results.badForms === 0 ? '✅' : '❌'}`);
  
  console.log('\n' + '█'.repeat(70));
  const allCritical = results.httpErrors + results.failed404 + results.hydrationErrors + 
                      results.duplicateKeys + results.titlesTooLong + results.descTooLong + 
                      results.brokenImages + results.smallFonts + results.badForms;
  if (allCritical === 0) {
    console.log('✅✅✅  WSZYSTKIE KRYTYCZNE BŁĘDY NAPRAWIONE  ✅✅✅');
  } else {
    console.log(`❌ Pozostało ${allCritical} krytycznych problemów`);
  }
  console.log('█'.repeat(70) + '\n');
})();
