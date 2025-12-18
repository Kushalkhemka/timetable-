import React, { useEffect, useState } from 'react';
import { getGeminiModel, isGeminiConfigured, generateGeminiResponse } from '../../lib/gemini';

const EnvTestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Test environment variables
    console.log('Environment variables test:');
    console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'Set' : 'Not set');
    console.log('All env vars:', Object.keys(import.meta.env));
    console.log('Gemini vars:', Object.keys(import.meta.env).filter(key => key.includes('GEMINI')));
    
    // Test Gemini configuration
    const isConfigured = isGeminiConfigured();
    console.log('Is Gemini configured:', isConfigured);
    
    const model = getGeminiModel();
    console.log('Gemini model:', model ? 'Available' : 'Not available');
  }, []);

  const testGeminiAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing Gemini API...');
    
    try {
      const response = await generateGeminiResponse('Hello, please respond with "Gemini API is working!"');
      if (response) {
        setTestResult(`✅ Success: ${response}`);
      } else {
        setTestResult('❌ Failed: No response from Gemini API');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables & Gemini API Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>VITE_GEMINI_API_KEY:</strong> {import.meta.env.VITE_GEMINI_API_KEY ? `${import.meta.env.VITE_GEMINI_API_KEY.substring(0, 10)}...` : 'Not found'}
            </div>
            <div>
              <strong>All env vars:</strong> {Object.keys(import.meta.env).join(', ')}
            </div>
            <div>
              <strong>Gemini vars:</strong> {Object.keys(import.meta.env).filter(key => key.includes('GEMINI')).join(', ')}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Gemini Configuration</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Is Configured:</strong> {isGeminiConfigured() ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Model Available:</strong> {getGeminiModel() ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">API Test</h2>
          <button
            onClick={testGeminiAPI}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Gemini API'}
          </button>
          {testResult && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border">
              <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvTestPage;
