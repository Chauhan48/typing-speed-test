'use client';

import { TestMode } from '@/stores/testStore';

interface ModeSelectorProps {
  selectedMode: TestMode;
  onModeChange: (mode: TestMode) => void;
}

const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  const modes: TestMode[] = ['Letters Only', 'Letters + Numbers', 'All Symbols'];

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        Complexity
      </label>
      <div className="flex gap-2 mt-2">
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className={`px-2 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 rounded-lg border shadow-sm
              ${
                selectedMode === mode
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;