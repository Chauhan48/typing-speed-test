'use client';

import { TestDuration } from '@/stores/testStore';

interface TimeSelectorProps {
  selectedTime: TestDuration;
  onTimeChange: (time: TestDuration) => void;
}

const TimeSelector = ({ selectedTime, onTimeChange }: TimeSelectorProps) => {
  const times: TestDuration[] = [15, 30, 60];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Duration
      </label>
      <div className="flex gap-2">
        {times.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onTimeChange(time)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${
                selectedTime === time
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }
            `}
          >
            {time}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;