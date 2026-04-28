const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3002';
const SCREENSHOTS_DIR = './qa-screenshots';
const REPORT_FILE = './qa-reports/qa-audit-20260428.md';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const PAGES_TO_TEST = [
  { url: '/', name: 'Home - Strona główna' },
  { url: '/psy', name: 'Psy - Kategoria' },
  { url: '/psy/reaktywnosc-na-smyczy', name: 'Psy - Reaktywność' },
  { url: '/psy/lek-separacyjny', name: 'Psy - Separacja' },
  { url: '/koty', name: 'Koty - Kategoria' },
  { url: '/koty/zalatwianie-poza-kuweta', name: 'Koty - Kuweta' },
  { url: '/koty/konflikt-miedzy-kotami', name: 'Koty - Konflikt' },
  { url: '/o-mnie', name: 'O mnie' },
  { url: '/cennik', name: 'Cennik' },
  { url: '/faq', name: 'FAQ' },
  { url: '/blog', name: 'Blog - Listing' },
  { url: '/kontakt', name: 'Kontakt' },
  { url: '/niezbednik', name: 'Niezbędnik' },
  { url: '/book', name: 'Rezerwacja' },
];

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const issues = [];
  const results = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    for (const testPage of PAGES_TO_TEST) {
      const url = `${BASE_URL}${testPage.url}`;
      console.log(`Testing: ${testPage.name} (${testPage.url})`);

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Take screenshot
        const screenshotName = testPage.url.replace(/\//g, '-').substring(1) || 'home';
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${screenshotName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Check for common issues
        const pageIssues = await checkPageIssues(page, testPage.url);
        if (pageIssues.length > 0) {
          issues.push({
            page: testPage.name,
            url: testPage.url,
            issues: pageIssues
          });
        }

        results.push({
          page: testPage.name,
          url: testPage.url,
          status: 'PASS',
          screenshot: screenshotPath
        });

      } catch (error) {
        console.error(`Error testing ${testPage.name}:`, error.message);
        issues.push({
          page: testPage.name,
          url: testPage.url,
          issues: [`Failed to load: ${error.message}`]
        });
        results.push({
          page: testPage.name,
          url: testPage.url,
          status: 'FAIL'
        });
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }

  // Generate report
  generateReport(results, issues);
  console.log(`\n✅ QA Audit complete. Report saved to: ${REPORT_FILE}`);
}

async function checkPageIssues(page, url) {
  const issues = [];

  try {
    // Check for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        issues.push(`Console error: ${msg.text()}`);
      }
    });

    // Check if page has content
    const title = await page.title();
    if (!title) {
      issues.push('Page has no title');
    }

    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.complete || img.naturalHeight === 0).map(img => img.src || img.alt);
    });
    if (brokenImages.length > 0) {
      issues.push(`Broken images: ${brokenImages.join(', ')}`);
    }

    // Check for broken SVGs
    const brokenSvgs = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      return svgs.filter(svg => svg.getBBox().width === 0 || svg.getBBox().height === 0).length;
    });
    if (brokenSvgs > 0) {
      issues.push(`${brokenSvgs} broken SVG elements`);
    }

    // Check for form fields
    if (url.includes('kontakt') || url.includes('book')) {
      const formIssues = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        const problems = [];
        inputs.forEach(input => {
          if (input.offsetHeight === 0) {
            problems.push(`Hidden form element: ${input.name || input.type}`);
          }
        });
        return problems;
      });
      issues.push(...formIssues);
    }

  } catch (error) {
    issues.push(`Error checking page issues: ${error.message}`);
  }

  return issues;
}

function generateReport(results, issues) {
  let report = `# QA Audit Report - ${new Date().toISOString().split('T')[0]}\n\n`;

  report += `## Summary\n`;
  report += `- Total pages tested: ${results.length}\n`;
  report += `- Passed: ${results.filter(r => r.status === 'PASS').length}\n`;
  report += `- Failed: ${results.filter(r => r.status === 'FAIL').length}\n`;
  report += `- Issues found: ${issues.length}\n\n`;

  report += `## Test Results\n\n`;
  for (const result of results) {
    report += `### ${result.page}\n`;
    report += `- URL: \`${result.url}\`\n`;
    report += `- Status: ${result.status}\n`;
    if (result.screenshot) {
      report += `- Screenshot: \`${result.screenshot}\`\n`;
    }
    report += '\n';
  }

  if (issues.length > 0) {
    report += `## Issues Found\n\n`;
    for (const issue of issues) {
      report += `### ${issue.page} (${issue.url})\n`;
      for (const problem of issue.issues) {
        report += `- ⚠️ ${problem}\n`;
      }
      report += '\n';
    }
  }

  fs.writeFileSync(REPORT_FILE, report);
}

runAudit().catch(console.error);
