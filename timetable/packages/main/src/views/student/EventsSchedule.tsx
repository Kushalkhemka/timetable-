import React from 'react';
import { Card, Badge } from 'flowbite-react';
import PageHeader from './components/PageHeader';

const EventsSchedule = () => {
  const events = [
    { title: 'Tech Fest', date: '2025-09-12', tag: 'Campus' },
    { title: 'Mid-term Exams', date: '2025-10-01', tag: 'Academic' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Events Schedule" subtitle="Upcoming campus and academic events" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {events.map((e, i) => (
          <Card key={i} className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.date}</p>
              </div>
              <Badge color="info">{e.tag}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsSchedule;


