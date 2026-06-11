const { until } = require('selenium-webdriver');
const LoginPage = require('../pageobject/LoginPage');

async function loginAsAdmin(driver) {
  console.log('  [authActions] loginAsAdmin: admin@leadgeeks.com');
  const loginPage = new LoginPage(driver);
  await loginPage.navigate();
  await loginPage.fillEmail('admin@leadgeeks.com');
  await loginPage.fillPassword('admin123');
  await loginPage.submit();
  await driver.wait(until.urlContains('/admin'), 10000);
  console.log('  [authActions] loginAsAdmin: berhasil, URL sekarang /admin');
}

async function loginWithCredentials(driver, email, password) {
  console.log(`  [authActions] loginWithCredentials: ${email}`);
  const loginPage = new LoginPage(driver);
  await loginPage.navigate();
  await loginPage.fillEmail(email);
  await loginPage.fillPassword(password);
  await loginPage.submit();
}

async function loginWithInvalidCredentials(driver) {
  console.log('  [authActions] loginWithInvalidCredentials');
  await loginWithCredentials(driver, 'salah@email.com', 'passwordsalah');
}

async function logout(driver) {
  console.log('  [authActions] logout');
  const AdminPage = require('../pageobject/AdminPage');
  const adminPage = new AdminPage(driver);
  await adminPage.logout();
  console.log('  [authActions] logout: selesai');
}

module.exports = { loginAsAdmin, loginWithCredentials, loginWithInvalidCredentials, logout };
