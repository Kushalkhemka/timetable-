import React, { useState } from 'react';

export const ModernCalendarDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date(2027, 9, 5)); // October 5, 2027
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredCalendars, setFilteredCalendars] = useState({
    'My Schedules': true,
    'Task and Events': true,
    'Projects': false,
    'Holidays': false
  });
  const [filteredCategories, setFilteredCategories] = useState({
    'Work': true,
    'Education': true,
    'Personal': true
  });
  const [customCalendars, setCustomCalendars] = useState<string[]>([]);
  const [customOthers, setCustomOthers] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<Array<{name: string, color: string}>>([]);
  const [tasks, setTasks] = useState({
    'Office': [
      { id: 1, name: 'Meeting with Clients', completed: true },
      { id: 2, name: 'Create an adaptive UI', completed: false },
      { id: 3, name: 'Design & wireframe for iOS', completed: false },
      { id: 4, name: 'Meeting with My Team', completed: false }
    ],
    'My Perfect Day': [
      { id: 5, name: 'Buy lamp for lovely Grandpa', completed: true },
      { id: 6, name: 'Go to Jolly\'s Mart', completed: false },
      { id: 7, name: 'Pick burger at Mama Bear Cafe', completed: true },
      { id: 8, name: 'Order Pizza for big fams', completed: false },
      { id: 9, name: 'Pick wife for shopping', completed: false },
      { id: 10, name: 'Go to clinic for checkup', completed: false }
    ],
    'Life Has a Story': [
      { id: 11, name: 'Breakfast at Tom\'s House', completed: true },
      { id: 12, name: 'Cycling Through The Valley', completed: true },
      { id: 13, name: 'Buying Household Necessities', completed: true },
      { id: 14, name: 'Meeting with Andy', completed: false },
      { id: 15, name: 'Taking Angel to Piano Lessons', completed: false }
    ]
  });

  // Navigation functions
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Task management functions
  const toggleTask = (category: string, taskId: number) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const addTask = (category: string, taskName: string) => {
    if (!taskName.trim()) return;
    const newTask = {
      id: Date.now(),
      name: taskName,
      completed: false
    };
    setTasks(prev => ({
      ...prev,
      [category]: [...prev[category], newTask]
    }));
  };

  const deleteTask = (category: string, taskId: number) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].filter(task => task.id !== taskId)
    }));
  };

  // Calendar filter functions
  const toggleCalendarFilter = (calendar: string) => {
    setFilteredCalendars(prev => ({
      ...prev,
      [calendar]: !prev[calendar]
    }));
  };

  const toggleCategoryFilter = (category: string) => {
    setFilteredCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Get filtered events based on calendar and category filters
  const getFilteredEvents = () => {
    return events.filter(event => {
      // This is a simplified filter - in a real app, events would have calendar and category properties
      return true; // For now, show all events
    });
  };

  // Get task progress
  const getTaskProgress = (category: string) => {
    const categoryTasks = tasks[category];
    const completed = categoryTasks.filter(task => task.completed).length;
    return `${completed}/${categoryTasks.length}`;
  };

  // Add new calendar
  const addNewCalendar = () => {
    const name = prompt('Enter calendar name:');
    if (name && name.trim()) {
      setCustomCalendars(prev => [...prev, name.trim()]);
      setFilteredCalendars(prev => ({ ...prev, [name.trim()]: true }));
    }
  };

  // Add new other item
  const addNewOther = () => {
    const name = prompt('Enter item name:');
    if (name && name.trim()) {
      setCustomOthers(prev => [...prev, name.trim()]);
    }
  };

  // Add new category
  const addNewCategory = () => {
    const name = prompt('Enter category name:');
    if (name && name.trim()) {
      const colors = ['#1d62f0', '#a644ff', '#ff9500', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCustomCategories(prev => [...prev, { name: name.trim(), color: randomColor }]);
      setFilteredCategories(prev => ({ ...prev, [name.trim()]: true }));
    }
  };

  const events = [
    {
      id: '1',
      title: 'Go to clinic for checkup',
      time: '10:20 AM - 12:30 PM',
      backgroundColor: '#EAF1FF',
      day: 'Monday, 4',
      timeSlot: '10 AM',
      users: 1
    },
    {
      id: '2',
      title: 'Meeting with Team',
      time: '7:45 - 9 AM',
      backgroundColor: '#F1EAFC',
      day: 'Tuesday, 5',
      timeSlot: '8 AM',
      users: 9
    },
    {
      id: '3',
      title: 'Book Discussion',
      time: '9:30 - 10:30 AM',
      backgroundColor: '#DCF8E1',
      day: 'Tuesday, 5',
      timeSlot: '9 AM',
      users: 2
    },
    {
      id: '4',
      title: 'Restore Inner Power',
      time: '12 - 3 PM',
      backgroundColor: '#FFD5DD',
      day: 'Wednesday, 6',
      timeSlot: '12 PM',
      users: 1
    },
    {
      id: '5',
      title: 'Brief for reference, color, style',
      time: '10 - 12 PM',
      backgroundColor: '#FFE9CB',
      day: 'Thursday, 7',
      timeSlot: '10 AM',
      users: 5
    },
    {
      id: '6',
      title: 'Breakfast at Oka\'s House',
      time: '8 - 19:45 PM',
      backgroundColor: '#DEF4FE',
      day: 'Friday, 8',
      timeSlot: '8 AM',
      users: 1
    }
  ];

  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'
  ];

  const days = [
    'Monday, 4', 'Tuesday, 5', 'Wednesday, 6', 'Thursday, 7', 'Friday, 8', 'Saturday, 9'
  ];

  const taskLists = [
    {
      title: 'Office',
      progress: '1/4',
      tasks: [
        { name: 'Meeting with Clients', completed: true },
        { name: 'Create an adaptive UI', completed: false },
        { name: 'Design & wireframe for iOS', completed: false },
        { name: 'Meeting with My Team', completed: false }
      ]
    },
    {
      title: 'My Perfect Day',
      progress: '2/6',
      tasks: [
        { name: 'Buy lamp for lovely Grandpa', completed: true },
        { name: 'Go to Jolly\'s Mart', completed: false },
        { name: 'Pick burger at Mama Bear Cafe', completed: true },
        { name: 'Order Pizza for big fams', completed: false },
        { name: 'Pick wife for shopping', completed: false },
        { name: 'Go to clinic for checkup', completed: false }
      ]
    },
    {
      title: 'Life Has a Story',
      progress: '3/5',
      tasks: [
        { name: 'Breakfast at Tom\'s House', completed: true },
        { name: 'Cycling Through The Valley', completed: true },
        { name: 'Buying Household Necessities', completed: true },
        { name: 'Meeting with Andy', completed: false },
        { name: 'Taking Angel to Piano Lessons', completed: false }
      ]
    }
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
      />
      <div className="min-h-screen bg-gray-50 font-['Poppins']">
        {/* Desktop Layout */}
        <div className="hidden lg:flex">
          {/* Main Content */}
          <div className="flex w-full">
            {/* Left Sidebar */}
            <div className="w-80 bg-white shadow-sm border-r border-gray-200 h-screen overflow-y-auto">
              <div className="p-6">
                {/* Mini Calendar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">October 2027</h2>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day} className="text-center text-xs text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, index) => {
                      const day = index - 6;
                      const isCurrentMonth = day > 0 && day <= 31;
                      const isToday = day === 5;
                      const isSelected = day === 5;
                      
                      return (
                        <button
                          key={index}
                          className={`w-8 h-8 text-xs rounded-full flex items-center justify-center ${
                            isToday ? 'bg-blue-600 text-white' :
                            isSelected ? 'bg-blue-100 text-blue-600' :
                            isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' :
                            'text-gray-400'
                          }`}
                        >
                          {isCurrentMonth ? day : day <= 0 ? day + 31 : day - 31}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* My Calendars */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">My Calendars</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(filteredCalendars).map(([name, checked]) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCalendarFilter(name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{name}</span>
                      </label>
                    ))}
                    {customCalendars.map((calendar) => (
                      <label key={calendar} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filteredCalendars[calendar] || false}
                          onChange={() => toggleCalendarFilter(calendar)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{calendar}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    onClick={addNewCalendar}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add New
                  </button>
                </div>

                {/* Others */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Others</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Birthday', checked: true },
                      { name: 'Fitness', checked: false },
                      { name: 'Camping', checked: false }
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </label>
                    ))}
                    {customOthers.map((other) => (
                      <label key={other} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{other}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    onClick={addNewOther}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add New
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Work', color: '#1d62f0' },
                      { name: 'Education', color: '#a644ff' },
                      { name: 'Personal', color: '#ff9500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                    ))}
                    {customCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={addNewCategory}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add New
                  </button>
                </div>
              </div>
            </div>

            {/* Main Calendar Area */}
            <div className="flex-1 p-6">
              {/* Calendar Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">October 2027</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={goToToday}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                    >
                      Today
                    </button>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => navigateCalendar('prev')}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => navigateCalendar('next')}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Tabs */}
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 rounded-full p-1">
                    {(['day', 'week', 'month'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setCurrentView(view)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          currentView === view
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                    Filter
                  </button>
                  
                  <button 
                    onClick={() => setShowAddEventModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Schedule
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                  <div className="p-3 text-sm text-gray-500 font-medium border-r border-gray-200">
                    All Day
                  </div>
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 ${
                        day === 'Tuesday, 5' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {day === 'Tuesday, 5' && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                        <span className="truncate">{day}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 min-w-[600px]">
                    {/* Time column */}
                    <div className="border-r border-gray-200">
                      {timeSlots.map((time, index) => (
                        <div key={index} className="h-16 border-b border-gray-100 flex items-center justify-end pr-3">
                          <span className="text-xs text-gray-500">{time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Day columns */}
                    {days.map((day, dayIndex) => (
                      <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
                        {timeSlots.map((_, timeIndex) => (
                          <div key={timeIndex} className="h-16 border-b border-gray-100 relative">
                            {/* Events for this time slot */}
                            {events
                              .filter(event => event.day === day && event.timeSlot === timeSlots[timeIndex])
                              .map(event => (
                                <div
                                  key={event.id}
                                  className="absolute inset-1 rounded-lg p-2 text-xs"
                                  style={{ backgroundColor: event.backgroundColor }}
                                >
                                  <div className="font-medium text-gray-900 truncate">{event.title}</div>
                                  <div className="text-gray-600 text-xs">{event.time}</div>
                                  {event.users > 1 && (
                                    <div className="text-xs text-gray-500 mt-1">+{event.users - 1} more</div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Task Sidebar */}
            <div className="w-80 bg-white shadow-sm border-l border-gray-200 h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Task Lists */}
                <div className="space-y-6">
                  {Object.entries(tasks).map(([category, taskList]) => (
                    <div key={category} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getTaskProgress(category)}
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {taskList.map((task) => (
                          <div key={task.id} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(category, task.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.name}
                            </span>
                            <button 
                              onClick={() => deleteTask(category, task.id)}
                              className="ml-auto text-red-500 hover:text-red-700 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => {
                          const taskName = prompt('Enter task name:');
                          if (taskName) addTask(category, taskName);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add Task
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-semibold text-gray-900">ACADSYNC</h1>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4">
              {/* Mini Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">October 2027</h2>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => navigateCalendar('prev')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => navigateCalendar('next')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center text-xs text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index - 6;
                    const isCurrentMonth = day > 0 && day <= 31;
                    const isToday = day === 5;
                    const isSelected = day === 5;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(new Date(2027, 9, day))}
                        className={`w-8 h-8 text-xs rounded-full flex items-center justify-center ${
                          isToday ? 'bg-blue-600 text-white' :
                          isSelected ? 'bg-blue-100 text-blue-600' :
                          isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' :
                          'text-gray-400'
                        }`}
                      >
                        {isCurrentMonth ? day : day <= 0 ? day + 31 : day - 31}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* My Calendars */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">My Calendars</h3>
                </div>
                  <div className="space-y-2">
                    {Object.entries(filteredCalendars).map(([name, checked]) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCalendarFilter(name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{name}</span>
                      </label>
                    ))}
                    {customCalendars.map((calendar) => (
                      <label key={calendar} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filteredCalendars[calendar] || false}
                          onChange={() => toggleCalendarFilter(calendar)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{calendar}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    onClick={addNewCalendar}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add New
                  </button>
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
                </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Work', color: '#1d62f0' },
                      { name: 'Education', color: '#a644ff' },
                      { name: 'Personal', color: '#ff9500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                    ))}
                    {customCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={addNewCategory}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add New
                  </button>
              </div>
            </div>
          </div>

          {/* Mobile Calendar View */}
          <div className="p-4">
            {/* Month Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">October 2027</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goToToday}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    Today
                  </button>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => navigateCalendar('prev')}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => navigateCalendar('next')}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex bg-gray-100 rounded-full p-1 mb-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                  Day
                </button>
                <button className="px-4 py-2 text-gray-600 text-sm">
                  Week
                </button>
                <button className="px-4 py-2 text-gray-600 text-sm">
                  Month
                </button>
              </div>

              {/* Filter and Add Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilterModal(true)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filter
                </button>
                <button 
                  onClick={() => setShowAddEventModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </button>
              </div>
            </div>

            {/* Mobile Calendar Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
                <div className="p-3 text-sm text-gray-500 font-medium border-r border-gray-200">
                  All Day
                </div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div
                    key={index}
                    className={`p-3 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 ${
                      index === 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-0 min-w-[600px]">
                  {/* Time column */}
                  <div className="border-r border-gray-200">
                    {timeSlots.map((time, index) => (
                      <div key={index} className="h-16 border-b border-gray-100 flex items-center justify-end pr-3">
                        <span className="text-xs text-gray-500">{time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  {Array.from({ length: 6 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
                      {timeSlots.map((_, timeIndex) => (
                        <div key={timeIndex} className="h-16 border-b border-gray-100 relative">
                          {/* Sample events */}
                          {dayIndex === 0 && timeIndex === 2 && (
                            <div className="absolute inset-1 rounded-lg p-2 text-xs bg-blue-100">
                              <div className="font-medium text-gray-900 truncate">Go to clinic</div>
                              <div className="text-gray-600 text-xs">10:20 AM - 12:30 PM</div>
                            </div>
                          )}
                          {dayIndex === 1 && timeIndex === 0 && (
                            <div className="absolute inset-1 rounded-lg p-2 text-xs bg-purple-100">
                              <div className="font-medium text-gray-900 truncate">Meeting</div>
                              <div className="text-gray-600 text-xs">7:45 - 9 AM</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Task Summary */}
            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
                <div className="text-sm text-gray-500">6/15</div>
              </div>
              <div className="space-y-2">
                {tasks['Office'].slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask('Office', task.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Events</h3>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Calendar Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">My Calendars</h4>
                  <div className="space-y-2">
                    {Object.entries(filteredCalendars).map(([name, checked]) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCalendarFilter(name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {Object.entries(filteredCategories).map(([name, checked]) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategoryFilter(name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ 
                              backgroundColor: name === 'Work' ? '#1d62f0' : 
                                             name === 'Education' ? '#a644ff' : '#ff9500' 
                            }}
                          />
                          <span className="text-sm text-gray-700">{name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 mt-6">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Event</h3>
                <button 
                  onClick={() => setShowAddEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Work</option>
                    <option>Education</option>
                    <option>Personal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event description"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddEventModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
