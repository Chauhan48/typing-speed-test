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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Complexity
      </label>
      <div className="flex gap-2">
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 whitespace-nowrap
              ${
                selectedMode === mode
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
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