import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Schedule = () => {
  const today = [
    { id: 1, subject: 'Mathematics', class: 'Class 7A', room: '201', time: '09:00 AM', duration: '45 min' },
    { id: 2, subject: 'Science', class: 'Class 8B', room: '203', time: '10:30 AM', duration: '45 min' },
    { id: 3, subject: 'English', class: 'Class 7B', room: '205', time: '02:00 PM', duration: '45 min' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Daily and weekly schedule overview</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Classes</h3>
        <div className="space-y-4">
          {today.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Icon icon="solar:book-2-line-duotone" className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{c.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.class} • Room {c.room}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">{c.time}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{c.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Parent-Teacher Meet</span>
              <Badge color="success">Tomorrow</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">3:00 PM • Auditorium</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Assignment Deadline</span>
              <Badge color="warning">Fri</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Math Assignment #3</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Workshop</span>
              <Badge color="info">Next Week</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">STEM Teaching Methods</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;





















