'use client';

interface StartButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

const StartButton = ({ onStart, disabled = false }: StartButtonProps) => {
  return (
    <button
      onClick={onStart}
      disabled={disabled}
      className={`w-full px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-200
        ${disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
    >
      {disabled ? 'Configure Test First' : 'Start Test'}
    </button>
  );
};

export default StartButton;