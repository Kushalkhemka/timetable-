import { useState, useCallback } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  backgroundColor: string;
  height: number;
  position: string;
  users: number;
  date: Date;
  category: string;
}

export interface CalendarFilters {
  categories: string[];
  showCompleted: boolean;
}

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2027, 9, 5)); // October 5, 2027
  const [selectedDate, setSelectedDate] = useState(new Date(2027, 9, 5));
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [filters, setFilters] = useState<CalendarFilters>({
    categories: ['Work', 'Education', 'Personal'],
    showCompleted: true
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Go to clinic for checkup',
      time: '10:20 AM - 12:30 PM',
      backgroundColor: '#EAF1FF',
      height: 290,
      position: 'left-[129px] top-[413px]',
      users: 1,
      date: new Date(2027, 9, 6),
      category: 'Personal'
    },
    {
      id: '2',
      title: 'Meeting with Team',
      time: '7:45 - 9 AM',
      backgroundColor: '#F1EAFC',
      height: 160,
      position: 'left-[322px] top-[110px]',
      users: 9,
      date: new Date(2027, 9, 5),
      category: 'Work'
    },
    {
      id: '3',
      title: 'Book Discussion',
      time: '9:30 - 10:30 AM',
      backgroundColor: '#DCF8E1',
      height: 124,
      position: 'left-[322px] top-[333px]',
      users: 2,
      date: new Date(2027, 9, 5),
      category: 'Education'
    },
    {
      id: '4',
      title: 'Restore Inner Power',
      time: '12 - 3 PM',
      backgroundColor: '#FFD5DD',
      height: 346,
      position: 'left-[516px] top-[643px]',
      users: 1,
      date: new Date(2027, 9, 7),
      category: 'Personal'
    },
    {
      id: '5',
      title: 'Brief for reference, color, style',
      time: '10 - 12 PM',
      backgroundColor: '#FFE9CB',
      height: 225,
      position: 'left-[709px] top-[401px]',
      users: 5,
      date: new Date(2027, 9, 8),
      category: 'Work'
    },
    {
      id: '6',
      title: 'Breakfast at Oka\'s House',
      time: '8 - 19:45 PM',
      backgroundColor: '#DEF4FE',
      height: 180,
      position: 'left-[902px] top-[179px]',
      users: 1,
      date: new Date(2027, 9, 9),
      category: 'Personal'
    }
  ]);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  }, []);

  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'day') {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  }, [view]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<CalendarFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const filteredEvents = events.filter(event => 
    filters.categories.includes(event.category)
  );

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    events: filteredEvents,
    filters,
    addEvent,
    deleteEvent,
    updateEvent,
    navigateDate,
    goToToday,
    updateFilters
  };
};
