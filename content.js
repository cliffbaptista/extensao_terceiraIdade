// Create and inject modal HTML
const modal = document.createElement('div');
modal.id = 'whitelist-warning-modal';
modal.style.display = 'none';
modal.innerHTML = `
  <div class="modal-content">
    <h2>⚠️ Warning: Untrusted Site</h2>
    <p>The site <strong id="site-name"></strong> is not in your trusted sites list. Do you want to proceed?</p>
    <div class="modal-buttons">
      <button id="modal-back">Go Back</button>
      <button id="modal-continue">Continue Anyway</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

let originalUrl = '';

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_WARNING') {
    originalUrl = message.originalUrl;
    showWarningModal(message.domain);
  }
});

function showWarningModal(domain) {
  const modal = document.getElementById('whitelist-warning-modal');
  const siteName = document.getElementById('site-name');
  
  siteName.textContent = domain;
  modal.style.display = 'flex';
  
  // Prevent scrolling of the background
  document.body.style.overflow = 'hidden';

  document.getElementById('modal-back').onclick = () => {
    history.back();
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  document.getElementById('modal-continue').onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // Navigate to the original URL
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  };
}