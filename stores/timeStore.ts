import { create } from 'zustand';

interface TimeState {
  selectedTime: number;
  setSelectedTime: (time: number) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  selectedTime: 30, // default 30 seconds
  setSelectedTime: (time: number) => set({ selectedTime: time }),
}));
