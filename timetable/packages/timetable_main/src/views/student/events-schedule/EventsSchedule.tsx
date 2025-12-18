import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Icon } from '@iconify/react';

const EventsSchedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const eventCategories = [
    'Academic',
    'Cultural',
    'Sports',
    'Technical',
    'Social',
    'Workshop',
    'Seminar'
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Tech Symposium 2024',
      category: 'Technical',
      date: '2024-02-15',
      time: '09:00 AM - 05:00 PM',
      location: 'Auditorium',
      description: 'Annual technology symposium featuring latest innovations',
      organizer: 'Computer Science Department',
      status: 'Upcoming',
      registrationRequired: true,
      maxParticipants: 200,
      registeredParticipants: 150
    },
    {
      id: '2',
      title: 'Cultural Fest',
      category: 'Cultural',
      date: '2024-02-20',
      time: '06:00 PM - 10:00 PM',
      location: 'Open Air Theater',
      description: 'Annual cultural festival with performances and competitions',
      organizer: 'Cultural Committee',
      status: 'Upcoming',
      registrationRequired: false,
      maxParticipants: 500,
      registeredParticipants: 0
    },
    {
      id: '3',
      title: 'Sports Tournament',
      category: 'Sports',
      date: '2024-02-25',
      time: '08:00 AM - 06:00 PM',
      location: 'Sports Complex',
      description: 'Inter-department sports tournament',
      organizer: 'Sports Committee',
      status: 'Upcoming',
      registrationRequired: true,
      maxParticipants: 100,
      registeredParticipants: 75
    },
    {
      id: '4',
      title: 'Machine Learning Workshop',
      category: 'Workshop',
      date: '2024-03-01',
      time: '10:00 AM - 04:00 PM',
      location: 'LAB-001',
      description: 'Hands-on workshop on machine learning fundamentals',
      organizer: 'AI Research Center',
      status: 'Upcoming',
      registrationRequired: true,
      maxParticipants: 30,
      registeredParticipants: 28
    }
  ];

  const pastEvents = [
    {
      id: '5',
      title: 'Career Guidance Seminar',
      category: 'Seminar',
      date: '2024-01-10',
      time: '02:00 PM - 04:00 PM',
      location: 'Conference Hall',
      description: 'Seminar on career opportunities in tech industry',
      organizer: 'Placement Cell',
      status: 'Completed',
      registrationRequired: false,
      maxParticipants: 150,
      registeredParticipants: 120
    },
    {
      id: '6',
      title: 'New Year Celebration',
      category: 'Social',
      date: '2024-01-01',
      time: '07:00 PM - 12:00 AM',
      location: 'Student Center',
      description: 'New Year celebration with music and dance',
      organizer: 'Student Council',
      status: 'Completed',
      registrationRequired: false,
      maxParticipants: 300,
      registeredParticipants: 250
    }
  ];

  const filteredEvents = (activeTab === 'upcoming' ? upcomingEvents : pastEvents).filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(event => 
    !selectedCategory || event.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'solar:graduation-cap-line-duotone';
      case 'Cultural':
        return 'solar:music-note-line-duotone';
      case 'Sports':
        return 'solar:dumbbell-line-duotone';
      case 'Technical':
        return 'solar:microchip-line-duotone';
      case 'Social':
        return 'solar:users-group-two-rounded-line-duotone';
      case 'Workshop':
        return 'solar:hammer-line-duotone';
      case 'Seminar':
        return 'solar:presentation-graph-line-duotone';
      default:
        return 'solar:calendar-mark-line-duotone';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Cultural':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Sports':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Technical':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Social':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'Workshop':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Seminar':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events Schedule</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:calendar-mark-bold-duotone" className="mr-2" />
          Upcoming Events
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'past'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:clock-circle-line-duotone" className="mr-2" />
          Past Events
        </button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events by title, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon={getCategoryIcon(event.category)} className="text-primary text-xl" />
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:calendar-mark-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:clock-circle-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:map-point-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:user-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{event.organizer}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {event.description}
              </p>

              {event.registrationRequired && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Registration Status:</span>
                    <span className="font-medium">
                      {event.registeredParticipants}/{event.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(event.registeredParticipants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {event.status === 'Upcoming' && event.registrationRequired && (
                  <Button size="sm" className="flex-1">
                    <Icon icon="solar:user-plus-line-duotone" className="mr-2" />
                    Register
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Icon icon="solar:eye-line-duotone" className="mr-2" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Icon icon="solar:share-line-duotone" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Icon icon="solar:calendar-mark-line-duotone" className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new events.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventsSchedule;
