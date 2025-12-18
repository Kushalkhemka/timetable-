import React from 'react';

const EnvTest: React.FC = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Environment Variables Test</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>VITE_GEMINI_API_KEY:</strong> {apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found'}
        </div>
        <div>
          <strong>All env vars:</strong> {Object.keys(import.meta.env).join(', ')}
        </div>
        <div>
          <strong>Gemini vars:</strong> {Object.keys(import.meta.env).filter(key => key.includes('GEMINI')).join(', ')}
        </div>
      </div>
    </div>
  );
};

export default EnvTest;
