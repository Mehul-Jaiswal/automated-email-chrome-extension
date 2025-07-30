# SmartDraft Extension Troubleshooting Guide

## Common Issues and Solutions

### 1. "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received"

**Problem**: This error occurs when the background script doesn't properly handle async operations.

**Solution**: 
- The latest version has been fixed with proper async handling
- Reload the extension: Go to `chrome://extensions/`, find SmartDraft, and click the reload button
- If the issue persists, check the console for additional error messages

### 2. Extension Won't Load - Permission Errors

**Problem**: `Permission 'https://mail.google.com/*' is unknown`

**Solution**: 
- This has been fixed in the latest manifest.json
- URL permissions are now properly placed in `host_permissions`
- Reload the extension after updating

### 3. Infinite Loading When Generating Email

**Problem**: The "Generating your email with AI..." message appears indefinitely.

**Solutions**:
- **Check API Key**: Ensure your OpenAI API key is valid and has credits
- **Network Issues**: Check your internet connection
- **Timeout**: The system now has a 30-second timeout - if it takes longer, try again
- **API Limits**: You may have hit OpenAI's rate limits - wait a few minutes

### 4. Gmail Integration Not Working

**Problem**: SmartDraft buttons don't appear in Gmail.

**Solutions**:
- **Refresh Gmail**: Reload the Gmail page
- **Check URL**: Ensure you're on `mail.google.com` or `gmail.com`
- **Wait for Load**: Gmail takes time to load - wait 10-15 seconds after page load
- **Clear Cache**: Clear browser cache and reload

### 5. API Key Issues

**Problem**: "OpenAI API key not configured" or API errors.

**Solutions**:
- **Get Valid Key**: Get a new API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Check Format**: API keys start with `sk-`
- **Test Connection**: Use the "Test API Connection" button in settings
- **Check Credits**: Ensure your OpenAI account has available credits

### 6. Extension Popup Not Opening

**Problem**: Clicking the extension icon does nothing.

**Solutions**:
- **Check Console**: Open Developer Tools and check for errors
- **Reload Extension**: Go to `chrome://extensions/` and reload SmartDraft
- **Restart Browser**: Close and reopen Chrome
- **Check Permissions**: Ensure the extension has necessary permissions

## Debugging Steps

### 1. Check Extension Console
1. Go to `chrome://extensions/`
2. Find SmartDraft extension
3. Click "Inspect views: background page" or "service worker"
4. Check for error messages in the console

### 2. Check Content Script Console
1. Open Gmail
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for SmartDraft-related errors

### 3. Verify Settings
1. Click SmartDraft icon → Settings
2. Ensure API key is entered correctly
3. Fill in your name and background information
4. Test API connection

### 4. Test Step by Step
1. **Extension loads**: Check `chrome://extensions/`
2. **Popup works**: Click extension icon
3. **Settings work**: Open settings page
4. **API works**: Test API connection
5. **Gmail integration**: Check for buttons in Gmail
6. **Email generation**: Try generating a simple email

## Error Messages and Solutions

| Error Message | Solution |
|---------------|----------|
| "OpenAI API key not configured" | Add your API key in settings |
| "OpenAI API error: 401" | Invalid API key - check and update |
| "OpenAI API error: 429" | Rate limit exceeded - wait and try again |
| "Request timeout" | Network issue or API slow - try again |
| "No compose window found" | Open a Gmail compose window first |
| "Failed to generate email" | Check API key and internet connection |

## Performance Tips

1. **Keep Extension Updated**: Reload after any file changes
2. **Monitor API Usage**: Check your OpenAI usage dashboard
3. **Clear Storage**: If issues persist, clear extension storage:
   - Go to `chrome://extensions/`
   - Click SmartDraft details
   - Go to "Storage" and clear data

## Getting Help

If issues persist:

1. **Check Console Errors**: Look for specific error messages
2. **Test with Simple Request**: Try generating a basic business email
3. **Verify Prerequisites**: Ensure you have a valid OpenAI account with credits
4. **Browser Compatibility**: Ensure you're using a recent version of Chrome

## Known Limitations

- **Gmail Only**: Currently only works with Gmail
- **Internet Required**: Needs internet connection for AI generation
- **API Costs**: Uses your OpenAI credits (typically $0.002-0.005 per email)
- **English Optimized**: Works best with English emails

---

**Last Updated**: Version 1.0.0 - All major async handling issues resolved
