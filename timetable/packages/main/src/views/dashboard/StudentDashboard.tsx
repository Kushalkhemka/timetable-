import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '../../components/shared/CardBox';

const StudentDashboard = () => {
  const stats = [
    {
      title: 'Earned',
      value: '',
      icon: 'solar:settings-line-duotone',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Attendance',
      value: '92%',
      icon: 'solar:checklist-minimalistic-line-duotone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Assignments Due',
      value: '4',
      icon: 'solar:document-text-line-duotone',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'CGPA',
      value: '8.4',
      icon: 'solar:graph-up-line-duotone',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <CardBox>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <CardBox key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon 
                    icon={stat.icon} 
                    className={`w-6 h-6 ${stat.color}`}
                  />
                </div>
              </div>
            </CardBox>
          ))}
        </div>

        {/* Additional Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardBox>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted assignment for Mathematics
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Attended Physics lab session
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming exam in Chemistry
                </span>
              </div>
            </div>
          </CardBox>

          <CardBox>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon icon="solar:document-text-line-duotone" className="w-5 h-5 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View Assignments</span>
              </button>
              <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon icon="solar:calendar-line-duotone" className="w-5 h-5 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Check Schedule</span>
              </button>
              <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon icon="solar:bell-line-duotone" className="w-5 h-5 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Notifications</span>
              </button>
              <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon icon="solar:user-circle-line-duotone" className="w-5 h-5 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Profile</span>
              </button>
            </div>
          </CardBox>
        </div>
      </div>
    </CardBox>
  );
};

export default StudentDashboard;


