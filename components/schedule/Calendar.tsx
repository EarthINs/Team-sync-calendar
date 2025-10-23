import React, { useState, useEffect } from 'react';
import { Participant } from '../../types';
import CalendarDay from './CalendarDay';

interface CalendarProps {
  selectedDates: { [date: string]: string[] };
  onDateSelect: (date: Date) => void;
  participants: Participant[];
}

const CalendarMonth: React.FC<{ month: Date } & CalendarProps> = ({ month, selectedDates, onDateSelect, participants }) => {
  const { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth } = (window as any).dateFns;

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <h3 className="text-xl font-semibold text-center mb-4">{format(monthStart, 'MMMM yyyy')}</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {weekdays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map(day => (
          <CalendarDay
            key={day.toString()}
            day={day}
            isCurrentMonth={isSameMonth(day, monthStart)}
            participantsOnDate={selectedDates[format(day, 'yyyy-MM-dd')] || []}
            allParticipants={participants}
            onDateSelect={onDateSelect}
          />
        ))}
      </div>
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = (props) => {
  const [isDateFnsLoaded, setIsDateFnsLoaded] = useState(!!(window as any).dateFns);

  useEffect(() => {
    if (isDateFnsLoaded) return;

    const checkInterval = setInterval(() => {
      if ((window as any).dateFns) {
        setIsDateFnsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [isDateFnsLoaded]);

  if (!isDateFnsLoaded) {
    return <div className="text-center p-8 text-gray-500">Loading Calendar...</div>;
  }
  
  const { addMonths } = (window as any).dateFns;
  const today = new Date();
  const nextMonth = addMonths(today, 1);
  const monthAfterNext = addMonths(today, 2);

  return (
    <div className="space-y-8">
      <CalendarMonth month={today} {...props} />
      <CalendarMonth month={nextMonth} {...props} />
      <CalendarMonth month={monthAfterNext} {...props} />
    </div>
  );
};

export default Calendar;