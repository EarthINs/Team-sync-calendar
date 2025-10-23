
import React, { useState, useContext } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Schedule } from '../../types';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { getRandomColor } from '../../utils/color';

interface ScheduleAccessPageProps {
  onScheduleLoaded: (schedule: Schedule) => void;
}

const ScheduleAccessPage: React.FC<ScheduleAccessPageProps> = ({ onScheduleLoaded }) => {
    const [scheduleName, setScheduleName] = useState('');
    const [schedulePassword, setSchedulePassword] = useState('');
    const [joinScheduleName, setJoinScheduleName] = useState('');
    const [joinSchedulePassword, setJoinSchedulePassword] = useState('');
    const [error, setError] = useState('');
    const [joinError, setJoinError] = useState('');
    
    const auth = useContext(AuthContext) as AuthContextType;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!auth.currentUser) {
            setError('You must be logged in to create a schedule.');
            return;
        }

        const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
        if (schedules.some(s => s.id.toLowerCase() === scheduleName.toLowerCase())) {
            setError('A schedule with this name already exists.');
            return;
        }

        const newSchedule: Schedule = {
            id: scheduleName,
            password: schedulePassword,
            createdBy: auth.currentUser.id,
            participants: [{
                id: auth.currentUser.id,
                name: auth.currentUser.name,
                color: getRandomColor([]),
            }],
            selectedDates: {},
            timeSlots: [],
        };

        schedules.push(newSchedule);
        localStorage.setItem('schedules', JSON.stringify(schedules));
        onScheduleLoaded(newSchedule);
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError('');
        if (!auth.currentUser) {
            setJoinError('You must be logged in to join a schedule.');
            return;
        }

        const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
        const schedule = schedules.find(s => s.id.toLowerCase() === joinScheduleName.toLowerCase());

        if (!schedule || schedule.password !== joinSchedulePassword) {
            setJoinError('Invalid schedule name or password.');
            return;
        }

        // Add current user as participant if not already in
        if (!schedule.participants.some(p => p.id === auth.currentUser!.id)) {
            const existingColors = schedule.participants.map(p => p.color);
            schedule.participants.push({
                id: auth.currentUser!.id,
                name: auth.currentUser!.name,
                color: getRandomColor(existingColors),
            });
            localStorage.setItem('schedules', JSON.stringify(schedules));
        }

        onScheduleLoaded(schedule);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
            {/* Create Schedule Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create New Schedule</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleCreate} className="space-y-6">
                    <Input label="Schedule Name" id="create-name" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} required />
                    <Input label="Password" id="create-password" type="password" value={schedulePassword} onChange={(e) => setSchedulePassword(e.target.value)} required />
                    <Button type="submit">Create Schedule</Button>
                </form>
            </div>

            {/* Join Schedule Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join Existing Schedule</h2>
                {joinError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{joinError}</p>}
                <form onSubmit={handleJoin} className="space-y-6">
                    <Input label="Schedule Name" id="join-name" value={joinScheduleName} onChange={(e) => setJoinScheduleName(e.target.value)} required />
                    <Input label="Password" id="join-password" type="password" value={joinSchedulePassword} onChange={(e) => setJoinSchedulePassword(e.target.value)} required />
                    <Button type="submit">Join Schedule</Button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleAccessPage;
