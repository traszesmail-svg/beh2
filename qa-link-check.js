const puppeteer = require('puppeteer');

async function checkLinks() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:/', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const linkDetails = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map((link, idx) => {
      const style = window.getComputedStyle(link);
      return {
        idx: idx,
        text: link.textContent.substring(0, 40),
        href: link.href.substring(0, 50),
        textDecoration: style.textDecoration,
        classes: link.className.substring(0, 60),
        isButton: link.classList.contains('button') || link.getAttribute('role') === 'button',
        hasUnderline: style.textDecoration.includes('underline')
      };
    });
  });

  console.log('LINKI NA HOME PAGE:\n');
  const problemLinks = linkDetails.filter(l => !l.hasUnderline && !l.isButton);
  
  if (problemLinks.length > 0) {
    console.log(`Found ${problemLinks.length} plain links without underline:\n`);
    problemLinks.forEach(l => {
      console.log(`${l.idx}. "${l.text}"`);
      console.log(`   Classes: ${l.classes || '(none)'}`);
      console.log(`   Decoration: ${l.textDecoration}`);
      console.log('');
    });
  } else {
    console.log('✅ All plain links have underline!');
  }

  const buttonLinks = linkDetails.filter(l => l.isButton);
  console.log(`\nButton links (no underline needed): ${buttonLinks.length}`);

  await browser.close();
}

checkLinks().catch(console.error);
