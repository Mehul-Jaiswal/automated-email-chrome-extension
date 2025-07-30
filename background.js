// Background service worker for SmartDraft Chrome Extension

class SmartDraftBackground {
  constructor() {
    this.init();
  }

  init() {
    // Listen for extension installation
    chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    
    // Listen for messages from content script and popup
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Listen for tab updates to inject content script
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
  }

  async handleInstall(details) {
    if (details.reason === 'install') {
      // Open options page on first install
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
  }

  handleMessage(request, sender, sendResponse) {
    // Handle async operations properly
    (async () => {
      try {
        switch (request.action) {
          case 'generateEmail':
            const emailDraft = await this.generateEmailWithAI(request.data);
            sendResponse({ success: true, data: emailDraft });
            break;
            
          case 'saveToGmailDrafts':
            const draftResult = await this.saveToGmailDrafts(request.data);
            sendResponse({ success: true, data: draftResult });
            break;
            
          case 'authenticateGmail':
            const authResult = await this.authenticateGmail();
            sendResponse({ success: true, data: authResult });
            break;
            
          case 'getUserProfile':
            const profile = await this.getUserProfile();
            sendResponse({ success: true, data: profile });
            break;
            
          case 'saveUserProfile':
            await this.saveUserProfile(request.data);
            sendResponse({ success: true });
            break;
            
          default:
            sendResponse({ success: false, error: 'Unknown action' });
        }
      } catch (error) {
        console.error('Background script error:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true; // Keep message channel open for async response
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    // Content script is already injected via manifest, no need to inject manually
    // This prevents the executeScript error
  }

  async generateEmailWithAI(data) {
    const { emailType, recipient, subject, context, tone, userProfile } = data;
    
    // Input validation and sanitization
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input data');
    }
    
    // Sanitize inputs
    const sanitizedData = this.sanitizeInputs({
      emailType: String(emailType || 'business'),
      recipient: String(recipient || '').trim(),
      subject: String(subject || '').trim(),
      context: String(context || '').trim(),
      tone: String(tone || 'professional')
    });
    
    // Validate required fields
    if (!sanitizedData.recipient || !sanitizedData.context) {
      throw new Error('Recipient and context are required fields');
    }
    
    // Rate limiting check
    if (!(await this.checkRateLimit())) {
      throw new Error('Rate limit exceeded. Please wait before generating another email.');
    }
    
    // Get OpenAI API key from storage
    const result = await chrome.storage.sync.get(['openaiApiKey']);
    if (!result.openaiApiKey) {
      throw new Error('OpenAI API key not configured. Please set it in the options page.');
    }

    const prompt = this.buildEmailPrompt(sanitizedData.emailType, sanitizedData.recipient, sanitizedData.subject, sanitizedData.context, sanitizedData.tone, userProfile);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional email writing assistant. Generate well-structured, appropriate emails based on the given parameters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      const emailContent = aiResponse.choices[0].message.content;
      
      // Parse the email content to extract subject and body
      const parsedEmail = this.parseEmailContent(emailContent);
      
      // Save draft locally
      await this.saveDraftLocally({
        ...parsedEmail,
        timestamp: Date.now(),
        emailType,
        recipient
      });
      
      return parsedEmail;
      
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error(`Failed to generate email: ${error.message}`);
    }
  }

  buildEmailPrompt(emailType, recipient, subject, context, tone, userProfile) {
    return `
Generate a ${emailType} email with the following details:

Email Type: ${emailType}
Recipient: ${recipient}
Subject: ${subject || 'Please suggest an appropriate subject'}
Context/Purpose: ${context}
Tone: ${tone}

Sender Information:
Name: ${userProfile?.name || 'User'}
${userProfile?.resume ? `Background: ${userProfile.resume}` : ''}

Please format the response as:
SUBJECT: [suggested subject line]
BODY: [email body content]

Make sure the email is:
- Professional and appropriate for the ${emailType} context
- Uses the ${tone} tone
- Well-structured with proper greeting and closing
- Incorporates relevant details from the sender's background when appropriate
`;
  }

  parseEmailContent(content) {
    const lines = content.split('\n');
    let subject = '';
    let body = '';
    let isBody = false;

    for (const line of lines) {
      if (line.startsWith('SUBJECT:')) {
        subject = line.replace('SUBJECT:', '').trim();
      } else if (line.startsWith('BODY:')) {
        isBody = true;
        body = line.replace('BODY:', '').trim();
      } else if (isBody) {
        body += '\n' + line;
      }
    }

    return {
      subject: subject || 'Generated Email',
      body: body.trim() || content
    };
  }

  async saveDraftLocally(draft) {
    const result = await chrome.storage.local.get(['drafts']);
    const drafts = result.drafts || [];
    drafts.push(draft);
    await chrome.storage.local.set({ drafts });
  }

  async saveToGmailDrafts(draftData) {
    // This would require Gmail API integration
    // For now, return a placeholder
    return { success: true, message: 'Draft saved locally. Gmail integration requires additional setup.' };
  }

  async authenticateGmail() {
    try {
      const token = await chrome.identity.getAuthToken({ interactive: true });
      return { token, authenticated: true };
    } catch (error) {
      throw new Error(`Gmail authentication failed: ${error.message}`);
    }
  }

  async getUserProfile() {
    const result = await chrome.storage.sync.get(['userProfile']);
    return result.userProfile || null;
  }

  async saveUserProfile(profile) {
    // Validate and sanitize profile data
    const sanitizedProfile = {
      name: String(profile.name || '').trim().substring(0, 100),
      resume: String(profile.resume || '').trim().substring(0, 5000),
      lastUpdated: Date.now()
    };
    
    await chrome.storage.sync.set({ userProfile: sanitizedProfile });
  }

  // Security helper methods
  sanitizeInputs(data) {
    const allowedEmailTypes = ['business', 'academic', 'formal', 'research'];
    const allowedTones = ['professional', 'friendly', 'formal', 'casual', 'urgent'];
    
    return {
      emailType: allowedEmailTypes.includes(data.emailType) ? data.emailType : 'business',
      recipient: data.recipient.substring(0, 200), // Limit length
      subject: data.subject.substring(0, 200),
      context: data.context.substring(0, 2000),
      tone: allowedTones.includes(data.tone) ? data.tone : 'professional'
    };
  }

  async checkRateLimit() {
    const now = Date.now();
    const result = await chrome.storage.local.get(['rateLimitData']);
    const rateLimitData = result.rateLimitData || { requests: [], lastReset: now };
    
    // Reset if more than 1 hour has passed
    if (now - rateLimitData.lastReset > 3600000) {
      rateLimitData.requests = [];
      rateLimitData.lastReset = now;
    }
    
    // Remove requests older than 1 hour
    rateLimitData.requests = rateLimitData.requests.filter(time => now - time < 3600000);
    
    // Check if under limit (max 50 requests per hour)
    if (rateLimitData.requests.length >= 50) {
      return false;
    }
    
    // Add current request
    rateLimitData.requests.push(now);
    await chrome.storage.local.set({ rateLimitData });
    
    return true;
  }

  // Update usage statistics securely
  async updateStats() {
    const result = await chrome.storage.local.get(['stats']);
    const stats = result.stats || {
      emailsGenerated: 0,
      lastUsed: null
    };
    
    stats.emailsGenerated = Math.min(stats.emailsGenerated + 1, 999999); // Prevent overflow
    stats.lastUsed = Date.now();
    
    await chrome.storage.local.set({ stats });
  }
}

// Initialize the background service
new SmartDraftBackground();
