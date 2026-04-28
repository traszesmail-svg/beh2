const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:3004';

async function finalVerification() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const results = {
    desktop: null,
    mobile: null,
    allPages: []
  };

  try {
    // Test Desktop
    const pageDesktop = await browser.newPage();
    await pageDesktop.setViewport({ width: 1280, height: 720 });
    await pageDesktop.goto(`${BASE_URL}/kontakt`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    results.desktop = await pageDesktop.evaluate(() => {
      const select = document.querySelector('select');
      if (!select) return { error: 'No select found' };
      const style = window.getComputedStyle(select);
      return {
        fontSize: style.fontSize,
        height: Math.round(select.getBoundingClientRect().height),
        padding: style.padding,
        minHeight: style.minHeight,
        status: 'OK'
      };
    });

    await pageDesktop.screenshot({ path: './qa-screenshots/kontakt-fixed-desktop.png', fullPage: true });
    console.log('📸 Desktop screenshot saved');
    await pageDesktop.close();

    // Test Mobile
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 375, height: 812 });
    await pageMobile.goto(`${BASE_URL}/kontakt`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    results.mobile = await pageMobile.evaluate(() => {
      const select = document.querySelector('select');
      if (!select) return { error: 'No select found' };
      const style = window.getComputedStyle(select);
      return {
        fontSize: style.fontSize,
        height: Math.round(select.getBoundingClientRect().height),
        padding: style.padding,
        minHeight: style.minHeight,
        status: 'OK'
      };
    });

    await pageMobile.screenshot({ path: './qa-screenshots/kontakt-fixed-mobile.png', fullPage: true });
    console.log('📸 Mobile screenshot saved');
    await pageMobile.close();

    // Test all key pages
    const pages = ['/', '/psy', '/koty', '/kontakt', '/blog', '/cennik', '/niezbednik', '/o-mnie'];

    for (const url of pages) {
      const testPage = await browser.newPage();
      await testPage.setViewport({ width: 1280, height: 720 });

      try {
        await testPage.goto(`${BASE_URL}${url}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        const statusCode = await testPage.evaluate(() => window.__NEXT_DATA__?.pageProps?.statusCode || 200);

        results.allPages.push({
          url,
          status: statusCode === 404 ? 'FAIL' : 'PASS',
          statusCode: statusCode || 200
        });

      } catch (error) {
        results.allPages.push({
          url,
          status: 'ERROR',
          error: error.message
        });
      }

      await testPage.close();
    }

  } finally {
    await browser.close();
  }

  // Print results
  console.log('\n✅ FINAL VERIFICATION RESULTS\n');
  console.log('Desktop Form (1280x720):', JSON.stringify(results.desktop, null, 2));
  console.log('\nMobile Form (375x812):', JSON.stringify(results.mobile, null, 2));

  console.log('\n📋 All Pages Status:');
  results.allPages.forEach(p => {
    console.log(`${p.status === 'PASS' ? '✅' : '❌'} ${p.url.padEnd(20)} - HTTP ${p.statusCode}`);
  });

  const allPass = results.allPages.every(p => p.status === 'PASS');
  console.log(`\n${allPass ? '🎉 ALL PAGES WORKING!' : '⚠️ Some pages have issues'}`);
}

finalVerification().catch(console.error);
