const { expect }         = require('chai');
const fs                  = require('fs');
const { launchBrowser, newPage, closeBrowser } = require('../helpers/browser');
const { takeAndCompare }  = require('../helpers/visualRegression');
const PortalPage          = require('../pageobject/PortalPage');
const { navigateToPortal, submitTicket, getTicketCount } = require('../actions/portalActions');

describe('Portal User', function () {
  this.timeout(30000);

  let page;
  let portalPage;

  before(async function () {
    await launchBrowser();
    page       = await newPage();
    portalPage = new PortalPage(page);
    await navigateToPortal(page);
  });

  after(async function () {
    await closeBrowser();
  });

  beforeEach(async function () {
    await navigateToPortal(page);
  });

  // ─── Tampilan & Navigasi ──────────────────────────────────────────────────

  it('halaman portal dapat diakses di URL root (/)', async function () {
    expect(page.url()).to.match(/localhost:3000\/?$/);
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
    const result = await takeAndCompare(page, 'portal-user-full');
    attachScreenshot('Portal User', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Form Submit Tiket ────────────────────────────────────────────────────

  it('menampilkan form laporan dengan semua field yang dibutuhkan', async function () {
    const nameInput    = await page.$('input[placeholder="Masukkan nama lengkap Anda"]');
    const titleInput   = await page.$('input[placeholder="Deskripsikan masalah secara singkat"]');
    const selects      = await page.$$('form select');
    const submitButton = await page.$('button[type="submit"]');

    expect(nameInput,    'Field nama tidak ditemukan').to.not.be.null;
    expect(titleInput,   'Field judul tidak ditemukan').to.not.be.null;
    expect(selects.length).to.be.at.least(2, 'Dropdown kategori/prioritas tidak ditemukan');
    expect(submitButton, 'Tombol kirim tidak ditemukan').to.not.be.null;
  });

  it('[visual] tampilan form laporan tiket (scroll ke form)', async function () {
    const result = await takeAndCompare(page, 'portal-form-section');
    attachScreenshot('Form Laporan', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  it('submit tiket berhasil menampilkan pesan sukses', async function () {
    await submitTicket(page, {
      name:     'QA Tester',
      title:    'Test Submit Otomatis dari Automation QA',
      category: 'Software',
      priority: 'Low',
    });
    const isSuccess = await portalPage.isSuccessMessageVisible();
    expect(isSuccess, 'Pesan sukses tidak tampil setelah submit').to.be.true;
  });

  it('[visual] tampilan pesan sukses setelah tiket dikirim', async function () {
    await submitTicket(page, {
      name:     'QA Tester Visual',
      title:    'Test Visual Regression Submit',
      category: 'Hardware',
      priority: 'Medium',
    });
    await portalPage.isSuccessMessageVisible();
    const result = await takeAndCompare(page, 'portal-submit-success');
    attachScreenshot('Pesan Sukses Submit', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Daftar Tiket (Read-Only) ─────────────────────────────────────────────

  it('daftar tiket menampilkan minimal 1 baris setelah ada tiket', async function () {
    await navigateToPortal(page);
    const count = await getTicketCount(page);
    expect(count).to.be.above(0, 'Tidak ada tiket tampil di portal user');
  });

  it('daftar tiket tidak memiliki tombol Edit atau Hapus (read-only)', async function () {
    const hasActionBtns = await portalPage.hasEditOrDeleteButtons();
    expect(hasActionBtns, 'Tombol edit/hapus tidak seharusnya ada di portal user').to.be.false;
  });

  it('[visual] tampilan daftar status tiket (tabel read-only)', async function () {
    await navigateToPortal(page);
    const result = await takeAndCompare(page, 'portal-ticket-list');
    attachScreenshot('Daftar Tiket Portal', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Responsif Mobile ─────────────────────────────────────────────────────

  it('[visual] tampilan portal user pada resolusi mobile (375x812)', async function () {
    await page.setViewport({ width: 375, height: 812 });
    await navigateToPortal(page);
    const result = await takeAndCompare(page, 'portal-mobile-375');
    attachScreenshot('Portal Mobile View', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    // Kembalikan ke desktop
    await page.setViewport({ width: 1280, height: 720 });
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
