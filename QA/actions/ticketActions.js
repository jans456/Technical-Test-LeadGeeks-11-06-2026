const AdminPage = require('../pageobject/AdminPage');

async function openAddModal(driver) {
  console.log('  [ticketActions] openAddModal');
  const adminPage = new AdminPage(driver);
  await adminPage.clickAddTicket();
}

async function fillTicketModal(driver, {
  requesterName = '',
  title,
  category     = 'Software',
  priority     = 'Medium',
  status       = 'Open',
  assignedPerson = 'Tim IT',
}) {
  console.log(`  [ticketActions] fillTicketModal: "${title}"`);
  const { By } = require('selenium-webdriver');

  if (requesterName) {
    const nameInput = await driver.findElement(By.css('input[placeholder="Nama karyawan pelapor (opsional)"]'));
    await nameInput.clear();
    await nameInput.sendKeys(requesterName);
  }

  const titleInput = await driver.findElement(By.css('input[placeholder="Masukkan judul tiket"]'));
  await titleInput.clear();
  await titleInput.sendKeys(title);

  // Pilih kategori, prioritas, status via select di dalam modal
  const selects = await driver.findElements(By.css('div.fixed select'));
  if (selects[0]) await selects[0].sendKeys(category);
  if (selects[1]) await selects[1].sendKeys(priority);
  if (selects[2]) await selects[2].sendKeys(status);

  const assignedInput = await driver.findElement(By.css('input[placeholder="Nama staf IT"]'));
  await assignedInput.clear();
  await assignedInput.sendKeys(assignedPerson);
}

async function submitModal(driver) {
  console.log('  [ticketActions] submitModal');
  await driver.executeScript(`
    const btn = document.querySelector('div.fixed button[type="submit"]');
    if (btn) btn.click();
  `);
  await driver.sleep(1200);
}

async function cancelModal(driver) {
  console.log('  [ticketActions] cancelModal');
  await driver.executeScript(`
    const btns = Array.from(document.querySelectorAll('div.fixed button[type="button"]'));
    const btn  = btns.find(b => b.textContent.trim() === 'Batal');
    if (btn) btn.click();
  `);
  await driver.sleep(400);
}

async function getTicketCount(driver) {
  const adminPage = new AdminPage(driver);
  return await adminPage.getTicketRowCount();
}

async function updateStatus(driver, rowIndex, status) {
  console.log(`  [ticketActions] updateStatus[${rowIndex}] → "${status}"`);
  const adminPage = new AdminPage(driver);
  await adminPage.setStatusDropdown(rowIndex, status);
}

async function deleteFirstTicket(driver) {
  console.log('  [ticketActions] deleteFirstTicket');
  const adminPage = new AdminPage(driver);
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
