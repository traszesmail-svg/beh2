const puppeteer = require('puppeteer');

async function diagnoseImages() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Go to blog page
    console.log('Testing /blog page...');
    await page.goto('http://localhost:3001/blog', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Get all images
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img, idx) => ({
        index: idx,
        src: img.src,
        alt: img.alt,
        complete: img.complete,
        naturalHeight: img.naturalHeight,
        naturalWidth: img.naturalWidth,
        currentSrc: img.currentSrc,
        hasError: img.complete && img.naturalHeight === 0
      }));
    });

    console.log('\n📸 IMAGE ANALYSIS:');
    images.forEach((img, i) => {
      if (img.naturalHeight === 0 && img.src) {
        console.log(`❌ Broken image ${img.index}: ${img.src}`);
      } else if (img.complete) {
        console.log(`✅ Loaded image ${img.index}: ${img.src.substring(0, 50)}...`);
      } else {
        console.log(`⏳ Loading image ${img.index}: ${img.src.substring(0, 50)}...`);
      }
    });

    // Check for errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    page.on('error', err => {
      errors.push('Page error: ' + err.message);
    });

    // Wait a bit more for images to load
    await page.waitForTimeout(3000);

    // Check again
    const imagesAfter = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalHeight: img.naturalHeight,
        hasError: img.complete && img.naturalHeight === 0
      }));
    });

    const broken = imagesAfter.filter(img => img.hasError);
    console.log(`\n🔴 Total broken images: ${broken.length}`);
    broken.forEach(img => {
      console.log(`  - ${img.src}`);
    });

    // Now test /niezbednik
    console.log('\n\nTesting /niezbednik page...');
    await page.goto('http://localhost:3001/niezbednik', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const imagesNiezbednik = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img, idx) => ({
        index: idx,
        src: img.src,
        alt: img.alt,
        naturalHeight: img.naturalHeight,
        hasError: img.complete && img.naturalHeight === 0
      }));
    });

    await page.waitForTimeout(3000);

    const imagesNiezbednikAfter = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalHeight: img.naturalHeight,
        hasError: img.complete && img.naturalHeight === 0
      }));
    });

    const brokenNiezbednik = imagesNiezbednikAfter.filter(img => img.hasError);
    console.log(`🔴 Total broken images on /niezbednik: ${brokenNiezbednik.length}`);
    brokenNiezbednik.forEach(img => {
      console.log(`  - ${img.src}`);
    });

  } finally {
    await browser.close();
  }
}

diagnoseImages().catch(console.error);
