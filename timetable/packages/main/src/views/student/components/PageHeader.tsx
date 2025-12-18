import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, icon }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <Icon icon={icon} className="w-5 h-5" />
          </span>
        ) : null}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle ? (
          <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex-shrink-0">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;


