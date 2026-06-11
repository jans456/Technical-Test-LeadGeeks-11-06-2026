const { By, until } = require('selenium-webdriver');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class PortalPage {
  constructor(driver) {
    this.driver = driver;
    this.url    = BASE_URL;
  }

  async navigate() {
    console.log(`    [PortalPage] navigate → ${this.url}`);
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
  }

  async fillName(name) {
    console.log(`    [PortalPage] fillName: "${name}"`);
    const el = await this.driver.findElement(By.css('input[placeholder="Masukkan nama lengkap Anda"]'));
    await el.clear();
    await el.sendKeys(name);
  }

  async fillTitle(title) {
    console.log(`    [PortalPage] fillTitle: "${title}"`);
    const el = await this.driver.findElement(By.css('input[placeholder="Deskripsikan masalah secara singkat"]'));
    await el.clear();
    await el.sendKeys(title);
  }

  async selectCategory(category) {
    console.log(`    [PortalPage] selectCategory: "${category}"`);
    const selects = await this.driver.findElements(By.css('form select'));
    if (selects[0]) await selects[0].sendKeys(category);
  }

  async selectPriority(priority) {
    console.log(`    [PortalPage] selectPriority: "${priority}"`);
    const selects = await this.driver.findElements(By.css('form select'));
    if (selects[1]) await selects[1].sendKeys(priority);
  }

  async submit() {
    console.log('    [PortalPage] submit');
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async isSuccessMessageVisible() {
    try {
      await this.driver.wait(until.elementLocated(By.css('div.bg-green-50')), 5000);
      const el      = await this.driver.findElement(By.css('div.bg-green-50'));
      const visible = await el.isDisplayed();
      console.log(`    [PortalPage] isSuccessMessageVisible → ${visible}`);
      return visible;
    } catch {
      console.log('    [PortalPage] isSuccessMessageVisible → false');
      return false;
    }
  }

  async getTicketRowCount() {
    try {
      await this.driver.wait(until.elementLocated(By.css('tbody tr')), 5000);
      const rows  = await this.driver.findElements(By.css('tbody tr'));
      console.log(`    [PortalPage] getTicketRowCount → ${rows.length}`);
      return rows.length;
    } catch {
      console.log('    [PortalPage] getTicketRowCount → 0');
      return 0;
    }
  }

  async isLoginAdminButtonVisible() {
    try {
      const el      = await this.driver.findElement(By.css('a[href="/login"]'));
      const visible = await el.isDisplayed();
      console.log(`    [PortalPage] isLoginAdminButtonVisible → ${visible}`);
      return visible;
    } catch {
      console.log('    [PortalPage] isLoginAdminButtonVisible → false');
      return false;
    }
  }

  async hasEditOrDeleteButtons() {
    const editBtns   = await this.driver.findElements(By.css('tbody tr button.text-blue-600'));
    const deleteBtns = await this.driver.findElements(By.css('tbody tr button.text-red-500'));
    const has        = editBtns.length > 0 || deleteBtns.length > 0;
    console.log(`    [PortalPage] hasEditOrDeleteButtons → ${has}`);
    return has;
  }

  async getNavbarTitle() {
    const el    = await this.driver.findElement(By.css('header h1'));
    const title = await el.getText();
    console.log(`    [PortalPage] getNavbarTitle → "${title}"`);
    return title;
  }
}

module.exports = PortalPage;
