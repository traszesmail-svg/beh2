const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Testowanie linków na HOME...\n');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3009/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  const result = await page.evaluate(() => {
    let withUnderline = 0;
    let withoutUnderline = 0;
    const problems = [];
    
    document.querySelectorAll('a[href]').forEach((a, idx) => {
      const style = window.getComputedStyle(a);
      const isButton = a.classList.contains('button') || 
                      a.classList.contains('notatnik-btn') ||
                      a.getAttribute('role') === 'button';
      
      if (isButton) {
        return;
      }
      
      if (style.textDecoration.includes('underline')) {
        withUnderline++;
      } else {
        withoutUnderline++;
        problems.push({
          text: a.textContent.substring(0, 40),
          classes: a.className.substring(0, 50),
          decoration: style.textDecoration
        });
      }
    });
    
    return { withUnderline, withoutUnderline, problems };
  });
  
  console.log(`✅ Z underline: ${result.withUnderline}`);
  console.log(`❌ Bez underline: ${result.withoutUnderline}`);
  
  if (result.withoutUnderline > 0) {
    console.log('\nProblemy:');
    result.problems.slice(0, 5).forEach(p => {
      console.log(`  - "${p.text}" (${p.classes})`);
      console.log(`    decoration: ${p.decoration}`);
    });
  }
  
  await browser.close();
  process.exit(result.withoutUnderline > 0 ? 1 : 0);
})();
