import React from 'react';

interface CalendarEventProps {
  title: string;
  time: string;
  backgroundColor: string;
  users?: number;
  className?: string;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  title,
  time,
  backgroundColor,
  users = 1,
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-1 rounded-lg p-2 text-xs sm:text-sm ${className}`}
      style={{ backgroundColor }}
    >
      <div className="font-medium text-gray-900 truncate">{title}</div>
      <div className="text-gray-600 text-xs">{time}</div>
      {users > 1 && (
        <div className="text-xs text-gray-500 mt-1">+{users - 1} more</div>
      )}
    </div>
  );
};
