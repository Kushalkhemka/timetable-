import React from 'react';
import { Card } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const ProgressReports = () => {
  const reports = [
    { id: 1, name: 'John Doe', improvement: '+6%', note: 'Improved in Algebra' },
    { id: 2, name: 'Sarah Wilson', improvement: '+3%', note: 'Consistent performer' },
    { id: 3, name: 'Mike Johnson', improvement: '+1%', note: 'Needs help in Grammar' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Progress Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(r => (
          <Card key={r.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-900 dark:text-white">{r.name}</div>
              <div className="text-green-600 flex items-center gap-1"><Icon icon="solar:chart-line-up-duotone"/> {r.improvement}</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgressReports;





















