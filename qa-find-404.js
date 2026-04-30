const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const failedRequests = [];

  page.on('response', resp => {
    if (resp.status() === 404) {
      failedRequests.push({
        url: resp.url(),
        type: resp.request().resourceType()
      });
    }
  });

  await page.goto('http://localhost:4001/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('404 requests on home page:');
  failedRequests.forEach(r => {
    console.log(`  [${r.type}] ${r.url}`);
  });

  await browser.close();
})();
