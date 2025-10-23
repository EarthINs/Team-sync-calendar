
import React, { useState, useContext } from 'react';
import { TimeSlot, Participant } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';

interface TimeVotingProps {
  timeSlots: TimeSlot[];
  onAddTime: (time: string) => void;
  onVote: (timeSlotId: string) => void;
  participants: Participant[];
}

const TimeVoting: React.FC<TimeVotingProps> = ({ timeSlots, onAddTime, onVote, participants }) => {
  const [newTime, setNewTime] = useState('');
  const { currentUser } = useContext(AuthContext) as AuthContextType;

  const handleAddTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime) {
      onAddTime(newTime);
      setNewTime('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Suggested Times</h3>
      <form onSubmit={handleAddTime} className="flex items-center gap-2">
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="w-auto px-4 !py-2.5">Add</Button>
      </form>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {timeSlots.map(slot => (
          <div key={slot.id} className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">{slot.time}</span>
              <Button 
                variant={slot.voters.includes(currentUser?.id || '') ? 'primary' : 'secondary'} 
                onClick={() => onVote(slot.id)}
                className="w-auto px-4 !py-1 text-xs"
              >
                {slot.voters.includes(currentUser?.id || '') ? 'Voted' : 'Vote'} ({slot.voters.length})
              </Button>
            </div>
            <div className="flex flex-wrap mt-2">
              {slot.voters.map(voterId => {
                const participant = participants.find(p => p.id === voterId);
                return participant ? (
                  <div
                    key={voterId}
                    style={{ backgroundColor: participant.color }}
                    className="w-4 h-4 rounded-full mr-1"
                    title={participant.name}
                  ></div>
                ) : null;
              })}
            </div>
          </div>
        ))}
        {timeSlots.length === 0 && <p className="text-sm text-gray-500">No times suggested yet.</p>}
      </div>
    </div>
  );
};

export default TimeVoting;
