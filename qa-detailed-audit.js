const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3002';
const REPORT_FILE = './qa-reports/qa-detailed-issues-20260428.md';

const PAGES_TO_TEST = [
  { url: '/', name: 'Home', viewport: { width: 1280, height: 720 } },
  { url: '/', name: 'Home Mobile', viewport: { width: 375, height: 812 } },
  { url: '/psy', name: 'Psy', viewport: { width: 1280, height: 720 } },
  { url: '/koty', name: 'Koty', viewport: { width: 1280, height: 720 } },
  { url: '/kontakt', name: 'Kontakt', viewport: { width: 1280, height: 720 } },
  { url: '/kontakt', name: 'Kontakt Mobile', viewport: { width: 375, height: 812 } },
  { url: '/cennik', name: 'Cennik', viewport: { width: 1280, height: 720 } },
  { url: '/blog', name: 'Blog', viewport: { width: 1280, height: 720 } },
  { url: '/niezbednik', name: 'Niezbędnik', viewport: { width: 1280, height: 720 } },
  { url: '/o-mnie', name: 'O mnie', viewport: { width: 1280, height: 720 } },
];

async function runDetailedAudit() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const allIssues = [];

  try {
    for (const testPage of PAGES_TO_TEST) {
      console.log(`🔍 Scanning: ${testPage.name} (${testPage.url})`);

      const page = await browser.newPage();
      await page.setViewport(testPage.viewport);

      try {
        await page.goto(`${BASE_URL}${testPage.url}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Detailed visual checks
        const issues = await performDetailedChecks(page, testPage);
        if (issues.length > 0) {
          allIssues.push({
            page: testPage.name,
            url: testPage.url,
            viewport: `${testPage.viewport.width}x${testPage.viewport.height}`,
            issues: issues
          });
        }

      } catch (error) {
        allIssues.push({
          page: testPage.name,
          url: testPage.url,
          viewport: `${testPage.viewport.width}x${testPage.viewport.height}`,
          issues: [`⚠️ Load error: ${error.message}`]
        });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  generateDetailedReport(allIssues);
  console.log(`\n✅ Detailed QA scan complete. Report: ${REPORT_FILE}`);
}

async function performDetailedChecks(page, testPage) {
  const issues = [];

  try {
    // 1. Check text overflow and truncation
    const textIssues = await page.evaluate(() => {
      const problems = [];
      const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, a, label, button');

      elements.forEach(el => {
        if (el.offsetWidth > 0) {
          const style = window.getComputedStyle(el);
          const overflow = style.overflow;
          const textOverflow = style.textOverflow;
          const whiteSpace = style.whiteSpace;

          // Check if text is being cut off
          if (el.scrollWidth > el.offsetWidth && textOverflow === 'ellipsis') {
            problems.push(`Text truncated: "${el.textContent.substring(0, 50)}..."`);
          }
        }
      });

      return problems;
    });
    issues.push(...textIssues);

    // 2. Check form elements
    if (testPage.url.includes('kontakt') || testPage.url.includes('book')) {
      const formIssues = await page.evaluate(() => {
        const problems = [];
        const inputs = document.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
          const style = window.getComputedStyle(input);
          const rect = input.getBoundingClientRect();

          // Check if input is properly sized
          if (rect.height < 40) {
            problems.push(`Input too small (${rect.height}px): ${input.name || input.placeholder}`);
          }

          // Check font size
          const fontSize = parseInt(style.fontSize);
          if (fontSize < 14) {
            problems.push(`Small font on input (${fontSize}px): ${input.name || input.placeholder}`);
          }

          // Check placeholder visibility
          if (input.placeholder && fontSize < 14) {
            problems.push(`Placeholder hard to read: "${input.placeholder}"`);
          }
        });

        return problems;
      });
      issues.push(...formIssues);
    }

    // 3. Check illustrations/images
    const imageIssues = await page.evaluate(() => {
      const problems = [];
      const images = document.querySelectorAll('img, svg');

      images.forEach(img => {
        const rect = img.getBoundingClientRect();

        if (img.tagName === 'IMG') {
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            problems.push(`Broken image: ${img.src || img.alt}`);
          }
          if (img.offsetHeight < 50 && img.src && img.src.includes('illustration')) {
            problems.push(`Illustration too small: ${img.alt || img.src}`);
          }
        }

        if (img.tagName === 'SVG') {
          const bbox = img.getBBox ? img.getBBox() : null;
          if (bbox && (bbox.width === 0 || bbox.height === 0)) {
            problems.push(`Empty SVG detected`);
          }
        }
      });

      return problems;
    });
    issues.push(...imageIssues);

    // 4. Check spacing and layout (grid issues)
    const layoutIssues = await page.evaluate(() => {
      const problems = [];
      const grids = document.querySelectorAll('[style*="grid"], [class*="grid"]');

      grids.forEach(grid => {
        const children = grid.children;
        if (children.length > 0) {
          const rect = grid.getBoundingClientRect();

          // Check if grid is wider than viewport
          if (rect.right > window.innerWidth) {
            problems.push(`Grid overflow detected (width: ${rect.width}px)`);
          }

          // Check for uneven spacing
          let prevBottom = 0;
          Array.from(children).forEach(child => {
            const childRect = child.getBoundingClientRect();
            if (childRect.height > 0) {
              const gap = childRect.top - prevBottom;
              prevBottom = childRect.bottom;
            }
          });
        }
      });

      return problems;
    });
    issues.push(...layoutIssues);

    // 5. Check responsive breakpoints
    const responsiveIssues = await page.evaluate(() => {
      const problems = [];
      const viewport = window.innerWidth;
      const elements = document.querySelectorAll('[class*="mobile"], [class*="desktop"], [style*="@media"]');

      // Check if critical elements are hidden inappropriately
      const hiddenCritical = document.querySelectorAll('[style*="display: none"], [class*="hidden"]');
      if (hiddenCritical.length > 5) {
        problems.push(`${hiddenCritical.length} elements are hidden on ${viewport}px viewport`);
      }

      return problems;
    });
    issues.push(...responsiveIssues);

    // 6. Check Polish characters and encoding
    const encodingIssues = await page.evaluate(() => {
      const problems = [];
      const text = document.body.innerText;

      // Look for mojibake patterns
      if (text.includes('?') && text.includes('Ã')) {
        problems.push('Possible encoding issue (mojibake detected)');
      }

      // Check for common Polish word patterns
      const polishWords = text.match(/[ąćęłńóśźż]/gi);
      if (!polishWords || polishWords.length < 5) {
        problems.push('⚠️ Very few Polish characters detected - check encoding');
      }

      return problems;
    });
    issues.push(...encodingIssues);

  } catch (error) {
    issues.push(`Check error: ${error.message}`);
  }

  return issues.filter(issue => issue && issue.trim().length > 0);
}

function generateDetailedReport(issues) {
  let report = `# Szczegółowy Raport QA - ${new Date().toISOString().split('T')[0]}\n\n`;

  const totalIssues = issues.reduce((sum, page) => sum + page.issues.length, 0);

  report += `## Podsumowanie\n`;
  report += `- Przeskanowanych testów: ${issues.length}\n`;
  report += `- Znalezionych problemów: ${totalIssues}\n`;
  report += `- Status: ${totalIssues === 0 ? '✅ BRAK PROBLEMÓW' : '⚠️ PROBLEMY ZNALEZIONE'}\n\n`;

  if (totalIssues > 0) {
    report += `## Problemy do naprawy\n\n`;

    for (const page of issues) {
      if (page.issues.length > 0) {
        report += `### ${page.page} (${page.url})\n`;
        report += `**Viewport:** ${page.viewport}\n\n`;
        for (const issue of page.issues) {
          report += `- ${issue}\n`;
        }
        report += '\n';
      }
    }
  } else {
    report += `## Status\n\n`;
    report += `✅ Wszystkie strony przeskanowane bez problemów.\n`;
  }

  fs.writeFileSync(REPORT_FILE, report);
}

runDetailedAudit().catch(console.error);
