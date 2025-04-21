document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get({
    bufferTime: 30,
    enableNotifications: true,
    autoEnable: true,
    skipAds: false,
    onlyOnLongVideos: false
  }, function(items) {
    document.getElementById('bufferTime').value = items.bufferTime;
    document.getElementById('enableNotifications').checked = items.enableNotifications;
    document.getElementById('autoEnable').checked = items.autoEnable;
    document.getElementById('skipAds').checked = items.skipAds;
    document.getElementById('onlyOnLongVideos').checked = items.onlyOnLongVideos;
  });

  // Save settings when Save button is clicked
  document.getElementById('saveButton').addEventListener('click', function() {
    const bufferTime = parseInt(document.getElementById('bufferTime').value, 10);
    const enableNotifications = document.getElementById('enableNotifications').checked;
    const autoEnable = document.getElementById('autoEnable').checked;
    const skipAds = document.getElementById('skipAds').checked;
    const onlyOnLongVideos = document.getElementById('onlyOnLongVideos').checked;
    
    // Validate input
    if (isNaN(bufferTime) || bufferTime < 1 || bufferTime > 3600) {
      showStatus('Please enter a valid buffer time (1-3600 seconds)', 'red');
      return;
    }
    
    // Save to Chrome storage
    chrome.storage.sync.set({
      bufferTime: bufferTime,
      enableNotifications: enableNotifications,
      autoEnable: autoEnable,
      skipAds: skipAds,
      onlyOnLongVideos: onlyOnLongVideos
    }, function() {
      showStatus('Settings saved!', '#4CAF50');
      
      // Notify content script about the updated settings
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'settingsUpdated',
          settings: {
            bufferTime: bufferTime,
            enableNotifications: enableNotifications,
            autoEnable: autoEnable,
            skipAds: skipAds,
            onlyOnLongVideos: onlyOnLongVideos
          }
        });
      });
    });
  });
  
  function showStatus(message, color) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.color = color;
    setTimeout(function() {
      status.textContent = '';
    }, 3000);
  }
});