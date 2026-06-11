const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class PortalPage {
  constructor(page) {
    this.page = page;
    this.url  = BASE_URL;

    this.sel = {
      nameInput:      'input[placeholder="Masukkan nama lengkap Anda"]',
      titleInput:     'input[placeholder="Deskripsikan masalah secara singkat"]',
      categorySelect: 'form select:first-of-type',
      prioritySelect: 'form select:last-of-type',
      submitButton:   'button[type="submit"]',
      successMessage: 'div.bg-green-50',
      ticketRows:     'tbody tr',
      loginAdminBtn:  'a[href="/login"]',
      navbarTitle:    'header h1',
    };
  }

  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
  }

  async fillName(name) {
    await this.page.waitForSelector(this.sel.nameInput);
    await this.page.click(this.sel.nameInput, { clickCount: 3 });
    await this.page.type(this.sel.nameInput, name);
  }

  async fillTitle(title) {
    await this.page.waitForSelector(this.sel.titleInput);
    await this.page.click(this.sel.titleInput, { clickCount: 3 });
    await this.page.type(this.sel.titleInput, title);
  }

  async selectCategory(category) {
    await this.page.select(this.sel.categorySelect, category);
  }

  async selectPriority(priority) {
    await this.page.select(this.sel.prioritySelect, priority);
  }

  async submit() {
    await this.page.click(this.sel.submitButton);
  }

  async isSuccessMessageVisible() {
    try {
      await this.page.waitForSelector(this.sel.successMessage, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getTicketRowCount() {
    try {
      await this.page.waitForSelector(this.sel.ticketRows, { timeout: 5000 });
      return await this.page.$$eval(this.sel.ticketRows, rows => rows.length);
    } catch {
      return 0;
    }
  }

  async isLoginAdminButtonVisible() {
    const el = await this.page.$(this.sel.loginAdminBtn);
    return el !== null;
  }

  async hasEditOrDeleteButtons() {
    const editBtns   = await this.page.$$('tbody tr button.text-blue-600');
    const deleteBtns = await this.page.$$('tbody tr button.text-red-500');
    return editBtns.length > 0 || deleteBtns.length > 0;
  }

  async getNavbarTitle() {
    return await this.page.$eval(this.sel.navbarTitle, el => el.textContent.trim());
  }
}

module.exports = PortalPage;
