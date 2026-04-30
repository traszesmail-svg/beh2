const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = './qa-screenshots-comprehensive';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const PAGES_TO_TEST = [
  // Home & Main Pages
  { url: '/', name: 'Home', category: 'Main' },

  // Dogs Section
  { url: '/psy', name: 'Psy - Kategoria', category: 'Dogs' },
  { url: '/psy/reaktywnosc-na-smyczy', name: 'Psy - Reaktywność', category: 'Dogs' },
  { url: '/psy/lek-separacyjny', name: 'Psy - Separacja', category: 'Dogs' },

  // Cats Section
  { url: '/koty', name: 'Koty - Kategoria', category: 'Cats' },
  { url: '/koty/zalatwianie-poza-kuweta', name: 'Koty - Kuweta', category: 'Cats' },
  { url: '/koty/konflikt-miedzy-kotami', name: 'Koty - Konflikt', category: 'Cats' },

  // Main Pages
  { url: '/o-mnie', name: 'O mnie', category: 'Info' },
  { url: '/cennik', name: 'Cennik', category: 'Info' },
  { url: '/faq', name: 'FAQ', category: 'Info' },
  { url: '/blog', name: 'Blog - Listing', category: 'Content' },
  { url: '/niezbednik', name: 'Niezbędnik', category: 'Content' },

  // Forms
  { url: '/kontakt', name: 'Kontakt', category: 'Forms' },
  { url: '/book', name: 'Rezerwacja', category: 'Forms' },
];

async function runComprehensiveAudit() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const allIssues = [];
  const results = [];
  const screenshotsGenerated = [];

  try {
    for (const testPage of PAGES_TO_TEST) {
      console.log(`\n🔍 Testing: ${testPage.name} (${testPage.url})`);

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });

      try {
        await page.goto(`${BASE_URL}${testPage.url}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Take screenshot
        const screenshotName = testPage.url.replace(/\//g, '-').substring(1) || 'home';
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${screenshotName}-desktop.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        screenshotsGenerated.push(screenshotPath);
        console.log(`  📸 Screenshot: ${screenshotName}-desktop.png`);

        // Comprehensive checks
        const issues = await performComprehensiveChecks(page, testPage);

        results.push({
          page: testPage.name,
          url: testPage.url,
          category: testPage.category,
          status: issues.length === 0 ? 'PASS' : 'ISSUES',
          issueCount: issues.length
        });

        if (issues.length > 0) {
          console.log(`  ⚠️ Issues found: ${issues.length}`);
          allIssues.push({
            page: testPage.name,
            url: testPage.url,
            category: testPage.category,
            issues: issues
          });
        } else {
          console.log(`  ✅ No issues`);
        }

      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        results.push({
          page: testPage.name,
          url: testPage.url,
          category: testPage.category,
          status: 'ERROR',
          error: error.message
        });
      } finally {
        await page.close();
      }
    }

  } finally {
    await browser.close();
  }

  // Generate comprehensive report
  generateComprehensiveReport(results, allIssues);
  console.log('\n✅ Comprehensive QA audit complete!');
  console.log(`📸 Screenshots: ${screenshotsGenerated.length}`);
  console.log(`📋 Report: qa-reports/QA-COMPREHENSIVE-20260428.md`);
}

async function performComprehensiveChecks(page, testPage) {
  const issues = [];

  try {
    // 1. Page Load & HTTP Status
    const pageStatus = await page.evaluate(() => window.__NEXT_DATA__?.pageProps?.statusCode || 200);
    if (pageStatus === 404) {
      issues.push('HTTP 404 - Page not found');
      return issues;
    }

    // 2. Title and Meta
    const metadata = await page.evaluate(() => ({
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.content,
      h1: document.querySelector('h1')?.textContent?.substring(0, 50),
      lang: document.documentElement.lang
    }));

    if (!metadata.title) issues.push('Missing page title');
    if (!metadata.metaDescription) issues.push('Missing meta description');
    if (!metadata.h1) issues.push('Missing H1 heading');

    // 3. Images & Media
    const mediaIssues = await page.evaluate(() => {
      const problems = [];
      const images = document.querySelectorAll('img');
      const svgs = document.querySelectorAll('svg');

      // Check images
      images.forEach((img, idx) => {
        if (!img.complete || (img.naturalHeight === 0 && img.src)) {
          problems.push(`Broken image ${idx}: ${img.alt || img.src?.substring(0, 30)}`);
        }
        if (!img.alt && !img.title) {
          problems.push(`Image without alt: ${img.src?.substring(0, 30)}`);
        }
      });

      // Check SVG
      svgs.forEach((svg, idx) => {
        if (svg.getBBox) {
          const bbox = svg.getBBox();
          if (bbox.width === 0 || bbox.height === 0) {
            problems.push(`Empty SVG element ${idx}`);
          }
        }
      });

      return problems;
    });
    issues.push(...mediaIssues);

    // 4. Layout Issues
    const layoutIssues = await page.evaluate(() => {
      const problems = [];

      // Check for horizontal overflow
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      if (bodyWidth > windowWidth) {
        problems.push(`Horizontal overflow: ${bodyWidth}px > ${windowWidth}px`);
      }

      // Check text overflow
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, li');
      textElements.forEach((el) => {
        if (el.scrollWidth > el.clientWidth && el.offsetWidth > 0) {
          const text = el.textContent?.substring(0, 40) || 'text';
          if (!el.style.whiteSpace?.includes('nowrap')) {
            problems.push(`Text overflow: "${text}..."`);
          }
        }
      });

      // Check for missing buttons/CTAs
      const buttons = document.querySelectorAll('button, a.button, [role="button"]');
      if (buttons.length === 0) {
        const hasLinks = document.querySelectorAll('a[href]').length > 0;
        if (!hasLinks) {
          problems.push('No interactive elements (buttons/links) found');
        }
      }

      return problems;
    });
    issues.push(...layoutIssues);

    // 5. Forms
    const formIssues = await page.evaluate(() => {
      const problems = [];
      const inputs = document.querySelectorAll('input, textarea, select');

      inputs.forEach((input) => {
        const style = window.getComputedStyle(input);
        const rect = input.getBoundingClientRect();

        // Check font size
        const fontSize = parseInt(style.fontSize);
        if (fontSize < 14) {
          problems.push(`Small font on ${input.type || 'input'}: ${fontSize}px`);
        }

        // Check height
        if (rect.height < 40 && input.offsetHeight > 0) {
          problems.push(`Small height on ${input.type}: ${Math.round(rect.height)}px`);
        }

        // Check label association
        if (input.type !== 'hidden') {
          const label = document.querySelector(`label[for="${input.id}"]`);
          if (!label && input.id) {
            problems.push(`Input "${input.id}" has no associated label`);
          }
        }
      });

      return problems;
    });
    issues.push(...formIssues);

    // 6. Color Contrast & Accessibility
    const a11yIssues = await page.evaluate(() => {
      const problems = [];

      // Check for very small text
      const smallText = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        const fontSize = parseInt(style.fontSize);
        const content = el.textContent?.trim();
        return fontSize < 12 && content && content.length > 10;
      });

      if (smallText.length > 3) {
        problems.push(`${smallText.length} elements with font < 12px`);
      }

      // Check for links without underline
      const links = document.querySelectorAll('a[href]');
      let plainLinks = 0;
      links.forEach(link => {
        const style = window.getComputedStyle(link);
        if (style.textDecoration === 'none' && !link.classList.contains('button')) {
          plainLinks++;
        }
      });
      if (plainLinks > 5) {
        problems.push(`${plainLinks} plain links without underline (accessibility)`);
      }

      return problems;
    });
    issues.push(...a11yIssues);

    // 7. Polish Content Check
    const contentIssues = await page.evaluate(() => {
      const problems = [];
      const text = document.body.innerText;

      // Check for common Polish words
      const polishWords = text.match(/[ąćęłńóśźż]/gi) || [];
      if (polishWords.length === 0 && text.length > 100) {
        problems.push('No Polish characters found - possible encoding issue');
      }

      // Check for "under construction" markers
      if (text.includes('TODO') || text.includes('[object Object]')) {
        problems.push('Debug/placeholder text visible on page');
      }

      return problems;
    });
    issues.push(...contentIssues);

    // 8. Responsive Design Check
    const responsiveIssues = await page.evaluate(() => {
      const problems = [];

      // Check if page has viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        problems.push('Missing viewport meta tag');
      }

      // Check for fixed widths that break responsive
      const elements = document.querySelectorAll('[style*="width"]');
      let hasProblematicFixed = 0;
      elements.forEach(el => {
        const width = el.style.width;
        if (width && width.includes('px') && parseInt(width) > 1000) {
          hasProblematicFixed++;
        }
      });
      if (hasProblematicFixed > 3) {
        problems.push(`${hasProblematicFixed} elements with fixed widths > 1000px`);
      }

      return problems;
    });
    issues.push(...responsiveIssues);

  } catch (error) {
    issues.push(`Check error: ${error.message}`);
  }

  return issues.filter(issue => issue && issue.trim().length > 0);
}

function generateComprehensiveReport(results, allIssues) {
  let report = `# 🔍 Kompleksowy Raport QA - ${new Date().toISOString().split('T')[0]}\n\n`;

  // Summary
  const totalPages = results.length;
  const passCount = results.filter(r => r.status === 'PASS').length;
  const issuesCount = results.filter(r => r.status === 'ISSUES').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  const totalIssues = allIssues.reduce((sum, p) => sum + p.issues.length, 0);

  report += `## 📊 Podsumowanie\n`;
  report += `- **Przeskanowanych stron:** ${totalPages}\n`;
  report += `- **Bez problemów:** ${passCount} ✅\n`;
  report += `- **Ze znalezionymi błędami:** ${issuesCount} ⚠️\n`;
  report += `- **Z błędami załadowania:** ${errorCount} ❌\n`;
  report += `- **Całkowita liczba problemów:** ${totalIssues}\n\n`;

  // Results by category
  report += `## 📂 Wyniki po kategoriach\n\n`;
  const categories = [...new Set(results.map(r => r.category))];

  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    report += `### ${category}\n`;
    for (const result of categoryResults) {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'ERROR' ? '❌' : '⚠️';
      report += `${icon} **${result.page}** (${result.url})\n`;
      if (result.issueCount) {
        report += `   - Problemy: ${result.issueCount}\n`;
      }
      if (result.error) {
        report += `   - Błąd: ${result.error}\n`;
      }
    }
    report += '\n';
  }

  // Detailed issues
  if (allIssues.length > 0) {
    report += `## 🚨 Znalezione Problemy\n\n`;
    for (const pageIssues of allIssues) {
      report += `### ${pageIssues.page}\n`;
      report += `**URL:** \`${pageIssues.url}\`\n\n`;
      for (const issue of pageIssues.issues) {
        report += `- ⚠️ ${issue}\n`;
      }
      report += '\n';
    }
  } else {
    report += `## ✅ Brak znalezionych problemów\n`;
    report += `Wszystkie strony przeszły kontrolę QA bez uwag.\n`;
  }

  report += `\n---\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Test Type: Comprehensive Visual QA with Puppeteer\n`;

  fs.writeFileSync('./qa-reports/QA-COMPREHENSIVE-20260428.md', report);
}

runComprehensiveAudit().catch(console.error);
