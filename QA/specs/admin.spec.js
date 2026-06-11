const { expect }          = require('chai');
const fs                   = require('fs');
const { launchBrowser, newPage, closeBrowser } = require('../helpers/browser');
const { takeAndCompare }   = require('../helpers/visualRegression');
const AdminPage            = require('../pageobject/AdminPage');
const { loginAsAdmin, logout } = require('../actions/authActions');
const {
  openAddModal,
  fillTicketModal,
  submitModal,
  cancelModal,
  getTicketCount,
  updateStatus,
} = require('../actions/ticketActions');

describe('Dashboard Admin', function () {
  this.timeout(40000);

  let page;
  let adminPage;

  before(async function () {
    await launchBrowser();
    page      = await newPage();
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
  });

  after(async function () {
    await closeBrowser();
  });

  beforeEach(async function () {
    await adminPage.navigate();
  });

  // ─── Akses & Redirect ─────────────────────────────────────────────────────

  it('halaman /admin dapat diakses setelah login', async function () {
    expect(page.url()).to.include('/admin');
    const title = await page.$eval('header h1', el => el.textContent.trim());
    expect(title).to.include('Dashboard');
  });

  // ─── Statistik ────────────────────────────────────────────────────────────

  it('menampilkan tepat 4 kartu statistik', async function () {
    const count = await adminPage.getStatsCardCount();
    expect(count).to.equal(4);
  });

  it('kartu statistik memiliki label yang benar', async function () {
    const stats = await adminPage.getStatsValues();
    const labels = stats.map(s => s.label);
    expect(labels).to.include('Total Tiket');
    expect(labels).to.include('Tiket Terbuka');
    expect(labels).to.include('Sedang Dikerjakan');
    expect(labels).to.include('Prioritas Tinggi');
  });

  it('[visual] tampilan kartu statistik dashboard', async function () {
    const result = await takeAndCompare(page, 'admin-stats-section');
    attachScreenshot('Stats Cards', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Tabel Tiket ──────────────────────────────────────────────────────────

  it('tabel tiket menampilkan data minimal 1 baris', async function () {
    const count = await adminPage.getTicketRowCount();
    expect(count).to.be.above(0, 'Tabel tiket kosong — pastikan seeder dijalankan');
  });

  it('[visual] tampilan halaman dashboard admin (full page)', async function () {
    const result = await takeAndCompare(page, 'admin-dashboard-full');
    attachScreenshot('Dashboard Admin', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Tambah Tiket ─────────────────────────────────────────────────────────

  it('tombol "+ Tambah Tiket" membuka modal form', async function () {
    await openAddModal(page);
    const isOpen = await adminPage.isModalOpen();
    expect(isOpen, 'Modal tidak terbuka setelah klik tombol tambah').to.be.true;
  });

  it('modal tambah tiket menampilkan judul "Tambah Tiket"', async function () {
    await openAddModal(page);
    const modalTitle = await adminPage.getModalTitle();
    expect(modalTitle).to.equal('Tambah Tiket');
    await cancelModal(page);
  });

  it('[visual] tampilan modal tambah tiket', async function () {
    await openAddModal(page);
    const result = await takeAndCompare(page, 'admin-modal-tambah-tiket');
    attachScreenshot('Modal Tambah Tiket', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    await cancelModal(page);
  });

  it('tambah tiket baru berhasil dan jumlah baris bertambah', async function () {
    const countBefore = await getTicketCount(page);
    await openAddModal(page);
    await fillTicketModal(page, {
      title:          'Test Tambah Tiket QA Automation',
      category:       'Software',
      priority:       'Medium',
      status:         'Open',
      assignedPerson: 'Tim QA',
    });
    await submitModal(page);
    await adminPage.navigate();
    const countAfter = await getTicketCount(page);
    expect(countAfter).to.equal(countBefore + 1);
  });

  // ─── Update Status Inline ─────────────────────────────────────────────────

  it('dropdown status inline mengubah nilai status tiket', async function () {
    await updateStatus(page, 0, 'In Progress');
    const value = await adminPage.getStatusDropdownValue(0);
    expect(value).to.equal('In Progress');
  });

  it('[visual] tampilan tabel setelah update status inline', async function () {
    await adminPage.navigate();
    const result = await takeAndCompare(page, 'admin-table-after-status-update');
    attachScreenshot('Tabel Setelah Update Status', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Edit Tiket ───────────────────────────────────────────────────────────

  it('tombol Edit membuka modal dengan judul "Edit Tiket"', async function () {
    await adminPage.clickEdit(0);
    const isOpen     = await adminPage.isModalOpen();
    const modalTitle = await adminPage.getModalTitle();
    expect(isOpen).to.be.true;
    expect(modalTitle).to.equal('Edit Tiket');
    await cancelModal(page);
  });

  it('[visual] tampilan modal edit tiket', async function () {
    await adminPage.clickEdit(0);
    await adminPage.getModalTitle(); // tunggu modal
    const result = await takeAndCompare(page, 'admin-modal-edit-tiket');
    attachScreenshot('Modal Edit Tiket', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    await cancelModal(page);
  });

  // ─── Hapus Tiket ──────────────────────────────────────────────────────────

  it('tombol Hapus membuka dialog konfirmasi', async function () {
    await adminPage.clickDelete(0);
    const isOpen = await adminPage.isModalOpen();
    expect(isOpen, 'Dialog konfirmasi hapus tidak muncul').to.be.true;

    const title = await adminPage.getModalTitle();
    expect(title).to.equal('Hapus Tiket');
    await adminPage.cancelDelete();
  });

  it('[visual] tampilan dialog konfirmasi hapus', async function () {
    await adminPage.clickDelete(0);
    await adminPage.getModalTitle();
    const result = await takeAndCompare(page, 'admin-dialog-hapus');
    attachScreenshot('Dialog Konfirmasi Hapus', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
    await adminPage.cancelDelete();
  });

  it('batal hapus tiket tidak mengurangi jumlah baris', async function () {
    const countBefore = await getTicketCount(page);
    await adminPage.clickDelete(0);
    await adminPage.cancelDelete();
    const countAfter = await getTicketCount(page);
    expect(countAfter).to.equal(countBefore);
  });

  // ─── Logout ───────────────────────────────────────────────────────────────

  it('tombol Logout mengarahkan ke halaman login', async function () {
    await logout(page);
    expect(page.url()).to.include('/login');
  });

  it('[visual] tampilan halaman login setelah logout', async function () {
    const result = await takeAndCompare(page, 'after-logout-login-page');
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
