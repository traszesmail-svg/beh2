const puppeteer = require('puppeteer');

const BASE_URL = 'https://regulskibehawiorysta.pl';
const EMAIL = 'traszesmail@gmail.com';

const services = [
  { id: 'szybka-konsultacja-15-min', label: 'Kwadrans z behawiorysta' },
  { id: 'konsultacja-30-min', label: 'Dwa kwadranse' },
  { id: 'konsultacja-behawioralna-online', label: 'Pelna konsultacja' },
  // skipping kwadrans-na-juz - it's no-slot urgent variant
];

async function makeBooking(browser, service, name, species, problemType) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  try {
    console.log(`\n🎯 Booking: ${service.label} (${species}) - ${name}`);
    
    // Step 1: Go to /book with service preselected
    const bookUrl = `${BASE_URL}/book?service=${service.id}`;
    console.log(`  → ${bookUrl}`);
    await page.goto(bookUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Take screenshot to see what's on the page
    await page.screenshot({ path: `qa-booking-${service.id}-step1.png`, fullPage: true });
    
    // Look for a way to proceed - find species and topic selection
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a')).map(el => ({
        tag: el.tagName,
        text: el.textContent?.substring(0, 50).trim(),
        href: el.href || null,
        type: el.type || null
      })).filter(b => b.text);
    });
    
    console.log(`  Found ${buttons.length} buttons/links`);
    console.log(`  Visible:`, buttons.slice(0, 5).map(b => b.text).join(' | '));
    
    return { page, buttons };
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    await page.close();
    return null;
  }
}

(async () => {
  console.log('\n' + '█'.repeat(70));
  console.log(`🎯 FULL BOOKING FLOW TEST on ${BASE_URL}`);
  console.log('█'.repeat(70));
  
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Just test ONE booking first to understand the flow
  const result = await makeBooking(browser, services[0], 'Test Tester', 'pies', 'reaktywnosc');
  
  if (result) {
    await result.page.close();
  }

  await browser.close();
  console.log('\nDone. Check screenshots in qa-booking-*.png');
})();
