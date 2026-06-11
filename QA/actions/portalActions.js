const PortalPage = require('../pageobject/PortalPage');

async function navigateToPortal(driver) {
  console.log('  [portalActions] navigateToPortal');
  const portalPage = new PortalPage(driver);
  await portalPage.navigate();
}

async function submitTicket(driver, { name, title, category = 'Software', priority = 'Medium' }) {
  console.log(`  [portalActions] submitTicket: "${title}"`);
  const portalPage = new PortalPage(driver);
  await portalPage.fillName(name);
  await portalPage.fillTitle(title);
  await portalPage.selectCategory(category);
  await portalPage.selectPriority(priority);
  await portalPage.submit();
}

async function getTicketCount(driver) {
  const portalPage = new PortalPage(driver);
  return await portalPage.getTicketRowCount();
}

module.exports = { navigateToPortal, submitTicket, getTicketCount };
