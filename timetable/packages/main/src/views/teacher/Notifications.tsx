import React from 'react';
import { Card, Badge } from 'flowbite-react';

const Notifications = () => {
  const items = [
    { id: 1, title: 'New message from Sarah Wilson', time: '2m' },
    { id: 2, title: 'Assignment #3 submissions reached 20/28', time: '15m' },
    { id: 3, title: 'System maintenance on Friday', time: '1h' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <Badge color="error">{items.length}</Badge>
      </div>
      <Card className="p-0 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
        {items.map(n => (
          <div key={n.id} className="p-4">
            <div className="font-medium text-gray-900 dark:text-white">{n.title}</div>
            <div className="text-xs text-gray-500">{n.time} ago</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Notifications;





















