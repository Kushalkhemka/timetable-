import React from 'react';
import { Card, Button, Textarea } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Messages = () => {
  const threads = [
    { id: 1, name: 'John Doe', snippet: 'Submitted the assignment...', time: '2m' },
    { id: 2, name: 'Sarah Wilson', snippet: 'Can I get an extension?', time: '15m' },
    { id: 3, name: 'Parents Group 7A', snippet: 'PTM scheduled for Friday', time: '1h' },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-0 overflow-hidden lg:col-span-1">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold">Conversations</div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {threads.map(t => (
            <div key={t.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                <span className="text-xs text-gray-500">{t.time}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{t.snippet}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Mike Nielsen</div>
          <Button color="gray" size="sm"><Icon icon="solar:bell-line-duotone" className="w-4 h-4 mr-1"/>Notify</Button>
        </div>
        <div className="space-y-3 max-h-[50vh] overflow-auto">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 w-fit">Hello Professor!</div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900 w-fit ms-auto">Hi Mike, how can I help?</div>
        </div>
        <div className="mt-4 flex gap-2">
          <Textarea rows={2} className="flex-1" placeholder="Type a message..." />
          <Button className="bg-blue-600 hover:bg-blue-700"><Icon icon="solar:paper-plane-line-duotone" className="w-5 h-5"/></Button>
        </div>
      </Card>
    </div>
  );
};

export default Messages;





















