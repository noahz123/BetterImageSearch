document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleSort');

  // Check current state
  chrome.storage.local.get('sortingEnabled', function(data) {
    toggleButton.textContent = data.sortingEnabled ? 'Disable Sorting' : 'Enable Sorting';
  });

  toggleButton.addEventListener('click', function() {
    chrome.storage.local.get('sortingEnabled', function(data) {
      const newState = !data.sortingEnabled;
      chrome.storage.local.set({ sortingEnabled: newState }, function() {
        toggleButton.textContent = newState ? 'Disable Sorting' : 'Enable Sorting';
        
        // Get the current active tab and refresh it
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });
    });
  });
});