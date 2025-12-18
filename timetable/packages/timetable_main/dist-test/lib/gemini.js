import { GoogleGenerativeAI } from '@google/generative-ai';
let viteEnv = {};
try {
    viteEnv = import.meta?.env ?? {};
}
catch {
    viteEnv = {};
}
const nodeEnv = (typeof process !== 'undefined' && process?.env) || {};
const apiKey = (viteEnv.VITE_GEMINI_API_KEY || nodeEnv.VITE_GEMINI_API_KEY || nodeEnv.GEMINI_API_KEY || 'AIzaSyDkLfv4ZxV6iSVNKb0exdUE_S80l_qphJ0');
// Debug logging
console.log('Environment check:', {
    GEMINI_KEY_PREFIX: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined'
});
let cachedModel = null;
let isGeminiAvailable = false;
export function getGeminiModel(modelName = 'gemini-2.0-flash') {
    const key = apiKey;
    if (!key) {
        console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
        return null;
    }
    if (cachedModel)
        return cachedModel;
    try {
        const client = new GoogleGenerativeAI(key);
        cachedModel = client.getGenerativeModel({ model: modelName });
        isGeminiAvailable = true;
        console.log('✅ Gemini model initialized successfully with key:', key.substring(0, 10) + '...');
        return cachedModel;
    }
    catch (error) {
        console.error('❌ Failed to initialize Gemini model:', error);
        isGeminiAvailable = false;
        return null;
    }
}
export function isGeminiConfigured() {
    return !!apiKey;
}
export function ensureGeminiInitialized() {
    try {
        const model = getGeminiModel();
        return !!model;
    }
    catch {
        return false;
    }
}
export async function generateGeminiResponse(prompt, systemInstruction) {
    try {
        const model = getGeminiModel();
        if (!model) {
            console.warn('Gemini model not available, falling back to local parser');
            return null;
        }
        // Use the correct API format based on documentation
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('✅ Gemini response received:', text.substring(0, 100) + '...');
        return text;
    }
    catch (error) {
        console.error('Gemini API error:', error);
        return null;
    }
}
