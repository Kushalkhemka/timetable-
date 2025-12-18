import React, { useEffect } from 'react';

function APIDocs() {
  useEffect(() => {
    const scriptId = 'postman-run-button';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.type = 'text/javascript';
      s.src = 'https://assets.postman.com/button/button.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">API Documentation</h1>
      <p className="mb-6 text-sm text-gray-600">
        Use the Postman Run button to import the full collection. Default variables target local servers
        at <code>http://localhost:5056</code> (backend) and <code>http://localhost:5057</code> (ingest). Update variables as needed.
      </p>

      <div
        className="mb-8"
        data-postman-action="collection/import"
        data-postman-var-1="/postman_collection.json"
      >
        <a
          href="#"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700"
        >
          Run in Postman
        </a>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Timetable Generation</h2>
          <ul className="list-disc ml-6 text-sm">
            <li><strong>POST</strong> <code>/api/generate</code> — form-data: <code>xml</code> (file), <code>name</code> (text)</li>
            <li><strong>GET</strong> <code>/api/latest-timetable</code> — latest saved timetable with sections</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Teacher Views</h2>
          <ul className="list-disc ml-6 text-sm">
            <li><strong>GET</strong> <code>/api/teacher-timetables</code> — all teachers (with classes)</li>
            <li><strong>GET</strong> <code>/api/teacher-timetable/:instructorId</code> — single teacher timetable</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Maintenance</h2>
          <ul className="list-disc ml-6 text-sm">
            <li><strong>POST</strong> <code>/api/cleanup</code> — cleanup stale/failed generations</li>
            <li><strong>GET</strong> <code>/health</code> — service health</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Ingest (OCR + Planning)</h2>
          <ul className="list-disc ml-6 text-sm">
            <li><strong>POST</strong> <code>/ingest</code> — form-data: <code>file</code> (PDF). Base URL: ingest server.</li>
            <li><strong>GET</strong> <code>/health</code> — ingest health and env flags</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default APIDocs;


