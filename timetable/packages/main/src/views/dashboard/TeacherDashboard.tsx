import React from 'react';
import { Card } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const TeacherDashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '156',
      icon: 'solar:users-group-rounded-line-duotone',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Classes',
      value: '8',
      icon: 'solar:book-2-line-duotone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Assignments Due',
      value: '23',
      icon: 'solar:document-text-line-duotone',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-5',
      changeType: 'negative'
    },
    {
      title: 'Average Grade',
      value: '87.5%',
      icon: 'solar:medal-star-line-duotone',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+3.2%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      title: 'Math Assignment #3 submitted by John Doe',
      time: '2 minutes ago',
      icon: 'solar:document-text-line-duotone',
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'grade',
      title: 'Science Quiz graded for Class 7A',
      time: '15 minutes ago',
      icon: 'solar:medal-star-line-duotone',
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'message',
      title: 'New message from Sarah Wilson',
      time: '1 hour ago',
      icon: 'solar:chat-round-line-duotone',
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Attendance marked for Class 8B',
      time: '2 hours ago',
      icon: 'solar:users-group-rounded-line-duotone',
      color: 'text-orange-600'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      class: 'Class 7A',
      time: '09:00 AM',
      room: 'Room 201',
      duration: '45 min'
    },
    {
      id: 2,
      subject: 'Science',
      class: 'Class 8B',
      time: '10:30 AM',
      room: 'Room 203',
      duration: '45 min'
    },
    {
      id: 3,
      subject: 'English',
      class: 'Class 7B',
      time: '02:00 PM',
      room: 'Room 205',
      duration: '45 min'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, Professor Smith!</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 inline mr-2" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                    <Icon icon={activity.icon} className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
        </Card>

        {/* Upcoming Classes */}
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Classes</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Schedule</button>
            </div>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Icon icon="solar:book-2-line-duotone" className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{classItem.subject}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{classItem.class} • {classItem.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{classItem.time}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{classItem.duration}</p>
                  </div>
                </div>
              ))}
            </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
              <Icon icon="solar:document-add-line-duotone" className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Create Assignment</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
              <Icon icon="solar:users-group-rounded-line-duotone" className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Mark Attendance</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
              <Icon icon="solar:medal-star-line-duotone" className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Grade Assignments</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors">
              <Icon icon="solar:chat-round-line-duotone" className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Send Message</span>
            </button>
          </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
