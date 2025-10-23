
import React, { useState, useEffect, useContext } from 'react';
import { Schedule, Participant, TimeSlot } from '../../types';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import Calendar from './Calendar';
import ParticipantList from './ParticipantList';
import TimeVoting from './TimeVoting';
import { getRandomColor } from '../../utils/color';

interface ScheduleViewPageProps {
  schedule: Schedule;
  onBack: () => void;
}

const ScheduleViewPage: React.FC<ScheduleViewPageProps> = ({ schedule, onBack }) => {
    const [currentSchedule, setCurrentSchedule] = useState<Schedule>(schedule);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newParticipantName, setNewParticipantName] = useState('');
    const { currentUser } = useContext(AuthContext) as AuthContextType;

    useEffect(() => {
        const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
        const updatedSchedules = schedules.map(s => s.id === currentSchedule.id ? currentSchedule : s);
        localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
    }, [currentSchedule]);

    const handleDateSelect = (date: Date) => {
        if (!currentUser) return;

        const dateString = date.toISOString().split('T')[0];
        const newSelectedDates = { ...currentSchedule.selectedDates };
        const participantsOnDate = newSelectedDates[dateString] || [];

        if (participantsOnDate.includes(currentUser.id)) {
            newSelectedDates[dateString] = participantsOnDate.filter(id => id !== currentUser.id);
        } else {
            newSelectedDates[dateString] = [...participantsOnDate, currentUser.id];
        }

        setCurrentSchedule(prev => ({ ...prev, selectedDates: newSelectedDates }));
    };

    const handleAddParticipant = () => {
        if (!newParticipantName.trim()) return;

        const existingColors = currentSchedule.participants.map(p => p.color);
        const newParticipant: Participant = {
            id: `guest_${Date.now()}`,
            name: newParticipantName,
            color: getRandomColor(existingColors),
        };

        setCurrentSchedule(prev => ({ ...prev, participants: [...prev.participants, newParticipant] }));
        setNewParticipantName('');
        setIsModalOpen(false);
    };

    const handleAddTimeSlot = (time: string) => {
        const newTimeSlot: TimeSlot = {
            id: Date.now().toString(),
            time,
            voters: [],
        };
        setCurrentSchedule(prev => ({ ...prev, timeSlots: [...prev.timeSlots, newTimeSlot] }));
    };
    
    const handleVoteForTime = (timeSlotId: string) => {
        if (!currentUser) return;
    
        const newTimeSlots = currentSchedule.timeSlots.map(slot => {
            if (slot.id === timeSlotId) {
                const voters = slot.voters || [];
                if (voters.includes(currentUser.id)) {
                    return { ...slot, voters: voters.filter(id => id !== currentUser.id) };
                } else {
                    return { ...slot, voters: [...voters, currentUser.id] };
                }
            }
            return slot;
        });
    
        setCurrentSchedule(prev => ({ ...prev, timeSlots: newTimeSlots }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{currentSchedule.id}</h2>
                    <p className="text-gray-500">Select your available dates and times.</p>
                </div>
                <Button onClick={onBack} variant="secondary">Back to Schedules</Button>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                    <Calendar
                        selectedDates={currentSchedule.selectedDates}
                        onDateSelect={handleDateSelect}
                        participants={currentSchedule.participants}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                         <ParticipantList participants={currentSchedule.participants} />
                         <div className="mt-4">
                            <Button onClick={() => setIsModalOpen(true)} variant="secondary">Add Participant</Button>
                         </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <TimeVoting 
                            timeSlots={currentSchedule.timeSlots}
                            onAddTime={handleAddTimeSlot}
                            onVote={handleVoteForTime}
                            participants={currentSchedule.participants}
                         />
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Participant">
                <div className="space-y-4">
                    <Input 
                        label="Participant Name"
                        id="participant-name"
                        value={newParticipantName}
                        onChange={(e) => setNewParticipantName(e.target.value)}
                        placeholder="e.g., Jane Doe"
                    />
                    <Button onClick={handleAddParticipant}>Add</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ScheduleViewPage;
