import React from 'react';
import { Participant } from '../../types';

interface CalendarDayProps {
  day: Date;
  isCurrentMonth: boolean;
  participantsOnDate: string[];
  allParticipants: Participant[];
  onDateSelect: (date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isCurrentMonth, participantsOnDate, allParticipants, onDateSelect }) => {
  const { format } = (window as any).dateFns;
  const count = participantsOnDate.length;

  const baseClasses = "relative w-full h-24 p-2 border rounded-md transition-colors duration-200 flex flex-col justify-start items-start";
  const monthClasses = isCurrentMonth ? "bg-white hover:bg-indigo-50" : "bg-gray-100 text-gray-400";
  const selectedClasses = count > 0 ? "border-indigo-300" : "border-gray-200";

  return (
    <button
      onClick={() => isCurrentMonth && onDateSelect(day)}
      className={`${baseClasses} ${monthClasses} ${selectedClasses}`}
      disabled={!isCurrentMonth}
    >
      <span className="font-medium">{format(day, 'd')}</span>
      {count > 0 && (
        <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
          {count}
        </div>
      )}
      <div className="flex flex-wrap mt-auto">
        {participantsOnDate.map(participantId => {
          const participant = allParticipants.find(p => p.id === participantId);
          if (!participant) return null;
          return (
            <div
              key={participant.id}
              style={{ backgroundColor: participant.color }}
              className="w-3 h-3 rounded-full mr-1 mb-1"
              title={participant.name}
            ></div>
          );
        })}
      </div>
    </button>
  );
};

export default CalendarDay;