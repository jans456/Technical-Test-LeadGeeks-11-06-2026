const LoginPage = require('../pageobject/LoginPage');

async function loginAsAdmin(page) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.fillEmail('admin@leadgeeks.com');
  await loginPage.fillPassword('admin123');
  await loginPage.submit();
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
}

async function loginWithCredentials(page, email, password) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.fillEmail(email);
  await loginPage.fillPassword(password);
  await loginPage.submit();
}

async function loginWithInvalidCredentials(page) {
  await loginWithCredentials(page, 'salah@email.com', 'passwordsalah');
}

async function logout(page) {
  const AdminPage = require('../pageobject/AdminPage');
  const adminPage = new AdminPage(page);
  await adminPage.logout();
}

module.exports = { loginAsAdmin, loginWithCredentials, loginWithInvalidCredentials, logout };
