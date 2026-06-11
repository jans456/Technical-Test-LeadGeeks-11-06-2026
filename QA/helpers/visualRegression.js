const { PNG }    = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs         = require('fs');
const path       = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const BASELINE_DIR    = path.join(SCREENSHOTS_DIR, 'baseline');
const ACTUAL_DIR      = path.join(SCREENSHOTS_DIR, 'actual');
const DIFF_DIR        = path.join(SCREENSHOTS_DIR, 'diff');

function ensureDirs() {
  for (const dir of [BASELINE_DIR, ACTUAL_DIR, DIFF_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Ambil screenshot via Selenium, lalu bandingkan dengan baseline menggunakan Pixelmatch.
 * Jika baseline belum ada, simpan screenshot sebagai baseline baru.
 *
 * @param {import('selenium-webdriver').WebDriver} driver
 * @param {string} name - Nama unik screenshot (tanpa ekstensi)
 * @param {object} opts
 * @param {number} opts.threshold - Sensitivitas piksel (0–1), default 0.1
 * @returns {{ isNewBaseline, diffPixels, diffPercent, actualPath, baselinePath, diffPath }}
 */
async function takeAndCompare(driver, name, opts = {}) {
  const { threshold = 0.1 } = opts;
  ensureDirs();

  const actualPath   = path.join(ACTUAL_DIR,   `${name}.png`);
  const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
  const diffPath     = path.join(DIFF_DIR,     `${name}-diff.png`);

  // Selenium takeScreenshot mengembalikan base64
  const base64 = await driver.takeScreenshot();
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(actualPath, buffer);
  console.log(`    [screenshot] Disimpan: screenshots/actual/${name}.png`);

  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    console.log(`    [baseline]   Baseline baru dibuat: screenshots/baseline/${name}.png`);
    return { isNewBaseline: true, diffPixels: 0, diffPercent: 0, actualPath, baselinePath, diffPath: null };
  }

  const imgBaseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const imgActual   = PNG.sync.read(fs.readFileSync(actualPath));
  const { width, height } = imgBaseline;
  const diff        = new PNG({ width, height });

  const diffPixels  = pixelmatch(
    imgBaseline.data, imgActual.data, diff.data,
    width, height,
    { threshold }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const diffPercent = parseFloat(((diffPixels / (width * height)) * 100).toFixed(2));
  console.log(`    [pixelmatch] ${name}: ${diffPixels} piksel berbeda (${diffPercent}%)`);

  return { isNewBaseline: false, diffPixels, diffPercent, actualPath, baselinePath, diffPath };
}

module.exports = { takeAndCompare };
