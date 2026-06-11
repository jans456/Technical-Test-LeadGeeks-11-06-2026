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
    const el = await this.driver.findElement(By.css('div.relative input'));
    const type = await el.getAttribute('type');
    console.log(`    [LoginPage] getPasswordFieldType → "${type}"`);
    return type;
  }

  async getErrorText() {
    try {
      await this.driver.wait(until.elementLocated(By.css('div.bg-red-50')), 4000);
      const el   = await this.driver.findElement(By.css('div.bg-red-50'));
      const text = await el.getText();
      console.log(`    [LoginPage] getErrorText → "${text}"`);
      return text;
    } catch {
      console.log('    [LoginPage] getErrorText → null (tidak ditemukan)');
      return null;
    }
  }

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
