// Minimal background to open Side Panel when the icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (e) {
    // sidePanel might not be available in older Chrome versions
    console.warn('Side Panel open failed:', e);
  }
});
