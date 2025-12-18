import React from 'react';
import CardBox from 'src/components/shared/CardBox';
import { Icon } from '@iconify/react/dist/iconify.js';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: string;
  colorClasses?: string; // e.g. text-blue-600 bg-blue-50
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClasses }) => {
  return (
    <CardBox className="p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses ?? 'bg-gray-100'}`}>
          <Icon icon={icon} className={`w-6 h-6`} />
        </div>
      </div>
    </CardBox>
  );
};

export default StatCard;




