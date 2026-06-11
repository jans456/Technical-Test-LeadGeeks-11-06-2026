const { expect }   = require('chai');
const fs           = require('fs');
const path         = require('path');
const { launchBrowser, closeBrowser } = require('../helpers/browser');
const { takeAndCompare }              = require('../helpers/visualRegression');
const AdminPage                       = require('../pageobject/AdminPage');
const { loginAsAdmin, logout }        = require('../actions/authActions');
const {
  openAddModal,
  fillTicketModal,
  submitModal,
  cancelModal,
  getTicketCount,
  updateStatus,
} = require('../actions/ticketActions');

describe('Dashboard Admin', function () {
  this.timeout(50000);

  let driver;
  let adminPage;

  before(async function () {
    console.log('\n[suite] Dashboard Admin — memulai browser dan login...');
    driver    = await launchBrowser();
    adminPage = new AdminPage(driver);
    await loginAsAdmin(driver);
  });

  after(async function () {
    console.log('[suite] Dashboard Admin — menutup browser');
    await closeBrowser();
  });

  beforeEach(async function () {
    console.log(`\n  ▶ MULAI: "${this.currentTest?.title}"`);
    await adminPage.navigate();
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
        const fname = `admin-${Date.now()}.png`;
        fs.writeFileSync(path.join(dir, fname), buf);
        console.log(`  📷 Screenshot kegagalan: screenshots/failures/${fname}`);
      } catch { /* ignore */ }
    }
  });

  // ─── Akses ────────────────────────────────────────────────────────────────

  it('halaman /admin dapat diakses setelah login', async function () {
    const url = await driver.getCurrentUrl();
    console.log(`    URL saat ini: ${url}`);
    expect(url).to.include('/admin');
  });

  // ─── Statistik ────────────────────────────────────────────────────────────

  it('menampilkan tepat 4 kartu statistik', async function () {
    const count = await adminPage.getStatsCardCount();
    expect(count).to.equal(4);
  });

  it('kartu statistik memiliki label yang benar', async function () {
    const stats  = await adminPage.getStatsValues();
    const labels = stats.map(s => s.label);
    console.log(`    Labels: ${JSON.stringify(labels)}`);
    expect(labels).to.include('Total Tiket');
    expect(labels).to.include('Tiket Terbuka');
    expect(labels).to.include('Sedang Dikerjakan');
    expect(labels).to.include('Prioritas Tinggi');
  });

  it('[visual] tampilan kartu statistik dashboard', async function () {
    console.log('    Mengambil screenshot stats cards...');
    const result = await takeAndCompare(driver, 'admin-stats-section');
    attachScreenshot('Stats Cards', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Tabel Tiket ──────────────────────────────────────────────────────────

  it('tabel tiket menampilkan data minimal 1 baris', async function () {
    const count = await adminPage.getTicketRowCount();
    console.log(`    Jumlah baris tiket: ${count}`);
    expect(count).to.be.above(0, 'Tabel tiket kosong — pastikan seeder dijalankan');
  });

  it('[visual] tampilan halaman dashboard admin (full)', async function () {
    console.log('    Mengambil screenshot dashboard penuh...');
    const result = await takeAndCompare(driver, 'admin-dashboard-full');
    attachScreenshot('Dashboard Admin', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Tambah Tiket ─────────────────────────────────────────────────────────

  it('tombol "+ Tambah Tiket" membuka modal form', async function () {
    console.log('    Klik tombol tambah tiket...');
    await openAddModal(driver);
    const isOpen = await adminPage.isModalOpen();
    expect(isOpen, 'Modal tidak terbuka setelah klik tombol tambah').to.be.true;
    await cancelModal(driver);
  });

  it('modal tambah tiket menampilkan judul "Tambah Tiket"', async function () {
    await openAddModal(driver);
    const title = await adminPage.getModalTitle();
    console.log(`    Judul modal: "${title}"`);
    expect(title).to.equal('Tambah Tiket');
    await cancelModal(driver);
  });

  it('[visual] tampilan modal tambah tiket', async function () {
    await openAddModal(driver);
    const result = await takeAndCompare(driver, 'admin-modal-tambah-tiket');
    attachScreenshot('Modal Tambah Tiket', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    await cancelModal(driver);
  });

  it('tambah tiket baru berhasil dan jumlah baris bertambah', async function () {
    const countBefore = await getTicketCount(driver);
    console.log(`    Jumlah tiket sebelum: ${countBefore}`);
    await openAddModal(driver);
    await fillTicketModal(driver, {
      title:          'Test Tambah Tiket QA Automation',
      category:       'Software',
      priority:       'Medium',
      status:         'Open',
      assignedPerson: 'Tim QA',
    });
    await submitModal(driver);
    await adminPage.navigate();
    const countAfter = await getTicketCount(driver);
    console.log(`    Jumlah tiket sesudah: ${countAfter}`);
    expect(countAfter).to.equal(countBefore + 1);
  });

  // ─── Update Status Inline ─────────────────────────────────────────────────

  it('dropdown status inline mengubah nilai status tiket', async function () {
    console.log('    Mengubah status baris pertama ke "In Progress"...');
    await updateStatus(driver, 0, 'In Progress');
    const value = await adminPage.getStatusDropdownValue(0);
    console.log(`    Nilai dropdown setelah update: "${value}"`);
    expect(value).to.equal('In Progress');
  });

  it('[visual] tampilan tabel setelah update status inline', async function () {
    const result = await takeAndCompare(driver, 'admin-table-after-status-update');
    attachScreenshot('Tabel Setelah Update Status', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Edit Tiket ───────────────────────────────────────────────────────────

  it('tombol Edit membuka modal dengan judul "Edit Tiket"', async function () {
    console.log('    Klik tombol Edit pada baris pertama...');
    await adminPage.clickEdit(0);
    const isOpen = await adminPage.isModalOpen();
    const title  = await adminPage.getModalTitle();
    console.log(`    Modal terbuka: ${isOpen}, judul: "${title}"`);
    expect(isOpen).to.be.true;
    expect(title).to.equal('Edit Tiket');
    await cancelModal(driver);
  });

  it('[visual] tampilan modal edit tiket', async function () {
    await adminPage.clickEdit(0);
    await adminPage.getModalTitle();
    const result = await takeAndCompare(driver, 'admin-modal-edit-tiket');
    attachScreenshot('Modal Edit Tiket', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    await cancelModal(driver);
  });

  // ─── Hapus Tiket ──────────────────────────────────────────────────────────

  it('tombol Hapus membuka dialog konfirmasi', async function () {
    console.log('    Klik tombol Hapus pada baris pertama...');
    await adminPage.clickDelete(0);
    const isOpen = await adminPage.isModalOpen();
    const title  = await adminPage.getModalTitle();
    console.log(`    Dialog terbuka: ${isOpen}, judul: "${title}"`);
    expect(isOpen, 'Dialog konfirmasi hapus tidak muncul').to.be.true;
    expect(title).to.equal('Hapus Tiket');
    await adminPage.cancelDelete();
  });

  it('[visual] tampilan dialog konfirmasi hapus', async function () {
    await adminPage.clickDelete(0);
    await adminPage.getModalTitle();
    const result = await takeAndCompare(driver, 'admin-dialog-hapus');
    attachScreenshot('Dialog Konfirmasi Hapus', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    await adminPage.cancelDelete();
  });

  it('batal hapus tidak mengurangi jumlah baris', async function () {
    const countBefore = await getTicketCount(driver);
    console.log(`    Jumlah tiket sebelum batal hapus: ${countBefore}`);
    await adminPage.clickDelete(0);
    await adminPage.cancelDelete();
    const countAfter = await getTicketCount(driver);
    console.log(`    Jumlah tiket sesudah batal hapus: ${countAfter}`);
    expect(countAfter).to.equal(countBefore);
  });

  // ─── AlertModal CRUD ──────────────────────────────────────────────────────

  it('AlertModal sukses muncul setelah tambah tiket baru', async function () {
    console.log('    Submit tiket baru dan cek AlertModal...');
    await openAddModal(driver);
    await fillTicketModal(driver, {
      title:          'Test AlertModal Tambah',
      category:       'Hardware',
      priority:       'Low',
      status:         'Open',
      assignedPerson: 'Tim QA Alert',
    });
    await submitModal(driver);
    await adminPage.waitForAlertModal();
    const title = await adminPage.getAlertTitle();
    console.log(`    Judul AlertModal: "${title}"`);
    expect(title).to.equal('Tiket Ditambahkan');
    await adminPage.closeAlert();
    const isStillOpen = await adminPage.isAlertModalOpen();
    expect(isStillOpen, 'AlertModal masih tampil setelah ditutup').to.be.false;
  });

  it('AlertModal sukses muncul setelah update status tiket', async function () {
    console.log('    Update status baris pertama ke "Done" dan cek AlertModal...');
    await updateStatus(driver, 0, 'Done');
    await adminPage.waitForAlertModal();
    const title = await adminPage.getAlertTitle();
    console.log(`    Judul AlertModal: "${title}"`);
    expect(title).to.equal('Status Diperbarui');
    await adminPage.closeAlert();
  });

  it('AlertModal sukses muncul setelah tiket berhasil dihapus', async function () {
    const countBefore = await getTicketCount(driver);
    console.log(`    Jumlah tiket sebelum hapus: ${countBefore}`);
    await adminPage.clickDelete(0);
    await adminPage.confirmDelete();
    await adminPage.waitForAlertModal();
    const title = await adminPage.getAlertTitle();
    console.log(`    Judul AlertModal: "${title}"`);
    expect(title).to.equal('Tiket Dihapus');
    await adminPage.closeAlert();
    await adminPage.navigate();
    const countAfter = await getTicketCount(driver);
    console.log(`    Jumlah tiket sesudah hapus: ${countAfter}`);
    expect(countAfter).to.equal(countBefore - 1);
  });

  it('[visual] tampilan AlertModal sukses setelah operasi CRUD', async function () {
    console.log('    Submit tiket dan screenshot AlertModal sukses...');
    await openAddModal(driver);
    await fillTicketModal(driver, {
      title:          'Test Visual AlertModal',
      category:       'Software',
      priority:       'High',
      status:         'Open',
      assignedPerson: 'Tim QA Visual',
    });
    await submitModal(driver);
    await adminPage.waitForAlertModal();
    const result = await takeAndCompare(driver, 'admin-alert-modal-sukses');
    attachScreenshot('AlertModal Sukses', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
    await adminPage.closeAlert();
  });

  // ─── Logout ───────────────────────────────────────────────────────────────

  it('tombol Logout mengarahkan ke halaman login', async function () {
    console.log('    Klik tombol Logout...');
    await logout(driver);
    const url = await driver.getCurrentUrl();
    console.log(`    URL setelah logout: ${url}`);
    expect(url).to.include('/login');
  });

  it('[visual] tampilan halaman login setelah logout', async function () {
    const result = await takeAndCompare(driver, 'after-logout-login-page');
    attachScreenshot('Setelah Logout', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
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
