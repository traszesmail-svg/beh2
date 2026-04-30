const puppeteer = require('puppeteer');

const BASE_URL = 'https://regulskibehawiorysta.pl';
const EMAIL = 'traszesmail@gmail.com';

async function tryBooking(browser, scenario, idx) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  console.log(`\n[${idx}] 🎯 ${scenario.serviceLabel} | ${scenario.species} | ${scenario.name}`);
  
  try {
    // Build /book URL with service + problemType
    const url = `${BASE_URL}/book?service=${scenario.serviceId}&species=${scenario.species}`;
    console.log(`     URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2500));
    
    // Try to dismiss cookie banner if present
    try {
      const acceptBtn = await page.$('button[aria-label*="ccept"], button[id*="ccept"], #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll, #CybotCookiebotDialogBodyButtonAccept');
      if (acceptBtn) {
        await acceptBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        console.log('     Cookies accepted');
      }
    } catch {}
    
    // Get current page structure - find topic/problem buttons
    const pageInfo = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/slot"]')).map(a => ({
        href: a.href,
        text: a.textContent?.substring(0, 60).trim()
      }));
      const radios = Array.from(document.querySelectorAll('input[type="radio"]')).map(r => ({
        name: r.name, value: r.value, id: r.id, checked: r.checked
      }));
      const submitBtns = Array.from(document.querySelectorAll('button[type="submit"], button')).map(b => b.textContent?.substring(0, 40).trim()).filter(Boolean);
      return { 
        url: window.location.href,
        slotLinks: links.slice(0, 5),
        radios: radios.slice(0, 10),
        buttons: submitBtns.slice(0, 10),
        hasFormBtn: document.querySelector('button[type="submit"]') !== null
      };
    });
    
    console.log(`     Current URL: ${pageInfo.url}`);
    console.log(`     Slot links found: ${pageInfo.slotLinks.length}`);
    console.log(`     Radios: ${pageInfo.radios.length}`);
    console.log(`     Submit btn: ${pageInfo.hasFormBtn}`);
    if (pageInfo.slotLinks.length > 0) {
      console.log(`     First slot link: ${pageInfo.slotLinks[0].text} → ${pageInfo.slotLinks[0].href.substring(0, 100)}`);
    }
    
    await page.screenshot({ path: `book-debug-${idx}.png`, fullPage: true });
    
    // Click first available slot link if found
    if (pageInfo.slotLinks.length > 0) {
      const slotUrl = pageInfo.slotLinks[0].href;
      console.log(`     Clicking slot...`);
      await page.goto(slotUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      
      const slotPageInfo = await page.evaluate(() => ({
        url: window.location.href,
        hasForm: document.querySelector('form') !== null,
        inputs: Array.from(document.querySelectorAll('input, textarea')).map(i => ({ name: i.name, type: i.type, id: i.id })).slice(0, 15)
      }));
      console.log(`     Slot URL: ${slotPageInfo.url}`);
      console.log(`     Form: ${slotPageInfo.hasForm}, Inputs: ${slotPageInfo.inputs.length}`);
      console.log(`     Inputs:`, slotPageInfo.inputs.map(i => i.name || i.id).filter(Boolean).slice(0, 8).join(', '));
      
      await page.screenshot({ path: `slot-debug-${idx}.png`, fullPage: true });
    }
    
    return { ok: true, info: pageInfo };
  } catch (e) {
    console.log(`     ❌ ${e.message.substring(0, 100)}`);
    return { ok: false };
  } finally {
    await page.close();
  }
}

(async () => {
  console.log('\n' + '█'.repeat(70));
  console.log('🔍 EXPLORE FULL BOOKING FLOW');
  console.log('█'.repeat(70));
  
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  await tryBooking(browser, {
    serviceId: 'szybka-konsultacja-15-min',
    serviceLabel: 'Kwadrans z behawiorysta',
    species: 'pies',
    name: 'Test 1'
  }, 1);

  await browser.close();
})();
