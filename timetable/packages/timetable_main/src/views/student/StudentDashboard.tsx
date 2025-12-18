import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Icon } from '@iconify/react';
import { Link } from 'react-router';

const StudentDashboard: React.FC = () => {
  const quickActions = [
    {
      title: 'My Timetable',
      description: 'View your personal class schedule',
      icon: 'solar:calendar-mark-bold-duotone',
      link: '/student/timetable/my-timetable',
      color: 'text-blue-600'
    },
    {
      title: 'Leave Application',
      description: 'Apply for leave or check status',
      icon: 'solar:document-add-line-duotone',
      link: '/student/leave-application',
      color: 'text-green-600'
    },
    {
      title: 'Notifications',
      description: 'Check important announcements',
      icon: 'solar:bell-line-duotone',
      link: '/student/notifications',
      color: 'text-orange-600'
    },
    {
      title: 'To Do List',
      description: 'Manage your tasks and assignments',
      icon: 'solar:checklist-minimalistic-line-duotone',
      link: '/student/todo-list',
      color: 'text-purple-600'
    },
    {
      title: 'Internships',
      description: 'Find and apply for internship opportunities',
      icon: 'mdi:briefcase-outline',
      link: '/student/internships',
      color: 'text-indigo-600'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Mid-term Exam',
      date: 'Jan 25, 2024',
      time: '09:00 AM',
      subject: 'Database Systems',
      type: 'exam'
    },
    {
      title: 'Assignment Due',
      date: 'Jan 20, 2024',
      time: '11:59 PM',
      subject: 'Data Structures',
      type: 'assignment'
    },
    {
      title: 'Tech Symposium',
      date: 'Feb 15, 2024',
      time: '09:00 AM',
      subject: 'General',
      type: 'event'
    }
  ];

  const recentNotifications = [
    {
      title: 'Assignment Submission Reminder',
      message: 'Your Data Structures assignment is due tomorrow.',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      title: 'Exam Schedule Updated',
      message: 'The mid-term exam schedule has been updated.',
      time: '5 hours ago',
      priority: 'high'
    },
    {
      title: 'Library Book Due',
      message: 'Your borrowed book is due in 2 days.',
      time: '1 day ago',
      priority: 'medium'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return 'solar:graduation-cap-line-duotone';
      case 'assignment':
        return 'solar:document-text-line-duotone';
      case 'event':
        return 'solar:calendar-mark-line-duotone';
      default:
        return 'solar:clock-circle-line-duotone';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Icon icon="solar:calendar-mark-line-duotone" className="text-xs" />
            6th Semester
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Icon icon="solar:graduation-cap-line-duotone" className="text-xs" />
            Computer Science
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center`}>
                    <Icon icon={action.icon} className={`text-lg text-primary`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="solar:calendar-mark-bold-duotone" className="text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon icon={getEventIcon(event.type)} className="text-primary text-sm" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{event.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Icon icon="solar:calendar-mark-line-duotone" className="mr-2" />
              View All Events
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="solar:bell-line-duotone" className="text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Icon icon="solar:bell-ringing-line-duotone" className="mr-2" />
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:clock-circle-line-duotone" className="text-primary" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Data Structures</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">CS-101 • Dr. Smith</p>
              </div>
              <Badge variant="outline">09:00 - 10:00</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Algorithms</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">CS-102 • Dr. Johnson</p>
              </div>
              <Badge variant="outline">10:00 - 11:00</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Database Systems</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">CS-103 • Dr. Brown</p>
              </div>
              <Badge variant="outline">11:00 - 12:00</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Icon icon="solar:calendar-line-duotone" className="mr-2" />
            View Full Timetable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
