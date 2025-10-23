
import React from 'react';
import { Participant } from '../../types';

interface ParticipantListProps {
  participants: Participant[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Participants ({participants.length})</h3>
      <ul className="space-y-2">
        {participants.map(p => (
          <li key={p.id} className="flex items-center">
            <span
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: p.color }}
            ></span>
            <span>{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantList;
