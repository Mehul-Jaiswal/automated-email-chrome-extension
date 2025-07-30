// Content script for SmartDraft Chrome Extension
// Injects the AI email assistant interface into Gmail

class SmartDraftContent {
  constructor() {
    this.overlay = null;
    this.isGmailLoaded = false;
    this.composeWindow = null;
    this.init();
  }

  init() {
    // Wait for Gmail to load
    this.waitForGmail();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  waitForGmail() {
    const checkGmail = () => {
      // Check if Gmail compose button exists
      const composeButton = document.querySelector('[gh="cm"]') || 
                           document.querySelector('div[role="button"][data-tooltip*="Compose"]') ||
                           document.querySelector('.T-I.T-I-KE.L3');
      
      if (composeButton && !this.isGmailLoaded) {
        this.isGmailLoaded = true;
        this.setupSmartDraft();
      } else if (!composeButton && this.isGmailLoaded) {
        this.isGmailLoaded = false;
      }
    };

    // Check immediately and then periodically
    checkGmail();
    setInterval(checkGmail, 2000);
    
    // Also check on DOM changes
    const observer = new MutationObserver(checkGmail);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setupSmartDraft() {
    this.addSmartDraftButton();
    this.observeComposeWindows();
  }

  addSmartDraftButton() {
    // Add SmartDraft button to Gmail toolbar
    const toolbar = document.querySelector('.nH .nH .nH .no .nZ') || 
                   document.querySelector('.gb_Pc') ||
                   document.querySelector('.gb_R');
    
    if (toolbar && !document.getElementById('smartdraft-button')) {
      const smartDraftBtn = document.createElement('div');
      smartDraftBtn.id = 'smartdraft-button';
      smartDraftBtn.className = 'smartdraft-toolbar-btn';
      smartDraftBtn.innerHTML = `
        <div class="smartdraft-btn-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z"/>
          </svg>
          <span>SmartDraft</span>
        </div>
      `;
      smartDraftBtn.title = 'Open SmartDraft AI Email Assistant';
      smartDraftBtn.addEventListener('click', () => this.showOverlay());
      
      toolbar.appendChild(smartDraftBtn);
    }
  }

  observeComposeWindows() {
    // Watch for compose windows opening
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if it's a compose window
            const composeWindow = node.querySelector('.M9') || 
                                node.querySelector('[role="dialog"]') ||
                                node.querySelector('.nH.if');
            
            if (composeWindow) {
              this.addSmartDraftToCompose(composeWindow);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  addSmartDraftToCompose(composeWindow) {
    // Add SmartDraft button to compose window
    const composeToolbar = composeWindow.querySelector('.gU') || 
                          composeWindow.querySelector('.Am.Al.editable');
    
    if (composeToolbar && !composeWindow.querySelector('.smartdraft-compose-btn')) {
      const smartDraftBtn = document.createElement('div');
      smartDraftBtn.className = 'smartdraft-compose-btn';
      smartDraftBtn.innerHTML = `
        <button type="button" class="smartdraft-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z"/>
          </svg>
          AI Draft
        </button>
      `;
      
      smartDraftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.composeWindow = composeWindow;
        this.showOverlay();
      });
      
      composeToolbar.appendChild(smartDraftBtn);
    }
  }

  async showOverlay() {
    if (this.overlay) {
      this.overlay.style.display = 'flex';
      return;
    }

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'smartdraft-overlay';
    this.overlay.innerHTML = await this.getOverlayHTML();
    
    document.body.appendChild(this.overlay);
    
    // Setup overlay event listeners
    this.setupOverlayEvents();
    
    // Load user profile
    this.loadUserProfile();
  }

  async getOverlayHTML() {
    return `
      <div class="smartdraft-modal">
        <div class="smartdraft-header">
          <h2>SmartDraft AI Email Assistant</h2>
          <button class="smartdraft-close" id="smartdraft-close">×</button>
        </div>
        
        <div class="smartdraft-content">
          <div class="smartdraft-form">
            <div class="form-group">
              <label for="email-type">Email Type:</label>
              <select id="email-type">
                <option value="business">Business</option>
                <option value="academic">Academic</option>
                <option value="formal">Formal</option>
                <option value="research">Research</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="recipient">Recipient:</label>
              <input type="text" id="recipient" placeholder="e.g., Dr. Smith, John Doe, etc.">
            </div>
            
            <div class="form-group">
              <label for="subject">Subject (optional):</label>
              <input type="text" id="subject" placeholder="Leave blank for AI suggestion">
            </div>
            
            <div class="form-group">
              <label for="context">Context/Purpose:</label>
              <textarea id="context" rows="3" placeholder="Describe what you want to communicate..."></textarea>
            </div>
            
            <div class="form-group">
              <label for="tone">Tone:</label>
              <select id="tone">
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div class="smartdraft-actions">
              <button id="generate-email" class="btn-primary">Generate Email</button>
              <button id="cancel-draft" class="btn-secondary">Cancel</button>
            </div>
          </div>
          
          <div class="smartdraft-preview" id="email-preview" style="display: none;">
            <h3>Generated Email Preview</h3>
            <div class="preview-content">
              <div class="preview-subject">
                <strong>Subject:</strong> <span id="preview-subject"></span>
              </div>
              <div class="preview-body">
                <strong>Body:</strong>
                <div id="preview-body"></div>
              </div>
            </div>
            <div class="preview-actions">
              <button id="insert-email" class="btn-primary">Insert into Gmail</button>
              <button id="regenerate-email" class="btn-secondary">Regenerate</button>
              <button id="edit-draft" class="btn-secondary">Edit</button>
            </div>
          </div>
          
          <div class="smartdraft-loading" id="loading-indicator" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Generating your email with AI...</p>
          </div>
        </div>
      </div>
    `;
  }

  setupOverlayEvents() {
    // Close overlay
    document.getElementById('smartdraft-close').addEventListener('click', () => {
      this.hideOverlay();
    });
    
    document.getElementById('cancel-draft').addEventListener('click', () => {
      this.hideOverlay();
    });
    
    // Generate email
    document.getElementById('generate-email').addEventListener('click', () => {
      this.generateEmail();
    });
    
    // Insert email into Gmail
    document.getElementById('insert-email').addEventListener('click', () => {
      this.insertEmailIntoGmail();
    });
    
    // Regenerate email
    document.getElementById('regenerate-email').addEventListener('click', () => {
      this.generateEmail();
    });
    
    // Close overlay when clicking outside
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hideOverlay();
      }
    });
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }

  async loadUserProfile() {
    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'getUserProfile'
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
      
      if (response && response.success && response.data) {
        this.userProfile = response.data;
      } else {
        // No profile found, user needs to set it up
        console.log('No user profile found');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  async generateEmail() {
    const emailType = document.getElementById('email-type').value;
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const context = document.getElementById('context').value;
    const tone = document.getElementById('tone').value;
    
    if (!recipient || !context) {
      alert('Please fill in the recipient and context fields.');
      return;
    }
    
    // Show loading
    document.getElementById('loading-indicator').style.display = 'block';
    document.querySelector('.smartdraft-form').style.display = 'none';
    document.getElementById('email-preview').style.display = 'none';
    
    try {
      const response = await new Promise((resolve, reject) => {
        // Add timeout to prevent infinite waiting
        const timeout = setTimeout(() => {
          reject(new Error('Request timeout - please try again'));
        }, 30000); // 30 second timeout
        
        chrome.runtime.sendMessage({
          action: 'generateEmail',
          data: {
            emailType,
            recipient,
            subject,
            context,
            tone,
            userProfile: this.userProfile
          }
        }, (response) => {
          clearTimeout(timeout);
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
      
      if (response && response.success) {
        this.showEmailPreview(response.data);
      } else {
        throw new Error(response?.error || 'Failed to generate email');
      }
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Error generating email: ' + error.message);
      this.showForm();
    }
  }

  showEmailPreview(emailData) {
    document.getElementById('loading-indicator').style.display = 'none';
    document.querySelector('.smartdraft-form').style.display = 'none';
    document.getElementById('email-preview').style.display = 'block';
    
    document.getElementById('preview-subject').textContent = emailData.subject;
    document.getElementById('preview-body').innerHTML = emailData.body.replace(/\n/g, '<br>');
    
    this.currentEmailDraft = emailData;
  }

  showForm() {
    document.getElementById('loading-indicator').style.display = 'none';
    document.querySelector('.smartdraft-form').style.display = 'block';
    document.getElementById('email-preview').style.display = 'none';
  }

  insertEmailIntoGmail() {
    if (!this.currentEmailDraft) return;
    
    // Find the active compose window
    const composeWindow = this.composeWindow || document.querySelector('.M9');
    if (!composeWindow) {
      alert('No compose window found. Please open a compose window first.');
      return;
    }
    
    // Insert subject
    const subjectField = composeWindow.querySelector('input[name="subjectbox"]') ||
                        composeWindow.querySelector('[placeholder*="Subject"]');
    if (subjectField) {
      subjectField.value = this.currentEmailDraft.subject;
      subjectField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Insert body
    const bodyField = composeWindow.querySelector('[role="textbox"]') ||
                     composeWindow.querySelector('.Am.Al.editable');
    if (bodyField) {
      bodyField.innerHTML = this.currentEmailDraft.body.replace(/\n/g, '<br>');
      bodyField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    this.hideOverlay();
    alert('Email draft inserted successfully!');
  }

  handleMessage(request, sender, sendResponse) {
    // Handle messages from background script if needed
    return true;
  }
}

// Initialize SmartDraft when the content script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SmartDraftContent();
  });
} else {
  new SmartDraftContent();
}
