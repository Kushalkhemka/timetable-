import React from 'react';

export const CalendarView: React.FC = () => {
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

  return (
    <main className="flex-1 ml-80 lg:ml-80 md:ml-72 sm:ml-0 p-4 sm:p-2 min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 mb-4 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl lg:text-2xl font-medium text-black">
              October 2027
            </h1>
            
            {/* Today Navigation */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border bg-gray-50 rounded-full border-gray-200 hover:bg-gray-100 transition-colors text-sm">
                Today
              </button>
              
              <button className="w-8 h-8 border bg-gray-50 rounded-full border-gray-200 hover:bg-gray-100 transition-colors">
                <svg width="12" height="8" viewBox="0 0 12 8" className="mx-auto">
                  <path fillRule="evenodd" clipRule="evenodd" d="M107 16.1538L103.25 20L107 23.8462L105.875 25L101 20L105.875 15L107 16.1538Z" fill="#8A8A8F" />
                </svg>
              </button>
              
              <button className="w-8 h-8 border bg-gray-50 rounded-full border-gray-200 hover:bg-gray-100 transition-colors">
                <svg width="12" height="8" viewBox="0 0 12 8" className="mx-auto">
                  <path fillRule="evenodd" clipRule="evenodd" d="M141 16.1538L142.125 15L147 20L142.125 25L141 23.8462L144.75 20L141 16.1538Z" fill="#8A8A8F" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Tabs */}
            <div className="flex bg-gray-50 rounded-full border border-gray-200 p-1">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-normal">
                Day
              </button>
              <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors text-sm font-normal">
                Week
              </button>
              <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors text-sm font-normal">
                Month
              </button>
            </div>
            
            {/* Filter */}
            <button className="px-4 py-2 border bg-gray-50 rounded-full border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 20 18">
                <path fillRule="evenodd" clipRule="evenodd" d="M17 2C17.551 2 18 2.448 18 3C18 3.552 17.551 4 17 4C16.449 4 16 3.552 16 3C16 2.448 16.449 2 17 2M17 6C18.654 6 20 4.654 20 3C20 1.346 18.654 0 17 0C15.698 0 14.599 0.838 14.185 2H0V4H14.185C14.599 5.162 15.698 6 17 6M7 10C6.449 10 6 9.552 6 9C6 8.448 6.449 8 7 8C7.551 8 8 8.448 8 9C8 9.552 7.551 10 7 10M7 6C5.698 6 4.599 6.838 4.185 8H0V10H4.185C4.599 11.162 5.698 12 7 12C8.302 12 9.401 11.162 9.815 10H20V8H9.815C9.401 6.838 8.302 6 7 6M17 16C16.449 16 16 15.552 16 15C16 14.448 16.449 14 17 14C17.551 14 18 14.448 18 15C18 15.552 17.551 16 17 16M17 12C15.698 12 14.599 12.838 14.185 14H0V16H14.185C14.599 17.162 15.698 18 17 18C18.654 18 20 16.654 20 15C20 13.346 18.654 12 17 12" fill="#8A8A8F" />
              </svg>
              <span className="text-sm">Filter</span>
            </button>
            
            {/* Grid/List Toggle */}
            <div className="flex border bg-gray-50 rounded-full border-gray-200 p-1">
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 17">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.01363 1.41776C1.64427 1.41776 1.34194 1.73533 1.34194 2.12665C1.34194 2.51646 1.64285 2.83553 2.01363 2.83553C2.38441 2.83553 2.68531 2.51796 2.68531 2.12665C2.68389 1.73533 2.38298 1.41776 2.01363 1.41776Z" fill="black" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <svg width="16" height="16" viewBox="0 0 18 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.63636 7.5V1.66667H4.90909V3.33333H6.54627V7.5H1.63636Z" fill="#8A8A8F" />
                </svg>
              </button>
            </div>
            
            {/* Add Schedule */}
            <button className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 6C12 5.44772 11.5523 5 11 5H7V1C7 0.447715 6.55228 0 6 0V0C5.44772 0 5 0.447715 5 1V5H1C0.447715 5 0 5.44772 0 6V6C0 6.55228 0.447715 7 1 7H5V11C5 11.5523 5.44772 12 6 12V12C6.55228 12 7 11.5523 7 11V7H11C11.5523 7 12 6.55228 12 6V6Z" fill="white" />
              </svg>
              <span className="text-white text-sm">Add Schedule</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Calendar Container - Centered and Responsive */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Day Headers */}
          <div className="border-b border-gray-200 bg-white">
            <div className="grid grid-cols-7 gap-0 min-w-[600px]">
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
          </div>
          
          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-0 min-w-[600px]">
              {/* Time column */}
              <div className="border-r border-gray-200">
                {timeSlots.map((time, index) => (
                  <div key={index} className="h-16 sm:h-20 lg:h-24 border-b border-gray-100 flex items-center justify-end pr-3">
                    <span className="text-xs sm:text-sm text-gray-500">{time}</span>
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="h-16 sm:h-20 lg:h-24 border-b border-gray-100 relative">
                      {/* Events for this time slot */}
                      {events
                        .filter(event => event.day === day && event.timeSlot === time)
                        .map(event => (
                          <div
                            key={event.id}
                            className="absolute inset-1 rounded-lg p-2 text-xs sm:text-sm"
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
    </main>
  );
};
