const { expect }          = require('chai');
const fs                   = require('fs');
const { launchBrowser, newPage, closeBrowser } = require('../helpers/browser');
const { takeAndCompare }   = require('../helpers/visualRegression');
const LoginPage            = require('../pageobject/LoginPage');
const { loginAsAdmin, loginWithInvalidCredentials } = require('../actions/authActions');

describe('Login Admin', function () {
  this.timeout(30000);

  let page;
  let loginPage;

  before(async function () {
    await launchBrowser();
    page      = await newPage();
    loginPage = new LoginPage(page);
  });

  after(async function () {
    await closeBrowser();
  });

  beforeEach(async function () {
    await loginPage.navigate();
  });

  // ─── Tampilan & Elemen ─────────────────────────────────────────────────────

  it('menampilkan judul "Login Admin" pada halaman', async function () {
    const title = await loginPage.getTitle();
    expect(title).to.equal('Login Admin');
  });

  it('menampilkan field email, password, dan tombol masuk', async function () {
    const emailEl    = await page.$('input[type="email"]');
    const passwordEl = await page.$('input[type="password"]');
    const submitEl   = await page.$('button[type="submit"]');

    expect(emailEl,    'Field email tidak ditemukan').to.not.be.null;
    expect(passwordEl, 'Field password tidak ditemukan').to.not.be.null;
    expect(submitEl,   'Tombol submit tidak ditemukan').to.not.be.null;
  });

  it('menampilkan kotak akun demo berisi kredensial', async function () {
    const isDemoVisible = await loginPage.isDemoBoxVisible();
    expect(isDemoVisible, 'Kotak akun demo tidak tampil').to.be.true;
  });

  // ─── Visual Regression ─────────────────────────────────────────────────────

  it('[visual] tampilan halaman login — baseline / perbandingan', async function () {
    const result = await takeAndCompare(page, 'login-page');
    attachScreenshot('Halaman Login', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1,
        `Visual diff terlalu besar: ${result.diffPercent}% (${result.diffPixels} piksel berbeda)`);
    }
  });

  // ─── Eye Toggle ───────────────────────────────────────────────────────────

  it('password tersembunyi (type=password) secara default', async function () {
    await loginPage.fillPassword('admin123');
    const type = await loginPage.getPasswordFieldType();
    expect(type).to.equal('password');
  });

  it('klik ikon eye mengubah type password menjadi text', async function () {
    await loginPage.fillPassword('admin123');
    await loginPage.togglePasswordVisibility();
    const type = await loginPage.getPasswordFieldType();
    expect(type).to.equal('text');
  });

  it('klik ikon eye kedua kali menyembunyikan password kembali', async function () {
    await loginPage.fillPassword('admin123');
    await loginPage.togglePasswordVisibility();
    await loginPage.togglePasswordVisibility();
    const type = await loginPage.getPasswordFieldType();
    expect(type).to.equal('password');
  });

  it('[visual] tampilan password terlihat setelah klik eye', async function () {
    await loginPage.fillPassword('admin123');
    await loginPage.togglePasswordVisibility();
    const result = await takeAndCompare(page, 'login-password-visible');
    attachScreenshot('Password Visible', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── Login Invalid ─────────────────────────────────────────────────────────

  it('login dengan kredensial salah menampilkan pesan error', async function () {
    await loginWithInvalidCredentials(page);
    const error = await loginPage.getErrorText();
    expect(error, 'Pesan error tidak muncul').to.not.be.null;
    expect(error).to.include('salah');
  });

  it('[visual] tampilan halaman setelah error login', async function () {
    await loginWithInvalidCredentials(page);
    await loginPage.getErrorText(); // tunggu error muncul
    const result = await takeAndCompare(page, 'login-error-state');
    attachScreenshot('Login Error', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  // ─── Login Berhasil ────────────────────────────────────────────────────────

  it('login berhasil dengan kredensial valid dan redirect ke /admin', async function () {
    await loginAsAdmin(page);
    expect(page.url()).to.include('/admin');
  });

  it('[visual] tampilan setelah redirect ke dashboard admin', async function () {
    await loginAsAdmin(page);
    const result = await takeAndCompare(page, 'after-login-admin-dashboard');
    attachScreenshot('Setelah Login', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });
});

function attachScreenshot(name, filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      // allure global disediakan oleh reporter allure-mocha
      // eslint-disable-next-line no-undef
      allure.attachment(name, fs.readFileSync(filePath), 'image/png');
    }
  } catch { /* allure tidak aktif, skip */ }
}
