const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  const pages = [
    '/', '/psy', '/psy/reaktywnosc-na-smyczy', '/psy/lek-separacyjny',
    '/koty', '/koty/zalatwianie-poza-kuweta', '/koty/konflikt-miedzy-kotami',
    '/o-mnie', '/cennik', '/faq', '/blog', '/niezbednik', '/kontakt', '/book',
    '/opinie', '/oferta', '/konsultacja-behawioralna-online', '/behawiorysta-online-polska',
    '/polityka-prywatnosci', '/regulamin', '/regulamin-pelna-konsultacja',
    '/blog/dlaczego-moj-pies-szczeka-na-inne-psy',
    '/blog/pies-wyje-kiedy-zostaje-sam',
    '/blog/kot-zalatwia-sie-poza-kuweta',
    '/materialy/kot-zyje-w-napieciu',
    '/materialy/pies-ile-ruchu-potrzebuje',
    '/materialy/kot-problem-poza-kuweta'
  ];

  let titlesBad = 0;
  let descBad = 0;

  console.log('Page                                        | TitleLen | DescLen | Status');
  console.log('-'.repeat(85));

  for (const url of pages) {
    const page = await browser.newPage();
    try {
      await page.goto('http://localhost:4501' + url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const meta = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content || ''
      }));
      
      const titleLen = meta.title.length;
      const descLen = meta.desc.length;
      const titleOk = titleLen <= 60;
      const descOk = descLen <= 160;
      
      if (!titleOk) titlesBad++;
      if (!descOk) descBad++;
      
      const status = titleOk && descOk ? '✅' : (!titleOk && !descOk ? '❌❌' : '❌');
      console.log(`${url.padEnd(45)} | ${String(titleLen).padStart(8)} | ${String(descLen).padStart(7)} | ${status}`);
      
    } catch (e) {
      console.log(`${url.padEnd(45)} | ERROR: ${e.message.substring(0, 30)}`);
    } finally {
      await page.close();
    }
  }
  
  console.log('-'.repeat(85));
  console.log(`Titles too long (>60): ${titlesBad}`);
  console.log(`Descriptions too long (>160): ${descBad}`);
  
  await browser.close();
})();
