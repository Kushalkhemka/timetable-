import React from 'react';
import { Card, Button, Textarea } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Announcements = () => {
  const items = [
    { id: 1, title: 'Quiz on Friday', body: 'Chapter 3 and 4 will be included.', time: '1h ago' },
    { id: 2, title: 'Assignment Deadline', body: 'Math Assignment #3 due by 6 PM.', time: '2h ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <Button className="bg-blue-600 hover:bg-blue-700"><Icon icon="solar:megaphone-line-duotone" className="w-5 h-5 mr-2"/>New</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-4">
          {items.map(a => (
            <div key={a.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-white">{a.title}</div>
                <div className="text-xs text-gray-500">{a.time}</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{a.body}</div>
            </div>
          ))}
        </Card>
        <Card className="p-6 space-y-3">
          <div className="font-semibold">Create Announcement</div>
          <input className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" placeholder="Title" />
          <Textarea rows={4} placeholder="Write your message..." />
          <Button className="bg-blue-600 hover:bg-blue-700">Publish</Button>
        </Card>
      </div>
    </div>
  );
};

export default Announcements;





















