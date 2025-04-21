// Service worker for background processes
chrome.runtime.onInstalled.addListener(function() {
  // Set default settings when the extension is first installed
  chrome.storage.sync.get({
    bufferTime: 30,
    enableNotifications: true,
    autoEnable: true,
    skipAds: false,
    onlyOnLongVideos: false
  }, function(items) {
    // Only set defaults if they don't exist
    if (items === undefined) {
      chrome.storage.sync.set({
        bufferTime: 30,
        enableNotifications: true,
        autoEnable: true,
        skipAds: false,
        onlyOnLongVideos: false
      });
    }
  });
  
  // Optional: Show a welcome page on install
  chrome.tabs.create({
    url: 'welcome.html'
  });
});