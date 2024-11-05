chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'test-id',
    title: 'Open popup',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'test-id') {
    chrome.windows.create({
      url: `index.html`,
      type: 'popup',
      width: 800,
      height: 600,
    });
  }
});
