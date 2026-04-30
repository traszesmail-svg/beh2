const puppeteer = require('puppeteer');

async function checkBlogForm() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:3006/blog', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const forms = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, textarea, select')).map((input, idx) => {
      const style = window.getComputedStyle(input);
      const rect = input.getBoundingClientRect();
      const fontSize = parseInt(style.fontSize);
      
      return {
        index: idx,
        tag: input.tagName.toLowerCase(),
        type: input.type || input.tagName.toLowerCase(),
        fontSize: fontSize,
        height: Math.round(rect.height),
        padding: style.padding,
        placeholder: input.placeholder,
        classes: input.className.substring(0, 50),
        id: input.id,
      };
    });
  });

  console.log('FORMULARZ NA /BLOG:\n');
  forms.forEach(form => {
    const fontOK = form.fontSize >= 16 ? '✅' : '❌';
    const heightOK = form.height >= 40 ? '✅' : '❌';
    console.log(`${form.index}. <${form.tag}> type="${form.type}"`);
    console.log(`   ${fontOK} Font: ${form.fontSize}px`);
    console.log(`   ${heightOK} Height: ${form.height}px`);
    console.log(`   ID: ${form.id || '(brak)'}`);
    if (form.classes) console.log(`   Classes: ${form.classes}`);
    console.log('');
  });

  await browser.close();
}

checkBlogForm().catch(console.error);
