
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; 
}

export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  voters: string[];
}

export interface Schedule {
  id: string; 
  password: string;
  participants: Participant[];
  selectedDates: { [date: string]: string[] };
  timeSlots: TimeSlot[];
  createdBy: string; // user id
}
