// Global variables
let bufferTime = 30; // Default 30 seconds
let enableNotifications = true;
let autoEnable = true;
let skipAds = false;
let onlyOnLongVideos = false;
let playStartTime = 0;
let bufferActive = false;
let notificationElement = null;
let lastVideoId = null;

// Load settings when script initializes
chrome.storage.sync.get({
  bufferTime: 30,
  enableNotifications: true,
  autoEnable: true,
  skipAds: false,
  onlyOnLongVideos: false
}, function(items) {
  bufferTime = items.bufferTime;
  enableNotifications = items.enableNotifications;
  autoEnable = items.autoEnable;
  skipAds = items.skipAds;
  onlyOnLongVideos = items.onlyOnLongVideos;
  
  // Initialize after settings are loaded
  initialize();
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'settingsUpdated') {
    bufferTime = request.settings.bufferTime;
    enableNotifications = request.settings.enableNotifications;
    autoEnable = request.settings.autoEnable;
    skipAds = request.settings.skipAds;
    onlyOnLongVideos = request.settings.onlyOnLongVideos;
    
    // Show notification about updated settings
    if (enableNotifications) {
      showNotification(`NoFlake settings updated. Buffer time: ${bufferTime}s`);
    }
  }
});

function initialize() {
  // Set up mutation observer to detect page changes
  const observer = new MutationObserver(function(mutations) {
    // Check if we're on a YouTube watch page
    if (window.location.href.includes('youtube.com/watch')) {
      const videoId = new URLSearchParams(window.location.search).get('v');
      
      // If this is a new video, reset the buffer state
      if (videoId !== lastVideoId) {
        lastVideoId = videoId;
        resetBufferState();
        setupVideoListeners();
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial setup if we're already on a watch page
  if (window.location.href.includes('youtube.com/watch')) {
    lastVideoId = new URLSearchParams(window.location.search).get('v');
    setupVideoListeners();
  }
}

function setupVideoListeners() {
  // Find the video element (may need to wait for it to load)
  const setupInterval = setInterval(() => {
    const video = document.querySelector('video');
    if (video) {
      clearInterval(setupInterval);
      
      // Check if we should enable the extension for this video
      if (onlyOnLongVideos) {
        // Get video duration
        if (video.duration < 300) { // Less than 5 minutes
          return; // Don't apply buffer to short videos
        }
      }
      
      // Add event listeners for play and pause
      video.addEventListener('play', handleVideoPlay);
      video.addEventListener('pause', handleVideoPause);
      
      // Create notification element if it doesn't exist
      createNotificationElement();
      
      if (enableNotifications && autoEnable) {
        showNotification('NoFlake is active on this video');
      }
    }
  }, 500);
}

function handleVideoPlay() {
  const video = document.querySelector('video');
  
  // Only start buffer if autoEnable is on or if we manually enabled it
  if (autoEnable) {
    // Skip if we're in an ad and skipAds is enabled
    if (skipAds && isAdPlaying()) {
      return;
    }
    
    // Start the buffer timer
    playStartTime = Date.now() / 1000; // Current time in seconds
    bufferActive = true;
    
    if (enableNotifications) {
      showNotification(`Video started. Cannot pause for ${bufferTime} seconds`);
    }
  }
}

function handleVideoPause() {
  const video = document.querySelector('video');
  
  // If buffer is active, check if enough time has passed
  if (bufferActive) {
    const currentTime = Date.now() / 1000;
    const elapsedTime = currentTime - playStartTime;
    
    // Skip check if we're in an ad and skipAds is enabled
    if (skipAds && isAdPlaying()) {
      return;
    }
    
    // If not enough time has passed, resume playback
    if (elapsedTime < bufferTime) {
      const timeRemaining = Math.ceil(bufferTime - elapsedTime);
      
      // Prevent pause by immediately playing again
      setTimeout(() => {
        video.play();
      }, 10);
      
      if (enableNotifications) {
        showNotification(`Cannot pause yet! ${timeRemaining} seconds remaining`, '#ff4444');
      }
      
      return;
    }
    
    // If we've passed the buffer time, allow the pause
    bufferActive = false;
    if (enableNotifications) {
      showNotification('Buffer complete. You can now pause the video', '#4CAF50');
    }
  }
}

function resetBufferState() {
  playStartTime = 0;
  bufferActive = false;
}

function isAdPlaying() {
  // Check if an ad is currently playing (look for ad indicators in the DOM)
  return document.querySelector('.ad-showing') !== null;
}

function createNotificationElement() {
  if (notificationElement) return;
  
  notificationElement = document.createElement('div');
  notificationElement.style.position = 'fixed';
  notificationElement.style.bottom = '60px';
  notificationElement.style.left = '50%';
  notificationElement.style.transform = 'translateX(-50%)';
  notificationElement.style.backgroundColor = '#333';
  notificationElement.style.color = 'white';
  notificationElement.style.padding = '10px 20px';
  notificationElement.style.borderRadius = '4px';
  notificationElement.style.zIndex = '9999';
  notificationElement.style.fontFamily = 'YouTube Sans, sans-serif';
  notificationElement.style.fontWeight = 'bold';
  notificationElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  notificationElement.style.display = 'none';
  
  document.body.appendChild(notificationElement);
}

function showNotification(message, color = '#333') {
  if (!notificationElement || !enableNotifications) return;
  
  notificationElement.textContent = message;
  notificationElement.style.backgroundColor = color;
  notificationElement.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    notificationElement.style.display = 'none';
  }, 3000);
}