// Popup JavaScript for SmartDraft Chrome Extension

class SmartDraftPopup {
  constructor() {
    this.init();
  }

  async init() {
    // Setup event listeners
    this.setupEventListeners();
    
    // Load and display status
    await this.loadStatus();
    
    // Load usage statistics
    await this.loadStats();
  }

  setupEventListeners() {
    // Open Gmail button
    document.getElementById('open-gmail').addEventListener('click', () => {
      this.openGmail();
    });

    // Open settings button
    document.getElementById('open-settings').addEventListener('click', () => {
      this.openSettings();
    });

    // Help link
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openHelp();
    });
  }

  async loadStatus() {
    try {
      // Check Gmail integration status
      await this.checkGmailStatus();
      
      // Check API status
      await this.checkApiStatus();
      
      // Check user profile status
      await this.checkProfileStatus();
      
    } catch (error) {
      console.error('Error loading status:', error);
      this.showError('Failed to load extension status');
    }
  }

  async checkGmailStatus() {
    try {
      // Query for Gmail tabs
      const tabs = await chrome.tabs.query({
        url: ['https://mail.google.com/*', 'https://gmail.com/*']
      });

      const statusElement = document.getElementById('gmail-status');
      const dot = statusElement.querySelector('.status-dot');
      const text = statusElement.querySelector('span');

      if (tabs.length > 0) {
        dot.className = 'status-dot connected';
        text.textContent = 'Connected';
      } else {
        dot.className = 'status-dot warning';
        text.textContent = 'Not Open';
      }
    } catch (error) {
      console.error('Error checking Gmail status:', error);
      const statusElement = document.getElementById('gmail-status');
      const dot = statusElement.querySelector('.status-dot');
      const text = statusElement.querySelector('span');
      dot.className = 'status-dot disconnected';
      text.textContent = 'Error';
    }
  }

  async checkApiStatus() {
    try {
      const result = await chrome.storage.sync.get(['openaiApiKey']);
      const statusElement = document.getElementById('api-status');
      const dot = statusElement.querySelector('.status-dot');
      const text = statusElement.querySelector('span');

      if (result.openaiApiKey && result.openaiApiKey.startsWith('sk-')) {
        dot.className = 'status-dot connected';
        text.textContent = 'Configured';
      } else {
        dot.className = 'status-dot disconnected';
        text.textContent = 'Not Set';
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      const statusElement = document.getElementById('api-status');
      const dot = statusElement.querySelector('.status-dot');
      const text = statusElement.querySelector('span');
      dot.className = 'status-dot disconnected';
      text.textContent = 'Error';
    }
  }

  async checkProfileStatus() {
    try {
      const result = await chrome.storage.sync.get(['userProfile']);
      const statusElement = document.getElementById('profile-status');
      const dot = statusElement.querySelector('.status-dot');
      const text = statusElement.querySelector('span');

      if (result.userProfile && result.userProfile.name) {
        dot.className = 'status-dot connected';
        text.textContent = 'Complete';
      } else {
        dot.className = 'status-dot warning';
        text.textContent = 'Incomplete';
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
      const statusElement = document.getElementById('profile-status');
      const dot = statusElement.querySelector('.status-dot');
      const text = statusElement.querySelector('span');
      dot.className = 'status-dot disconnected';
      text.textContent = 'Error';
    }
  }

  async loadStats() {
    try {
      // Load usage statistics from storage
      const result = await chrome.storage.local.get(['stats', 'drafts']);
      const stats = result.stats || {
        emailsGenerated: 0,
        draftsSaved: 0,
        lastUsed: null
      };

      // Update UI
      document.getElementById('emails-generated').textContent = stats.emailsGenerated;
      document.getElementById('drafts-saved').textContent = result.drafts ? result.drafts.length : 0;
      
      if (stats.lastUsed) {
        const lastUsedDate = new Date(stats.lastUsed);
        const now = new Date();
        const diffTime = Math.abs(now - lastUsedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          document.getElementById('last-used').textContent = 'Today';
        } else if (diffDays === 2) {
          document.getElementById('last-used').textContent = 'Yesterday';
        } else if (diffDays <= 7) {
          document.getElementById('last-used').textContent = `${diffDays - 1} days ago`;
        } else {
          document.getElementById('last-used').textContent = lastUsedDate.toLocaleDateString();
        }
      } else {
        document.getElementById('last-used').textContent = 'Never';
      }

    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async openGmail() {
    try {
      // Check if Gmail is already open
      const tabs = await chrome.tabs.query({
        url: ['https://mail.google.com/*', 'https://gmail.com/*']
      });

      if (tabs.length > 0) {
        // Focus existing Gmail tab
        await chrome.tabs.update(tabs[0].id, { active: true });
        await chrome.windows.update(tabs[0].windowId, { focused: true });
      } else {
        // Open new Gmail tab
        await chrome.tabs.create({
          url: 'https://mail.google.com'
        });
      }

      // Close popup
      window.close();
    } catch (error) {
      console.error('Error opening Gmail:', error);
      this.showError('Failed to open Gmail');
    }
  }

  openSettings() {
    try {
      chrome.runtime.openOptionsPage();
      window.close();
    } catch (error) {
      console.error('Error opening settings:', error);
      this.showError('Failed to open settings');
    }
  }

  openHelp() {
    try {
      chrome.tabs.create({
        url: 'https://github.com/your-username/smartdraft-extension/blob/main/README.md'
      });
      window.close();
    } catch (error) {
      console.error('Error opening help:', error);
      this.showError('Failed to open help');
    }
  }

  showError(message) {
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      errorSection.style.display = 'none';
    }, 5000);
  }

  showLoading(show = true) {
    const loadingSection = document.getElementById('loading-section');
    const mainContent = document.getElementById('main-content');
    
    if (show) {
      loadingSection.style.display = 'block';
      mainContent.style.display = 'none';
    } else {
      loadingSection.style.display = 'none';
      mainContent.style.display = 'block';
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SmartDraftPopup();
});

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updatePopupStats') {
    // Reload stats when they're updated
    const popup = new SmartDraftPopup();
    popup.loadStats();
  }
  return true;
});
