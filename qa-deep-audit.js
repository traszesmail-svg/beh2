const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:4001';
const SCREENSHOTS_DIR = './qa-screenshots-deep';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Read blog and materialy URLs
const blogUrls = fs.readFileSync('./tmp-qa/blog-urls.txt', 'utf8').split('\n').filter(Boolean);
const materialyUrls = fs.readFileSync('./tmp-qa/materialy-urls.txt', 'utf8').split('\n').filter(Boolean);

// All pages to test
const PAGES_TO_TEST = [
  // Main public pages
  { url: '/', name: 'Home', category: 'Main' },
  { url: '/psy', name: 'Psy-Kategoria', category: 'Dogs' },
  { url: '/psy/reaktywnosc-na-smyczy', name: 'Psy-Reaktywnosc', category: 'Dogs' },
  { url: '/psy/lek-separacyjny', name: 'Psy-Separacja', category: 'Dogs' },
  { url: '/koty', name: 'Koty-Kategoria', category: 'Cats' },
  { url: '/koty/zalatwianie-poza-kuweta', name: 'Koty-Kuweta', category: 'Cats' },
  { url: '/koty/konflikt-miedzy-kotami', name: 'Koty-Konflikt', category: 'Cats' },
  { url: '/o-mnie', name: 'O-mnie', category: 'Info' },
  { url: '/cennik', name: 'Cennik', category: 'Info' },
  { url: '/faq', name: 'FAQ', category: 'Info' },
  { url: '/blog', name: 'Blog-Listing', category: 'Content' },
  { url: '/niezbednik', name: 'Niezbednik', category: 'Content' },
  { url: '/kontakt', name: 'Kontakt', category: 'Forms' },
  { url: '/book', name: 'Rezerwacja', category: 'Forms' },
  { url: '/jak-sie-przygotowac', name: 'Jak-przygotowac', category: 'Info' },
  { url: '/przybornik', name: 'Przybornik', category: 'Content' },
  { url: '/opinie', name: 'Opinie', category: 'Info' },
  { url: '/metodyka', name: 'Metodyka', category: 'Info' },
  { url: '/oferta', name: 'Oferta', category: 'Info' },
  { url: '/konsultacja-behawioralna-online', name: 'Konsultacja-online', category: 'Service' },
  { url: '/behawiorysta-online-polska', name: 'Behawiorysta-online', category: 'Service' },
  { url: '/polityka-prywatnosci', name: 'Polityka', category: 'Legal' },
  { url: '/regulamin', name: 'Regulamin', category: 'Legal' },
  { url: '/regulamin-pelna-konsultacja', name: 'Regulamin-pelna', category: 'Legal' },
  // Sample blog posts (first 3)
  ...blogUrls.slice(0, 3).map((url, i) => ({ url, name: `Blog-post-${i+1}`, category: 'Blog' })),
  // Sample materialy (first 3)
  ...materialyUrls.slice(0, 3).map((url, i) => ({ url, name: `Materialy-${i+1}`, category: 'Materialy' })),
];

async function runDeepAudit() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const allIssues = [];
  const consoleErrors = [];

  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔍 GŁĘBOKI AUDYT QA - ${PAGES_TO_TEST.length} STRON`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    for (const testPage of PAGES_TO_TEST) {
      console.log(`📄 ${testPage.name} (${testPage.url})`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      // Capture console errors
      const pageErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          pageErrors.push(msg.text().substring(0, 200));
        }
      });
      page.on('pageerror', err => {
        pageErrors.push('PAGE ERROR: ' + err.message.substring(0, 200));
      });
      page.on('requestfailed', req => {
        const failure = req.failure();
        if (failure && !req.url().includes('_next/data') && !req.url().includes('analytics')) {
          pageErrors.push(`FAILED REQUEST: ${req.url().substring(0, 80)} - ${failure.errorText}`);
        }
      });

      const issues = [];
      let httpStatus = 0;

      try {
        const response = await page.goto(`${BASE_URL}${testPage.url}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        httpStatus = response.status();

        if (httpStatus >= 400) {
          issues.push(`HTTP ${httpStatus}`);
        }

        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Take full page screenshot
        const screenshotName = testPage.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${screenshotName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Comprehensive checks
        const pageData = await page.evaluate(() => {
          const issues = [];

          // 1. METADATA
          const title = document.title;
          const h1 = document.querySelector('h1')?.textContent?.trim();
          const description = document.querySelector('meta[name="description"]')?.content;

          if (!title) issues.push('Brak <title>');
          if (title && title.length < 10) issues.push(`Tytuł za krótki (${title.length} znaków)`);
          if (title && title.length > 70) issues.push(`Tytuł za długi (${title.length} znaków)`);
          if (!h1) issues.push('Brak <h1>');
          if (!description) issues.push('Brak meta description');
          if (description && description.length < 50) issues.push(`Description za krótki (${description.length} znaków)`);
          if (description && description.length > 200) issues.push(`Description za długi (${description.length} znaków)`);

          // 2. IMAGES
          const images = document.querySelectorAll('img');
          let brokenImgs = 0;
          let imgsNoAlt = 0;
          images.forEach(img => {
            if (img.complete && img.naturalHeight === 0 && img.src && !img.src.startsWith('data:')) {
              brokenImgs++;
            }
            if (!img.alt && !img.getAttribute('aria-hidden')) {
              imgsNoAlt++;
            }
          });
          if (brokenImgs > 0) issues.push(`Zepsute obrazy: ${brokenImgs}`);
          if (imgsNoAlt > 0) issues.push(`Obrazy bez ALT: ${imgsNoAlt}`);

          // 3. LAYOUT - horizontal overflow
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          if (docW > winW + 5) {
            issues.push(`Horizontal overflow: ${docW}px > ${winW}px`);
          }

          // 4. CONTENT - empty or placeholder text
          const bodyText = document.body.innerText;
          if (bodyText.includes('TODO') || bodyText.includes('FIXME') || bodyText.includes('[object Object]')) {
            issues.push('Debug/placeholder text widoczny');
          }
          if (bodyText.includes('undefined') && !bodyText.includes('jest undefined')) {
            const undefCount = (bodyText.match(/undefined/g) || []).length;
            if (undefCount > 0) issues.push(`Tekst "undefined" widoczny ${undefCount}x`);
          }
          if (bodyText.includes('null') && bodyText.match(/\bnull\b/g)?.length > 2) {
            issues.push('Tekst "null" widoczny');
          }

          // 5. EMPTY HEADINGS
          const headings = document.querySelectorAll('h1, h2, h3, h4');
          let emptyHeadings = 0;
          headings.forEach(h => {
            if (!h.textContent.trim()) emptyHeadings++;
          });
          if (emptyHeadings > 0) issues.push(`Puste nagłówki: ${emptyHeadings}`);

          // 6. EMPTY LINKS
          const links = document.querySelectorAll('a[href]');
          let emptyLinks = 0;
          let badLinks = 0;
          links.forEach(a => {
            if (!a.textContent.trim() && !a.querySelector('img, svg')) emptyLinks++;
            if (a.href === window.location.href + '#' || a.getAttribute('href') === '#') badLinks++;
          });
          if (emptyLinks > 0) issues.push(`Puste linki: ${emptyLinks}`);
          if (badLinks > 3) issues.push(`Linki "#" (puste): ${badLinks}`);

          // 7. POLISH ENCODING
          const polishChars = bodyText.match(/[ąćęłńóśźż]/gi) || [];
          if (polishChars.length === 0 && bodyText.length > 200) {
            issues.push('Brak polskich znaków - możliwy problem z encoding');
          }

          // 8. BUTTONS without action
          const buttons = document.querySelectorAll('button');
          let badButtons = 0;
          buttons.forEach(b => {
            if (!b.textContent.trim() && !b.querySelector('img, svg')) badButtons++;
          });
          if (badButtons > 0) issues.push(`Puste buttony: ${badButtons}`);

          // 9. FORMS
          const forms = document.querySelectorAll('form');
          forms.forEach((form, idx) => {
            const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, select');
            inputs.forEach(input => {
              const id = input.id;
              if (id && !document.querySelector(`label[for="${id}"]`) && !input.getAttribute('aria-label')) {
                issues.push(`Pole "${id}" bez label/aria-label`);
              }
            });
          });

          // 10. CHECK FOR LOREM IPSUM
          if (bodyText.toLowerCase().includes('lorem ipsum')) {
            issues.push('Lorem ipsum - placeholder text!');
          }

          return {
            title: title.substring(0, 60),
            h1: h1?.substring(0, 60),
            description: description?.substring(0, 100),
            issues: issues,
            metrics: {
              images: images.length,
              brokenImages: brokenImgs,
              imagesNoAlt: imgsNoAlt,
              headings: headings.length,
              links: links.length,
              forms: forms.length,
              buttons: buttons.length
            }
          };
        });

        issues.push(...pageData.issues);

        // Add console errors
        if (pageErrors.length > 0) {
          issues.push(`Console/Page errors: ${pageErrors.length}`);
          consoleErrors.push({ page: testPage.name, errors: pageErrors });
        }

        const status = issues.length === 0 ? '✅' : '⚠️';
        console.log(`   ${status} HTTP ${httpStatus} | ${pageData.metrics.images} obrazów | ${issues.length} problemów`);

        if (issues.length > 0) {
          allIssues.push({
            page: testPage.name,
            url: testPage.url,
            category: testPage.category,
            httpStatus,
            metadata: {
              title: pageData.title,
              h1: pageData.h1,
              description: pageData.description
            },
            metrics: pageData.metrics,
            issues: issues
          });
        }

      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message.substring(0, 60)}`);
        allIssues.push({
          page: testPage.name,
          url: testPage.url,
          category: testPage.category,
          httpStatus: httpStatus,
          issues: [`Page load error: ${error.message.substring(0, 100)}`]
        });
      } finally {
        await page.close();
      }
    }

  } finally {
    await browser.close();
  }

  // Write report
  generateReport(allIssues, consoleErrors);
  console.log(`\n✅ Audit complete. Report: qa-reports/RAPORT-DEEP-AUDIT.md`);
}

function generateReport(allIssues, consoleErrors) {
  let report = `# 🔍 RAPORT GŁĘBOKIEGO AUDYTU QA - 2026-04-29\n\n`;
  report += `**Data:** ${new Date().toISOString()}\n`;
  report += `**Tester:** Claude Code (Opus 4.7)\n`;
  report += `**Testowanych stron:** ${PAGES_TO_TEST.length}\n`;
  report += `**Stron z problemami:** ${allIssues.length}\n`;
  report += `**Stron bez problemów:** ${PAGES_TO_TEST.length - allIssues.length}\n\n`;

  report += `## 📊 PODSUMOWANIE WG KATEGORII\n\n`;
  const categories = [...new Set(PAGES_TO_TEST.map(p => p.category))];
  categories.forEach(cat => {
    const total = PAGES_TO_TEST.filter(p => p.category === cat).length;
    const withIssues = allIssues.filter(i => i.category === cat).length;
    report += `- **${cat}**: ${withIssues}/${total} stron z problemami\n`;
  });

  if (allIssues.length > 0) {
    report += `\n## 🚨 SZCZEGÓŁY PROBLEMÓW\n\n`;

    // Group by category
    categories.forEach(cat => {
      const issuesInCat = allIssues.filter(i => i.category === cat);
      if (issuesInCat.length === 0) return;

      report += `### ${cat}\n\n`;

      issuesInCat.forEach(item => {
        report += `#### ${item.page} (\`${item.url}\`)\n\n`;
        report += `- **HTTP Status:** ${item.httpStatus}\n`;
        if (item.metadata) {
          report += `- **Title:** ${item.metadata.title || '(brak)'}\n`;
          report += `- **H1:** ${item.metadata.h1 || '(brak)'}\n`;
        }
        if (item.metrics) {
          report += `- **Metryki:** ${item.metrics.images} obrazów, ${item.metrics.links} linków, ${item.metrics.forms} formularzy\n`;
        }
        report += `- **Problemy (${item.issues.length}):**\n`;
        item.issues.forEach(issue => {
          report += `  - ⚠️ ${issue}\n`;
        });
        report += `\n`;
      });
    });
  } else {
    report += `\n## ✅ Brak problemów\n\nWszystkie strony są poprawne.\n`;
  }

  if (consoleErrors.length > 0) {
    report += `\n## 🐛 Console & Network Errors\n\n`;
    consoleErrors.forEach(c => {
      report += `### ${c.page}\n`;
      c.errors.slice(0, 5).forEach(e => {
        report += `- \`${e}\`\n`;
      });
      if (c.errors.length > 5) report += `- ...i ${c.errors.length - 5} więcej\n`;
      report += `\n`;
    });
  }

  report += `\n## 📸 Screenshoty\n\n`;
  report += `Wszystkie screeny w katalogu: \`qa-screenshots-deep/\`\n`;

  if (!fs.existsSync('qa-reports')) fs.mkdirSync('qa-reports');
  fs.writeFileSync('qa-reports/RAPORT-DEEP-AUDIT.md', report);
}

runDeepAudit().catch(console.error);
