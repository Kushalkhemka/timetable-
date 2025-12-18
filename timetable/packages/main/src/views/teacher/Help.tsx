import React from 'react';
import { Card } from 'flowbite-react';

const Help = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
      <Card className="p-6 space-y-3">
        <div className="font-semibold">Need assistance?</div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Refer to documentation or contact support.</p>
        <ul className="list-disc ps-5 text-sm text-blue-600">
          <li><a href="#">User Guide</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Contact Support</a></li>
        </ul>
      </Card>
    </div>
  );
};

export default Help;





















