const { Builder }  = require('selenium-webdriver');
const chrome       = require('selenium-webdriver/chrome');
require('chromedriver');

let driver = null;

/**
 * Luncurkan Chrome.
 * Default: browser TERLIHAT (tidak headless) agar UI dapat dipantau saat test berjalan.
 * Set opts.headless = true untuk mode tanpa tampilan (CI/CD).
 */
async function launchBrowser(opts = {}) {
  const { headless = false } = opts;

  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-setuid-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,720');

  if (headless) {
    options.addArguments('--headless=new');
  }

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().window().setRect({ width: 1280, height: 720 });
  await driver.manage().setTimeouts({ implicit: 3000, pageLoad: 30000, script: 10000 });

  console.log(`[browser] Chrome diluncurkan${headless ? ' (headless)' : ' (visible — UI dapat dilihat)'}`);
  return driver;
}

function getDriver() {
  return driver;
}

async function closeBrowser() {
  if (driver) {
    await driver.quit();
    driver = null;
    console.log('[browser] Browser ditutup');
  }
}

module.exports = { launchBrowser, getDriver, closeBrowser };
