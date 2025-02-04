document.addEventListener('DOMContentLoaded', () => {
  const enableSwitch = document.getElementById('enableExtension');
  const statusText = document.getElementById('statusText');
  const openOptionsBtn = document.getElementById('openOptions');

  // Load initial state
  chrome.storage.sync.get(['enabled'], (result) => {
    enableSwitch.checked = result.enabled !== false;
    updateStatusText(result.enabled !== false);
  });

  // Handle toggle switch
  enableSwitch.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.storage.sync.set({ enabled });
    updateStatusText(enabled);
  });

  // Open options page
  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  function updateStatusText(enabled) {
    statusText.textContent = enabled ? 'Proteção Ativa' : 'Proteção Inativa';
  }
});