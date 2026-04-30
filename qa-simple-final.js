const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Szybka weryfikacja wszystkich stron\n');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  const pages = ['/', '/blog', '/psy', '/koty', '/kontakt'];
  
  for (const url of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    try {
      await page.goto('http://localhost:3011' + url, { waitUntil: 'networkidle2', timeout: 20000 });
      
      const stats = await page.evaluate(() => {
        let broken = 0, smallFont = 0, noUnderline = 0, badForm = 0;
        
        // Images
        document.querySelectorAll('img').forEach(img => {
          if (img.complete && img.naturalHeight === 0 && img.src && !img.src.includes('data:')) broken++;
        });
        
        // Fonts
        document.querySelectorAll('*').forEach(el => {
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          if (fs < 12 && el.textContent?.trim().length > 5) smallFont++;
        });
        
        // Links
        document.querySelectorAll('a[href]').forEach(a => {
          const decoration = window.getComputedStyle(a).textDecoration;
          const isBtn = a.classList.contains('button') || a.getAttribute('role') === 'button';
          if (!isBtn && !decoration.includes('underline')) noUnderline++;
        });
        
        // Forms
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.offsetHeight === 0 || el.type === 'hidden') return;
          const fs = parseInt(window.getComputedStyle(el).fontSize);
          if (fs < 16 || el.getBoundingClientRect().height < 40) badForm++;
        });
        
        return { broken, smallFont, noUnderline, badForm };
      });
      
      const status = stats.broken === 0 && stats.smallFont === 0 && stats.noUnderline === 0 && stats.badForm === 0 ? '✅' : '❌';
      console.log(`${status} ${url}`);
      console.log(`    Broken: ${stats.broken}, SmallFont: ${stats.smallFont}, NoUnderline: ${stats.noUnderline}, BadForm: ${stats.badForm}`);
    } catch (e) {
      console.log(`❌ ${url} - ${e.message}`);
    } finally {
      await page.close();
    }
  }
  
  await browser.close();
})();
