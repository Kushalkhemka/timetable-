import React from 'react';
import { Card, Badge } from 'flowbite-react';
import PageHeader from './components/PageHeader';

const StudentNotifications = () => {
  const notifications = [
    { title: 'Assignment due tomorrow', time: '2h ago', unread: true },
    { title: 'New event: Tech Fest', time: '1d ago', unread: false },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Notifications" subtitle="Latest updates" />
      <Card className="p-0">
        <ul className="divide-y">
          {notifications.map((n, i) => (
            <li key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className={`font-medium ${n.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700'}`}>{n.title}</p>
                <p className="text-xs text-gray-500">{n.time}</p>
              </div>
              {n.unread ? <Badge color="failure">New</Badge> : null}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default StudentNotifications;


