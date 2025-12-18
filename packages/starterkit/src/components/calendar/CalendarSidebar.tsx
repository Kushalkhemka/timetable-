import React, { useState } from 'react';
import { MiniCalendar } from './MiniCalendar';
import { CategoryList } from './CategoryList';

export const CalendarSidebar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2027, 9, 5));

  const myCalendars = [
    { id: '1', name: 'My Schedules', checked: true, type: 'checkbox' as const },
    { id: '2', name: 'Task and Events', checked: true, type: 'checkbox' as const },
    { id: '3', name: 'Projects', checked: false, type: 'checkbox' as const },
    { id: '4', name: 'Holidays', checked: false, type: 'checkbox' as const },
  ];

  const categoryColors = [
    { id: '1', name: 'Work', color: '#1D62F0', type: 'dot' as const },
    { id: '2', name: 'Education', color: '#A644FF', type: 'dot' as const },
    { id: '3', name: 'Personal', color: '#FF9500', type: 'dot' as const },
  ];

  const others = [
    { id: '1', name: 'Birthday', checked: true, type: 'checkbox' as const },
    { id: '2', name: 'Fitness', checked: false, type: 'checkbox' as const },
    { id: '3', name: 'Camping', checked: false, type: 'checkbox' as const },
  ];

  const handleCalendarToggle = (id: string) => {
    console.log('Toggle calendar:', id);
  };

  const handleCategoryToggle = (id: string) => {
    console.log('Toggle category:', id);
  };

  const handleOthersToggle = (id: string) => {
    console.log('Toggle others:', id);
  };

  const handleAddNew = (type: string) => {
    console.log('Add new:', type);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <aside className="w-80 h-full bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto z-10 lg:block md:block sm:hidden">
      <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
        <MiniCalendar 
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
        
        <CategoryList
          title="My Calendars"
          items={myCalendars}
          onItemToggle={handleCalendarToggle}
          onAddNew={() => handleAddNew('calendar')}
        />
        
        <CategoryList
          title="Categories"
          items={categoryColors}
          onItemToggle={handleCategoryToggle}
          onAddNew={() => handleAddNew('category')}
        />
        
        <CategoryList
          title="Others"
          items={others}
          onItemToggle={handleOthersToggle}
          onAddNew={() => handleAddNew('others')}
        />
      </div>
    </aside>
  );
};
