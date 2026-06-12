const { By, until } = require('selenium-webdriver');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class AdminPage {
  constructor(driver) {
    this.driver = driver;
    this.url    = `${BASE_URL}/admin`;
  }

  async navigate() {
    console.log(`    [AdminPage] navigate → ${this.url}`);
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(By.css('div.rounded-xl.p-5.text-white')), 10000);
    await this.driver.wait(until.elementLocated(By.css('tbody tr')), 8000).catch(() => {});
  }

  async getStatsCardCount() {
    const cards = await this.driver.findElements(By.css('div.rounded-xl.p-5.text-white'));
    console.log(`    [AdminPage] getStatsCardCount → ${cards.length}`);
    return cards.length;
  }

  async getStatsValues() {
    const cards  = await this.driver.findElements(By.css('div.rounded-xl.p-5.text-white'));
    const result = [];
    for (const card of cards) {
      const ps    = await card.findElements(By.css('p'));
      const label = ps[0] ? await ps[0].getText() : '';
      const value = ps[1] ? parseInt(await ps[1].getText(), 10) : 0;
      result.push({ label, value });
    }
    console.log(`    [AdminPage] getStatsValues → ${JSON.stringify(result)}`);
    return result;
  }

  async getTicketRowCount() {
    try {
      await this.driver.wait(until.elementLocated(By.css('tbody tr')), 5000);
      const rows  = await this.driver.findElements(By.css('tbody tr'));
      console.log(`    [AdminPage] getTicketRowCount → ${rows.length}`);
      return rows.length;
    } catch {
      console.log('    [AdminPage] getTicketRowCount → 0 (tabel kosong)');
      return 0;
    }
  }

  async clickAddTicket() {
    console.log('    [AdminPage] clickAddTicket');
    await this.driver.executeScript(`
      const btns = Array.from(document.querySelectorAll('button'));
      const btn  = btns.find(b => b.textContent.trim().includes('Tambah Tiket'));
      if (btn) btn.click();
    `);
    await this.driver.sleep(400);
  }

  async isModalOpen() {
    const modals = await this.driver.findElements(By.css('div.fixed.inset-0.z-50'));
    const open   = modals.length > 0;
    console.log(`    [AdminPage] isModalOpen → ${open}`);
    return open;
  }

  async getModalTitle() {
    try {
      await this.driver.wait(until.elementLocated(By.css('div.fixed.inset-0.z-50 h2')), 3000);
      const el    = await this.driver.findElement(By.css('div.fixed.inset-0.z-50 h2'));
      const title = await el.getText();
      console.log(`    [AdminPage] getModalTitle → "${title}"`);
      return title;
    } catch {
      return null;
    }
  }

  async getStatusDropdownValue(rowIndex = 0) {
    const dropdowns = await this.driver.findElements(By.css('tbody tr select'));
    if (!dropdowns[rowIndex]) return null;
    const value = await this.driver.executeScript('return arguments[0].value', dropdowns[rowIndex]);
    console.log(`    [AdminPage] getStatusDropdownValue[${rowIndex}] → "${value}"`);
    return value;
  }

  async setStatusDropdown(rowIndex, status) {
    console.log(`    [AdminPage] setStatusDropdown[${rowIndex}] → "${status}"`);
    const dropdowns = await this.driver.findElements(By.css('tbody tr select'));
    if (!dropdowns[rowIndex]) return;
    await this.driver.executeScript(`
      var setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
      setter.call(arguments[0], arguments[1]);
      arguments[0].dispatchEvent(new Event('input',  { bubbles: true }));
      arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, dropdowns[rowIndex], status);
    await this.driver.sleep(3500);
  }

  async clickEdit(rowIndex = 0) {
    console.log(`    [AdminPage] clickEdit[${rowIndex}]`);
    await this.driver.wait(until.elementLocated(By.css('tbody tr')), 5000);
    const btns = await this.driver.findElements(By.css('tbody tr button.text-blue-600'));
    if (btns[rowIndex]) await btns[rowIndex].click();
    await this.driver.sleep(700);
  }

  async clickDelete(rowIndex = 0) {
    console.log(`    [AdminPage] clickDelete[${rowIndex}]`);
    await this.driver.wait(until.elementLocated(By.css('tbody tr')), 5000);
    const btns = await this.driver.findElements(By.css('tbody tr button.text-red-500'));
    if (btns[rowIndex]) await btns[rowIndex].click();
    await this.driver.sleep(400);
  }

  async confirmDelete() {
    console.log('    [AdminPage] confirmDelete');
    await this.driver.executeScript(`
      const btns = Array.from(document.querySelectorAll('button'));
      const btn  = btns.find(b => b.classList.contains('bg-red-600') && b.textContent.trim().includes('Hapus'));
      if (btn) btn.click();
    `);
    await this.driver.sleep(1000);
  }

  async cancelDelete() {
    console.log('    [AdminPage] cancelDelete');
    await this.driver.executeScript(`
      const btns = Array.from(document.querySelectorAll('button'));
      const btn  = btns.find(b => b.textContent.trim() === 'Batal');
      if (btn) btn.click();
    `);
    await this.driver.sleep(300);
  }

  async logout() {
    console.log('    [AdminPage] logout');
    await this.driver.executeScript(`
      const btns = Array.from(document.querySelectorAll('button'));
      const btn  = btns.find(b => b.textContent.trim() === 'Logout');
      if (btn) btn.click();
    `);
    await this.driver.wait(until.urlContains('/login'), 6000);
  }

  // ─── AlertModal helpers ──────────────────────────────────────────────────

  async isAlertModalOpen() {
    try {
      const btns = await this.driver.findElements(By.css('div.fixed.inset-0.z-50 button'));
      for (const btn of btns) {
        const txt = await btn.getText();
        if (txt.trim() === 'OK') {
          console.log('    [AdminPage] isAlertModalOpen → true');
          return true;
        }
      }
      console.log('    [AdminPage] isAlertModalOpen → false');
      return false;
    } catch {
      return false;
    }
  }

  async waitForAlertModal(timeout = 6000) {
    console.log('    [AdminPage] waitForAlertModal...');
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await this.isAlertModalOpen()) return;
      await this.driver.sleep(200);
    }
    throw new Error(`AlertModal tidak muncul dalam ${timeout}ms`);
  }

  async getAlertTitle() {
    try {
      await this.driver.wait(until.elementLocated(By.css('h2.text-center')), 5000);
      const el   = await this.driver.findElement(By.css('h2.text-center'));
      const text = await el.getText();
      console.log(`    [AdminPage] getAlertTitle → "${text}"`);
      return text;
    } catch {
      console.log('    [AdminPage] getAlertTitle → null');
      return null;
    }
  }

  async getAlertMessage() {
    try {
      const el   = await this.driver.findElement(By.css('p.text-center.text-sm.text-gray-500'));
      const text = await el.getText();
      console.log(`    [AdminPage] getAlertMessage → "${text}"`);
      return text;
    } catch {
      return null;
    }
  }

  async closeAlert() {
    console.log('    [AdminPage] closeAlert: klik tombol OK');
    await this.driver.executeScript(`
      const btns = Array.from(document.querySelectorAll('div.fixed.inset-0.z-50 button'));
      const btn  = btns.find(b => b.textContent.trim() === 'OK');
      if (btn) btn.click();
    `);
    await this.driver.sleep(300);
  }
}

module.exports = AdminPage;
