const { expect }  = require('chai');
const fs          = require('fs');
const path        = require('path');
const { By }      = require('selenium-webdriver');
const { launchBrowser, closeBrowser } = require('../helpers/browser');
const { takeAndCompare }              = require('../helpers/visualRegression');
const PortalPage                      = require('../pageobject/PortalPage');
const { navigateToPortal, submitTicket, getTicketCount } = require('../actions/portalActions');

describe('Portal User', function () {
  this.timeout(40000);

  let driver;
  let portalPage;

  before(async function () {
    console.log('\n[suite] Portal User — memulai browser...');
    driver     = await launchBrowser();
    portalPage = new PortalPage(driver);
    await navigateToPortal(driver);
  });

  after(async function () {
    console.log('[suite] Portal User — menutup browser');
    await closeBrowser();
  });

  beforeEach(async function () {
    console.log(`\n  ▶ MULAI: "${this.currentTest?.title}"`);
    await navigateToPortal(driver);
  });

  afterEach(async function () {
    const state  = this.currentTest?.state ?? 'unknown';
    const passed = state === 'passed';
    console.log(`  ${passed ? '✓ LULUS' : '✗ GAGAL'}: "${this.currentTest?.title}" [${state.toUpperCase()}]`);

    if (!passed) {
      try {
        const buf   = Buffer.from(await driver.takeScreenshot(), 'base64');
        const dir   = path.join(__dirname, '..', 'screenshots', 'failures');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fname = `portal-${Date.now()}.png`;
        fs.writeFileSync(path.join(dir, fname), buf);
        console.log(`  📷 Screenshot kegagalan: screenshots/failures/${fname}`);
      } catch { /* ignore */ }
    }
  });

  // ─── Tampilan & Navigasi ──────────────────────────────────────────────────

  it('halaman portal dapat diakses di URL root (/)', async function () {
    const url = await driver.getCurrentUrl();
    console.log(`    URL saat ini: ${url}`);
    expect(url).to.match(/localhost:3000\/?$/);
  });

  it('navbar menampilkan judul dashboard', async function () {
    const title = await portalPage.getNavbarTitle();
    expect(title).to.include('Dashboard Tiket IT Internal');
  });

  it('navbar menampilkan tombol "Login Admin"', async function () {
    const isVisible = await portalPage.isLoginAdminButtonVisible();
    expect(isVisible, 'Tombol Login Admin tidak ditemukan di navbar').to.be.true;
  });

  it('[visual] tampilan halaman portal user (full page)', async function () {
    console.log('    Mengambil screenshot portal user...');
    const result = await takeAndCompare(driver, 'portal-user-full');
    attachScreenshot('Portal User', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Form Submit Tiket ────────────────────────────────────────────────────

  it('menampilkan form laporan dengan semua field yang dibutuhkan', async function () {
    const nameInput  = await driver.findElements(By.css('input[placeholder="Masukkan nama lengkap Anda"]'));
    const titleInput = await driver.findElements(By.css('input[placeholder="Deskripsikan masalah secara singkat"]'));
    const selects    = await driver.findElements(By.css('form select'));
    const submitBtn  = await driver.findElements(By.css('button[type="submit"]'));
    console.log(`    nama: ${nameInput.length}, judul: ${titleInput.length}, select: ${selects.length}, submit: ${submitBtn.length}`);
    expect(nameInput.length,  'Field nama tidak ditemukan').to.be.above(0);
    expect(titleInput.length, 'Field judul tidak ditemukan').to.be.above(0);
    expect(selects.length).to.be.at.least(2, 'Dropdown kategori/prioritas tidak ditemukan');
    expect(submitBtn.length,  'Tombol kirim tidak ditemukan').to.be.above(0);
  });

  it('[visual] tampilan form laporan tiket', async function () {
    const result = await takeAndCompare(driver, 'portal-form-section');
    attachScreenshot('Form Laporan', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  it('submit tiket berhasil menampilkan pesan sukses', async function () {
    console.log('    Mengisi dan mengirim form tiket...');
    await submitTicket(driver, {
      name:     'QA Tester',
      title:    'Test Submit Otomatis dari Automation QA',
      category: 'Software',
      priority: 'Low',
    });
    const isSuccess = await portalPage.isSuccessMessageVisible();
    expect(isSuccess, 'Pesan sukses tidak tampil setelah submit').to.be.true;
  });

  it('[visual] tampilan pesan sukses setelah tiket dikirim', async function () {
    await submitTicket(driver, {
      name:     'QA Visual',
      title:    'Test Visual Regression Submit Portal',
      category: 'Hardware',
      priority: 'Medium',
    });
    await portalPage.isSuccessMessageVisible();
    const result = await takeAndCompare(driver, 'portal-submit-success');
    attachScreenshot('Pesan Sukses', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Daftar Tiket (Read-Only) ─────────────────────────────────────────────

  it('daftar tiket menampilkan minimal 1 baris', async function () {
    const count = await getTicketCount(driver);
    console.log(`    Jumlah tiket di portal: ${count}`);
    expect(count).to.be.above(0, 'Tidak ada tiket di portal user');
  });

  it('daftar tiket tidak memiliki tombol Edit atau Hapus (read-only)', async function () {
    const hasActionBtns = await portalPage.hasEditOrDeleteButtons();
    console.log(`    Ada tombol edit/hapus: ${hasActionBtns}`);
    expect(hasActionBtns, 'Tombol edit/hapus tidak boleh ada di portal user').to.be.false;
  });

  it('[visual] tampilan daftar status tiket (tabel read-only)', async function () {
    const result = await takeAndCompare(driver, 'portal-ticket-list');
    attachScreenshot('Daftar Tiket Portal', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Responsif Mobile ─────────────────────────────────────────────────────

  it('[visual] tampilan portal user pada resolusi mobile (375x812)', async function () {
    console.log('    Set viewport ke 375x812 (mobile)...');
    await driver.manage().window().setRect({ width: 375, height: 812 });
    await navigateToPortal(driver);
    const result = await takeAndCompare(driver, 'portal-mobile-375');
    attachScreenshot('Portal Mobile', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    console.log('    Kembalikan viewport ke 1280x720...');
    await driver.manage().window().setRect({ width: 1280, height: 720 });
  });
});

function attachScreenshot(name, filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      // eslint-disable-next-line no-undef
      allure.attachment(name, fs.readFileSync(filePath), 'image/png');
    }
  } catch { /* allure tidak aktif, skip */ }
}
