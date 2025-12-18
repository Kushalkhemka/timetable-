import React, { useState } from 'react';

const Ingest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [plan, setPlan] = useState<any>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMarkdown('');
    setPlan(null);
    if (!file) {
      setError('Please choose a PDF file.');
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append('file', file);
      const ingestBase = ((import.meta as any).env?.VITE_INGEST_URL || '').replace(/\/$/, '');
      const resp = await fetch(`${ingestBase || ''}/ingest`, {
        method: 'POST',
        body: form,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Server error ${resp.status}: ${txt}`);
      }
      const data = await resp.json();
      setMarkdown(data?.markdown || '');
      setPlan(data?.plan || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to ingest file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Curriculum Ingestion</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="block"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Uploading…' : 'Upload & Ingest'}
        </button>
      </form>
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
      {markdown && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-2">Extracted Markdown</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded border border-gray-200 max-h-[60vh] overflow-auto">
            {markdown}
          </pre>
        </div>
      )}
      {plan && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-2">Parsed Plan (JSON)</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded border border-gray-200 max-h-[60vh] overflow-auto">
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Ingest;


