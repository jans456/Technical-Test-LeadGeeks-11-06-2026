const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class AdminPage {
  constructor(page) {
    this.page = page;
    this.url  = `${BASE_URL}/admin`;

    this.sel = {
      statsCards:      'div.rounded-xl.p-5.text-white',
      addButton:       'button.bg-blue-600',
      table:           'table',
      ticketRows:      'tbody tr',
      statusDropdown:  'tbody tr select',
      editButton:      'tbody tr button.text-blue-600',
      deleteButton:    'tbody tr button.text-red-500',
      modal:           'div.fixed.inset-0.z-50',
      modalTitle:      'div.fixed.inset-0.z-50 h2',
      logoutButton:    'button.border-gray-300',
      navbarTitle:     'header h1',
    };
  }

  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
  }

  async getStatsCardCount() {
    await this.page.waitForSelector(this.sel.statsCards, { timeout: 5000 });
    return await this.page.$$eval(this.sel.statsCards, els => els.length);
  }

  async getStatsValues() {
    await this.page.waitForSelector(this.sel.statsCards);
    return await this.page.$$eval(this.sel.statsCards, cards =>
      cards.map(card => ({
        label: card.querySelector('p:first-child')?.textContent.trim(),
        value: parseInt(card.querySelector('p:last-child')?.textContent.trim(), 10),
      }))
    );
  }

  async getTicketRowCount() {
    try {
      await this.page.waitForSelector(this.sel.ticketRows, { timeout: 5000 });
      return await this.page.$$eval(this.sel.ticketRows, rows => rows.length);
    } catch {
      return 0;
    }
  }

  async clickAddTicket() {
    // Cari tombol "+ Tambah Tiket" berdasarkan teks
    await this.page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.trim().includes('Tambah Tiket'));
      if (btn) btn.click();
    });
    await this.page.waitForTimeout(400);
  }

  async isModalOpen() {
    return await this.page.evaluate(() => {
      const modal = document.querySelector('div.fixed.inset-0.z-50');
      return modal !== null;
    });
  }

  async getModalTitle() {
    try {
      await this.page.waitForSelector(this.sel.modalTitle, { timeout: 3000 });
      return await this.page.$eval(this.sel.modalTitle, el => el.textContent.trim());
    } catch {
      return null;
    }
  }

  async closeModalWithEsc() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  async getStatusDropdownValue(rowIndex = 0) {
    const dropdowns = await this.page.$$(this.sel.statusDropdown);
    if (!dropdowns[rowIndex]) return null;
    return await dropdowns[rowIndex].evaluate(el => el.value);
  }

  async setStatusDropdown(rowIndex, status) {
    const dropdowns = await this.page.$$(this.sel.statusDropdown);
    if (dropdowns[rowIndex]) await dropdowns[rowIndex].select(status);
    await this.page.waitForTimeout(600);
  }

  async clickEdit(rowIndex = 0) {
    const buttons = await this.page.$$(this.sel.editButton);
    if (buttons[rowIndex]) await buttons[rowIndex].click();
    await this.page.waitForTimeout(400);
  }

  async clickDelete(rowIndex = 0) {
    const buttons = await this.page.$$(this.sel.deleteButton);
    if (buttons[rowIndex]) await buttons[rowIndex].click();
    await this.page.waitForTimeout(400);
  }

  async confirmDelete() {
    // Tombol "Hapus" merah di dalam DeleteConfirm modal
    await this.page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.classList.contains('bg-red-600') && b.textContent.trim().includes('Hapus'));
      if (btn) btn.click();
    });
    await this.page.waitForTimeout(1000);
  }

  async cancelDelete() {
    await this.page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.trim() === 'Batal');
      if (btn) btn.click();
    });
    await this.page.waitForTimeout(300);
  }

  async logout() {
    await this.page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.trim() === 'Logout');
      if (btn) btn.click();
    });
    await this.page.waitForNavigation({ timeout: 6000 }).catch(() => {});
  }
}

module.exports = AdminPage;
