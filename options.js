document.addEventListener('DOMContentLoaded', () => {
  const newSiteInput = document.getElementById('newSite');
  const addSiteButton = document.getElementById('addSite');
  const whitelistItems = document.getElementById('whitelistItems');

  // Load whitelist
  loadWhitelist();

  // Add new site
  addSiteButton.addEventListener('click', () => {
    addSite();
  });

  newSiteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addSite();
    }
  });

  function addSite() {
    const url = newSiteInput.value.trim().toLowerCase();
    if (!url) return;

    chrome.storage.sync.get(['whitelist'], (result) => {
      const whitelist = result.whitelist || [];
      if (!whitelist.includes(url)) {
        whitelist.push(url);
        chrome.storage.sync.set({ whitelist }, () => {
          loadWhitelist();
          newSiteInput.value = '';
        });
      }
    });
  }

  function loadWhitelist() {
    chrome.storage.sync.get(['whitelist'], (result) => {
      const whitelist = result.whitelist || [];
      whitelistItems.innerHTML = '';
      
      whitelist.forEach(site => {
        const item = document.createElement('div');
        item.className = 'whitelist-item';
        
        const siteText = document.createElement('span');
        siteText.textContent = site;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Deletar';
        removeButton.className = 'remove-site';
        removeButton.onclick = () => removeSite(site);
        
        item.appendChild(siteText);
        item.appendChild(removeButton);
        whitelistItems.appendChild(item);
      });
    });
  }

  function removeSite(site) {
    chrome.storage.sync.get(['whitelist'], (result) => {
      const whitelist = result.whitelist || [];
      const newWhitelist = whitelist.filter(s => s !== site);
      chrome.storage.sync.set({ whitelist: newWhitelist }, () => {
        loadWhitelist();
      });
    });
  }
});