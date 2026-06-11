const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.url  = `${BASE_URL}/login`;

    this.sel = {
      email:      'input[type="email"]',
      password:   'input[type="password"], input[type="text"]',
      passwordRaw: 'input[type="password"]',
      eyeToggle:  'div.relative button[type="button"]',
      submit:     'button[type="submit"]',
      error:      'div.bg-red-50',
      demoBox:    'p.text-xs.font-medium.text-gray-500',
    };
  }

  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
  }

  async fillEmail(email) {
    await this.page.waitForSelector(this.sel.email);
    await this.page.click(this.sel.email, { clickCount: 3 });
    await this.page.type(this.sel.email, email);
  }

  async fillPassword(password) {
    await this.page.waitForSelector(this.sel.passwordRaw);
    await this.page.click(this.sel.passwordRaw, { clickCount: 3 });
    await this.page.type(this.sel.passwordRaw, password);
  }

  async submit() {
    await this.page.click(this.sel.submit);
  }

  async togglePasswordVisibility() {
    await this.page.waitForSelector(this.sel.eyeToggle);
    await this.page.click(this.sel.eyeToggle);
  }

  async getPasswordFieldType() {
    const input = await this.page.$('input[name="password"], div.relative input');
    if (input) return await input.evaluate(el => el.type);
    // Fallback: cari input di dalam div.relative
    return await this.page.$eval('div.relative input', el => el.type);
  }

  async getErrorText() {
    try {
      await this.page.waitForSelector(this.sel.error, { timeout: 4000 });
      return await this.page.$eval(this.sel.error, el => el.textContent.trim());
    } catch {
      return null;
    }
  }

  async isDemoBoxVisible() {
    const el = await this.page.$(this.sel.demoBox);
    return el !== null;
  }

  async getTitle() {
    return await this.page.$eval('h1', el => el.textContent.trim());
  }
}

module.exports = LoginPage;
