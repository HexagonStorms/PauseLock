document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get({
    bufferTime: 30,
    enableNotifications: true,
    autoDismissNotifications: false,
    notificationColor: '#000000',
    notificationOpacity: 75,
    autoEnable: true,
    skipAds: false,
    onlyOnLongVideos: false
  }, function(items) {
    document.getElementById('bufferTime').value = items.bufferTime;
    document.getElementById('enableNotifications').checked = items.enableNotifications;
    document.getElementById('autoDismissNotifications').checked = items.autoDismissNotifications;
    document.getElementById('notificationColor').value = items.notificationColor;
    document.getElementById('notificationOpacity').value = items.notificationOpacity;
    document.getElementById('opacityValue').textContent = items.notificationOpacity + '%';
    document.getElementById('autoEnable').checked = items.autoEnable;
    document.getElementById('skipAds').checked = items.skipAds;
    document.getElementById('onlyOnLongVideos').checked = items.onlyOnLongVideos;
  });

  // Update opacity value display when slider changes
  document.getElementById('notificationOpacity').addEventListener('input', function() {
    document.getElementById('opacityValue').textContent = this.value + '%';
  });

  // Save settings when Save button is clicked
  document.getElementById('saveButton').addEventListener('click', function() {
    const bufferTime = parseInt(document.getElementById('bufferTime').value, 10);
    const enableNotifications = document.getElementById('enableNotifications').checked;
    const autoDismissNotifications = document.getElementById('autoDismissNotifications').checked;
    const notificationColor = document.getElementById('notificationColor').value;
    const notificationOpacity = parseInt(document.getElementById('notificationOpacity').value, 10);
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
      autoDismissNotifications: autoDismissNotifications,
      notificationColor: notificationColor,
      notificationOpacity: notificationOpacity,
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
            autoDismissNotifications: autoDismissNotifications,
            notificationColor: notificationColor,
            notificationOpacity: notificationOpacity,
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