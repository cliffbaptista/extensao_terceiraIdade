chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only handle main frame navigation

  chrome.storage.sync.get(['enabled', 'whitelist'], (result) => {
    // If extension is disabled, allow all navigation
    if (result.enabled === false) return;

    const whitelist = result.whitelist || [];
    const url = new URL(details.url);
    const domain = url.hostname.toLowerCase();

    // Skip warning for empty domains, chrome:// URLs, and chrome-extension:// URLs
    if (!domain || 
        url.protocol === 'chrome:' || 
        url.protocol === 'chrome-extension:') {
      return;
    }

    // Check if domain is in whitelist
    const isTrusted = whitelist.some(trusted => 
      domain === trusted || domain.endsWith('.' + trusted)
    );

    // Show warning for any non-whitelisted site
    if (!isTrusted) {
      // Cancel the navigation
      chrome.tabs.update(details.tabId, { url: "blocked.html" });
      
      // Send message to content script with original URL
      chrome.tabs.sendMessage(details.tabId, {
        type: 'SHOW_WARNING',
        domain: domain,
        originalUrl: details.url
      });
    }
  });
});