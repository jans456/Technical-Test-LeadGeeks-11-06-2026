const AdminPage = require('../pageobject/AdminPage');

async function openAddModal(page) {
  const adminPage = new AdminPage(page);
  await adminPage.clickAddTicket();
}

async function fillTicketModal(page, { requesterName = '', title, category = 'Software', priority = 'Medium', status = 'Open', assignedPerson = 'Tim IT' }) {
  // Isi Nama Pelapor (opsional)
  if (requesterName) {
    const nameInput = await page.$('input[placeholder="Nama karyawan pelapor (opsional)"]');
    if (nameInput) {
      await nameInput.click({ clickCount: 3 });
      await nameInput.type(requesterName);
    }
  }

  // Isi Judul Tiket (wajib)
  const titleInput = await page.$('input[placeholder="Masukkan judul tiket"]');
  if (titleInput) {
    await titleInput.click({ clickCount: 3 });
    await titleInput.type(title);
  }

  // Pilih Kategori
  const selects = await page.$$('div.fixed select');
  if (selects[0]) await selects[0].select(category);

  // Pilih Prioritas
  if (selects[1]) await selects[1].select(priority);

  // Pilih Status
  if (selects[2]) await selects[2].select(status);

  // Isi Penanggung Jawab (wajib)
  const assignedInput = await page.$('input[placeholder="Nama staf IT"]');
  if (assignedInput) {
    await assignedInput.click({ clickCount: 3 });
    await assignedInput.type(assignedPerson);
  }
}

async function submitModal(page) {
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div.fixed button[type="submit"]'));
    if (btns[0]) btns[0].click();
  });
  await page.waitForTimeout(1200);
}

async function cancelModal(page) {
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div.fixed button[type="button"]'));
    const btn = btns.find(b => b.textContent.trim() === 'Batal');
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
}

async function getTicketCount(page) {
  const adminPage = new AdminPage(page);
  return await adminPage.getTicketRowCount();
}

async function updateStatus(page, rowIndex, status) {
  const adminPage = new AdminPage(page);
  await adminPage.setStatusDropdown(rowIndex, status);
}

async function deleteFirstTicket(page) {
  const adminPage = new AdminPage(page);
  await adminPage.clickDelete(0);
  await adminPage.confirmDelete();
}

module.exports = {
  openAddModal,
  fillTicketModal,
  submitModal,
  cancelModal,
  getTicketCount,
  updateStatus,
  deleteFirstTicket,
};
