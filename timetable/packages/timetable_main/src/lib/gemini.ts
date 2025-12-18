import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from '@google/generative-ai';

let viteEnv: any = {};
try {
  viteEnv = (import.meta as any)?.env ?? {};
} catch {
  viteEnv = {};
}
const nodeEnv: any = (typeof process !== 'undefined' && process?.env) || {};
const apiKey = (viteEnv.VITE_GEMINI_API_KEY || nodeEnv.VITE_GEMINI_API_KEY || nodeEnv.GEMINI_API_KEY || 'AIzaSyDkLfv4ZxV6iSVNKb0exdUE_S80l_qphJ0') as string | undefined;

// Debug logging
console.log('Environment check:', {
  GEMINI_KEY_PREFIX: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined'
});

let cachedModel: GenerativeModel | null = null;
let isGeminiAvailable = false;

export function getGeminiModel(modelName: string = 'gemini-2.0-flash'): GenerativeModel | null {
  const key = apiKey;

  if (!key) {
    console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
    return null;
  }

  if (cachedModel) return cachedModel;

  try {
    const client = new GoogleGenerativeAI(key);
    cachedModel = client.getGenerativeModel({ model: modelName });
    isGeminiAvailable = true;
    console.log('✅ Gemini model initialized successfully with key:', key.substring(0, 10) + '...');
    return cachedModel;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini model:', error);
    isGeminiAvailable = false;
    return null;
  }
}

export function isGeminiConfigured(): boolean {
  return !!apiKey;
}

export function ensureGeminiInitialized(): boolean {
  try {
    const model = getGeminiModel();
    return !!model;
  } catch {
    return false;
  }
}

export async function generateGeminiResponse(prompt: string, systemInstruction?: string): Promise<string | null> {
  try {
    const model = getGeminiModel();
    if (!model) {
      console.warn('❌ Gemini model not available, falling back to local parser');
      console.warn('🔑 API Key status:', apiKey ? 'Present' : 'Missing');
      return null;
    }
    
    console.log('📤 Sending request to Gemini API...');
    console.log('📊 Prompt length:', prompt.length, 'characters');
    
    // Use the correct API format based on documentation
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini response received:', text.substring(0, 100) + '...');
    console.log('📊 Response length:', text.length, 'characters');
    return text;
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack?.substring(0, 300) : 'No stack'
    });
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        console.error('🔑 API Key issue detected');
      } else if (error.message.includes('quota') || error.message.includes('rate')) {
        console.error('⏱️ Rate limit or quota issue detected');
      } else if (error.message.includes('permission')) {
        console.error('🚫 Permission issue detected');
      }
    }
    
    return null;
  }
}



