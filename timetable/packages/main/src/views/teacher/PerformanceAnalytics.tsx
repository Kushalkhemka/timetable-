import React from 'react';
import { Card } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Metric = ({ icon, label, value, change }: { icon: string; label: string; value: string; change: string }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change} vs last term</div>
      </div>
      <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900">
        <Icon icon={icon} className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </Card>
);

const PerformanceAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric icon="solar:medal-star-line-duotone" label="Average Grade" value="87.5%" change="+3.2%" />
        <Metric icon="solar:document-text-line-duotone" label="Submission Rate" value="82%" change="+5%" />
        <Metric icon="solar:users-group-rounded-line-duotone" label="Attendance" value="93%" change="+1%" />
        <Metric icon="solar:chat-round-line-duotone" label="Engagement" value="76%" change="+4%" />
      </div>
    </div>
  );
};

export default PerformanceAnalytics;





















