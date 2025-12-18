import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Icon } from '@iconify/react';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Assignment Submission Reminder',
      message: 'Your Data Structures assignment is due tomorrow. Please submit it before 11:59 PM.',
      type: 'assignment',
      priority: 'high',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      action: 'View Assignment'
    },
    {
      id: '2',
      title: 'Exam Schedule Updated',
      message: 'The mid-term exam schedule has been updated. Please check the new dates.',
      type: 'exam',
      priority: 'high',
      timestamp: '2024-01-15T09:15:00Z',
      read: false,
      action: 'View Schedule'
    },
    {
      id: '3',
      title: 'Library Book Due',
      message: 'Your borrowed book "Introduction to Algorithms" is due in 2 days.',
      type: 'library',
      priority: 'medium',
      timestamp: '2024-01-14T16:45:00Z',
      read: true,
      action: 'Renew Book'
    },
    {
      id: '4',
      title: 'Event Registration Open',
      message: 'Registration for Tech Symposium 2024 is now open. Limited seats available.',
      type: 'event',
      priority: 'medium',
      timestamp: '2024-01-14T14:20:00Z',
      read: true,
      action: 'Register Now'
    },
    {
      id: '5',
      title: 'Fee Payment Reminder',
      message: 'Your semester fee payment is due next week. Please complete the payment.',
      type: 'fee',
      priority: 'high',
      timestamp: '2024-01-13T11:00:00Z',
      read: false,
      action: 'Pay Now'
    },
    {
      id: '6',
      title: 'Leave Application Approved',
      message: 'Your leave application for Jan 20-21 has been approved by Dr. Smith.',
      type: 'leave',
      priority: 'low',
      timestamp: '2024-01-13T08:30:00Z',
      read: true,
      action: 'View Details'
    },
    {
      id: '7',
      title: 'New Study Material Available',
      message: 'New study materials for Database Systems course have been uploaded.',
      type: 'study',
      priority: 'low',
      timestamp: '2024-01-12T15:45:00Z',
      read: true,
      action: 'Download'
    },
    {
      id: '8',
      title: 'Campus Maintenance Notice',
      message: 'The computer lab will be closed for maintenance on Jan 18th from 2-6 PM.',
      type: 'maintenance',
      priority: 'medium',
      timestamp: '2024-01-12T10:15:00Z',
      read: true,
      action: 'View Notice'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'solar:document-text-line-duotone';
      case 'exam':
        return 'solar:graduation-cap-line-duotone';
      case 'library':
        return 'solar:book-2-line-duotone';
      case 'event':
        return 'solar:calendar-mark-line-duotone';
      case 'fee':
        return 'solar:dollar-minimalistic-line-duotone';
      case 'leave':
        return 'solar:checklist-minimalistic-line-duotone';
      case 'study':
        return 'solar:bookmark-line-duotone';
      case 'maintenance':
        return 'solar:settings-line-duotone';
      default:
        return 'solar:bell-line-duotone';
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'high') return notification.priority === 'high';
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Icon icon="solar:check-read-line-duotone" className="mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:bell-line-duotone" className="mr-2" />
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'unread'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:bell-ringing-line-duotone" className="mr-2" />
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab('high')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'high'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:danger-triangle-line-duotone" className="mr-2" />
          High Priority
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all ${
              !notification.read 
                ? 'border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10' 
                : 'opacity-75'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.read ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon 
                      icon={getNotificationIcon(notification.type)} 
                      className={`text-lg ${
                        !notification.read ? 'text-primary' : 'text-gray-500'
                      }`} 
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        !notification.read ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.action}
                          </Button>
                          {!notification.read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Icon icon="solar:check-read-line-duotone" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Icon icon="solar:bell-off-line-duotone" className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {activeTab === 'unread' 
                ? 'You have no unread notifications.' 
                : 'No notifications match your current filter.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
