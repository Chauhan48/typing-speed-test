'use client';

import { useTimeStore } from '@/stores/timeStore';

const TimeSelector: React.FC = () => {
  const timeOptions: number[] = [30, 60, 120]; // Typed array
  const { selectedTime, setSelectedTime } = useTimeStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Time Limit</label>
      <div className="inline-flex rounded-lg border border-gray-200 shadow-sm bg-white">
        {timeOptions.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedTime(option)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 ${
              selectedTime === option
                ? 'bg-blue-500 text-white shadow-md'
                : index === 0
                ? 'rounded-l-lg'
                : index === timeOptions.length - 1
                ? 'rounded-r-lg'
                : ''
            } ${
              selectedTime !== option
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                : ''
            }`}
          >
            {option}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;
