const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'qa-reports', 'final-crawl');
const DESKTOP_DIR = path.join(REPORT_DIR, 'screenshots', 'desktop');
const MOBILE_DIR = path.join(REPORT_DIR, 'screenshots', 'mobile');
const HTML_DIR = path.join(REPORT_DIR, 'html');
const MANIFEST_PATH = path.join(REPORT_DIR, 'manifest.json');
const RESULTS_PATH = path.join(REPORT_DIR, 'results.json');
const REPORT_PATH = path.join(REPORT_DIR, 'report.md');
const BASE_URL = (process.env.FINAL_CRAWL_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function safeName(route) {
  if (route === '/') {
    return 'home';
  }

  return route
    .replace(/^\//, '')
    .replace(/[\/?#=&]+/g, '__')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 160);
}

async function fetchHttp(route) {
  const url = new URL(route, BASE_URL).toString();
  const response = await fetch(url, { redirect: 'follow' });
  const body = await response.text();
  const headers = {};

  for (const [key, value] of response.headers.entries()) {
    headers[key] = value;
  }

  return {
    status: response.status,
    finalUrl: response.url,
    headers,
    body,
  };
}

async function resolveBrowserExecutablePath() {
  const localAppData = process.env.LOCALAPPDATA;
  const candidates = [];

  if (localAppData) {
    const msPlaywrightRoot = path.join(localAppData, 'ms-playwright');

    if (fs.existsSync(msPlaywrightRoot)) {
      const entries = fs.readdirSync(msPlaywrightRoot, { withFileTypes: true });
      const headlessShellDirs = entries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('chromium_headless_shell-'))
        .map((entry) => entry.name)
        .sort((left, right) => right.localeCompare(left, 'en', { numeric: true }));
      const chromiumDirs = entries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('chromium-'))
        .map((entry) => entry.name)
        .sort((left, right) => right.localeCompare(left, 'en', { numeric: true }));

      for (const versionDir of headlessShellDirs) {
        candidates.push(
          path.join(msPlaywrightRoot, versionDir, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'),
          path.join(msPlaywrightRoot, versionDir, 'chrome-headless-shell-win', 'chrome-headless-shell.exe'),
        );
      }

      for (const versionDir of chromiumDirs) {
        candidates.push(
          path.join(msPlaywrightRoot, versionDir, 'chrome-win64', 'chrome.exe'),
          path.join(msPlaywrightRoot, versionDir, 'chrome-win', 'chrome.exe'),
        );
      }
    }
  }

  candidates.push(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  );

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Nie znaleziono lokalnej przegladarki Chromium (Playwright, Chrome lub Edge).');
}

function extractMeta(html, tagName, attrName, attrValue) {
  const regex = new RegExp(
    `<${tagName}[^>]*${attrName}=["']${attrValue}["'][^>]*content=["']([^"']+)["']`,
    'i',
  );
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function summarizeVisibleLinks(links) {
  return links
    .filter((item) => item && item.href)
    .slice(0, 20)
    .map((item) => ({
      text: item.text,
      href: item.href,
    }));
}

function classifyIssues(page) {
  const findings = [];
  const textBlob = [
    page.title,
    page.h1,
    page.ctas.map((item) => item.text).join(' '),
    page.visibleLinks.map((item) => item.text).join(' '),
    page.desktopBodyText,
    page.mobileBodyText,
  ].join(' ');

  if (page.http.status >= 500) {
    findings.push({ severity: 'BLOCKER', message: `HTTP ${page.http.status}` });
  } else if (page.http.status >= 400) {
    findings.push({ severity: 'HIGH', message: `HTTP ${page.http.status}` });
  }

  if (!page.title) {
    findings.push({ severity: 'HIGH', message: 'Brak title' });
  }

  if (!page.h1) {
    findings.push({ severity: 'HIGH', message: 'Brak H1' });
  }

  if (!page.canonical) {
    findings.push({ severity: 'HIGH', message: 'Brak canonical' });
  }

  if (page.desktopErrors.length > 0 || page.mobileErrors.length > 0) {
    findings.push({ severity: 'HIGH', message: 'Błędy runtime lub console na stronie' });
  }

  if (!cleanText(page.desktopBodyText) || !cleanText(page.mobileBodyText)) {
    findings.push({ severity: 'HIGH', message: 'Pusta lub prawie pusta treść strony po renderze' });
  }

  if (/ďż˝|Ă˘â‚¬|Ă|Ă„â€¦|Äąâ€š|Ă„â„˘|Äąâ€ş|ÄąĹş|ÄąÂĽ/.test(textBlob)) {
    findings.push({ severity: 'HIGH', message: 'Podejrzenie problemów encodingu w widocznym tekście' });
  }

  if (/512 992 026|\+48/.test(textBlob)) {
    findings.push({ severity: 'BLOCKER', message: 'Wykryto publiczny telefon w widocznym tekście' });
  }

  if (/15 min(?! audio)|15 minut/i.test(textBlob) && !/Kwadrans z behawiorystą/i.test(textBlob)) {
    findings.push({ severity: 'HIGH', message: 'Stare nazewnictwo 15 min bez dominującego Kwadransa z behawiorystą' });
  }

  if (/proof|testimonial|weryfikacj|źródł|punkty weryfikacji/i.test(textBlob)) {
    findings.push({ severity: 'MEDIUM', message: 'Pozostałość meta-języka trust lub review' });
  }

  if (page.desktopOverflow || page.mobileOverflow) {
    findings.push({ severity: 'MEDIUM', message: 'Możliwy overflow layoutu na desktopie lub mobile' });
  }

  return findings;
}

function toMarkdown(results, summary) {
  const lines = [];
  lines.push('# Final Crawl Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Crawl Summary');
  lines.push('');
  lines.push(`- URLs detected: ${summary.detected}`);
  lines.push(`- URLs checked: ${summary.checked}`);
  lines.push(`- 200: ${summary.ok200}`);
  lines.push(`- 404: ${summary.notFound}`);
  lines.push(`- redirects: ${summary.redirects}`);
  lines.push(`- partial crawl: ${summary.partial ? 'yes' : 'no'}`);
  lines.push('');
  lines.push('## Findings');
  lines.push('');

  const grouped = { BLOCKER: [], HIGH: [], MEDIUM: [], LOW: [] };
  for (const result of results) {
    for (const finding of result.findings) {
      grouped[finding.severity].push(`${result.route}: ${finding.message}`);
    }
  }

  for (const severity of ['BLOCKER', 'HIGH', 'MEDIUM', 'LOW']) {
    lines.push(`### ${severity}`);
    lines.push('');
    if (grouped[severity].length === 0) {
      lines.push('- none');
    } else {
      for (const item of grouped[severity]) {
        lines.push(`- ${item}`);
      }
    }
    lines.push('');
  }

  lines.push('## Page By Page');
  lines.push('');
  for (const result of results) {
    lines.push(`### ${result.route}`);
    lines.push('');
    lines.push(`- status: ${result.http.status}`);
    lines.push(`- final URL: ${result.browser.finalUrl}`);
    lines.push(`- title: ${result.title || 'brak'}`);
    lines.push(`- h1: ${result.h1 || 'brak'}`);
    lines.push(`- canonical: ${result.canonical || 'brak'}`);
    lines.push(`- desktop screenshot: ${path.relative(ROOT, result.desktopScreenshot)}`);
    lines.push(`- mobile screenshot: ${path.relative(ROOT, result.mobileScreenshot)}`);
    lines.push(`- html snapshot: ${path.relative(ROOT, result.htmlPath)}`);
    lines.push(
      `- findings: ${
        result.findings.length > 0
          ? result.findings.map((item) => `[${item.severity}] ${item.message}`).join('; ')
          : 'none'
      }`,
    );
    lines.push(`- CTA sample: ${result.ctas.slice(0, 5).map((item) => item.text).join(' | ') || 'brak'}`);
    lines.push(
      `- internal links sample: ${
        result.visibleLinks.slice(0, 8).map((item) => item.href).join(' | ') || 'brak'
      }`,
    );
    lines.push(`- desktop errors: ${result.desktopErrors.slice(0, 3).join(' | ') || 'brak'}`);
    lines.push(`- mobile errors: ${result.mobileErrors.slice(0, 3).join(' | ') || 'brak'}`);
    lines.push(`- overflow: ${result.desktopOverflow || result.mobileOverflow ? 'yes' : 'no'}`);
    lines.push('');
  }

  return lines.join('\n');
}

async function browserCollect(context, route, mode) {
  const url = new URL(route, BASE_URL).toString();
  const screenshotDir = mode === 'desktop' ? DESKTOP_DIR : MOBILE_DIR;
  const screenshotPath = path.join(screenshotDir, `${safeName(route)}.png`);
  const htmlPath = path.join(HTML_DIR, `${safeName(route)}--${mode}.html`);
  const page = await context.newPage();
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(cleanText(message.text()));
    }
  });

  page.on('pageerror', (error) => {
    errors.push(cleanText(error.stack || error.message || String(error)));
  });

  let response = null;
  try {
    response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const finalUrl = page.url();
    const title = await page.title();
    const pageHtml = await page.content();
    const payload = await page.evaluate(() => {
      const text = (node) => (node && node.innerText ? node.innerText.replace(/\s+/g, ' ').trim() : '');
      const h1 = document.querySelector('h1');
      const ctas = Array.from(document.querySelectorAll('a,button,input[type="submit"]'))
        .map((el) => ({
          text: text(el),
          href: el instanceof HTMLAnchorElement ? el.href : null,
        }))
        .filter((item) => item.text)
        .slice(0, 25);
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map((el) => ({
          text: text(el),
          href: el.href,
        }))
        .filter((item) => item.href && item.text)
        .slice(0, 50);
      return {
        h1: text(h1),
        ctas,
        links,
        bodyText: text(document.body),
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      };
    });

    await page.screenshot({ path: screenshotPath, fullPage: true });
    fs.writeFileSync(htmlPath, pageHtml, 'utf8');

    return {
      requestedUrl: url,
      finalUrl,
      title,
      status: response ? response.status() : null,
      screenshotPath,
      htmlPath,
      payload,
      errors,
    };
  } catch (error) {
    errors.push(cleanText(error && error.stack ? error.stack : error));
    const fallbackHtml = await page.content().catch(() => '');
    if (fallbackHtml) {
      fs.writeFileSync(htmlPath, fallbackHtml, 'utf8');
    }
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

    return {
      requestedUrl: url,
      finalUrl: page.url() || url,
      title: await page.title().catch(() => ''),
      status: response ? response.status() : null,
      screenshotPath,
      htmlPath,
      payload: {
        h1: '',
        ctas: [],
        links: [],
        bodyText: '',
        hasOverflow: false,
      },
      errors,
    };
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  ensureDir(REPORT_DIR);
  ensureDir(DESKTOP_DIR);
  ensureDir(MOBILE_DIR);
  ensureDir(HTML_DIR);

  const manifest = readJson(MANIFEST_PATH);
  const routes = manifest.urls.map((item) => item.route);
  const results = [];
  const executablePath = await resolveBrowserExecutablePath();
  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 2200 },
    deviceScaleFactor: 1,
  });
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 1600 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });

  try {
    for (const route of routes) {
      const http = await fetchHttp(route);
      const desktop = await browserCollect(desktopContext, route, 'desktop');
      const mobile = await browserCollect(mobileContext, route, 'mobile');
      const canonical = extractCanonical(http.body);
      const metaDescription = extractMeta(http.body, 'meta', 'name', 'description');
      const ogTitle = extractMeta(http.body, 'meta', 'property', 'og:title');
      const twitterCard = extractMeta(http.body, 'meta', 'name', 'twitter:card');

      const merged = {
        route,
        http: {
          status: http.status,
          finalUrl: http.finalUrl,
          headers: http.headers,
        },
        browser: {
          finalUrl: desktop.finalUrl,
          mobileFinalUrl: mobile.finalUrl,
        },
        title: desktop.title,
        h1: desktop.payload.h1,
        ctas: desktop.payload.ctas,
        visibleLinks: summarizeVisibleLinks(desktop.payload.links),
        canonical,
        metaDescription,
        ogTitle,
        twitterCard,
        desktopScreenshot: desktop.screenshotPath,
        mobileScreenshot: mobile.screenshotPath,
        htmlPath: desktop.htmlPath,
        desktopErrors: desktop.errors,
        mobileErrors: mobile.errors,
        desktopOverflow: desktop.payload.hasOverflow,
        mobileOverflow: mobile.payload.hasOverflow,
        desktopBodyText: desktop.payload.bodyText,
        mobileBodyText: mobile.payload.bodyText,
      };

      merged.findings = classifyIssues(merged);
      results.push(merged);
      fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
    }

    const summary = {
      detected: routes.length,
      checked: results.length,
      ok200: results.filter((item) => item.http.status === 200).length,
      notFound: results.filter((item) => item.http.status === 404).length,
      redirects: results.filter((item) => item.http.finalUrl !== new URL(item.route, BASE_URL).toString()).length,
      partial: false,
    };

    fs.writeFileSync(RESULTS_PATH, JSON.stringify({ summary, results }, null, 2));
    fs.writeFileSync(REPORT_PATH, toMarkdown(results, summary), 'utf8');
  } finally {
    await desktopContext.close().catch(() => {});
    await mobileContext.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
