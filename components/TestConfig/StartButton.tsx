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
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
        }`}
    >
      {disabled ? 'Configure Test First' : 'Start Test'}
    </button>
  );
};

export default StartButton;