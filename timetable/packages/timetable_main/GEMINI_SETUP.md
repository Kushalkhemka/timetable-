# Gemini AI Setup for Timetable Management

This guide explains how to set up Gemini AI integration for the AI Modifications page.

## Prerequisites

1. A Google account
2. Access to Google AI Studio

## Setup Steps

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with "AIza" and is about 39 characters long)

### 2. Configure Environment Variables

1. Create a `.env` file in the root of the starterkit package:
   ```bash
   # In /packages/starterkit/.env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

2. Replace `your_actual_api_key_here` with your actual Gemini API key

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## How It Works

- **With Gemini AI**: The system uses Google's Gemini AI for natural language processing, providing more intelligent responses to timetable management requests.

- **Without Gemini AI**: The system falls back to a local parser that handles basic commands like scheduling, canceling, and querying classes.

## Status Indicators

The AI Assistant interface shows:
- 🟢 **"Gemini AI"** badge when Gemini is properly configured and working
- 🟡 **"Local Parser"** badge when using the fallback system
- A warning message explaining how to enable Gemini AI

## Troubleshooting

### Common Issues

1. **"Gemini AI is not configured" message**
   - Check that your `.env` file exists and contains `VITE_GEMINI_API_KEY`
   - Verify the API key is correct and active
   - Restart the development server

2. **API key errors**
   - Ensure your API key is valid and has not expired
   - Check that you have sufficient quota in Google AI Studio
   - Verify the API key has the necessary permissions

3. **Network issues**
   - Check your internet connection
   - Ensure your firewall allows connections to Google's AI services

### Testing the Integration

Try these commands to test both modes:

**With Gemini AI:**
- "Schedule a Data Structures class for CSE-A with Dr. Smith"
- "What are Dr. Smith's free slots today?"
- "Cancel the CSE-A class in period P1"

**Local Parser (fallback):**
- The same commands will work but with simpler parsing logic

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure and don't share it publicly
- Consider using environment-specific API keys for different deployments
