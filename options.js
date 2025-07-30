// Options page JavaScript for SmartDraft Chrome Extension

class SmartDraftOptions {
  constructor() {
    this.init();
  }

  init() {
    // Load existing settings when page loads
    this.loadSettings();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Save settings button
    document.getElementById('save-settings').addEventListener('click', () => {
      this.saveSettings();
    });

    // Test API connection button
    document.getElementById('test-api').addEventListener('click', () => {
      this.testApiConnection();
    });

    // Auto-save on input changes (debounced)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', this.debounce(() => {
        this.autoSave();
      }, 1000));
    });
  }

  async loadSettings() {
    try {
      // Load from Chrome storage
      const result = await chrome.storage.sync.get(['openaiApiKey', 'userProfile']);
      
      // Populate API key field
      if (result.openaiApiKey) {
        document.getElementById('openai-api-key').value = result.openaiApiKey;
      }

      // Populate user profile fields
      if (result.userProfile) {
        document.getElementById('user-name').value = result.userProfile.name || '';
        document.getElementById('user-resume').value = result.userProfile.resume || '';
      }

      console.log('Settings loaded successfully');
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showMessage('Error loading settings', 'error');
    }
  }

  async saveSettings() {
    try {
      const apiKey = document.getElementById('openai-api-key').value.trim();
      const userName = document.getElementById('user-name').value.trim();
      const userResume = document.getElementById('user-resume').value.trim();

      // Validate required fields
      if (!apiKey) {
        this.showMessage('Please enter your OpenAI API key', 'error');
        return;
      }

      if (!userName) {
        this.showMessage('Please enter your name', 'error');
        return;
      }

      // Validate API key format
      if (!apiKey.startsWith('sk-')) {
        this.showMessage('Invalid API key format. OpenAI API keys start with "sk-"', 'error');
        return;
      }

      // Save to Chrome storage
      await chrome.storage.sync.set({
        openaiApiKey: apiKey,
        userProfile: {
          name: userName,
          resume: userResume,
          lastUpdated: Date.now()
        }
      });

      this.showMessage('Settings saved successfully!', 'success');
      
      // Send message to background script to update
      chrome.runtime.sendMessage({
        action: 'settingsUpdated'
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      this.showMessage('Error saving settings: ' + error.message, 'error');
    }
  }

  async autoSave() {
    try {
      const apiKey = document.getElementById('openai-api-key').value.trim();
      const userName = document.getElementById('user-name').value.trim();
      const userResume = document.getElementById('user-resume').value.trim();

      // Only auto-save if we have at least the name
      if (userName) {
        await chrome.storage.sync.set({
          openaiApiKey: apiKey,
          userProfile: {
            name: userName,
            resume: userResume,
            lastUpdated: Date.now()
          }
        });
        
        console.log('Settings auto-saved');
      }
    } catch (error) {
      console.error('Error auto-saving settings:', error);
    }
  }

  async testApiConnection() {
    const apiKey = document.getElementById('openai-api-key').value.trim();
    
    if (!apiKey) {
      this.showMessage('Please enter your OpenAI API key first', 'error');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      this.showMessage('Invalid API key format. OpenAI API keys start with "sk-"', 'error');
      return;
    }

    // Show loading state
    const testButton = document.getElementById('test-api');
    const originalText = testButton.textContent;
    testButton.textContent = 'Testing...';
    testButton.disabled = true;

    try {
      // Test API connection with a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.showMessage('✅ API connection successful! Your key is working correctly.', 'success');
      } else if (response.status === 401) {
        this.showMessage('❌ Invalid API key. Please check your key and try again.', 'error');
      } else if (response.status === 429) {
        this.showMessage('⚠️ Rate limit exceeded. Your API key is valid but you\'ve hit usage limits.', 'error');
      } else {
        this.showMessage(`❌ API connection failed (${response.status}). Please try again.`, 'error');
      }
    } catch (error) {
      console.error('API test error:', error);
      this.showMessage('❌ Network error. Please check your internet connection and try again.', 'error');
    } finally {
      // Restore button state
      testButton.textContent = originalText;
      testButton.disabled = false;
    }
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById('status-message');
    messageDiv.textContent = message;
    messageDiv.className = `status-message status-${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }

    // Scroll to top to ensure message is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SmartDraftOptions();
});

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showOptionsPage') {
    // Focus the window if it's already open
    window.focus();
  }
  return true;
});
