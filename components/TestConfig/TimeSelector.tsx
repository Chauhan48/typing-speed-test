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
      <label className="text-sm font-medium text-gray-700">
        Duration
      </label>

      <div className="flex gap-2 mt-2">
        {times.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onTimeChange(time)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex-1 rounded-lg border shadow-sm
              ${
                selectedTime === time
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:text-gray-900 hover:bg-gray-50'
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