# Chrome Web Store Privacy Practices Tab - SmartDraft

## Single Purpose Description
```
SmartDraft is an AI-powered email drafting assistant that integrates with Gmail to help users generate professional emails using OpenAI's GPT API. The extension's single purpose is to provide AI-assisted email composition directly within the Gmail interface, allowing users to create well-structured emails by specifying email type, recipient, context, and tone preferences.
```

## Permission Justifications

### activeTab Permission
**Justification:**
```
The activeTab permission is required to interact with Gmail tabs and inject the SmartDraft interface seamlessly into the Gmail experience. This permission allows the extension to:
- Detect when users are on Gmail pages
- Add SmartDraft buttons to the Gmail toolbar
- Insert AI-generated email content into Gmail compose windows
- Provide a seamless user experience without requiring broad host permissions
The extension only accesses the active Gmail tab when users explicitly interact with SmartDraft features.
```

### Host Permissions (mail.google.com, gmail.com)
**Justification:**
```
Host permissions for mail.google.com and gmail.com are required to integrate SmartDraft functionality directly into the Gmail interface. These permissions allow the extension to:
- Inject content scripts into Gmail pages to add SmartDraft buttons
- Access Gmail's DOM structure to insert generated email content
- Provide seamless integration with Gmail's compose and toolbar interfaces
- Ensure the extension works across different Gmail domains and interfaces
The extension only accesses Gmail pages and does not collect or transmit any Gmail data beyond what users explicitly generate through the AI assistant.
```

### identity Permission
**Justification:**
```
The identity permission is included for future Gmail API authentication features that will enable advanced Gmail integration capabilities. Currently, this permission is not actively used but is reserved for planned features such as:
- Direct Gmail API integration for enhanced draft management
- Improved Gmail authentication for advanced features
- Future integration with Google Workspace features
The extension does not currently use this permission for any active functionality, and when implemented, it will only be used with explicit user consent for Gmail API access.
```

### scripting Permission
**Justification:**
```
The scripting permission is required to inject content scripts into Gmail pages to provide seamless integration with Gmail's interface and functionality. This permission allows the extension to:
- Dynamically inject SmartDraft buttons into Gmail's toolbar and compose windows
- Programmatically insert AI-generated email content into Gmail compose fields
- Adapt to Gmail's dynamic interface changes and updates
- Provide real-time integration without requiring page refreshes
The scripting is limited to Gmail pages and only executes code that is part of the extension package - no remote code execution occurs.
```

### storage Permission
**Justification:**
```
The storage permission is required to save user preferences, OpenAI API keys, email drafts, and usage statistics locally on the user's device for a personalized experience. This permission allows the extension to:
- Store user's OpenAI API key securely using Chrome's encrypted sync storage
- Save user profile information (name and professional background) for email personalization
- Store generated email drafts locally before insertion into Gmail
- Track usage statistics (number of emails generated, last used date) for user reference
- Maintain user preferences and settings across browser sessions
All data is stored locally on the user's device or in Chrome's secure sync storage - no data is transmitted to external servers.
```

## Remote Code Justification
**Justification:**
```
SmartDraft does not use remote code execution. All code is contained within the extension package and no external scripts are loaded or executed. The extension communicates with OpenAI's API only to send user-provided email context and receive generated email content - no code is downloaded or executed from remote sources. The extension implements Content Security Policy to prevent any unauthorized remote code execution.
```

## Data Usage Compliance

### Data Collection and Usage
```
SmartDraft collects minimal data necessary for functionality:

COLLECTED DATA:
- User's name and professional background (stored locally for email personalization)
- OpenAI API key (stored securely in Chrome sync storage)
- Generated email drafts (stored locally before Gmail insertion)
- Basic usage statistics (email count, last used date)

DATA USAGE:
- Personal information is used only for email personalization
- API key is used only to authenticate with OpenAI's service
- Email drafts are stored temporarily for user review before insertion
- Usage statistics are displayed to the user for reference only

DATA SHARING:
- Email content is sent to OpenAI API for generation (as required for functionality)
- No other data is shared with third parties
- No data is stored on external servers
- All data remains under user control
```

### Privacy Policy Compliance
```
SmartDraft complies with Chrome Web Store Developer Program Policies through:
- Comprehensive privacy policy explaining all data collection and usage
- Minimal data collection principle - only necessary data is collected
- Local data storage - no external servers store user data
- User control - users can delete all data by uninstalling the extension
- Transparency - clear explanation of OpenAI API integration
- Security measures - input validation, rate limiting, and secure storage
```

### User Data Protection
```
SmartDraft implements multiple layers of user data protection:
- Input validation and sanitization to prevent malicious data
- Rate limiting (50 requests/hour) to prevent abuse
- Secure API key storage using Chrome's encrypted sync storage
- Content Security Policy to prevent XSS attacks
- Local data storage with no external server dependencies
- User control over all stored data through extension settings
```

## Certification Statement
```
I certify that SmartDraft's data usage complies with the Chrome Web Store Developer Program Policies. The extension:
- Collects only data necessary for its stated functionality
- Uses data only for the purposes disclosed to users
- Implements appropriate security measures to protect user data
- Provides users with control over their data
- Does not share user data with unauthorized third parties
- Maintains transparency about data collection and usage through a comprehensive privacy policy
```

## Additional Compliance Notes

### COPPA Compliance
```
SmartDraft is not intended for children under 13 and does not knowingly collect personal information from children under 13 years of age.
```

### International Compliance
```
SmartDraft follows GDPR-style privacy practices including:
- Data minimization - collecting only necessary data
- Purpose limitation - using data only for stated purposes
- User rights - providing access, modification, and deletion capabilities
- Transparency - clear privacy policy and data usage explanations
```

---

## How to Fill Out Privacy Practices Tab

1. **Go to Privacy Practices tab** in Chrome Web Store Developer Dashboard
2. **Copy each justification** from above into the corresponding field
3. **Select appropriate data usage categories** based on the descriptions above
4. **Certify compliance** with Developer Program Policies
5. **Save draft** and proceed with publication

All justifications above are compliant with Chrome Web Store policies and accurately describe SmartDraft's functionality and data usage.
