import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const LessonPlans = () => {
  const plans = [
    { id: 1, title: 'Algebra Basics', subject: 'Mathematics', class: '7A', duration: '45 min', status: 'published' },
    { id: 2, title: 'Photosynthesis', subject: 'Science', class: '8B', duration: '45 min', status: 'draft' },
    { id: 3, title: 'Grammar: Nouns & Verbs', subject: 'English', class: '7B', duration: '45 min', status: 'published' },
  ];

  const statusColor = (s: string) => (s === 'published' ? 'success' : 'warning');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lesson Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create, organize, and publish lesson plans</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Icon icon="solar:document-add-line-duotone" className="w-5 h-5 mr-2" />
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">{p.subject} • Class {p.class}</div>
              <Badge color={statusColor(p.status)} className="capitalize">{p.status}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{p.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Duration: {p.duration}</p>
            <div className="flex gap-2 mt-5">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Icon icon="solar:eye-line-duotone" className="w-4 h-4 mr-1" />View</Button>
              <Button size="sm" color="gray"><Icon icon="solar:edit-line-duotone" className="w-4 h-4 mr-1" />Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LessonPlans;





















