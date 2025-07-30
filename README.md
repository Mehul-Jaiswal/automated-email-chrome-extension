# SmartDraft - AI Email Assistant Chrome Extension

SmartDraft is a powerful Chrome extension that seamlessly integrates with Gmail to revolutionize your email drafting experience. Using OpenAI's GPT API, it generates professional, contextually appropriate emails with just a few clicks.

## Features

- 🤖 **AI-Powered Email Generation** - Generate professional emails using OpenAI's GPT API
- 📧 **Multiple Email Types** - Support for Academic, Business, Formal, and Research emails
- 🎯 **Smart Subject Lines** - Intelligent subject line suggestions
- 🎨 **Tone Customization** - Choose from Professional, Friendly, Formal, Casual, or Urgent tones
- 🔗 **Gmail Integration** - Seamless integration with Gmail's compose window
- 💾 **Local Draft Saving** - Save drafts locally before pushing to Gmail
- 👤 **Personal Context** - Uses your profile information for personalized emails
- 📊 **Usage Statistics** - Track your email generation and usage patterns

## Installation

### Prerequisites

1. **OpenAI API Key** - You'll need an OpenAI API key to use this extension
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Generate an API key at [API Keys](https://platform.openai.com/api-keys)

### Install the Extension

1. **Download or Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right corner
4. **Click "Load unpacked"** and select the extension directory
5. **Pin the extension** to your toolbar for easy access

### Initial Setup

1. **Click the SmartDraft icon** in your Chrome toolbar
2. **Click "Settings"** to open the configuration page
3. **Enter your OpenAI API Key** in the API Configuration section
4. **Fill out your profile information**:
   - Your name
   - Professional background/resume (helps AI generate more relevant emails)
5. **Click "Save Settings"**
6. **Test your API connection** using the "Test API Connection" button

## Usage

### Method 1: From Gmail Toolbar

1. **Open Gmail** in your browser
2. **Look for the SmartDraft button** in the Gmail toolbar
3. **Click the SmartDraft button** to open the AI assistant overlay

### Method 2: From Compose Window

1. **Open a Gmail compose window**
2. **Look for the "AI Draft" button** in the compose toolbar
3. **Click "AI Draft"** to open the assistant

### Generating an Email

1. **Select Email Type**: Choose from Academic, Business, Formal, or Research
2. **Enter Recipient**: Specify who you're writing to (e.g., "Dr. Smith", "John Doe")
3. **Add Subject** (optional): Leave blank for AI suggestion
4. **Describe Context**: Explain what you want to communicate
5. **Choose Tone**: Select the appropriate tone for your email
6. **Click "Generate Email"** and wait for the AI to create your draft
7. **Review the preview** and make any necessary adjustments
8. **Click "Insert into Gmail"** to add the draft to your compose window

## Configuration Options

### User Profile

- **Name**: Used in email signatures and personalization
- **Professional Background**: Helps AI understand your context and generate more relevant emails

### API Settings

- **OpenAI API Key**: Required for email generation
- **Model**: Uses GPT-3.5-turbo for optimal performance and cost

## File Structure

```
smartdraft-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Gmail integration script
├── styles.css            # Extension styling
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── options.html          # Settings page
├── options.js            # Settings functionality
├── icons/                # Extension icons
└── README.md             # This file
```

## Privacy & Security

- **API Key Storage**: Your OpenAI API key is stored securely in Chrome's sync storage
- **Local Data**: Email drafts are saved locally before being inserted into Gmail
- **No Data Collection**: SmartDraft doesn't collect or transmit your personal data
- **Open Source**: All code is available for review and audit

## Troubleshooting

### Extension Not Working

1. **Check Gmail Integration**: Ensure you're on mail.google.com or gmail.com
2. **Verify API Key**: Make sure your OpenAI API key is correctly entered
3. **Test API Connection**: Use the test button in settings to verify connectivity
4. **Reload Extension**: Try disabling and re-enabling the extension

### API Errors

- **401 Unauthorized**: Invalid API key - check your key in settings
- **429 Rate Limited**: You've exceeded your API usage limits
- **Network Error**: Check your internet connection

### Gmail Integration Issues

1. **Refresh Gmail**: Try refreshing the Gmail page
2. **Check Permissions**: Ensure the extension has permission to access Gmail
3. **Clear Cache**: Clear your browser cache and reload

## Development

### Setup Development Environment

1. Clone the repository
2. Make your changes
3. Load the unpacked extension in Chrome
4. Test your changes

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## API Usage and Costs

SmartDraft uses OpenAI's GPT-3.5-turbo model. Typical costs:
- **Email Generation**: ~$0.002-0.005 per email
- **Monthly Usage**: Varies based on usage (typically $1-10/month for regular users)

Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## Limitations

- **Requires OpenAI API Key**: You need your own API key and account
- **Internet Connection**: Requires internet for AI generation
- **Gmail Only**: Currently only works with Gmail (not other email providers)
- **English Language**: Optimized for English emails

## Future Enhancements

- [ ] Support for other email providers (Outlook, Yahoo)
- [ ] Multiple language support
- [ ] Email templates and saved prompts
- [ ] Advanced tone analysis
- [ ] Integration with Google Workspace
- [ ] Offline draft editing

## Support

For issues, questions, or feature requests:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review OpenAI API documentation for API-related issues

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Basic AI email generation
- Gmail integration
- User profile management
- Multiple email types and tones
- Local draft saving
- Usage statistics

---

**SmartDraft** - Making professional email communication effortless with AI.
