const puppeteer = require('puppeteer');

let browser = null;

async function launchBrowser(options = {}) {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...options,
  });
  return browser;
}

async function newPage(viewport = { width: 1280, height: 720 }) {
  if (!browser) throw new Error('Browser belum diluncurkan. Panggil launchBrowser() terlebih dahulu.');
  const page = await browser.newPage();
  await page.setViewport(viewport);
  return page;
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

module.exports = { launchBrowser, newPage, closeBrowser };
