const { expect }   = require('chai');
const fs           = require('fs');
const path         = require('path');
const { launchBrowser, closeBrowser } = require('../helpers/browser');
const { takeAndCompare }              = require('../helpers/visualRegression');
const LoginPage                       = require('../pageobject/LoginPage');
const { loginAsAdmin, loginWithInvalidCredentials } = require('../actions/authActions');

describe('Login Admin', function () {
  this.timeout(40000);

  let driver;
  let loginPage;

  before(async function () {
    console.log('\n[suite] Login Admin — memulai browser...');
    driver    = await launchBrowser();
    loginPage = new LoginPage(driver);
  });

  after(async function () {
    console.log('[suite] Login Admin — menutup browser');
    await closeBrowser();
  });

  beforeEach(async function () {
    console.log(`\n  ▶ MULAI: "${this.currentTest?.title}"`);
    await loginPage.navigate();
  });

  afterEach(async function () {
    const state  = this.currentTest?.state ?? 'unknown';
    const passed = state === 'passed';
    console.log(`  ${passed ? '✓ LULUS' : '✗ GAGAL'}: "${this.currentTest?.title}" [${state.toUpperCase()}]`);

    if (!passed) {
      try {
        const buf = Buffer.from(await driver.takeScreenshot(), 'base64');
        const dir = path.join(__dirname, '..', 'screenshots', 'failures');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fname = `login-${Date.now()}.png`;
        fs.writeFileSync(path.join(dir, fname), buf);
        console.log(`  📷 Screenshot kegagalan: screenshots/failures/${fname}`);
      } catch { /* ignore */ }
    }
  });

  // ─── Tampilan & Elemen ─────────────────────────────────────────────────────

  it('menampilkan judul "Login Admin" pada halaman', async function () {
    const title = await loginPage.getTitle();
    expect(title).to.equal('Login Admin');
  });

  it('menampilkan field email, password, dan tombol masuk', async function () {
    const { By } = require('selenium-webdriver');
    const emailEl    = await driver.findElements(By.css('input[type="email"]'));
    const passwordEl = await driver.findElements(By.css('input[type="password"]'));
    const submitEl   = await driver.findElements(By.css('button[type="submit"]'));
    console.log(`    email: ${emailEl.length}, password: ${passwordEl.length}, submit: ${submitEl.length}`);
    expect(emailEl.length,    'Field email tidak ditemukan').to.be.above(0);
    expect(passwordEl.length, 'Field password tidak ditemukan').to.be.above(0);
    expect(submitEl.length,   'Tombol submit tidak ditemukan').to.be.above(0);
  });

  it('menampilkan kotak akun demo berisi kredensial', async function () {
    const isDemoVisible = await loginPage.isDemoBoxVisible();
    expect(isDemoVisible, 'Kotak akun demo tidak tampil').to.be.true;
  });

  // ─── Visual Regression ─────────────────────────────────────────────────────

  it('[visual] tampilan halaman login — baseline / perbandingan', async function () {
    console.log('    Mengambil screenshot halaman login...');
    const result = await takeAndCompare(driver, 'login-page');
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
    console.log('    Mengambil screenshot state password visible...');
    const result = await takeAndCompare(driver, 'login-password-visible');
    attachScreenshot('Password Visible', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(1);
    }
  });

  // ─── AlertModal — Validasi Login ──────────────────────────────────────────

  it('login dengan kredensial salah menampilkan AlertModal "Login Gagal"', async function () {
    console.log('    Mencoba login dengan kredensial salah...');
    await loginWithInvalidCredentials(driver);
    const title = await loginPage.getAlertTitle();
    console.log(`    Judul AlertModal: "${title}"`);
    expect(title, 'AlertModal error tidak muncul').to.not.be.null;
    expect(title).to.equal('Login Gagal');
    const msg = await loginPage.getAlertMessage();
    expect(msg).to.include('salah');
  });

  it('[visual] tampilan AlertModal error setelah login gagal', async function () {
    await loginWithInvalidCredentials(driver);
    await loginPage.getAlertTitle();
    const result = await takeAndCompare(driver, 'login-error-state');
    attachScreenshot('Login Error AlertModal', result.actualPath);
    if (!result.isNewBaseline) {
      expect(result.diffPercent).to.be.below(2);
    }
  });

  it('password terlalu pendek (< 6 karakter) menampilkan AlertModal validasi', async function () {
    console.log('    Mengisi email valid dan password 3 karakter...');
    await loginPage.fillEmail('admin@leadgeeks.com');
    await loginPage.fillPassword('abc');
    await loginPage.submit();
    const title = await loginPage.getAlertTitle();
    console.log(`    Judul AlertModal: "${title}"`);
    expect(title).to.equal('Password Terlalu Pendek');
  });

  it('AlertModal validasi dapat ditutup dengan tombol OK', async function () {
    console.log('    Memunculkan AlertModal lalu menutupnya...');
    await loginPage.fillEmail('admin@leadgeeks.com');
    await loginPage.fillPassword('abc');
    await loginPage.submit();
    await loginPage.getAlertTitle();
    await loginPage.closeAlert();
    const isVisible = await loginPage.isAlertVisible();
    expect(isVisible, 'AlertModal masih tampil setelah tombol OK diklik').to.be.false;
  });

  // ─── Login Berhasil ────────────────────────────────────────────────────────

  it('login berhasil dengan kredensial valid dan redirect ke /admin', async function () {
    console.log('    Melakukan login dengan kredensial valid...');
    await loginAsAdmin(driver);
    const url = await driver.getCurrentUrl();
    console.log(`    URL sekarang: ${url}`);
    expect(url).to.include('/admin');
  });

  it('[visual] tampilan setelah redirect ke dashboard admin', async function () {
    await loginAsAdmin(driver);
    console.log('    Mengambil screenshot dashboard admin...');
    const result = await takeAndCompare(driver, 'after-login-admin-dashboard');
    attachScreenshot('Setelah Login', result.actualPath);
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
