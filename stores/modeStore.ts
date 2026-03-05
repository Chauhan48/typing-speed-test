import { create } from 'zustand';

interface ModeState {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  selectedMode: 'Letters Only', // default mode
  setSelectedMode: (mode: string) => set({ selectedMode: mode }),
}));