const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const BASELINE_DIR = path.join(SCREENSHOTS_DIR, 'baseline');
const ACTUAL_DIR   = path.join(SCREENSHOTS_DIR, 'actual');
const DIFF_DIR     = path.join(SCREENSHOTS_DIR, 'diff');

function ensureDirs() {
  for (const dir of [BASELINE_DIR, ACTUAL_DIR, DIFF_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Ambil screenshot halaman, bandingkan dengan baseline.
 * Jika baseline belum ada, simpan screenshot sebagai baseline baru.
 *
 * @param {import('puppeteer').Page} page
 * @param {string} name   - Nama unik untuk screenshot (tanpa ekstensi)
 * @param {object} opts
 * @param {number} opts.threshold - Sensitivitas piksel (0-1), default 0.1
 * @param {boolean} opts.fullPage - Screenshot full page, default true
 * @returns {{ isNewBaseline, diffPixels, diffPercent, actualPath, baselinePath, diffPath }}
 */
async function takeAndCompare(page, name, opts = {}) {
  const { threshold = 0.1, fullPage = true } = opts;
  ensureDirs();

  const actualPath   = path.join(ACTUAL_DIR,   `${name}.png`);
  const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
  const diffPath     = path.join(DIFF_DIR,     `${name}-diff.png`);

  await page.screenshot({ path: actualPath, fullPage });

  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    return { isNewBaseline: true, diffPixels: 0, diffPercent: 0, actualPath, baselinePath, diffPath: null };
  }

  const imgBaseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const imgActual   = PNG.sync.read(fs.readFileSync(actualPath));
  const { width, height } = imgBaseline;
  const diff = new PNG({ width, height });

  const diffPixels = pixelmatch(
    imgBaseline.data, imgActual.data, diff.data,
    width, height,
    { threshold }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const diffPercent = parseFloat(((diffPixels / (width * height)) * 100).toFixed(2));

  return { isNewBaseline: false, diffPixels, diffPercent, actualPath, baselinePath, diffPath };
}

module.exports = { takeAndCompare };
