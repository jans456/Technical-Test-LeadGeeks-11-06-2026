const PortalPage = require('../pageobject/PortalPage');

async function navigateToPortal(page) {
  const portalPage = new PortalPage(page);
  await portalPage.navigate();
}

async function submitTicket(page, { name, title, category = 'Software', priority = 'Medium' }) {
  const portalPage = new PortalPage(page);
  await portalPage.fillName(name);
  await portalPage.fillTitle(title);
  await portalPage.selectCategory(category);
  await portalPage.selectPriority(priority);
  await portalPage.submit();
}

async function getTicketCount(page) {
  const portalPage = new PortalPage(page);
  return await portalPage.getTicketRowCount();
}

module.exports = { navigateToPortal, submitTicket, getTicketCount };
