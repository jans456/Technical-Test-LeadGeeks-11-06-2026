const { By, until } = require('selenium-webdriver');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url    = `${BASE_URL}/login`;
  }

  async navigate() {
    console.log(`    [LoginPage] navigate → ${this.url}`);
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
  }

  async fillEmail(email) {
    console.log(`    [LoginPage] fillEmail: ${email}`);
    const el = await this.driver.findElement(By.css('input[type="email"]'));
    await el.clear();
    await el.sendKeys(email);
  }

  async fillPassword(password) {
    console.log(`    [LoginPage] fillPassword: ${'*'.repeat(password.length)}`);
    const el = await this.driver.findElement(By.css('input[type="password"]'));
    await el.clear();
    await el.sendKeys(password);
  }

  async submit() {
    console.log('    [LoginPage] submit');
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async togglePasswordVisibility() {
    console.log('    [LoginPage] togglePasswordVisibility');
    await this.driver.findElement(By.css('div.relative button[type="button"]')).click();
  }

  async getPasswordFieldType() {
    const el   = await this.driver.findElement(By.css('div.relative input'));
    const type = await el.getAttribute('type');
    console.log(`    [LoginPage] getPasswordFieldType → "${type}"`);
    return type;
  }

  // ─── AlertModal helpers ──────────────────────────────────────────────────

  async isAlertVisible() {
    try {
      const btns = await this.driver.findElements(By.css('div.fixed.inset-0.z-50 button'));
      for (const btn of btns) {
        const txt = await btn.getText();
        if (txt.trim() === 'OK') {
          console.log('    [LoginPage] isAlertVisible → true');
          return true;
        }
      }
      console.log('    [LoginPage] isAlertVisible → false');
      return false;
    } catch {
      return false;
    }
  }

  async getAlertTitle() {
    try {
      await this.driver.wait(until.elementLocated(By.css('h2.text-center')), 5000);
      const el   = await this.driver.findElement(By.css('h2.text-center'));
      const text = await el.getText();
      console.log(`    [LoginPage] getAlertTitle → "${text}"`);
      return text;
    } catch {
      console.log('    [LoginPage] getAlertTitle → null (tidak ditemukan)');
      return null;
    }
  }

  async getAlertMessage() {
    try {
      const el   = await this.driver.findElement(By.css('p.text-center.text-sm.text-gray-500'));
      const text = await el.getText();
      console.log(`    [LoginPage] getAlertMessage → "${text}"`);
      return text;
    } catch {
      return null;
    }
  }

  async closeAlert() {
    console.log('    [LoginPage] closeAlert: klik tombol OK');
    await this.driver.executeScript(`
      const btns = Array.from(document.querySelectorAll('div.fixed.inset-0.z-50 button'));
      const btn  = btns.find(b => b.textContent.trim() === 'OK');
      if (btn) btn.click();
    `);
    await this.driver.sleep(300);
  }

  // ─── Misc ───────────────────────────────────────────────────────────────

  async isDemoBoxVisible() {
    try {
      const el      = await this.driver.findElement(By.css('p.text-xs.font-medium.text-gray-500'));
      const visible = await el.isDisplayed();
      console.log(`    [LoginPage] isDemoBoxVisible → ${visible}`);
      return visible;
    } catch {
      console.log('    [LoginPage] isDemoBoxVisible → false');
      return false;
    }
  }

  async getTitle() {
    const el    = await this.driver.findElement(By.css('h1'));
    const title = await el.getText();
    console.log(`    [LoginPage] getTitle → "${title}"`);
    return title;
  }
}

module.exports = LoginPage;
