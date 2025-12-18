import React from 'react';
import { PixelPerfectTopBar } from './PixelPerfectTopBar';
import { PixelPerfectCalendarSidebar } from './PixelPerfectCalendarSidebar';
import { PixelPerfectCalendarView } from './PixelPerfectCalendarView';
import { PixelPerfectTaskSidebar } from './PixelPerfectTaskSidebar';

export const PixelPerfectDashboard: React.FC = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
      />
      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <PixelPerfectTopBar />
          <div className="pt-24 flex">
            <PixelPerfectCalendarSidebar />
            <PixelPerfectCalendarView />
            <PixelPerfectTaskSidebar />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="font-['Poppins:SemiBold',_sans-serif] text-[20px] text-black">
                Calendar
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5-5 5-5h5v5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Calendar View */}
          <div className="p-4">
            {/* Month Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-['Poppins:Medium',_sans-serif] text-[24px] text-black">
                  October 2027
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-100 rounded-full text-sm">
                    Today
                  </button>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
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
                <button className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filter
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2">
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
                    {['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'].map((time, index) => (
                      <div key={index} className="h-16 border-b border-gray-100 flex items-center justify-end pr-3">
                        <span className="text-xs text-gray-500">{time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  {Array.from({ length: 6 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
                      {Array.from({ length: 8 }).map((_, timeIndex) => (
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
                <div className="font-['Poppins:Medium',_sans-serif] text-[18px] text-black">
                  My Tasks
                </div>
                <div className="text-sm text-gray-500">6/15</div>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Meeting with Clients', completed: true },
                  { name: 'Create an adaptive UI', completed: false },
                  { name: 'Design & wireframe for iOS', completed: false }
                ].map((task, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      {task.completed && (
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                      {task.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
