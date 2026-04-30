const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning') warnings.push(msg.text());
  });
  
  await page.goto('http://localhost:4501/psy/reaktywnosc-na-smyczy', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  
  const reactWarnings = [...errors, ...warnings].filter(e => 
    e.includes('Warning:') || 
    e.includes('two children with the same key') ||
    e.includes('duplicate')
  );
  
  console.log('=== REACT WARNINGS CHECK on /psy/reaktywnosc-na-smyczy ===');
  console.log(`Total errors: ${errors.length}`);
  console.log(`Total warnings: ${warnings.length}`);
  console.log(`React warnings (Warning:/duplicate): ${reactWarnings.length}`);
  
  if (reactWarnings.length > 0) {
    console.log('\nReact warnings found:');
    reactWarnings.forEach(w => console.log('  - ' + w.substring(0, 120)));
  }
  
  // Also check 4 other pages from problem-landings (which use same lib)
  for (const url of ['/psy/lek-separacyjny', '/koty/zalatwianie-poza-kuweta', '/koty/konflikt-miedzy-kotami']) {
    const newPage = await browser.newPage();
    const pageErrors = [];
    newPage.on('console', m => { 
      if (m.type() === 'error' || m.type() === 'warning') pageErrors.push(m.text());
    });
    await newPage.goto('http://localhost:4501' + url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    const dupKeys = pageErrors.filter(e => e.includes('two children with the same key'));
    console.log(`${url}: ${dupKeys.length === 0 ? '✅' : '❌'} duplicate keys: ${dupKeys.length}`);
    await newPage.close();
  }
  
  await browser.close();
})();
